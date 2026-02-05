import { useMemo, useContext, type ReactNode } from "react";
import {
  RouterContext,
  LocationContext,
  MatchContext,
  OutletContext
} from "./contexts";
import { mergeUrl, useEvent } from "../utils";
import type {
  Handle,
  Pattern,
  GetRoute,
  MatchOptions,
  Search,
  Updater
} from "../types";

// useRouter

export function useRouter() {
  const router = useContext(RouterContext);
  if (router) return router;
  throw new Error("[Waymark] useRouter must be within a router context");
}

// useLocation

export function useLocation() {
  const location = useContext(LocationContext);
  if (location) return location;
  throw new Error("[Waymark] useLocation must be within a router context");
}

// useMatch

export function useMatch<P extends Pattern>(options: MatchOptions<P>) {
  const router = useRouter();
  const { path } = useLocation();
  return useMemo(
    () => router.match(path, options),
    [router, path, options.from, options.strict, options.params]
  );
}

// useOutlet

export function useOutlet(): ReactNode {
  return useContext(OutletContext);
}

// useNavigate

export function useNavigate() {
  return useRouter().navigate;
}

// useHandles

export function useHandles(): Handle[] {
  const match = useContext(MatchContext);
  return useMemo(() => match?.route._.handles ?? [], [match]);
}

// useParams

export function useParams<P extends Pattern>(from: P | GetRoute<P>) {
  const match = useMatch({ from });
  if (match) return match.params;
  throw new Error(`[Waymark] Can't read params for non-matching route ${from}`);
}

// useSearch

export function useSearch<P extends Pattern>(from: P | GetRoute<P>) {
  const router = useRouter();
  const { search, path } = useLocation();
  const route = router.getRoute(from);
  const validated = useMemo<Search<P>>(
    () => route._.validate(search),
    [route, search]
  );

  const setSearch = useEvent(
    (update: Updater<Search<P>>, replace?: boolean) => {
      update = typeof update === "function" ? update(validated) : update;
      const search = { ...validated, ...update };
      const url = mergeUrl(path, search);
      router.navigate({ url, replace });
    }
  );

  return [validated, setSearch] as const;
}
