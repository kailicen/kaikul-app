import Beta from "@/components/Beta";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Team from "@/components/Team";
import Testimonial from "@/components/Testimonial";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "react-social-icons";
import va from "@vercel/analytics";
import Qna from "@/components/Qna";
import { Story } from "@/components/Story";
import PictureWall from "@/components/PictureWall";

type SectionRef = HTMLDivElement | null;

export default function Home() {
  const featuresRef = useRef<SectionRef>(null);
  //const storyRef = useRef<SectionRef>(null);
  const testimonialRef = useRef<SectionRef>(null);
  const qnaRef = useRef<SectionRef>(null);
  //const betaRef = useRef<SectionRef>(null);
  const teamRef = useRef<SectionRef>(null);
  //const contactRef = useRef<SectionRef>(null);

  const [headerBgColor, setHeaderBgColor] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const scrollToStory = () => {
  //   if (storyRef.current) {
  //     storyRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  const scrollToTestimonial = () => {
    if (testimonialRef.current) {
      testimonialRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToQna = () => {
    if (qnaRef.current) {
      qnaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const scrollToBeta = () => {
  //   if (betaRef.current) {
  //     betaRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  const scrollToTeam = () => {
    if (teamRef.current) {
      teamRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const scrollToContact = () => {
  //   if (contactRef.current) {
  //     contactRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 20; // Adjust this value as needed

      if (scrollTop > threshold) {
        setHeaderBgColor("bg-white");
      } else {
        setHeaderBgColor("bg-transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen z-0 font-sans">
      <Head>
        <title>KaiKul | Make Weekly Improvements with your Peer</title>
        <meta
          property="og:title"
          content="KaiKul | Make Weekly Improvements with your Peer"
        />
        <meta property="og:image" content="/img/kaikul-thumbnail.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header
        className={`sticky top-0 p-5 flex justify-between px-5 md:px-20 ${headerBgColor} mx-auto z-20 items-center`}
      >
        <div
          className="font-bold text-2xl 2xl:text-3xl hover:cursor-pointer hover:text-violet-600"
          onClick={scrollToTop}
        >
          KaiKul
        </div>
        <div className="hidden md:flex md:flex-row items-center space-x-2 md:space-x-5 font-semibold 2xl:text-xl">
          <div
            className="hover:text-violet-600 hover:cursor-pointer"
            onClick={scrollToFeatures}
          >
            How It Works
          </div>
          {/* <div
            className="hover:text-violet-600 hover:cursor-pointer"
            onClick={scrollToStory}
          >
            User Story
          </div> */}
          <div
            className="hover:text-violet-600 hover:cursor-pointer"
            onClick={scrollToTestimonial}
          >
            Testimonial
          </div>
          <div
            className="hover:text-violet-600 hover:cursor-pointer"
            onClick={scrollToQna}
          >
            FAQ
          </div>
          {/* <div
            className="hover:text-violet-600 hover:cursor-pointer"
            onClick={scrollToBeta}
          >
            Beta v1.1
          </div> */}
          <div
            className="hover:text-violet-600 hover:cursor-pointer"
            onClick={scrollToTeam}
          >
            Our Team
          </div>
          {/* <button className="buttonMobile md:button" onClick={scrollToContact}>
            Contact
          </button> */}
          <button className="buttonMobile md:button">
            <Link
              href="https://airtable.com/shrRTSGtb5taQ50yO/"
              target="_blank"
              onClick={() => va.track("JoinNow")}
            >
              Join Now
            </Link>
          </button>
        </div>
        <Bars3Icon
          onClick={toggleMenu}
          className="block md:hidden h-8 w-8 text-black cursor-pointer"
        />
        {isMenuOpen && (
          <div className="absolute top-20 right-0 w-full p-4 bg-white z-20 flex flex-col items-end">
            <div
              className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
              onClick={() => {
                toggleMenu();
                scrollToFeatures();
              }}
            >
              How It Works
            </div>
            {/* <div
              className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
              onClick={() => {
                toggleMenu();
                scrollToStory();
              }}
            >
              User Story
            </div> */}
            <div
              className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
              onClick={() => {
                toggleMenu();
                scrollToTestimonial();
              }}
            >
              Testimonial
            </div>
            <div
              className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
              onClick={() => {
                toggleMenu();
                scrollToQna();
              }}
            >
              FAQ
            </div>
            {/* <div
              className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
              onClick={() => {
                toggleMenu();
                scrollToBeta();
              }}
            >
              Beta v1.1
            </div> */}
            <div
              className="block py-2 px-4 hover:text-violet-600 hover:cursor-pointer"
              onClick={() => {
                toggleMenu();
                scrollToTeam();
              }}
            >
              Our Team
            </div>
            {/* <button
              className="block my-2 mx-4 buttonMobile md:button"
              onClick={() => {
                toggleMenu();
                scrollToContact();
              }}
            >
              Contact
            </button> */}
            <button
              className="block my-2 mx-4 buttonMobile md:button"
              onClick={toggleMenu}
            >
              <Link
                href="https://airtable.com/shrRTSGtb5taQ50yO/"
                target="_blank"
                onClick={() => va.track("JoinNowFromMobile")}
              >
                Join Now
              </Link>
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-col space-y-15 mx-auto">
        <section id="hero" className="min-h-[100vh]">
          <Hero />
        </section>

        <section id="features" ref={featuresRef}>
          <Features />
        </section>

        <section id="testimonial" ref={testimonialRef}>
          <Story />
        </section>

        <section>
          <Testimonial />
        </section>

        <section>
          <PictureWall />
        </section>

        {/* <section id="beta" ref={betaRef}>
          <Beta />
        </section> */}

        <section id="qna" ref={qnaRef}>
          <Qna />
        </section>

        <section id="team" ref={teamRef}>
          <Team />
        </section>

        {/* <section id="contact" ref={contactRef}>
          <Contact />
        </section> */}
      </div>

      <footer className="bg-violet-950 py-8 flex flex-col justify-center items-center">
        <div className="container mx-auto px-4">
          <p className="text-violet-400 text-center text-sm">
            © {new Date().getFullYear()} KaiKul. All rights reserved.
          </p>
        </div>
        <div className="flex flex-row space-x-2 my-2">
          <SocialIcon
            url="https://www.linkedin.com/company/kaikul"
            target="_blank"
            bgColor="white"
            className="mt-2"
          />
          <SocialIcon
            url="https://twitter.com/KaiKulapp/"
            target="_blank"
            bgColor="white"
            className="mt-2"
          />
          <SocialIcon
            url="https://www.instagram.com/kaikulapp/"
            target="_blank"
            bgColor="white"
            className="mt-2"
          />
          <SocialIcon
            url="https://www.facebook.com/kaikulapp/"
            target="_blank"
            bgColor="white"
            className="mt-2"
          />
        </div>
      </footer>
    </div>
  );
}
