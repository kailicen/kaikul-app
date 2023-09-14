import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link, useColorMode } from "@chakra-ui/react";

interface Benefit {
  title: string;
  content: string;
  image: string;
}

interface BenefitsProps {
  benefits: Benefit[];
}

export function Benefits({ benefits }: BenefitsProps) {
  const { colorMode } = useColorMode();
  return (
    <section
      id="benefits"
      className="lg:py-18 container mb-4 space-y-8 rounded-lg py-12 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[64rem] flex-col items-center space-y-8 text-left">
        {/* {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex w-full flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0"
          >
            <div
              className={`flex w-full flex-col p-0 md:w-1/2 md:justify-center md:p-10 ${
                index % 2 === 1 ? "md:order-last" : ""
              }`}
            >
              <h2 className="mb-1 text-base font-bold text-[#4130AC] dark:text-[#FF5E0E] md:mb-3 md:text-2xl">
                {benefit.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-white md:text-base">
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
        ))} */}
        <Link
          href="https://www.canva.com/design/DAFuQHGqA1Y/rIa9fyabkD0dnyBQh4ynKg/view"
          fontSize="2xl"
          fontWeight="bold"
          isExternal
          color={colorMode === "light" ? "brand.500" : "brand.100"}
        >
          How-To Guide <ExternalLinkIcon mx="2px" />
        </Link>
        <iframe
          className="my-10 h-[300px] w-full px-1 md:h-[450px] md:w-[800px]"
          src="https://www.loom.com/embed/2b68e27676724275a7b17970f3b10a83"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
