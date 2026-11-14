# Personal Hub — Frontend & Visual Guidelines

Personal Hub è uno spazio personale composto da un'area professionale e da un'area personale, con pagine dedicate a musica, fotografie e diario.

Questo repository contiene il frontend statico pubblicato tramite GitHub Pages. Il progetto adotta HTML, CSS e JavaScript vanilla: nuove dipendenze o framework vanno introdotti solo quando risolvono un problema concreto.

## Direzione visiva

### Identità: cyberpunk, non minimalismo generico

L'identità cyberpunk è una scelta progettuale intenzionale e va mantenuta nel tempo. Il sito deve conservare un carattere tecnologico, digitale e personale, evitando sia l'estetica corporate anonima sia l'eccesso di effetti che compromette leggibilità e usabilità.

### Tema di base: light

Il tema light resta la scelta predefinita del Personal Hub. Non introdurre un passaggio generalizzato al dark theme: non è un requisito dell'identità cyberpunk e non deve essere considerato un'evoluzione automatica del design.

Elementi distintivi:
- superfici chiare, bianche o grigio ghiaccio, con testo principale blu notte o antracite;
- ciano elettrico come accento funzionale primario;
- rosa/fucsia come accento secondario, soprattutto nei gradienti;
- contrasti netti e gerarchie tipografiche leggibili;
- bordi sottili, ombre fredde, glow e gradienti usati con moderazione;
- glassmorphism dove valorizza la profondità e non riduce il contrasto;
- sezioni o componenti scuri ammessi come contrasto intenzionale, non come motivo per rendere dark l'intero sito;
- micro-animazioni con uno scopo, non movimento decorativo continuo.

Il cyberpunk deve emergere da palette, dettagli luminosi, composizione, tipografia e interazioni, non dall'obbligo di usare fondi neri.

Non trasformare tutte le pagine in copie della stessa schermata. La coerenza deve derivare da regole condivise, non dall'uniformità assoluta.

## Architettura dell'esperienza

Il sito ha due aree principali:

- **Portfolio professionale**: comunicazione chiara di competenze, esperienza, certificazioni, progetti e contatti. Deve essere la parte più ordinata e orientata al valore professionale.
- **Personal Hub**: spazio più esplorativo e immersivo, con accesso alle passioni e ai contenuti personali.

Pagine personali:
- Musica — identità più dinamica e audio-visuale.
- Nature / Memories — approccio fotografico ed editoriale; le immagini sono il contenuto principale.
- Journal — raccolta editoriale di note e riflessioni.

La home iniziale deve rendere immediata la scelta tra Portfolio e Personal. La metafora del chip USB e l'animazione verso le due aree fanno parte dell'identità e non vanno rimosse senza una motivazione progettuale forte.

## Design system condiviso

Il file `assets/css/design-system.css` è la fonte condivisa per i token visivi e per le primitive riutilizzabili. È caricato da Home, Portfolio, Personal, Music, Nature e Journal.

La direzione approvata è **light cyberpunk equilibrata**:
- superfici chiare e testo blu notte;
- ciano e rosa funzionali in tonalità leggibili;
- tonalità più luminose riservate a gradienti e decorazioni;
- glow, vetro e ombre contenuti, mai a scapito del contrasto.

I token condivisi usano il prefisso `--ph-` per evitare collisioni con le variabili locali già presenti nelle pagine. I principali gruppi sono:
- `--ph-color-*`: background, superfici, testo, bordi e accenti;
- `--ph-gradient-*` e `--ph-shadow-*`: gradienti e profondità;
- `--ph-radius-*`, `--ph-transition-*`: forme e movimento.

Le primitive `.ph-surface`, `.ph-glass`, `.ph-gradient-text`, `.ph-focusable` e `.ph-interactive` sono opt-in: non cambiano automaticamente componenti esistenti. Le pagine possono mantenere layout e identità specifici, ma i nuovi componenti dovrebbero usare questi token invece di introdurre nuovi valori arbitrari.

Durante la migrazione, sostituire gradualmente i valori duplicati con i token condivisi. Evitare una riscrittura massiva dei CSS inline: ogni pagina va verificata dopo l'adozione dei nuovi stili.

## Regole condivise di UI

### Colore e contrasto
- Mantenere il tema light come impostazione visiva predefinita.
- Usare superfici chiare e testo scuro ad alto contrasto; evitare di schiarire il testo solo per imitare un'interfaccia dark.
- Usare il ciano per azioni, stati attivi, focus e collegamenti funzionali.
- Usare rosa/fucsia come accento complementare, non come colore concorrente per ogni elemento.
- Riservare il giallo a evidenziazioni limitate.
- Verificare sempre il contrasto del testo, in particolare su superfici trasparenti, gradienti e immagini.
- Evitare testo piccolo e poco contrastato solo per ottenere un effetto futuristico.

