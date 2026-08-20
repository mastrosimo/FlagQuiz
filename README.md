# 🚩 FlagQuiz

Quiz interattivo sulle bandiere del mondo. Metti alla prova la tua conoscenza geografica con diverse modalità di gioco, un sistema di punteggio, progressione a livelli, obiettivi sbloccabili e statistiche personali salvate localmente.

## Funzionalità

- **6 modalità di gioco**: Quiz classico, Modalità tempo, 50 bandiere, Tutte le bandiere, Paesi difficili, Modalità vite
- **Filtri**: difficoltà (facile/media/difficile) e continente
- **Generazione intelligente delle domande**: distrattori scelti tra bandiere simili, dello stesso continente o della stessa difficoltà, senza ripetizioni nella sessione
- **Punteggio dinamico**: bonus velocità e bonus serie di risposte corrette
- **Progressione**: XP, 5 livelli, obiettivi sbloccabili
- **Statistiche**: partite giocate, precisione, continente migliore/peggiore, grafico andamento
- **Pagina "Impara"**: esplora tutte le bandiere del database con ricerca e filtro per continente
- **Dark mode**, layout completamente responsive, animazioni con Framer Motion
- **Persistenza locale**: progressi, XP, obiettivi e impostazioni salvati in `localStorage`

## Stack tecnologico

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) (con persistenza)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [country-flag-icons](https://www.npmjs.com/package/country-flag-icons) per le bandiere SVG

## Getting started

```bash
npm install
npm run dev
```

Il sito sarà disponibile su `http://localhost:5173`.

### Script disponibili

| Comando           | Descrizione                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`     | Avvia il server di sviluppo               |
| `npm run build`   | Type-check e build di produzione in `dist/` |
| `npm run preview` | Serve la build di produzione localmente   |
| `npm run lint`    | Esegue oxlint sul codice sorgente         |

## Struttura del progetto

```
src/
  components/   componenti riutilizzabili (layout, quiz, feedback, common)
  pages/        una componente per ogni rotta
  data/         dataset paesi/bandiere, obiettivi, livelli, modalità
  hooks/        logica di gioco, tema, suoni
  store/        stato globale persistito (Zustand)
  utils/        generazione domande, punteggio, XP, obiettivi
  types/        tipi TypeScript condivisi
```

## Note

- I dati dei Paesi (~195 bandiere) sono basati sui codici ISO 3166-1 reali.
- Il progetto non ha backend: la classifica e i progressi sono gestiti localmente, ma lo store è strutturato per poter essere collegato a un'API in futuro senza modificare i componenti.
