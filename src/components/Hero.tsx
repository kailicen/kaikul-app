import React from "react";
//import Waitlist from "@/components/Waitlist";
import Link from "next/link";
import va from "@vercel/analytics";
import Image from "next/image";

type Props = {};

function Hero({}: Props) {
  return (
    <div
      className="min-h-screen w-full mx-auto flex flex-col space-y-8 items-center justify-center
    bg-cover bg-center bg-fixed lg:bg-[url('/img/bg3.jpg')] bg-violet-200 pt-[100px] pb-[30px]"
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
      w-full md:px-10 lg:px-20 xl:px-30 2xl:px-40"
      >
        <div
          className="flex flex-col items-center lg:items-start justify-center 
       flex-1 p-2 lg:p-4 xl:p-6 text-center lg:text-start lg:bg-white/80 lg:rounded-lg max-w-[600px] 2xl:max-w-[800px]"
        >
          <h1
            className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold lg:max-w-7xl 2xl:leading-normal
        max-w-[800px] text-violet-800"
          >
            Make Weekly Improvements <br />
            With Your Peer
          </h1>
          <h2 className="mt-6 2xl:mt-12 text-md md:text-lg lg:text-xl 2xl:text-2xl px-0 md:text-start max-w-[800px]">
            🚀 Rapidly attain your goals within weeks
            <br />
            ✨ Get started with 3 simple steps
            <br />
            🥳 Absolutely free of charge
          </h2>
          <p className="mt-5">
            We are currently in the process of building our Minimum Viable
            Product (MVP). We kindly request you to stay tuned and join us on
            our Slack channel for the latest updates. 👇
          </p>
          <div className="hero__btns">
            <button className="btn hero__btn buttonMobile md:button mt-2 md:mt-3 text-xl md:text-2xl 2xl:mt-5">
              <Link
                href="https://join.slack.com/t/kaikul/shared_invite/zt-1wxjzi7xh-7VT6sO8glNU44KSa5i2WyQ"
                target="_blank"
                onClick={() => va.track("withBoom")}
              >
                Join Our Slack Community
              </Link>
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
