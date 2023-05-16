import React from "react";
//import Waitlist from "@/components/Waitlist";
import Link from "next/link";
import { BsTriangleFill } from "react-icons/bs";

type Props = {};

function Hero({}: Props) {
  return (
    <div
      className="h-[90vh] flex flex-col space-y-8 items-center justify-center 
    text-center overflow-hidden py-5"
    >
      <div className="relative flex flex-col items-center justify-center w-full flex-1 px-3 md:px-32 lg:px-52 text-center">
        <button
          className="absolute top-0  border border-[#F05D53] 
        rounded-full bg-white pl-4 pr-6 py-2"
        >
          <Link
            href="https://www.producthunt.com/posts/kaikul"
            target="_blank"
            className="flex items-center justify-center space-x-2"
          >
            <div className="bg-[#F05D53] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-3xl">
              P
            </div>
            <div className="text-left">
              <p className="text-[10px] font-medium text-[#F05D53]">
                FEATURE ON
              </p>
              <p className="text-xl font-bold text-[#F05D53]">Product Hunt</p>
            </div>
            <div className="flex flex-col items-center justify-end pl-3 h-full text-[#F05D53]">
              <BsTriangleFill className="text-xs" />
              <p className="text-base font-medium">12</p>
            </div>
          </Link>
        </button>

        <h1 className="text-2xl lg:text-5xl lg:leading-[65px] font-bold">
          KaiKul: Peer matching for personal development
        </h1>
        <h2 className="mt-6 text-md md:text-lg px-0 lg:px-32">
          KaiKul connects you with an accountability partner based on your goals
          and preferences. Experience the power of weekly virtual or in-person
          calls, following our goal-setting and group-reflection KaiKul
          frameworks.
        </h2>
        <button className="buttonMobile md:button mt-5 md:mt-10 text-2xl">
          <Link href="https://airtable.com/shrRTSGtb5taQ50yO/" target="_blank">
            Try KaiKul Now
          </Link>
        </button>
        {/* <Waitlist /> */}
      </div>
    </div>
  );
}

export default Hero;
