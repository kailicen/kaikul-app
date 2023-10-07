"use client";
import { useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";

export function Features() {
  const [showFeatures, setShowFeatures] = useState(false);
  return (
    <section
      id="features"
      className="container mb-4 flex flex-col items-center space-y-6 rounded-lg py-8 dark:bg-transparent lg:py-8"
    >
      {/* Button to toggle feature visibility */}
      <Button
        onClick={() => setShowFeatures(!showFeatures)}
        className="px-8 py-6"
        size="lg"
      >
        <span className="mr-2 text-base md:text-lg">Discover Our Features</span>
        {showFeatures ? (
          <Icons.ChevronUp className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <Icons.ChevronDown className="h-6 w-6 transition-transform duration-300" />
        )}
      </Button>
      <div
        id="featuresGrid"
        className={`mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 ${
          showFeatures ? "expanded" : ""
        }`}
      >
        <div className="relative overflow-hidden rounded-lg bg-[#cfccd3] dark:bg-gray-800 p-2 text-[#0D0322] dark:text-gray-300">
          <div className="flex min-h-[200px] flex-col justify-between gap-4 rounded-md p-6">
            <Icons.CalendarDays className="h-12 w-12" />
            <div className="space-y-2">
              <h3 className="font-bold md:text-lg">Trackers</h3>
              <p className="text-sm">
                Manage weekly goals and daily tasks with color-coded tracking.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-[#e4dff3] dark:bg-gray-700 p-2 text-[#4130AC] dark:text-[#dbcdf7]">
          <div className="flex min-h-[200px] flex-col justify-between gap-4 rounded-md p-6">
            <Icons.Users className="h-12 w-12" />
            <div className="space-y-2">
              <h3 className="font-bold md:text-lg">Accountability Partner</h3>
              <p className="text-sm">
                Pair with a community member for weekly progress accountability.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-[#cfccd3] dark:bg-gray-800 p-2 text-[#0D0322] dark:text-gray-300">
          <div className="flex min-h-[200px] flex-col justify-between gap-4 rounded-md p-6">
            <Icons.BarChart className="h-12 w-12" />
            <div className="space-y-2">
              <h3 className="font-bold md:text-lg">Analytics</h3>
              <p className="text-sm">
                View personalized insights on completed and pending tasks by
                day, week, or month.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-[#e4dff3] dark:bg-gray-700 p-2 text-[#4130AC] dark:text-[#dbcdf7]">
          <div className="flex min-h-[200px] flex-col justify-between gap-4 rounded-md p-6">
            <Icons.Pencil className="h-12 w-12" />
            <div className="space-y-2">
              <h3 className="font-bold md:text-lg">Weekly Reflection</h3>
              <p className="text-sm">
                Share structured reflections weekly with your accountability
                partner.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-[#cfccd3] dark:bg-gray-800 p-2 text-[#0D0322] dark:text-gray-300">
          <div className="flex min-h-[200px] flex-col justify-between gap-4 rounded-md p-6">
            <Icons.Bell className="h-12 w-12" />
            <div className="space-y-2">
              <h3 className="font-bold md:text-lg">Reminders</h3>
              <p className="text-sm">
                Get customized notifications and gentle nudges for task
                management (on the way).
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-[#e4dff3] dark:bg-gray-700 p-2 text-[#4130AC] dark:text-[#dbcdf7]">
          <div className="flex min-h-[200px] flex-col justify-between gap-4 rounded-md p-6">
            <Icons.Lightbulb className="h-12 w-12" />
            <div className="space-y-2">
              <h3 className="font-bold md:text-lg">Brain Food</h3>
              <p className="text-sm">
                Curated content to stimulate your mind and promote continuous
                learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
