"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is an IoT community garden?",
    answer: "An IoT community garden uses smart technology like sensors and automated irrigation to monitor and manage plant growth in real-time.",
    value: "item-1",
  },
  {
    question: "How does your IoT system benefit community gardeners?",
    answer:
      "Our system allows you to remotely monitor plant health and optimize watering schedules with ease.",
    value: "item-2",
  },
  {
    question:
      "What kind of technology do you use?",
    answer:
      "We utilize BeagleBone Black Wireless (BBBW) devices integrated with advanced sensors and automated irrigation systems for efficient garden management.",
    value: "item-3",
  },
  {
    question: "Is the system easy to use?",
    answer: "Yes, our system is designed for intuitive use, especially for those without technical expertise.",
    value: "item-4",
  },
  {
    question:
      "How does your company support sustainability?",
    answer:
      "We empower community gardeners to increase local produce through efficient gardening practices, contributing to Singapore's '30 by 30' goal for sustainable food production.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
