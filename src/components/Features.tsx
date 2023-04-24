import React from "react";

type Props = {};

function Features({}: Props) {
  return (
    <div
      className="h-screen w-screen md:w-auto flex relative flex-col text-center md:text-left md:flex-row
    max-w-7xl px-10 mx-auto items-center justify-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-2xl">
        Groups
        <span className="lowercase text-xl tracking-[10px]">(beta)</span>
      </h3>
      <div
        className="absolute top-36 md:relative md:top-0 
        flex flex-col md:flex-row space-y-5 md:space-x-10 md:space-y-0
      items-center justify-center px-2 md:px-10"
      >
        <div className="bg-gray-100 rounded-lg p-5">
          <h4 className="text-xl mb-5">WhatsApp Group</h4>
          <p className="mb-5">
            Our WhatsApp group offers a more extensive community of{" "}
            <span className="underline decoration-cyan-500">
              less than 10 individuals
            </span>
            . You&apos;ll have access to:
          </p>
          <p>🎯 A goal-setting framework </p>
          <p>📣 Weekly gentle reminders</p>
          <p>🥹 Motivation materials</p>
          <p>🤓 A reflection framework</p>
          <p className="mt-5">
            Join for support and progress towards your goals!
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-5">
          <h4 className="text-xl mb-5">Zoom Catchup Group</h4>
          <p className="mb-5">
            Our Zoom group is a more intimate setting, consisting of{" "}
            <span className="underline decoration-cyan-500">2 individuals</span>{" "}
            paired with a facilitator. You&apos;ll have access to:
          </p>
          <p>🎯 A weekly goal-setting and tracking template</p>
          <p>💡 Theme and question of the week</p>
          <p>🤗 A weekly open sharing zoom call (40 minutes)</p>
          <p>🤓 An accountable buddy</p>
          <p className="mt-5">
            Join for an interactive way to progress towards your goals!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
