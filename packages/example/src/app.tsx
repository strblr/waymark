import { RouterRoot, route, Outlet, Link } from "waymark";

const root = route("").component(Layout);

const about = root.route("about").component(About);

const user = root.route("user/:id").component(User);

const notFound = root.route("*").component(NotFound);

const routes = { root, about, user, notFound };

declare module "waymark" {
  interface RegisterRoutes {
    routes: typeof routes;
  }
}

export function App() {
  return (
    <div>
      <RouterRoot routes={routes} />
    </div>
  );
}

function Layout() {
  return (
    <div>
      <Link to="/about">About</Link>{" "}
      <Link to="/user/:id" params={{ id: "1" }}>
        User
      </Link>
      <Outlet />
    </div>
  );
}

function About() {
  return <div>About</div>;
}

function User() {
  return <div>User</div>;
}

function NotFound() {
  return <div>Not Found</div>;
}
