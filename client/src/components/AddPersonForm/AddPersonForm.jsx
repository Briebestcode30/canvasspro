import { useState } from "react";
import "./AddPersonForm.css";

function AddPersonForm({ address, onAddPerson, onCancel }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const numericAge = Number(age);

    if (!trimmedName) {
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

    onAddPerson({
      name: trimmedName,
      age: numericAge,
    });

    setName("");
    setAge("");
  }

  return (
    <section className="add-person-form">
      <div className="add-person-form__header">
        <div>
          <p className="add-person-form__eyebrow">Current Address</p>

          <h2>Add Person</h2>

          <p className="add-person-form__address">{address}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="add-person-form__label">
          Person's Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter name"
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

        <div className="add-person-form__actions">
          <button
            type="button"
            className="add-person-form__cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button type="submit" className="add-person-form__submit">
            Add Person
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddPersonForm;
