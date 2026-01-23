import {
  useMemo,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  createElement,
  isValidElement,
  cloneElement,
  type ReactNode,
  type MouseEvent,
  type FocusEvent,
  type PointerEvent,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type RefAttributes
} from "react";
import { routerContext, routeContext, outletContext } from "./contexts";
import { useRouter, useOutlet, useSubscribe, useNavigate } from "./hooks";
import { Router, type RouterOptions } from "../router";
import { joinHref, mergeRefs } from "../utils";
import type { Patterns, NavigateOptions } from "../types";

// RouterRoot

export type RouterRootProps = RouterOptions | { router: Router };

export function RouterRoot(props: RouterRootProps) {
  const [router] = useState(() =>
    "router" in props ? props.router : new Router(props)
  );
  const path = useSubscribe(router, router.history.getPath);
  const route = useMemo(() => router.matchPath(path), [router, path]);
  if (!route) {
    console.error("[Waymark] No route found for path:", path);
  }
  return useMemo<ReactNode>(() => {
    return createElement(
      routerContext.Provider,
      { value: router },
      createElement(
        routeContext,
        { value: route },
        route?._.components.reduceRight<ReactNode>(
          (acc, comp) =>
            createElement(
              outletContext.Provider,
              { value: acc },
              createElement(comp)
            ),
          null
        )
      )
    );
  }, [router, route]);
}

// Outlet

export function Outlet() {
  return useOutlet();
}

// Navigate

export type NavigateProps<P extends Patterns> = NavigateOptions<P>;

export function Navigate<P extends Patterns>(props: NavigateProps<P>) {
  const navigate = useNavigate();
  useLayoutEffect(() => navigate(props), []);
  return null;
}

// Link

export type LinkProps<P extends Patterns> = NavigateOptions<P> &
  LinkOptions &
  AnchorHTMLAttributes<HTMLAnchorElement> &
  RefAttributes<HTMLAnchorElement> & { asChild?: boolean };

export interface LinkOptions {
  preload?: "intent" | "render" | "viewport" | false;
  activeStrict?: boolean;
  activeStyle?: CSSProperties;
  activeClassName?: string;
}

export function Link<P extends Patterns>(props: LinkProps<P>): ReactNode {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const { path, search } = router.compose(props);
  const currentPath = useSubscribe(router, router.history.getPath);
  const route = useMemo(() => router.matchPath(path), [router, path]);

  const {
    to,
    replace,
    state,
    params,
    search: search_,
    preload,
    activeStrict,
    activeStyle,
    activeClassName,
    asChild,
    style,
    className,
    children,
    ...rest
  } = {
    ...router.defaultLinkOptions,
    ...props
  };

  const activeProps = useMemo(() => {
    const active = activeStrict
      ? currentPath === path
      : currentPath.startsWith(path);
    return {
      ["data-active"]: active,
      style: { ...style, ...(active && activeStyle) },
      className:
        [className, active && activeClassName].filter(Boolean).join(" ") ||
        undefined
    };
  }, [
    path,
    currentPath,
    style,
    className,
    activeStrict,
    activeStyle,
    activeClassName
  ]);

  useEffect(() => {
    if (preload === "render") {
      route?.preload();
    } else if (preload === "viewport" && ref.current) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            route?.preload();
            observer.disconnect();
          }
        });
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [preload, route]);

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
    router.history.push({ path, search, replace, state });
  };

  const onFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    rest.onFocus?.(event);
    if (preload === "intent" && !event.defaultPrevented) {
      route?.preload();
    }
  };

  const onPointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    rest.onPointerEnter?.(event);
    if (preload === "intent" && !event.defaultPrevented) {
      route?.preload();
    }
  };

  const anchorProps = {
    ...rest,
    ...activeProps,
    ref: mergeRefs(rest.ref, ref),
    href: joinHref(path, search),
    onClick,
    onFocus,
    onPointerEnter
  };

  return asChild && isValidElement(children)
    ? cloneElement(children, anchorProps)
    : createElement("a", { ...anchorProps, children });
}
