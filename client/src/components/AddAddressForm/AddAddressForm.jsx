import { useState } from "react";
import "./AddAddressForm.css";

import HomeownerSurvey from "../HomeownerSurvey/HomeownerSurvey";
import VisitOutcome from "../VisitOutcome/VisitOutcome";
import Notes from "../Notes/Notes";

function AddAddressForm({ onAddAddress, onCancel }) {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [importantIssue, setImportantIssue] = useState("");
  const [industries, setIndustries] = useState([]);
  const [outcome, setOutcome] = useState("");
  const [knocked, setKnocked] = useState(false);
  const [ctaSigned, setCtaSigned] = useState(null);
  const [waMembershipJoin, setWaMembershipJoin] = useState(false);
  const [textMessageOk, setTextMessageOk] = useState(false);
  const [hotContact, setHotContact] = useState(false);
  const [notes, setNotes] = useState("");

  function handleOutcomeChange(data) {
    setOutcome(data.outcome);
    setKnocked(data.knocked);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedAddress = address.trim();
    const trimmedName = name.trim();
    const numericAge = Number(age);

    if (!trimmedAddress || !trimmedName) {
      return;
    }

    if (
      age === "" ||
      !Number.isFinite(numericAge) ||
      numericAge < 0 ||
      numericAge > 120
    ) {
      return;
    }

    onAddAddress({
      address: trimmedAddress,
      person: {
        name: trimmedName,
        age: numericAge,
        phone: phone.trim(),
        email: email.trim(),
        notes,
        outcome,
        knocked,
        importantIssue,
        industries,
        ctaSigned,
        waMembershipJoin,
        textMessageOk,
        hotContact,
      },
    });
  }

  return (
    <section className="add-address-form">
      <div className="add-address-form__header">
        <p className="add-address-form__eyebrow">New Contact</p>

        <h2>Add New Address / Person</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <section className="add-address-form__section">
          <h3>Contact Information</h3>

          <label className="add-address-form__label">
            Address
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter street address"
              autoFocus
            />
          </label>

          <label className="add-address-form__label">
            Full Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter full name"
            />
          </label>

          <label className="add-address-form__label">
            Age
            <input
              type="number"
              min="0"
              max="120"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="Enter age"
            />
          </label>

          <label className="add-address-form__label">
            Phone Number
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter phone number"
            />
          </label>

          <label className="add-address-form__label">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email address"
            />
          </label>
        </section>

        <HomeownerSurvey
          importantIssue={importantIssue}
          onIssueChange={setImportantIssue}
          industries={industries}
          onIndustriesChange={setIndustries}
        />

        <section className="add-address-form__section">
          <label className="add-address-form__knocked">
            <input
              type="checkbox"
              checked={knocked}
              disabled={outcome === "Inaccessible"}
              onChange={(event) => setKnocked(event.target.checked)}
            />

            <span>Knocked</span>
          </label>
        </section>

        <VisitOutcome
          outcome={outcome}
          knocked={knocked}
          redDoor={false}
          onOutcomeChange={handleOutcomeChange}
        />

        <section className="add-address-form__section">
          <h3>Did this person sign the CTA?</h3>

          <div className="add-address-form__cta-options">
            <label
              className={`add-address-form__cta-option ${
                ctaSigned === true
                  ? "add-address-form__cta-option--selected"
                  : ""
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
              className={`add-address-form__cta-option ${
                ctaSigned === false
                  ? "add-address-form__cta-option--selected"
                  : ""
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

        <section className="add-address-form__section">
          <h3>Additional Contact Information</h3>

          <label className="add-address-form__flag">
            <input
              type="checkbox"
              checked={waMembershipJoin}
              onChange={(event) => setWaMembershipJoin(event.target.checked)}
            />

            <span>WA Membership Join</span>
          </label>

          <label className="add-address-form__flag">
            <input
              type="checkbox"
              checked={textMessageOk}
              onChange={(event) => setTextMessageOk(event.target.checked)}
            />

            <span>Text Message OK</span>
          </label>

          <label className="add-address-form__flag">
            <input
              type="checkbox"
              checked={hotContact}
              onChange={(event) => setHotContact(event.target.checked)}
            />

            <span>Hot Contact</span>
          </label>
        </section>

        <Notes value={notes} onChange={setNotes} />

        <div className="add-address-form__actions">
          <button
            type="button"
            className="add-address-form__cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button type="submit" className="add-address-form__submit">
            Save Contact
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddAddressForm;
