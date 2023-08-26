interface Benefit {
  title: string;
  content: string;
  image: string;
}

interface BenefitsProps {
  benefits: Benefit[];
}

export function Benefits({ benefits }: BenefitsProps) {
  return (
    <section
      id="benefits"
      className="lg:py-18 container mb-4 space-y-8 rounded-lg py-12 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[64rem] flex-col items-center space-y-8 text-left">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex w-full flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0"
          >
            <div
              className={`flex w-full flex-col p-0 md:w-1/2 md:justify-center md:p-10 ${
                index % 2 === 1 ? "md:order-last" : ""
              }`}
            >
              <h2 className="mb-1 text-base font-bold text-[#4130AC] md:mb-3 md:text-2xl">
                {benefit.title}
              </h2>
              <p className="text-sm text-gray-600 md:text-base">
                {benefit.content}
              </p>
            </div>
            <div className="w-full p-0 md:w-1/2 md:p-10">
              <img
                src={`/images/benefits/${benefit.image}.png`}
                alt={`${benefit.title}`}
                className="h-full w-full transform rounded-md object-cover shadow-xl transition-transform hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
