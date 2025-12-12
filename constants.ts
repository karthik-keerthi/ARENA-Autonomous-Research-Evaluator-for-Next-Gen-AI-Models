import { BenchmarkRow } from "./types";

export const DSQA_PROMPT_TEMPLATE = `You are a research agent. Return ONLY valid JSON:
{
 'case_id':'{{CASE_ID}}',
 'answers':[{'atomic_fact':'','confidence':0-1,'evidence':['...'],'step_index':1}],
 'chain_of_thought_steps':[{'step_index':1,'text':'','sources':[''], 'confidence':0-1}],
 'overall_confidence':0-1
}
No text outside JSON.

Question: {{QUESTION}}`;

export const FACTS_PROMPT_TEMPLATE = `You are a multimodal fact-checker. Return ONLY valid JSON:
{
 'case_id':'{{CASE_ID}}',
 'matched_atomic_facts':[{'atomic_fact':'','confidence':0-1,'image_regions':[{'x':0,'y':0,'w':0,'h':0}], 'evidence':''}],
 'contradictions':[{'text':'','reason':''}],
 'rubric_score':0-1,
 'overall_confidence':0-1
}
No extra text outside JSON.

Task: Evaluate the provided image/context against known facts.
Context: {{CONTEXT}}`;

// MOCK DATA for DeepSearchQA (DSQA-full.csv)
export const MOCK_DSQA_DATA: BenchmarkRow[] = [
  {
    id: "DSQA-001",
    type: "DSQA",
    domain: "Physics",
    question: "Explain the causal chain leading to the collapse of the Tacoma Narrows Bridge, focusing on aeroelastic flutter.",
    groundTruth: ["Wind induced oscillation", "Aeroelastic flutter caused energy accumulation", "Torsional vibration mode matched wind frequency", "Mechanical failure of suspension cables"],
  },
  {
    id: "DSQA-002",
    type: "DSQA",
    domain: "History",
    question: "Trace the economic impact of the Black Death on serfdom in Western Europe.",
    groundTruth: ["Drastic population reduction", "Labor shortage increased wages", "Landowners lost bargaining power", "Accelerated end of serfdom"],
  },
  {
    id: "DSQA-003",
    type: "DSQA",
    domain: "Medicine",
    question: "What is the mechanism by which mRNA vaccines induce immunity against SARS-CoV-2?",
    groundTruth: ["Lipid nanoparticle delivery", "Cellular uptake of mRNA", "Translation of spike protein", "Immune recognition of spike protein", "Antibody production"],
  },
  {
    id: "DSQA-004",
    type: "DSQA",
    domain: "Economics",
    question: "Analyze the relationship between interest rate hikes and inflation reduction.",
    groundTruth: ["Higher borrowing costs", "Reduced consumer spending", "Lower business investment", "Decreased demand lowers prices"],
  },
  {
    id: "DSQA-005",
    type: "DSQA",
    domain: "Computer Science",
    question: "How does the Transformer architecture solve the vanishing gradient problem in RNNs?",
    groundTruth: ["Self-attention mechanism", "Parallel processing", "Residual connections", "Layer normalization"],
  }
];

// MOCK DATA for FACTS Multimodal (facts_multimodal_public.csv)
// Using picsum images for the demo
export const MOCK_FACTS_DATA: BenchmarkRow[] = [
  {
    id: "FACTS-001",
    type: "FACTS",
    domain: "Geography",
    imageUrl: "https://picsum.photos/id/10/800/600", // Forest/Nature
    context: "An image showing a dense forest with a river flowing through it.",
    question: "Identify the biome and potential ecological features.",
    groundTruth: ["Temperate deciduous forest", "Riparian zone presence", "High biodiversity potential"],
  },
  {
    id: "FACTS-002",
    type: "FACTS",
    domain: "Technology",
    imageUrl: "https://picsum.photos/id/0/800/600", // Laptop
    context: "A workspace with a laptop and coffee.",
    question: "Describe the objects and their typical usage context.",
    groundTruth: ["Portable computer", "Office or remote work setting", "Beverage for consumption"],
  },
  {
    id: "FACTS-003",
    type: "FACTS",
    domain: "Architecture",
    imageUrl: "https://picsum.photos/id/122/800/600", // City structures
    context: "A view of modern city architecture at night.",
    question: "Analyze the structural style and lighting.",
    groundTruth: ["Urban skyline", "Artificial illumination", "High-rise construction"],
  }
];

export const ALL_BENCHMARKS = [...MOCK_DSQA_DATA, ...MOCK_FACTS_DATA];
