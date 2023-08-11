import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQ[];
}

export function FAQ({ faqs }: FAQProps) {
  return (
    <section
      id="FAQ"
      className="lg:py-18 container mb-4 space-y-6 rounded-lg py-8 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl">
          FAQ
        </h2>

        <Accordion
          type="single"
          collapsible
          className="max-w-[700px] md:w-[700px]"
        >
          {faqs.map((item) => (
            <AccordionItem
              key={item.id}
              value={`item${item.id}`}
              className="mb-5 rounded bg-[#0D0322] px-5 text-white"
            >
              <AccordionTrigger className="hover:text-[#ff5e0e]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-left">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
