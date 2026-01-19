import type { ComponentType } from "react";

export type ComponentLoader = () => Promise<{ default: ComponentType }>;
