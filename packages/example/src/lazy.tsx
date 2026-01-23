import { Link, Outlet } from "waymark";

export default function LazyPage() {
  return (
    <div className="section">
      <h1 className="section-title">Lazy page</h1>
      <nav className="nav">
        <Link to="/lazy" activeStrict>
          Lazy page
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
