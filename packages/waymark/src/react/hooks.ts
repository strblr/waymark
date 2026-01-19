import { useContext, useMemo, useSyncExternalStore } from "react";
import { routerContext } from "./contexts";
import { Routes } from "../utils";

// useRouter

export function useRouter() {
  const router = useContext(routerContext);
  if (!router) {
    throw new Error("useRouter must be used within a router context");
  }
  return router;
}

// useLocation

export function useLocation() {
  const router = useRouter();
  const path = useSyncExternalStore(
    router.history.subscribe,
    router.history.getPath,
    router.history.getPath
  );
  const search = useSyncExternalStore(
    router.history.subscribe,
    router.history.getSearch,
    router.history.getSearch
  );
  const state = useSyncExternalStore(
    router.history.subscribe,
    router.history.getState,
    router.history.getState
  );
  return useMemo(
    () => ({ path, search: new URLSearchParams(search), state }),
    [path, search, state]
  );
}

// useParams

export function useParams<R extends Routes>(route: R) {
  const router = useRouter();
  const path = useSyncExternalStore(
    router.history.subscribe,
    router.history.getPath,
    router.history.getPath
  );
  return useMemo(
    () => router.resolveParams(route, path),
    [route, router, path]
  );
}

// useSearch

export function useSearch<R extends Routes>(route: R) {
  const router = useRouter();
  const search = useSyncExternalStore(
    router.history.subscribe,
    router.history.getSearch,
    router.history.getSearch
  );
  return useMemo(
    () => router.resolveSearch(route, search),
    [route, router, search]
  );
}
