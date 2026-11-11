# Study Helper

A React and TypeScript study app, branded "fieldnotes" in the UI, for Microsoft certification practice questions. It has two multiple-choice question decks:

| Deck                    | Questions | Source file                                       |
| ----------------------- | --------- | ------------------------------------------------- |
| GH-300 (GitHub Copilot) | 151       | [`gh300Deck.ts`](src/features/study/gh300Deck.ts) |
| AI-103 (Azure AI)       | 50        | [`ai103Deck.ts`](src/features/study/ai103Deck.ts) |

The app runs entirely in the browser. It has no backend and no environment variables.

## Features

- **Deck selector:** switch between GH-300 and AI-103 from the header. Each deck keeps its own saved session.
- **Flashcards:** study the question and its non-interactive choices. Click the card, or press Enter or Space while it is focused, to reveal the correct answer with its option letter. Click again or press Escape to hide it. Mark the card as **Got it** or **Needs practice**, swipe the revealed card right (learned) or left (needs practice), or use the Right arrow (learned, after revealing) and Left arrow (needs practice) keys.
- **Quiz:** questions and answer choices are shuffled. Single-answer questions are graded as soon as you pick a choice. For multi-select questions, select your answers and click **Check answer**. Selections stay neutral until you submit, then answers are locked. You can skip a question. A summary appears when the quiz is complete. Quiz answers also update review progress: a correct answer marks the card as learned and a wrong answer marks it as needing practice.
- **Revisit list:** cards marked as needing practice are listed in the sidebar. Open one to study only those cards.
- **Progress by exam domain:** a table shows each official exam domain with its weight, and counts of learned, to revisit, skipped and unseen questions. Click a count to list the matching questions, or start a quiz for a single domain.
- **Reset:** the reset button in the header clears the current deck's session.

The layout is responsive, with full-width answer choices, touch-friendly controls and a horizontally scrollable domain table on small screens. Shared visual tokens and control styles live in [`tailwind.css`](src/styles/tailwind.css).

## Saved progress

Progress is stored in the browser's `localStorage`. If storage is unavailable, the app keeps working in memory.

| Key                                  | Contents                                                            |
| ------------------------------------ | ------------------------------------------------------------------- |
| `fieldnotes-study-session`           | GH-300 session: current card, review status, skipped cards and mode |
| `fieldnotes-study-session-ai-103-v2` | AI-103 session, same shape                                          |
| `fieldnotes-selected-deck`           | Last selected deck (`gh-300` or `ai-103`)                           |

The AI-103 question set was replaced, so its session moved to a new `-v2` key. The old `fieldnotes-study-session-ai-103` key is never deleted. When it exists, the AI-103 deck shows a notice that the previous session is still stored but the updated set starts fresh.

When a saved session is loaded, entries for card IDs that no longer exist are dropped.

## Tech stack

- React 18 and TypeScript 5.6 (strict mode)
- Vite 8 with `@vitejs/plugin-react`
- Tailwind CSS 4 through `@tailwindcss/vite`
- `lucide-react` icons
- ESLint 10 with `typescript-eslint`, React Hooks, React Refresh, unused-imports and Prettier rules

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8; the repo has no `.nvmrc` or `engines` field)
- npm (the repo uses `package-lock.json`)

## Setup and scripts

```bash
npm install
npm run dev
```

| Script            | Command                | Purpose                                         |
| ----------------- | ---------------------- | ----------------------------------------------- |
| `npm run dev`     | `vite`                 | Start the dev server with hot reload            |
| `npm run build`   | `tsc -b && vite build` | Type-check, then build to `dist/`               |
| `npm run preview` | `vite preview`         | Serve the production build locally              |
| `npm run lint`    | `eslint .`             | Lint the project, including Prettier formatting |

There is no test script and no separate type-check script. Type checking runs as part of `npm run build`.

## Project structure

```text
index.html                   App shell
vite.config.ts               Vite config (React and Tailwind plugins)
eslint.config.js             ESLint flat config
src/
  main.tsx                   Entry point, renders StudyApp
  styles/tailwind.css        Tailwind import, theme tokens and shared styles
  features/study/
    StudyApp.tsx             Deck selection, flashcard and quiz flow, revisit list
    QuizQuestion.tsx         Quiz choices, answer submission and feedback
    CategoryProgress.tsx     Progress-by-domain table, question lists, domain quizzes
    studySession.ts          Saved-session loading, shared types, grading, shuffling
    examDomains.ts           Exam domains, weights and question-to-domain mapping
    gh300Deck.ts             GH-300 questions and the shared Flashcard type
    ai103Deck.ts             AI-103 questions
.github/
  instructions/              Frontend coding guidelines
  skills/npm-audit-fix/      Workflow for fixing npm audit findings
```

## How questions are organized

Each deck file holds a list of `[question, choices, correctIndexes]` tuples and maps them to `Flashcard` objects. `correctIndexes` are zero-based indexes into `choices`. More than one index makes the question multi-select.

Every question text starts with a topic and question number, for example `T1Q15.` or `A2Q3.`:

- GH-300 uses topics `T1` to `T7`.
- AI-103 uses topics `A1` to `A5`, one per exam domain.

Card IDs differ per deck:

- GH-300: `gh300-001`, `gh300-002`, ... based on position in the list. Inserting or reordering questions changes the IDs and breaks saved progress for those cards.
- AI-103: `ai103-<prefix>`, for example `ai103-A1Q1`, based on the question prefix.

[`examDomains.ts`](src/features/study/examDomains.ts) defines each exam's domains, their weights and the date the weights were measured. A question belongs to a domain in one of two ways:

1. Its question number (for example `T1Q15`) is listed in a domain's `questionIds`. This explicit mapping wins over topics.
2. Otherwise, its topic prefix (for example `T3`) is listed in a domain's `topics`.

To add a question, append a tuple to the deck file with the next free number for its topic. For GH-300 questions under `T1`, also add the number to the right domain's `questionIds` if it should not count under the default `T1` domain ("Use GitHub Copilot features").

## Contributing

Follow the guidelines in [`.github/instructions/frontend.instructions.md`](.github/instructions/frontend.instructions.md). Run `npm run lint` and `npm run build` before you commit.
