"use client";
import { useState } from "react";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="lg:py-18 container mb-4 space-y-8 rounded-lg py-12"
    >
      <div className="mx-auto flex max-w-[64rem] flex-col items-center space-y-8 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl">
          How It Works
        </h2>

        <div className="grid w-full grid-cols-1 gap-8 md:max-w-[64rem] md:grid-cols-3">
          <div className="flex flex-col items-start xxs:my-3 xxs:justify-center xxs:items-center xxxs:items-center xxxs:my-3">
            <img
              src="/images/how-it-works/goal-setting.png"
              alt="Consistent Vision"
              className="h-[200px] w-full rounded-md object-cover shadow-lg"
            />
            <p className="mt-2 text-base font-bold xxs:mt-5 md:text-xl xxxs:my-2">
              <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                1
              </span>
              <span className="xxxs:text-2xl">Consistent Vision</span>
            </p>
            <p className="ml-7 text-left xxs:text-center xxs:ml-0 xxs:mt-2 xxxs:text-center xxxs:ml-0">
              Transform your vision into daily tasks. Every consistent step, no
              matter how small, propels you forward.
            </p>
          </div>
          <div className="flex flex-col items-start xxs:my-3 xxs:justify-center xxs:items-center xxxs:items-center xxxs:my-3">
            <img
              src="/images/how-it-works/daily-tracking.png"
              alt="Consistent Actions"
              className="h-[200px] w-full rounded-md object-cover shadow-lg"
            />
            <p className="mt-2 text-base font-bold xxs:mt-5 md:text-xl xxxs:my-2">
              <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                2
              </span>
              <span className="xxxs:text-2xl">Consistent Actions</span>
            </p>
            <p className="ml-7 text-left xxs:text-center xxs:ml-0 xxs:mt-2 xxxs:text-center xxxs:ml-0">
              Break your overarching goals into daily, grounded tasks to
              maintain a focused approach.
            </p>
          </div>
          <div className="flex flex-col items-start xxs:my-3 xxs:justify-center xxs:items-center xxxs:items-center xxxs:my-3">
            <img
              src="/images/how-it-works/weekly-reflection.png"
              alt="Consistent Reflection"
              className="h-[200px] w-full rounded-md object-cover shadow-lg"
            />
            <p className="mt-2 text-base font-bold xxs:mt-5 md:text-xl xxxs:my-2">
              <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                3
              </span>
              <span className="xxxs:text-2xl">Consistent Reflection</span>
            </p>
            <p className="ml-7 text-left xxs:text-center xxs:ml-0 xxs:mt-2 xxxs:text-center xxxs:ml-0">
              Evaluate and adapt regularly, ensuring that your actions are
              consistently aligned with your evolving vision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
