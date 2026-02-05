<p align="center">
  <img src="https://raw.githubusercontent.com/strblr/typeroute/master/banner.svg" alt="TypeRoute" />
</p>

<p align="center">
  A type-safe router for React that just works.
</p>

<div align="center">
  <a href="https://www.npmjs.com/package/@typeroute/router">
    <img
      src="https://img.shields.io/npm/v/%40typeroute%2Frouter?style=flat-square&color=0B0D0F&labelColor=0B0D0F"
      alt="npm version"
    />
  </a>
  <a href="https://www.npmjs.com/package/@typeroute/router">
    <img
      src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/@typeroute/router/dist/index.js?compression=gzip&label=gzip&style=flat-square&color=0B0D0F&labelColor=0B0D0F"
      alt="gzip size"
    />
  </a>
  <a href="https://github.com/strblr/typeroute/blob/master/LICENSE">
    <img
      src="https://img.shields.io/npm/l/%40typeroute%2Frouter?style=flat-square&color=0B0D0F&labelColor=0B0D0F"
      alt="license"
    />
  </a>
  <a href="https://github.com/sponsors/strblr">
    <img
      src="https://img.shields.io/github/sponsors/strblr?style=flat-square&color=0B0D0F&labelColor=0B0D0F"
      alt="sponsors"
    />
  </a>
</div>

<p align="center">
  📖 <a href="https://typeroute.com">typeroute.com</a> · 🎮 <a href="https://stackblitz.com/edit/typeroute-demo?file=src%2Fapp.tsx">Live playground</a>
</p>

---

TypeRoute is a routing library for React built around three core ideas: **type safety**, **simplicity**, and **minimal overhead**.

- 🔒 **Fully type-safe** - Complete TypeScript inference for routes, path params, search params, and more
- ⚡ **Zero config** - No build plugins, no CLI, no codegen, no config files, very low boilerplate
- 🪶 **4kB gzipped** - Extremely lightweight, dependency included
- 🤝 **Familiar API** - If you've used React Router or TanStack Router, you'll feel at home
- 🎯 **Feature packed** - Search param validation, lazy loading, data preloading, SSR, error boundaries, etc.
- 🧠 **Not vibe-coded** - Built with careful design and attention to detail by a human
- ✨ **Just works** - Simple setup, predictable behavior that never gets in your way

---

# Comparison

| Feature                          | TypeRoute | React Router | TanStack Router | Wouter |
| -------------------------------- | :-------: | :----------: | :-------------: | :----: |
| **Bundle size (gzip)**\*         |   ~4kB    |    ~26kB+    |     ~19kB+      | ~2.2kB |
| **Zero config**\*                |    ✅     |      ❌      |       ⚠️        |   ✅   |
| **Full type inference**\*        |    ✅     |      ⚠️      |       ✅        |   ❌   |
| **Nested routes**                |    ✅     |      ✅      |       ✅        |   ✅   |
| **Search param validation**\*    |    ✅     |      ❌      |       ✅        |   ❌   |
| **Lazy loading**                 |    ✅     |      ✅      |       ✅        |   ❌   |
| **Data preloading**              |    ✅     |      ✅      |       ✅        |   ❌   |
| **Built-in error boundaries**    |    ✅     |      ✅      |       ✅        |   ❌   |
| **Built-in suspense boundaries** |    ✅     |      ❌      |       ✅        |   ❌   |
| **Link preloading strategies**   |    ✅     |      ✅      |       ✅        |   ❌   |
| **Active link detection**        |    ✅     |      ✅      |       ✅        |   ⚠️   |
| **Browser/Hash/Memory history**  |    ✅     |      ✅      |       ✅        |   ✅   |
| **SSR support**                  |    ✅     |      ✅      |       ✅        |   ✅   |
| **Route middlewares**\*          |    ✅     |      ❌      |       ❌        |   ❌   |
| **Route handles (metadata)**     |    ✅     |      ✅      |       ✅        |   ❌   |
| **Route match ranking**\*        |    ✅     |      ✅      |       ✅        |   ❌   |
| **View transitions**             |    ✅     |      ✅      |       ✅        |   ✅   |
| **Devtools**                     |    ✅     |      ⚠️      |       ✅        |   ❌   |
| **Navigation blockers**          |    🔨     |      ✅      |       ✅        |   ❌   |
| **File-based routing**           |    ❌     |      ✅      |       ✅        |   ❌   |
| **React Native**                 |    ❌     |      ✅      |       ❌        |   ❌   |

<details>
<summary><b>Comparison notes</b></summary>

<br />

If you believe there's a mistake in the comparison table, please [open an issue](https://github.com/strblr/typeroute/issues) or [submit a PR](https://github.com/strblr/typeroute/pulls) and it will be fixed.

- ⚠️ indicates the feature is only partially supported, supported with heavy boilerplate, or requires external libraries.
- 🔨 indicates the feature is not yet ready but being worked on.
- **Bundle sizes** are approximate gzipped values. React Router and TanStack Router sizes can vary significantly based on imports and versions; TypeRoute's ~4kB includes its single ~0.4kB dependency ([regexparam](https://github.com/lukeed/regexparam)), before any tree shaking. Wouter is the smallest option but lacks features.
- **Zero config** means no CLI tools, build plugins, code generation, or configuration files are required. React Router requires its typegen CLI or bundler plugin for full type safety. Same with TanStack Router for file-based routing. You can use code-based routing but it's more boilerplate.
- **Full type inference** refers to automatic TypeScript inference for routes, params, search params, and navigation without manual type annotations.
- **Search params validation** refers to built-in support for validating and typing URL search parameters. Wouter provides `useSearch()` but no validation layer. Same with React Router and `useSearchParams`.
- **Route middlewares** are reusable configuration bundles (search validation, handles, preload functions, components) that can be applied to multiple routes. This is a TypeRoute-specific feature.
- **Route match ranking** automatically picks the most specific route when multiple patterns match (e.g., `/users/new` wins over `/users/:id`). Without ranking, route definition order matters.

</details>

---

# Table of contents

