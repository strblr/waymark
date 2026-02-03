import { parseUrl } from "../utils";
import type {
  HistoryLike,
  HistoryLocation,
  HistoryPushOptions
} from "../types";

export class MemoryHistory implements HistoryLike {
  private stack: HistoryLocation[] = [];
  private index: number = 0;
  private listeners = new Set<() => void>();

  constructor(url = "/") {
    this.stack.push({ ...parseUrl(url), state: undefined });
  }

  location = () => this.stack[this.index];

  go = (delta: number) => {
    const index = this.index + delta;
    if (this.stack[index]) {
      this.index = index;
      this.listeners.forEach(listener => listener());
    }
  };

  push = (options: HistoryPushOptions) => {
    const { url, replace, state } = options;
    const location: HistoryLocation = { ...parseUrl(url), state };
    this.stack = this.stack.slice(0, this.index + 1);
    if (replace) {
      this.stack[this.index] = location;
    } else {
      this.index = this.stack.push(location) - 1;
    }
    this.listeners.forEach(listener => listener());
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
}
