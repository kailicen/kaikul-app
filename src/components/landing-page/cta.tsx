import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      id="cta"
      className="lg:py-18 container mb-4 space-y-6 rounded-lg bg-slate-50 py-8 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl">
          Ready for <span className="gradient-text">Real</span> Growth?
        </h2>
        <div>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "cta" }))}
            id="createCollectionboxButton"
          >
            Join For Free
          </Link>
        </div>
      </div>
    </section>
  );
}
