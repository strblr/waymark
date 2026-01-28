import {
  useRef,
  Suspense,
  Component,
  useInsertionEffect,
  type Ref,
  type RefObject,
  type ReactNode,
  type ComponentType
} from "react";
import { useOutlet } from "../react";

export function mergeRefs<T>(own: RefObject<T | null>, other?: Ref<T>): Ref<T> {
  if (!other) return own;
  return value => {
    own.current = value;
    const cleanup =
      typeof other === "function" ? other(value) : void (other.current = value);
    return (
      cleanup &&
      (() => {
        own.current = null;
        cleanup();
      })
    );
  };
}

export function useEvent<F extends (...args: any[]) => any>(fn: F) {
  const ref = useRef(fn);
  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useRef(((...args) => ref.current(...args)) as F).current;
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
