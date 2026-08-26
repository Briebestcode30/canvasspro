import "./Sidebar.css";

import {
  LayoutDashboard,
  Map,
  ChartNoAxesColumnIncreasing,
  UsersRound,
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

    if (confirmed && onLogout) {
      onLogout();
    }
  }

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar__logo">
          <h2>CanvassNow</h2>
        </div>

        <nav className="sidebar__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={20} />

            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/routes"
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <Map size={20} />

            <span>Routes</span>
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <ChartNoAxesColumnIncreasing size={20} />

            <span>Progress</span>
          </NavLink>

          <NavLink
            to="/addresses"
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <UsersRound size={20} />

            <span>Addresses / People</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <Settings size={20} />

            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar__bottom">
        <button
          type="button"
          className="sidebar__emergency"
          onClick={handleEmergencyCall}
        >
          <ShieldAlert size={20} />

          <span>Emergency 911</span>
        </button>

        <button
          type="button"
          className="sidebar__logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />

          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
