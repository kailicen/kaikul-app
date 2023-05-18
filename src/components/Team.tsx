import React from "react";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";

type Props = {};

function Team({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center
    max-w-7xl py-20 px-3 md:px-32 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">Our Team</h3>
      <div className="grid md:grid-cols-2 gap-5 px-2 md:px-10">
        <div
          className="bg-white rounded-lg shadow-md px-2 py-5 md:p-5 text-sm md:text-base
        cardHover flex flex-col items-center"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <Image
              src="/img/boom.jpg"
              alt="Boom's photo"
              width={128}
              height={128}
            />
          </div>
          <h3 className="text-xl font-bold mt-6">
            Setthawut Kulsrisuwan (Boom)
          </h3>
          <p className="text-center mt-2">
            Hi, I&apos;m Boom - your admin for self-discovery sessions and
            community interaction. My mission is to create objective-setting and
            self-awareness sessions, promote collaboration among diverse
            individuals, and foster strong connections within our community. Are
            you ready? Let&apos;s progress together towards a better future!
          </p>
          <div className="flex flex-row space-x-2 mt-2">
            <SocialIcon
              url="https://www.linkedin.com/in/setthawutkul/"
              target="_blank"
              bgColor="black"
              className="mt-2"
            />
            <SocialIcon
              url="https://setthawut-kul.medium.com/startup-journey-1st-month-fbf6af794a8c"
              target="_blank"
              bgColor="black"
              className="mt-2"
            />
            <SocialIcon
              url="https://setthawut.mystrikingly.com/"
              target="_blank"
              bgColor="black"
              className="mt-2"
            />
          </div>
        </div>
        <div
          className="bg-white rounded-lg shadow-md px-2 py-5 md:p-5 text-sm md:text-base
        cardHover flex flex-col items-center"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <Image
              src="/img/kaili.jpg"
              alt="Kaili's photo"
              width={128}
              height={128}
            />
          </div>
          <h3 className="text-xl font-bold mt-6">Kaili Cen</h3>
          <p className="text-center mt-2">
            Hey there, I&apos;m Kaili, based in Hobart, Australia. As a
            technical business analyst for the Tasmanian Department of
            Education, I spend my days juggling work with my passion project -
            KaiKul. My own journey has been tough and lonely, which is why I
            created KaiKul as a space where people can share their personal
            growth journeys without holding back. It&apos;s all about supporting
            each other as we grow spiritually, mentally, emotionally, and
            physically. Join us!
          </p>
          <div className="flex flex-row space-x-2 mt-2">
            <SocialIcon
              url="https://www.linkedin.com/in/kaili-cen-1975b4197/"
              target="_blank"
              bgColor="black"
              className="mt-2"
            />
            <SocialIcon
              url="https://medium.com/@kailicen226"
              target="_blank"
              bgColor="black"
              className="mt-2"
            />
            <SocialIcon
              url="https://www.kailicen.com/"
              target="_blank"
              bgColor="black"
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team;
