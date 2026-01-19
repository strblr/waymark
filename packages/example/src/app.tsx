import { useEffect } from "react";
import { RouterRoot, route, Outlet, Link, useRouter } from "waymark";

const root = route("").component(Layout);

const about = root.route("about").component(About);

const user = root
  .route("user/:id")
  // .params(params => ({ id: Number(params.id) }))
  .component(User);
// .search(search => ({ q: String(search.q) }))
// .search(search => ({ q: String(search.q) }));

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
      <Link to="/about" params={{ x: "y" }} activeStyle={{ color: "red" }}>
        About
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
