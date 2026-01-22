import { Link, Outlet } from "waymark";

export default function Terms() {
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
