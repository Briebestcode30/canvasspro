import "./Sidebar.css";

import {
  LayoutDashboard,
  Map,
  ChartNoAxesColumnIncreasing,
  UsersRound,
  Settings,
  ShieldAlert,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  function handleEmergencyCall() {
    const confirmed = window.confirm("Call 911 emergency services?");

    if (confirmed) {
      window.location.href = "tel:911";
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

      <button
        type="button"
        className="sidebar__emergency"
        onClick={handleEmergencyCall}
      >
        <ShieldAlert size={20} />
        <span>Emergency 911</span>
      </button>
    </aside>
  );
}

export default Sidebar;
