import React from "react";
import { BsFillChatSquareQuoteFill } from "react-icons/bs";

type Props = {};

function Testimonial({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center
    max-w-7xl px-3 md:px-10 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">Testimonial</h3>
      <div className="grid md:grid-cols-2 gap-5 px-2 md:px-10">
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        cardHover flex flex-col items-center"
        >
          <BsFillChatSquareQuoteFill className="text-violet-500" />
          <p className="mt-2">
            Being part of a community of people who share a common purpose and
            support each other in achieving our dreams is incredibly meaningful,
            as we don&apos;t feel alone in our pursuits and are inspired by the
            collective energy of the group, even if our dreams may be different.
          </p>
          <h3 className="font-bold mt-6">-- Cerena Ip</h3>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        cardHover flex flex-col items-center"
        >
          <BsFillChatSquareQuoteFill className="text-violet-500" />
          <p className="mt-2">
            Life can pass us by and work becomes our priory, so often that we
            forget what’s important. A platform like this allows for deeper
            connectivity within one self and with like minded people.
          </p>
          <h3 className="font-bold mt-6">-- Natasha Sachatheva</h3>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        cardHover flex flex-col items-center"
        >
          <BsFillChatSquareQuoteFill className="text-violet-500" />
          <p className="mt-2">
            It&apos;s a great platform and community where I can set my goal and
            reflect for what I like to achieve.
          </p>
          <h3 className="font-bold mt-6">-- Nadia Firsova</h3>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
