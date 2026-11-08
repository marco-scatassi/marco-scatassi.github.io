const ALLOWED_ORIGIN = "https://marco-scatassi.github.io";
const DASHBOARD_URL = `${ALLOWED_ORIGIN}/hub/dashboard.html`;
const YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.readonly";
const STATE_TTL_SECONDS = 600;

function jsonResponse(data, status, origin = ALLOWED_ORIGIN) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Vary": "Origin"
    }
  });
}

function redirectToDashboard(result) {
  const url = new URL(DASHBOARD_URL);
  url.searchParams.set("youtube", result);
  return Response.redirect(url.toString(), 302);
}

function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function createPkcePair() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const verifier = base64Url(bytes);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  );
  return { verifier, challenge: base64Url(new Uint8Array(digest)) };
}

async function authenticate(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY || !env.ALLOWED_USER_ID) {
    return { error: "Server configuration incomplete", status: 500 };
  }

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return { error: "Authentication required", status: 401 };
  }

  const token = authorization.slice(7).trim();
  if (!token) return { error: "Authentication required", status: 401 };

  try {
    const response = await fetch(
      `${env.SUPABASE_URL.replace(/\/+$/, "")}/auth/v1/user`,
      {
        headers: {
          apikey: env.SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) return { error: "Invalid or expired session", status: 401 };

    const user = await response.json();
    if (user.id !== env.ALLOWED_USER_ID) {
      return { error: "User not authorized", status: 403 };
    }
    return { user };
  } catch {
    return { error: "Authentication service unavailable", status: 502 };
  }
}

function googleConfigured(env) {
  return !!(
    env.GOOGLE_CLIENT_ID &&
    env.GOOGLE_CLIENT_SECRET &&
    env.GOOGLE_REDIRECT_URI &&
    env.HUB_KV
  );
}

async function getAccessToken(env, userId) {
  const refreshToken = await env.HUB_KV.get(`youtube:refresh:${userId}`);
  if (!refreshToken) return { error: "YouTube account not connected", status: 401 };

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    if (data.error === "invalid_grant") {
      await env.HUB_KV.delete(`youtube:refresh:${userId}`);
      return { error: "Google authorization expired. Reconnect YouTube.", status: 401 };
    }
    return { error: "Unable to refresh Google authorization", status: 502 };
  }
  return { accessToken: data.access_token };
}

