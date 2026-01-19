import type { ComponentType } from "react";

export type ComponentLoader = () => Promise<
  ComponentType | { default: ComponentType }
>;
