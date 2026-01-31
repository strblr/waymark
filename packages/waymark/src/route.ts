import { lazy, memo, type ComponentType } from "react";
import type { Merge } from "type-fest";
import type {
  Handle,
  Middleware,
  Validator,
  PreloadContext,
  ComponentLoader
} from "./types";
import {
  normalizePath,
  parsePattern,
  suspenseBoundary,
  errorBoundary,
  validator,
  type ParsePattern,
  type NormalizePath,
  type OptionalOnUndefined
} from "./utils";

export function route<P extends string>(
  pattern: P
): Route<NormalizePath<P>, ParsePattern<NormalizePath<P>>, {}> {
  return new Route({
    ...parsePattern(normalizePath(pattern)),
    validate: search => search,
    handles: [],
    components: [],
    preloads: []
  });
}

export function middleware(): Middleware<{}> {
  return route("");
}

export class Route<
  P extends string = string,
  Ps extends {} = any,
  S extends {} = any
> implements Middleware<S>
{
  readonly _: {
    pattern: P;
    keys: string[];
    regex: RegExp;
    looseRegex: RegExp;
    weights: number[];
    validate: (search: Record<string, unknown>) => S;
    handles: Handle[];
    components: ComponentType[];
    preloads: ((context: PreloadContext) => Promise<any>)[];
  };

  readonly _types!: {
    params: Ps;
    search: S;
  };

  constructor(_: typeof this._) {
    this._ = _;
  }

  route = <P2 extends string>(
    pattern: P2
  ): Route<
    NormalizePath<`${P}/${P2}`>,
    ParsePattern<NormalizePath<`${P}/${P2}`>>,
    S
  > => {
    return new Route({
      ...this._,
      ...parsePattern(normalizePath(`${this._.pattern}/${pattern}`))
    });
  };

  use = <S2 extends {}>(
    middleware: Middleware<S2>
  ): Route<P, Ps, Merge<S, OptionalOnUndefined<S2>>> => {
    const { _ } = middleware as Route<never, never, S2>;
    return new Route({
      ...this._,
      handles: [...this._.handles, ..._.handles],
      components: [...this._.components, ..._.components],
      preloads: [...this._.preloads, ..._.preloads]
    }).search(_.validate);
  };

  search = <S2 extends {}>(
    validate: Validator<S, S2>
  ): Route<P, Ps, Merge<S, OptionalOnUndefined<S2>>> => {
    validate = validator(validate);
    return new Route({
      ...this._,
      validate: search => {
        const validated = this._.validate(search);
        return { ...validated, ...validate({ ...search, ...validated }) };
      }
    });
  };

  handle = (handle: Handle): Route<P, Ps, S> => {
    return new Route({ ...this._, handles: [...this._.handles, handle] });
  };

  preload = (
    preload: (context: PreloadContext<Ps, S>) => Promise<any>
  ): Route<P, Ps, S> => {
    return new Route({
      ...this._,
      preloads: [
        ...this._.preloads,
        context =>
          preload({
            params: context.params as Ps,
            search: this._.validate(context.search)
          })
      ]
    });
  };

  component = (component: ComponentType): Route<P, Ps, S> => {
    return new Route({
      ...this._,
      components: [...this._.components, memo(component)]
    });
  };

  lazy = (loader: ComponentLoader): Route<P, Ps, S> => {
    const component = lazy(async () => {
      const result = await loader();
      return "default" in result ? result : { default: result };
    });
    return this.preload(loader).component(component);
  };

  suspense = (fallback: ComponentType): Route<P, Ps, S> => {
    return this.component(suspenseBoundary(fallback));
  };

  error = (fallback: ComponentType<{ error: unknown }>): Route<P, Ps, S> => {
    return this.component(errorBoundary(fallback));
  };

  toString = (): P => {
    return this._.pattern;
  };
}
