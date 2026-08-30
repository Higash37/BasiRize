import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FaCalculator, FaSchool, FaSlidersH, FaEye } from "react-icons/fa";
import type { Level } from "../problem-generation";
import "./FlowStepper.css";

type StepKey = "level" | "options" | "preview";
type StepState = "done" | "current" | "upcoming";

type FlowStepperProps = {
  current: StepKey;
  level?: Level;
  problemType?: { id: string; title: string };
};

function FlowStepper({ current, level, problemType }: FlowStepperProps) {
  // スクロール中は読んでいる内容の邪魔にならないよう、薄く・押せない状態にする
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollArea = document.querySelector(".site-scroll-area");
    if (!scrollArea) {
      return;
    }

    const onScroll = () => setScrolled(scrollArea.scrollTop > 0);
    onScroll();
    scrollArea.addEventListener("scroll", onScroll, { passive: true });

    return () => scrollArea.removeEventListener("scroll", onScroll);
  }, []);

  const steps: {
    key: string;
    icon: ReactNode;
    label: string;
    href?: string;
    state: StepState;
  }[] = [
    {
      key: "subject",
      icon: <FaCalculator aria-hidden="true" />,
      label: "数学",
      href: "/",
      state: "done",
    },
    {
      key: "level",
      icon: <FaSchool aria-hidden="true" />,
      label: level ?? "学年",
      href: level ? `/content-select?level=${level}` : undefined,
      state: level ? (current === "level" ? "current" : "done") : "upcoming",
    },
    {
      key: "options",
      icon: <FaSlidersH aria-hidden="true" />,
      label: "設定",
      href: problemType ? `/problems/${problemType.id}` : undefined,
      state:
        current === "options" ? "current" : current === "preview" ? "done" : "upcoming",
    },
    {
      key: "preview",
      icon: <FaEye aria-hidden="true" />,
      label: "プレビュー",
      href: undefined,
      state: current === "preview" ? "current" : "upcoming",
    },
  ];

  return (
    <nav
      className={
        scrolled ? "flow-stepper flow-stepper-scrolled" : "flow-stepper"
      }
      aria-label="ここまでの選択"
    >
      <ol>
        {steps.map((step) => (
          <li
            key={step.key}
            className={`flow-stepper-step flow-stepper-step-${step.state}`}
          >
            <span className="flow-stepper-icon">{step.icon}</span>
            {step.state === "current" ? (
              <span className="flow-stepper-label" aria-current="step">
                {step.label}
              </span>
            ) : step.href ? (
              <Link to={step.href} className="flow-stepper-label">
                {step.label}
              </Link>
            ) : (
              <span className="flow-stepper-label">{step.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default FlowStepper;
