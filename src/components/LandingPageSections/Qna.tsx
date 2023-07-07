import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

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
      "1. Sign in to our KaiKul platform to set your goals. 2. Join our Slack community for daily progress sharing. 3. Participate in our weekly meetups (schedule through Eventbrite) to connect with accountability buddies. ",
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
    answer: "Absolutely! ",
  },
];

type Props = {};

function Qna({}: Props) {
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const setAuthModalState = useSetRecoilState(authModalState);

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
      <h3 className="mb-10 text-3xl font-bold text-violet-500">
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
              <p className="mt-4 text-start text-xs md:text-base">
                {question.answer}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="bg-violet-300 w-screen py-5 flex flex-col items-center">
        <div className="text-xl font-bold text-violet-600 mb-5 max-w-5xl">
          Smash My Goals 👇
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <button
            onClick={() => setAuthModalState({ open: true, view: "login" })}
            className="btn hero__btn buttonMobile md:button mt-2 md:mt-3 text-xl md:text-2xl 2xl:mt-5"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Qna;
