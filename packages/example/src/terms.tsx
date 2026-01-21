import { useEffect } from "react";
import { Link, Outlet } from "waymark";

export function Terms() {
  useEffect(
    () => () => {
      console.log("unmount Terms");
    },
    []
  );
  return (
    <div>
      <div>
        <Link to="/terms" active={Object.is}>
          Terms
        </Link>{" "}
        <Link to="/terms/section1">Section 1</Link>{" "}
        <Link to="/terms/section2">Section 2</Link>
      </div>
      Terms
      <div>
        <Outlet />
      </div>
    </div>
  );
}
