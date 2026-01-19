import { createElement, type ComponentType } from "react";
import { outletContext } from "../react";

export type ComponentFactory = (next: ComponentType) => ComponentType;

export type ComponentLoader = () => Promise<{ default: ComponentType }>;

export function wrapComponent(
  content: ComponentType,
  parentFactory: ComponentFactory
): ComponentFactory {
  return next => {
    const wrappedNext = () =>
      createElement(
        outletContext.Provider,
        { value: next },
        createElement(content)
      );
    return parentFactory(wrappedNext);
  };
}
