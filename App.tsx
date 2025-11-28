import React, { useState, useEffect } from 'react';
import { generateNewScenario, simulateOutcome } from './services/gemini';
import { Scenario, ActorWeights, SimulationResult, INITIAL_METRICS } from './types';
import ControlPanel from './components/ControlPanel';
import ResultCard from './components/ResultCard';
import MetricsChart from './components/MetricsChart';
import { RefreshCw, BookOpen, AlertCircle, Library } from 'lucide-react';

const App: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [weights, setWeights] = useState<ActorWeights>({ government: 50, market: 30, society: 20 });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initLoading, setInitLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScenario();
  }, []);

  const loadScenario = async () => {
    setInitLoading(true);
    setResult(null);
    setError(null);
    try {
      const scenario = await generateNewScenario();
      setCurrentScenario(scenario);
      // Reset to a neutral starting point for students to experiment
      setWeights({ government: 50, market: 25, society: 25 });
    } catch (err) {
      setError("场景加载失败，请检查 API Key 设置。");
    } finally {
      setInitLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!currentScenario) return;
    setLoading(true);
    setError(null);
    try {
      const simResult = await simulateOutcome(currentScenario, weights);
      setResult(simResult);
    } catch (err) {
      setError("模拟失败，AI 服务暂时不可用。");
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800">正在生成公共管理案例...</h2>
        <p className="text-slate-500 mt-2">Connecting to Knowledge Base...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Library className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none">PublicAdmin Sim</h1>
              <span className="text-xs text-blue-300 font-light block">公共管理考研模拟器：政府淡出与替代</span>
            </div>
          </div>
          <button 
            onClick={loadScenario}
            className="text-xs bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-2 rounded-md border border-slate-600 flex items-center gap-2 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            切换案例 (New Case)
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 animate-pulse">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Scenario Banner */}
        {currentScenario && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider
                    ${currentScenario.category === 'social_welfare' ? 'bg-purple-100 text-purple-700' :
                      currentScenario.category === 'infrastructure' ? 'bg-orange-100 text-orange-700' :
                      currentScenario.category === 'regulation' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {currentScenario.category === 'social_welfare' ? '社会福利' : 
                     currentScenario.category === 'infrastructure' ? '基础设施' :
                     currentScenario.category === 'regulation' ? '市场监管' : '公共服务'}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800">{currentScenario.title}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-base border-l-4 border-slate-300 pl-4 mb-4">
                  {currentScenario.description}
                </p>
                <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <span className="font-bold">案例背景 (Context): </span>
                    {currentScenario.context}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Col: Controls */}
          <div className="lg:col-span-3">
            <ControlPanel 
              weights={weights} 
              setWeights={setWeights} 
              onSimulate={handleSimulate} 
              isLoading={loading} 
            />
            
            {/* Theory Helper */}
            <div className="mt-4 bg-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-700">📚 考点速记</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>政府淡出</strong>：不仅仅是退出，而是职能重构（元治理）。</li>
                <li><strong>政府替代</strong>：利用市场机制（合同制）或社会机制（志愿主义）填补真空。</li>
                <li><strong>多中心治理</strong>：打破政府单中心，强调多元主体协作。</li>
              </ul>
            </div>
          </div>

          {/* Middle Col: Metrics & Data */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <MetricsChart 
              data={result ? result.metrics : (currentScenario?.initialMetrics || INITIAL_METRICS)} 
              previousData={currentScenario?.initialMetrics}
            />
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
               <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <span className="w-1 h-4 bg-slate-800 rounded-full"></span>
                 核心指标维度 (4E 框架参考)
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-bold text-slate-700">公众满意度 (Satisfaction)</span>
                     </div>
                     <p className="text-[10px] text-slate-500">政治回应性的直接体现，衡量政策合法性基础。</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-slate-700">行政效率 (Efficiency)</span>
                     </div>
                     <p className="text-[10px] text-slate-500">投入产出比。新公共管理(NPM)的核心追求。</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-xs font-bold text-slate-700">社会公平 (Equity)</span>
                     </div>
                     <p className="text-[10px] text-slate-500">新公共行政学(NPA)强调的核心价值，关注弱势群体。</p>
                  </div>
                   <div className="p-3 bg-slate-50 rounded-lg">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-xs font-bold text-slate-700">财政健康 (Economy)</span>
                     </div>
                     <p className="text-[10px] text-slate-500">政府财政的可持续性，避免财政赤字危机。</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Col: AI Analysis Results */}
          <div className="lg:col-span-4 h-full">
            <ResultCard result={result} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;