import type { Flashcard } from "./gh300Deck";
import { getQuestionTopic } from "./studySession";

export type ExamId = "GH-300" | "AI-103";

export interface ExamDomain {
  readonly id: string;
  readonly name: string;
  readonly weight: string;
  readonly topics: readonly string[];
  readonly questionIds?: readonly string[];
}

interface ExamBlueprint {
  readonly measuredAsOf: string;
  readonly domains: readonly ExamDomain[];
}

const examBlueprints: Record<ExamId, ExamBlueprint> = {
  "GH-300": {
    measuredAsOf: "7 August 2026",
    domains: [
      {
        id: "gh300-features",
        name: "Use GitHub Copilot features",
        weight: "25-30%",
        topics: ["T1", "T2", "T6", "T7"],
      },
      {
        id: "gh300-responsibly",
        name: "Use GitHub Copilot responsibly",
        weight: "15-20%",
        topics: [],
        questionIds: [
          "T1Q1",
          "T1Q15",
          "T1Q18",
          "T1Q20",
          "T1Q28",
          "T1Q29",
          "T1Q30",
          "T1Q33",
          "T1Q38",
          "T1Q42",
          "T1Q43",
          "T1Q44",
          "T1Q49",
          "T1Q53",
          "T1Q58",
          "T1Q59",
          "T1Q74",
          "T1Q77",
          "T1Q78",
          "T1Q79",
          "T1Q89",
          "T1Q93",
          "T1Q109",
          "T1Q110",
          "T1Q114",
        ],
      },
      {
        id: "gh300-data-architecture",
        name: "Understand Copilot data and architecture",
        weight: "10-15%",
        topics: ["T4"],
        questionIds: [
          "T1Q6",
          "T1Q23",
          "T1Q47",
          "T1Q51",
          "T1Q56",
          "T1Q57",
          "T1Q70",
          "T1Q82",
          "T1Q87",
          "T1Q88",
          "T1Q91",
          "T1Q99",
          "T1Q106",
          "T1Q118",
        ],
      },
      {
        id: "gh300-prompt-engineering",
        name: "Apply prompt engineering and context crafting",
        weight: "10-15%",
        topics: ["T3"],
        questionIds: [
          "T1Q7",
          "T1Q14",
          "T1Q22",
          "T1Q24",
          "T1Q25",
          "T1Q31",
          "T1Q66",
          "T1Q73",
          "T1Q75",
          "T1Q76",
          "T1Q80",
          "T1Q107",
        ],
      },
      {
        id: "gh300-productivity",
        name: "Improve developer productivity with Copilot",
        weight: "10-15%",
        topics: [],
        questionIds: [
          "T1Q4",
          "T1Q13",
          "T1Q19",
          "T1Q21",
          "T1Q27",
          "T1Q32",
          "T1Q40",
          "T1Q41",
          "T1Q48",
          "T1Q55",
          "T1Q61",
          "T1Q63",
          "T1Q65",
          "T1Q81",
          "T1Q90",
          "T1Q94",
          "T1Q96",
          "T1Q98",
          "T1Q102",
          "T1Q105",
          "T1Q115",
          "T1Q116",
          "T1Q117",
        ],
      },
      {
        id: "gh300-privacy",
        name: "Configure privacy, content exclusions and safeguards",
        weight: "10-15%",
        topics: ["T5"],
        questionIds: [
          "T1Q5",
          "T1Q8",
          "T1Q10",
          "T1Q11",
          "T1Q16",
          "T1Q17",
          "T1Q35",
          "T1Q45",
          "T1Q46",
          "T1Q50",
          "T1Q67",
          "T1Q68",
          "T1Q69",
          "T1Q71",
          "T1Q72",
          "T1Q84",
          "T1Q85",
          "T1Q92",
          "T1Q100",
          "T1Q108",
          "T1Q111",
        ],
      },
    ],
  },
  "AI-103": {
    measuredAsOf: "16 April 2026",
    domains: [
      {
        id: "ai103-generative-ai",
        name: "Implement generative AI and agentic solutions",
        weight: "30-35%",
        topics: ["A2"],
      },
      {
        id: "ai103-plan-manage",
        name: "Plan and manage an Azure AI solution",
        weight: "25-30%",
        topics: ["A1"],
      },
      {
        id: "ai103-computer-vision",
        name: "Implement computer vision solutions",
        weight: "10-15%",
        topics: ["A3"],
      },
      {
        id: "ai103-text-analysis",
        name: "Implement text analysis solutions",
        weight: "10-15%",
        topics: ["A4"],
      },
      {
        id: "ai103-information-extraction",
        name: "Implement information extraction solutions",
        weight: "10-15%",
        topics: ["A5"],
      },
    ],
  },
};

export function getExamBlueprint(examId: ExamId): ExamBlueprint {
  return examBlueprints[examId];
}

export function cardBelongsToDomain(
  card: Flashcard,
  domain: ExamDomain,
): boolean {
  const questionId = card.question.match(/^([TA]\d+Q\d+)\./)?.[1];
  if (questionId !== undefined) {
    const explicitlyMappedDomains =
      examBlueprints[card.subject as ExamId]?.domains.filter((candidate) =>
        candidate.questionIds?.includes(questionId),
      ) ?? [];
    if (explicitlyMappedDomains.length > 0) {
      return explicitlyMappedDomains.some(
        (candidate) => candidate.id === domain.id,
      );
    }
  }

  const topic = getQuestionTopic(card);
  return topic !== undefined && domain.topics.includes(topic);
}
