import "./Sidebar.css";

import {
  LayoutDashboard,
  Map,
  ChartNoAxesColumnIncreasing,
  UsersRound,
  ClipboardList,
  Settings,
  ShieldAlert,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
  function handleEmergencyCall() {
    const confirmed = window.confirm("Call 911 emergency services?");

    if (confirmed) {
      window.location.href = "tel:911";
    }
  }

  function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (confirmed && typeof onLogout === "function") {
      onLogout();
    }
  }

  function getNavClass({ isActive }) {
    return `sidebar__item ${isActive ? "active" : ""}`;
  }

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div>
        <div className="sidebar__logo">
          <h2>CanvassNow</h2>
        </div>

        <nav className="sidebar__nav" aria-label="CanvassNow navigation">
          <NavLink to="/" end className={getNavClass}>
            <LayoutDashboard size={20} aria-hidden="true" />

            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/routes" className={getNavClass}>
            <Map size={20} aria-hidden="true" />

            <span>Routes</span>
          </NavLink>

          <NavLink to="/progress" className={getNavClass}>
            <ChartNoAxesColumnIncreasing size={20} aria-hidden="true" />

            <span>Progress</span>
          </NavLink>

          <NavLink to="/addresses" className={getNavClass}>
            <UsersRound size={20} aria-hidden="true" />

            <span>Addresses / People</span>
          </NavLink>

          <NavLink to="/script" className={getNavClass}>
            <ClipboardList size={20} aria-hidden="true" />

            <span>Canvass Script</span>
          </NavLink>

          <NavLink to="/settings" className={getNavClass}>
            <Settings size={20} aria-hidden="true" />

            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar__bottom">
        <button
          type="button"
          className="sidebar__emergency"
          onClick={handleEmergencyCall}
          aria-label="Call 911 emergency services"
        >
          <ShieldAlert size={20} aria-hidden="true" />

          <span>Emergency 911</span>
        </button>

        <button
          type="button"
          className="sidebar__logout"
          onClick={handleLogout}
          aria-label="Log out of CanvassNow"
        >
          <LogOut size={20} aria-hidden="true" />

          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
