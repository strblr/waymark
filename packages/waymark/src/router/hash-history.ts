import { BrowserHistory } from "./browser-history";
import type { HistoryPushOptions } from "../types";

export class HashHistory extends BrowserHistory {
  location = () => {
    const { pathname, search } = new URL(location.hash.slice(1), "http://w");
    return this._loc(pathname, search);
  };

  push = (options: HistoryPushOptions) => {
    const { url, replace, state } = options;
    history[replace ? "replaceState" : "pushState"](state, "", `#${url}`);
  };
}
