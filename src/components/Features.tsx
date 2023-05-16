import React from "react";
import Image from "next/image";

type Props = {};

function Features({}: Props) {
  return (
    <div
      className="min-h-screen w-screen md:w-auto flex flex-col text-center py-5
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
            Step 1: Create Your Profile
          </h4>
          <p>
            Create a detailed profile outlining your personal objectives and
            partner preferences.
          </p>
          <Image src="/img/user.png" width={200} height={200} alt="profile" />
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 text-sm md:text-base
        cardHover flex flex-col items-center space-y-4"
        >
          <h4 className="text-center mt-2 text-lg font-bold">
            Step 2: Peer Matching
          </h4>
          <p>
            Connect with like-minded individuals and choose your accountability
            buddy.
          </p>

          <Image src="/img/partner.png" width={200} height={200} alt="match" />
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-2 text-sm md:text-base
        cardHover flex flex-col items-center space-y-4"
        >
          <h4 className="text-center mt-2 text-lg font-bold">
            Step 3: Accountability Partnership
          </h4>
          <p>
            Schedule weekly meetings to share and update on your progress using
            our weekly updates template.
          </p>
          <Image
            src="/img/catchup.png"
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
            Step 4: Inspirations, Notifications, and Progress Reports
          </h4>
          <p>
            Receive weekly inspiration, notifications, and progress reports to
            stay on track.
          </p>
          <Image
            src="/img/insight.png"
            width={200}
            height={200}
            alt="inspirations"
          />
        </div>
      </div>
      {/* <iframe
        className="border"
        width="800"
        height="450"
        src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FI3u5Fl4KTXqMPDU35PnpOM%2FKaiKul%3Fnode-id%3D233-33%26starting-point-node-id%3D233%253A33%26scaling%3Dscale-down"
        allowFullScreen
      ></iframe> */}
    </div>
  );
}

export default Features;
