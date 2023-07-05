import React, { useState } from "react";

const testimonials = [
  {
    name: "Nadia Firsova",
    role: "IT Project Manager",
    keyword: "Goal Tracking",
    testimonial:
      "It's a great platform and community where I can set my goal and reflect for what I like to achieve.",
  },
  {
    name: "Mohamad Shehimi",
    role: "Co-Founder of SWLancer",
    keyword: "Refreshing, Similar Goals & Mindset",
    testimonial:
      "It's very refreshing to see such ideas come to life. KaiKul is unique and one of a kind. It truly helps to have someone with similar goals and mindset to buddy with and share progress. KaiKul helps tremendously with that. ",
  },
  {
    name: "Ezra Valentine",
    role: "YouTube Content Creator",
    keyword: "Power of Environment & Community",
    testimonial:
      "One of the most important things to think about when taking control of your own personal development, health or whatever it may be, is your environment. Having a group of like-minded individuals around you, people who are driven to succeed and reach their goals, will inherently make you want to also reach your own goals alongside them. A lot of people tend to under-value the impact a good group or partner can have. \nSo I strongly recommend trying anything like this, which can pair you with individuals/groups of people who are also on the same path in life.",
  },
  {
    name: "Natasha Sachatheva",
    role: "Integrated Communications Strategist",
    keyword: "Connectivity within Oneself and Others",
    testimonial:
      "Life can pass us by and work becomes our priory, so often that we forget what's important. A platform like this allows for deeper connectivity within one self and with like minded people.",
  },
  {
    name: "Haiyang (Ocean) Zou",
    role: "Full-stack Developer",
    keyword: "Self Reflection Meets Group Reflection",
    testimonial:
      "It is a really useful platform. Short weekly meetings help me to rethink what I did in this week, set goals next week and gain knowledge about how to cultivate my mindset and advance my career. You will feel you are not alone, you are in a group.",
  },
  {
    name: "Cerena Ip",
    role: "Co-Founder@Y YOGA, 'US' on Spotify+, and HKUST Business School",
    keyword: "Not Alone",
    testimonial:
      "In our pursuits, we find solace in the company of like-minded individuals, drawing inspiration from the collective energy of the group, even as our dreams may vary.",
  },
  {
    name: "Elle Chen",
    role: "Entrepreneur, and student",
    keyword: "Genuine Care",
    testimonial:
      "I’ve been doing group meetings with Kaili once a week for a month now, this is a perfect opportunity to meet different people and gain different perspectives both at large and periodically at your own life, additionally, we not only report and reflect our weekly events, there’s an atmosphere of genuine care which is helpful not only professionally or productively. I cannot wait to see how Kaikul will turn out, and kudos to Kaili, for once this is done I’m sure it will help lots of people.",
  },
  {
    name: "Christina Wu",
    role: "Data Analyst",
    keyword: "Fresh Insights",
    testimonial:
      "We all need a little encouragement from time to time. At Kaikul, you'll receive unwavering support, constructive feedback, and uplifting messages from your peers. What's more, You can exchange ideas, and learn from other's experiences. You're constantly exposed to fresh insights and innovative approaches, making your journey even more enriching.",
  },
];

type Props = {};

function Testimonial({}: Props) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const navigateToTestimonial = (index: any) => {
    setCurrentTestimonial(index);
  };

  const navigateToPrevious = () => {
    setCurrentTestimonial((prev) =>
      prev > 0 ? prev - 1 : testimonials.length - 1
    );
  };

  const navigateToNext = () => {
    setCurrentTestimonial((prev) =>
      prev < testimonials.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div
      className="min-h-[50vh] w-screen md:w-auto flex flex-col text-center py-20
    px-3 md:px-32 mx-auto items-center justify-center 
    bg-cover bg-center bg-fixed md:bg-[url('/img/bg3.jpg')] bg-violet-200"
    >
      {/* <h3 className="mb-10 text-3xl font-bold text-violet-900">Testimonial</h3> */}
      <div
        className="relative max-w-[800px] min-h-[400px] rounded-lg flex flex-col items-center justify-center
        bg-violet-50 shadow-md px-14 py-8 m-2"
      >
        <div className="text-lg md:text-2xl mb-8 text-violet-500 font-semibold">
          &ldquo;{testimonials[currentTestimonial].keyword}&rdquo;
        </div>
        <div className="font-serif lg:text-xl mb-8 text-black">
          &ldquo;{testimonials[currentTestimonial].testimonial}&rdquo;
        </div>
        <div className="text-sm lg:text-base font-semibold text-black">
          {testimonials[currentTestimonial].name}
        </div>
        <div className="text-sm lg:text-base text-black">
          {testimonials[currentTestimonial].role}
        </div>
        <div className="absolute top-0 left-0 flex items-center h-full text-violet-800">
          <button
            className="p-2 rounded-full hover:bg-violet-300 transition-colors duration-300"
            onClick={navigateToPrevious}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <div className="absolute top-0 right-0 flex items-center h-full text-violet-800">
          <button
            className="p-2 rounded-full hover:bg-violet-300 transition-colors duration-300"
            onClick={navigateToNext}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 mx-2 rounded-full cursor-pointer ${
              index === currentTestimonial ? "bg-violet-900" : "bg-gray-500"
            }`}
            onClick={() => navigateToTestimonial(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Testimonial;
