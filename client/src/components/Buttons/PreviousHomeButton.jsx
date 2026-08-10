import "./Buttons.css";

function PreviousHomeButton({ onPrevious, disabled }) {
  return (
    <button
      className="secondary-button"
      type="button"
      onClick={onPrevious}
      disabled={disabled}
    >
      Previous Home
    </button>
  );
}

export default PreviousHomeButton;
