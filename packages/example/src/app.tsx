import { useState, use } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { z } from "zod";
import { Devtools } from "waymark-devtools";
import {
  RouterRoot,
  route,
  middleware,
  Outlet,
  Link,
  useRouter,
  useParams,
  useSearch,
  useLocation,
  useNavigate,
  useHandles,
  useMatch,
  BrowserHistory,
  type HistoryLike
} from "waymark";

// App

const queryClient = new QueryClient({});

export function App() {
  const [counter, setCounter] = useState(0);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <div className="app-header">
          <button className="button" onClick={() => setCounter(c => c + 1)}>
            App counter {counter}
          </button>
        </div>
        <RouterRoot
          routes={routes}
          history={logMiddleware(new BrowserHistory())}
          defaultLinkOptions={{
            preload: "intent",
            className: "waymark-link",
            activeClassName: "active-link"
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

// Layout

const layout = route("/")
  .handle({ breadcrumb: "Home" })
  .component(Layout)
  .error(ErrorBoundary);

function Layout() {
  const [counter, setCounter] = useState(0);
  const router = useRouter();
  const location = useLocation();
  const handles = useHandles();
  const navigate = useNavigate();
  const lazyMatch = useMatch({ from: "/lazy" });
  const navigateToParam2 = () =>
    router.navigate({ to: param, params: { id: "2" } });

  return (
    <div className="layout">
      <div className="location-display">
        <div className="location-path">Path: {location.path}</div>
        <div className="location-search">
          Search: {JSON.stringify(location.search)}
        </div>
        <div className="location-match">
          Matched lazy: {lazyMatch ? "✅" : "❌"}
        </div>
      </div>
      <div className="breadcrumbs">
        {handles.map((handle, i) => (
          <span key={i} className="breadcrumb-item">
            {handle.breadcrumb}
            {i < handles.length - 1 && (
              <span className="breadcrumb-separator">/</span>
            )}
          </span>
        ))}
      </div>
      <nav className="nav">
        <Link strict to="/">
          Index
        </Link>
        <Link to="/simple">Simple page</Link>
        <Link to="/lazy">Lazy</Link>
        <Link to="/suspended">Suspended</Link>
        <Link to="/faulty">Faulty</Link>
        <Link
          to={preloaderDemo}
          params={{ userId: "123" }}
          search={{ role: "admin" }}
        >
          Preloader
        </Link>
        <Link to="/param/:id" params={{ id: "1" }}>
          Param 1
        </Link>
        <a onClick={navigateToParam2}>Param 2</a>
        <a onClick={() => router.navigate({ url: "/unknown/path" })}>
          Wildcard
        </a>
        <span>|</span>
        <a onClick={() => navigate(-1)}>Back</a>
        <a onClick={() => navigate(1)}>Forward</a>
      </nav>
      <div className="counter-section">
        <button className="button" onClick={() => setCounter(c => c + 1)}>
          Layout counter {counter}
        </button>
      </div>
      <div className="content">
        <Outlet />
      </div>
      <Devtools />
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

// Index

const index = layout
  .route("/")
  .handle({ breadcrumb: "Index" })
  .component(Index);

function Index() {
  return (
    <div className="section">
      <h1 className="section-title">Index</h1>
    </div>
  );
}

// Simple page

const simplePage = layout
  .route("/simple")
  .handle({ breadcrumb: "Simple" })
  .component(SimplePage);

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

const lazyPage = layout
  .route("/lazy")
  .handle({ breadcrumb: "Lazy" })
  .lazy(() =>
    import("./lazy").then(async m => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return m.default;
    })
  );

const lazySection1 = lazyPage
  .route("/section1")
  .handle({ breadcrumb: "Section 1" })
  .component(LazySection1);

const lazySection2 = lazyPage
  .route("/section2")
  .handle({ breadcrumb: "Section 2" })
  .component(LazySection2);

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

const param = layout
  .route("/param/:id")
  .handle({ breadcrumb: "Param" })
  .component(Param);

const nameMiddleware = middleware().search(
  z.object({ name: z.string().catch("") })
);

const paramDetail = param
  .route("/detail")
  .handle({ breadcrumb: "Detail" })
  .use(nameMiddleware)
  .component(ParamDetail);

function Param() {
  const { id } = useParams(param);
  return (
    <div className="section">
      <h1 className="section-title">Param</h1>
      <nav className="nav">
        <Link to={param} params={{ id }}>
          Param
        </Link>
        <Link to={paramDetail} params={{ id }} search={{ name: "John" }}>
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
        <button
          className="button"
          onClick={() => setSearch(s => ({ name: s.name + " Doe" }))}
        >
          Set Name
        </button>
        <button
          className="button"
          onClick={() => setSearch({ name: undefined })}
        >
          Clear Name
        </button>
      </div>
    </div>
  );
}

// Suspended

const suspendedPage = layout
  .route("/suspended")
  .handle({ breadcrumb: "Suspended" })
  .suspense(SuspenseFallback)
  .component(SuspendedPage);

function SuspenseFallback() {
  return (
    <div className="section">
      <div className="section-content">Loading...</div>
    </div>
  );
}

let dataPromise: Promise<string>;

function getDataPromise() {
  return (dataPromise ??= new Promise<string>(resolve => {
    setTimeout(() => resolve("Data loaded!"), 2000);
  }));
}

function SuspendedPage() {
  const data = use(getDataPromise());
  return (
    <div className="section">
      <h1 className="section-title">Suspended Page</h1>
      <div className="section-content">{data}</div>
    </div>
  );
}

// Faulty

const faulty = layout
  .route("/faulty")
  .handle({ breadcrumb: "Faulty" })
  .component(Faulty);

function Faulty(): never {
  throw new Error("Faulty");
}

// Preloader

const preloaderDemo = layout
  .route("/preloader/:userId")
  .handle({ breadcrumb: "Preloader Demo" })
  .search(z.object({ role: z.enum(["developer", "admin"]).catch("developer") }))
  .preload(async ({ params, search }) => {
    await queryClient.prefetchQuery({
      staleTime: 60 * 1000,
      queryKey: ["user", params.userId, search.role],
      queryFn: () => fetchUser(params.userId, search.role)
    });
  })
  .component(PreloaderDemo);

async function fetchUser(id: string, role: string) {
  console.log("Fetching user", { id, role });
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id, role };
}

function PreloaderDemo() {
  const { userId } = useParams(preloaderDemo);
  const [{ role }] = useSearch(preloaderDemo);
  const { data } = useQuery({
    queryKey: ["user", userId, role],
    queryFn: () => fetchUser(userId, role)
  });
  return (
    <div className="section">
      <h1 className="section-title">Preloader Demo</h1>
      <div className="section-content">
        <div className="data-display">
          <div>userId: {userId}</div>
          <div>role: {role}</div>
          <div>data: {JSON.stringify(data)}</div>
        </div>
      </div>
    </div>
  );
}

// Wildcard

const wildcard = layout
  .route("/*")
  .handle({ breadcrumb: "Wildcard" })
  .component(Wildcard);

function Wildcard() {
  const params = useParams(wildcard);
  return (
    <div className="section">
      <h1 className="section-title">Wildcard</h1>
      <div className="section-content">
        <div className="data-display">{JSON.stringify(params)}</div>
      </div>
    </div>
  );
}

// Routes

const routes = [
  param,
  lazyPage,
  paramDetail,
  simplePage,
  wildcard,
  suspendedPage,
  preloaderDemo,
  index,
  faulty,
  lazySection2,
  lazySection1
];

const logMiddleware = (history: HistoryLike) => {
  const { go, push } = history;
  history.go = delta => {
    console.log("go", delta);
    go(delta);
  };
  history.push = options => {
    console.groupCollapsed("push", options.url);
    console.table(options);
    console.groupEnd();
    push(options);
  };
  return history;
};

declare module "waymark" {
  interface Register {
    routes: typeof routes;
    handle: { breadcrumb: string };
  }
}
