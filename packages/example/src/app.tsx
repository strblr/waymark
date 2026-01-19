import { useEffect } from "react";
import { RouterRoot, route, Outlet, Link, useRouter } from "waymark";

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

const routes = { ultraroot, root, about, tos, tos1, tos2, user, notFound };

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
        basePath="/app"
        defaultLinkOptions={{ preload: "intent" }}
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
      console.log("unmount");
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
      <a onClick={() => router.navigate({ to: "/unknown" as any })}>Unknown</a>
      <Outlet />
    </div>
  );
}

function About() {
  return <div>About</div>;
}

function User() {
  const { id } = user.useParams();
  return <div>User {JSON.stringify({ id, type: typeof id })}</div>;
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
