export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="lg:py-18 container mb-4 space-y-6 rounded-lg bg-slate-50 py-8 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl">
          How It Works
        </h2>
        <iframe
          className="my-10 h-[300px] w-full px-1 md:h-[450px] md:w-[800px]"
          src="https://www.loom.com/embed/5d10f1c8e1fa48e3b6ebacf71e5b0390"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
