import type { Flashcard } from './gh300Deck';
import { getQuestionTopic } from './studySession';

export type ExamId = 'GH-300' | 'AI-103';

export interface ExamDomain {
  readonly id: string;
  readonly name: string;
  readonly weight: string;
  readonly topics: readonly string[];
}

interface ExamBlueprint {
  readonly measuredAsOf: string;
  readonly domains: readonly ExamDomain[];
}

const examBlueprints: Record<ExamId, ExamBlueprint> = {
  'GH-300': {
    measuredAsOf: '7 August 2026',
    domains: [
      { id: 'gh300-features', name: 'Use GitHub Copilot features', weight: '25-30%', topics: ['T1', 'T2', 'T6', 'T7'] },
      { id: 'gh300-responsibly', name: 'Use GitHub Copilot responsibly', weight: '15-20%', topics: ['T1'] },
      { id: 'gh300-data-architecture', name: 'Understand Copilot data and architecture', weight: '10-15%', topics: ['T4'] },
      { id: 'gh300-prompt-engineering', name: 'Apply prompt engineering and context crafting', weight: '10-15%', topics: ['T3'] },
      { id: 'gh300-productivity', name: 'Improve developer productivity with Copilot', weight: '10-15%', topics: ['T1'] },
      { id: 'gh300-privacy', name: 'Configure privacy, content exclusions and safeguards', weight: '10-15%', topics: ['T5'] },
    ],
  },
  'AI-103': {
    measuredAsOf: '16 April 2026',
    domains: [
      { id: 'ai103-generative-ai', name: 'Implement generative AI and agentic solutions', weight: '30-35%', topics: ['A2'] },
      { id: 'ai103-plan-manage', name: 'Plan and manage an Azure AI solution', weight: '25-30%', topics: ['A1'] },
      { id: 'ai103-computer-vision', name: 'Implement computer vision solutions', weight: '10-15%', topics: ['A3'] },
      { id: 'ai103-text-analysis', name: 'Implement text analysis solutions', weight: '10-15%', topics: ['A4'] },
      { id: 'ai103-information-extraction', name: 'Implement information extraction solutions', weight: '10-15%', topics: ['A5'] },
    ],
  },
};

export function getExamBlueprint(examId: ExamId): ExamBlueprint {
  return examBlueprints[examId];
}

export function cardBelongsToDomain(card: Flashcard, domain: ExamDomain): boolean {
  const topic = getQuestionTopic(card);
  return topic !== undefined && domain.topics.includes(topic);
}