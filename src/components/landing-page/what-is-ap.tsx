export function WhatIsAP() {
  return (
    <section
      id="what-is-accountability"
      className="lg:py-18 container mb-4 space-y-8 rounded-lg bg-[#fff8f5] py-12 xxs:px-4 sm:p-6 lg:p-8 dark:bg-gray-800"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-8 text-center xxxs:px-3">
        <h2 className="font-heading font-bold text-3xl xs:text-6xl sm:text-3xl md:text-6xl">
          The Power of{" "}
          <span className="text-[#4130AC] dark:text-[#ff5e0e]">
            Consistency
          </span>
        </h2>

        <div className="text-base md:text-lg">
          <p>
            {`Have you ever started something with enthusiasm only to leave it
            midway? Do your goals often feel out of reach, no matter how hard
            you try? What if the key isn't just effort, but consistent effort?`}
          </p>
        </div>

        <blockquote
          className="rounded border-l-4 border-[#4130AC] dark:border-[#ff5e0e] bg-white dark:bg-gray-700
          py-4 px-6 text-base italic shadow-md md:text-lg text-gray-700 dark:text-gray-100"
        >
          How consistently do you pursue what matters?
          {/* <p>
            &quot;A habit contract fosters a tangible sense of
            responsibility.&quot;
          </p>
          <span className="mt-2 block font-bold">
            - Inspired by Atomic Habits
          </span> */}
        </blockquote>
      </div>
    </section>
  );
}
