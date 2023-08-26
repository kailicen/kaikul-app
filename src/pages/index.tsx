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
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import { useColorMode } from "@chakra-ui/react";
import WeeklyPlanner from "@/components/App/Tracker/WeeklyPlanner";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { Benefits } from "@/components/landing-page/benefits";
import { WhatIsAP } from "@/components/landing-page/what-is-ap";

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
    question: "Who is KaiKul for and how do I get started?",
    answer:
      "KaiKul is designed for anyone looking to improve themselves in meaningful ways. Whether you're aiming to meditate, read more, or prioritize tasks, our community and resources are here for you. To start: 1. Sign in and set your goals. 2. Share your daily sprint with our community. 3. Find an accountability partner and join our weekly meetups using the KaiKul framework.",
  },
  {
    id: 2,
    question: "Is using KaiKul time-consuming?",
    answer:
      "No, KaiKul simplifies the process of setting goals and tasks. Our intuitive platform is designed to streamline goal-setting, so you can focus on achieving them without spending excessive time on preparations.",
  },
  {
    id: 3,
    question: "How does KaiKul handle data privacy?",
    answer:
      "Your privacy is paramount. Your data remains private and is only accessible to you. We employ strict measures to safeguard your data and won't share it with third parties without your consent.",
  },
  {
    id: 4,
    question: "How is KaiKul evolving and improving?",
    answer:
      "We're deeply committed to enhancing KaiKul based on user feedback. Expect continuous improvements, bug fixes, and the introduction of new features over time. For direct engagement and updates, we encourage our community to join the #feedback channel in our Slack community. It's a great place to share suggestions, stay informed, and connect with the KaiKul team.",
  },
  {
    id: 5,
    question: "Is KaiKul free to use?",
    answer:
      "Yes, KaiKul is currently free. As we roll out more features, we'll introduce a freemium model, ensuring valuable free access remains available alongside premium options.",
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

const benefits = [
  {
    title: "Clear Goal Alignment",
    content:
      "Place your goals front and center. Seamlessly link daily tasks to larger objectives, propelling you closer to success.",
    image: "goal-alignment",
  },
  {
    title: "Enhance Motivation",
    content:
      "Turn daily thoughts into motivation and growth. Monitor and celebrate your progress.",
    image: "enhance-motivation",
  },
  {
    title: "Purposeful & Collaborative Strategy",
    content:
      "Shape your life's path and find deeper satisfaction at each milestone. With 'buddyup', plan your week, tackle challenges, and grab opportunities together.",
    image: "collaborative-strategy",
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
        <title>
          KaiKul | Reflective Goal Tracking And Accountability, Simplified!
        </title>
        <meta
          property="og:title"
          content="KaiKul | Reflective Goal Tracking And Accountability, Simplified!"
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

            <WhatIsAP />

            <HowItWorks />

            <Benefits benefits={benefits} />

            <Features />

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
