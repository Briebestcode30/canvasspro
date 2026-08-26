import "./Progress.css";

function Progress({ properties = [] }) {
  const people = properties.flatMap((property) =>
    Array.isArray(property.people) ? property.people : [],
  );

  function countOutcome(outcome) {
    return people.filter((person) => person.outcome === outcome).length;
  }

  const canvassedCount = people.filter(
    (person) =>
      person.knocked ||
      person.outcome ||
      person.ctaSigned !== null ||
      person.email?.trim() ||
      person.phone?.trim() ||
      person.waMembershipJoin === true ||
      person.textMessageOk === true ||
      person.hotContact === true ||
      Boolean(person.importantIssue) ||
      (Array.isArray(person.industries) && person.industries.length > 0),
  ).length;

  const waMembershipJoinCount = people.filter(
    (person) => person.waMembershipJoin === true,
  ).length;

  const emailAddedCount = people.filter((person) =>
    person.email?.trim(),
  ).length;

  const phoneAddedCount = people.filter((person) =>
    person.phone?.trim(),
  ).length;

  const textMessageOkCount = people.filter(
    (person) => person.textMessageOk === true,
  ).length;

  const industryCount = people.filter(
    (person) =>
      Array.isArray(person.industries) && person.industries.length > 0,
  ).length;

  const memberIssueShortCount = people.filter((person) =>
    Boolean(person.importantIssue),
  ).length;

  const ctaCostOfLivingCount = people.filter(
    (person) => person.ctaSigned === true,
  ).length;

  const hotContactCount = people.filter(
    (person) => person.hotContact === true,
  ).length;

  return (
    <section className="progress-page">
      <div className="page-heading">
        <h1>Progress</h1>
      </div>

      <div className="progress-grid">
        <div className="progress-card">
          <span className="progress-card__label">Canvassed</span>
          <strong>{canvassedCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Not Home</span>
          <strong>{countOutcome("Not Home")}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Deceased</span>
          <strong>{countOutcome("Deceased")}</strong>
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
          <span className="progress-card__label">Refused</span>
          <strong>{countOutcome("Refused")}</strong>
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
          <span className="progress-card__label">WA Membership Join</span>
          <strong>{waMembershipJoinCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Email Added</span>
          <strong>{emailAddedCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Phone Added</span>
          <strong>{phoneAddedCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Text Message OK</span>
          <strong>{textMessageOkCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Industry</span>
          <strong>{industryCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Member Issue Short</span>
          <strong>{memberIssueShortCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">CTA Cost Of Living</span>
          <strong>{ctaCostOfLivingCount}</strong>
        </div>

        <div className="progress-card">
          <span className="progress-card__label">Hot Contact</span>
          <strong>{hotContactCount}</strong>
        </div>
      </div>
    </section>
  );
}

export default Progress;
