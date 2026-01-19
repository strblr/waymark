import {
  createElement,
  useState,
  useContext,
  useSyncExternalStore,
  type MouseEvent,
  type AnchorHTMLAttributes
} from "react";
import { routerContext, outletContext } from "./contexts";
import { useRouter } from "./hooks";
import { Router, RouterOptions } from "../router";
import type { Paths, NavigateOptions } from "../utils";

// RouterRoot

type RouterRootProps = RouterOptions | { router: Router };

export function RouterRoot(props: RouterRootProps) {
  const [router] = useState(() =>
    "router" in props ? props.router : new Router(props)
  );
  const route = useSyncExternalStore(
    router.history.subscribe,
    router.getRouteMatch,
    router.getRouteMatch
  );
  if (!route) {
    console.error("[Waymark] No route found for current path");
    return null;
  }
  return createElement(
    routerContext.Provider,
    { value: router },
    createElement(route._component)
  );
}

// Outlet

export function Outlet() {
  const component = useContext(outletContext);
  return component ? createElement(component) : null;
}

// Link

export function Link<P extends Paths>({
  to,
  replace,
  data,
  params,
  search,
  ...props
}: NavigateOptions<P> & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter();
  const path = router.resolvePath({ to, replace, data, params, search });

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.onClick?.(event);
    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    router.history.push(path, replace, data);
  };

  return createElement("a", {
    ...props,
    href: path,
    onClick: handleClick
  });
}
