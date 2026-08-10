import "./Buttons.css";

function SaveButton({ onSave, onSaveAndNext }) {
  return (
    <>
      <button className="primary-button" type="button" onClick={onSave}>
        Save Visit
      </button>

      <button
        className="save-next-button"
        type="button"
        onClick={onSaveAndNext}
      >
        Save & Next Home
      </button>
    </>
  );
}

export default SaveButton;
