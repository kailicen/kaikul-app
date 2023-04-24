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
          A community where professionals{" "}
          <span className="underline decoration-cyan-500">come together</span>{" "}
          to share their self development progress.
        </h1>
        <h2 className="mt-6 text-md md:text-xl px-0 md:px-32">
          Embarking on a solo personal development journey can be hard. We help
          you stay on track in your hero&apos;s journey with a supportive
          community, personalized resources, and a weekly goal tracking program.
        </h2>
        <Waitlist />
      </div>
    </div>
  );
}

export default Hero;
