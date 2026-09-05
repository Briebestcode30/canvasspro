import { useState } from "react";
import "./AddPersonForm.css";

import HomeownerSurvey from "../HomeownerSurvey/HomeownerSurvey";
import VisitOutcome from "../VisitOutcome/VisitOutcome";
import Notes from "../Notes/Notes";

function AddPersonForm({ address, onAddPerson, onCancel }) {
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
  const [formError, setFormError] = useState("");

  function handleOutcomeChange(data) {
    setOutcome(data.outcome);
    setKnocked(data.knocked);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const numericAge = Number(age);

    if (!trimmedName) {
      setFormError("Please enter the person's name.");
      return;
    }

    if (
      age === "" ||
      !Number.isFinite(numericAge) ||
      numericAge < 0 ||
      numericAge > 120
    ) {
      setFormError("Please enter a valid age.");
      return;
    }

    setFormError("");

    onAddPerson({
      name: trimmedName,
      age: numericAge,
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      outcome,
      knocked,
      importantIssue,
      industries,
      ctaSigned,
      waMembershipJoin,
      textMessageOk,
      hotContact,
    });
  }

  return (
    <div
      className="add-person-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-person-title"
    >
      <div className="add-person-modal__backdrop" onClick={onCancel} />

      <section className="add-person-form">
        <div className="add-person-form__topbar">
          <div>
            <p className="add-person-form__eyebrow">Current Address</p>

            <h2 id="add-person-title">Add Person</h2>

            <p className="add-person-form__address">{address}</p>
          </div>

          <button
            type="button"
            className="add-person-form__close"
            onClick={onCancel}
            aria-label="Close add person form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <section className="add-person-form__section">
            <h3>Contact Information</h3>

            <div className="add-person-form__contact-grid">
              <label className="add-person-form__label">
                Full Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter full name"
                  autoFocus
                />
              </label>

              <label className="add-person-form__label">
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

              <label className="add-person-form__label">
                Phone Number
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter phone number"
                />
              </label>

              <label className="add-person-form__label">
                Email Address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter email address"
                />
              </label>
            </div>
          </section>

          <HomeownerSurvey
            importantIssue={importantIssue}
            onIssueChange={setImportantIssue}
            industries={industries}
            onIndustriesChange={setIndustries}
          />

          <section className="add-person-form__section">
            <label className="add-person-form__knocked">
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

          <section className="add-person-form__section">
            <h3>Did this person sign the CTA?</h3>

            <div className="add-person-form__cta-options">
              <button
                type="button"
                className={`add-person-form__cta-option ${
                  ctaSigned === true
                    ? "add-person-form__cta-option--selected"
                    : ""
                }`}
                onClick={() => setCtaSigned(ctaSigned === true ? null : true)}
              >
                Yes
              </button>

              <button
                type="button"
                className={`add-person-form__cta-option ${
                  ctaSigned === false
                    ? "add-person-form__cta-option--selected"
                    : ""
                }`}
                onClick={() => setCtaSigned(ctaSigned === false ? null : false)}
              >
                No
              </button>
            </div>
          </section>

          <section className="add-person-form__section">
            <h3>Additional Contact Information</h3>

            <label className="add-person-form__flag">
              <input
                type="checkbox"
                checked={waMembershipJoin}
                onChange={(event) => setWaMembershipJoin(event.target.checked)}
              />

              <span>WA Membership Join</span>
            </label>

            <label className="add-person-form__flag">
              <input
                type="checkbox"
                checked={textMessageOk}
                onChange={(event) => setTextMessageOk(event.target.checked)}
              />

              <span>Text Message OK</span>
            </label>

            <label className="add-person-form__flag">
              <input
                type="checkbox"
                checked={hotContact}
                onChange={(event) => setHotContact(event.target.checked)}
              />

              <span>Hot Contact</span>
            </label>
          </section>

          <Notes value={notes} onChange={setNotes} />

          {formError && <p className="add-person-form__error">{formError}</p>}

          <div className="add-person-form__actions">
            <button
              type="button"
              className="add-person-form__cancel"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button type="submit" className="add-person-form__submit">
              Save Contact
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddPersonForm;
