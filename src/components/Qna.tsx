import React, { useState } from "react";

const questions = [
  {
    id: 1,
    question: "Who is KaiKul for?",
    answer:
      "KaiKul is for anyone who wants to constantly improve themselves in a REAL, result-driven manner. ",
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
      "Click the 'Get Started' button to initiate a 15 to 20-minute onboarding call with our team. During this call, we will delve deeper into your motivations and better explain the range of benefits we can offer you. ",
  },
  {
    id: 4,
    question: "How do we match KaiKul buddies?",
    answer:
      "We match your self-help domains and partner preferences that you have provided us. Additionally, we consider your LinkedIn profile and availability during the matching process. ",
  },
  {
    id: 5,
    question: "Is KaiKul free?",
    answer:
      "Yes! By joining our beta, you are helping us shape our app. We are committed to providing the best possible service for our users, and your feedback and participation play a crucial role in achieving that goal. Thank you for being a part of our journey! ",
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
      <div className="space-y-4 w-full md:w-[80%] lg:w-[60%]">
        {questions.map((question) => (
          <div
            key={question.id}
            className="border-2 border-gray-300 rounded px-7 py-4"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleQuestionClick(question.id)}
            >
              <h2 className="text-lg font-medium">{question.question}</h2>
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
              <p className="mt-4 text-gray-600 text-start">{question.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Qna;
