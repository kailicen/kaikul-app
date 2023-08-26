"use client";
import { useState } from "react";

export function HowItWorks() {
  const [pathway, setPathway] = useState("solo");
  return (
    <section
      id="how-it-works"
      className="lg:py-18 container mb-4 space-y-8 rounded-lg bg-[#0D0322] py-12 text-white dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[64rem] flex-col items-center space-y-8 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl">
          How It Works
        </h2>

        {/* Toggle between Solo and Buddy-Up pathways */}
        <div className="flex space-x-4">
          <button
            onClick={() => setPathway("solo")}
            className={`${
              pathway === "solo" ? "active-tab" : ""
            } move-up rounded bg-gray-700 px-4 py-3 font-bold`}
          >
            Solo
          </button>
          <button
            onClick={() => setPathway("buddy")}
            className={`${
              pathway === "buddy" ? "active-tab" : ""
            } move-up rounded bg-gray-700 px-4 py-3 font-bold`}
          >
            Buddy-Up
          </button>
        </div>

        {pathway === "solo" && (
          <div className="grid w-full grid-cols-1 gap-8 md:max-w-[64rem] md:grid-cols-3">
            <div className="flex flex-col items-start">
              <img
                src="/images/how-it-works/goal-setting.png"
                alt="Goal Setting"
                className="h-[200px] w-full rounded-md object-cover shadow-sm"
              />
              <p className="mt-2 text-base font-bold md:text-xl">
                <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                  1
                </span>
                Goal Setting
              </p>
              <p className="ml-7 text-left">
                Define clear and achievable objectives for your journey.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <img
                src="/images/how-it-works/daily-tracking.png"
                alt="Daily Tracking"
                className="h-[200px] w-full rounded-md object-cover shadow-sm"
              />
              <p className="mt-2 text-base font-bold md:text-xl">
                <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                  2
                </span>
                Daily Tracking
              </p>
              <p className="ml-7 text-left">
                Monitor your progress and stay committed to your tasks.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <img
                src="/images/how-it-works/weekly-reflection.png"
                alt="Daily Tracking"
                className="h-[200px] w-full rounded-md object-cover shadow-sm"
              />
              <p className="mt-2 text-base font-bold md:text-xl">
                <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                  3
                </span>
                Weekly Reflection
              </p>
              <p className="ml-7 text-left">
                Analyze, learn, and strategize for the upcoming week.
              </p>
            </div>
          </div>
        )}

        {pathway === "buddy" && (
          <div className="grid w-full grid-cols-1 gap-8 md:max-w-[64rem] md:grid-cols-3">
            <div className="flex flex-col items-start">
              <img
                src="/images/how-it-works/collaborative-goal.png"
                alt="Collaborative Goal Setting"
                className="h-[200px] w-full rounded-md object-cover shadow-sm"
              />
              <p className="mt-2 text-base font-bold md:text-xl">
                <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                  1
                </span>
                Collaborative Goal Setting
              </p>
              <p className="ml-7 text-left">
                Meet a buddy and do a goal setting section.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <img
                src="/images/how-it-works/shared-progress.png"
                alt="Shared Daily Progress"
                className="h-[200px] w-full rounded-md object-cover shadow-sm"
              />
              <p className="mt-2 text-base font-bold md:text-xl">
                <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                  2
                </span>
                Shared Daily Progress
              </p>
              <p className="ml-7 text-left">
                Share tasks, reflections from yesterday, and today&apos;s to-do
                list.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <img
                src="/images/how-it-works/weekly-meeting.png"
                alt="Weekly Meetings"
                className="h-[200px] w-full rounded-md object-cover shadow-sm"
              />
              <p className="mt-2 text-base font-bold md:text-xl">
                <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                  3
                </span>
                Weekly Meetings
              </p>
              <p className="ml-7 text-left">
                Strategize for the upcoming week with a set agenda.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* <iframe
        className="my-10 h-[300px] w-full px-1 md:h-[450px] md:w-[800px]"
        src="https://www.loom.com/embed/5d10f1c8e1fa48e3b6ebacf71e5b0390"
        allowFullScreen
      ></iframe> */}
    </section>
  );
}
