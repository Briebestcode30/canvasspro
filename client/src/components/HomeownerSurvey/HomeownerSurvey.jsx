import "./HomeownerSurvey.css";

function HomeownerSurvey({
  importantIssue = "",
  onIssueChange,
  industries = [],
  onIndustriesChange,
}) {
  const issues = [
    "Jobs",
    "Corporate Accountability",
    "Healthcare",
    "Education",
    "Secured Retirement",
  ];

  const industryOptions = [
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

  const selectedIndustry = industries[0] || "";

  function handleIssueChange(issue) {
    onIssueChange(importantIssue === issue ? "" : issue);
  }

  function handleIndustryChange(industry) {
    onIndustriesChange(selectedIndustry === industry ? [] : [industry]);
  }

  return (
    <section className="homeowner-survey">
      <div className="homeowner-survey__section">
        <h3>What issue is most important to you?</h3>

        <p className="homeowner-survey__helper">
          Select one. Click again to clear.
        </p>

        <div className="homeowner-survey__issues">
          {issues.map((issue) => (
            <label
              key={issue}
              className="homeowner-survey__option"
              onClick={(event) => {
                if (importantIssue === issue) {
                  event.preventDefault();
                  handleIssueChange(issue);
                }
              }}
            >
              <input
                type="radio"
                name="importantIssue"
                value={issue}
                checked={importantIssue === issue}
                onChange={() => handleIssueChange(issue)}
              />

              <span>{issue}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="homeowner-survey__section">
        <h3>What industry do you work in?</h3>

        <p className="homeowner-survey__helper">
          Select one. Click again to clear.
        </p>

        <div className="homeowner-survey__industries">
          {industryOptions.map((industry) => (
            <label
              key={industry}
              className="homeowner-survey__option"
              onClick={(event) => {
                if (selectedIndustry === industry) {
                  event.preventDefault();
                  handleIndustryChange(industry);
                }
              }}
            >
              <input
                type="radio"
                name="industry"
                value={industry}
                checked={selectedIndustry === industry}
                onChange={() => handleIndustryChange(industry)}
              />

              <span>{industry}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeownerSurvey;
