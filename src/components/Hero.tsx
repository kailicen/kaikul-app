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
          Kaikul - A supportive self-help community where{" "}
          <span className="underline decoration-violet-500">
            sharing and growth
          </span>{" "}
          go hand in hand.
        </h1>
        <h2 className="mt-6 text-md md:text-lg px-0 md:px-32">
          At Kaikul, we believe that personal growth thrives through connecting
          with others, embracing diversity, and broadening perspectives. Join
          our self-help community to start your journey towards growth and
          inclusiveness today.
        </h2>
        {/* <Waitlist /> */}
      </div>
    </div>
  );
}

export default Hero;
