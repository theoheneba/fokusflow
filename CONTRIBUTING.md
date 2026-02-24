# Contributing to FocusFlow

Thanks for your interest! FocusFlow is a simple VS Code extension — contributions of all sizes are welcome.

## Project structure

```
src/
  extension.ts   — entry point, registers commands and listeners
  tracker.ts     — activity detection and idle timeout logic
  storage.ts     — reads/writes local JSON data
  statusBar.ts   — the ⚡ status bar item
  dashboard.ts   — webview panel with Chart.js
```

## Getting started

```bash
git clone https://github.com/theoheneba/focusflow
cd focusflow
npm install
```

Open the folder in VS Code, then press `F5` to launch a new Extension Development Host window with FocusFlow running.

## Ideas for contributions

- Weekly and monthly view in dashboard
- Streak tracking (days in a row you hit a coding goal)
- Configurable idle timeout (currently hardcoded at 2 min)
- Language/file type breakdown
- Goal setting (e.g. "code 4h today")
- Themes for the dashboard

## Submitting a PR

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run `npm run compile` to check for TypeScript errors
5. Open a PR with a clear description of what you changed and why

## Code style

- TypeScript strict mode is on
- Keep files focused — one responsibility per file
- Add a comment if something isn't obvious
