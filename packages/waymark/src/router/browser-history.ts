import { parseSearch } from "../utils";
import type { HistoryLike, HistoryPushOptions } from "../types";

export class BrowserHistory implements HistoryLike {
  private static patch = Symbol.for("wmbhp01");
  private memo?: { search: string; parsed: Record<string, unknown> };

  constructor() {
    if (typeof history !== "undefined" && !(BrowserHistory.patch in window)) {
      for (const type of [pushStateEvent, replaceStateEvent] as const) {
        const original = history[type];
        history[type] = function (...args) {
          const result = original.apply(this, args);
          const event = new Event(type);
          (event as any).arguments = args;
          dispatchEvent(event);
          return result;
        };
      }
      (window as any)[BrowserHistory.patch] = true;
    }
  }

  protected getSearchMemo = (search: string) => {
    return this.memo?.search === search
      ? this.memo.parsed
      : (this.memo = { search, parsed: parseSearch(search) }).parsed;
  };

  getPath = () => location.pathname;

  getSearch = () => this.getSearchMemo(location.search);

  getState = () => history.state;

  go = (delta: number) => history.go(delta);

  push = (options: HistoryPushOptions) => {
    const { url, replace, state } = options;
    history[replace ? replaceStateEvent : pushStateEvent](state, "", url);
  };

  subscribe = (listener: () => void) => {
    events.forEach(event => window.addEventListener(event, listener));
    return () => {
      events.forEach(event => window.removeEventListener(event, listener));
    };
  };
}

// Events

const popStateEvent = "popstate";
const pushStateEvent = "pushState";
const replaceStateEvent = "replaceState";
const hashChangeEvent = "hashchange";

const events = [
  popStateEvent,
  pushStateEvent,
  replaceStateEvent,
  hashChangeEvent
];
