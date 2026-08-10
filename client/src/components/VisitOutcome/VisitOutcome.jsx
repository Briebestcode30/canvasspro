import { useState } from "react";
import "./VisitOutcome.css";

function VisitOutcome({ outcome, knocked, onOutcomeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const outcomes = [
    "Not Home",
    "Refused",
    "Inaccessible",
    "Moved",
    "Medically Incompetent",
    "Aggressive Homeowner",
    "CTA",
    "Industry Code",
  ];

  const isInaccessible = outcome === "Inaccessible";

  function handleOutcomeChange(selectedOutcome) {
    const nextKnocked = selectedOutcome === "Inaccessible" ? false : knocked;

    onOutcomeChange({
      outcome: selectedOutcome,
      knocked: nextKnocked,
    });
  }

  function handleKnockedChange(event) {
    onOutcomeChange({
      outcome,
      knocked: event.target.checked,
    });
  }

  return (
    <section className="visit-outcome">
      <button
        type="button"
        className="visit-outcome__button"
        onClick={() => setIsOpen(!isOpen)}
      >
        I couldn't reach this contact
      </button>

      {isOpen && (
        <div className="visit-outcome__options">
          <label className="visit-outcome__knocked">
            <input
              type="checkbox"
              checked={knocked}
              disabled={isInaccessible}
              onChange={handleKnockedChange}
            />

            <span>Knocked</span>
          </label>

          {outcomes.map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="outcome"
                value={item}
                checked={outcome === item}
                onChange={() => handleOutcomeChange(item)}
              />

              <span>{item}</span>
            </label>
          ))}
        </div>
      )}

      {outcome && <p className="visit-outcome__selected">Outcome: {outcome}</p>}

      {knocked && <p className="visit-outcome__knocked-status">Knocked</p>}
    </section>
  );
}

export default VisitOutcome;
