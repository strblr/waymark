import type { HistoryLike } from "../utils";

interface MemoryHistoryLocation {
  path: string;
  search: string;
  state: any;
}

export class MemoryHistory implements HistoryLike {
  private static defaultLocation: MemoryHistoryLocation = {
    path: "/",
    search: "",
    state: undefined
  };

  private stack: MemoryHistoryLocation[] = [];
  private currentIndex: number = 0;
  private listeners = new Set<() => void>();

  constructor(initial?: Partial<MemoryHistoryLocation>) {
    this.stack.push({ ...MemoryHistory.defaultLocation, ...initial });
  }

  _getCurrent() {
    return this.stack[this.currentIndex];
  }

  _parsePath(path: string): Pick<MemoryHistoryLocation, "path" | "search"> {
    const [p, search] = path.split("?");
    return { path: p, search: search ? `?${search}` : "" };
  }

  getPath() {
    return this._getCurrent().path;
  }

  getSearch() {
    return this._getCurrent().search;
  }

  getState() {
    return this._getCurrent().state;
  }

  go(delta: number) {
    this.currentIndex = Math.max(
      0,
      Math.min(this.stack.length - 1, this.currentIndex + delta)
    );
    this.listeners.forEach(listener => listener());
  }

  push(path: string, replace?: boolean, data?: any) {
    const location: MemoryHistoryLocation = {
      ...this._parsePath(path),
      state: data
    };
    this.stack = this.stack.slice(0, this.currentIndex + 1);
    if (replace) {
      this.stack[this.currentIndex] = location;
    } else {
      this.currentIndex = this.stack.push(location) - 1;
    }
    this.listeners.forEach(listener => listener());
  }

  subscribe = (callback: () => void) => {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  };
}