async function youtubeRequest(env, userId, endpoint, params) {
  const auth = await getAccessToken(env, userId);
  if (auth.error) return auth;

  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${auth.accessToken}` }
  });
  const data = await response.json();

  if (!response.ok) {
    return {
      error: data.error?.message || "YouTube API request failed",
      status: 502
    };
  }
  return { data };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowedOrigin = origin === ALLOWED_ORIGIN;

    if (origin && !allowedOrigin) {
      return jsonResponse({ error: "Origin not allowed" }, 403);
    }

    if (request.method === "OPTIONS") {
      if (!allowedOrigin) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin"
        }
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/health" && request.method === "GET") {
      return jsonResponse({ status: "ok", service: "personal-hub-api" }, 200);
    }

    // Google redirects here without the Supabase Authorization header.
    if (path === "/api/youtube/callback" && request.method === "GET") {
      if (!googleConfigured(env)) return redirectToDashboard("configuration-error");

      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const googleError = url.searchParams.get("error");

      if (googleError) return redirectToDashboard("authorization-error");
      if (!code || !state || state.length > 200) {
        return redirectToDashboard("invalid-callback");
      }

      try {
        const stateKey = `youtube:state:${state}`;
        const stateData = await env.HUB_KV.get(stateKey);
        if (!stateData) return redirectToDashboard("invalid-state");

        // KV delete is not an atomic consume operation; see README security notes.
        await env.HUB_KV.delete(stateKey);
        const parsed = JSON.parse(stateData);

        if (
          parsed.userId !== env.ALLOWED_USER_ID ||
          typeof parsed.codeVerifier !== "string"
        ) {
          return redirectToDashboard("invalid-state");
        }

        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
            code_verifier: parsed.codeVerifier
          })
        });

        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok || !tokenData.access_token) {
          return redirectToDashboard("token-error");
        }

        const grantedScopes = (tokenData.scope || "").split(/\s+/);
        if (!grantedScopes.includes(YOUTUBE_SCOPE)) {
          return redirectToDashboard("scope-error");
        }

        if (tokenData.refresh_token) {
          await env.HUB_KV.put(
            `youtube:refresh:${parsed.userId}`,
            tokenData.refresh_token
          );
        } else {
          const existing = await env.HUB_KV.get(`youtube:refresh:${parsed.userId}`);
          if (!existing) return redirectToDashboard("missing-refresh-token");
        }

        return redirectToDashboard("connected");
      } catch {
        return redirectToDashboard("callback-error");
      }
    }

    const auth = await authenticate(request, env);
    if (auth.error) return jsonResponse({ error: auth.error }, auth.status);

    const userId = auth.user.id;

    if (path === "/api/me" && request.method === "GET") {
      return jsonResponse({
        authenticated: true,
        user: { id: auth.user.id, email: auth.user.email }
      }, 200);
    }

    if (path.startsWith("/api/youtube/") && !googleConfigured(env)) {
      return jsonResponse({ error: "Google YouTube configuration incomplete" }, 500);
    }

    if (path === "/api/youtube/connect" && request.method === "GET") {
      const state = `${crypto.randomUUID()}.${crypto.randomUUID()}`;
      const { verifier, challenge } = await createPkcePair();

      await env.HUB_KV.put(
        `youtube:state:${state}`,
        JSON.stringify({ userId, codeVerifier: verifier }),
        { expirationTtl: STATE_TTL_SECONDS }
      );

      const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      googleUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
      googleUrl.searchParams.set("redirect_uri", env.GOOGLE_REDIRECT_URI);
      googleUrl.searchParams.set("response_type", "code");
      googleUrl.searchParams.set("scope", YOUTUBE_SCOPE);
      googleUrl.searchParams.set("access_type", "offline");
      googleUrl.searchParams.set("prompt", "consent");
      googleUrl.searchParams.set("state", state);
      googleUrl.searchParams.set("code_challenge", challenge);
      googleUrl.searchParams.set("code_challenge_method", "S256");

      return jsonResponse({ authorizationUrl: googleUrl.toString() }, 200);
    }

    if (path === "/api/youtube/status" && request.method === "GET") {
      const refreshToken = await env.HUB_KV.get(`youtube:refresh:${userId}`);
      return jsonResponse({ connected: !!refreshToken }, 200);
    }

    if (path === "/api/youtube/playlists" && request.method === "GET") {
      const result = await youtubeRequest(env, userId, "playlists", {
        part: "snippet,contentDetails,status",
        mine: "true",
        maxResults: 50,
        pageToken: url.searchParams.get("pageToken")
      });
      if (result.error) return jsonResponse({ error: result.error }, result.status);
      return jsonResponse({
        items: result.data.items || [],
        nextPageToken: result.data.nextPageToken || null
      }, 200);
    }

    if (path === "/api/youtube/playlist-items" && request.method === "GET") {
      const playlistId = url.searchParams.get("playlistId");
      if (!playlistId || playlistId.length > 200) {
        return jsonResponse({ error: "A valid playlistId is required" }, 400);
      }

      const result = await youtubeRequest(env, userId, "playlistItems", {
        part: "snippet,contentDetails",
        playlistId,
        maxResults: 50,
        pageToken: url.searchParams.get("pageToken")
      });
      if (result.error) return jsonResponse({ error: result.error }, result.status);
      return jsonResponse({
        items: result.data.items || [],
        nextPageToken: result.data.nextPageToken || null
      }, 200);
    }

    if (path === "/api/youtube/disconnect" && request.method === "POST") {
      const key = `youtube:refresh:${userId}`;
      const refreshToken = await env.HUB_KV.get(key);

      if (refreshToken) {
        try {
          await fetch("https://oauth2.googleapis.com/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ token: refreshToken })
          });
        } catch {
          // Local credentials are deleted even if Google's revoke endpoint fails.
        }
      }

      await env.HUB_KV.delete(key);
      return jsonResponse({
        connected: false,
        message: "YouTube connection removed"
      }, 200);
    }

    return jsonResponse({ error: "Not found" }, 404);
  }
};
