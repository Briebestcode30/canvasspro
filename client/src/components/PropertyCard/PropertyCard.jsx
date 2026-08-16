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
  currentIndex,
  totalProperties,
  onPrevious,
  onNext,
  onSaveProperty,
}) {
  const [homeowner, setHomeowner] = useState(property.homeowner);
  const [age, setAge] = useState(property.age);
  const [family, setFamily] = useState(property.family);
  const [phone, setPhone] = useState(property.phone);
  const [email, setEmail] = useState(property.email);
  const [outcome, setOutcome] = useState(property.outcome || "");
  const [knocked, setKnocked] = useState(property.knocked || false);
  const [notes, setNotes] = useState(property.notes || "");
  const [redDoor, setRedDoor] = useState(property.redDoor || false);

  const [importantIssue, setImportantIssue] = useState(
    property.importantIssue || "",
  );

  const [industries, setIndustries] = useState(property.industries || []);

  const [ctaSigned, setCtaSigned] = useState(property.ctaSigned ?? null);

  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setHomeowner(property.homeowner);
    setAge(property.age);
    setFamily(property.family);
    setPhone(property.phone);
    setEmail(property.email);
    setOutcome(property.outcome || "");
    setKnocked(property.knocked || false);
    setNotes(property.notes || "");
    setRedDoor(property.redDoor || false);
    setImportantIssue(property.importantIssue || "");
    setIndustries(property.industries || []);
    setCtaSigned(property.ctaSigned ?? null);
    setSaveMessage("");
  }, [property]);

  function handleOutcomeChange(data) {
    setOutcome(data.outcome);
    setKnocked(data.knocked);
  }

  function handleRedDoorChange(event) {
    const isRedDoor = event.target.checked;

    setRedDoor(isRedDoor);

    if (isRedDoor) {
      setKnocked(false);
      setOutcome("");
      setImportantIssue("");
      setIndustries([]);
      setCtaSigned(null);
    }
  }

  function createUpdatedProperty() {
    return {
      ...property,
      homeowner,
      age,
      family,
      phone,
      email,
      outcome,
      knocked,
      notes,
      redDoor,
      importantIssue,
      industries,
      ctaSigned,
    };
  }

  function handleSave() {
    const updatedProperty = createUpdatedProperty();

    onSaveProperty(updatedProperty);

    setSaveMessage("Visit saved successfully.");

    setTimeout(() => {
      setSaveMessage("");
    }, 2500);

    console.log("Visit saved:", updatedProperty);
  }

  function handleSaveAndNext() {
    const updatedProperty = createUpdatedProperty();

    onSaveProperty(updatedProperty);

    if (currentIndex < totalProperties - 1) {
      onNext();
    }
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

      <div className="property-card__info">
        <label className="property-card__label">Homeowner</label>

        <input
          type="text"
          value={homeowner}
          onChange={(event) => setHomeowner(event.target.value)}
        />

        <label className="property-card__label">Age</label>

        <input
          type="number"
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />

        <label className="property-card__label">Spouse / Adult Children</label>

        <input
          type="text"
          value={family}
          onChange={(event) => setFamily(event.target.value)}
        />

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

      <label className="property-card__red-door">
        <input
          type="checkbox"
          checked={redDoor}
          onChange={handleRedDoorChange}
        />

        <span>Red Door — Do Not Knock</span>
      </label>

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
                type="radio"
                name={`cta-${property.id}`}
                checked={ctaSigned === true}
                onChange={() => setCtaSigned(true)}
              />

              <span>Yes</span>
            </label>

            <label
              className={`property-card__cta-option ${
                ctaSigned === false ? "property-card__cta-option--selected" : ""
              }`}
            >
              <input
                type="radio"
                name={`cta-${property.id}`}
                checked={ctaSigned === false}
                onChange={() => setCtaSigned(false)}
              />

              <span>No</span>
            </label>
          </div>
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
