import { createElement, Component, type ComponentType, type Ref } from "react";
import { _useSubscribe, Outlet, useRouter } from "../react";
import { getHref } from "./misc";

export type Updater<T extends object> = Partial<T> | ((prev: T) => Partial<T>);

export type ComponentLoader = () => Promise<
  ComponentType | { default: ComponentType }
>;

export function defaultLinkActive(currentPath: string, targetPath: string) {
  return currentPath.startsWith(targetPath);
}

export function mergeRefs<T>(...inputRefs: (Ref<T> | undefined)[]): Ref<T> {
  const filtered = inputRefs.filter(r => !!r);
  if (filtered.length <= 1) {
    return filtered[0] ?? null;
  }
  return value => {
    const cleanups: (() => void)[] = [];
    for (const ref of filtered) {
      const cleanup = assignRef(ref, value);
      cleanups.push(cleanup ?? (() => assignRef(ref, null)));
    }
    return () => cleanups.forEach(cleanup => cleanup());
  };
}

function assignRef<T>(ref: Ref<T>, value: T) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export function errorBoundary(
  component: ComponentType<{ error: unknown }>
): ComponentType {
  type Props = { href: string };
  type State = { href: string; error: null | [unknown] };

  class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = { href: props.href, error: null };
    }

    static getDerivedStateFromError(error: unknown) {
      return { error: [error] };
    }

    static getDerivedStateFromProps(props: Props, state: State) {
      return {
        href: props.href,
        error: props.href === state.href ? state.error : null
      };
    }

    render() {
      return this.state.error
        ? createElement(component, { error: this.state.error[0] })
        : createElement(Outlet);
    }
  }

  return () => {
    const router = useRouter();
    const href = _useSubscribe(router, () => {
      const path = router.history.getPath();
      const search = router.history.getSearch();
      return getHref(path, search);
    });
    return createElement(ErrorBoundary, { href });
  };
}
