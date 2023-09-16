import { Testimonial } from "@/components/landing-page/testimonial";
import { Features } from "@/components/landing-page/features";
import { FAQ } from "@/components/landing-page/faq";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { Team } from "@/components/landing-page/team";
import { Hero } from "@/components/landing-page/hero";
import { CTA } from "@/components/landing-page/cta";
import { Icons } from "@/components/icons";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import AuthenticatedHeader from "@/components/Header/AuthenticatedHeader";
import LoadingScreen from "@/components/LoadingScreen";
import { Benefits } from "@/components/landing-page/benefits";
import { WhatIsAP } from "@/components/landing-page/what-is-ap";
import MePage from "@/components/App/Me/MePage";
import { createClient } from "contentful";
import { Theme } from "@/components/App/Me/SelfDiscoveryTab/ThemeOfTheWeekCard";

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
      "KaiKul is designed for anyone looking to improve themselves in meaningful ways. To start: Go to our ",
    link: "https://www.canva.com/design/DAFuQHGqA1Y/rIa9fyabkD0dnyBQh4ynKg/view",
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
      "We update weekly based on users' feedback, reach out and tell us what you need! ",
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
      "A self-taught web developer with 2 years experience, Kaili passionately channels her commitment to personal growth into our mission, using technology to drive change.",
    avatar:
      "https://ca.slack-edge.com/T05BWMWRMEW-U05C9B7RM97-dfbda019031a-512",
    link: "https://www.linkedin.com/in/kaili-cen/",
  },
  {
    name: "Arnold Mutasa",
    introduction:
      "A software engineer with over 5 years experience, Arnold is a lifelong learner with experience working with startup companies in different parts of the world.",
    avatar:
      "https://media.licdn.com/dms/image/D4D03AQHNx_wQaXD0lQ/profile-displayphoto-shrink_800_800/0/1693022114899?e=1698883200&v=beta&t=JBqkH5RKClMcJoz1ZAYgqaJU4oYb3ryBAZFqT3u44H8",
    link: "https://www.linkedin.com/in/arniemutasa/",
  },
  {
    name: "Hatem Soliman",
    introduction:
      "As a driven innovator with a strong background in frontend engineering, digital marketing, and the startup ecosystem, Hatem's dedication fuels innovation, exploring uncharted territories.",
    avatar:
      "https://media.licdn.com/dms/image/D4D03AQFGeRgEkyu02A/profile-displayphoto-shrink_400_400/0/1667156953614?e=1700092800&v=beta&t=A2iu9hyz3XLpgXMi3iQVaXwU41g29zGwS-o07TiS5-g",
    link: "https://www.linkedin.com/in/h4temsoliman/",
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

type Props = {
  posts: Theme[];
};

export default function Home({ posts }: Props) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>KaiKul | Where Ownership Meets Purpose</title>
        <meta
          property="og:title"
          content="KaiKul | Where Ownership Meets Purpose"
        />
        <meta property="og:image" content="/img/kaikul-thumbnail.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthenticatedHeader user={user} />

      {user ? (
        <div className="pt-[80px] container mx-auto">
          <MePage user={user} posts={posts} />
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

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY!,
  });

  const res = await client.getEntries({
    content_type: "theme",
    order: ["-fields.date"], // This orders the results in descending order based on the date field
  });

  return {
    props: {
      posts: res.items, // The most recent post
    },
    revalidate: 1,
  };
}
