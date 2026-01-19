import {
  createElement,
  useMemo,
  useState,
  useContext,
  useLayoutEffect,
  type ReactNode,
  type MouseEvent,
  type AnchorHTMLAttributes,
  type CSSProperties
} from "react";
import { routerContext, outletContext } from "./contexts";
import { _useSubscribe, useRouter } from "./hooks";
import { Router, type RouterOptions } from "../router";
import type { Paths, NavigateOptions } from "../utils";

// RouterRoot

export type RouterRootProps = RouterOptions | { router: Router };

export function RouterRoot(props: RouterRootProps) {
  const [router] = useState(() =>
    "router" in props ? props.router : new Router(props)
  );
  const route = _useSubscribe(router, () =>
    router.getRouteMatch(router.history.getPath())
  );
  if (!route) {
    console.error("[Waymark] No route found for current path");
  }
  return useMemo<ReactNode>(() => {
    return createElement(
      routerContext.Provider,
      { value: router },
      route?._components.reduceRight<ReactNode>(
        (acc, comp) =>
          createElement(
            outletContext.Provider,
            { value: acc },
            createElement(comp)
          ),
        null
      )
    );
  }, [router, route]);
}

// Outlet

export function Outlet() {
  return useContext(outletContext);
}

// Navigate

export type NavigateProps<P extends Paths> = NavigateOptions<P>;

export function Navigate<P extends Paths>(props: NavigateProps<P>) {
  const router = useRouter();
  useLayoutEffect(() => router.navigate(props), []);
  return null;
}

// Link

export type LinkProps<P extends Paths> = NavigateOptions<P> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    activeStyle?: CSSProperties;
    activeClassName?: string;
  };

export function Link<P extends Paths>(props: LinkProps<P>): ReactNode {
  const {
    to,
    replace,
    data,
    params,
    search,
    style,
    className,
    activeStyle,
    activeClassName,
    ...rest
  } = props;
  const router = useRouter();
  const href = router.resolvePath(props);
  const currentPath = _useSubscribe(router, () => router.history.getPath());

  const activeProps = useMemo(() => {
    const active = currentPath.startsWith(href);
    return {
      ["data-active"]: active,
      style: { ...style, ...(active && activeStyle) },
      className:
        [className, active && activeClassName].filter(Boolean).join(" ") ||
        undefined
    };
  }, [href, currentPath, style, className, activeStyle, activeClassName]);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    rest.onClick?.(event);
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
    router.history.push(href, replace, data);
  };

  return createElement("a", { ...rest, ...activeProps, href, onClick });
}
