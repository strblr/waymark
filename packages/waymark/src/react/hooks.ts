import { useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { outletContext, routerContext } from "./contexts";
import type { Router } from "../router";
import { parseSearch } from "../utils";
import type { Routes, RouteSearch, Updater } from "../types";

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

// useParams

export function useParams<R extends Routes>(route: R) {
  const router = useRouter();
  const path = useSubscribe(router, router.history.getPath);
  return useMemo(
    () => router.decompose(route, path, router.history.getSearch()).params,
    [router, route, path]
  );
}

// useSearch

export function useSearch<R extends Routes>(route: R) {
  const router = useRouter();
  const search = useSubscribe(router, router.history.getSearch);
  const parsed = useMemo(
    () => router.decompose(route, router.history.getPath(), search).search,
    [router, route, search]
  );

  const setSearch = useCallback(
    (update: Updater<RouteSearch<R>>, replace?: boolean) => {
      const { params, search } = router.decompose(
        route,
        router.history.getPath(),
        router.history.getSearch()
      );
      update = typeof update === "function" ? update(search) : update;
      router.navigate({
        to: route.pattern,
        params,
        search: { ...search, ...update },
        replace
      });
    },
    [router, route]
  );

  return [parsed, setSearch] as const;
}
