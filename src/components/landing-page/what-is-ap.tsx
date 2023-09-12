export function WhatIsAP() {
  return (
    <section
      id="what-is-ap"
      className="lg:py-18 container mb-4 space-y-8 rounded-lg bg-gradient-to-r from-[#fff8f5] to-[#fff8f5] py-12 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-8 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl dark:text-black">
          What&apos;s An{" "}
          <span className="text-[#4130AC]">Accountability Partner</span> ?
        </h2>

        <div className="text-base md:text-lg dark:text-black">
          <p>
            An Accountability Partner is like a dedicated teammate, ensuring you
            stay true to your goals.
          </p>
          <p>You support each other, ensuring both achieve success.</p>
        </div>

        <ul className="text-base md:text-lg dark:text-black">
          <li>✅ Engage in regular check-ins</li>
          <li>🎉 Celebrate mutual progress</li>
          <li>🤗 Provide unwavering support</li>
        </ul>

        <blockquote className="rounded border-l-4 border-[#4130AC] bg-white py-2 px-4 text-base italic shadow-md md:text-lg text-gray-700">
          <p>&quot;A habit contract can add a social cost to any behavior.</p>
          <p>
            It makes the costs of breaking your promises public and
            painful.&quot;
          </p>
          <span className="mt-2 block font-bold">- Atomic Habits</span>
        </blockquote>
      </div>
    </section>
  );
}
