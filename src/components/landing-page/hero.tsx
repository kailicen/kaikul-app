import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { Button } from "@/chakra/button";

export function Hero() {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <section
      id="hero"
      className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32"
    >
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
        <h1
          className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-loose"
          id="mainHeader"
        >
          KaiKul: Where <span className="text-[#4130AC]">Ownership</span> Meets{" "}
          <span className="gradient-text">Purpose</span>
        </h1>

        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          KaiKul is a personal development platform designed to foster conscious
          living and nurture personal responsibility.
        </p>
        <div className="mt-4">
          <button
            className={cn(buttonVariants({ size: "cta" }))}
            onClick={() => setAuthModalState({ open: true, view: "login" })}
          >
            Join For Free
          </button>
        </div>
      </div>
    </section>
  );
}
