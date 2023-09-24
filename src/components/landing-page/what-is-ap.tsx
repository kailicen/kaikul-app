export function WhatIsAP() {
  return (
    <section
      id="what-is-accountability"
      className="lg:py-18 container mb-4 space-y-8 rounded-lg bg-[#fff8f5] py-12 xxs:px-4 sm:p-6 lg:p-8 dark:bg-gray-800"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-8 text-center">
        <h2 className="font-heading font-bold text-3xl xs:text-6xl sm:text-3xl md:text-6xl">
          What is{" "}
          <span className="text-[#4130AC] dark:text-[#ff5e0e]">Ownership</span>?
        </h2>

        <div className="text-base md:text-lg">
          <p>
            Taking ownership of your life means embracing your unique journey,
            honoring self-commitments, and making every step a conscious choice
            aligned with your deepest goals.
          </p>
        </div>

        <blockquote
          className="rounded border-l-4 border-[#4130AC] dark:border-[#ff5e0e] bg-white dark:bg-gray-700
          py-2 px-4 text-base italic shadow-md md:text-lg text-gray-700 dark:text-gray-100"
        >
          <ul className="text-start">
            <li>
              💬 <span className="font-semibold">Integrity</span>: Do what you
              say you will do.
            </li>
            <li>
              🤲 <span className="font-semibold">Self-compassion</span>: Accept
              yourself when you cannot fulfill a commitment.
            </li>
            <li>
              🔁 <span className="font-semibold">Resilience</span>: Persistently
              pursue what you set out to do.
            </li>
          </ul>
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
