import Image from "next/image";
import * as React from "react";

const story = {
  name: "Alexander Dolling",
  testimonial:
    "Sometimes we need to be held accountable to ourselves for any type of goals we aim to meet. This is a great platform that creates reflection on what you have accomplished and what you aim to do next. You get support, social interaction, accountability and great tips on how you can hit and exceed your goals.",
  keyword: "Accountability, Reflection, Support, Success",
  role: "Writer, Instructor and Part-Time Public Speaker",
};

export interface IStoryProps {}

export function Story(props: IStoryProps) {
  return (
    <div
      className="min-h-[50vh] max-w-7xl md:w-auto flex flex-col 
  pt-20 pb-5 px-3 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 text-3xl font-bold text-violet-800">Testimonial</h3>
      <div className="grid md:grid-cols-2 gap-5 px-2">
        <div className="flex flex-col order-2 md:order-1">
          <div className="text-lg lg:text-2xl mb-2 lg:mb-8 text-violet-800 font-semibold">
            &ldquo;{story.keyword}&rdquo;
          </div>
          <div className="font-serif lg:text-xl mb-2 lg:mb-5">
            &ldquo;{story.testimonial}&rdquo;
          </div>
          <div className="text-sm lg:text-base font-bold">{story.name}</div>
          <div className="text-sm lg:text-base">{story.role}</div>
        </div>

        <div className="order-1 md:order-2">
          <Image
            src="/img/alex.jpg"
            width={800}
            height={800}
            alt="alex dolling"
          />
        </div>
      </div>
    </div>
  );
}
