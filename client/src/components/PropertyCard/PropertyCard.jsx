import { useEffect, useId, useState } from "react";

import { ClipboardList, X } from "lucide-react";

import "./PropertyCard.css";

import HomeownerSurvey from "../HomeownerSurvey/HomeownerSurvey";
import VisitOutcome from "../VisitOutcome/VisitOutcome";
import Notes from "../Notes/Notes";

import SaveButton from "../Buttons/SaveButton";
import PreviousHomeButton from "../Buttons/PreviousHomeButton";
import EmergencyButton from "../Buttons/EmergencyButton";

/* =========================
   QUICK CANVASS SCRIPT
========================= */

const scriptSections = [
  {
    title: "Intro",
    text: "I'm [Name] with Working America, the community affiliate of the AFL-CIO. We're organizing to hold health insurance companies accountable for price gouging.",
  },
  {
    title: "Pass",
    text: "Take a look. [Pass iPad with issues pulled up]",
  },
  {
    title: "Issue ID",
    text: "These are the issues we fight on year-round. Which one of these matters most to you? [Wait for response]",
    followUp: "[If they don't say a why:] What makes you say that?",
  },
  {
    title: "Problem",
    text: "Yeah that's a big one. Right now, we're focused on health care! Everything's getting harder to afford and corporations are continuing to raise healthcare prices that's terrible, right?",
  },
  {
    title: "Solution",
    text: "That's why we're putting pressure on health insurance companies. like Medical Mutual of Ohio. They need to stop increasing prices so that we can pay our bills. Makes sense, right?",
  },
  {
    title: "Strategy",
    text: "The way we win is strength in numbers. That's why you and your neighbors are becoming members in signing our call to action. What's your name?",
  },
  {
    title: "Close",
    text: "Record Info:",
    prompts: [
      "What's your email?",
      "What's your phone number?",
      "Can we text that",
    ],
  },
  {
    title: "Industry ID",
    text: "What do you do for work?",
  },
  {
    title: "CTA",
    text: "Take a look at our call to action does these options apply to you?",
  },
  {
    title: "Multi Member Door",
    text: "Remember we win with strength in numbers, so is there anyone else 18 and up that can sign as a member as well?",
    followUp: "Thank you so much for becoming a member — Have a great day!!!",
  },
];

/* =========================
   PROPERTY CARD
========================= */

