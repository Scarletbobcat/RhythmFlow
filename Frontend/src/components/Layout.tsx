import { Outlet } from "react-router";

function Layout() {
  return (
    <div className="flex flex-row">
      <div className="bg-neutral-800 h-screen w-xs">Layout</div>
      <Outlet />
    </div>
  );
}

export default Layout;
