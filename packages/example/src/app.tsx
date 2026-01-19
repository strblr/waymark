import { useEffect } from "react";
import { RouterRoot, route, Outlet, Link, useRouter } from "waymark";

const ultraroot = route("").component(Outlet);

const root = ultraroot.route("").component(Layout);

const about = root.route("about").component(About);

const tos = root
  .route("terms")
  .lazy(() => import("./terms").then(m => m.Terms));

const user = root.route("user/:id").component(User);

const notFound = root.route("*").component(NotFound);

const routes = { ultraroot, root, about, tos, user, notFound };

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
    <div>
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
      <a onClick={navigateToUser2}>User 2</a>
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

// type K = "a" | "b" | "c";

// type Options<U extends K> =
//   {
//     u: U;
//   } & MaybeOptional<U extends "a" ? number : string, "other">

// export type MaybeOptional<T, K extends string> = {} extends T
//   ? { [P in K]?: T }
//   : { [P in K]: T };

// export type Pretty<T> = { [K in keyof T]: T[K] } & NonNullable<unknown>;

// function f<U extends K>(options: Options<U>) {
//   return options.u;
// }

// const a = f({ u: "a", other: "" });
