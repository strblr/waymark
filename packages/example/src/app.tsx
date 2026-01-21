import { useEffect } from "react";
import {
  RouterRoot,
  route,
  Outlet,
  Link,
  useRouter,
  useParams,
  useSearch
} from "waymark";
import { z } from "zod";

const ultraroot = route("").component(Outlet);

const layout = ultraroot.route("").component(Layout);

const about = layout.route("about").component(About);

const tos = layout
  .route("terms")
  .lazy(() => import("./terms").then(m => m.Terms));

const tos1 = tos.route("section1").component(Section1);

const tos2 = tos.route("section2").component(Section2);

const faulty = layout.route("faulty").component(Faulty);

const user = layout.route("user/:id").component(User);

const userBio = user
  .route("bio")
  .search(z.object({ name: z.string().catch("") }))
  .component(UserBio);

const notFound = layout.route("*").component(NotFound);

// Only register routes that should be reachable
const routes = [about, tos, tos1, tos2, faulty, user, userBio, notFound];

declare module "waymark" {
  interface RegisterRoutes {
    routes: typeof routes;
  }
}

export function App() {
  return (
    <div>
      <RouterRoot
        routes={routes}
        defaultLinkOptions={{
          preload: "intent",
          activeStyle: { color: "yellow" }
        }}
      />
    </div>
  );
}

function Layout() {
  const router = useRouter();
  const navigateToUser2 = () =>
    router.navigate({ to: "/user/:id", params: { id: "2" } });

  useEffect(
    () => () => {
      console.log("unmount Layout");
    },
    []
  );

  return (
    <div style={{ paddingTop: 0 }}>
      <Link to="/about">About</Link> <Link to="/terms">Terms</Link>{" "}
      <Link to="/faulty">Faulty</Link>{" "}
      <Link to="/user/:id" params={{ id: "1" }}>
        User 1
      </Link>{" "}
      <a onClick={navigateToUser2}>User 2</a>{" "}
      <a onClick={() => router.navigate<any>({ to: "/unknown" })}>Unknown</a>{" "}
      <a onClick={() => router.navigate(-1)}>Back</a>{" "}
      <a onClick={() => router.navigate(1)}>Forward</a>
      <Outlet />
    </div>
  );
}

function About() {
  return <div>About</div>;
}

function User() {
  const { id } = useParams(user);
  return (
    <div>
      <Link to="/user/:id" params={{ id }}>
        User
      </Link>{" "}
      <Link to="/user/:id/bio" params={{ id }} search={{ name: "John" }}>
        Bio
      </Link>
      <div>User {JSON.stringify({ id, type: typeof id })}</div>
      <Outlet />
    </div>
  );
}

function UserBio() {
  const [search, setSearch] = useSearch(userBio);
  return (
    <div>
      User Bio {JSON.stringify(search)}{" "}
      <button onClick={() => setSearch(s => ({ name: s.name + " Doe" }))}>
        Set Name
      </button>
    </div>
  );
}

function NotFound() {
  const params = useParams(notFound);
  return <div>Not Found {JSON.stringify(params)}</div>;
}

function Faulty(): never {
  throw new Error("Faulty");
}

function Section1() {
  return <div>Section 1</div>;
}

function Section2() {
  return <div>Section 2</div>;
}