### Tipografia e gerarchia
- Ogni pagina deve avere un titolo principale immediatamente riconoscibile.
- Titoli, sottotitoli, metadati e descrizioni devono avere gerarchie distinguibili.
- Evitare titoli forzati su una sola riga quando causano overflow o riducono eccessivamente il font sui dispositivi mobili.
- Dare priorità alla leggibilità rispetto a effetti tipografici o gradienti.

### Layout e componenti
- Mantenere coerenti spaziature, raggi degli angoli, bordi, ombre e stati interattivi.
- Le card devono chiarire cosa contengono e quale azione permettono.
- Quando il contenuto lo richiede, privilegiare copertine, anteprime e immagini reali rispetto a decorazioni astratte.
- Evitare pannelli, bordi e glow ridondanti: ogni livello visivo deve avere una funzione.
- Navbar e footer devono essere coerenti tra le pagine, pur rispettandone il contesto.

### Stati e interazioni
Ogni elemento interattivo deve rendere comprensibile il proprio comportamento:
- hover visibile ma non invadente;
- focus da tastiera chiaramente visibile;
- area cliccabile adeguata anche su touch;
- stato loading, errore, vuoto e successo quando applicabile;
- link esterni riconoscibili come tali;
- feedback dopo l'invio dei form;
- nessun autoplay audio/video.

Le card interamente cliccabili devono essere semanticamente e visivamente riconoscibili. Non affidare informazioni essenziali al solo hover.

### Animazioni
- Le animazioni devono guidare l'attenzione, spiegare una transizione o dare feedback.
- Evitare animazioni infinite o particellari troppo presenti.
- Rispettare `prefers-reduced-motion` in tutte le pagine.
- Evitare transizioni che rallentano la navigazione o nascondono contenuti.
- Non introdurre nuove animazioni se il problema reale riguarda contenuti, gerarchia o spaziatura.

## Linee guida per area

### Home
- Conservare la scelta chiara tra Portfolio e Personal.
- Mantenere la metafora del chip e la relativa animazione come elemento distintivo.
- Rendere esplicite le destinazioni anche tramite etichette testuali.
- Verificare titolo e CTA su viewport stretti, senza overflow orizzontale.

### Portfolio
- Mantenere un'estetica cyberpunk più controllata e professionale.
- Hero orientata a ruolo, competenze e valore offerto.
- Esperienze leggibili per ruolo, azienda, periodo e risultati.
- Distinguere competenze principali da strumenti secondari.
- Certificazioni presentate con gerarchia uniforme.
- Progetti corredati, dove possibile, da anteprima, problema affrontato, tecnologie e risultato.
- Contatti e form devono avere una CTA evidente e feedback di invio/errori.

### Personal
- Mantenere un tono più immersivo e personale rispetto al Portfolio.
- Le card devono avere immagini o copertine quando aggiungono contesto.
- Titolo, descrizione e azione devono essere immediatamente distinguibili.
- Conservare un collegamento chiaro alla home e all'area professionale.

### Music
- Conservare la personalità audio-visuale e gli elementi distintivi già presenti.
- Dare priorità alle copertine delle playlist e alle anteprime dei contenuti video.
- Distinguere i link YouTube da quelli YouTube Music.
- Prevedere feedback di caricamento, errore e assenza di contenuti.
- Non avviare audio o video automaticamente.

### Nature / Memories
- Lasciare alle fotografie il ruolo principale.
- Usare layout editoriali, didascalie e località quando disponibili.
- Valutare lightbox e navigazione tra immagini, mantenendo accessibilità da tastiera e touch.

### Journal
- Presentare gli articoli come contenuti editoriali: titolo, data, categoria, estratto e, se utile, immagine.
- Curare lo stato vuoto: deve sembrare una scelta intenzionale, non una pagina incompleta.

## Responsive e accessibilità

La presenza di media query non è una prova sufficiente di responsività. Ogni intervento significativo deve essere controllato almeno a queste larghezze:

- 360 px — smartphone piccolo;
- 390 px — smartphone comune;
- 768 px — tablet / viewport intermedio;
- 1440 px — desktop.

Controllare:
- assenza di overflow orizzontale;
- titoli, card, immagini e navigazione;
- dimensione delle aree touch;
- contrasto e leggibilità;
- focus visibile e ordine di navigazione da tastiera;
- etichette accessibili per controlli e form;
- comportamento con `prefers-reduced-motion: reduce`.

