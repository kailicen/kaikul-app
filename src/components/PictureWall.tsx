import Image from "next/image";
import React from "react";

type Props = {};

function PictureWall({}: Props) {
  return (
    <div>
      <h3 className="my-5 text-xl font-bold text-center">
        Some Other KaiKul Buddies 👇
      </h3>
      <div className="flex flex-col items-center md:flex-row md:items-center md:justify-evenly">
        <Image
          src="/img/pics/alex&boom.png"
          width={500}
          height={500}
          alt="alex & boom"
        />
        <Image
          src="/img/pics/will&mohamad.png"
          width={500}
          height={500}
          alt="will & mohamad"
        />
        <Image
          src="/img/pics/charlotte&ocean.png"
          width={500}
          height={500}
          alt="charlotte & ocean"
        />
      </div>
    </div>
  );
}

export default PictureWall;
