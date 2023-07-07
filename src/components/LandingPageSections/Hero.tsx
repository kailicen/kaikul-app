import React from "react";
//import Waitlist from "@/components/Waitlist";
import Image from "next/image";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

type Props = {};

function Hero({}: Props) {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <div
      className="min-h-screen w-full mx-auto flex flex-col space-y-8 items-center justify-center
    bg-cover bg-center bg-fixed lg:bg-[url('/img/bg3.jpg')] bg-violet-300 pt-[100px] pb-[30px]"
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
        className="flex flex-col items-center justify-center lg:flex-row lg:gap-20
      w-full md:px-10 lg:px-20 xl:px-30 3xl:px-40"
      >
        <div
          className="flex flex-col items-center lg:items-start justify-center 
       flex-1 p-2 lg:p-4 xl:p-6 text-center lg:text-start lg:bg-white/80 lg:rounded-lg max-w-[600px] 3xl:max-w-[800px]"
        >
          <h1
            className="text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-bold lg:max-w-7xl 3xl:leading-normal
        max-w-[800px] text-violet-800"
          >
            Make Weekly Improvements <br />
            With Your Peer
          </h1>
          <h2 className="mt-6 2xl:mt-12 text-md md:text-lg lg:text-xl 3xl:text-2xl px-0 md:text-start max-w-[800px] text-black">
            🚀 Rapidly attain your goals within weeks
            <br />
            ✨ Get started with 3 simple steps
            <br />
            🥳 Absolutely free of charge
          </h2>

          <div className="hero__btns">
            <button
              onClick={() => setAuthModalState({ open: true, view: "login" })}
              className="btn hero__btn buttonMobile md:button mt-10 text-xl md:text-2xl 2xl:mt-5"
            >
              Set My Goals
            </button>
          </div>

          {/* <Waitlist /> */}
        </div>
        <Image
          src="/img/hero-markup2.png"
          width={600}
          height={600}
          alt="charlotte and ocean"
        />
        {/* <div className="block md:hidden absolute bottom-10 text-lg">
          👇 Scroll Down 👇
        </div> */}
      </div>
    </div>
  );
}

export default Hero;
