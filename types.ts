export enum EvaluationState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ModelConfig {
  name: string;
  apiUrl: string;
  apiKey: string;
  isInternalGemini: boolean; // If true, uses the internal Gemini service instead of fetch
}

export interface BenchmarkRow {
  id: string;
  type: 'DSQA' | 'FACTS';
  question: string;
  context?: string; // For FACTS (image description or text context)
  imageUrl?: string; // For FACTS
  groundTruth: string[]; // List of required atomic facts
  domain: string;
}

// Strictly typed response expected from the model (as per prompt templates)
export interface ModelResponseDSQA {
  case_id: string;
  answers: {
    atomic_fact: string;
    confidence: number;
    evidence: string[];
    step_index: number;
  }[];
  chain_of_thought_steps: {
    step_index: number;
    text: string;
    sources: string[];
    confidence: number;
  }[];
  overall_confidence: number;
}

export interface ModelResponseFACTS {
  case_id: string;
  matched_atomic_facts: {
    atomic_fact: string;
    confidence: number;
    image_regions: { x: number; y: number; w: number; h: number }[];
    evidence: string;
  }[];
  contradictions: {
    text: string;
    reason: string;
  }[];
  rubric_score: number;
  overall_confidence: number;
}

export interface EvaluationResult {
  rowId: string;
  type: 'DSQA' | 'FACTS';
  modelOutput: string; // Raw JSON string
  parsedOutput: ModelResponseDSQA | ModelResponseFACTS | null;
  scores: {
    atomicRecall: number;    // % of ground truth facts found
    atomicPrecision: number; // % of provided facts that are correct
    f1Score: number;
    contradictionPenalty: number;
    rubricScore: number;     // 0-1
    chainCompleteness: number; // 0-1 (DSQA only)
  };
  judgeReasoning: string; // Gemini 3 Pro's explanation
  status: 'SUCCESS' | 'FAILURE';
}

export interface AggregateMetrics {
  compositeScore: number; // 0-100
  dsqaScore: number;
  factsScore: number;
  safetyScore: number;
  totalProcessed: number;
  contradictionRate: number;
  failureRate: number;
}
