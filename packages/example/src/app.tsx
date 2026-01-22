import { useState } from "react";
import {
  RouterRoot,
  route,
  Outlet,
  Link,
  useRouter,
  useParams,
  useSearch,
  useLocation
} from "waymark";
import { z } from "zod";

// App

export function App() {
  const [counter, setCounter] = useState(0);
  return (
    <div className="app-container">
      <div className="app-header">
        <button onClick={() => setCounter(c => c + 1)}>
          App counter {counter}
        </button>
      </div>
      <RouterRoot
        routes={routes}
        defaultLinkOptions={{
          preload: "intent",
          activeClassName: "active-link"
        }}
      />
    </div>
  );
}

// Layout

const ultraroot = route("/").component(Outlet);
const ultraroot2 = ultraroot.route("/").component(Outlet);
const layout = ultraroot2.route("/").component(Layout).error(ErrorBoundary);

function Layout() {
  const [counter, setCounter] = useState(0);
  const router = useRouter();
  const location = useLocation();
  const navigateToParam2 = () =>
    router.navigate({ to: "/param/:id", params: { id: "2" } });

  return (
    <div className="layout">
      <div className="location-display">
        <div className="location-path">Path: {location.path}</div>
        <div className="location-search">
          Search: {JSON.stringify(location.search)}
        </div>
      </div>
      <nav className="nav">
        <Link to="/simple">Simple page</Link>
        <Link to="/lazy">Lazy page</Link>
        <Link to="/faulty">Faulty</Link>
        <Link to="/param/:id" params={{ id: "1" }}>
          Param 1
        </Link>
        <a onClick={navigateToParam2}>Param 2</a>
        <a onClick={() => router.navigate<any>({ to: "/unknown" })}>
          Catch all
        </a>
        <span>|</span>
        <a onClick={() => router.navigate(-1)}>Back</a>
        <a onClick={() => router.navigate(1)}>Forward</a>
      </nav>
      <div className="counter-section">
        <button onClick={() => setCounter(c => c + 1)}>
          Layout counter {counter}
        </button>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

function ErrorBoundary({ error }: { error: unknown }) {
  return (
    <div className="section">
      <h1 className="section-title">Error</h1>
      <div className="section-content">
        <div className="error-message">{String(error)}</div>
      </div>
    </div>
  );
}

// Simple page

const simplePage = layout.route("/simple").component(SimplePage);

function SimplePage() {
  return (
    <div className="section">
      <h1 className="section-title">Simple page</h1>
      <div className="section-content">
        This is a simple page demonstrating basic routing.
      </div>
    </div>
  );
}

// Lazy page

const lazyPage = layout.route("/lazy").lazy(() => import("./lazy"));
const lazySection1 = lazyPage.route("/section1").component(LazySection1);
const lazySection2 = lazyPage.route("/section2").component(LazySection2);

function LazySection1() {
  return (
    <div className="section">
      <h2 className="section-title">Section 1</h2>
      <div className="section-content">
        Content for section 1 of the lazy loaded page.
      </div>
    </div>
  );
}

function LazySection2() {
  return (
    <div className="section">
      <h2 className="section-title">Section 2</h2>
      <div className="section-content">
        Content for section 2 of the lazy loaded page.
      </div>
    </div>
  );
}

// Param

const param = layout.route("/param/:id").component(Param);

const paramDetail = param
  .route("/detail")
  .search(z.object({ name: z.string().catch("") }))
  .component(ParamDetail);

function Param() {
  const { id } = useParams(param);
  return (
    <div className="section">
      <h1 className="section-title">Param</h1>
      <nav className="nav">
        <Link to="/param/:id" params={{ id }}>
          Param
        </Link>
        <Link to="/param/:id/detail" params={{ id }} search={{ name: "John" }}>
          Detail
        </Link>
      </nav>
      <div className="section-content">
        <div className="data-display">
          Param {JSON.stringify({ id, type: typeof id })}
        </div>
        <Outlet />
      </div>
    </div>
  );
}

function ParamDetail() {
  const [search, setSearch] = useSearch(paramDetail);
  return (
    <div className="section">
      <h2 className="section-title">Detail</h2>
      <div className="section-content">
        <div className="data-display">{JSON.stringify(search)}</div>
        <button onClick={() => setSearch(s => ({ name: s.name + " Doe" }))}>
          Set Name
        </button>
      </div>
    </div>
  );
}

// Faulty

const faulty = layout.route("/faulty").component(Faulty);

function Faulty(): never {
  throw new Error("Faulty");
}

// Catch all

const catchAll = layout.route("/*").component(CatchAll);

function CatchAll() {
  const params = useParams(catchAll);
  return (
    <div className="section">
      <h1 className="section-title">Catch all</h1>
      <div className="section-content">
        <div className="data-display">{JSON.stringify(params)}</div>
      </div>
    </div>
  );
}

// Routes

const routes = [
  simplePage,
  lazyPage,
  lazySection1,
  lazySection2,
  faulty,
  param,
  paramDetail,
  catchAll
];

declare module "waymark" {
  interface RegisterRoutes {
    routes: typeof routes;
  }
}
