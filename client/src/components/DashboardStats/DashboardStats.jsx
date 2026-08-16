import "./DashboardStats.css";

import { Home, CheckCircle2, MapPinned, Target } from "lucide-react";

function DashboardStats({ properties = [] }) {
  const totalHomes = properties.length;

  const visitedHomes = properties.filter((property) =>
    property.people?.some((person) => person.outcome || person.knocked),
  ).length;

  const remainingHomes = totalHomes - visitedHomes;

  const completion =
    totalHomes === 0 ? 0 : Math.round((visitedHomes / totalHomes) * 100);

  return (
    <section className="stats">
      <div className="stat-card">
        <Home className="stat-card__icon" size={36} />

        <h3>Homes Assigned</h3>

        <span>{totalHomes}</span>
      </div>

      <div className="stat-card">
        <CheckCircle2 className="stat-card__icon" size={36} />

        <h3>Visited</h3>

        <span>{visitedHomes}</span>
      </div>

      <div className="stat-card">
        <MapPinned className="stat-card__icon" size={36} />

        <h3>Remaining</h3>

        <span>{remainingHomes}</span>
      </div>

      <div className="stat-card">
        <Target className="stat-card__icon" size={36} />

        <h3>Completion</h3>

        <span>{completion}%</span>
      </div>
    </section>
  );
}

export default DashboardStats;
