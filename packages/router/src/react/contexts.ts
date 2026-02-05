import { createContext, type ReactNode } from "react";
import type { Router } from "../router";
import type { Match, HistoryLocation } from "../types";

export const RouterContext = createContext<Router | null>(null);

export const LocationContext = createContext<HistoryLocation | null>(null);

export const MatchContext = createContext<Match | null>(null);

export const OutletContext = createContext<ReactNode>(null);
