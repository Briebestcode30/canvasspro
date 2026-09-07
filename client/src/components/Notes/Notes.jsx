import { useId } from "react";
import "./Notes.css";

function Notes({ value = "", onChange }) {
  const notesId = useId();

  function handleChange(event) {
    if (typeof onChange === "function") {
      onChange(event.target.value);
    }
  }

  return (
    <section className="notes" aria-labelledby={`${notesId}-label`}>
      <label id={`${notesId}-label`} className="notes__label" htmlFor={notesId}>
        Notes
      </label>

      <textarea
        id={notesId}
        className="notes__textarea"
        value={value}
        onChange={handleChange}
        placeholder="Enter notes about this visit..."
        rows={5}
      />
    </section>
  );
}

export default Notes;
