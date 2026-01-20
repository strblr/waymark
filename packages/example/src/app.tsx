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

const ultraroot = route("").component(Outlet);

const root = ultraroot.route("").component(Layout);

const notFound = root.route("*").component(NotFound);

const about = root.route("about").component(About);

const tos = root
  .route("terms")
  .lazy(() => import("./terms").then(m => m.Terms));

const tos1 = tos.route("section1").component(Section1);

const tos2 = tos.route("section2").component(Section2);

const user = root.route("user/:id").component(User);

const userBio = user
  .route("bio")
  .search(s => ({ name: s.name ? String(s.name) : "" }))
  .component(UserBio);

// Only register routes that should be reachable
const routes = [about, tos, tos1, tos2, user, userBio, notFound];

declare module "waymark" {
  interface RegisterRoutes {
    routes: typeof routes;
  }
}

export function App() {
  return (
    <div>
      <RouterRoot routes={routes} defaultLinkOptions={{ preload: "intent" }} />
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
      <Link to="/about" activeStyle={{ color: "red" }}>
        About
      </Link>{" "}
      <Link to="/terms" activeStyle={{ color: "blue" }}>
        Terms
      </Link>{" "}
      <Link
        to="/user/:id"
        params={{ id: "1" }}
        activeStyle={{ color: "yellow" }}
      >
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
  return <div>Not Found</div>;
}

function Section1() {
  return <div>Section 1</div>;
}

function Section2() {
  return <div>Section 2</div>;
}
