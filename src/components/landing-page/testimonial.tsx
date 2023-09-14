import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Testimonial {
  keyword: string;
  testimonial: string;
  name: string;
  role: string;
  avatar: string;
}

interface TestimonialProps {
  testimonials: Testimonial[];
}

export function Testimonial({ testimonials }: TestimonialProps) {
  return (
    <section
      id="testimonial"
      className="lg:py-18 container mb-4 space-y-6 rounded-lg py-8 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl">
          Testimonial
        </h2>
        <div className="flex flex-wrap items-start justify-center">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="my-2 flex max-w-[600px] flex-col items-center rounded-lg bg-[#e4dff3] dark:bg-gray-800 px-6 py-4 shadow-md md:w-[600px]"
            >
              <div className="highlight-underline z-10 mb-4 text-lg font-semibold dark:text-gray-200">
                &ldquo;{testimonial.keyword}&rdquo;
              </div>
              <div className="mb-4 text-muted-foreground">
                &ldquo;{testimonial.testimonial}&rdquo;
              </div>
              <Avatar>
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
              </Avatar>
              <div className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {testimonial.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {testimonial.role}
              </div>
            </div>
          ))}
        </div>
        {/* <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "px-4"
          )}
        >
          See More...
        </Link> */}
      </div>
    </section>
  );
}
