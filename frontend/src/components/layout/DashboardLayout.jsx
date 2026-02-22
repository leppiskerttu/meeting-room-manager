import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export function DashboardLayout() {
  const { user, isAdmin, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 border-r border-slate-200 bg-white px-4 py-6">
        <div className="mb-8">
          <h1 className="text-lg font-semibold text-slate-900">
            Meeting Room Booking
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Signed in as <span className="font-medium">{user?.email}</span>
          </p>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            {user?.role}
          </p>
        </div>

        <nav className="space-y-1">
          <NavLink to="/rooms" className={linkClass}>
            Rooms
          </NavLink>
          <NavLink to="/bookings" className={linkClass}>
            My bookings
          </NavLink>
          {isAdmin && (
            <>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Admin
              </div>
              <NavLink to="/admin/rooms" className={linkClass}>
                Manage rooms
              </NavLink>
              <NavLink to="/admin/bookings" className={linkClass}>
                All bookings
              </NavLink>
            </>
          )}
        </nav>

        <button
          onClick={logout}
          className="mt-8 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Log out
        </button>
      </aside>

      <main className="flex-1">
        <header className="border-b border-slate-200 bg-white px-8 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Dashboard
          </h2>
        </header>
        <section className="px-8 py-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}


