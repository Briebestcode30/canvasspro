import { useState } from "react";
import "./VisitOutcome.css";

function VisitOutcome({
  outcome = "",
  knocked = false,
  redDoor = false,
  inaccessibleReason = "",
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

  const inaccessibleReasons = [
    "No Access to Property",
    "Locked Gate",
    "Apartment / Building Access Denied",
    "No Such Address",
    "Private / Restricted Property",
    "Unsafe to Approach",
    "Other",
  ];

  function handleOutcomeClick(selectedOutcome) {
    if (outcome === selectedOutcome) {
      onOutcomeChange({
        outcome: "",
        knocked,
        inaccessibleReason: "",
      });

      return;
    }

    onOutcomeChange({
      outcome: selectedOutcome,
      knocked: selectedOutcome === "Inaccessible" ? false : knocked,
      inaccessibleReason: "",
    });
  }

  function handleInaccessibleReasonClick(reason) {
    onOutcomeChange({
      outcome: "Inaccessible",
      knocked: false,
      inaccessibleReason: inaccessibleReason === reason ? "" : reason,
    });
  }

  function handleClearResponse() {
    onOutcomeChange({
      outcome: "",
      knocked,
      inaccessibleReason: "",
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
              <div key={item} className="visit-outcome__option-group">
                <button
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

                {item === "Inaccessible" && outcome === "Inaccessible" && (
                  <div className="visit-outcome__inaccessible">
                    <p className="visit-outcome__inaccessible-title">
                      Why is this address inaccessible?
                    </p>

                    <div className="visit-outcome__inaccessible-options">
                      {inaccessibleReasons.map((reason) => {
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
                            <span className="visit-outcome__inaccessible-indicator">
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
        <div className="visit-outcome__selected">
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