Quando possibile, verificare anche con zoom browser e navigazione senza mouse.

## Priorità di evoluzione grafica

L'ordine consigliato evita di investire tempo in decorazioni prima di aver sistemato struttura e contenuti.

1. **Fondamenta condivise** — definire e consolidare colori, tipografia, spaziature, radius, bordi, focus, hover e transizioni.
2. **Responsive e accessibilità** — correggere overflow, titoli, focus, contrasto e target touch.
3. **Qualità dei contenuti visivi** — anteprime dei progetti, card Personal, copertine playlist e gallerie.
4. **Stati e feedback** — loading, errori, stati vuoti e conferme dei form.
5. **Rifiniture** — micro-animazioni, icone e dettagli decorativi.

Non aggiungere effetti per aumentare artificialmente la complessità visiva. La qualità deve emergere da composizione, contenuti, tipografia e interazioni.

### Stato della migrazione

La migrazione dei token di palette è stata completata per tutte le sei pagine principali:
- `index.html` e `portfolio.html` usano i token condivisi per le palette locali; il Portfolio usa gli stessi token anche nella configurazione colori di Tailwind e per le ombre cyan/pink;
- `personal.html`, `personal/music.html`, `personal/nature.html` e `personal/journal.html` collegano background, testo e colori luminosi decorativi ai token condivisi;
- nelle pagine personali i colori cyan, pink e yellow più luminosi restano assegnati a glow, gradienti e decorazioni: non sono stati sostituiti con le tonalità funzionali più scure.

La migrazione riguarda i token di palette, non una riscrittura completa dei CSS: layout, componenti, trasparenze e dettagli specifici restano locali per preservare l'identità di ciascuna pagina.

### Primo controllo responsive statico

La revisione del markup e dei CSS ha rilevato due titoli con `whitespace-nowrap` che potevano forzare una riga troppo larga sui viewport stretti. La regola è stata rimossa dai titoli principali di Music e Journal, lasciando al testo la possibilità di andare a capo. Sono stati inoltre controllati viewport meta, breakpoint e supporto a `prefers-reduced-motion` nelle sei pagine.

Questo controllo è statico: non sostituisce una prova in browser a 360, 390, 768 e 1440 px. Restano da verificare visivamente overflow, dimensioni dei target touch, contrasto, focus da tastiera e stati interattivi. Non è stato eseguito un test browser né un controllo del sito pubblicato.


### Redesign immersivo della Home

La Home è stata ripensata come schermata d'ingresso full-screen, senza navbar, hero/titolo introduttivo e card contenitore. Portfolio e Personal sono presentati come due destinazioni all'interno di un'unica composizione: i chip USB diventano i protagonisti visivi, accompagnati da tipografia integrata, micro-etichette e accenti cromatici distinti (ciano e rosa). Il tema light cyberpunk, la metafora USB e l'accesso immediato alle due aree restano invariati.

L'interazione è affidata a due pulsanti semanticamente accessibili, con feedback hover/focus. Al clic la navigazione parte subito: il chip viene animato una sola volta nella pagina di destinazione, dalla posizione iniziale salvata fino alla sua posizione definitiva. Su smartphone la composizione diventa verticale; su viewport più bassi sono ridotte le dimensioni degli elementi. Il movimento rispetta `prefers-reduced-motion`, che mantiene la navigazione immediata.

La verifica eseguita in questa modifica è statica sul markup e sul CSS aggiornati in GitHub. Non è stato eseguito un test browser, una verifica visuale a 360/390/768/1440 px né un controllo del sito pubblicato. La precedente impostazione a card è superata da questo redesign.

### Transizione condivisa dei chip tra le pagine

La navigazione dalla Home usa la **Cross-document View Transitions API** del browser. Al clic viene assegnato un nome di transizione al chip selezionato e viene salvata in `sessionStorage` soltanto la destinazione. La pagina di arrivo assegna lo stesso nome al chip corrispondente: il browser crea così una coppia condivisa e interpola posizione e dimensioni tra i due documenti, invece di ricreare il movimento con coordinate calcolate e Web Animations API.

Il chip di destinazione resta visibile: non viene più applicata una regola `visibility:hidden` durante il caricamento e non viene più animato con `transform` sovrascrivendo le trasformazioni del layout. In Personal il chip continua a occupare il proprio spazio accanto al titolo “Esplora le mie Passioni”, come elemento flex separato; il layout del titolo non deve essere coperto dal chip.

