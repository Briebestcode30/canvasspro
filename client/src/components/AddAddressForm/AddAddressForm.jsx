import { useEffect, useState } from "react";

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

  const [inaccessibleReason, setInaccessibleReason] = useState("");

  const [ctaSigned, setCtaSigned] = useState(null);

  const [waMembershipJoin, setWaMembershipJoin] = useState(false);

  const [textMessageOk, setTextMessageOk] = useState(false);

  const [hotContact, setHotContact] = useState(false);

  const [notes, setNotes] = useState("");

  const [formError, setFormError] = useState("");

  /* =========================
     ESCAPE TO CANCEL
  ========================= */

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && typeof onCancel === "function") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  /* =========================
     VISIT OUTCOME
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

    const trimmedAddress = address.trim();

    const trimmedName = name.trim();

    const numericAge = Number(age);

    if (!trimmedAddress) {
      setFormError("Please enter an address.");

      return;
    }

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

    if (typeof onAddAddress !== "function") {
      setFormError("Unable to save this contact.");

      return;
    }

    setFormError("");

    onAddAddress({
      address: trimmedAddress,

      person: {
        name: trimmedName,

        age: numericAge,

        phone: phone.trim(),

        email: email.trim(),

        notes: notes.trim(),

        outcome,

        knocked,

        inaccessibleReason:
          outcome === "Inaccessible" ? inaccessibleReason : "",

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
    <section className="add-address-form" aria-labelledby="add-address-title">
      <div className="add-address-form__header">
        <p className="add-address-form__eyebrow">New Contact</p>

        <h2 id="add-address-title">Add New Address / Person</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* =====================
            CONTACT INFORMATION
        ===================== */}

        <section className="add-address-form__section">
          <h3>Contact Information</h3>

          <label className="add-address-form__label">
            Address
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter street address"
              autoComplete="street-address"
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
              autoComplete="name"
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
              inputMode="numeric"
            />
          </label>

          <label className="add-address-form__label">
            Phone Number
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter phone number"
              autoComplete="tel"
            />
          </label>

          <label className="add-address-form__label">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email address"
              autoComplete="email"
            />
          </label>
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

        {/* =====================
            OUTCOME
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

        <section className="add-address-form__section">
          <h3>Did this person sign the CTA?</h3>

          <div
            className="add-address-form__cta-options"
            role="group"
            aria-label="CTA response"
          >
            <button
              type="button"
              className={`add-address-form__cta-option ${
                ctaSigned === true
                  ? "add-address-form__cta-option--selected"
                  : ""
              }`}
              onClick={() => setCtaSigned(ctaSigned === true ? null : true)}
              aria-pressed={ctaSigned === true}
            >
              Yes
            </button>

            <button
              type="button"
              className={`add-address-form__cta-option ${
                ctaSigned === false
                  ? "add-address-form__cta-option--selected"
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

        {/* =====================
            NOTES
        ===================== */}

        <Notes value={notes} onChange={setNotes} />

        {/* =====================
            ERROR
        ===================== */}

        {formError && (
          <p className="add-address-form__error" role="alert">
            {formError}
          </p>
        )}

        {/* =====================
            ACTIONS
        ===================== */}

        <div className="add-address-form__actions">
          <button
            type="button"
            className="add-address-form__cancel"
            onClick={handleCancel}
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
