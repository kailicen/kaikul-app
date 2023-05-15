import React from "react";
//import Waitlist from "@/components/Waitlist";
import Link from "next/link";

type Props = {};

function Hero({}: Props) {
  return (
    <div
      className="h-[80vh] flex flex-col space-y-8 items-center justify-center 
    text-center overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center w-full flex-1 px-3 md:px-32 lg:px-52 text-center">
        <h1 className="text-2xl lg:text-5xl lg:leading-[65px] font-bold">
          KaiKul: Achieve Your Goals with an Accountability Partner
        </h1>
        <h2 className="mt-6 text-md md:text-lg px-0 lg:px-32">
          Learning new things, running a marathon or building a business... your
          dreams are important. Don&apos;t tackle them alone. KaiKul connects
          you with an accountability partner based on your goals and
          preferences. Stay on track with weekly video calls using a recommended
          agenda. Achieve the seemingly impossible together.
        </h2>
        <button className="buttonMobile md:button mt-5 md:mt-10 text-2xl">
          <Link href="https://airtable.com/shrRTSGtb5taQ50yO/" target="_blank">
            Try KaiKul now
          </Link>
        </button>
        {/* <Waitlist /> */}
      </div>
    </div>
  );
}

export default Hero;