function PropertyCard({
  property,
  selectedPersonIndex = 0,
  currentIndex = 0,
  totalProperties = 0,
  onPrevious,
  onNext,
  onSaveProperty,
}) {
  const phoneId = useId();
  const emailId = useId();
  const scriptTitleId = useId();

  const people = Array.isArray(property?.people) ? property.people : [];

  const safePersonIndex =
    selectedPersonIndex >= 0 && selectedPersonIndex < people.length
      ? selectedPersonIndex
      : 0;

  const currentPerson = people[safePersonIndex];

  const redDoor = property?.redDoor === true;

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [outcome, setOutcome] = useState("");

  const [knocked, setKnocked] = useState(false);

  const [inaccessibleReason, setInaccessibleReason] = useState("");

  const [notes, setNotes] = useState("");

  const [importantIssue, setImportantIssue] = useState("");

  const [industries, setIndustries] = useState([]);

  const [ctaSigned, setCtaSigned] = useState(null);

  const [waMembershipJoin, setWaMembershipJoin] = useState(false);

  const [textMessageOk, setTextMessageOk] = useState(false);

  const [hotContact, setHotContact] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  const [showScript, setShowScript] = useState(false);

  const isLastHome =
    totalProperties > 0 && currentIndex === totalProperties - 1;

  /* =========================
     LOAD CURRENT PERSON
  ========================= */

  useEffect(() => {
    if (!currentPerson) {
      setPhone("");
      setEmail("");
      setOutcome("");
      setKnocked(false);
      setInaccessibleReason("");
      setNotes("");
      setImportantIssue("");
      setIndustries([]);
      setCtaSigned(null);
      setWaMembershipJoin(false);
      setTextMessageOk(false);
      setHotContact(false);
      setSaveMessage("");

      return;
    }

    setPhone(currentPerson.phone || "");

    setEmail(currentPerson.email || "");

    setOutcome(currentPerson.outcome || "");

    setKnocked(Boolean(currentPerson.knocked));

    setInaccessibleReason(currentPerson.inaccessibleReason || "");

    setNotes(currentPerson.notes || "");

    setImportantIssue(currentPerson.importantIssue || "");

    setIndustries(
      Array.isArray(currentPerson.industries) ? currentPerson.industries : [],
    );

    setCtaSigned(currentPerson.ctaSigned ?? null);

    setWaMembershipJoin(Boolean(currentPerson.waMembershipJoin));

    setTextMessageOk(Boolean(currentPerson.textMessageOk));

    setHotContact(Boolean(currentPerson.hotContact));

    setSaveMessage("");
  }, [property?.id, safePersonIndex, currentPerson?.id]);

  /* =========================
     SCRIPT KEYBOARD CONTROL
  ========================= */

  useEffect(() => {
    if (!showScript) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setShowScript(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showScript]);

  /* =========================
     OUTCOME
  ========================= */

  function handleOutcomeChange(data) {
    const nextOutcome = data?.outcome || "";

    setOutcome(nextOutcome);

    setKnocked(Boolean(data?.knocked));

    if (nextOutcome === "Inaccessible") {
      setInaccessibleReason(data?.inaccessibleReason || "");
    } else {
      setInaccessibleReason("");
    }
  }

  /* =========================
     CREATE UPDATED PROPERTY
  ========================= */

  function createUpdatedProperty() {
    if (!property || !currentPerson) {
      return null;
    }

    const updatedPerson = {
      ...currentPerson,

      phone: phone.trim(),

      email: email.trim(),

      outcome,

      knocked,

      inaccessibleReason: outcome === "Inaccessible" ? inaccessibleReason : "",

      notes: notes.trim(),

      importantIssue,

      industries: Array.isArray(industries) ? industries : [],

      ctaSigned,

      waMembershipJoin,

      textMessageOk,

      hotContact,
    };

    const updatedPeople = people.map((person, index) =>
      index === safePersonIndex ? updatedPerson : person,
    );

    return {
      ...property,

      people: updatedPeople,
    };
  }

  /* =========================
     SAVE / NEXT
  ========================= */

  function handleSaveAndNext() {
    if (!property || !currentPerson) {
      return;
    }

    const updatedProperty = createUpdatedProperty();

    if (!updatedProperty) {
      return;
    }

    if (typeof onSaveProperty === "function") {
      onSaveProperty(updatedProperty);
    }

    setSaveMessage(isLastHome ? "Visit saved." : "Contact saved.");

    window.setTimeout(() => {
      setSaveMessage("");
    }, 2000);

    if (!isLastHome && typeof onNext === "function") {
      onNext();
    }
  }

  /* =========================
     PREVIOUS
  ========================= */

  function handlePrevious() {
    if (typeof onPrevious === "function") {
      onPrevious();
    }
  }

  /* =========================
     NO PROPERTY
  ========================= */

  if (!property) {
    return null;
  }

  /* =========================
     NO PERSON
  ========================= */

  if (!currentPerson) {
    return (
      <section className="property-card">
        <div className="property-card__header">
          <div>
            <p className="property-card__eyebrow">Current Property</p>

            <h2>{property.address || "Address unavailable"}</h2>
          </div>
        </div>

        {redDoor && (
          <div className="property-card__red-door-warning" role="alert">
            RED DOOR — DO NOT KNOCK
          </div>
        )}

        <p>No person is currently assigned to this address.</p>
      </section>
    );
  }

  /* =========================
     MAIN CARD
  ========================= */

  return (
    <>
      <section className="property-card">
        <div className="property-card__header">
          <div>
            <p className="property-card__eyebrow">Current Property</p>

            <h2>{property.address || "Address unavailable"}</h2>
          </div>

          {totalProperties > 0 && (
            <span className="property-card__route">
              Home {currentIndex + 1} of {totalProperties}
            </span>
          )}
        </div>

        {/* =====================
            QUICK SCRIPT
        ===================== */}

        <button
          type="button"
          className="property-card__script-button"
          onClick={() => setShowScript(true)}
        >
          <ClipboardList size={19} aria-hidden="true" />

          <span>Open Canvass Script</span>
        </button>

        {/* =====================
            RED DOOR
        ===================== */}

        {redDoor && (
          <div className="property-card__red-door-warning" role="alert">
            RED DOOR — DO NOT KNOCK
          </div>
        )}

        {/* =====================
            PERSON SUMMARY
        ===================== */}

        <div className="property-card__person-summary">
          <div>
            <span className="property-card__summary-label">Homeowner</span>

            <strong>{currentPerson.name || "Unnamed Person"}</strong>
          </div>

          <div>
            <span className="property-card__summary-label">Age</span>

            <strong>{currentPerson.age ?? "—"}</strong>
          </div>
        </div>

        {/* =====================
            CONTACT INFORMATION
        ===================== */}

        <div className="property-card__info">
          <label className="property-card__label" htmlFor={phoneId}>
            Phone Number
          </label>

          <input
            id={phoneId}
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter phone number"
            autoComplete="tel"
            disabled={redDoor}
          />

          <label className="property-card__label" htmlFor={emailId}>
            Email Address
          </label>

          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter email address"
            autoComplete="email"
            disabled={redDoor}
          />
        </div>

        {/* =====================
            SURVEY
        ===================== */}

        {!redDoor && (
          <HomeownerSurvey
            importantIssue={importantIssue}
            onIssueChange={setImportantIssue}
            industries={industries}
            onIndustriesChange={setIndustries}
          />
        )}

        {/* =====================
            KNOCKED
        ===================== */}

        {!redDoor && (
          <label className="property-card__knocked">
            <input
              type="checkbox"
              checked={knocked}
              disabled={outcome === "Inaccessible"}
              onChange={(event) => setKnocked(event.target.checked)}
            />

            <span>Knocked</span>
          </label>
        )}

        {/* =====================
            VISIT OUTCOME
        ===================== */}

        <VisitOutcome
          outcome={outcome}
          knocked={knocked}
          redDoor={redDoor}
          inaccessibleReason={inaccessibleReason}
          onOutcomeChange={handleOutcomeChange}
        />

        {/* =====================
            CTA
        ===================== */}

        {!redDoor && (
          <section className="property-card__cta">
            <h3>Did this person sign the CTA?</h3>

            <div
              className="property-card__cta-options"
              role="group"
              aria-label="CTA response"
            >
              <button
                type="button"
                className={`property-card__cta-option ${
                  ctaSigned === true
                    ? "property-card__cta-option--selected"
                    : ""
                }`}
                onClick={() => setCtaSigned(ctaSigned === true ? null : true)}
                aria-pressed={ctaSigned === true}
              >
                Yes
              </button>

              <button
                type="button"
                className={`property-card__cta-option ${
                  ctaSigned === false
                    ? "property-card__cta-option--selected"
                    : ""
                }`}
                onClick={() => setCtaSigned(ctaSigned === false ? null : false)}
                aria-pressed={ctaSigned === false}
              >
                No
              </button>
            </div>
          </section>
        )}

        {/* =====================
            ADDITIONAL FLAGS
        ===================== */}

        {!redDoor && (
          <section className="property-card__field-flags">
            <h3>Additional Contact Information</h3>

            <label className="property-card__flag">
              <input
                type="checkbox"
                checked={waMembershipJoin}
                onChange={(event) => setWaMembershipJoin(event.target.checked)}
              />

              <span>WA Membership Join</span>
            </label>

            <label className="property-card__flag">
              <input
                type="checkbox"
                checked={textMessageOk}
                onChange={(event) => setTextMessageOk(event.target.checked)}
              />

              <span>Text Message OK</span>
            </label>

            <label className="property-card__flag">
              <input
                type="checkbox"
                checked={hotContact}
                onChange={(event) => setHotContact(event.target.checked)}
              />

              <span>Hot Contact</span>
            </label>
          </section>
        )}

        {/* =====================
            CONTACT SUMMARY
        ===================== */}

        {!redDoor && (
          <section className="property-card__contact-summary">
            <h3>Contact Information Collected</h3>

            <p>
              Phone: <strong>{phone.trim() ? "Yes" : "No"}</strong>
            </p>

            <p>
              Email: <strong>{email.trim() ? "Yes" : "No"}</strong>
            </p>

            {outcome === "Inaccessible" && inaccessibleReason && (
              <p>
                Inaccessible Reason: <strong>{inaccessibleReason}</strong>
              </p>
            )}
          </section>
        )}

        {/* =====================
            NOTES
        ===================== */}

        <Notes value={notes} onChange={setNotes} />

        {/* =====================
            ACTION BUTTONS
        ===================== */}

        <div className="property-card__actions">
          <div className="property-card__actions-left">
            <PreviousHomeButton
              onPrevious={handlePrevious}
              disabled={currentIndex <= 0}
            />

            <SaveButton
              onSaveAndNext={handleSaveAndNext}
              disableSaveAndNext={redDoor}
              isLastHome={isLastHome}
            />
          </div>

          <EmergencyButton />
        </div>

        {redDoor && (
          <p className="property-card__red-door-save-note">
            This address is marked Red Door and cannot be canvassed.
          </p>
        )}

        {saveMessage && (
          <p
            className="property-card__save-message"
            role="status"
            aria-live="polite"
          >
            {saveMessage}
          </p>
        )}
      </section>

      {/* =====================
          QUICK SCRIPT MODAL
      ===================== */}

      {showScript && (
        <div
          className="property-card__script-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowScript(false);
            }
          }}
        >
          <div
            className="property-card__script-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={scriptTitleId}
          >
            <div className="property-card__script-header">
              <div>
                <p className="property-card__script-eyebrow">
                  Door Conversation
                </p>

                <h2 id={scriptTitleId}>Canvass Script</h2>
              </div>

              <button
                type="button"
                className="property-card__script-close"
                onClick={() => setShowScript(false)}
                aria-label="Close canvass script"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="property-card__script-property">
              <span>Current Address</span>

              <strong>{property.address || "Address unavailable"}</strong>
            </div>

            <div className="property-card__script-content">
              {scriptSections.map((section, index) => (
                <section
                  key={section.title}
                  className="property-card__script-section"
                >
                  <div className="property-card__script-section-header">
                    <span className="property-card__script-step">
                      {index + 1}
                    </span>

                    <h3>{section.title}</h3>
                  </div>

                  <p className="property-card__script-text">{section.text}</p>

                  {section.followUp && (
                    <p className="property-card__script-follow-up">
                      {section.followUp}
                    </p>
                  )}

                  {section.prompts && (
                    <div className="property-card__script-prompts">
                      {section.prompts.map((prompt) => (
                        <p key={prompt}>{prompt}</p>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            <div className="property-card__script-footer">
              <button type="button" onClick={() => setShowScript(false)}>
                Close Script
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyCard;
