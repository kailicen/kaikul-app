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
        <a
          className="absolute top-0"
          href="https://www.producthunt.com/posts/kaikul?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-kaikul"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=394368&theme=light"
            alt="KaiKul - Peer&#0032;matching&#0032;for&#0032;personal&#0032;development | Product Hunt"
            className="w-[250px] h-[54px]"
            width="250"
            height="54"
          />
        </a>

        <h1 className="text-2xl lg:text-4xl 2xl:text-5xl lg:leading-[65px] font-bold">
          KaiKul: Peer Matching for Personal Development
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
