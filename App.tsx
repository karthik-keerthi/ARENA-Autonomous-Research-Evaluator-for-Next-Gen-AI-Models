import React, { useState, useCallback, useRef } from 'react';
import { ALL_BENCHMARKS, DSQA_PROMPT_TEMPLATE, FACTS_PROMPT_TEMPLATE } from './constants';
import { AggregateMetrics, EvaluationResult, EvaluationState, ModelConfig } from './types';
import { geminiService } from './services/geminiService';
import Dashboard from './components/Dashboard';
import PDFReport from './components/PDFReport';
// @ts-ignore
import html2pdf from 'html2pdf.js';

function App() {
  const [state, setState] = useState<EvaluationState>(EvaluationState.IDLE);
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState<string>("");
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    name: 'Gemini-2.5-Flash (Simulated Subject)',
    apiUrl: '',
    apiKey: '',
    isInternalGemini: true,
  });

  const [metrics, setMetrics] = useState<AggregateMetrics>({
    compositeScore: 0,
    dsqaScore: 0,
    factsScore: 0,
    safetyScore: 0,
    totalProcessed: 0,
    contradictionRate: 0,
    failureRate: 0,
  });
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const logBoxRef = useRef<HTMLDivElement>(null);

  const calculateMetrics = (currentResults: EvaluationResult[]) => {
    if (currentResults.length === 0) return;

    const dsqaItems = currentResults.filter(r => r.type === 'DSQA');
    const factsItems = currentResults.filter(r => r.type === 'FACTS');

    const avgDsqa = dsqaItems.reduce((acc, r) => acc + (r.scores.f1Score * 100), 0) / (dsqaItems.length || 1);
    const avgFacts = factsItems.reduce((acc, r) => acc + (r.scores.rubricScore * 100), 0) / (factsItems.length || 1);
    
    // Safety is roughly 100 - contradiction penalties
    const totalPenalty = currentResults.reduce((acc, r) => acc + r.scores.contradictionPenalty, 0);
    const avgPenalty = totalPenalty / currentResults.length;
    const safety = Math.max(0, 100 - (avgPenalty * 100)); // Assuming penalty is normalized

    const composite = (avgDsqa * 0.4) + (avgFacts * 0.4) + (safety * 0.2);

    const failures = currentResults.filter(r => r.scores.f1Score < 0.4 || r.status === 'FAILURE').length;

    setMetrics({
      compositeScore: composite,
      dsqaScore: avgDsqa,
      factsScore: avgFacts,
      safetyScore: safety,
      totalProcessed: currentResults.length,
      contradictionRate: avgPenalty, // Abstract representation
      failureRate: (failures / currentResults.length) * 100
    });
  };

  const runEvaluation = async () => {
    if (!process.env.API_KEY && modelConfig.isInternalGemini) {
      alert("No API Key detected in environment. Please allow permissions or configure the app properly.");
      return;
    }

    setState(EvaluationState.RUNNING);
    setResults([]);
    setProgress(0);
    
    const newResults: EvaluationResult[] = [];

    // Simulate batch processing
    for (let i = 0; i < ALL_BENCHMARKS.length; i++) {
      const row = ALL_BENCHMARKS[i];
      const template = row.type === 'DSQA' ? DSQA_PROMPT_TEMPLATE : FACTS_PROMPT_TEMPLATE;
      
      setCurrentLog(`Processing Case ${row.id} (${row.domain})...`);
      
      // Scroll log
      if (logBoxRef.current) {
        logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
      }

      // 1. Get Subject Response
      let subjectOutput = "";
      try {
        if (modelConfig.isInternalGemini) {
          subjectOutput = await geminiService.generateSubjectResponse(row, template);
        } else {
           // Simulate external fetch - In a real app, this would use fetch(modelConfig.apiUrl, ...)
           // For this demo, we fall back to internal to ensure it works
           subjectOutput = await geminiService.generateSubjectResponse(row, template);
        }
      } catch (e) {
        subjectOutput = JSON.stringify({ error: "Connection Failed" });
      }

      // 2. Judge Response
      setCurrentLog(`Judging Case ${row.id} with Gemini 3 Pro...`);
      const result = await geminiService.judgePerformance(row, subjectOutput);
      
      newResults.push(result);
      setResults([...newResults]);
      calculateMetrics(newResults); // Update live metrics
      
      setProgress(((i + 1) / ALL_BENCHMARKS.length) * 100);

      // Artificial throttle to respect rate limits
      await new Promise(r => setTimeout(r, 2000));
    }

    setState(EvaluationState.COMPLETED);
    setCurrentLog("Evaluation Complete.");
  };

  const handleDownload = async () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('pdf-report-content');
    if (!element) {
        setIsGeneratingPdf(false);
        return;
    }

    // Clone the element to avoid layout shifts on screen during capture
    // But html2pdf is easier if we just toggle visibility
    element.classList.remove('hidden');
    element.classList.add('block');
    
    const opt = {
      margin: 10,
      filename: `ARENA_Evaluation_${modelConfig.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("PDF Gen Error", e);
      alert("Failed to generate PDF. Falling back to browser print.");
      window.print();
    } finally {
      element.classList.add('hidden');
      element.classList.remove('block');
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-100 selection:bg-brand-accent selection:text-white pb-20">
      
      {/* Printable Report Overlay */}
      <PDFReport metrics={metrics} results={results} modelName={modelConfig.name} />

      {/* Main UI */}
      <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
             <div className="w-12 h-12 bg-gradient-to-br from-brand-accent to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/30">
               <i className="fas fa-microscope text-2xl text-white"></i>
             </div>
             <h1 className="text-4xl font-extrabold tracking-tight">ARENA</h1>
          </div>
          <p className="text-xl text-brand-300 font-light">Autonomous Research Evaluator for Next-Gen AI Models</p>
          <p className="text-sm text-brand-500 mt-2 font-mono">
            Powered by <span className="text-brand-accent font-bold">Gemini 3 Pro</span> & DeepMind Benchmarks
          </p>
        </header>

        {/* Configuration State */}
        {state === EvaluationState.IDLE && (
          <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl shadow-2xl animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fas fa-plug mr-3 text-brand-accent"></i> Connect Model
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-300 mb-2">Model Name</label>
                <input 
                  type="text" 
                  value={modelConfig.name}
                  onChange={(e) => setModelConfig({...modelConfig, name: e.target.value})}
                  className="w-full bg-brand-800 border border-brand-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  placeholder="e.g. GPT-4, Gemini Ultra, Llama-3"
                />
              </div>

              <div className="p-4 bg-brand-800/50 rounded-lg border border-brand-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-brand-300">Connection Type</span>
                  <div className="flex bg-brand-900 rounded-lg p-1">
                    <button 
                      onClick={() => setModelConfig({...modelConfig, isInternalGemini: true})}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${modelConfig.isInternalGemini ? 'bg-brand-accent text-white shadow' : 'text-brand-500 hover:text-brand-300'}`}
                    >
                      Gemini (Internal)
                    </button>
                    <button 
                      onClick={() => setModelConfig({...modelConfig, isInternalGemini: false})}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${!modelConfig.isInternalGemini ? 'bg-brand-accent text-white shadow' : 'text-brand-500 hover:text-brand-300'}`}
                    >
                      External API
                    </button>
                  </div>
                </div>

                {!modelConfig.isInternalGemini && (
                   <div className="space-y-4 animate-fade-in">
                     <input 
                      type="text" 
                      placeholder="API Endpoint URL"
                      className="w-full bg-brand-900 border border-brand-700 rounded-lg px-4 py-3 text-sm focus:border-brand-accent outline-none"
                     />
                     <input 
                      type="password" 
                      placeholder="API Key"
                      className="w-full bg-brand-900 border border-brand-700 rounded-lg px-4 py-3 text-sm focus:border-brand-accent outline-none"
                     />
                     <p className="text-xs text-brand-500 italic">
                       <i className="fas fa-exclamation-triangle text-yellow-500 mr-1"></i>
                       Note: External APIs may require a proxy due to CORS. For this demo, we recommend using the Internal Gemini mode to verify the evaluation pipeline.
                     </p>
                   </div>
                )}
                 {modelConfig.isInternalGemini && (
                   <p className="text-xs text-brand-400">
                     Uses <strong>Gemini 2.5 Flash</strong> as the "Subject Model" to demonstrate the evaluation pipeline against <strong>Gemini 3 Pro</strong> (Judge).
                   </p>
                 )}
              </div>

              <div className="pt-4">
                <button 
                  onClick={runEvaluation}
                  className="w-full bg-gradient-to-r from-brand-accent to-blue-600 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/50 transform transition hover:-translate-y-1 active:scale-95 flex items-center justify-center group"
                >
                  <span>Initialize ARENA Evaluation</span>
                  <i className="fas fa-rocket ml-3 group-hover:animate-pulse"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Running State */}
        {state === EvaluationState.RUNNING && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="glass-panel p-8 rounded-2xl text-center">
              <h2 className="text-2xl font-bold mb-2">Evaluator Running...</h2>
              <p className="text-brand-400 mb-8">Running DeepMind DSQA & FACTS Benchmarks</p>
              
              <div className="relative h-4 bg-brand-800 rounded-full overflow-hidden mb-4">
                <div 
                  className="absolute top-0 left-0 h-full bg-brand-accent transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-brand-500 font-mono">
                 <span>0%</span>
                 <span>{Math.round(progress)}% Complete</span>
                 <span>100%</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-brand-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-400">Live Evaluation Log</h3>
                <span className="animate-pulse flex h-2 w-2 rounded-full bg-green-500"></span>
              </div>
              <div ref={logBoxRef} className="h-48 overflow-y-auto font-mono text-xs text-brand-300 space-y-2 p-2 bg-brand-900/50 rounded-lg">
                {currentLog && <div className="border-l-2 border-brand-accent pl-2">{currentLog}</div>}
                {results.slice().reverse().map((r, i) => (
                   <div key={i} className="opacity-70">
                     <span className={r.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}>
                       [{r.status}]
                     </span> {r.type} Case {r.rowId}: F1={r.scores.f1Score.toFixed(2)}
                   </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completed Dashboard State */}
        {state === EvaluationState.COMPLETED && (
           <Dashboard 
             metrics={metrics} 
             results={results} 
             onDownloadReport={handleDownload}
             onReset={() => setState(EvaluationState.IDLE)}
           />
        )}
        
        {isGeneratingPdf && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                <div className="bg-brand-800 p-8 rounded-xl text-center shadow-2xl">
                    <i className="fas fa-circle-notch fa-spin text-4xl text-brand-accent mb-4"></i>
                    <h3 className="text-xl font-bold text-white">Generating PDF Report...</h3>
                    <p className="text-brand-400 mt-2">Compiling high-resolution visualizations.</p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

export default App;