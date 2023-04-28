import Beta from "@/components/Beta";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Team from "@/components/Team";
import Head from "next/head";
import { useRef } from "react";

type SectionRef = HTMLDivElement | null;

export default function Home() {
  const featuresRef = useRef<SectionRef>(null);
  const betaRef = useRef<SectionRef>(null);
  const teamRef = useRef<SectionRef>(null);
  const contactRef = useRef<SectionRef>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToBeta = () => {
    if (betaRef.current) {
      betaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTeam = () => {
    if (teamRef.current) {
      teamRef.current.scrollIntoView({ behavior: "smooth" });
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
        <title>KaiKul | Your Personal Development Go-to Place </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header
        className="sticky top-0 p-5 flex justify-between max-w-7xl bg-white
    mx-auto z-20 items-center"
      >
        <div
          className="font-bold text-2xl hover:cursor-pointer hover:text-violet-500"
          onClick={scrollToTop}
        >
          KaiKul
        </div>
        <div className="flex flex-row items-center space-x-2 md:space-x-5">
          <div
            className="hover:text-violet-500 hover:cursor-pointer"
            onClick={scrollToFeatures}
          >
            Features
          </div>
          <div
            className="hover:text-violet-500 hover:cursor-pointer"
            onClick={scrollToBeta}
          >
            Beta
          </div>
          <div
            className="hover:text-violet-500 hover:cursor-pointer"
            onClick={scrollToTeam}
          >
            Our Team
          </div>
          <button className="buttonMobile md:button" onClick={scrollToContact}>
            Contact
          </button>
        </div>
      </header>

      <div className="flex flex-col space-y-5">
        <section id="hero">
          <Hero />
        </section>

        <section id="features" ref={featuresRef}>
          <Features />
        </section>

        <section id="beta" ref={betaRef}>
          <Beta />
        </section>

        <section id="team" ref={teamRef}>
          <Team />
        </section>

        <section id="contact" ref={contactRef}>
          <Contact />
        </section>
      </div>

      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <p className="text-gray-400 text-center text-sm">
            © {new Date().getFullYear()} KaiKul. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
