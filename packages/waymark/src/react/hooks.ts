import { useContext, useMemo, useSyncExternalStore } from "react";
import { routerContext } from "./contexts";
import type { Router } from "../router";
import type { Routes } from "../utils";

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
  const path = _useSubscribe(router, () => router.history.getPath());
  const search = _useSubscribe(router, () => router.history.getSearch());
  const state = _useSubscribe(router, () => router.history.getState());
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
  const path = _useSubscribe(router, () => router.history.getPath());
  return useMemo(
    () => router.resolveParams(route, path),
    [route, router, path]
  );
}

// useSearch

export function useSearch<R extends Routes>(route: R) {
  const router = useRouter();
  const search = _useSubscribe(router, () => router.history.getSearch());
  return useMemo(
    () => router.resolveSearch(route, search),
    [route, router, search]
  );
}

// _useSubscribe

export function _useSubscribe<T>(router: Router, getSnapshot: () => T) {
  return useSyncExternalStore(
    router.history.subscribe,
    getSnapshot,
    getSnapshot
  );
}
