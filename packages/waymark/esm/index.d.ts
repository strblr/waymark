import * as react2 from "react";
import { AnchorHTMLAttributes, CSSProperties, ComponentType, ReactNode, RefAttributes } from "react";
import * as regexparam0 from "regexparam";
import * as type_fest0 from "type-fest";
import { EmptyObject } from "type-fest";
import { StandardSchemaV1 } from "@standard-schema/spec";

//#region src/utils/types.d.ts
type NormalizePath<P extends string> = RemoveTrailingSlash<DedupSlashes<`/${P}`>>;
type DedupSlashes<P extends string> = P extends `${infer Prefix}//${infer Rest}` ? `${Prefix}${DedupSlashes<`/${Rest}`>}` : P;
type RemoveTrailingSlash<P extends string> = P extends `${infer Prefix}/` ? Prefix extends "" ? "/" : Prefix : P;
type MaybeKey<K extends string, T> = T extends EmptyObject ? { [P in K]?: EmptyObject } : {} extends T ? { [P in K]?: T } : { [P in K]: T };
//#endregion
//#region src/types.d.ts
interface Register {}
type RouteList = Register extends {
  routes: infer RouteList extends ReadonlyArray<Route>;
} ? RouteList : ReadonlyArray<Route>;
type Handle = Register extends {
  handle: infer Handle;
} ? Handle : any;
type Pattern = RouteList[number]["pattern"];
type GetRoute<P extends Pattern> = Extract<RouteList[number], {
  pattern: P;
}>;
type Params<P extends Pattern> = NonNullable<GetRoute<P>["_"]["_params"]>;
type Search<P extends Pattern> = NonNullable<GetRoute<P>["_"]["_search"]>;
type MatchOptions<P extends Pattern> = {
  from: P | GetRoute<P>;
  strict?: boolean;
  params?: Partial<Params<P>>;
};
type Match<P extends Pattern = Pattern> = {
  route: GetRoute<P>;
  params: Params<P>;
};
type NavigateOptions<P extends Pattern> = {
  to: P | GetRoute<P>;
  replace?: boolean;
  state?: any;
} & MaybeKey<"params", Params<P>> & MaybeKey<"search", Search<P>>;
interface HistoryPushOptions {
  url: string;
  replace?: boolean;
  state?: any;
}
interface HistoryLike {
  getPath: () => string;
  getSearch: () => Record<string, unknown>;
  getState: () => any;
  go: (delta: number) => void;
  push: (options: HistoryPushOptions) => void;
  subscribe: (listener: () => void) => () => void;
}
type Updater<T extends object> = Partial<T> | ((prev: T) => Partial<T>);
type ComponentLoader = () => Promise<ComponentType | {
  default: ComponentType;
}>;
//#endregion
//#region src/route.d.ts
declare function route<P extends string>(pattern: P): Route<NormalizePath<P>, regexparam0.RouteParams<NormalizePath<P>> extends infer T ? { [KeyType in keyof T]: T[KeyType] } : never, {}>;
declare class Route<P extends string = string, Ps extends {} = any, S extends {} = any> {
  readonly pattern: P;
  readonly _: {
    _params?: Ps;
    _search?: S;
    keys: string[];
    regex: RegExp;
    looseRegex: RegExp;
    weights: number[];
    mapSearch: (search: Record<string, unknown>) => S;
    handles: Handle[];
    components: ComponentType[];
    preloaded: boolean;
    preloaders: (() => Promise<any>)[];
  };
  constructor(pattern: P, mapSearch: (search: Record<string, unknown>) => S, handles: Handle[], components: ComponentType[], preloaders: (() => Promise<any>)[]);
  route<P2 extends string>(subPattern: P2): Route<NormalizePath<`${P}/${P2}`>, regexparam0.RouteParams<NormalizePath<`${P}/${P2}`>> extends infer T ? { [KeyType in keyof T]: T[KeyType] } : never, S>;
  search<S2 extends {}>(mapper: ((search: S & Record<string, unknown>) => S2) | StandardSchemaV1<Record<string, unknown>, S2>): Route<P, Ps, (type_fest0.PickIndexSignature<S> extends infer T_1 ? { [Key in keyof T_1 as Key extends keyof type_fest0.PickIndexSignature<{ [K in keyof S2 as undefined extends S2[K] ? never : K]: S2[K] } & { [K_1 in keyof S2 as undefined extends S2[K_1] ? K_1 : never]?: S2[K_1] | undefined } extends infer T_2 ? { [KeyType_1 in keyof T_2]: T_2[KeyType_1] } : never> ? never : Key]: T_1[Key] } : never) & type_fest0.PickIndexSignature<{ [K in keyof S2 as undefined extends S2[K] ? never : K]: S2[K] } & { [K_1 in keyof S2 as undefined extends S2[K_1] ? K_1 : never]?: S2[K_1] | undefined } extends infer T_2 ? { [KeyType_1 in keyof T_2]: T_2[KeyType_1] } : never> & (type_fest0.OmitIndexSignature<S> extends infer T_3 ? { [Key_1 in keyof T_3 as Key_1 extends keyof type_fest0.OmitIndexSignature<{ [K in keyof S2 as undefined extends S2[K] ? never : K]: S2[K] } & { [K_1 in keyof S2 as undefined extends S2[K_1] ? K_1 : never]?: S2[K_1] | undefined } extends infer T_4 ? { [KeyType_1 in keyof T_4]: T_4[KeyType_1] } : never> ? never : Key_1]: T_3[Key_1] } : never) & type_fest0.OmitIndexSignature<{ [K in keyof S2 as undefined extends S2[K] ? never : K]: S2[K] } & { [K_1 in keyof S2 as undefined extends S2[K_1] ? K_1 : never]?: S2[K_1] | undefined } extends infer T_4 ? { [KeyType_1 in keyof T_4]: T_4[KeyType_1] } : never> extends infer T ? { [KeyType in keyof T]: T[KeyType] } : never>;
  handle(handle: Handle): Route<P, Ps, S>;
  preloader(preloader: () => Promise<any>): Route<P, Ps, S>;
  component(component: ComponentType): Route<P, Ps, S>;
  lazy(loader: ComponentLoader): Route<P, Ps, S>;
  suspense(fallback: ComponentType): Route<P, Ps, S>;
  error(fallback: ComponentType<{
    error: unknown;
  }>): Route<P, Ps, S>;
  preload(): Promise<void>;
  toString(): P;
}
//#endregion
//#region src/react/components.d.ts
type RouterRootProps = RouterOptions | {
  router: Router;
};
declare function RouterRoot(props: RouterRootProps): ReactNode;
declare function Outlet(): ReactNode;
type NavigateProps<P extends Pattern> = NavigateOptions<P>;
declare function Navigate<P extends Pattern>(props: NavigateProps<P>): null;
type LinkProps<P extends Pattern> = NavigateOptions<P> & LinkOptions & AnchorHTMLAttributes<HTMLAnchorElement> & RefAttributes<HTMLAnchorElement> & {
  asChild?: boolean;
};
interface LinkOptions {
  strict?: boolean;
  preload?: "intent" | "render" | "viewport" | false;
  style?: CSSProperties;
  className?: string;
  activeStyle?: CSSProperties;
  activeClassName?: string;
}
declare function Link<P extends Pattern>(props: LinkProps<P>): ReactNode;
//#endregion
//#region src/react/hooks.d.ts
declare function useRouter(): Router;
declare function useHandles(): Handle[];
declare function useOutlet(): react2.ReactNode;
declare function useSubscribe<T>(router: Router, getSnapshot: () => T): T;
declare function useNavigate(): <P extends Pattern>(options: number | HistoryPushOptions | NavigateOptions<P>) => void;
declare function useLocation(): {
  path: string;
  search: Record<string, unknown>;
  state: any;
};
declare function useMatch<P extends Pattern>(options: MatchOptions<P>): Match<P> | null;
declare function useParams<P extends Pattern>(from: P | GetRoute<P>): Params<P>;
declare function useSearch<P extends Pattern>(from: P | GetRoute<P>): readonly [Search<P>, (update: Updater<Search<P>>, replace?: boolean) => void];
//#endregion
//#region src/react/contexts.d.ts
declare const RouterContext: react2.Context<Router | null>;
declare const MatchContext: react2.Context<Match | null>;
declare const OutletContext: react2.Context<ReactNode>;
//#endregion
//#region src/router/router.d.ts
interface RouterOptions {
  basePath?: string;
  routes: RouteList;
  history?: HistoryLike;
  defaultLinkOptions?: LinkOptions;
}
declare class Router {
  readonly basePath: string;
  readonly routes: RouteList;
  readonly history: HistoryLike;
  readonly defaultLinkOptions?: LinkOptions;
  private readonly _;
  constructor(options: RouterOptions);
  getRoute<P extends Pattern>(pattern: P | GetRoute<P>): GetRoute<P>;
  match<P extends Pattern>(path: string, options: MatchOptions<P>): Match<P> | null;
  matchAll(path: string): Match | null;
  createUrl<P extends Pattern>(options: NavigateOptions<P>): string;
  navigate<P extends Pattern>(options: NavigateOptions<P> | HistoryPushOptions | number): void;
}
//#endregion
//#region src/router/browser-history.d.ts
declare class BrowserHistory implements HistoryLike {
  private static patchKey;
  private memo?;
  constructor();
  protected getSearchMemo: (search: string) => Record<string, unknown>;
  getPath: () => string;
  getSearch: () => Record<string, unknown>;
  getState: () => any;
  go: (delta: number) => void;
  push: (options: HistoryPushOptions) => void;
  subscribe: (listener: () => void) => () => void;
}
//#endregion
//#region src/router/memory-history.d.ts
interface MemoryLocation {
  path: string;
  search: Record<string, unknown>;
  state: any;
}
declare class MemoryHistory implements HistoryLike {
  private stack;
  private index;
  private listeners;
  constructor(url?: string);
  private getCurrent;
  getPath: () => string;
  getSearch: () => Record<string, unknown>;
  getState: () => any;
  go: (delta: number) => void;
  push: (options: HistoryPushOptions) => void;
  subscribe: (listener: () => void) => () => void;
}
//#endregion
//#region src/router/hash-history.d.ts
declare class HashHistory extends BrowserHistory {
  private getHashUrl;
  getPath: () => string;
  getSearch: () => Record<string, unknown>;
  push: (options: HistoryPushOptions) => void;
}
//#endregion
export { BrowserHistory, ComponentLoader, GetRoute, Handle, HashHistory, HistoryLike, HistoryPushOptions, Link, LinkOptions, LinkProps, Match, MatchContext, MatchOptions, MemoryHistory, MemoryLocation, Navigate, NavigateOptions, NavigateProps, Outlet, OutletContext, Params, Pattern, Register, Route, RouteList, Router, RouterContext, RouterOptions, RouterRoot, RouterRootProps, Search, Updater, route, useHandles, useLocation, useMatch, useNavigate, useOutlet, useParams, useRouter, useSearch, useSubscribe };