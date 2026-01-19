import { createContext, type ComponentType } from "react";
import type { Router } from "../router";

export const routerContext = createContext<Router | undefined>(undefined);

export const outletContext = createContext<ComponentType | undefined>(
  undefined
);
