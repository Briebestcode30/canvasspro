import { useEffect, useState } from "react";

import "./AddPersonForm.css";

import HomeownerSurvey from "../HomeownerSurvey/HomeownerSurvey";
import VisitOutcome from "../VisitOutcome/VisitOutcome";
import Notes from "../Notes/Notes";

function AddPersonForm({ address = "", onAddPerson, onCancel }) {
  const [name, setName] = useState("");

  const [age, setAge] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [importantIssue, setImportantIssue] = useState("");

  const [industries, setIndustries] = useState([]);

  const [outcome, setOutcome] = useState("");

  const [knocked, setKnocked] = useState(false);

  const [inaccessibleReason, setInaccessibleReason] = useState("");

  const [ctaSigned, setCtaSigned] = useState(null);

  const [waMembershipJoin, setWaMembershipJoin] = useState(false);

  const [textMessageOk, setTextMessageOk] = useState(false);

  const [hotContact, setHotContact] = useState(false);

  const [notes, setNotes] = useState("");

  const [formError, setFormError] = useState("");

  /* =========================
     CLOSE WITH ESCAPE
  ========================= */

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        if (typeof onCancel === "function") {
          onCancel();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  /* =========================
     OUTCOME
  ========================= */

  function handleOutcomeChange(data) {
    setOutcome(data?.outcome || "");

    setKnocked(Boolean(data?.knocked));

    if (data?.outcome === "Inaccessible") {
      setInaccessibleReason(data?.inaccessibleReason || "");
    } else {
      setInaccessibleReason("");
    }
  }

  /* =========================
     CANCEL
  ========================= */

  function handleCancel() {
    if (typeof onCancel === "function") {
      onCancel();
    }
  }

  /* =========================
     SUBMIT
  ========================= */

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

    if (typeof onAddPerson !== "function") {
      setFormError("Unable to save this contact.");

      return;
    }

    onAddPerson({
      name: trimmedName,

      age: numericAge,

      phone: phone.trim(),

      email: email.trim(),

      notes: notes.trim(),

      outcome,

      knocked,

      inaccessibleReason: outcome === "Inaccessible" ? inaccessibleReason : "",

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
      <div
        className="add-person-modal__backdrop"
        onClick={handleCancel}
        aria-hidden="true"
      />

      <section className="add-person-form">
        <div className="add-person-form__topbar">
          <div>
            <p className="add-person-form__eyebrow">Current Address</p>

            <h2 id="add-person-title">Add Person</h2>

            <p className="add-person-form__address">
              {address || "Address unavailable"}
            </p>
          </div>

          <button
            type="button"
            className="add-person-form__close"
            onClick={handleCancel}
            aria-label="Close add person form"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* =====================
              CONTACT INFORMATION
          ===================== */}

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
                  autoComplete="name"
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
                  inputMode="numeric"
                />
              </label>

              <label className="add-person-form__label">
                Phone Number
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter phone number"
                  autoComplete="tel"
                />
              </label>

              <label className="add-person-form__label">
                Email Address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter email address"
                  autoComplete="email"
                />
              </label>
            </div>
          </section>

          {/* =====================
              SURVEY
          ===================== */}

          <HomeownerSurvey
            importantIssue={importantIssue}
            onIssueChange={setImportantIssue}
            industries={industries}
            onIndustriesChange={setIndustries}
          />

          {/* =====================
              KNOCKED
          ===================== */}

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

          {/* =====================
              VISIT OUTCOME
          ===================== */}

          <VisitOutcome
            outcome={outcome}
            knocked={knocked}
            redDoor={false}
            inaccessibleReason={inaccessibleReason}
            onOutcomeChange={handleOutcomeChange}
          />

          {/* =====================
              CTA
          ===================== */}

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
                aria-pressed={ctaSigned === true}
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
                aria-pressed={ctaSigned === false}
              >
                No
              </button>
            </div>
          </section>

          {/* =====================
              ADDITIONAL CONTACT
          ===================== */}

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

          {/* =====================
              NOTES
          ===================== */}

          <Notes value={notes} onChange={setNotes} />

          {/* =====================
              FORM ERROR
          ===================== */}

          {formError && (
            <p className="add-person-form__error" role="alert">
              {formError}
            </p>
          )}

          {/* =====================
              ACTIONS
          ===================== */}

          <div className="add-person-form__actions">
            <button
              type="button"
              className="add-person-form__cancel"
              onClick={handleCancel}
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
