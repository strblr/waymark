import { Link, Outlet } from "@typeroute/router";

export default function LazyPage() {
  return (
    <div className="section">
      <h1 className="section-title">Lazy page</h1>
      <nav className="nav">
        <Link strict to="/lazy">
          Lazy
        </Link>
        <Link to="/lazy/section1">Section 1</Link>
        <Link to="/lazy/section2">Section 2</Link>
      </nav>
      <div className="section-content">
        <Outlet />
      </div>
    </div>
  );
}
