import {
  createElement,
  useMemo,
  useState,
  useContext,
  useLayoutEffect,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent,
  type FocusEvent,
  type PointerEvent,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type RefAttributes
} from "react";
import { routerContext, outletContext } from "./contexts";
import { _useSubscribe, useRouter } from "./hooks";
import { Router, type RouterOptions } from "../router";
import { mergeRefs, type Paths, type NavigateOptions } from "../utils";

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
  AnchorHTMLAttributes<HTMLAnchorElement> &
  RefAttributes<HTMLAnchorElement> & {
    preload?: "intent" | "render" | "viewport" | false;
    activeStyle?: CSSProperties;
    activeClassName?: string;
  };

export function Link<P extends Paths>(props: LinkProps<P>): ReactNode {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const href = router.resolvePath(props);
  const currentPath = _useSubscribe(router, () => router.history.getPath());
  const possibleRoute = useMemo(
    () => router.getRouteMatch(href),
    [router, href]
  );

  const {
    to,
    replace,
    data,
    params,
    search,
    preload = router.defaultPreload,
    activeStyle,
    activeClassName,
    style,
    className,
    ...rest
  } = props;

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

  useEffect(() => {
    if (preload === "render") {
      possibleRoute?.preload();
    } else if (preload === "viewport" && ref.current) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            possibleRoute?.preload();
            observer.disconnect();
          }
        });
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [preload, possibleRoute]);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    rest.onClick?.(event);
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      event.defaultPrevented
    )
      return;
    event.preventDefault();
    router.history.push(href, replace, data);
  };

  const onFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    rest.onFocus?.(event);
    if (preload === "intent" && !event.defaultPrevented) {
      possibleRoute?.preload();
    }
  };

  const onPointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    rest.onPointerEnter?.(event);
    if (preload === "intent" && !event.defaultPrevented) {
      possibleRoute?.preload();
    }
  };

  return createElement("a", {
    ...rest,
    ...activeProps,
    ref: mergeRefs(rest.ref, ref),
    href,
    onClick,
    onFocus,
    onPointerEnter
  });
}
