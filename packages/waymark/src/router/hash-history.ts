import { BrowserHistory } from "./browser-history";
import type { HistoryPushOptions } from "../types";

export class HashHistory extends BrowserHistory {
  private getHashUrl = () => new URL(location.hash.slice(1), "http://w");

  getPath = () => this.getHashUrl().pathname;

  getSearch = () => this.getSearchMemo(this.getHashUrl().search);

  push = (options: HistoryPushOptions) => {
    const { url, replace, state } = options;
    history[replace ? "replaceState" : "pushState"](state, "", `#${url}`);
  };
}
