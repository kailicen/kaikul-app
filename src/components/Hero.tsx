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
          KaiKul: Share self-development progress with new friends.
        </h1>
        <h2 className="mt-6 text-md md:text-lg px-0 md:px-32">
          KaiKul randomly pairs two individuals each week to share and track
          their personal goals, emphasizing meaningful connections and
          diversity.
        </h2>
        {/* <Waitlist /> */}
      </div>
    </div>
  );
}

export default Hero;
