import "./Buttons.css";

function SaveButton({
  onSaveAndNext,
  disableSaveAndNext = false,
  isLastHome = false,
}) {
  return (
    <button
      className="save-next-button"
      type="button"
      onClick={onSaveAndNext}
      disabled={disableSaveAndNext}
    >
      {isLastHome ? "Save Visit" : "Save & Next Home"}
    </button>
  );
}

export default SaveButton;
