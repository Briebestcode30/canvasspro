import "./App.css";

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>CanvassPro</h2>

        <nav>
          <ul>
            <li>🏠 Dashboard</li>
            <li>🗺️ Routes</li>
            <li>📍 Properties</li>
            <li>📜 History</li>
            <li>⚙️ Settings</li>
            <li>🚨 Emergency</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <h1>Campaign Dashboard</h1>

        <div className="dashboard-card">
          <h3>Today's Progress</h3>

          <p>Homes Assigned: 120</p>
          <p>Completed: 0</p>
          <p>Remaining: 120</p>

          <button>Start Route</button>
        </div>
      </main>
    </div>
  );
}

export default App;
