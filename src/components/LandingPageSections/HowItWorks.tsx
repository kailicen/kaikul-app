import React from "react";
import Image from "next/image";
import va from "@vercel/analytics";

type Props = {};

function HowItWorks({}: Props) {
  function handleVideoLoad() {
    va.track("VideoViewed");
  }
  return (
    <div
      className="min-h-[50vh] w-screen md:w-auto flex flex-col text-center py-20
    px-3 md:px-32 mx-auto items-center justify-center max-w-7xl"
    >
      <h3 className="mb-10 text-3xl font-bold text-violet-500">How it Works</h3>
      <div className="grid md:grid-cols-3 gap-5 px-2 md:px-5">
        <div
          className="works__perk p-2 text-sm md:text-base
        flex flex-col items-center space-y-4 "
        >
          <Image src="/img/goals.png" width={150} height={150} alt="goals" />
          <h4 className="text-violet-500 mt-2 text-xl font-bold">
            1. Set and Track Goals
          </h4>
          <p>
            Set weekly goals and break them down into our weekly to-do calendar.
          </p>
        </div>
        <div
          className="works__perk p-2 text-sm md:text-base
         flex flex-col items-center space-y-4"
        >
          <Image
            src="/img/catchup.png"
            width={150}
            height={150}
            alt="catchup"
          />
          <h4 className="text-violet-500 mt-2 text-xl font-bold">
            2. Join Weekly Meetings
          </h4>
          <p>
            Share progress, feedback with a supportive peer and chat about
            weekly personal development topics.
          </p>
        </div>
        <div
          className="works__perk p-2 text-sm md:text-base
         flex flex-col items-center space-y-4"
        >
          <Image
            src="/img/self-improvement.png"
            width={150}
            height={150}
            alt="self-improvement"
          />
          <h4 className="text-violet-500 mt-2 text-xl font-bold">
            3. Build Your Momentum
          </h4>
          <p>
            Analyze your weekly metrics to strategize and improve task
            completion and goal attainment for the next week.
          </p>
        </div>
      </div>
      {/* <iframe
        className="border"
        width="800"
        height="450"
        src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FI3u5Fl4KTXqMPDU35PnpOM%2FKaiKul%3Fnode-id%3D233-33%26starting-point-node-id%3D233%253A33%26scaling%3Dscale-down"
        allowFullScreen
      ></iframe> */}
      <iframe
        className="my-10 px-1 w-full h-[300px] md:w-[800px] md:h-[450px]"
        src="https://www.loom.com/embed/5d10f1c8e1fa48e3b6ebacf71e5b0390"
        allowFullScreen
        onLoad={handleVideoLoad}
      ></iframe>
    </div>
  );
}

export default HowItWorks;
