import { useEffect, useState } from "react";
import "./Settings.css";

function Settings({ isLoggedIn = true, currentUser = null, onUpdateUser }) {
  const [fullName, setFullName] = useState(currentUser?.fullName || "");

  const [email, setEmail] = useState(currentUser?.email || "");

  const [password, setPassword] = useState("");

  const [position, setPosition] = useState(
    currentUser?.position || "Canvasser",
  );

  const [organizationRole, setOrganizationRole] = useState(
    currentUser?.organizationRole || "Canvasser",
  );

  const [showRouteProgress, setShowRouteProgress] = useState(true);
  const [showMapMarkers, setShowMapMarkers] = useState(true);
  const [confirmNextHome, setConfirmNextHome] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setFullName(currentUser?.fullName || "");
    setEmail(currentUser?.email || "");
    setPosition(currentUser?.position || "Canvasser");
    setOrganizationRole(currentUser?.organizationRole || "Canvasser");
  }, [currentUser]);

  function handleSaveProfile(event) {
    event.preventDefault();

    if (!isLoggedIn || !onUpdateUser) {
      return;
    }

    onUpdateUser({
      ...currentUser,
      fullName: fullName.trim(),
      email: email.trim(),
      position,
      organizationRole,
    });

    setPassword("");
    setSaveMessage("Profile updated.");

    setTimeout(() => {
      setSaveMessage("");
    }, 2500);
  }

  return (
    <section className="settings-page">
      <div className="page-heading">
        <h1>Settings</h1>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <h2>Profile</h2>

          <form onSubmit={handleSaveProfile}>
            <label>
              Full Name
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
            </label>

            <label>
              Position
              <select
                value={position}
                onChange={(event) => setPosition(event.target.value)}
              >
                <option value="Assistant Field Director">
                  Assistant Field Director
                </option>

                <option value="Canvasser">Canvasser</option>
              </select>
            </label>

            <label>
              Organization Role
              <select
                value={organizationRole}
                onChange={(event) => setOrganizationRole(event.target.value)}
              >
                <option value="Assistant Field Director">
                  Assistant Field Director
                </option>

                <option value="Field Director">Field Director</option>

                <option value="Canvasser">Canvasser</option>
              </select>
            </label>

            <button type="submit" className="settings-save">
              Save Profile
            </button>

            {saveMessage && (
              <p className="settings-save-message">{saveMessage}</p>
            )}
          </form>
        </section>

        <section className="settings-card">
          <h2>App Preferences</h2>

          <label className="settings-option">
            <input
              type="checkbox"
              checked={showRouteProgress}
              onChange={(event) => setShowRouteProgress(event.target.checked)}
            />

            <span>Show route progress on dashboard</span>
          </label>

          <label className="settings-option">
            <input
              type="checkbox"
              checked={showMapMarkers}
              onChange={(event) => setShowMapMarkers(event.target.checked)}
            />

            <span>Show map markers automatically</span>
          </label>

          <label className="settings-option">
            <input
              type="checkbox"
              checked={confirmNextHome}
              onChange={(event) => setConfirmNextHome(event.target.checked)}
            />

            <span>Confirm before moving to next home</span>
          </label>
        </section>

        {isLoggedIn && currentUser && (
          <section className="settings-card">
            <h2>Account Role</h2>

            <p className="settings-account-name">{fullName || "User"}</p>

            <p className="settings-account-position">{position}</p>

            <p className="settings-role">{organizationRole}</p>
          </section>
        )}
      </div>
    </section>
  );
}

export default Settings;
