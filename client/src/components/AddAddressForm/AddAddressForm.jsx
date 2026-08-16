import { useState } from "react";
import "./AddAddressForm.css";

function AddAddressForm({ onAddAddress, onCancel }) {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

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
      name: trimmedName,
      age: numericAge,
    });

    setAddress("");
    setName("");
    setAge("");
  }

  return (
    <section className="add-address-form">
      <div className="add-address-form__header">
        <p className="add-address-form__eyebrow">New Route Stop</p>

        <h2>Add New Address / Person</h2>

        <p className="add-address-form__helper">
          Add a new address that is not currently listed on today's route.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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
          Person's Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter name"
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

        <div className="add-address-form__actions">
          <button
            type="button"
            className="add-address-form__cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button type="submit" className="add-address-form__submit">
            Add Address / Person
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddAddressForm;
