import "./Sidebar.css";
import {
  LayoutDashboard,
  Map,
  House,
  History,
  Settings,
  ShieldAlert,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h2 className="sidebar__logo">CanvassNow</h2>

        <nav className="sidebar__nav">
          <button className="sidebar__item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button className="sidebar__item">
            <Map size={20} />
            <span>Routes</span>
          </button>

          <button className="sidebar__item">
            <House size={20} />
            <span>Properties</span>
          </button>

          <button className="sidebar__item">
            <History size={20} />
            <span>History</span>
          </button>

          <button className="sidebar__item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <button className="sidebar__emergency">
        <ShieldAlert size={20} />
        <span>Emergency 911</span>
      </button>
    </aside>
  );
}

export default Sidebar;
