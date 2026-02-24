import * as vscode from 'vscode';
import { Tracker } from './tracker';
import { StatusBar } from './statusBar';
import { Dashboard } from './dashboard';
import { Storage } from './storage';

export function activate(context: vscode.ExtensionContext) {
  const storage = new Storage(context.globalStorageUri);
  const tracker = new Tracker(storage);
  const statusBar = new StatusBar();
  const dashboard = new Dashboard(context, storage);

  // Start tracking
  tracker.start();

  // Update status bar every 30 seconds
  const statusInterval = setInterval(() => {
    const todayTotal = storage.getTodayCodingSeconds();
    statusBar.update(todayTotal);
  }, 30000);

  // Update immediately
  statusBar.update(storage.getTodayCodingSeconds());

  // Listen to VS Code events
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => tracker.onActivity('coding')),
    vscode.window.onDidChangeActiveTextEditor((e) => {
      if (e) tracker.onActivity('coding');
    }),
    vscode.window.onDidChangeWindowState((state) => {
      if (!state.focused) {
        tracker.onActivity('away');
      } else {
        tracker.onActivity('coding');
      }
    }),
    vscode.window.onDidChangeActiveTerminal(() => tracker.onActivity('coding'))
  );

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('focusflow.showDashboard', () => {
      dashboard.show();
    }),
    vscode.commands.registerCommand('focusflow.resetToday', async () => {
      const confirm = await vscode.window.showWarningMessage(
        "Reset today's FocusFlow data?", "Yes", "Cancel"
      );
      if (confirm === "Yes") {
        storage.resetToday();
        statusBar.update(0);
        vscode.window.showInformationMessage("Today's data has been reset.");
      }
    }),
    vscode.commands.registerCommand('focusflow.exportData', async () => {
      const data = storage.exportAll();
      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(`focusflow-export-${Date.now()}.json`),
        filters: { 'JSON': ['json'] }
      });
      if (uri) {
        const bytes = Buffer.from(JSON.stringify(data, null, 2), 'utf8');
        await vscode.workspace.fs.writeFile(uri, bytes);
        vscode.window.showInformationMessage(`Data exported to ${uri.fsPath}`);
      }
    })
  );

  // Show summary on shutdown
  context.subscriptions.push({
    dispose: () => {
      tracker.stop();
      clearInterval(statusInterval);
      statusBar.dispose();
      const seconds = storage.getTodayCodingSeconds();
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (seconds > 60) {
        vscode.window.showInformationMessage(
          `FocusFlow: You coded ${hours}h ${minutes}m today. Great work!`
        );
      }
    }
  });
}

export function deactivate() {}
