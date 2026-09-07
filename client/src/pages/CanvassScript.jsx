import "./CanvassScript.css";

const scriptSections = [
  {
    title: "Intro",
    text: "I'm [Name] with Working America, the community affiliate of the AFL-CIO. We're organizing to hold health insurance companies accountable for price gouging.",
  },
  {
    title: "Pass",
    text: "Take a look. [Pass iPad with issues pulled up]",
  },
  {
    title: "Issue ID",
    text: "These are the issues we fight on year-round. Which one of these matters most to you? [Wait for response]",
    followUp: "[If they don't say a why:] What makes you say that?",
  },
  {
    title: "Problem",
    text: "Yeah that's a big one. Right now, we're focused on health care! Everything's getting harder to afford and corporations are continuing to raise healthcare prices that's terrible, right?",
  },
  {
    title: "Solution",
    text: "That's why we're putting pressure on health insurance companies. like Medical Mutual of Ohio. They need to stop increasing prices so that we can pay our bills. Makes sense, right?",
  },
  {
    title: "Strategy",
    text: "The way we win is strength in numbers. That's why you and your neighbors are becoming members in signing our call to action. What's your name?",
  },
  {
    title: "Close",
    text: "Record Info:",
    prompts: [
      "What's your email?",
      "What's your phone number?",
      "Can we text that",
    ],
  },
  {
    title: "Industry ID",
    text: "What do you do for work?",
  },
  {
    title: "CTA",
    text: "Take a look at our call to action does these options apply to you?",
  },
  {
    title: "Multi Member Door",
    text: "Remember we win with strength in numbers, so is there anyone else 18 and up that can sign as a member as well?",
    followUp: "Thank you so much for becoming a member — Have a great day!!!",
  },
];

function CanvassScript() {
  return (
    <div className="canvass-script">
      <div className="page-heading">
        <h1>Canvass Script</h1>

        <p className="canvass-script__intro">
          Keep this page open while canvassing so the full conversation flow is
          easy to reference at the door.
        </p>
      </div>

      <div className="canvass-script__list">
        {scriptSections.map((section, index) => (
          <section key={section.title} className="canvass-script__card">
            <div className="canvass-script__card-header">
              <span className="canvass-script__step">{index + 1}</span>

              <h2>{section.title}</h2>
            </div>

            <p className="canvass-script__text">{section.text}</p>

            {section.followUp && (
              <p className="canvass-script__follow-up">{section.followUp}</p>
            )}

            {section.prompts && (
              <div className="canvass-script__prompts">
                {section.prompts.map((prompt) => (
                  <p key={prompt}>{prompt}</p>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default CanvassScript;
