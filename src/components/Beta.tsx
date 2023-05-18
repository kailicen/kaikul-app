import Link from "next/link";
import React from "react";
import { FaHandshake, FaCalendarWeek } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { GiProgression } from "react-icons/gi";

type Props = {};

function Features({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center py-20
    px-3 md:px-32 mx-auto items-center justify-center max-w-7xl"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">
        Beta <span className="text-lg">v1.1</span>
      </h3>
      <div className="mb-10 max-w-[900px]">
        Join our Beta v1.1 and help shape our app! Your feedback is invaluable
        in improving our product for you. The beta runs for a month, so share
        your thoughts with us!
      </div>
      <div
        className="
        grid md:grid-cols-2 gap-5 px-2 md:px-10"
      >
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 flex flex-col items-center text-sm md:text-base
        cardHover"
        >
          <FaHandshake className="text-4xl text-violet-500" />
          <h4 className="text-lg my-1 md:my-5 font-bold">
            Personalized Matching
          </h4>
          <p className="mb-2 md:mb-5">
            Create your profile and partner preferences, and chat with your
            chosen buddy.
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 flex flex-col items-center text-sm md:text-base
        cardHover "
        >
          <FaCalendarWeek className="text-4xl text-violet-500" />
          <h4 className="text-lg my-1 md:my-5 font-bold">
            Weekly Templates and Catch Up
          </h4>
          <p className="mb-2 md:mb-5">
            Stay accountable with your partner in weekly video catch-up
            sessions, using goal tracking templates and recommended agendas.
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 flex flex-col items-center text-sm md:text-base
        cardHover "
        >
          <HiUserGroup className="text-4xl text-violet-500" />
          <h4 className="text-lg my-1 md:my-5 font-bold">
            Supportive Community
          </h4>
          <p className="mb-2 md:mb-5">
            Join our WhatsApp community for support and inspiration throughout
            the week, as you work towards achieving your goals.
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 flex flex-col items-center text-sm md:text-base
        cardHover "
        >
          <GiProgression className="text-4xl text-violet-500" />
          <h4 className="text-lg my-1 md:my-5 font-bold">Progress Tracking</h4>
          <p className="mb-2 md:mb-5">
            Fill out your weekly updates at the end of each week and receive a
            progress report that includes all your previous weeks&apos;
            progress.
          </p>
        </div>
      </div>

      <button className="buttonMobile md:button my-5 md:my-10 text-xl">
        <Link href="https://airtable.com/shrRTSGtb5taQ50yO/" target="_blank">
          Join Beta Now
        </Link>
      </button>
    </div>
  );
}

export default Features;
