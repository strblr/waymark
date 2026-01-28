import { useMemo, useContext, useSyncExternalStore } from "react";
import { RouterContext, MatchContext, OutletContext } from "./contexts";
import type { Router } from "../router";
import { mergeUrl, useEvent } from "../utils";
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

// useNavigate

export function useNavigate() {
  return useRouter().navigate;
}

// useLocation

export function useLocation() {
  const router = useRouter();
  const path = useSubscribe(router, router.history.getPath);
  const search = useSubscribe(router, router.history.getSearch);
  const state = useSubscribe(router, router.history.getState);
  return useMemo(() => ({ path, search, state }), [path, search, state]);
}

// useOutlet

export function useOutlet() {
  return useContext(OutletContext);
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
  const router = useRouter();
  const route = router.getRoute(from);
  const search = useSubscribe(router, router.history.getSearch);
  const validated = useMemo<Search<P>>(
    () => route._.validate(search),
    [route, search]
  );

  const setSearch = useEvent(
    (update: Updater<Search<P>>, replace?: boolean) => {
      update = typeof update === "function" ? update(validated) : update;
      const search = { ...validated, ...update };
      const url = mergeUrl(router.history.getPath(), search);
      router.navigate({ url, replace });
    }
  );

  return [validated, setSearch] as const;
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

// useHandles

export function useHandles(): Handle[] {
  const match = useContext(MatchContext);
  return useMemo(() => match?.route._.handles ?? [], [match]);
}

// useSubscribe

export function useSubscribe<T>(router: Router, getSnapshot: () => T) {
  return useSyncExternalStore(
    router.history.subscribe,
    getSnapshot,
    getSnapshot
  );
}
