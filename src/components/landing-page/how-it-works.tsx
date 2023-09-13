"use client";
import { useState } from "react";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="lg:py-18 container mb-4 space-y-8 rounded-lg bg-[#0D0322] py-12 text-white dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[64rem] flex-col items-center space-y-8 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl">
          How It Works
        </h2>

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
              Start with a clear, long-term aspiration, breaking free from the
              short-sightedness that clouds modern life.
            </p>
          </div>
          <div className="flex flex-col items-start">
            <img
              src="/images/how-it-works/daily-tracking.png"
              alt="Task Management"
              className="h-[200px] w-full rounded-md object-cover shadow-sm"
            />
            <p className="mt-2 text-base font-bold md:text-xl">
              <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                2
              </span>
              Task Management
            </p>
            <p className="ml-7 text-left">
              Break your overarching goals into daily, grounded tasks to
              maintain a focused approach.
            </p>
          </div>
          <div className="flex flex-col items-start">
            <img
              src="/images/how-it-works/weekly-reflection.png"
              alt="Reflection"
              className="h-[200px] w-full rounded-md object-cover shadow-sm"
            />
            <p className="mt-2 text-base font-bold md:text-xl">
              <span className="mr-3 text-3xl font-extrabold text-[#ff5e0e]">
                3
              </span>
              Reflection
            </p>
            <p className="ml-7 text-left">
              Foster growth through conscious living, learning from each day and
              dynamically adapting and evolving.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
