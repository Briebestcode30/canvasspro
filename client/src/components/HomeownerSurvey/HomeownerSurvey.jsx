import "./HomeownerSurvey.css";

const ISSUES = [
  "Jobs",
  "Corporate Accountability",
  "Healthcare",
  "Education",
  "Secured Retirement",
];

const INDUSTRY_OPTIONS = [
  "Healthcare",
  "Education",
  "Manufacturing",
  "Construction",
  "Technology",
  "Retail",
  "Transportation",
  "Government / Public Service",
  "Finance / Banking",
  "Hospitality / Food Service",
  "Agriculture",
  "Retired",
  "Other",
];

function HomeownerSurvey({
  importantIssue = "",
  onIssueChange,
  industries = [],
  onIndustriesChange,
}) {
  const selectedIndustry =
    Array.isArray(industries) && industries.length > 0 ? industries[0] : "";

  function handleIssueClick(issue) {
    if (typeof onIssueChange !== "function") {
      return;
    }

    onIssueChange(importantIssue === issue ? "" : issue);
  }

  function handleIndustryClick(industry) {
    if (typeof onIndustriesChange !== "function") {
      return;
    }

    onIndustriesChange(selectedIndustry === industry ? [] : [industry]);
  }

  function handleClearIssue() {
    if (typeof onIssueChange === "function") {
      onIssueChange("");
    }
  }

  function handleClearIndustry() {
    if (typeof onIndustriesChange === "function") {
      onIndustriesChange([]);
    }
  }

  return (
    <section className="homeowner-survey" aria-label="Homeowner survey">
      <div className="homeowner-survey__section">
        <h3>What issue is most important to you?</h3>

        <p className="homeowner-survey__helper">
          Select one. Select the same option again to clear.
        </p>

        <div
          className="homeowner-survey__issues"
          role="group"
          aria-label="Important issue"
        >
          {ISSUES.map((issue) => {
            const isSelected = importantIssue === issue;

            return (
              <button
                key={issue}
                type="button"
                className={`homeowner-survey__option ${
                  isSelected ? "homeowner-survey__option--selected" : ""
                }`}
                onClick={() => handleIssueClick(issue)}
                aria-pressed={isSelected}
              >
                <span
                  className="homeowner-survey__indicator"
                  aria-hidden="true"
                >
                  {isSelected ? "✓" : ""}
                </span>

                <span>{issue}</span>
              </button>
            );
          })}
        </div>

        {importantIssue && (
          <button
            type="button"
            className="homeowner-survey__clear"
            onClick={handleClearIssue}
          >
            Clear Response
          </button>
        )}
      </div>

      <div className="homeowner-survey__section">
        <h3>What industry do you work in?</h3>

        <p className="homeowner-survey__helper">
          Select one. Select the same option again to clear.
        </p>

        <div
          className="homeowner-survey__industries"
          role="group"
          aria-label="Industry"
        >
          {INDUSTRY_OPTIONS.map((industry) => {
            const isSelected = selectedIndustry === industry;

            return (
              <button
                key={industry}
                type="button"
                className={`homeowner-survey__option ${
                  isSelected ? "homeowner-survey__option--selected" : ""
                }`}
                onClick={() => handleIndustryClick(industry)}
                aria-pressed={isSelected}
              >
                <span
                  className="homeowner-survey__indicator"
                  aria-hidden="true"
                >
                  {isSelected ? "✓" : ""}
                </span>

                <span>{industry}</span>
              </button>
            );
          })}
        </div>

        {selectedIndustry && (
          <button
            type="button"
            className="homeowner-survey__clear"
            onClick={handleClearIndustry}
          >
            Clear Response
          </button>
        )}
      </div>
    </section>
  );
}

export default HomeownerSurvey;
