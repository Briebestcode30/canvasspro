import { useState } from "react";
import "./Settings.css";

function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [showRouteProgress, setShowRouteProgress] = useState(true);
  const [showMapMarkers, setShowMapMarkers] = useState(true);
  const [confirmNextHome, setConfirmNextHome] = useState(false);

  return (
    <section className="settings-page">
      <div className="page-heading">
        <h1>Settings</h1>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <h2>Profile</h2>

          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
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

        <section className="settings-card">
          <h2>Account Role</h2>

          <p className="settings-role">Canvasser</p>

          <p className="settings-help">
            Program Manager controls are only available to authorized manager
            accounts.
          </p>
        </section>
      </div>
    </section>
  );
}

export default Settings;
