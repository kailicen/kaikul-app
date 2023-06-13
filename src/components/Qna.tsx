import Link from "next/link";
import React, { useState } from "react";
import va from "@vercel/analytics";

const questions = [
  {
    id: 1,
    question: "Who is KaiKul for?",
    answer:
      "KaiKul is for anyone who wants to constantly improve themselves in practical and impactful ways. Whether you aim to meditate regularly, read more, improve productivity, prioritize effectively, or make healthier choices, KaiKul provides the community, resources, and accountability to help you achieve real, meaningful results.",
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
      "Initiate a 15-20 minute onboarding call with our team by clicking the 'Schedule with Boom/Kaili' button on our homepage. During the call, we will provide you with detailed information about the onboarding process and discuss the range of benefits we offer. ",
  },
  {
    id: 4,
    question: "How do we match KaiKul buddies?",
    answer:
      "You choose your own buddy on our timetable based on your convenience! ",
  },
  {
    id: 5,
    question: "Is KaiKul free?",
    answer:
      "Absolutely! But act fast, as we have a limited beta program with only 100 spots available until June 2023. ",
  },
];

type Props = {};

function Qna({}: Props) {
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const handleQuestionClick = (questionId: any) => {
    setExpandedQuestionId(
      questionId === expandedQuestionId ? null : questionId
    );
  };

  return (
    <div
      className="min-h-[50vh] w-screen md:w-auto flex flex-col text-center
    max-w-7xl py-20 px-3 md:px-32 mx-auto items-center justify-center"
    >
      <h3 className="mb-10 text-3xl font-bold text-violet-800">
        Frequently Asked Questions
      </h3>
      <div className="space-y-4 w-full px-3 md:w-[80%] lg:w-[60%] mb-10">
        {questions.map((question) => (
          <div
            key={question.id}
            className="border-2 border-gray-300 rounded px-7 py-4"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleQuestionClick(question.id)}
            >
              <h2 className="text-base md:text-lg font-medium">
                {question.question}
              </h2>
              <svg
                className={`w-6 h-6 transition-transform ${
                  question.id === expandedQuestionId ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {question.id === expandedQuestionId && (
              <p className="mt-4 text-gray-600 text-start text-xs md:text-base">
                {question.answer}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="bg-violet-200 w-screen py-5 flex flex-col items-center">
        <div className="text-xl font-bold text-violet-800 mb-5">
          Don&apos;t hesitate - Schedule an onboarding call with us at no cost!
          🎉🔥
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <button className="buttonMobile md:button mt-2 md:mt-3 text-md md:text-xl 2xl:mt-5">
            <Link
              href="https://app.reclaim.ai/m/setthawut-kul/flexible-quick-meeting"
              target="_blank"
              onClick={() => va.track("qnaJoinBoom")}
            >
              Schedule with Boom
            </Link>
          </button>
          <button className="buttonMobile md:button mt-2 md:mt-3 text-md md:text-xl 2xl:mt-5">
            <Link
              href="https://app.reclaim.ai/m/kaili-cen/flexible-quick-meeting"
              target="_blank"
              onClick={() => va.track("qnaJoinKaili")}
            >
              Schedule with Kaili
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Qna;
