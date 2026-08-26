import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Header.css";

function Header({ currentUser }) {
  const navigate = useNavigate();

  function handleProfileClick() {
    navigate("/settings");
  }

  return (
    <header className="header">
      <div className="header__left">
        <h1>CanvassNow</h1>
      </div>

      <div className="header__right">
        {currentUser && (
          <div className="header__user">
            <div className="header__user-info">
              <span className="header__user-name">
                {currentUser.fullName || "Canvasser"}
              </span>

              <span className="header__user-role">
                {currentUser.position || "Canvasser"}
              </span>
            </div>

            <button
              type="button"
              className="header__profile"
              onClick={handleProfileClick}
              aria-label="Open profile settings"
            >
              <User size={18} />
              <span>My Profile</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
