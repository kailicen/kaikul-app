import Image from "next/image";
import React from "react";

type Props = {};

function PictureWall({}: Props) {
  return (
    <div>
      <h3 className="my-5 text-xl font-bold text-center">
        Some Other KaiKul Buddies 👇
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 items-center md:flex-row md:items-center md:justify-evenly">
        <Image
          src="/img/buddies/boom.png"
          width={200}
          height={200}
          alt="boom"
        />
        <Image
          src="/img/buddies/charles.png"
          width={200}
          height={200}
          alt="charles"
        />
        <Image
          src="/img/buddies/jaume.png"
          width={200}
          height={200}
          alt="jaume"
        />
        <Image
          src="/img/buddies/mohamad.png"
          width={200}
          height={200}
          alt="mohamad"
        />
        <Image
          src="/img/buddies/sarisa.png"
          width={200}
          height={200}
          alt="sarisa"
        />
        <Image
          src="/img/buddies/susanne.png"
          width={200}
          height={200}
          alt="susanne"
        />
        <Image
          src="/img/buddies/will.png"
          width={200}
          height={200}
          alt="will"
        />
      </div>
    </div>
  );
}

export default PictureWall;
