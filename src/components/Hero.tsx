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
        <h1 className="text-3xl md:text-6xl md:leading-[65px] font-bold">
          <span className="underline decoration-teal-500">Connect</span> with
          like-minded self-help enthusiasts and unlock your{" "}
          <span className="underline decoration-teal-500">full potential</span>
          with our supportive community.
        </h1>
        <h2 className="mt-6 text-md md:text-xl px-0 md:px-32">
          Do you believe in unlocking your greatest potential and finding your
          true life purpose? Do you struggle to find like-minded individuals to
          connect with on a personal level? Look no further! We have a community
          of individuals who are dedicated to tapping into their full potential
          and discovering their true life purpose. Together, we support each
          other through the ups and downs of life and work tirelessly to achieve
          our dreams. Don&apos;t wait another day to start living the life you
          were meant to live. Join us now and take the first step towards a
          brighter, more fulfilling future.
        </h2>
        <Waitlist />
      </div>
    </div>
  );
}

export default Hero;
