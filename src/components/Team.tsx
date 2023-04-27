import React from "react";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";

type Props = {};

function Team({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center
    max-w-7xl px-3 md:px-10 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">Our Team</h3>
      <div
        className="flex flex-col md:flex-row space-y-5 md:space-x-10 md:space-y-0
      items-center justify-center px-2 md:px-10"
      >
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        hover:bg-gray-50 hover:shadow-lg flex flex-col items-center flex-1"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <Image
              src="/boom.jpg"
              alt="Boom's photo"
              width={128}
              height={128}
            />
          </div>
          <h3 className="text-xl font-bold mt-6">Boom</h3>
          <p className="text-center mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            eget nisi vitae justo lacinia feugiat.{" "}
          </p>
          <SocialIcon
            url="https://www.linkedin.com/in/setthawutkul/"
            target="_blank"
            bgColor="black"
            className="mt-2"
          />
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        hover:bg-gray-50 hover:shadow-lg flex flex-col items-center flex-1"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <Image
              src="/img/kaili.jpg"
              alt="Kaili's photo"
              width={128}
              height={128}
            />
          </div>
          <h3 className="text-xl font-bold mt-6">Kaili</h3>
          <p className="text-center mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            eget nisi vitae justo lacinia feugiat.{" "}
          </p>
          <SocialIcon
            url="https://www.linkedin.com/in/kaili-cen-1975b4197/"
            target="_blank"
            bgColor="black"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}

export default Team;
