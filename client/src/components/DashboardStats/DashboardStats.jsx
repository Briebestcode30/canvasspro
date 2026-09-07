import { CheckCircle2, Home, MapPinned, Target } from "lucide-react";

import "./DashboardStats.css";

function isPersonVisited(person) {
  const hasCtaResponse =
    person?.ctaSigned === true || person?.ctaSigned === false;

  const hasIndustry =
    Array.isArray(person?.industries) && person.industries.length > 0;

  const hasNotes =
    typeof person?.notes === "string" && person.notes.trim() !== "";

  return Boolean(
    person?.outcome ||
    person?.knocked === true ||
    hasCtaResponse ||
    person?.importantIssue ||
    hasIndustry ||
    person?.waMembershipJoin === true ||
    person?.textMessageOk === true ||
    person?.hotContact === true ||
    hasNotes,
  );
}

function DashboardStats({ properties = [] }) {
  const safeProperties = Array.isArray(properties) ? properties : [];

  const totalHomes = safeProperties.length;

  const visitedHomes = safeProperties.filter((property) => {
    const people = Array.isArray(property?.people) ? property.people : [];

    return people.some((person) => isPersonVisited(person));
  }).length;

  const remainingHomes = Math.max(totalHomes - visitedHomes, 0);

  const completion =
    totalHomes === 0 ? 0 : Math.round((visitedHomes / totalHomes) * 100);

  return (
    <section className="stats" aria-label="Route progress summary">
      <div className="stat-card">
        <Home className="stat-card__icon" size={36} aria-hidden="true" />

        <h3>Homes Assigned</h3>

        <span>{totalHomes}</span>
      </div>

      <div className="stat-card">
        <CheckCircle2
          className="stat-card__icon"
          size={36}
          aria-hidden="true"
        />

        <h3>Visited</h3>

        <span>{visitedHomes}</span>
      </div>

      <div className="stat-card">
        <MapPinned className="stat-card__icon" size={36} aria-hidden="true" />

        <h3>Remaining</h3>

        <span>{remainingHomes}</span>
      </div>

      <div className="stat-card">
        <Target className="stat-card__icon" size={36} aria-hidden="true" />

        <h3>Completion</h3>

        <span>{completion}%</span>
      </div>
    </section>
  );
}

export default DashboardStats;
