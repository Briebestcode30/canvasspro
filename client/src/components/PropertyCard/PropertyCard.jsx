import { useEffect, useState } from "react";
import "./PropertyCard.css";

import HomeownerSurvey from "../HomeownerSurvey/HomeownerSurvey";
import VisitOutcome from "../VisitOutcome/VisitOutcome";
import Notes from "../Notes/Notes";
import SaveButton from "../Buttons/SaveButton";
import PreviousHomeButton from "../Buttons/PreviousHomeButton";
import NextHomeButton from "../Buttons/NextHomeButton";
import EmergencyButton from "../Buttons/EmergencyButton";

function PropertyCard({
  property,
  selectedPersonIndex = 0,
  currentIndex,
  totalProperties,
  onPrevious,
  onNext,
  onSaveProperty,
}) {
  const currentPerson = property?.people?.[selectedPersonIndex];

  const redDoor = property?.redDoor || false;

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [outcome, setOutcome] = useState("");
  const [knocked, setKnocked] = useState(false);
  const [notes, setNotes] = useState("");
  const [importantIssue, setImportantIssue] = useState("");
  const [industries, setIndustries] = useState([]);
  const [ctaSigned, setCtaSigned] = useState(null);
  const [waMembershipJoin, setWaMembershipJoin] = useState(false);
  const [textMessageOk, setTextMessageOk] = useState(false);
  const [hotContact, setHotContact] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!currentPerson) {
      setPhone("");
      setEmail("");
      setOutcome("");
      setKnocked(false);
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
  }, [property.id, selectedPersonIndex, currentPerson?.id]);

  function handleOutcomeChange(data) {
    setOutcome(data.outcome);
    setKnocked(data.knocked);
  }

  function createUpdatedProperty() {
    if (!currentPerson) {
      return property;
    }

    const updatedPerson = {
      ...currentPerson,

      phone: phone.trim(),
      email: email.trim(),
      outcome,
      knocked,
      notes,
      importantIssue,
      industries,
      ctaSigned,
      waMembershipJoin,
      textMessageOk,
      hotContact,
    };

    const updatedPeople = property.people.map((person, index) => {
      if (index === selectedPersonIndex) {
        return updatedPerson;
      }

      return person;
    });

    return {
      ...property,
      people: updatedPeople,
    };
  }

  function handleSave() {
    if (!currentPerson) {
      return;
    }

    const updatedProperty = createUpdatedProperty();

    onSaveProperty(updatedProperty);

    setSaveMessage("Contact saved successfully.");

    window.setTimeout(() => {
      setSaveMessage("");
    }, 2500);
  }

  function handleSaveAndNext() {
    if (!currentPerson) {
      return;
    }

    const updatedProperty = createUpdatedProperty();

    onSaveProperty(updatedProperty);

    if (currentIndex < totalProperties - 1) {
      onNext();
    }
  }

  if (!property) {
    return null;
  }

  if (!currentPerson) {
    return (
      <section className="property-card">
        <div className="property-card__header">
          <div>
            <p className="property-card__eyebrow">Current Property</p>

            <h2>{property.address}</h2>
          </div>
        </div>

        <p>No person is currently assigned to this address.</p>
      </section>
    );
  }

  return (
    <section className="property-card">
      <div className="property-card__header">
        <div>
          <p className="property-card__eyebrow">Current Property</p>

          <h2>{property.address}</h2>
        </div>

        <span className="property-card__route">
          Home {currentIndex + 1} of {totalProperties}
        </span>
      </div>

      {redDoor && (
        <div className="property-card__red-door-warning">
          RED DOOR — DO NOT KNOCK
        </div>
      )}

      <div className="property-card__person-summary">
        <div>
          <span className="property-card__summary-label">Homeowner</span>

          <strong>{currentPerson.name}</strong>
        </div>

        <div>
          <span className="property-card__summary-label">Age</span>

          <strong>{currentPerson.age}</strong>
        </div>
      </div>

      <div className="property-card__info">
        <label className="property-card__label">Phone Number</label>

        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Enter phone number"
        />

        <label className="property-card__label">Email Address</label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter email address"
        />
      </div>

      {!redDoor && (
        <HomeownerSurvey
          importantIssue={importantIssue}
          onIssueChange={setImportantIssue}
          industries={industries}
          onIndustriesChange={setIndustries}
        />
      )}

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

      <VisitOutcome
        outcome={outcome}
        knocked={knocked}
        redDoor={redDoor}
        onOutcomeChange={handleOutcomeChange}
      />

      {!redDoor && (
        <section className="property-card__cta">
          <h3>Did this person sign the CTA?</h3>

          <div className="property-card__cta-options">
            <label
              className={`property-card__cta-option ${
                ctaSigned === true ? "property-card__cta-option--selected" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={ctaSigned === true}
                onChange={() => setCtaSigned(ctaSigned === true ? null : true)}
              />

              <span>Yes</span>
            </label>

            <label
              className={`property-card__cta-option ${
                ctaSigned === false ? "property-card__cta-option--selected" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={ctaSigned === false}
                onChange={() =>
                  setCtaSigned(ctaSigned === false ? null : false)
                }
              />

              <span>No</span>
            </label>
          </div>
        </section>
      )}

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

      {!redDoor && (
        <section className="property-card__contact-summary">
          <h3>Contact Information Collected</h3>

          <p>
            Phone: <strong>{phone.trim() ? "Yes" : "No"}</strong>
          </p>

          <p>
            Email: <strong>{email.trim() ? "Yes" : "No"}</strong>
          </p>
        </section>
      )}

      <Notes value={notes} onChange={setNotes} />

      <div className="property-card__actions">
        <SaveButton
          onSave={handleSave}
          onSaveAndNext={handleSaveAndNext}
          disableSaveAndNext={currentIndex === totalProperties - 1}
        />

        <PreviousHomeButton
          onPrevious={onPrevious}
          disabled={currentIndex === 0}
        />

        <NextHomeButton
          onNext={onNext}
          disabled={currentIndex === totalProperties - 1}
        />

        <EmergencyButton />
      </div>

      {saveMessage && (
        <p className="property-card__save-message">{saveMessage}</p>
      )}
    </section>
  );
}

export default PropertyCard;
