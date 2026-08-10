import "./Notes.css";

function Notes({ value, onChange }) {
  return (
    <section className="notes">
      <label className="notes__label">Notes</label>

      <textarea
        className="notes__textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter notes about this visit..."
      />
    </section>
  );
}

export default Notes;