- [Comparison](#comparison)
- [Showcase](#showcase)
- [Installation](#installation)
- [Defining routes](#defining-routes)
- [Nested routes and layouts](#nested-routes-and-layouts)
- [Setting up the router](#setting-up-the-router)
- [Code organization](#code-organization)
- [Path params](#path-params)
- [Search params](#search-params)
  - [Basic usage](#basic-usage)
  - [JSON-first approach](#json-first-approach)
  - [Inheritance](#inheritance)
  - [Idempotency requirement](#idempotency-requirement)
- [Navigation](#navigation)
  - [The Link component](#the-link-component)
  - [Active state detection](#active-state-detection)
  - [Route preloading](#route-preloading)
  - [Programmatic navigation](#programmatic-navigation)
  - [Declarative navigation](#declarative-navigation)
- [Lazy loading](#lazy-loading)
- [Data preloading](#data-preloading)
- [Error boundaries](#error-boundaries)
- [Suspense boundaries](#suspense-boundaries)
- [Route handles](#route-handles)
- [Middlewares](#middlewares)
- [Route matching and ranking](#route-matching-and-ranking)
- [History implementations](#history-implementations)
- [Devtools](#devtools)
- [Cookbook](#cookbook)
  - [Quick start example](#quick-start-example)
  - [Server-side rendering (SSR)](#server-side-rendering-ssr)
  - [Scroll to top on navigation](#scroll-to-top-on-navigation)
  - [Matching a route anywhere](#matching-a-route-anywhere)
  - [Global link configuration](#global-link-configuration)
  - [History middleware](#history-middleware)
  - [View transitions](#view-transitions)
- [API reference](#api-reference)
  - [Router class](#router-class)
  - [Route class](#route-class)
  - [Middleware](#middleware)
  - [Hooks](#hooks)
  - [Components](#components)
  - [History interface](#history-interface)
  - [Types](#types)
- [Roadmap](#roadmap)
- [License](#license)

---

# Showcase

Here's what routing looks like with TypeRoute:

```tsx
import { route, RouterRoot, Outlet, Link, useParams } from "@typeroute/router";

// Layout
const layout = route("/").component(() => (
  <div>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/users/:id" params={{ id: "42" }}>
        User
      </Link>
    </nav>
    <Outlet />
  </div>
));

// Pages
const home = layout.route("/").component(() => <h1>Home</h1>);

const user = layout.route("/users/:id").component(function UserPage() {
  const { id } = useParams(user); // Fully typed
  return <h1>User {id}</h1>;
});

// Setup
const routes = [home, user];

function App() {
  return <RouterRoot routes={routes} />;
}

declare module "@typeroute/router" {
  interface Register {
    routes: typeof routes;
  }
}
```

Everything autocompletes and type-checks automatically. No heavy setup, no magic, just a simple API that gets out of your way.

👉 [Try it live in the StackBlitz playground](https://stackblitz.com/edit/typeroute-demo?file=src%2Fapp.tsx)

---

# Installation

```bash
npm install @typeroute/router
```

TypeRoute requires React 18 or higher.

---

# Defining routes

Routes are created using the `route()` function, following the [builder pattern](https://dev.to/superviz/design-pattern-7-builder-pattern-10j4). You pass it a path and chain methods to configure the route.

The `.component()` method tells the route what to render when the path matches. It takes a React component and returns a new route instance with that component attached:

```tsx
import { route } from "@typeroute/router";

const home = route("/").component(HomePage);
const about = route("/about").component(AboutPage);
```

Routes support dynamic segments (path params) using the `:param` syntax:

```tsx
const required = route("/posts/:id");
const nested = route("/org/:orgId/team/:teamId");
const optional = route("/book/:title?");
const suffix = route("/movies/:title.(mp4|mov)");
```

And wildcard segments that capture everything after a certain point:

```tsx
const notFound = route("/*").component(NotFoundPage);
const files = route("/files/*").component(FileBrowser);
const optional = route("/books/*?").component(FileBrowser);
```

Route building is immutable: every method on a route returns a new route instance.

---

# Nested routes and layouts

Any route can have child routes. Call `.route()` on an existing route to create one:

```tsx
const dashboard = route("/dashboard").component(DashboardLayout);

const overview = dashboard.route("/").component(Overview);
const settings = dashboard.route("/settings").component(Settings);
const profile = dashboard.route("/profile").component(Profile);
```

Child routes build on their parent's path. So `overview` matches `/dashboard`, `settings` matches `/dashboard/settings`, and `profile` matches `/dashboard/profile`.

They also nest inside the parent's component. The parent renders an `<Outlet />` to mark where child routes should appears:

```tsx
function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

When the URL is `/dashboard/settings`, TypeRoute renders `DashboardLayout` with `Settings` inside the outlet. This is how you build layouts - shared UI like navigation or sidebars that stays mounted as users navigate between child routes.

You can nest as deep as you need:

```tsx
const app = route("/").component(AppShell);
const dashboard = app.route("/dashboard").component(DashboardLayout);
const settings = dashboard.route("/settings").component(SettingsLayout);
const security = settings.route("/security").component(SecurityPage);
```

For the path `/dashboard/settings/security`, this renders:

```
AppShell
  └── DashboardLayout
        └── SettingsLayout
              └── SecurityPage
```

Each level must include an `<Outlet />` to render the next level.

Beyond paths and components, child routes also inherit search param validators, handles, and preload functions from their parent chain. While you can think of nesting as building a tree, every route is self-contained: it carries everything it needs to render, including all parent components.

---

# Setting up the router

Before setting up the router, you need to collect your navigable routes into an array. When building nested route hierarchies, you'll often create intermediate parent routes solely for grouping and shared layouts. These intermediate routes shouldn't be included in your routes array - only the final, navigable routes should be:

```tsx
// Intermediate route used for hierarchy
const layout = route("/").component(Layout);

// Navigable routes that users can actually visit
const home = layout.route("/").component(Home);
const about = layout.route("/about").component(About);

// Collect only the navigable routes
const routes = [home, about]; // ✅ Don't include `layout`
```

This makes sure that only actual pages can be matched and appear in autocomplete. The intermediate routes still exist as part of the hierarchy, they just aren't directly navigable. Note that the order of routes in the array doesn't matter - TypeRoute uses a [ranking algorithm](#route-matching-and-ranking) to pick the most specific match.

The `RouterRoot` component is the entry point to TypeRoute. It listens to URL changes, matches the current path against your routes, and renders the matching route's component hierarchy.

There are two ways to set it up. The simplest is passing your routes array directly to `RouterRoot`. This creates a router instance internally (accessible via `useRouter`):

```tsx
import { RouterRoot } from "@typeroute/router";

const routes = [home, about];

function App() {
  return <RouterRoot routes={routes} />;
}
```

You can also pass a `basePath` if your app lives under a subpath:

```tsx
<RouterRoot routes={routes} basePath="/my-app" />
```

The second approach is to create a `Router` instance outside of React. This gives you a global router instance that can be accessed from non-React contexts (e.g., utility functions, service modules, or other non-React code):

```tsx
import { Router, RouterRoot } from "@typeroute/router";

const router = new Router({ routes });

// Now you can navigate from anywhere
router.navigate({ to: "/about" });

// And pass the instance to RouterRoot
function App() {
  return <RouterRoot router={router} />;
}
```

For full type safety across your app, register your routes using TypeScript's module augmentation. This is a required step for proper autocompletion and type checking:

```tsx
declare module "@typeroute/router" {
  interface Register {
    routes: typeof routes;
  }
}
```

With this in place, `Link`, `navigate`, `useParams`, `useSearch`, and other APIs will know exactly which routes exist and what input they expect.

**You're all set up!**

---

# Code organization

There's no prescribed way to organize your routing code. Since TypeRoute isn't file-based routing, the structure is entirely up to you.

That said, here's a pattern that tends to work well: define each route and its component in the same file, then export the route. This keeps everything related to that page in one place:

```tsx
// pages/home.tsx
import { route } from "@typeroute/router";

export const home = route("/").component(Home);

function Home() {
  return <div>Home page</div>;
}
```

```tsx
// pages/about.tsx
import { route } from "@typeroute/router";

export const about = route("/about").component(About);

function About() {
  return <div>About page</div>;
}
```

Then in your root app component file, import all the routes, register them with module augmentation, and render `RouterRoot`:

```tsx
// app.tsx
import { RouterRoot } from "@typeroute/router";
import { home } from "./pages/home";
import { about } from "./pages/about";

const routes = [home, about];

export function App() {
  return <RouterRoot routes={routes} />;
}

declare module "@typeroute/router" {
  interface Register {
    routes: typeof routes;
  }
}
```

But again, this is just one approach. You could keep all routes in a single file, split them by feature, organize them by route depth, whatever fits your project. TypeRoute doesn't care where the routes come from or how you structure your files.

---

# Path params

Dynamic segments in route patterns become typed path params. Define them with a colon prefix. They can also be made optional.

```tsx
const post = route("/posts/:id").component(PostPage);
const comment = route("/posts/:postId/comments/:commentId?").component(
  CommentPage
);
```

Access parameters with `useParams`, passing the route pattern or object as an argument:

```tsx
function PostPage() {
  const { id } = useParams(post);
  // id is typed as string

  const { id } = useParams("/posts/:id");
  // Also works
}

function CommentPage() {
  const { postId, commentId } = useParams(comment);
  // postId: string
  // commentId?: string | undefined
}
```

Wildcard segments capture everything after a slash. They're defined with `*` and accessed with the key `"*"`:

```tsx
const files = route("/files/*").component(FileBrowser);

function FileBrowser() {
  const params = useParams(files);
  const path = params["*"]; // e.g., "documents/report.pdf"
}
```

---

# Search params

## Basic usage

Search params (the `?key=value` part of URLs) can be typed and validated using the `.search()` method on a route. You can pass either a [Standard Schema](https://standardschema.dev/schema#what-schema-libraries-implement-the-spec) validator like Zod, or a plain validation function.

With Zod:

```tsx
import { z } from "zod";

const searchPage = route("/search")
  .search(
    z.object({
      q: z.string().catch(""),
      page: z.coerce.number().catch(1)
    })
  )
  .component(SearchPage);
```

With a plain function:

```tsx
const searchPage = route("/search")
  .search(raw => ({
    q: String(raw.q ?? ""),
    page: Number(raw.page ?? 1)
  }))
  .component(SearchPage);
```

Since you can't control what users put in the URL, your validator should handle missing or malformed values gracefully - validate and normalize rather than reject.

Access validated search params with `useSearch`, which returns a tuple of the current values and a setter function:

```tsx
function SearchPage() {
  const [search, setSearch] = useSearch(searchPage);
  // search.q: string
  // search.page: number

  const [search, setSearch] = useSearch("/search");
  // Also works
}
```

The setter merges your updates with existing values:

```tsx
setSearch({ page: 2 }); // Only updates page
setSearch(prev => ({ page: prev.page + 1 })); // Increment page
```

Pass `true` as the second argument to replace the history entry instead of pushing:

```tsx
setSearch({ page: 1 }, true);
```

## JSON-first approach

TypeRoute uses a JSON-first approach for search params, similar to TanStack Router. When serializing and deserializing values from the URL:

- Plain strings that aren't valid JSON are kept as-is (and URL-encoded): `"John"` → `?name=John` → `"John"`
- Everything else is JSON-encoded (then URL-encoded):
  - `true` → `?enabled=true` → `true`
  - `"true"` → `?enabled=%22true%22` → `"true"`
  - `[1, 2]` → `?filters=%5B1%2C2%5D` → `[1, 2]`
  - `42` → `count=42` → `42`

This means you can store complex data structures like arrays and objects in search params without manual serialization. When reading from the URL, TypeRoute automatically parses JSON values back to their original types.

The resulting parsed object is what gets passed to the `.search()` function or schema on the route builder. It's typed as `Record<string, unknown>`, which is why validation is useful - it lets you transform these unknown values into a typed, validated shape that your components can safely use.

## Inheritance

When you define search params with a validator on a route, all child routes automatically inherit that validator along with its typing. This makes sense because when a child route matches, parent components also render (parents use outlets to display their children), so parent search params remain relevant.

Here's how it works. Start with a parent route that defines a search param:

```tsx
const dashboard = route("/dashboard")
  .search(
    z.object({
      view: z.enum(["grid", "list"]).catch("grid")
    })
  )
  .component(DashboardLayout);
```

Any child route created from `dashboard` inherits the `view` search param and its validation:

```tsx
const projects = dashboard.route("/projects").component(ProjectsPage);

function ProjectsPage() {
  const [search] = useSearch(projects);
  // search.view is typed as "grid" | "list"
}
```

If a child route needs additional search params, define a new validator with `.search()`. Your validator receives the raw params from the URL merged with the parent's already-validated params. After validation, your result is combined with the parent's validated params to produce the final search params object.

In practice, this means you only need to validate the new params you're adding - the parent's params are automatically included in the final result:

```tsx
const projects = dashboard
  .route("/projects")
  .search(
    z.object({
      status: z.enum(["active", "archived"]).catch("active")
    })
  )
  .component(ProjectsPage);

function ProjectsPage() {
  const [search] = useSearch(projects);
  // search.view: "grid" | "list" (from parent)
  // search.status: "active" | "archived" (from child)
}
```

## Idempotency requirement

The validation function or schema you pass to `.search()` must be **idempotent**, meaning `fn(fn(x))` should equal `fn(x)`.

When you read search params, the values are passed through your validator. When you update search params, the navigation APIs expect values in that same validated format, which are then JSON-encoded back into the URL. On the next read, those encoded values are decoded and passed through your validator again - meaning your validator may receive its own output as input.

---

# Navigation

## The Link component

The `Link` component renders an anchor tag that navigates without a full page reload. It accepts a `to` prop that can be either a route pattern string or a route object:

```tsx
<Link to="/about">About</Link>
<Link to={about}>About</Link>
```

When the route has non-optional path params, you must provide the `params` prop:

```tsx
<Link to="/posts/:id" params={{ id: postId }}>
  View post
</Link>
```

And if the route has search params defined, you can pass them too:

```tsx
<Link to={userProfile} params={{ id: "42" }} search={{ tab: "posts" }}>
  User posts
</Link>
```

To replace the current history entry instead of pushing a new one, use `replace`:

```tsx
<Link to="/login" replace>
  Login
</Link>
```

You can also pass arbitrary state that will be available via `useLocation().state`:

```tsx
<Link to="/checkout" state={{ from: "cart" }}>
  Checkout
</Link>
```

The `asChild` prop lets you use your own component while keeping Link's behavior:

```tsx
<Link to="/profile" asChild>
  <MyCustomAnchor>Go to profile</MyCustomAnchor>
</Link>
```

## Active state detection

Links automatically track whether they match the current URL. When active, they receive a `data-active="true"` attribute and can apply different styles.

By default, a link is considered active if the current path starts with the link's target (called "loose matching"). This means a link to `/dashboard` stays active on `/dashboard/settings`. To require an exact match, use the `strict` prop:

```tsx
<Link to="/dashboard">Active on /dashboard and child routes</Link>
<Link strict to="/dashboard">Active only on /dashboard</Link>
```

You can style active links using the data attribute in CSS:

```css
.nav-link[data-active="true"] {
  font-weight: bold;
  color: blue;
}
```

Or use the `activeClassName` and `activeStyle` props directly:

```tsx
<Link
  to="/dashboard"
  className="nav-link"
  activeClassName="active"
  style={{ opacity: 0.7 }}
  activeStyle={{ opacity: 1 }}
>
  Dashboard
</Link>
```

## Route preloading

Links can optionally trigger route preloading before navigation occurs. When preloading is enabled, any [lazy-loaded components](#lazy-loading) (defined with `.lazy()`) and [preload functions](#data-preloading) (defined with `.preload()`) are called early. This improves perceived performance by loading component bundles and running preparation logic like prefetching data ahead of time.

The `preload` prop controls when preloading happens:

**`preload="intent"`** preloads when the user shows intent to navigate by hovering or focusing the link. This is the most common choice as it balances eager loading with not wasting bandwidth:

```tsx
<Link to="/heavy-page" preload="intent">
  Heavy page
</Link>
```

**`preload="render"`** preloads as soon as the link mounts. Use this for routes you're confident the user will visit:

```tsx
<Link to="/next-step" preload="render">
  Next step
</Link>
```

**`preload="viewport"`** uses an Intersection Observer to preload when the link scrolls into view. Good for links further down the page and mobile:

```tsx
<Link to="/section" preload="viewport">
  See more
</Link>
```

**`preload={false}`** disables preloading entirely. This is the default.

To prevent unwanted preloads from quick hover/focus interactions, Link waits 50ms before triggering. You can customize this with `preloadDelay`:

```tsx
<Link to="/heavy-page" preload="intent" preloadDelay={100}>
  Heavy page
</Link>
```

You can also preload programmatically using `router.preload()`:

```tsx
const router = useRouter();
router.preload({ to: userProfile, params: { id: "42" } });
```

To set a preload strategy globally for all links in your app, see [Global link configuration](#global-link-configuration).

## Programmatic navigation

For navigation triggered by code rather than user clicks, use the `useNavigate` hook:

```tsx
import { useNavigate } from "@typeroute/router";

function LoginForm() {
  const navigate = useNavigate();

  const onSubmit = async () => {
    await login();
    navigate({ to: "/dashboard" });
  };

  // ...
}
```

The navigate function accepts the same navigation options as `Link`:

```tsx
navigate({ to: userProfile, params: { id: "42" }, search: { tab: "posts" } });
navigate({ to: "/login", replace: true });
navigate({ to: "/checkout", state: { from: "cart" } });
```

To go back or forward in history, pass a number:

```tsx
navigate(-1); // Go back
navigate(1); // Go forward
navigate(-2); // Go back two steps
```

You can also access the router directly via `useRouter()` (or import the router if created outside of React) and call its `navigate` method, which works the same way:

```tsx
router.navigate({ to: "/login" });
```

For unsafe navigation that bypasses type checking, you can pass `url` instead of `to`, `params` and `search`. This is useful when you don't know the target URL statically (e.g., URLs from user input or API responses):

```tsx
// Type-safe navigation
navigate({ to: userProfile, params: { id: "42" } });

// Unsafe navigation - no type checking
navigate({ url: "/some/path?tab=settings" });
navigate({ url: "/callback", replace: true, state: { data: 123 } });
```

## Declarative navigation

For redirects triggered by rendering rather than events, use the `Navigate` component. It navigates as soon as it mounts, making it useful for conditional redirects based on application state:

```tsx
import { Navigate } from "@typeroute/router";

function ProtectedPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div>Protected content</div>;
}
```

The `Navigate` component accepts the same navigation props as the `Link` component:

```tsx
<Navigate to="/users/:id" params={{ id: "42" }} search={{ tab: "posts" }} />
<Navigate to="/home" replace />
<Navigate to={checkout} state={{ from: "cart" }} />
```

Note that `Navigate` uses `useLayoutEffect` internally to ensure the navigation is triggered before the browser repaints the screen.

---

# Lazy loading

Load route components on demand with `.lazy()`. The function you pass should return a dynamic import:

```tsx
const analytics = route("/analytics").lazy(() => import("./AnalyticsPage"));
```

The imported module should use a default export:

```tsx
// AnalyticsPage.tsx
export default function AnalyticsPage() { ... }
```

If you're using a named export, you need to explicitly select which component to use by chaining `.then()` on the import:

```tsx
const analytics = route("/analytics").lazy(() =>
  import("./AnalyticsPage").then(m => m.AnalyticsPage)
);

// AnalyticsPage.tsx
export function AnalyticsPage() { ... }
```

Lazy routes work like any other route. Child routes inherit the parent's lazy-loaded components:

```tsx
const dashboard = route("/dashboard").lazy(() => import("./Dashboard"));
const settings = dashboard.route("/settings").component(Settings);
```

When navigating to `/dashboard/settings`, React loads the dashboard component first, then renders settings inside it. The Dashboard component must include an `<Outlet />` for the child route to appear.

See [Route preloading](#route-preloading) for ways to load these components before the user navigates.

---

# Data preloading

Use `.preload()` to run logic before navigation occurs, typically to prefetch data. Preload functions receive the target route's typed params and search values:

```tsx
const userProfile = route("/users/:id")
  .search(z.object({ tab: z.enum(["posts", "comments"]).catch("posts") }))
  .preload(async ({ params, search }) => {
    await queryClient.prefetchQuery({
      queryKey: ["user", params.id, search.tab],
      queryFn: () => fetchUser(params.id, search.tab)
    });
  })
  .component(UserProfile);
```

See [Route preloading](#route-preloading) for how to trigger preload functions.

Depending on when and how preloading is triggered, these functions may run repeatedly. TypeRoute intentionally doesn't cache or deduplicate the calls - that's the job of your data layer. Libraries like TanStack Query, SWR, or Apollo handle this well. For example, TanStack Query's `staleTime` prevents refetches when data is still fresh:

```tsx
await queryClient.prefetchQuery({
  queryKey: ["user", params.id],
  queryFn: () => fetchUser(params.id),
  staleTime: 60_000 // No refetch within 60s
});
```

Preload functions inherit to child routes:

```tsx
const dashboard = route("/dashboard")
  .preload(prefetchDashboardData)
  .component(DashboardLayout);

const settings = dashboard.route("/settings").component(Settings);
// Preloading /dashboard/settings runs prefetchDashboardData
```

---

# Error boundaries

Catch errors thrown during rendering with `.error()`. The error component receives the error as a prop:

```tsx
const fragile = route("/fragile").error(ErrorFallback).component(FragilePage);

function ErrorFallback({ error }: { error: unknown }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <pre>{String(error)}</pre>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
```

Error boundaries catch errors from all nested content. A common pattern is to place one at the root to catch any unhandled errors:

```tsx
const app = route("/").error(ErrorPage).component(AppLayout);
```

To give new routes a fresh start, the error boundary automatically resets when navigation occurs.

---

# Suspense boundaries

When using lazy loading or React's `use()` hook for data fetching, you may want to add suspense boundaries to show loading states. Add them with `.suspense()`:

```tsx
const dataPage = route("/data")
  .suspense(LoadingPage)
  .lazy(() => import("./DataPage"));

function LoadingPage() {
  return <div>Loading...</div>;
}
```

The suspense boundary wraps everything below it in the route tree. Place it strategically to control which parts of the UI show a loading state.

You can combine suspense with error boundaries:

```tsx
const riskyPage = route("/risky")
  .error(ErrorFallback)
  .suspense(Loading)
  .lazy(() => import("./RiskyPage"));
```

Note: React 19 has a [known throttling behavior](https://github.com/facebook/react/issues/31819) where suspense fallback hiding is delayed by up to 300ms. This can make fast-loading content feel slower than it is. Keep this in mind when designing loading experiences.

---

# Route handles

Handles let you attach static arbitrary metadata to routes. This is useful for breadcrumbs, page titles, access control flags, or any other static data you want to associate with a route.

Define handles with `.handle()`:

```tsx
const dashboard = route("/dashboard")
  .handle({ title: "Dashboard", requiresAuth: true })
  .component(DashboardPage);

const settings = dashboard
  .route("/settings")
  .handle({ title: "Settings" })
  .component(SettingsPage);
```

Access all handles from the current route chain with `useHandles()`. It returns an array of all handles from the root down to the current matching route. This hook can be called from anywhere inside the route tree:

```tsx
function Breadcrumbs() {
  const handles = useHandles();
  return (
    <nav>
      {handles.map((h, i) => (
        <span key={i}>
          {i !== 0 && " / "}
          {h.title}
        </span>
      ))}
    </nav>
  );
}
```

On `/dashboard/settings`, this renders "Dashboard / Settings". You can place the `Breadcrumbs` component anywhere in your app layout, and it will always reflect the current route's handle chain.

For type safety, register your handle type in the module augmentation:

```tsx
declare module "@typeroute/router" {
  interface Register {
    routes: typeof routes;
    handle: { title: string; requiresAuth?: boolean };
  }
}
```

---

# Middlewares

Middlewares bundle reusable configuration that can be applied to multiple routes. Instead of repeating the same configuration across routes, you define it once in a middleware and apply it wherever needed.

Create middleware with the `middleware()` function. It returns a middleware object that supports the same builder methods as routes, except `.route()`.

```tsx
import { middleware } from "@typeroute/router";

const pagination = middleware().search(
  z.object({
    page: z.coerce.number().catch(1),
    limit: z.coerce.number().catch(10)
  })
);

const auth = middleware()
  .handle({ requiresAuth: true })
  .component(AuthRedirect);
```

Here, `pagination` validates pagination search params, and `auth` marks routes as protected via a handle and wraps them in a component that redirects unauthenticated users.

Apply middleware to a route with the `.use()` method:

```tsx
const userPage = route("/users").use(pagination).component(UserPage);

function UserPage() {
  const [search] = useSearch(userPage);
  // search.page: number
  // search.limit: number
}
```

The middleware's configuration merges into the route - here, the route gets typed and validated `page` and `limit` search params. You can apply multiple middlewares to the same route:

```tsx
route("/users").use(auth).use(pagination).component(UserPage);
```

Middlewares can also use other middlewares:

```tsx
const filter = middleware()
  .use(pagination)
  .search(
    z.object({
      status: z.enum(["active", "archived", "all"]).catch("all")
    })
  );
```

Any route using `filter` gets pagination and filtering by status combined:

```tsx
const userPage = route("/users").use(filter).component(UserPage);

function UserPage() {
  const [search] = useSearch(userPage);
  // search.page: number
  // search.limit: number
  // search.status: "active" | "archived" | "all"
}
```

For parametrized middlewares, define a function that returns a middleware:

```tsx
const guard = (role: string) =>
  middleware().handle({ requiredRole: role }).component(RoleGuard);

const adminPage = route("/admin").use(guard("admin")).component(AdminPage);
const editorPage = route("/editor").use(guard("editor")).component(EditorPage);
```

---

# Route matching and ranking

When a user navigates to a URL, TypeRoute needs to determine which route matches. Since multiple routes can potentially match the same path (think `/users/:id` vs `/users/new`), TypeRoute uses a ranking algorithm to pick the most specific one.

Each segment in a route pattern gets a weight:

| Segment type | Weight | Example                    |
| ------------ | ------ | -------------------------- |
| Static       | 2      | `users`, `settings`, `new` |
| Dynamic      | 1      | `:id`, `:slug?`            |
| Wildcard     | 0      | `*`, `*?`                  |

When multiple routes match, TypeRoute compares them segment by segment from left to right. The route with the higher weight at the first differing position wins. If weights are equal, it continues to the next segment.

Consider these routes:

```tsx
const userNew = route("/users/new").component(NewUser);
const userProfile = route("/users/:id").component(UserProfile);
const userCatchAll = route("/users/*").component(UserCatchAll);
```

For the path `/users/new`, all three would match. TypeRoute ranks them to pick the most specific:

```
/users/new  → [static, static]   → weights [2, 2] ✓ Wins
/users/:id  → [static, dynamic]  → weights [2, 1]
/users/*    → [static, wildcard] → weights [2, 0]
```

The first segment (`users`) is static in all routes, so they all score 2 there. The second segment differs: `new` is static (2), `:id` is dynamic (1), and `*` is a wildcard (0). So `/users/new` wins.

For the path `/users/42`:

```
/users/new  → doesn't match
/users/:id  → [static, dynamic]  → weights [2, 1] ✓ Wins
/users/*    → [static, wildcard] → weights [2, 0]
```

This ranking algorithm means you don't need to order your routes array carefully. Define them in any order and TypeRoute figures out the right match regardless:

```tsx
const routes = [
  route("/posts/*").component(NotFound),
  route("/posts/:id").component(PostPage),
  route("/posts/new").component(NewPost)
]; // Order doesn't matter
```

---

# History implementations

History is an abstraction layer that sits between the router and the actual low-level navigation logic. It handles reading and updating the current location, managing navigation state, and notifying when the URL changes. This abstraction allows TypeRoute to work in different environments (browser, hash-based, in-memory, server-side, tests, etc.) without changing the router's core logic. You can switch between environments simply by swapping the history implementation - the rest of your app stays exactly the same.

TypeRoute supports three history modes out of the box.

**BrowserHistory** is the default. It uses the browser's History API, working with browser URLs like `/posts/123`:

```tsx
import { BrowserHistory } from "@typeroute/router";

<RouterRoot routes={routes} history={new BrowserHistory()} />;
```

**HashHistory** stores the path in the URL hash, producing URLs like `/#/posts/123`. This is useful for static file hosting where you can't configure server-side routing:

```tsx
import { HashHistory } from "@typeroute/router";

<RouterRoot routes={routes} history={new HashHistory()} />;
```

**MemoryHistory** keeps the history in memory without touching the URL. It also doesn't rely on any browser API. Perfect for testing, server-side rendering (SSR), or embedded applications:

```tsx
import { MemoryHistory } from "@typeroute/router";

<RouterRoot routes={routes} history={new MemoryHistory("/initial/path")} />;
```

All history implementations conform to the `HistoryLike` interface, so you can create custom implementations if needed.

---

# Devtools

TypeRoute has a companion devtools package for inspecting routes, matches, parameters, and navigation state.

```bash
npm install @typeroute/devtools
```

Render the `Devtools` component anywhere inside your routes. It displays a toggle button that opens a draggable and resizable floating panel:

```tsx
import { Devtools } from "@typeroute/devtools";

const layout = route("/").component(Layout);

function Layout() {
  return (
    <div>
      <Outlet />
      <Devtools />
    </div>
  );
}
```

If you'd rather embed the panel directly into your layout instead of using the floating window, use `DevtoolsPanel`:

```tsx
import { DevtoolsPanel } from "@typeroute/devtools";

function DebugSidebar() {
  return (
    <aside>
      <DevtoolsPanel />
    </aside>
  );
}
```

To exclude devtools from production builds (Vite example):

```tsx
import.meta.env.DEV && <Devtools />;
```

---

# Cookbook

## Quick start example

Here's a minimal but complete routing setup with a layout and two pages:

```tsx
import { route, RouterRoot, Outlet, Link } from "@typeroute/router";

// Layout route
const app = route("/").component(AppLayout);

function AppLayout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// Page routes
const home = app.route("/").component(() => <h1>Welcome home</h1>);
const about = app.route("/about").component(() => <h1>About us</h1>);

// Router setup
const routes = [home, about];

export function App() {
  return <RouterRoot routes={routes} />;
}

declare module "@typeroute/router" {
  interface Register {
    routes: typeof routes;
  }
}
```

## Server-side rendering (SSR)

TypeRoute supports server-side rendering using `MemoryHistory`. The key is to use `MemoryHistory` on the server (initialized with the request URL) and `BrowserHistory` on the client:

```tsx
// server.tsx
import { renderToString } from "react-dom/server";
import { RouterRoot, MemoryHistory, type SSRContext } from "@typeroute/router";
import { routes } from "./routes";

function handleRequest(req: Request) {
  const ssrContext: SSRContext = {};
  const html = renderToString(
    <RouterRoot
      routes={routes}
      history={new MemoryHistory(req.url)}
      ssrContext={ssrContext}
    />
  );
  if (ssrContext.redirect) {
    return Response.redirect(ssrContext.redirect);
  }
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}
```

The `ssrContext` object captures information during server rendering. When a `Navigate` component renders on the server (typically from conditional logic), it populates `ssrContext.redirect` with the target URL. Your server can then return an HTTP redirect instead of the rendered HTML.

On the client, use the default (`BrowserHistory`) for hydration:

```tsx
// client.tsx
import { hydrateRoot } from "react-dom/client";
import { RouterRoot } from "@typeroute/router";
import { routes } from "./routes";

hydrateRoot(rootElement, <RouterRoot routes={routes} />);
```

You can also manually set `ssrContext.statusCode` in your components during SSR to control the response status (like 404 for not found pages).

## Scroll to top on navigation

Create a component that scrolls to top when the path changes and include it in your layout:

```tsx
import { useLocation } from "@typeroute/router";
import { useEffect } from "react";

function ScrollToTop() {
  const { path } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [path]);
  return null;
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
    </>
  );
}
```

## Matching a route anywhere

Use `useMatch` to check if a route matches the current path from anywhere in your component tree. You can pass either a route pattern string or a route object, just like with `Link` and `navigate`. This is useful for conditional rendering, styling, access control, and more. It's also used internally by `useParams` and `Link`.

The hook returns a Match object (containing `route` and `params`) if there's a match, or `null` otherwise. There are two matching modes:

- **Loose matching** (default): Matches if the path starts with the route pattern (e.g., `/dashboard` matches `/dashboard/settings`).
- **Strict matching** (`strict: true`): Matches only if the path exactly matches the route pattern.

```tsx
import { useMatch } from "@typeroute/router";

const dashboard = route("/dashboard").component(Dashboard);

function Sidebar() {
  // Matches /dashboard, /dashboard/anything, etc.
  const match = useMatch({ from: dashboard });

  // Matches only /dashboard
  const match = useMatch({ from: dashboard, strict: true });

  return <nav>{match && <DashboardMenu />}</nav>;
}
```

You can also filter by param values to match only specific instances:

```tsx
const adminMatch = useMatch({
  from: "/users/:id",
  params: { id: "admin" }
});

if (adminMatch) {
  // Currently viewing the admin user
}
```

## Global link configuration

Set defaults for all `Link` components using `defaultLinkOptions` on the router. Useful for consistent styling and preload behavior across your app:

```tsx
<RouterRoot
  routes={routes}
  defaultLinkOptions={{
    preload: "intent",
    preloadDelay: 75,
    className: "app-link",
    activeClassName: "active"
  }}
/>
```

Individual links can override any of these defaults by passing their own props.

## History middleware

This is a design pattern rather than a feature. You can extend history behavior for logging, analytics, or other side effects by monkey-patching the history instance:

```tsx
function withAnalytics(history: HistoryLike): HistoryLike {
  const { push } = history;

  history.push = options => {
    analytics.track("page_view", { url: options.url });
    push(options);
  };

  return history;
}

function withLogging(history: HistoryLike): HistoryLike {
  const { go, push } = history;

  history.go = delta => {
    console.log("Navigate", delta > 0 ? "forward" : "back");
    go(delta);
  };

  history.push = options => {
    console.log("Navigate to", options.url);
    push(options);
  };

  return history;
}

// Compose middlewares
const router = new Router({
  routes,
  history: withLogging(withAnalytics(new BrowserHistory()))
});
```

## View transitions

You can use the view transitions API for smoother page animations. Create a history middleware that wraps navigation in a view transition:

```tsx
import { flushSync } from "react-dom";
import { BrowserHistory, type HistoryLike } from "@typeroute/router";

const withViewTransition = (history: HistoryLike) => {
  const { go, push } = history;

  const wrap = (fn: () => void) => {
    return !document.startViewTransition
      ? fn()
      : document.startViewTransition(() => flushSync(fn));
  };

  history.go = delta => wrap(() => go(delta));
  history.push = options => wrap(() => push(options));
  return history;
};

const history = withViewTransition(new BrowserHistory());

function App() {
  return <RouterRoot routes={routes} history={history} />;
}
```

Add CSS to control the transition:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
}
```

For more advanced techniques, see the [MDN documentation on View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API).

---

# API reference

## Router class

The `Router` class is the core of TypeRoute. You can create an instance directly or let `RouterRoot` create one.

**Properties:**

- `router.basePath` - The configured base path
- `router.routes` - The array of routes
- `router.history` - The history instance
- `router.ssrContext` - The SSR context (if provided)
- `router.defaultLinkOptions` - Default link options

**`new Router(options)`** creates a new router.

- `options` - `RouterOptions` - Router configuration
- Returns: `Router` - A new router instance

```tsx
const router = new Router({ routes });
const router = new Router({ routes, basePath: "/app" });
const router = new Router({ routes, history: new HashHistory() });
```

**`router.navigate(options)`** navigates to a new location.

- `options` - `NavigateOptions | HistoryPushOptions | number` - Type-safe navigation options, untyped navigation options, or a history delta
- Returns: `void`

```tsx
// Type-safe navigation
router.navigate({ to: "/posts/:id", params: { id: "42" } });

// Untyped navigation
router.navigate({ url: "/any/path" });

// History navigation
router.navigate(-1); // Back
router.navigate(1); // Forward
```

**`router.createUrl(options)`** builds a URL string.

- `options` - `NavigateOptions` - Type-safe navigation options
- Returns: `string` - The constructed URL

```tsx
const url = router.createUrl({ to: userProfile, params: { id: "42" } });
// Returns "/users/42"
```

**`router.match(path, options)`** checks if a path matches a specific route.

- `path` - `string` - The path to match against
- `options` - `MatchOptions` - Matching options
- Returns: `Match | null` - The match result or null if no match

```tsx
const match = router.match("/users/42", { from: "/users/:id" });
// Returns { route, params: { id: "42" } }
```

**`router.matchAll(path)`** finds the best match from all registered routes.

- `path` - `string` - The path to match against
- Returns: `Match | null` - The best match or null if no route matches

```tsx
const match = router.matchAll("/users/42");
// Returns the best match or null
```

**`router.getRoute(pattern)`** get a route by its pattern.

- `pattern` - `Pattern | Route` - A route pattern string or a route object
- Returns: `Route` - The route object; throws if not found

```tsx
const route = router.getRoute("/users/:id");
```

**`router.preload(options)`** triggers preloading for a route.

- `options` - `NavigateOptions` - Type-safe navigation options
- Returns: `Promise<void>` - Resolves when preloaded

```tsx
await router.preload({ to: "/user/:id", params: { id: "42" } });
await router.preload({ to: searchPage, search: { q: "test" } });
```

## Route class

Routes are created with the `route()` function and configured by chaining methods.

**`route(pattern)`** creates a new route.

- `pattern` - `string` - The route path pattern (e.g., `"/users"`, `"/users/:id"`, `"/*"`)
- Returns: `Route` - A new route object

```tsx
const users = route("/users");
const user = route("/users/:id");
const catchAll = route("/*");
```

**`.route(pattern)`** creates a nested child route.

- `pattern` - `string` - The child path pattern to append
- Returns: `Route` - A new route object

```tsx
const userSettings = user.route("/settings");
// Pattern becomes "/users/:id/settings"
```

**`.use(middleware)`** applies a middleware to the route, merging its configuration.

- `middleware` - `Middleware` - A middleware object
- Returns: `Route` - A new route object

```tsx
const auth = middleware().component(AuthRedirect);
const dashboard = route("/dashboard").use(auth).component(Dashboard);
```

**`.component(component)`** adds a component to render when this route matches.

- `component` - `ComponentType` - A React component
- Returns: `Route` - A new route object

```tsx
const users = route("/users").component(UsersPage);
```

**`.lazy(loader)`** adds a lazy-loaded component to render when this route matches.

- `loader` - `ComponentLoader` - A function returning a dynamic import promise
- Returns: `Route` - A new route object

```tsx
const users = route("/users").lazy(() => import("./UsersPage"));
const admin = route("/admin").lazy(() =>
  import("./Admin").then(m => m.AdminPage)
);
```

**`.search(validate)`** adds search parameter validation.

- `validate` - `StandardSchema | ((search) => ValidatedSearch)` - A Standard Schema (like Zod) or a validation function
- Returns: `Route` - A new route object

```tsx
const search = route("/search").search(z.object({ q: z.string() }));
const filter = route("/filter").search(raw => ({
  term: String(raw.term ?? "")
}));
```

**`.handle(handle)`** attaches static metadata to the route.

- `handle` - `Handle` - Arbitrary metadata
- Returns: `Route` - A new route object

```tsx
const admin = route("/admin").handle({ requiresAuth: true });
```

**`.suspense(fallback)`** wraps nested content in a Suspense boundary.

- `fallback` - `ComponentType` - The fallback component to show while suspended
- Returns: `Route` - A new route object

```tsx
const lazy = route("/lazy")
  .suspense(Loading)
  .lazy(() => import("./Page"));
```

**`.error(fallback)`** wraps nested content in an error boundary.

- `fallback` - `ComponentType<{ error: unknown }>` - The fallback component, receives the caught error as a prop
- Returns: `Route` - A new route object

```tsx
const risky = route("/risky").error(ErrorPage).component(RiskyPage);
```

**`.preload(preload)`** registers a preload function for the route.

- `preload` - `(context: PreloadContext) => Promise<any>` - An async function receiving typed `params` and `search`
- Returns: `Route` - A new route object

```tsx
const user = route("/users/:id")
  .search(z.object({ tab: z.string().catch("profile") }))
  .preload(async ({ params, search }) => {
    // params.id: string, search.tab: string - fully typed
    await prefetchUser(params.id, search.tab);
  });
```

## Middleware

**`middleware()`** creates a new middleware.

- Returns: `Middleware` - A new middleware object

```tsx
const pagination = middleware().search(
  z.object({
    page: z.coerce.number().catch(1),
    limit: z.coerce.number().catch(10)
  })
);
const auth = middleware()
  .handle({ requiresAuth: true })
  .component(AuthRedirect);
```

Middlewares support all the same builder methods as `Route` except `.route()`. See the [Route class](#route-class) documentation above for details on each method.

## Hooks

**`useRouter()`** returns the Router instance from context.

- Returns: `Router` - The router instance

```tsx
const router = useRouter();
```

**`useNavigate()`** returns a navigation function.

- Returns: `(options: NavigateOptions | HistoryPushOptions | number) => void` - The navigate function

```tsx
const navigate = useNavigate();
navigate({ to: "/home" });
navigate(-1);
```

**`useLocation()`** returns the current location, subscribes to changes.

- Returns: `HistoryLocation` - The current location with path, parsed search params, and history state

```tsx
const { path, search, state } = useLocation();
```

**`useOutlet()`** returns the child route content.

- Returns: `ReactNode` - The child route's content or null

```tsx
const outlet = useOutlet();
```

**`useParams(route)`** returns typed path params for a route.

- `route` - `Pattern | Route` - A route pattern string or route object
- Returns: `Params` - The extracted path params, fully typed

```tsx
const { id } = useParams(userRoute);
```

**`useSearch(route)`** returns validated search params and a setter function.

- `route` - `Pattern | Route` - A route pattern string or route object
- Returns: `[Search, SetSearch]` - A tuple of the validated search params and a setter; the setter accepts a partial update or an updater function, with an optional second argument to replace instead of push

```tsx
const [search, setSearch] = useSearch(searchRoute);
setSearch({ page: 2 });
setSearch(prev => ({ page: prev.page + 1 }));
setSearch({ page: 1 }, true); // Replace instead of push
```

**`useMatch(options)`** checks if a route matches the current path.

- `options` - `MatchOptions` - Matching options
- Returns: `Match | null` - The match result or null if no match

```tsx
const match = useMatch({ from: "/users/:id" });
const strictMatch = useMatch({ from: "/users", strict: true });
const filteredMatch = useMatch({ from: "/users/:id", params: { id: "admin" } });
```

**`useHandles()`** returns the handles from the matched route chain.

- Returns: `Handle[]` - Array of handles

```tsx
const handles = useHandles();
```

## Components

**`RouterRoot`** sets up routing context and renders your routes.

- `props` - `RouterOptions | { router: Router }` - Either router options (same as the `Router` constructor) or a router instance

```tsx
<RouterRoot routes={routes} basePath="/app" history={history} />
<RouterRoot router={router} />
```

**`Outlet`** renders the child route content.

```tsx
function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
```

**`Link`** renders an anchor tag for navigation.

- `props` - `NavigateOptions & LinkOptions & { asChild?: boolean }` - Navigation options, link options, and optional `asChild` to use a child element as the anchor; other props are passed through

```tsx
<Link to="/path" params={...} search={...} replace strict preload="intent">
  Click me
</Link>
```

**`Navigate`** redirects on render.

- `props` - `NavigateOptions` - The navigation target

```tsx
<Navigate to="/login" replace />
```

## History interface

The `HistoryLike` interface defines how TypeRoute interacts with navigation. All history implementations conform to this interface.

**Available implementations:**

```tsx
new BrowserHistory(); // Browser History API (/posts/123). Default.
new HashHistory(); // URL hash (/#/posts/123).
new MemoryHistory("/initial"); // In-memory only.
```

See [History implementations](#history-implementations) for detailed usage.

**`history.location()`** returns the current location.

- Returns: `HistoryLocation` - The current location with path, parsed search params, and history state

```tsx
const { path, search, state } = history.location();
// path: "/users/42"
// search: { tab: "posts", page: 2 }
// state: any state passed during navigation
```

**`history.go(delta)`** navigates forward or back in history.

- `delta` - `number` - The number of entries to move
- Returns: `void`

```tsx
history.go(-1); // Go back
history.go(1); // Go forward
history.go(-2); // Go back two steps
```

**`history.push(options)`** pushes or replaces a history entry.

- `options` - `HistoryPushOptions` - The URL to navigate to, with optional `replace` and `state`
- Returns: `void`

```tsx
history.push({ url: "/users/42", state: { from: "list" } });
history.push({ url: "/login", replace: true });
```

**`history.subscribe(listener)`** subscribes to navigation events.

- `listener` - `() => void` - Callback invoked when any navigation occurs
- Returns: `() => void` - An unsubscribe function

```tsx
const unsubscribe = history.subscribe(() => {
  console.log("Navigation occurred");
});

// Later: unsubscribe()
```

## Types

**`RouterOptions`** are options for creating a `Router` instance or passing to `RouterRoot`.

```tsx
interface RouterOptions {
  routes: Route[]; // Array of navigable routes (required)
  basePath?: string; // Base path prefix (default: "/")
  history?: HistoryLike; // History implementation (default: BrowserHistory)
  ssrContext?: SSRContext; // Context for server-side rendering
  defaultLinkOptions?: LinkOptions; // Default options for all Link components
}
```

**`NavigateOptions`** are options for type-safe navigation.

```tsx
type NavigateOptions = {
  to: Pattern | Route; // Route pattern string or route object
  params?: Params; // Path params
  search?: Search; // Search params
  replace?: boolean; // Replace history entry instead of pushing
  state?: any; // Arbitrary state to pass
};
```

**`HistoryLocation`** represents a history location.

```tsx
interface HistoryLocation {
  path: string; // The current path
  search: Record<string, unknown>; // Parsed search params
  state: any; // History state passed during navigation
}
```

**`HistoryPushOptions`** are options for untyped navigation.

```tsx
interface HistoryPushOptions {
  url: string; // The URL to navigate to
  replace?: boolean; // Replace history entry instead of pushing
  state?: any; // Arbitrary state to pass
}
```

**`MatchOptions`** are options for route matching.

```tsx
type MatchOptions = {
  from: Pattern | Route; // The route to match against
  strict?: boolean; // Require exact match (default: false, matches prefixes)
  params?: Partial<Params>; // Optional param values to filter by
};
```

**`Match`** is the result of a successful route match.

```tsx
type Match = {
  route: Route; // Matched route object
  params: Params; // Extracted path params
};
```

**`LinkOptions`** controls link behavior and styling.

```tsx
interface LinkOptions {
  strict?: boolean; // Strict matching for active state detection
  preload?: "intent" | "render" | "viewport" | false; // When to trigger preloading
  preloadDelay?: number; // Delay in ms before preloading starts (default: 50)
  style?: CSSProperties; // Base styles for the link
  className?: string; // Base class name for the link
  activeStyle?: CSSProperties; // Additional styles when active
  activeClassName?: string; // Additional class name when active
}
```

**`SSRContext`** captures context during server-side rendering.

```tsx
type SSRContext = {
  redirect?: string; // Set by Navigate component during SSR
  statusCode?: number; // Can be set manually for HTTP status
};
```

**`PreloadContext`** is the context passed to preload functions.

```tsx
interface PreloadContext {
  params: Params; // Path params for the route
  search: Search; // Validated search params
}
```

---

# Roadmap

- Possibility to pass an arbitrary context to the Router instance for later use in preloads?
- Relative path navigation? Not sure it's worth the extra bundle size given that users can export/import route objects and pass them as navigation option.
- Document usage in test environments
- Navigation blockers (`useBlocker`, etc.)
- Open to suggestions, we can discuss them [here](https://github.com/strblr/typeroute/discussions).

---

# License

MIT
