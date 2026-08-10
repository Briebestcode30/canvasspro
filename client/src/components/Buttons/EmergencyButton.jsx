import "./Buttons.css";

function EmergencyButton() {
  function handleEmergencyCall() {
    const confirmed = window.confirm("Call 911 emergency services?");

    if (confirmed) {
      window.location.href = "tel:911";
    }
  }

  return (
    <button
      className="danger-button"
      type="button"
      onClick={handleEmergencyCall}
    >
      Emergency 911
    </button>
  );
}

export default EmergencyButton;
