import "./Buttons.css";

function SaveButton({ onSave, onSaveAndNext, disableSaveAndNext = false }) {
  return (
    <>
      <button className="primary-button" type="button" onClick={onSave}>
        Save Visit
      </button>

      <button
        className="save-next-button"
        type="button"
        onClick={onSaveAndNext}
        disabled={disableSaveAndNext}
      >
        Save & Next Home
      </button>
    </>
  );
}

export default SaveButton;
