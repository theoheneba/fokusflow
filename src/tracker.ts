import { Storage, ActivityType } from './storage';

const IDLE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

export class Tracker {
  private idleTimer: NodeJS.Timeout | null = null;
  private currentState: ActivityType = 'idle';
  private sessionStart: number = Date.now();
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  start() {
    this.currentState = 'idle';
    this.sessionStart = Date.now();
  }

  stop() {
    this.flushSession();
    if (this.idleTimer) clearTimeout(this.idleTimer);
  }

  onActivity(type: ActivityType) {
    const now = Date.now();

    // If state is changing, flush the previous session
    if (type !== this.currentState) {
      this.flushSession();
      this.currentState = type;
      this.sessionStart = now;
    }

    // Reset idle timer on any activity
    if (type === 'coding') {
      this.resetIdleTimer();
    }
  }

  private resetIdleTimer() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      // User went idle
      this.flushSession();
      this.currentState = 'idle';
      this.sessionStart = Date.now();
    }, IDLE_TIMEOUT_MS);
  }

  private flushSession() {
    const now = Date.now();
    const duration = Math.floor((now - this.sessionStart) / 1000);

    // Only record sessions longer than 5 seconds
    if (duration > 5 && this.currentState !== 'idle') {
      this.storage.addRecord({
        timestamp: this.sessionStart,
        type: this.currentState,
        duration
      });
    }
  }
}
