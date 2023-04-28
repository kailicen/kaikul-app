import Link from "next/link";
import React from "react";

type Props = {};

function Features({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center
    max-w-7xl px-3 md:px-10 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">Beta</h3>
      {/* <p className="mb-10">
        Welcome to our{" "}
        <span className="underline decoration-teal-600">
          one-month challenge
        </span>
        ! During this month, you will set your goals and track them weekly with
        your buddies. There are two pathways:
      </p> */}
      <div
        className="
        grid md:grid-cols-2 gap-5 px-2 md:px-10"
      >
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-start text-sm md:text-base
        hover:bg-gray-50 hover:shadow-lg"
        >
          <h4 className="text-base md:text-xl mb-1 md:mb-5 font-bold">
            WhatsApp Group
          </h4>

          <ul className="list-decimal ml-5">
            <li>
              Connect with a supportive community of less than 10 individuals.
            </li>
            <li>
              Utilize a goal-setting framework for personal and professional
              development.
            </li>
            <li>
              Receive weekly and kindly reminders to stay focused on your goals.
            </li>
            <li>
              Access motivational materials, including kind-word artwork,
              Netflix, and Youtube.
            </li>
            <li>
              Use a reflection framework to evaluate progress and make
              adjustments as needed.
            </li>
          </ul>

          <button className="buttonMobile md:button mt-2 md:mt-10 bg-gray-800 md:bg-gray-800">
            <Link href="#" target="_blank">
              Join Now
            </Link>
          </button>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-start text-sm md:text-base
        hover:bg-gray-50 hover:shadow-lg "
        >
          <h4 className="text-base md:text-xl mb-1 md:mb-5 font-bold">
            Zoom Catchup Group
          </h4>
          <p className="mb-2 md:mb-5">
            Our Zoom group is a more intimate setting, consisting of{" "}
            <span className="underline decoration-teal-600">2 individuals</span>{" "}
            paired with a facilitator. You&apos;ll:
          </p>
          <p>🤝 Partner with a self-improvement buddy</p>
          <p>
            🤗 Enjoy a weekly 40-minute call in a safe and supportive
            environment
          </p>
          <p>📈 Get a weekly goal-setting and tracking template</p>
          <p>
            💡 Share your discoveries and insights on the theme and question of
            the week
          </p>
          <button className="buttonMobile md:button mt-2 md:mt-10 bg-gray-800 md:bg-gray-800">
            <Link href="#" target="_blank">
              Join Now
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Features;
