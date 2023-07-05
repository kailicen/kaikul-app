import Features from "@/components/LandingPageSections/Features";
import Hero from "@/components/LandingPageSections/Hero";
import Team from "@/components/LandingPageSections/Team";
import Testimonial from "@/components/LandingPageSections/Testimonial";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "react-social-icons";
import Qna from "@/components/LandingPageSections/Qna";
import { Story } from "@/components/LandingPageSections/Story";
import PictureWall from "@/components/LandingPageSections/PictureWall";
import HowItWorks from "@/components/LandingPageSections/HowItWorks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { useColorMode } from "@chakra-ui/react";
import WeeklyPlanner from "@/components/App/WeeklyPlanner";
import UnauthenticatedHeader from "@/components/Header/UnauthenticatedHeader";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import LoadingScreen from "@/components/LoadingScreen";

type SectionRef = HTMLDivElement | null;

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  const howItWorksRef = useRef<SectionRef>(null);
  const featuresRef = useRef<SectionRef>(null);
  const testimonialRef = useRef<SectionRef>(null);
  const qnaRef = useRef<SectionRef>(null);
  const teamRef = useRef<SectionRef>(null);

  const [headerBgColor, setHeaderBgColor] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollToHowItWorks = () => {
    if (howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
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
  const scrollToTeam = () => {
    if (teamRef.current) {
      teamRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = { light: "white", dark: "gray-900" };
  const textColor = { light: "black", dark: "white" };

  const headerProps = {
    user,
    scrollToTop,
    scrollToHowItWorks,
    scrollToFeatures,
    scrollToTestimonial,
    scrollToQna,
    scrollToTeam,
    textColor,
    colorMode,
    isMenuOpen,
    toggleMenu,
    headerBgColor,
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 20; // Adjust this value as needed

      if (scrollTop > threshold) {
        setHeaderBgColor(`bg-${bgColor[colorMode]}`);
      } else {
        setHeaderBgColor("bg-transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [colorMode]);

  if (loading) {
    // Here, you can return a loader if the authentication state is still being determined.
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen z-0 font-sans">
      <Head>
        <title>KaiKul | Make Weekly Improvements With Your Peer</title>
        <meta
          property="og:title"
          content="KaiKul | Make Weekly Improvements With Your Peer"
        />
        <meta property="og:image" content="/img/kaikul-thumbnail.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user ? (
        <AuthenticatedHeader user={user} />
      ) : (
        <UnauthenticatedHeader {...headerProps} />
      )}

      {user ? (
        <div className="pt-[100px] px-2 md:px-10 3xl:px-32">
          <WeeklyPlanner user={user} />
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-15 mx-auto">
            <section id="hero" className="min-h-[100vh]">
              <Hero />
            </section>
            <section id="howItWorks" ref={howItWorksRef}>
              <HowItWorks />
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
            <section id="qna" ref={qnaRef}>
              <Qna />
            </section>
            <section id="team" ref={teamRef}>
              <Team />
            </section>
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
        </>
      )}
    </div>
  );
}
