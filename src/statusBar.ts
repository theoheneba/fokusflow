import * as vscode from 'vscode';

export class StatusBar {
  private item: vscode.StatusBarItem;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.item.command = 'focusflow.showDashboard';
    this.item.tooltip = 'FocusFlow — click to open dashboard';
    this.item.show();
  }

  update(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      this.item.text = `⚡ ${hours}h ${minutes}m`;
    } else {
      this.item.text = `⚡ ${minutes}m`;
    }
  }

  dispose() {
    this.item.dispose();
  }
}
