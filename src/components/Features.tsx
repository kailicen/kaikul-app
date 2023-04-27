import Link from "next/link";
import React from "react";
import { HiUserGroup } from "react-icons/hi";
import { MdSelfImprovement } from "react-icons/md";
import { GiTreeGrowth } from "react-icons/gi";

type Props = {};

function Features({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center
    max-w-7xl px-3 md:px-10 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">Features</h3>
      <div
        className="flex flex-col md:flex-row space-y-5 md:space-x-10 md:space-y-0
      items-center justify-center px-2 md:px-10"
      >
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        hover:bg-gray-50 hover:shadow-lg flex flex-col items-center flex-1 space-y-5"
        >
          <HiUserGroup className="text-6xl" />
          <h4 className="text-center mt-2 text-lg font-bold">
            Meaningful Connections
          </h4>
          <p>
            Our platform provides a space for you to meet like-minded
            individuals in an inclusive environment, allowing you to form
            meaningful friendships that can last a lifetime.
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        hover:bg-gray-50 hover:shadow-lg flex flex-col items-center flex-1 space-y-5"
        >
          <MdSelfImprovement className="text-6xl" />
          <h4 className="text-center mt-2 text-lg font-bold">
            Self-Discovery Journey
          </h4>
          <p>
            With our tools and resources, you can embark on a journey of
            self-discovery, exploring your passions, interests, and personal
            goals to help you become the best version of yourself.
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        hover:bg-gray-50 hover:shadow-lg flex flex-col items-center flex-1 space-y-5"
        >
          <GiTreeGrowth className="text-6xl" />
          <h4 className="text-center mt-2 text-lg font-bold">
            Progress Tracking
          </h4>
          <p>
            Our platform helps you keep track of your progress as you work
            towards your personal development goals by providing the tools and
            support you need to grow and thrive.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
