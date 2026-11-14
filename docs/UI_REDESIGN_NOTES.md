# Revisione UI — leggibilità e Music

Data: 2026-11-14

## Portfolio e Personal

È stata aumentata la scala tipografica di hero, descrizioni, titoli di sezione, card e metadati. Le modifiche sono circoscritte alle classi delle due pagine e non cambiano contenuti, navigazione o comportamento applicativo.

Il dimensionamento resta fluido tramite `clamp()`. Su desktop con altezza ridotta sono previste regole dedicate per evitare che l'aumento della tipografia comprometta la composizione della prima schermata. Su mobile restano breakpoint specifici e le hero mantengono altezza naturale.

## Music

La pagina adotta una gerarchia editoriale più netta:
- titolo e descrizione sono allineati a sinistra, con maggiore dimensione e spazio;
- l'indice laterale è più leggibile e mantiene la trasformazione in navigazione orizzontale su mobile;
- il contenuto Instagram è trattato come momento in evidenza, non come una card generica: pannello blu notte, accento rosa, CTA ad alto contrasto e decorazione circolare discreta;
- le playlist conservano card, player, ricerca e azioni esistenti, con piccoli incrementi di leggibilità.

Non sono stati modificati markup, script, endpoint, autenticazione, caricamento playlist o logica del player.

## Verifiche e limiti

La modifica è CSS-only e circoscritta a `assets/css/design-system.css`, già incluso nelle pagine interessate. È stato verificato il contenuto della versione aggiornata su GitHub; non è stato eseguito un browser test, screenshot test o controllo del deploy GitHub Pages.

Prima di considerare conclusa la revisione visiva, verificare almeno 360, 390, 768 e 1440 px e un desktop basso (ad esempio 1366×768), controllando overflow, allineamento CTA Instagram, navigazione sticky e primo viewport di Portfolio/Personal.
