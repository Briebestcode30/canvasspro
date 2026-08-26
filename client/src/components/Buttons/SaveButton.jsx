import "./Buttons.css";

function SaveButton({ onSaveAndNext, disableSaveAndNext = false }) {
  return (
    <button
      className="save-next-button"
      type="button"
      onClick={onSaveAndNext}
      disabled={disableSaveAndNext}
    >
      Save & Next Home
    </button>
  );
}

export default SaveButton;
