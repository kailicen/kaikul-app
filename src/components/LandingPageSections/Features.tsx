import React from "react";

type Props = {};

function Features({}: Props) {
  return (
    <div
      className="min-h-[50vh] w-screen md:w-auto flex flex-col py-20
    px-3 mx-auto items-center justify-center max-w-7xl"
    >
      <h3 className="mb-10 text-3xl font-bold text-violet-500">Features</h3>
      <div className="grid md:grid-cols-3 px-2 md:px-5">
        <div
          className="p-5 text-sm md:text-base
        flex flex-col items-center space-y-4 bg-violet-100"
        >
          {/* <Image src="/img/goals.png" width={150} height={150} alt="goals" /> */}
          <h4 className="text-violet-500 mt-2 text-xl font-bold">
            📝 Weekly Sprint App
          </h4>
          <ul className="text-black">
            <li>✅ Set overarching weekly goals</li>
            <li>
              ✅ Break goals into manageable weekly tasks visually in a to-do
              calendar
            </li>
            <li>
              ✅ Track daily tasks and reflect on obstacles using our sprint
              framework
            </li>
            <li>✅ Share daily sprints on Slack</li>
            <li>✅ Analyze your weekly progress</li>
          </ul>
        </div>
        <div
          className="p-5 text-sm md:text-base text-violet-50
        flex flex-col items-center space-y-4 bg-violet-600"
        >
          {/* <Image src="/img/goals.png" width={150} height={150} alt="goals" /> */}
          <h4 className="text-violet-50 mt-2 text-xl font-bold">
            👯 1-1 Weekly Virtual Call
          </h4>
          <ul>
            <li>✅ Connect with a motivated buddy</li>
            <li>✅ Reflect on your week using a structured checklist</li>
            <li>✅ Dive into authentic and open conversations</li>
            <li>
              ✅ Discuss the &quot;Theme of the Week&quot; (personal development
              topic)
            </li>
            <li>✅ Set your goals next week with a reflective mind</li>
          </ul>
        </div>

        <div
          className="p-5 text-sm md:text-base
        flex flex-col items-center space-y-4 bg-violet-100"
        >
          {/* <Image src="/img/goals.png" width={150} height={150} alt="goals" /> */}
          <h4 className="text-violet-500 mt-2 text-xl font-bold">
            💖 Reminders And Extra Support
          </h4>
          <ul className="text-black">
            <li>✅ Receive the &quot;Theme of the Week&quot; every Monday</li>
            <li>
              ✅ Stay motivated with supplementary materials and inspirational
              quotes every Friday
            </li>
            <li>
              ✅ Seek extra support by asking questions in our KaiKul Slack
              channel
            </li>
            <li>
              ✅ Share your insights and experiences with the KaiKul community
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Features;
