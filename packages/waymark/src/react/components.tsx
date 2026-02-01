import {
  useRef,
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
  useEffect,
  isValidElement,
  cloneElement,
  type ReactNode,
  type MouseEvent,
  type FocusEvent,
  type PointerEvent,
  type RefAttributes,
  type AnchorHTMLAttributes
} from "react";
import { useRouter, useOutlet, useMatch, useSubscribe } from "./hooks";
import { RouterContext, MatchContext, OutletContext } from "./contexts";
import { Router } from "../router";
import { mergeRefs, useEvent } from "../utils";
import type {
  RouterOptions,
  Pattern,
  NavigateOptions,
  LinkOptions
} from "../types";

// RouterRoot

export type RouterRootProps = RouterOptions | { router: Router };

export function RouterRoot(props: RouterRootProps) {
  const [router] = useState(() =>
    "router" in props ? props.router : new Router(props)
  );
  const path = useSubscribe(router, router.history.getPath);
  const match = useMemo(() => router.matchAll(path), [router, path]);
  if (!match) {
    console.error("[Waymark] No matching route found for path:", path);
  }
  return useMemo<ReactNode>(
    () => (
      <RouterContext.Provider value={router}>
        <MatchContext.Provider value={match}>
          {match?.route._.components.reduceRight<ReactNode>(
            (acc, Comp) => (
              <OutletContext.Provider value={acc}>
                <Comp />
              </OutletContext.Provider>
            ),
            null
          )}
        </MatchContext.Provider>
      </RouterContext.Provider>
    ),
    [router, match]
  );
}

// Outlet

export function Outlet() {
  return useOutlet();
}

// Navigate

export type NavigateProps<P extends Pattern> = NavigateOptions<P>;

export function Navigate<P extends Pattern>(props: NavigateProps<P>) {
  const router = useRouter();
  useLayoutEffect(() => router.navigate(props), []);
  if (router.ssrContext) {
    router.ssrContext.redirect = router.createUrl(props);
  }
  return null;
}

// Link

export type LinkProps<P extends Pattern> = NavigateOptions<P> &
  LinkOptions &
  AnchorHTMLAttributes<HTMLAnchorElement> &
  RefAttributes<HTMLAnchorElement> & { asChild?: boolean };

export function Link<P extends Pattern>(props: LinkProps<P>): ReactNode {
  const router = useRouter();
  const {
    to,
    replace,
    state,
    params,
    search: _search,
    strict,
    preload,
    preloadDelay = 50,
    style,
    className,
    activeStyle,
    activeClassName,
    asChild,
    children,
    ...rest
  } = {
    ...router.defaultLinkOptions,
    ...props
  };

  const ref = useRef<HTMLAnchorElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const url = router.createUrl(props);
  const active = !!useMatch({ from: props.to, strict, params });
  const preloadRoute = useEvent(() => router.preload(props));

  const cancelPreload = useCallback(() => {
    clearTimeout(timeoutRef.current!);
  }, []);

  const schedulePreload = useCallback(() => {
    cancelPreload();
    timeoutRef.current = setTimeout(preloadRoute, preloadDelay);
  }, [preloadDelay, cancelPreload]);

  const activeProps = useMemo(() => {
    return {
      ["data-active"]: active,
      style: { ...style, ...(active && activeStyle) },
      className:
        [className, active && activeClassName].filter(Boolean).join(" ") ||
        undefined
    };
  }, [active, style, className, activeStyle, activeClassName]);

  useEffect(() => {
    if (preload === "render") {
      schedulePreload();
    } else if (preload === "viewport" && ref.current) {
      const observer = new IntersectionObserver(entries =>
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            schedulePreload();
          } else {
            cancelPreload();
          }
        })
      );
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
        cancelPreload();
      };
    }
    return cancelPreload;
  }, [preload, schedulePreload, cancelPreload]);

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
    router.navigate({ url, replace, state });
  };

  const onFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    rest.onFocus?.(event);
    if (preload === "intent" && !event.defaultPrevented) {
      schedulePreload();
    }
  };

  const onBlur = (event: FocusEvent<HTMLAnchorElement>) => {
    rest.onBlur?.(event);
    if (preload === "intent") {
      cancelPreload();
    }
  };

  const onPointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    rest.onPointerEnter?.(event);
    if (preload === "intent" && !event.defaultPrevented) {
      schedulePreload();
    }
  };

  const onPointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    rest.onPointerLeave?.(event);
    if (preload === "intent") {
      cancelPreload();
    }
  };

  const anchorProps = {
    ...rest,
    ...activeProps,
    ref: mergeRefs(ref, rest.ref),
    href: url,
    onClick,
    onFocus,
    onBlur,
    onPointerEnter,
    onPointerLeave
  };

  return asChild && isValidElement(children) ? (
    cloneElement(children, anchorProps)
  ) : (
    <a {...anchorProps}>{children}</a>
  );
}
