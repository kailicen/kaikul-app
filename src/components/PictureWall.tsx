import Image from "next/image";
import React from "react";

type Props = {};

function PictureWall({}: Props) {
  return (
    <div>
      <h3 className="my-5 text-xl font-bold text-center">
        Some other KaiKul buddies 👇
      </h3>
      <div className="flex flex-col md:flex-row">
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
