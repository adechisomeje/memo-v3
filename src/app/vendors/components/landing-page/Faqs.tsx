"use client";

import React, { useState, useEffect } from "react";

const faqData = [
  {
    id: 0,
    question:
      "If my business is already on a different platform can I still partner with Memo?",
    answer:
      "Yes, you can still partner with Memo even if your business is on another platform. ",
  },
  {
    id: 1,
    question: "What is the payout plan for vendors?",
    answer:
      "Payouts are made the same day to vendors for immediate handling of the order, excluding Memo's commission rate. ",
  },
  {
    id: 2,
    question: "How do I sign-up as a vendor on Memo?",
    answer:
      "Signing up as a vendor on Memo is simple. Visit our vendor portal, complete the registration form with your business details, upload required documentation, and our team will review your application.",
  },
  {
    id: 3,
    question:
      "If my business is already on a different platform can I still partner with Memo?",
    answer:
      "Absolutely! Memo supports multi-platform businesses. Our system is designed to integrate with your existing operations.",
  },
];

const Faqs = () => {
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [currentAnswer, setCurrentAnswer] = useState(
    faqData[activeQuestion].answer
  );
  const [isSliding, setIsSliding] = useState(false);

  const handleQuestionChange = (id: number) => {
    if (id === activeQuestion) return;

    setIsSliding(true);

    setTimeout(() => {
      setActiveQuestion(id);
      setCurrentAnswer(faqData[id].answer);

      setTimeout(() => {
        setIsSliding(false);
      }, 50);
    }, 300);
  };

  return (
    <section className="w-[90%] mx-auto max-w-[1159px] pb-[150px] flex flex-col gap-[38px]">
      <h6 className="text-[40px] leading-[54.56px] font-bold text-accent-primary">
        FAQs.
      </h6>
      <div className="flex gap-[76px] justify-between">
        <div className="flex flex-col gap-4 w-1/2">
          {faqData.map((faq) => (
            <button
              key={faq.id}
              className={`text-[24px] text-left px-6 leading-[32.74px] font-medium text-accent-10 h-[120px] rounded-[15px] border border-SEC-95 transition-all duration-300 ${
                activeQuestion === faq.id
                  ? "bg-SEC-Main"
                  : "bg-SEC-99 hover:bg-SEC-95"
              }`}
              onClick={() => handleQuestionChange(faq.id)}
            >
              {faq.question}
            </button>
          ))}
        </div>
        <div className="rounded-[15px] bg-[#FFF6E4] p-6 min-h-[547px] h-full pt-[90px] w-[45%] flex items-start justify-center overflow-hidden relative">
          <p
            className={`text-[24px] text-left leading-[32.74px] w-[90%] font-medium text-accent-10 absolute transition-transform duration-300 ${
              isSliding
                ? "translate-x-[100%] opacity-0"
                : "translate-x-[0] opacity-100"
            }`}
          >
            {currentAnswer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
