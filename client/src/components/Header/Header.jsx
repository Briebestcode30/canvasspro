import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Header.css";

function Header({ currentUser = null }) {
  const navigate = useNavigate();

  function handleProfileClick() {
    navigate("/settings");
  }

  const displayName =
    currentUser?.fullName?.trim() || currentUser?.email?.trim() || "Canvasser";

  const displayRole =
    currentUser?.position?.trim() ||
    currentUser?.organizationRole?.trim() ||
    "Canvasser";

  return (
    <header className="header">
      <div className="header__left">
        <h1>CanvassNow</h1>
      </div>

      <div className="header__right">
        {currentUser && (
          <div className="header__user">
            <div className="header__user-info">
              <span className="header__user-name">{displayName}</span>

              <span className="header__user-role">{displayRole}</span>
            </div>

            <button
              type="button"
              className="header__profile"
              onClick={handleProfileClick}
              aria-label={`Open profile settings for ${displayName}`}
              title="Open profile settings"
            >
              <User size={18} aria-hidden="true" />

              <span>My Profile</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
