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
      <div className="grid md:grid-cols-2 gap-5 px-2 md:px-10">
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        hover:bg-gray-50 hover:shadow-lg flex flex-col items-center"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <Image
              src="/boom.jpg"
              alt="Boom's photo"
              width={128}
              height={128}
            />
          </div>
          <h3 className="text-xl font-bold mt-6">
            Setthawut Kulsrisuwan (Boom)
          </h3>
          <p className="text-center mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            eget nisi vitae justo lacinia feugiat.{" "}
          </p>
          <div className="flex flex-row space-x-2">
            <SocialIcon
              url="https://www.linkedin.com/in/setthawutkul/"
              target="_blank"
              bgColor="black"
              className="mt-2"
            />
          </div>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        hover:bg-gray-50 hover:shadow-lg flex flex-col items-center"
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
            I firmly believe that adversity can make us stronger, and with the
            right coping skills, we can use our struggles to propel ourselves
            forward towards personal growth and fulfillment. I&apos;ve struggled
            to find like-minded individuals to share my personal journey with.
            That&apos;s why I&apos; m creating a platform where people can
            openly share their experiences and personal growth journeys without
            any constraints.
          </p>
          <p className="text-center mt-2">
            As a web developer who enjoys writing blogs and creating meaningful
            content, I am committed to fostering a supportive community where we
            can all grow spiritually, mentally, emotionally, and physically.
            Join me on this journey of self-discovery and personal development!
          </p>
          <div className="flex flex-row space-x-2">
            <SocialIcon
              url="https://www.linkedin.com/in/kaili-cen-1975b4197/"
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
