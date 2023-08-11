import { Icons } from "../icons";

export function Features() {
  return (
    <section
      id="features"
      className="lg:py-18 container mb-4 space-y-6 rounded-lg py-8 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl">
          Features
        </h2>
      </div>

      <div
        id="featuresGrid"
        className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3"
      >
        <div className="relative overflow-hidden rounded-lg bg-[#cfccd3] p-2 text-[#0D0322]">
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
        <div className="relative overflow-hidden rounded-lg bg-[#e4dff3] p-2 text-[#4130AC]">
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
        <div className="relative overflow-hidden rounded-lg bg-[#cfccd3] p-2 text-[#0D0322]">
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
        <div className="relative overflow-hidden rounded-lg bg-[#e4dff3] p-2 text-[#4130AC]">
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
        <div className="relative overflow-hidden rounded-lg bg-[#cfccd3] p-2 text-[#0D0322]">
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
        <div className="relative overflow-hidden rounded-lg bg-[#e4dff3] p-2 text-[#4130AC]">
          <div className="flex min-h-[200px] flex-col justify-between gap-4 rounded-md p-6">
            <Icons.Lightbulb className="h-12 w-12" />
            <div className="space-y-2">
              <h3 className="font-bold md:text-lg">AI Recommendations</h3>
              <p className="text-sm">
                Enjoy upcoming AI-guided suggestions for personal growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