Per evitare la doppia immagine, il gruppo della transizione isola il compositing e lo snapshot precedente viene escluso dal rendering: durante il movimento resta un solo chip visibile, quello della pagina di arrivo.

L'opt-in alla Cross-document View Transitions è intenzionalmente direzionale: Home mantiene l'abilitazione, mentre Personal e Portfolio la attivano soltanto quando arrivano da Home con una destinazione valida in `sessionStorage`. Di conseguenza, i link “Scelta iniziale” non avviano alcuna transizione: il chip scompare insieme alla pagina, come il resto del contenuto. Anche con `prefers-reduced-motion: reduce` l'opt-in non viene aggiunto. Nei browser non compatibili la navigazione resta immediata.

La verifica di questa modifica è statica sul codice aggiornato in GitHub. Non è stata eseguita una prova browser né una verifica visiva su desktop/mobile: fluidità effettiva, compatibilità del browser e assenza di sovrapposizioni devono essere confermate con test in browser.

## Metodo di modifica

Per ogni intervento grafico o funzionale frontend:

1. Individuare le pagine e i componenti coinvolti.
2. Verificare il comportamento esistente prima di modificarlo.
3. Definire il risultato visivo e funzionale atteso.
4. Preferire modifiche circoscritte e riutilizzabili.
5. Controllare desktop e viewport mobile.
6. Verificare tastiera, focus, contrasto e movimento ridotto.
7. Aggiornare questo README se cambia una regola condivisa o una decisione di design.
8. Non dichiarare test visivi o browser eseguiti se non sono stati effettivamente svolti.

## Relazione con il backend

Il frontend è ospitato nel repository pubblico `marco-scatassi.github.io`. Il backend è mantenuto nel repository privato `personal-hub-backend` e contiene Cloudflare Worker, API, integrazioni e migrazioni Supabase.

Questo README definisce le linee guida frontend e visuali. Per architettura, autenticazione, API, database, RLS, sicurezza e stato operativo fare riferimento ai documenti del backend:

- `docs/ARCHITECTURE.md`
- `docs/PROJECT_STATUS.md`
- `docs/TECHNICAL_DECISIONS.md`

Non inserire mai nel frontend segreti, token privati o credenziali server-side. Un commit frontend, un deploy del Worker e una migrazione Supabase sono operazioni distinte.

## Manutenzione di questo documento

Aggiornare il README quando:
- viene approvata una modifica all'identità visiva;
- vengono introdotti o modificati token di design condivisi;
- cambia la struttura delle aree o la navigazione;
- vengono definite nuove regole responsive o di accessibilità;
- una regola precedente viene superata.

Le preferenze estetiche non devono essere considerate immutabili: possono evolvere, ma ogni cambiamento deve essere intenzionale e coerente con l'identità cyberpunk del progetto.

Ultimo aggiornamento: 2026-11-12.


### Navigazione condivisa — prima fase

È stata introdotta una navigazione HTML semantica condivisa per Portfolio, Personal e le tre sezioni personali. Gli stili sono isolati in `assets/css/navigation.css`; la navigazione rimane leggibile su desktop e diventa una striscia orizzontale scorrevole su mobile, senza dipendere da JavaScript.

- Portfolio: collegamenti alle sezioni Esperienza, Competenze, Progetti e Contatti, con accesso a Personal e Home.
- Personal: accesso diretto a Musica, Memories e Journal, con ritorno a Portfolio e Home.
- Music, Nature e Journal: panoramica personale, sezioni sorelle e collegamenti alle aree principali; la pagina corrente è indicata con `aria-current`.
- La pagina Music mantiene il proprio indice interno; il suo offset sticky mobile è stato adeguato all'altezza della nuova navigazione.
- `assets/css/design-system.css` include ora token di spaziatura, tipografia monospaziata, altezza header e primitive opt-in per container, eyebrow, titoli, card e testo secondario.

La Home iniziale resta volutamente senza navbar per preservare la scelta immersiva Portfolio / Personal e la transizione dei chip USB.

Questa fase modifica solo presentazione e navigazione: non cambia API, autenticazione, sincronizzazioni, playlist o logica del player. I test eseguiti finora sono controlli statici sul markup e sui collegamenti; non è stato eseguito un test browser visuale né verificato il deploy GitHub Pages.


### Seconda fase — refresh Portfolio e Personal

Il refresh visuale è stato applicato a Portfolio e alla landing Personal tramite `assets/css/page-redesign.css`, mantenendo separati i layout e riutilizzando i token condivisi.

