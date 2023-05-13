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
          KaiKul: Achieve Your Goals with an Accountability Partner
        </h1>
        <h2 className="mt-6 text-md md:text-lg px-0 md:px-32">
          KaiKul is a goal tracking platform that connects you with an
          accountability partner based on your goals and preferences. You
          receive weekly updates, personal development material, and
          notifications to help you stay on track. You collaborate with your
          partner to achieve your goals and catch up weekly via a virtual or
          in-person call. KaiKul provides personalized support and motivation to
          help you reach your full potential.
        </h2>
        {/* <Waitlist /> */}
      </div>
    </div>
  );
}

export default Hero;
