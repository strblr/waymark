import type { ComponentType, Ref } from "react";

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