- Portfolio: hero più leggibile e proporzionata, CTA uniformi, ritratto valorizzato, gerarchia delle intestazioni, card, timeline, certificazioni, progetti e form rifiniti.
- Personal: hero editoriale, card delle tre aree più strutturate e differenziate per accento, spaziature e tipografia riviste.
- Navigazione: il chip Portfolio nella landing Personal usa ora l'accento ciano, coerente con il chip Portfolio.
- Ridotti gli effetti decorativi continui nella landing Personal; mantenuti i contenuti, i link, il form e le interazioni già presenti.

Il lavoro è esclusivamente frontend. Le verifiche effettuate sono statiche su markup, classi, collegamenti e caricamento dei fogli CSS. Non sono stati eseguiti test visuali browser né verifiche del deploy GitHub Pages.


### Correzione tipografica e uniformità navbar

Dopo il feedback sul refresh, sono stati ridimensionati i titoli principali e le intestazioni delle pagine Portfolio e Personal, con limiti più conservativi e regole di wrapping per evitare che il testo venga tagliato o esca dai contenitori, in particolare sui viewport stretti.

La navbar adotta ora un criterio uniforme senza icone: rimosse le sole icone presenti nei link Musica, Memories e Journal della landing Personal. Le icone nei contenuti e nelle card restano invariate.


### Hero a schermo intero e indicatore di scorrimento

Le hero di Portfolio e Personal sono state riorganizzate per mostrare i contenuti introduttivi completi nel primo viewport desktop, tenendo conto dell'altezza della navigazione. Sono stati compattati gli spazi verticali e ridimensionati gli elementi principali dove necessario.

Entrambe le pagine includono ora un indicatore esplicito e accessibile che porta alla prima sezione successiva:
- Portfolio: “Scorri per esplorare”, collegato a Esperienza.
- Personal: “Scopri cosa c'è più sotto”, collegato a I miei universi.

Su schermi piccoli le hero tornano a un'altezza naturale e l'indicatore resta nel flusso visivo senza sovrapporsi ai contenuti. L'animazione dell'indicatore rispetta `prefers-reduced-motion`.


### Ulteriore revisione delle hero

La hero Portfolio è stata ulteriormente compattata per il desktop: larghezza delle colonne, dimensioni del ritratto, titolo, descrizione, spazi e pulsanti sono ora dimensionati per lasciare più margine nel primo viewport, con una variante dedicata agli schermi desktop bassi.

Portfolio e Personal usano lo stesso indicatore grafico circolare con chevron, centrato e ancorato al bordo inferiore della hero. Sono state rimosse le etichette testuali e il separatore a tre barre della landing Personal, così l'invito allo scroll è uniforme e non compete con gli altri elementi.


### Allineamento inclinazione chip Portfolio

Il chip USB di arrivo nella hero Portfolio è inclinato di 18 gradi, come il chip presente nella hero Personal. Gli indicatori di scorrimento delle due pagine restano esclusivamente grafici; le etichette accessibili sono mantenute solo per gli screen reader.


### Revisione visuale Music

La pagina Music adotta un'impostazione editoriale audio-visuale più ordinata: hero dedicata, contenuto in evidenza separato dalle playlist e card dinamiche con player incorporato in primo piano. La navigazione interna laterale è stata alleggerita e le card playlist hanno gerarchia più chiara per player, titolo, numero di brani, accesso a YouTube Music e apertura dell'elenco.

La revisione è solo frontend e non modifica endpoint, payload, autenticazione o sincronizzazione. Sono stati mantenuti il caricamento differito del player, la selezione e riproduzione del brano nell'iframe, la ricerca nella lista, il link YouTube Music e gli stati di caricamento/errore. Gli stili sono isolati in `assets/css/music.css`.

Verifica eseguita: controlli statici su markup, classi aggiunte, riferimenti agli script e struttura CSS. Non è stato eseguito un test browser o una prova end-to-end con playlist reali; layout responsive e riproduzione devono essere verificati visivamente e funzionalmente dopo il commit.


### Correzione della prima revisione Music

La hero introduttiva non è più racchiusa in una card: mantiene titolo, descrizione e tag direttamente sul fondo pagina. La sezione del contenuto Instagram ha una composizione esplicita a due colonne su desktop e impilata su mobile, evitando che il pulsante venga compresso o sovrapposto.

Nelle card playlist, “Visualizza brani” ha recuperato una tipografia sans-serif e una gerarchia più vicine alla versione precedente. L'azione “Apri su YouTube Music” è affiancata al comando di apertura dell'elenco, allineata sul lato destro; sui viewport molto stretti può passare a una riga dedicata, sempre allineata a destra. Non sono stati modificati i flussi di caricamento playlist, player o ricerca.
