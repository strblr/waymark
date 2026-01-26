import { parseUrl } from "../utils";
import type { HistoryLike, HistoryPushOptions } from "../types";

export interface MemoryLocation {
  path: string;
  search: Record<string, unknown>;
  state: any;
}

export class MemoryHistory implements HistoryLike {
  private stack: MemoryLocation[] = [];
  private index: number = 0;
  private listeners = new Set<() => void>();

  constructor(url = "/") {
    this.stack.push({ ...parseUrl(url), state: undefined });
  }

  private getCurrent = () => this.stack[this.index];

  getPath = () => this.getCurrent().path;

  getSearch = () => this.getCurrent().search;

  getState = () => this.getCurrent().state;

  go = (delta: number) => {
    const index = this.index + delta;
    if (this.stack[index]) {
      this.index = index;
      this.listeners.forEach(listener => listener());
    }
  };

  push = (options: HistoryPushOptions) => {
    const { url, replace, state } = options;
    const location: MemoryLocation = { ...parseUrl(url), state };
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
