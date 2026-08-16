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

  function handleIndustryChange(industry) {
    if (industries.includes(industry)) {
      const updatedIndustries = industries.filter(
        (selectedIndustry) => selectedIndustry !== industry,
      );

      onIndustriesChange(updatedIndustries);
    } else {
      onIndustriesChange([...industries, industry]);
    }
  }

  return (
    <section className="homeowner-survey">
      <div className="homeowner-survey__section">
        <h3>What issue is most important to you?</h3>

        <p className="homeowner-survey__helper">Select one.</p>

        <div className="homeowner-survey__issues">
          {issues.map((issue) => (
            <label key={issue} className="homeowner-survey__option">
              <input
                type="radio"
                name="importantIssue"
                value={issue}
                checked={importantIssue === issue}
                onChange={() => onIssueChange(issue)}
              />

              <span>{issue}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="homeowner-survey__section">
        <h3>What industry do you work in?</h3>

        <p className="homeowner-survey__helper">Select all that apply.</p>

        <div className="homeowner-survey__industries">
          {industryOptions.map((industry) => (
            <label key={industry} className="homeowner-survey__option">
              <input
                type="checkbox"
                value={industry}
                checked={industries.includes(industry)}
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
