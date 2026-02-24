import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export type ActivityType = 'coding' | 'away' | 'idle';

export interface ActivityRecord {
  timestamp: number; // ms epoch
  type: ActivityType;
  duration: number;  // seconds
}

export class Storage {
  private dataPath: string;
  private records: ActivityRecord[] = [];

  constructor(storageUri: vscode.Uri) {
    const dir = storageUri.fsPath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.dataPath = path.join(dir, 'focusflow-data.json');
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const raw = fs.readFileSync(this.dataPath, 'utf8');
        this.records = JSON.parse(raw);
      }
    } catch {
      this.records = [];
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.records, null, 2), 'utf8');
    } catch (e) {
      console.error('FocusFlow: failed to save data', e);
    }
  }

  addRecord(record: ActivityRecord) {
    this.records.push(record);
    this.save();
  }

  getTodayCodingSeconds(): number {
    const today = this.getTodayRecords();
    return today
      .filter(r => r.type === 'coding')
      .reduce((sum, r) => sum + r.duration, 0);
  }

  getTodayRecords(): ActivityRecord[] {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return this.records.filter(r => r.timestamp >= startOfDay.getTime());
  }

  // Returns coding/away seconds per hour for today (array of 24)
  getHourlyBreakdown(): { coding: number; away: number }[] {
    const hours = Array.from({ length: 24 }, () => ({ coding: 0, away: 0 }));
    for (const record of this.getTodayRecords()) {
      const hour = new Date(record.timestamp).getHours();
      if (record.type === 'coding') hours[hour].coding += record.duration;
      else if (record.type === 'away') hours[hour].away += record.duration;
    }
    return hours;
  }

  getPeakHour(): number {
    const breakdown = this.getHourlyBreakdown();
    let max = 0, peak = 0;
    breakdown.forEach((h, i) => {
      if (h.coding > max) { max = h.coding; peak = i; }
    });
    return peak;
  }

  resetToday() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    this.records = this.records.filter(r => r.timestamp < startOfDay.getTime());
    this.save();
  }

  exportAll(): ActivityRecord[] {
    return this.records;
  }
}
