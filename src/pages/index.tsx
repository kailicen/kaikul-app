import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Head from "next/head";
import { useRef } from "react";

type SectionRef = HTMLDivElement | null;

export default function Home() {
  const contactRef = useRef<SectionRef>(null);

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="h-screen snap-y snap-mandatory 
    overflow-y-scroll overflow-x-hidden z-0"
    >
      <Head>
        <title>LifeLift</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header
        className="sticky top-0 p-5 flex justify-between max-w-7xl
    mx-auto z-20 items-center"
      >
        <div className="font-mali text-2xl">LifeLift</div>
        <button className="button" onClick={scrollToContact}>
          Contact Us
        </button>
      </header>

      <section id="hero" className="snap-start">
        <Hero />
      </section>

      <section id="contact" className="snap-start" ref={contactRef}>
        <Contact />
      </section>
    </div>
  );
}
