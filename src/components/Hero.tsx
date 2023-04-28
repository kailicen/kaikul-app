import React from "react";
import Waitlist from "@/components/Waitlist";

type Props = {};

function Hero({}: Props) {
  return (
    <div
      className="h-[80vh] flex flex-col space-y-8 items-center justify-center 
    text-center overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center w-full flex-1 px-3 md:px-32 lg:px-52 text-center">
        <h1 className="text-2xl md:text-5xl md:leading-[65px] font-bold">
          Unleash your potential and find your purpose with our{" "}
          <span className="underline decoration-teal-500">
            supportive community
          </span>
        </h1>
        <h2 className="mt-6 text-md md:text-lg px-0 md:px-32">
          Join our community of like-minded individuals dedicated to unlocking
          their greatest potential and finding their true life purpose.
          Together, we support each other through life&apos;s ups and downs and
          work tirelessly to achieve our dreams. Start living the life you were
          meant to live today. Join us now.
        </h2>
        <Waitlist />
      </div>
    </div>
  );
}

export default Hero;
