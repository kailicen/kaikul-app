import Link from "next/link";
import React from "react";

type Props = {};

function Features({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center
    max-w-7xl px-3 md:px-10 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">
        Groups
        <span className="lowercase text-xl tracking-[10px]">(beta)</span>
      </h3>
      <p className="mb-10">
        Welcome to our{" "}
        <span className="underline decoration-cyan-500">
          one-month challenge
        </span>
        ! During this month, you will set your goals and track them weekly.
        There are two pathways:
      </p>
      <div
        className="
        flex flex-col md:flex-row space-y-5 md:space-x-10 md:space-y-0
      items-center justify-center px-2 md:px-10"
      >
        <div className="bg-gray-100 rounded-lg p-2 md:p-5 text-start text-sm md:text-base">
          <h4 className="text-base md:text-xl mb-1 md:mb-5 font-bold">
            WhatsApp Group
          </h4>
          <p className="mb-2 md:mb-5">
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
          <button className="button mt-2 md:mt-10 py-1 md:py-3 px-3 md:px-4 bg-gray-800 hover:bg-cyan-500">
            <Link
              href="https://www.linkedin.com/in/setthawutkul/"
              target="_blank"
            >
              Contact Boom
            </Link>
          </button>
        </div>
        <div className="bg-gray-100 rounded-lg p-2 md:p-5 text-start text-sm md:text-base">
          <h4 className="text-base md:text-xl mb-1 md:mb-5 font-bold">
            Zoom Catchup Group
          </h4>
          <p className="mb-2 md:mb-5">
            Our Zoom group is a more intimate setting, consisting of{" "}
            <span className="underline decoration-cyan-500">2 individuals</span>{" "}
            paired with a facilitator. You&apos;ll have access to:
          </p>
          <p>🎯 A weekly goal-setting and tracking template</p>
          <p>💡 Theme & question of the week</p>
          <p>🤗 A weekly zoom call (40 minutes)</p>
          <p>🤓 An accountable buddy</p>
          <button className="button mt-2 md:mt-10 py-1 md:py-3 px-3 md:px-4 bg-gray-800 hover:bg-cyan-500">
            <Link
              href="https://www.linkedin.com/in/kaili-cen-1975b4197/"
              target="_blank"
            >
              Contact Kaili
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Features;
