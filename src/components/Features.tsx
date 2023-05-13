import React from "react";
import Image from "next/image";

type Props = {};

function Features({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center
    px-3 md:px-5 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 uppercase tracking-[20px] text-2xl">How it Works</h3>
      {/* <div className="mb-3 w-[800px]">
        Welcome to KaiKul! Our mission is to help you reach your goals (career,
        health, happiness, money, relationship) through personalized
        peer-to-peer matching. Here&apos;s how it works:
      </div> */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 px-2 md:px-5">
        <div
          className="bg-white rounded-lg shadow-md p-2 text-sm md:text-base
        flex flex-col items-center space-y-4 cardHover"
        >
          <h4 className="text-center mt-2 text-lg font-bold">
            Step 1: Create your profile
          </h4>
          <p>
            Create a detailed profile outlining your personal objectives and
            preferences.
          </p>
          <Image
            src="/img/profile.png"
            width={250}
            height={250}
            alt="profile"
          />
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 text-sm md:text-base
        cardHover flex flex-col items-center space-y-4"
        >
          <h4 className="text-center mt-2 text-lg font-bold">
            Step 2: Peer Matching
          </h4>
          <p>
            Our AI algorithm will match you with like-minded individuals who
            share similar goals and interests. You can start connecting with
            your matched peers through our messaging system.
          </p>

          <Image src="/img/match.png" width={200} height={200} alt="match" />
          <Image src="/img/match2.png" width={200} height={200} alt="match" />
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 text-sm md:text-base
        cardHover flex flex-col items-center space-y-4"
        >
          <h4 className="text-center mt-2 text-lg font-bold">
            Step 3: Accountability Partnership
          </h4>
          <p>
            Choose to match with one other user, and schedule weekly meetings to
            share and update each other on your progress using our weekly
            updates template.
          </p>
          <Image
            src="/img/partnership.png"
            width={200}
            height={200}
            alt="partnership"
          />
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 text-sm md:text-base
        cardHover flex flex-col items-center space-y-4"
        >
          <h4 className="text-center mt-2 text-lg font-bold">
            Step 4: Inspirations, notifications, and progress reports
          </h4>
          <p>
            Receive weekly inspiration, notifications, and progress reports to
            stay on track.
          </p>
          <Image
            src="/img/inspirations.png"
            width={200}
            height={200}
            alt="inspirations"
          />
          <Image
            src="/img/inspirations2.png"
            width={200}
            height={200}
            alt="inspirations"
          />
        </div>
      </div>
    </div>
  );
}

export default Features;
