import { clamp, splitUrl } from "../utils";
import type { HistoryLike, HistoryPushOptions } from "../types";

export interface MemoryLocation {
  path: string;
  search: string;
  state: any;
}

export class MemoryHistory implements HistoryLike {
  private stack: MemoryLocation[] = [];
  private index: number = 0;
  private listeners = new Set<() => void>();

  constructor(url = "/") {
    this.stack.push({ ...splitUrl(url), state: undefined });
  }

  getPath = () => this.stack[this.index].path;

  getSearch = () => this.stack[this.index].search;

  getState = () => this.stack[this.index].state;

  go = (delta: number) => {
    this.index = clamp(this.index + delta, 0, this.stack.length - 1);
    this.listeners.forEach(listener => listener());
  };

  push = (options: HistoryPushOptions) => {
    const { url, replace, state } = options;
    const location: MemoryLocation = { ...splitUrl(url), state };
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
