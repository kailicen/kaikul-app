// import Features from "@/components/LandingPageSections/Features";
// import Hero from "@/components/LandingPageSections/Hero";
// import Team from "@/components/LandingPageSections/Team";
// import Testimonial from "@/components/LandingPageSections/Testimonial";
// import HowItWorks from "@/components/LandingPageSections/HowItWorks";
// import Qna from "@/components/LandingPageSections/Qna";
import { Testimonial } from "@/components/landing-page/testimonial";
import { Features } from "@/components/landing-page/features";
import { FAQ } from "@/components/landing-page/faq";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { Team } from "@/components/landing-page/team";
import { Hero } from "@/components/landing-page/hero";
import { CTA } from "@/components/landing-page/cta";
import { Icons } from "@/components/icons";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { SocialIcon } from "react-social-icons";
import { Story } from "@/components/LandingPageSections/Story";
import PictureWall from "@/components/LandingPageSections/PictureWall";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { useColorMode } from "@chakra-ui/react";
import WeeklyPlanner from "@/components/App/Tracker/WeeklyPlanner";
import UnauthenticatedHeader from "@/components/Header/UnauthenticatedHeader";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import LoadingScreen from "@/components/LoadingScreen";

const testimonials = [
  {
    name: "Mohamed Shire",
    role: "Founder of Monsera",
    avatar:
      "https://ca.slack-edge.com/T05FJL1G2HF-U05ESECJM39-f8714a868a80-512",
    keyword: "Simplicity",
    testimonial:
      "Just how easy it is to navigate through; it just concise and clear.",
  },
  {
    name: "Primrose Muzvuru",
    role: "CEO of Abantu Bahle",
    avatar:
      "https://media.licdn.com/dms/image/D5603AQGQLxtvjERHQw/profile-displayphoto-shrink_800_800/0/1688191037704?e=1696464000&v=beta&t=gd0oyZs2PeTpx0Z-uBSY28KsUGWLYVcdDSdlV0aNq2Y",
    keyword: "Self Awareness",
    testimonial:
      "It feels like a personal diary, upgraded - it holds my thoughts and experiences, yet stirs meaningful self-reflection and insight, making me feel understood and fostering my personal growth and self-awareness.",
  },
  {
    name: "Eva Bein",
    role: "Educator",
    avatar:
      "https://ca.slack-edge.com/T05BWMWRMEW-U05EE16UAPK-8676c1a56f21-512",
    keyword: "Accountable buddy-system",
    testimonial:
      "...What's most helpful to me, however, is the buddy-system: Meeting weekly to discuss progress, obstacles, and learnings has been greatly enriching personally and helps me stay on track. I love that my buddy and I can support each other, which holds me accountable and motivates me to keep going.",
  },
];

const faqs = [
  {
    id: 1,
    question: "Who is KaiKul for?",
    answer:
      "KaiKul is for anyone who wants to constantly improve themselves in practical and impactful ways. Whether you aim to meditate regularly, stay active, read more, improve productivity, prioritize effectively, or make healthier choices, KaiKul provides the community, resources, and accountability to help you achieve real, meaningful results.",
  },
  {
    id: 2,
    question: "What if I don't have clear goals?",
    answer:
      "This is what KaiKul is for. We have participants who have gone from not knowing their goals to having clear goals and directions in life. You will also learn to make better goals along the way. ",
  },
  {
    id: 3,
    question: "How do I get started?",
    answer:
      "1. Sign in to our KaiKul platform to set your goals. 2. Engage in our community to share your daily sprint. 3. Find your like-minded accountability partner and join the weekly meetup to share your weekly reflection using KaiKul framework. ",
  },
  {
    id: 4,
    question: "How do you find your accountability buddy? ",
    answer:
      "Start by introducing yourself in our community. 1. Your name; 2. Your purpose; 3. Your preference: weekly virtual meet-ups or texting. Be respectful and kind! ",
  },
  {
    id: 5,
    question: "Is KaiKul free?",
    answer:
      "Absolutely! KaiKul is currently free to use. In the near future, as we enhance our features, we plan to introduce a freemium model that will continue to offer valuable free access, along with premium options. ",
  },
];

const clients = [
  {
    name: "Setthawut Kulsrisuwan",
    introduction:
      "A dual entrepreneur with 4 years of experience and a top 3% finish in AIAT's AI bootcamp, Boom blends business savvy with tech innovation to lead our team.",
    avatar:
      "https://ca.slack-edge.com/T05BWMWRMEW-U05BG623CBH-8234562767eb-512",
    link: "https://setthawut-kul.medium.com/kaikul-4-pocket-book-to-pivot-to-gather-feedbacks-and-to-handle-overwhelmed-feeling-8477fafcf442",
  },
  {
    name: "Kaili Cen",
    introduction:
      "A self-taught web developer with an MS in Computer Science, Kaili passionately channels her commitment to personal growth into our mission, using technology to drive change.",
    avatar:
      "https://ca.slack-edge.com/T05BWMWRMEW-U05C9B7RM97-dfbda019031a-512",
    link: "https://www.linkedin.com/in/kaili-cen/",
  },
  {
    name: "Paweł Biegun",
    introduction:
      "Passionate about coding solutions, Paweł's hands-on experience with Python and self-learned skills in JavaScript and Data Science make him an essential problem-solver for our team.",
    avatar:
      "https://ca.slack-edge.com/T05BWMWRMEW-U05HUP4H1QD-f41d294d8b79-512",
    link: "https://www.linkedin.com/in/pawe%C5%82-biegun-8b51b8187/",
  },
];

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
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>KaiKul | Make Weekly Improvements With Your Peer</title>
        <meta
          property="og:title"
          content="KaiKul | Make Weekly Improvements With Your Peer"
        />
        <meta property="og:image" content="/img/kaikul-thumbnail.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthenticatedHeader user={user} />

      {user ? (
        <div className="pt-[80px] px-2 md:px-10 3xl:px-32">
          <WeeklyPlanner user={user} />
        </div>
      ) : (
        <>
          <main className="container flex-1 mx-auto px-3">
            <Hero />

            <Features />

            <HowItWorks />

            <Testimonial testimonials={testimonials} />

            <FAQ faqs={faqs} />

            <CTA />

            <Team clients={clients} />
          </main>
          {/* <div className="flex flex-col space-y-15 mx-auto">
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
          </div> */}
          <footer className="flex flex-col items-center justify-center bg-[#0D0322] py-8">
            <div className="container mx-auto px-4">
              <p className="text-center text-sm text-primary-foreground">
                © {new Date().getFullYear()} KaiKul. All rights reserved.
              </p>
            </div>
            <div className="my-2 flex flex-row space-x-4">
              <a
                href="https://www.linkedin.com/company/kaikul"
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-primary-foreground transition duration-300 ease-in-out hover:text-[#ff5e0e]"
              >
                <Icons.linkedin />
              </a>
              <a
                href="https://twitter.com/KaiKulapp/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-primary-foreground transition duration-300 ease-in-out hover:text-[#ff5e0e]"
              >
                <Icons.twitter />
              </a>
              <a
                href="https://www.instagram.com/kaikulapp/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-primary-foreground transition duration-300 ease-in-out hover:text-[#ff5e0e]"
              >
                <Icons.instagram />
              </a>
              <a
                href="https://www.facebook.com/kaikulapp/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-primary-foreground transition duration-300 ease-in-out hover:text-[#ff5e0e]"
              >
                <Icons.facebook />
              </a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
