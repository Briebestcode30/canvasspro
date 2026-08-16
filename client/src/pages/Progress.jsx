import "./Progress.css";

function Progress({ properties }) {
  function countOutcome(outcome) {
    return properties.filter((property) => property.outcome === outcome).length;
  }

  function countIssue(issue) {
    return properties.filter((property) => property.importantIssue === issue)
      .length;
  }

  const knockedCount = properties.filter((property) => property.knocked).length;

  const totalVisited = properties.filter(
    (property) => property.outcome || property.knocked,
  ).length;

  const ctaSignedCount = properties.filter(
    (property) => property.ctaSigned === true,
  ).length;

  const phoneCollectedCount = properties.filter((property) =>
    property.phone?.trim(),
  ).length;

  const emailCollectedCount = properties.filter((property) =>
    property.email?.trim(),
  ).length;

  return (
    <section className="progress-page">
      <div className="page-heading">
        <h1>Progress</h1>

        <p>Track today&apos;s canvassing results.</p>
      </div>

      <div className="progress-grid">
        <div className="progress-card">
          <span className="progress-card__label">Total Visited</span>

          <strong>{totalVisited}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Knocked</span>

          <strong>{knockedCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Not Home</span>

          <strong>{countOutcome("Not Home")}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Refused</span>

          <strong>{countOutcome("Refused")}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Inaccessible</span>

          <strong>{countOutcome("Inaccessible")}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Moved</span>

          <strong>{countOutcome("Moved")}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Medically Incompetent</span>

          <strong>{countOutcome("Medically Incompetent")}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Aggressive Homeowner</span>

          <strong>{countOutcome("Aggressive Homeowner")}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">CTA Signed</span>

          <strong>{ctaSignedCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Phone Collected</span>

          <strong>{phoneCollectedCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Email Collected</span>

          <strong>{emailCollectedCount}</strong>
        </div>
      </div>

      <div className="progress-section">
        <div className="page-heading">
          <h2>Most Important Issues</h2>

          <p>See which issues homeowners selected most often.</p>
        </div>

        <div className="progress-grid">
          <div className="progress-card">
            <span className="progress-card__label">Jobs</span>

            <strong>{countIssue("Jobs")}</strong>
          </div>

          <div className="progress-card">
            <span className="progress-card__label">
              Corporate Accountability
            </span>

            <strong>{countIssue("Corporate Accountability")}</strong>
          </div>

          <div className="progress-card">
            <span className="progress-card__label">Healthcare</span>

            <strong>{countIssue("Healthcare")}</strong>
          </div>

          <div className="progress-card">
            <span className="progress-card__label">Education</span>

            <strong>{countIssue("Education")}</strong>
          </div>

          <div className="progress-card">
            <span className="progress-card__label">Secured Retirement</span>

            <strong>{countIssue("Secured Retirement")}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Progress;
