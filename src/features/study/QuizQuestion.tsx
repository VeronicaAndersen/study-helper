import { Check, X } from "lucide-react";
import type { Flashcard } from "./gh300Deck";
import { isAnswerCorrect } from "./studySession";

interface QuizQuestionProps {
  readonly card: Flashcard;
  readonly choices: readonly string[];
  readonly selections: readonly string[];
  readonly submitted: boolean;
  readonly onSelectChoice: (choice: string) => void;
  readonly onSubmit: () => void;
}

export function QuizQuestion({
  card,
  choices,
  selections,
  submitted,
  onSelectChoice,
  onSubmit,
}: QuizQuestionProps) {
  const answerCorrect = isAnswerCorrect(card, selections);
  const hasIncorrectChoice = selections.some(
    (choice) => !card.answers.includes(choice),
  );
  const feedbackTone = answerCorrect
    ? "border-[#34c759] bg-[#e9f8ee] text-success"
    : hasIncorrectChoice || card.answers.length === 1
      ? "border-coral bg-[#fff0ef] text-[#d70015]"
      : "border-[#d2d2d7] bg-[#f5f5f7] text-[#6e6e73]";

  return (
    <div className="flex flex-1 flex-col">
      <h3 className="mb-4 mt-6 text-[23px] font-semibold leading-[1.45] tracking-[-.5px] max-[720px]:text-[20px]">
        {card.question}
      </h3>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[13px] text-muted">
        <span>
          {card.answers.length > 1
            ? "Select all that apply"
            : "Select one answer"}
        </span>
        {card.answers.length > 1 && (
          <span className="rounded-full bg-[#e8e8ed] px-2.5 py-1 font-mono text-[12px]">
            {selections.length} selected
          </span>
        )}
      </div>
      <div
        className="grid grid-cols-1 gap-2.5"
        role="group"
        aria-label="Answer choices"
      >
        {choices.map((choice, index) => {
          const isSelected = selections.includes(choice);
          const isCorrectChoice = card.answers.includes(choice);
          const choiceClass = !submitted
            ? isSelected
              ? "border-[#0071e3] bg-[#f5f5f7] hover:bg-[#f5f5f7]"
              : ""
            : isSelected
              ? isCorrectChoice
                ? "border-[#a6e3b4] bg-[#e9f8ee] text-success hover:border-[#a6e3b4] hover:bg-[#e9f8ee]"
                : "border-[#ffc1bd] bg-[#fff0ef] text-[#d70015] hover:border-[#ffc1bd] hover:bg-[#fff0ef]"
              : isCorrectChoice
                ? "border-[#a6e3b4] bg-[#e9f8ee] text-success hover:border-[#a6e3b4] hover:bg-[#e9f8ee]"
                : "";
          const letterClass = !submitted
            ? isSelected
              ? "border-[#6e6e73] bg-[#6e6e73] text-white"
              : ""
            : isCorrectChoice
              ? "border-[#34c759] bg-[#34c759] text-white"
              : isSelected
                ? "border-coral bg-coral text-white"
                : "";
          return (
            <button
              className={`answer-choice cursor-pointer pr-10 transition-[border-color,background] duration-[160ms] hover:border-[#0071e3] hover:bg-[#f5f5f7] disabled:cursor-default ${choiceClass}`}
              key={choice}
              onClick={() => onSelectChoice(choice)}
              disabled={submitted}
              aria-pressed={isSelected}
            >
              <span className={`choice-letter ${letterClass}`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span>{choice}</span>
              {submitted && isCorrectChoice && (
                <Check className="absolute right-[10px]" size={14} />
              )}
              {submitted && isSelected && !isCorrectChoice && (
                <X className="absolute right-[10px]" size={14} />
              )}
            </button>
          );
        })}
      </div>
      {card.answers.length > 1 && !submitted && (
        <button
          className="primary-action mt-4 w-fit max-[720px]:w-full"
          type="button"
          disabled={selections.length === 0}
          onClick={onSubmit}
        >
          Check answer
        </button>
      )}
      {submitted && (
        <div
          className={`mt-4 flex flex-col gap-2 rounded-2xl border-l-2 px-4 py-3 text-[15px] leading-relaxed ${feedbackTone}`}
          aria-live="polite"
        >
          <strong className="font-semibold">
            {answerCorrect ? "Correct" : "Not quite"}
          </strong>
          {!answerCorrect && (
            <span>Correct answer: {card.answers.join(", ")}</span>
          )}
          {card.explanation && (
            <span className="text-[#6e6e73]">{card.explanation}</span>
          )}
        </div>
      )}
    </div>
  );
}
