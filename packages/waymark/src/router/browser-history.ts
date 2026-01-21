import {
  normalizeSearch,
  type HistoryLike,
  type HistoryPushOptions
} from "../utils";

export class BrowserHistory implements HistoryLike {
  private static patchKey = Symbol.for("waymark_history_patch_v01");

  constructor() {
    if (
      typeof history !== "undefined" &&
      !Object.hasOwn(window, BrowserHistory.patchKey)
    ) {
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
      Object.assign(window, {
        [BrowserHistory.patchKey]: true
      });
    }
  }

  getPath = () => location.pathname;

  getSearch = () => normalizeSearch(location.search);

  getState = () => history.state;

  go = (delta: number) => history.go(delta);

  push = (options: HistoryPushOptions) => {
    const { path, search, replace, state } = options;
    const href = `${path}${search ? `?${search}` : ""}`;
    history[replace ? replaceStateEvent : pushStateEvent](state, "", href);
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
