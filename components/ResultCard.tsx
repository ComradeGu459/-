import React from 'react';
import { SimulationResult } from '../types';
import { TrendingUp, BookOpen, AlertTriangle, CheckCircle, GraduationCap, ClipboardList } from 'lucide-react';

interface ResultCardProps {
  result: SimulationResult | null;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  if (!result) return (
    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
      <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
        <GraduationCap className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-600 mb-2">等待推演</h3>
      <p className="text-sm text-center max-w-xs">请在左侧调整“政府-市场-社会”的三元结构，AI 教授将为您生成基于公共管理理论的分析报告。</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-full ring-1 ring-slate-900/5">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-start">
        <div>
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <ClipboardList className="w-5 h-5 text-blue-600"/>
             政策推演报告
           </h3>
           <p className="text-xs text-slate-500 mt-1">基于 Google Gemini AI 公共管理模型</p>
        </div>
        <div className="text-right flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">综合评分</span>
            <div className={`text-2xl font-black ${result.score >= 80 ? 'text-emerald-600' : result.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {result.score} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
        </div>
      </div>
      
      <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
        
        {/* Theory Section - Crucial for students */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4"/>
            理论定性 (Theoretical Alignment)
          </h4>
          <p className="text-blue-900 text-sm font-medium leading-relaxed">
            {result.theoreticalAlignment}
          </p>
        </div>

        {/* Deep Analysis */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 border-l-4 border-indigo-500 pl-2">
            教授点评 (Analysis)
          </h4>
          <p className="text-slate-600 text-sm leading-7 text-justify">
            {result.analysis}
          </p>
        </div>

        {/* Consequences */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 border-l-4 border-emerald-500 pl-2">
            预期治理后果
          </h4>
          <div className="grid gap-3">
            {result.consequences.map((item, idx) => {
              const isNegative = item.includes('失灵') || item.includes('风险') || item.includes('下降') || item.includes('不足') || item.includes('危机');
              return (
                <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${isNegative ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  {isNegative ? (
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm ${isNegative ? 'text-red-800' : 'text-emerald-800'}`}>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;