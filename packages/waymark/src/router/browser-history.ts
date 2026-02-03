import { parseSearch } from "../utils";
import type {
  HistoryLike,
  HistoryLocation,
  HistoryPushOptions
} from "../types";

export class BrowserHistory implements HistoryLike {
  private _?: [search: string, location: HistoryLocation];

  protected _loc = (path: string, search: string) => {
    const { state } = history;
    const [s, m] = this._ ?? [];
    return m?.path === path && s === search && m.state === state
      ? m
      : (this._ = [search, { path, search: parseSearch(search), state }])[1];
  };

  constructor() {
    if (!(window as any)[patch]) {
      for (const type of [pushStateEvent, replaceStateEvent] as const) {
        const original = history[type];
        history[type] = function (...args) {
          original.apply(this, args);
          const event = new Event(type);
          dispatchEvent(event);
        };
      }
      (window as any)[patch] = 1;
    }
  }

  location = () => this._loc(location.pathname, location.search);

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

const patch = Symbol.for("wmp01");
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
