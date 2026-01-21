import { useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { outletContext, routerContext } from "./contexts";
import type { Router } from "../router";
import type { Routes, RouteSearch, Updater } from "../utils";

// useRouter

export function useRouter() {
  const router = useContext(routerContext);
  if (!router) {
    throw new Error("[Waymark] useRouter must be used within a router context");
  }
  return router;
}

// useOutlet

export function useOutlet() {
  return useContext(outletContext);
}

// useLocation

export function useLocation() {
  const router = useRouter();
  const path = _useSubscribe(router, router.history.getPath);
  const search = _useSubscribe(router, router.history.getSearch);
  const state = _useSubscribe(router, router.history.getState);
  return useMemo(
    () => ({ path, search: new URLSearchParams(search), state }),
    [path, search, state]
  );
}

// useNavigate

export function useNavigate() {
  const router = useRouter();
  return useMemo(() => router.navigate.bind(router), [router]);
}

// useParams

export function useParams<R extends Routes>(route: R) {
  const router = useRouter();
  const path = _useSubscribe(router, router.history.getPath);
  return useMemo(
    () => router.resolveParams(route, path),
    [router, route, path]
  );
}

// useSearch

export function useSearch<R extends Routes>(route: R) {
  const router = useRouter();
  const searchString = _useSubscribe(router, router.history.getSearch);
  const search = useMemo(
    () => router.resolveSearch(route, searchString),
    [router, route, searchString]
  );

  const setSearch = useCallback(
    (update: Updater<RouteSearch<R>>, replace?: boolean) => {
      const params = router.resolveParams(route, router.history.getPath());
      const search = router.resolveSearch(route, router.history.getSearch());
      update = typeof update === "function" ? update(search) : update;
      router.navigate({
        to: route._.pattern,
        params,
        search: { ...search, ...update },
        replace
      });
    },
    [router, route]
  );

  return [search, setSearch] as const;
}

// _useSubscribe

export function _useSubscribe<T>(router: Router, getSnapshot: () => T) {
  return useSyncExternalStore(
    router.history.subscribe,
    getSnapshot,
    getSnapshot
  );
}
