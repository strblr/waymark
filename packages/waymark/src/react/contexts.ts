import { createContext, type ReactNode } from "react";
import type { Router } from "../router";

export const routerContext = createContext<Router | undefined>(undefined);

export const outletContext = createContext<ReactNode>(null);
