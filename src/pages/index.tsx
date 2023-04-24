import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Head from "next/head";
import { useRef } from "react";

type SectionRef = HTMLDivElement | null;

export default function Home() {
  //const heroRef = useRef<SectionRef>(null);
  const featuresRef = useRef<SectionRef>(null);
  const contactRef = useRef<SectionRef>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen z-0">
      <Head>
        <title>LifeLift</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header
        className="sticky top-0 p-5 flex justify-between max-w-7xl bg-white
    mx-auto z-20 items-center"
      >
        <div
          className="font-caveat text-2xl italic hover:cursor-pointer hover:text-cyan-500"
          onClick={scrollToTop}
        >
          LifeLift
        </div>
        <div className="flex flex-row items-center space-x-5">
          <div
            className="hover:text-cyan-500 hover:cursor-pointer"
            onClick={scrollToFeatures}
          >
            Groups (beta)
          </div>
          <button className="button" onClick={scrollToContact}>
            Contact
          </button>
        </div>
      </header>

      <div className="flex flex-col">
        <section id="hero">
          <Hero />
        </section>

        <section id="features" ref={featuresRef}>
          <Features />
        </section>

        <section id="contact" ref={contactRef}>
          <Contact />
        </section>
      </div>

      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <p className="text-gray-400 text-center text-sm">
            © {new Date().getFullYear()} LifeLift. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
