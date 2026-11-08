# Personal Hub — Cloudflare Worker

Sorgente versionato del backend Personal Hub. Il deploy in produzione **non viene eseguito** da questo repository: il Worker attivo resta gestito da Cloudflare.

## File

- `worker.js`: handler Cloudflare Worker.
- `wrangler.example.toml`: configurazione dimostrativa, con ID KV segnaposto e nessun segreto.

## Responsabilità

- Verifica la sessione Supabase tramite `/auth/v1/user`.
- Autorizza esclusivamente l'ID configurato in `ALLOWED_USER_ID`.
- Gestisce il collegamento OAuth Google per lo scope YouTube in sola lettura.
- Conserva il refresh token Google e lo state OAuth in Cloudflare KV.
- Espone endpoint per stato connessione, playlist e contenuti playlist.
- Non restituisce token Google al browser.

## Endpoint attualmente implementati

| Metodo | Percorso | Scopo |
|---|---|---|
| GET | `/health` | Health check pubblico |
| GET | `/api/me` | Utente Supabase autenticato |
| GET | `/api/youtube/connect` | Avvio OAuth Google |
| GET | `/api/youtube/callback` | Callback OAuth Google |
| GET | `/api/youtube/status` | Stato connessione YouTube |
| GET | `/api/youtube/playlists` | Playlist dell'utente |
| GET | `/api/youtube/playlist-items` | Elementi di una playlist; richiede `playlistId` |
| POST | `/api/youtube/disconnect` | Revoca e rimozione credenziali locali |

Tutti gli endpoint API tranne `/health` e il callback OAuth richiedono una sessione Supabase valida e l'ID utente autorizzato.

## Variabili e binding Cloudflare

Impostare nel Worker, non in Git:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `ALLOWED_USER_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET` — **secret**
- `GOOGLE_REDIRECT_URI`
- Binding KV `HUB_KV`, associato al namespace `PERSONAL_HUB_KV`

Redirect URI OAuth atteso:

`https://personal-hub-api.marco-scatassi-99.workers.dev/api/youtube/callback`

L'origine frontend ammessa dal codice è:

`https://marco-scatassi.github.io`

Non inserire mai nel repository refresh token, client secret, token Supabase, service-role key o valori reali di configurazione sensibile.

## Note di sicurezza e limiti noti

Questa versione aggiunge PKCE S256 al flusso OAuth e verifica che la risposta token includa lo scope YouTube richiesto. La verifica della sessione Supabase viene effettuata lato server; CORS è una restrizione del browser, non un meccanismo di autenticazione.

**Non è una certificazione di sicurezza né una dichiarazione di assenza di vulnerabilità.** In particolare:

1. Cloudflare KV non fornisce un'operazione atomica di lettura-e-consumo dello state. La cancellazione dopo la lettura riduce la finestra di riuso ma non elimina una possibile race tra richieste concorrenti. Per una garanzia più forte serve un archivio con operazione atomica, ad esempio Durable Objects o D1 con vincolo/consumo transazionale.
2. Il callback OAuth non valida un ID token Google; il legame della richiesta al browser avviene tramite state e PKCE.
3. L'esito `youtube=connected` nella query string è solo un messaggio di interfaccia, non una prova di autenticazione. La dashboard deve interrogare `/api/youtube/status`.
4. L'accesso è limitato a un singolo ID utente tramite `ALLOWED_USER_ID`; la sicurezza dei dati Supabase dipende anche dalle policy RLS del database.
5. Prima di ampliare l'accesso o considerare il servizio pronto per produzione, servono test di sicurezza e revisione del flusso OAuth, gestione errori, limiti di frequenza e logging.

## Stato del progetto

Questa cartella documenta la baseline del Worker e costituisce il riferimento versionato per le modifiche future. La sincronizzazione cache con Supabase e gli endpoint di archivio non sono ancora implementati in questo Worker.
