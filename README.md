# 📘 **ARENA — Autonomous Research Evaluator for Next-Gen AI Models**

### *A Gemini 3 Pro–powered platform for automated reasoning, factuality, and multimodal evaluation of any AI model.*
<img width="1094" height="871" alt="image" src="https://github.com/user-attachments/assets/83ed64a8-ba6d-43f3-9275-f907de47e888" />

---

## 🚀 **Overview**

**ARENA** is an intelligent evaluation platform built with **Gemini 3 Pro** inside **Google AI Studio**.
It automatically tests any AI model using two of the most rigorous research benchmarks released by **Google DeepMind**:

* **DeepSearchQA** → Multi-step reasoning & causal chain evaluation
* **FACTS Multimodal** → Image-grounded factual accuracy using atomic facts

ARENA performs end-to-end analysis:
✔ Sends optimized prompts to your model
✔ Validates reasoning chain outputs
✔ Scores factual accuracy
✔ Detects contradictions
✔ Measures multimodal grounding quality
✔ Generates a polished **PDF Research Report**

This makes ARENA a **research-grade, transparent, repeatable evaluation system** for next-gen AI models.

---

## 🧠 **Key Features**

### 🔹 **1. Plug-and-Play Model Evaluation**

Connect any model API (OpenAI, Claude, Gemini, Ollama, custom servers).

### 🔹 **2. DeepMind Datasets Built-In**

* **DeepSearchQA (DSQA)** → 900+ causal-chain reasoning tasks
* **FACTS Multimodal** → Atomic fact–based multimodal accuracy

### 🔹 **3. Gemini-Powered Analysis**

ARENA uses **Gemini 3 Pro** for:

* Output scoring
* Atomic fact matching
* Failure mode detection
* JSON validation
* PDF report generation

### 🔹 **4. Research Dashboard**

Interactive dashboard shows:

* Reasoning depth scores
* Multimodal factuality metrics
* Contradiction heatmaps
* Completeness analysis
* Per-benchmark accuracy

### 🔹 **5. One-Click PDF Report**

Export full evaluation results into a polished PDF containing:

* Visual charts
* Scores
* Failure breakdowns
* Fine-tuning suggestions

---

## 🏗️ **Tech Stack**

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | React (TypeScript), TSX Components            |
| Backend  | Gemini 3 Pro API (via Google AI Studio)       |
| Services | Custom evaluation logic in `geminiService.ts` |
| Visuals  | Dashboard + D3/Charts                         |
| Reports  | PDFReport.tsx(auto-generated PDF)             |

---

## 📁 **Project Structure**

```
arena/
│
├── App.tsx
├── index.tsx
├── index.html
├── constants.ts
├── metadata.json
├── types.ts
│
├── components/
│   ├── Dashboard.tsx
│   └── PDFReport.tsx
│
├── services/
│   └── geminiService.ts
│
└── public/
    └── assets/
```

**Highlights:**

* `Dashboard.tsx` → Visualization of evaluation metrics
* `PDFReport.tsx` → Generates polished research reports
* `geminiService.ts` → Core pipeline: prompt → model → scoring

---

## 📦 **Installation**

### **1. Clone the repository**

```bash
git clone https://github.com/karthik-keerthi/ARENA-Autonomous-Research-Evaluator-for-Next-Gen-AI-Models.git
cd ARENA
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Add your Gemini API key**

Create a `.env` file:

```env
VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
```

### **4. Start the development server**

```bash
npm run dev
```

---

## 🔌 **Connecting Your Model**

ARENA supports any model with an accessible API endpoint.

In the UI:

1. Paste your model’s endpoint URL
2. Paste your API key (if needed)
3. Choose model type (Text, Vision, Multimodal)
4. Click **Connect**
5. Press **Run Evaluation**

ARENA will begin running DSQA + FACTS tests automatically.

---

## 📊 **Evaluation Pipeline**

ARENA performs:

1. **Prompt generation** for DSQA & FACTS
2. **Model output validation** (JSON schema)
3. **Atomic fact matching** (FACTS Multimodal)
4. **Reasoning chain scoring** (DSQA)
5. **Contradiction detection**
6. **Metric aggregation**
7. **Dashboard visualization**
8. **PDF Report generation**

---

## 📄 **PDF Research Report (Auto-Generated)**

Your report includes:

* Summary metrics
* DeepSearchQA reasoning score
* FACTS multimodal factuality score
* Completeness vs. Contradictions
* Qualitative error examples
* Recommendations for fine-tuning

This report is ideal for:
📌 Research teams
📌 Model developers
📌 Academic publications
📌 Model comparison

---

## 🔬 **Benchmarks Used**

### **🧩 DeepSearchQA**
[https://www.kaggle.com/datasets/deepmind/deepsearchqa](url)
Released by **Google DeepMind**, hosted on Kaggle.
Evaluates:

* step-by-step reasoning
* research question solving
* retrieval-like inference
* chain-of-thought logic

### **🖼️ FACTS Multimodal**
[https://www.kaggle.com/datasets/deepmind/FACTS-grounding-examples](url)
Also from **DeepMind**, hosted on Kaggle.
Evaluates:

* image-based factual grounding
* atomic facts correctness
* contradiction detection
* multimodal reasoning

---

## 🙌 **Acknowledgements**

This project uses research datasets published by **Google DeepMind**:

* DeepSearchQA
* FACTS Multimodal

Inspired by research from:
[https://www.perplexity.ai/hub/blog/how-people-use-ai-agents](url)
* Harvard University (AI Truthfulness Paper)
* Perplexity.ai Reasoning Evaluations

Built entirely using **Gemini 3 Pro** and **Google AI Studio**.

---

## 📜 **License**

MIT License.
Free for research & development.

---

## 🌟 **Contributing**

Pull requests are welcome!
Suggestions & bug reports appreciated.

---

## ⭐ **If you liked this project, give it a star!** ⭐

<p align="center">
Made with ❤️ by Karthik.
</p>
---
