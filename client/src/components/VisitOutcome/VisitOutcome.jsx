import { useState } from "react";
import "./VisitOutcome.css";

function VisitOutcome({ outcome, knocked, redDoor, onOutcomeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const outcomes = [
    "Not Home",
    "Deceased",
    "Refused",
    "Inaccessible",
    "Moved",
    "Medically Incompetent",
    "Aggressive Homeowner",
  ];

  function handleOutcomeChange(selectedOutcome) {
    const nextKnocked = selectedOutcome === "Inaccessible" ? false : knocked;

    onOutcomeChange({
      outcome: selectedOutcome,
      knocked: nextKnocked,
    });
  }

  return (
    <section className="visit-outcome">
      <button
        type="button"
        className="visit-outcome__button"
        disabled={redDoor}
        onClick={() => setIsOpen(!isOpen)}
      >
        I couldn't reach this contact
      </button>

      {redDoor && (
        <p className="visit-outcome__red-door-message">
          This address is marked Do Not Knock.
        </p>
      )}

      {!redDoor && isOpen && (
        <div className="visit-outcome__options">
          {outcomes.map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="visit-outcome"
                value={item}
                checked={outcome === item}
                onChange={() => handleOutcomeChange(item)}
              />

              <span>{item}</span>
            </label>
          ))}
        </div>
      )}

      {!redDoor && outcome && (
        <p className="visit-outcome__selected">Outcome: {outcome}</p>
      )}
    </section>
  );
}

export default VisitOutcome;
