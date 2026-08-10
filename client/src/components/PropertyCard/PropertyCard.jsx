import { useEffect, useState } from "react";
import "./PropertyCard.css";

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
    setSaveMessage("");
  }, [property]);

  function handleOutcomeChange(data) {
    setOutcome(data.outcome);
    setKnocked(data.knocked);
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

      <VisitOutcome
        outcome={outcome}
        knocked={knocked}
        onOutcomeChange={handleOutcomeChange}
      />

      <Notes value={notes} onChange={setNotes} />

      <div className="property-card__actions">
        <SaveButton onSave={handleSave} onSaveAndNext={handleSaveAndNext} />

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
