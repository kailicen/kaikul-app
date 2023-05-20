import React from "react";
//import Waitlist from "@/components/Waitlist";
import Link from "next/link";
import Image from "next/image";

type Props = {};

function Hero({}: Props) {
  return (
    <div
      className="w-full mx-auto flex flex-col space-y-8 items-center justify-center 
    overflow-hidden py-5 
    absolute inset-0 bg-no-repeat bg-cover bg-center bg-fixed bg-[url('img'mbg.jpg')] md:bg-[url('/img/bg3.jpg')]"
    >
      <a
        className="absolute top-20"
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
      <div
        className="flex flex-col items-center md:items-end justify-center 
      w-full md:px-10 lg:px-20 xl:px-30 2xl:px-40 flex-1 px-3 text-center md:text-end"
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl lg:leading-[65px] font-bold">
          KaiKul: Self-Improvement. Weekly Changes. Companionship.
        </h1>
        <h2 className="mt-6 text-md md:text-lg lg:text-xl 2xl:text-2xl px-0 md:text-end max-w-[800px]">
          Set your SMART goals, track your progress, reflect on it, and have
          weekly video calls with a buddy to gain diverse perspectives. With
          KaiKul, your weekly improvements become more measurable, accountable,
          and reflective.
        </h2>
        <button className="buttonMobile md:button mt-5 md:mt-10 text-xl md:text-2xl">
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
