import { createContext, type ReactNode } from "react";
import type { Router } from "../router";
import type { Route } from "../route";

export const routerContext = createContext<Router | undefined>(undefined);

export const routeContext = createContext<Route | undefined>(undefined);

export const outletContext = createContext<ReactNode>(null);
