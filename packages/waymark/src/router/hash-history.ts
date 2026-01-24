import { BrowserHistory } from "./browser-history";
import { splitUrl } from "../utils";
import type { HistoryPushOptions } from "../types";

export class HashHistory extends BrowserHistory {
  private getHashUrl = () => location.hash.slice(1) || "/";

  getPath = () => splitUrl(this.getHashUrl()).path;

  getSearch = () => splitUrl(this.getHashUrl()).search;

  getState = () => history.state;

  push = (options: HistoryPushOptions) => {
    const { url, replace, state } = options;
    history[replace ? "replaceState" : "pushState"](state, "", `#${url}`);
  };
}
