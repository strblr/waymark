import { useMemo, useContext } from "react";
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
  Params,
  Search,
  Updater
} from "../types";

// useRouter

export function useRouter() {
  const router = useContext(RouterContext);
  if (router) return router;
  throw new Error("[Waymark] useRouter must be used within a router context");
}

// useLocation

export function useLocation() {
  const location = useContext(LocationContext);
  if (location) return location;
  throw new Error("[Waymark] useLocation must be used within a router context");
}

// useMatch

export function useMatch<P extends Pattern>(
  options: MatchOptions<P>
): Params<P> | null {
  const router = useRouter();
  const match = useContext(MatchContext);
  const { from, strict, params } = options;
  const route = router.getRoute(from);
  return match &&
    (match.route === route || (!strict && match.route._.chain.has(route))) &&
    (!params ||
      Object.keys(params).every(key => params[key] === match.params[key]))
    ? match.params
    : null;
}

// useOutlet

export function useOutlet() {
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

export function useParams<P extends Pattern>(from: P | GetRoute<P>): Params<P> {
  const params = useMatch({ from });
  if (params) return params;
  throw new Error(
    `[Waymark] Can't read params for non-matching route: ${from}`
  );
}

// useSearch

export function useSearch<P extends Pattern>(from: P | GetRoute<P>) {
  const router = useRouter();
  const location = useLocation();
  const route = router.getRoute(from);
  const validated = useMemo<Search<P>>(
    () => route._.validate(location.search),
    [route, location.search]
  );

  const setSearch = useEvent(
    (update: Updater<Search<P>>, replace?: boolean) => {
      update = typeof update === "function" ? update(validated) : update;
      const search = { ...validated, ...update };
      const url = mergeUrl(location.path, search);
      router.navigate({ url, replace });
    }
  );

  return [validated, setSearch] as const;
}
