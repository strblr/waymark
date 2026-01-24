import { useMemo, useCallback, useContext, useSyncExternalStore } from "react";
import { RouterContext, MatchContext, OutletContext } from "./contexts";
import type { Router } from "../router";
import { mergeUrl, parseSearch } from "../utils";
import type {
  Handle,
  Pattern,
  GetRoute,
  Search,
  Updater,
  MatchOptions
} from "../types";

// useRouter

export function useRouter() {
  const router = useContext(RouterContext);
  if (!router) {
    throw new Error("[Waymark] useRouter must be used within a router context");
  }
  return router;
}

// useHandles

export function useHandles(): Handle[] {
  const match = useContext(MatchContext);
  return useMemo(() => match?.route._.handles ?? [], [match]);
}

// useOutlet

export function useOutlet() {
  return useContext(OutletContext);
}

// useSubscribe

export function useSubscribe<T>(router: Router, getSnapshot: () => T) {
  return useSyncExternalStore(
    router.history.subscribe,
    getSnapshot,
    getSnapshot
  );
}

// useNavigate

export function useNavigate() {
  const router = useRouter();
  return useMemo(() => router.navigate.bind(router), [router]);
}

// useLocation

export function useLocation() {
  const router = useRouter();
  const path = useSubscribe(router, router.history.getPath);
  const search = useSubscribe(router, router.history.getSearch);
  const state = useSubscribe(router, router.history.getState);
  return useMemo(
    () => ({ path, search: parseSearch(search), state }),
    [path, search, state]
  );
}

// useMatch

export function useMatch<P extends Pattern>(options: MatchOptions<P>) {
  const router = useRouter();
  const path = useSubscribe(router, router.history.getPath);
  const match = useMemo(
    () => router.match(path, options),
    [router, path, options]
  );
  return match;
}

// useParams

export function useParams<P extends Pattern>(from: P | GetRoute<P>) {
  const match = useMatch({ from });
  if (!match) {
    throw new Error(
      `[Waymark] Can't read params for non-matching route: ${from}`
    );
  }
  return match.params;
}

// useSearch

export function useSearch<P extends Pattern>(from: P | GetRoute<P>) {
  const match = useMatch({ from });
  if (!match) {
    throw new Error(
      `[Waymark] Can't read search for non-matching route: ${from}`
    );
  }
  const parse = useCallback(
    (search: string): Search<P> => match.route._.mapSearch(parseSearch(search)),
    [match.route]
  );
  const router = useRouter();
  const search = useSubscribe(router, router.history.getSearch);
  const parsed = useMemo(() => parse(search), [parse, search]);

  const setSearch = useCallback(
    (update: Updater<Search<P>>, replace?: boolean) => {
      const parsed = parse(router.history.getSearch());
      update = typeof update === "function" ? update(parsed) : update;
      const url = mergeUrl(router.history.getPath(), { ...parsed, ...update });
      router.navigate({ url, replace });
    },
    [router, parse]
  );

  return [parsed, setSearch] as const;
}
