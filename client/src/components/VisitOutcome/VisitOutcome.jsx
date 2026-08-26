import { useState } from "react";
import "./VisitOutcome.css";

function VisitOutcome({
  outcome = "",
  knocked = false,
  redDoor = false,
  onOutcomeChange,
}) {
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

  function handleOutcomeClick(selectedOutcome) {
    if (outcome === selectedOutcome) {
      onOutcomeChange({
        outcome: "",
        knocked,
      });

      return;
    }

    onOutcomeChange({
      outcome: selectedOutcome,
      knocked: selectedOutcome === "Inaccessible" ? false : knocked,
    });
  }

  function handleClearResponse() {
    onOutcomeChange({
      outcome: "",
      knocked,
    });
  }

  return (
    <section className="visit-outcome">
      <button
        type="button"
        className="visit-outcome__button"
        disabled={redDoor}
        onClick={() => setIsOpen((current) => !current)}
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
          {outcomes.map((item) => {
            const isSelected = outcome === item;

            return (
              <button
                key={item}
                type="button"
                className={`visit-outcome__option ${
                  isSelected ? "visit-outcome__option--selected" : ""
                }`}
                onClick={() => handleOutcomeClick(item)}
                aria-pressed={isSelected}
              >
                <span className="visit-outcome__indicator">
                  {isSelected ? "✓" : ""}
                </span>

                <span>{item}</span>
              </button>
            );
          })}

          {outcome && (
            <button
              type="button"
              className="visit-outcome__clear"
              onClick={handleClearResponse}
            >
              Clear Response
            </button>
          )}
        </div>
      )}

      {!redDoor && outcome && (
        <p className="visit-outcome__selected">
          Outcome: <strong>{outcome}</strong>
        </p>
      )}
    </section>
  );
}

export default VisitOutcome;
