import React from "react";
import { BsFillChatSquareQuoteFill } from "react-icons/bs";

type Props = {};

function Testimonial({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center py-5
    max-w-7xl px-3 md:px-10 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">Testimonial</h3>
      <div className="grid md:grid-cols-2 gap-5 px-2 md:px-10 h-[80vh] overflow-auto">
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
            It is a really useful platform. Short weekly meetings help me to
            rethink what I did in this week, set goals next week and gain
            knowledge about how to cultivate my mindset and advance my career.
            You will feel you are not alone, you are in a group.
          </p>
          <h3 className="font-bold mt-6">-- Haiyang (Ocean) Zou</h3>
        </div>
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
            One of the most important things to think about when taking control
            of your own personal development, health or whatever it may be, is
            your environment. Having a group of like-minded individuals around
            you, people who are driven to succeed and reach their goals, will
            inherently make you want to also reach your own goals alongside
            them. A lot of people tend to under-value the impact a good group or
            partner can have. <br></br>So I strongly recommend trying anything
            like this, which can pair you with individuals/groups of people who
            are also on the same path in life.
          </p>
          <h3 className="font-bold mt-6">-- Ezra Valentine</h3>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 md:p-5 text-sm md:text-base
        cardHover flex flex-col items-center"
        >
          <BsFillChatSquareQuoteFill className="text-violet-500" />
          <p className="mt-2">
            Sometimes we need to be held accountable to ourselves for any type
            of goals we aim to meet. This is a great platform that creates
            reflection on what you have accomplished and what you aim to do
            next. You get support, social interaction, accountability and great
            tips on how you can hit and exceed your goals.
          </p>
          <h3 className="font-bold mt-6">-- Alexander Dolling</h3>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
