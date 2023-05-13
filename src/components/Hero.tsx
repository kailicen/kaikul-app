import React from "react";
import Waitlist from "@/components/Waitlist";
import { ArrowDownIcon } from "@heroicons/react/24/solid";

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
          Learning new things, running a marathon or building a business... your
          dreams are important and need to be nurtured. Don&apos;t tackle your
          dreams alone. KaiKul connects you with an accountability partner based
          on your goals and preferences. Stay on track with weekly virtual or
          in-person calls using a recommended agenda. Achieve the seemingly
          impossible together. Try KaiKul now.
        </h2>
        {/* <Waitlist /> */}
      </div>
    </div>
  );
}

export default Hero;
