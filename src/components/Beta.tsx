import Link from "next/link";
import React from "react";
import { FaHandshake, FaCalendarWeek } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { GiProgression } from "react-icons/gi";

type Props = {};

function Features({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center
    px-3 md:px-10 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">
        Beta <span className="text-lg">v1.1</span>
      </h3>
      <div className="mb-10 max-w-[900px]">
        Welcome to our Beta v1.1! Our app is not yet available, but we&apos;re
        thrilled to invite you to participate in our beta program. Your feedback
        is invaluable in helping us improve our product for you! The beta will
        last for one month, and we welcome any feedback you have during this
        time.
      </div>
      <div
        className="
        grid md:grid-cols-2 lg:grid-cols-4 gap-5 px-2 md:px-10"
      >
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 flex flex-col items-center text-sm md:text-base
        cardHover"
        >
          <FaHandshake className="text-4xl text-violet-500" />
          <h4 className="text-base my-1 md:my-5 font-semibold">
            Personalized matching
          </h4>
          <p className="mb-2 md:mb-5">
            Fill out your profile and partner preferences via Airtable, chat
            with the buddy that we chose for you and decide whether to match via
            WhatsApp
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 flex flex-col items-center text-sm md:text-base
        cardHover "
        >
          <FaCalendarWeek className="text-4xl text-violet-500" />
          <h4 className="text-base my-1 md:my-5 font-semibold">
            Weekly templates and catch up
          </h4>
          <p className="mb-2 md:mb-5">
            We&apos;ll provide you with weekly goal tracking templates and
            recommended agendas for your catch-up sessions with your partner,
            helping you stay on track and accountable.
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 flex flex-col items-center text-sm md:text-base
        cardHover "
        >
          <HiUserGroup className="text-4xl text-violet-500" />
          <h4 className="text-base my-1 md:my-5 font-semibold">
            Supportive community
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
          <h4 className="text-base my-1 md:my-5 font-semibold">
            Progress tracking
          </h4>
          <p className="mb-2 md:mb-5">
            At the end of the week, you&apos;ll fill out your weekly updates and
            receive a progress report along with all your previous weeks&apos;
            progress, helping you track your progress and stay motivated.
          </p>
        </div>
      </div>

      <button className="buttonMobile md:button mt-5 md:mt-10 bg-gray-800 md:bg-gray-800">
        <Link href="https://airtable.com/shrRsvclV6Q7vIppw/" target="_blank">
          Join Beta Now
        </Link>
      </button>
    </div>
  );
}

export default Features;
