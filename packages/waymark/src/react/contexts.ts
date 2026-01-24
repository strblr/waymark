import { createContext, type ReactNode } from "react";
import type { Router } from "../router";
import type { Match } from "../types";

export const routerContext = createContext<Router | null>(null);

export const matchContext = createContext<Match | null>(null);

export const outletContext = createContext<ReactNode>(null);
