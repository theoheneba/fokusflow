# ⚡ FocusFlow

**Track how long you actually code each day — right inside VS Code.**

No account. No servers. No telemetry. Everything stays on your machine.

---

## Features

- **Live status bar** — see today's coding time at a glance (`⚡ 3h 12m`)
- **Hourly dashboard** — bar chart showing coding vs. away time by hour
- **Daily summary** — peak focus hour and total coding time
- **Export your data** — download everything as JSON anytime
- **100% local** — data stored on your machine, never sent anywhere

## How it works

FocusFlow listens to VS Code events to classify your time:

| State | Trigger |
|-------|---------|
| **Coding** | Typing, editing, switching files |
| **Away** | VS Code loses window focus |
| **Idle** | No activity for 2+ minutes |

## Commands

Open the Command Palette (`Cmd+Shift+P`) and type `FocusFlow`:

- `FocusFlow: Show Dashboard` — open the hourly breakdown
- `FocusFlow: Reset Today's Data` — clear today's records
- `FocusFlow: Export All Data as JSON` — download your full history

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com) (search "FocusFlow").

Or install manually:
```bash
git clone https://github.com/theoheneba/focusflow
cd focusflow
npm install
npm run compile
```
Then press `F5` in VS Code to launch the extension in a new window.

## Data & Privacy

All data is stored locally in VS Code's extension storage folder. Nothing is ever sent to a server. You can export and delete your data at any time.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome!

## License

MIT

## Built by

Made with ❤️ by [Celeteck PTY LTD ](https://celeteck.com)  
Follow the creator on X: [@theoheneba_](https://x.com/theoheneba_)# fokusflow
