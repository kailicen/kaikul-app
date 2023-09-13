export function WhatIsAP() {
  return (
    <section
      id="what-is-accountability"
      className="lg:py-18 container mb-4 space-y-8 rounded-lg bg-gradient-to-r from-[#fff8f5] to-[#fff8f5] py-12 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-8 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl dark:text-secondary-foreground">
          What is <span className="text-[#4130AC]">Ownership</span>?
        </h2>

        <div className="text-base md:text-lg dark:text-secondary-foreground">
          <p>
            Taking ownership of your life means embracing your unique journey,
            honoring self-commitments, and making every step a conscious choice
            aligned with your deepest goals.
          </p>
        </div>

        <blockquote className="rounded border-l-4 border-[#4130AC] bg-white py-2 px-4 text-base italic shadow-md md:text-lg text-gray-700">
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
