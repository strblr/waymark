import {
  Suspense,
  Component,
  type Ref,
  type ReactNode,
  type ComponentType
} from "react";
import { useOutlet } from "../react";

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

export function suspenseBoundary(Comp: ComponentType): ComponentType {
  return () => <Suspense fallback={<Comp />}>{useOutlet()}</Suspense>;
}

export function errorBoundary(
  Comp: ComponentType<{ error: unknown }>
): ComponentType {
  type Props = { children: ReactNode };
  type State = { children: ReactNode; error: null | [unknown] };

  class Catch extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = { children: props.children, error: null };
    }

    static getDerivedStateFromError(error: unknown) {
      return { error: [error] };
    }

    static getDerivedStateFromProps(props: Props, state: State) {
      if (props.children !== state.children) {
        return { children: props.children, error: null };
      }
      return state;
    }

    render() {
      return this.state.error ? (
        <Comp error={this.state.error[0]} />
      ) : (
        this.props.children
      );
    }
  }

  return () => <Catch>{useOutlet()}</Catch>;
}
