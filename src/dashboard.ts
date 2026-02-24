import * as vscode from 'vscode';
import { Storage } from './storage';

export class Dashboard {
  private panel: vscode.WebviewPanel | null = null;
  private context: vscode.ExtensionContext;
  private storage: Storage;

  constructor(context: vscode.ExtensionContext, storage: Storage) {
    this.context = context;
    this.storage = storage;
  }

  show() {
    if (this.panel) {
      this.panel.reveal();
      this.panel.webview.html = this.getHtml();
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'focusflow.dashboard',
      'FocusFlow Dashboard',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    this.panel.webview.html = this.getHtml();

    this.panel.onDidDispose(() => {
      this.panel = null;
    }, null, this.context.subscriptions);
  }

  private getHtml(): string {
    const hourly = this.storage.getHourlyBreakdown();
    const todaySeconds = this.storage.getTodayCodingSeconds();
    const peakHour = this.storage.getPeakHour();
    const hours = Math.floor(todaySeconds / 3600);
    const minutes = Math.floor((todaySeconds % 3600) / 60);

    const codingData = hourly.map(h => Math.round(h.coding / 60));
    const awayData = hourly.map(h => Math.round(h.away / 60));

    const labels = hourly.map((_, i) => {
      const h = i % 12 === 0 ? 12 : i % 12;
      return `${h}${i < 12 ? 'am' : 'pm'}`;
    });

    const peakLabel = (() => {
      const h = peakHour % 12 === 0 ? 12 : peakHour % 12;
      return `${h}${peakHour < 12 ? 'am' : 'pm'}`;
    })();

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FocusFlow</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 32px;
  }
  h1 { font-size: 22px; font-weight: 600; color: #ffffff; margin-bottom: 4px; }
  .subtitle { color: #888; font-size: 13px; margin-bottom: 32px; }
  .stats {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
  }
  .stat-card {
    background: #252526;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 20px 24px;
    flex: 1;
  }
  .stat-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .stat-value { font-size: 28px; font-weight: 700; color: #4ec9b0; }
  .stat-value.peak { color: #dcdcaa; }
  .chart-card {
    background: #252526;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 16px;
  }
  .chart-title { font-size: 14px; color: #ccc; margin-bottom: 20px; font-weight: 500; }
  .legend {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
  }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #888; }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot-coding { background: #4ec9b0; }
  .dot-away { background: #f44747; }
  canvas { max-height: 200px; }
</style>
</head>
<body>
<h1>⚡ FocusFlow</h1>
<p class="subtitle">Today's productivity — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

<div class="stats">
  <div class="stat-card">
    <div class="stat-label">Coding Time</div>
    <div class="stat-value">${hours}h ${minutes}m</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Peak Focus Hour</div>
    <div class="stat-value peak">${todaySeconds > 60 ? peakLabel : '—'}</div>
  </div>
</div>

<div class="chart-card">
  <div class="chart-title">Activity by Hour</div>
  <div class="legend">
    <div class="legend-item"><div class="dot dot-coding"></div> Coding</div>
    <div class="legend-item"><div class="dot dot-away"></div> Away</div>
  </div>
  <canvas id="chart"></canvas>
</div>

<script>
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(labels)},
      datasets: [
        {
          label: 'Coding (min)',
          data: ${JSON.stringify(codingData)},
          backgroundColor: '#4ec9b0',
          borderRadius: 3,
        },
        {
          label: 'Away (min)',
          data: ${JSON.stringify(awayData)},
          backgroundColor: '#f44747',
          borderRadius: 3,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          stacked: true,
          ticks: { color: '#666', font: { size: 10 } },
          grid: { color: '#2d2d2d' }
        },
        y: {
          stacked: true,
          ticks: { color: '#666', font: { size: 10 } },
          grid: { color: '#2d2d2d' },
          title: { display: true, text: 'minutes', color: '#555', font: { size: 11 } }
        }
      }
    }
  });
</script>
  <div style="margin-top: 24px; text-align: center; font-size: 11px; color: #555;">
    Built by <a href="https://celeteck.com" target="_blank" style="color: #4ec9b0; text-decoration: none;">Celeteck</a> · 
    <a href="https://x.com/theoheneba_" target="_blank" style="color: #4ec9b0; text-decoration: none;">Follow @theoheneba_ on X</a>
  </div>
</body>
</html>`;
  }
}