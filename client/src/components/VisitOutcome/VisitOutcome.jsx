import { useState } from "react";
import "./VisitOutcome.css";

const OUTCOMES = [
  "Not Home",
  "Deceased",
  "Refused",
  "Inaccessible",
  "Moved",
  "Medically Incompetent",
  "Aggressive Homeowner",
];

const INACCESSIBLE_REASONS = [
  "No Access to Property",
  "Locked Gate",
  "Apartment / Building Access Denied",
  "No Such Address",
  "Private / Restricted Property",
  "Unsafe to Approach",
  "Other",
];

function VisitOutcome({
  outcome = "",
  knocked = false,
  redDoor = false,
  inaccessibleReason = "",
  onOutcomeChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  function sendOutcomeChange(data) {
    if (typeof onOutcomeChange === "function") {
      onOutcomeChange(data);
    }
  }

  function handleOutcomeClick(selectedOutcome) {
    const isCurrentlySelected = outcome === selectedOutcome;

    if (isCurrentlySelected) {
      sendOutcomeChange({
        outcome: "",
        knocked,
        inaccessibleReason: "",
      });

      return;
    }

    const isInaccessible = selectedOutcome === "Inaccessible";

    sendOutcomeChange({
      outcome: selectedOutcome,
      knocked: isInaccessible ? false : knocked,
      inaccessibleReason: "",
    });
  }

  function handleInaccessibleReasonClick(reason) {
    const isCurrentlySelected = inaccessibleReason === reason;

    sendOutcomeChange({
      outcome: "Inaccessible",
      knocked: false,
      inaccessibleReason: isCurrentlySelected ? "" : reason,
    });
  }

  function handleClearResponse() {
    sendOutcomeChange({
      outcome: "",
      knocked,
      inaccessibleReason: "",
    });
  }

  return (
    <section className="visit-outcome" aria-label="Visit outcome">
      <button
        type="button"
        className="visit-outcome__button"
        disabled={redDoor}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="visit-outcome-options"
      >
        I couldn't reach this contact
      </button>

      {redDoor && (
        <p className="visit-outcome__red-door-message" role="alert">
          This address is marked Do Not Knock.
        </p>
      )}

      {!redDoor && isOpen && (
        <div id="visit-outcome-options" className="visit-outcome__options">
          {OUTCOMES.map((item) => {
            const isSelected = outcome === item;

            return (
              <div key={item} className="visit-outcome__option-group">
                <button
                  type="button"
                  className={`visit-outcome__option ${
                    isSelected ? "visit-outcome__option--selected" : ""
                  }`}
                  onClick={() => handleOutcomeClick(item)}
                  aria-pressed={isSelected}
                >
                  <span className="visit-outcome__indicator" aria-hidden="true">
                    {isSelected ? "✓" : ""}
                  </span>

                  <span>{item}</span>
                </button>

                {item === "Inaccessible" && outcome === "Inaccessible" && (
                  <div className="visit-outcome__inaccessible">
                    <p className="visit-outcome__inaccessible-title">
                      Why is this address inaccessible?
                    </p>

                    <div className="visit-outcome__inaccessible-options">
                      {INACCESSIBLE_REASONS.map((reason) => {
                        const isReasonSelected = inaccessibleReason === reason;

                        return (
                          <button
                            key={reason}
                            type="button"
                            className={`visit-outcome__inaccessible-option ${
                              isReasonSelected
                                ? "visit-outcome__inaccessible-option--selected"
                                : ""
                            }`}
                            onClick={() =>
                              handleInaccessibleReasonClick(reason)
                            }
                            aria-pressed={isReasonSelected}
                          >
                            <span
                              className="visit-outcome__inaccessible-indicator"
                              aria-hidden="true"
                            >
                              {isReasonSelected ? "✓" : ""}
                            </span>

                            <span>{reason}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
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
        <div className="visit-outcome__selected" role="status">
          <p>
            Outcome: <strong>{outcome}</strong>
          </p>

          {outcome === "Inaccessible" && inaccessibleReason && (
            <p>
              Reason: <strong>{inaccessibleReason}</strong>
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default VisitOutcome;
