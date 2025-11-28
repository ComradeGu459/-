import React from 'react';
import { ActorWeights } from '../types';
import { Building2, Users, Briefcase, HelpCircle } from 'lucide-react';

interface ControlPanelProps {
  weights: ActorWeights;
  setWeights: React.Dispatch<React.SetStateAction<ActorWeights>>;
  onSimulate: () => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ weights, setWeights, onSimulate, isLoading }) => {
  const handleChange = (key: keyof ActorWeights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const total = weights.government + weights.market + weights.society;
  
  // Dynamic feedback string based on weights
  let governanceModel = "混合治理";
  if (weights.government > 60 && weights.market < 30 && weights.society < 30) governanceModel = "行政主导型 (传统科层制)";
  else if (weights.government < 40 && weights.market > 60) governanceModel = "市场主导型 (新公共管理)";
  else if (weights.government < 40 && weights.society > 60) governanceModel = "社会自治型 (多中心治理)";
  else if (weights.government < 30 && weights.market < 30 && weights.society < 30) governanceModel = "治理真空 (碎片化)";
  else if (total > 200) governanceModel = "职能重叠/过度治理";

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100 h-full flex flex-col">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
           治理结构配置
        </h2>
        <p className="text-sm text-slate-500 mt-1">请配置三部门在公共事务中的介入权重。</p>
      </div>

      <div className="space-y-8 flex-grow">
        {/* Government Slider */}
        <div className="space-y-2 group">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 font-medium text-slate-800">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <span className="block">政府 (Government)</span>
                <span className="text-[10px] text-slate-400 font-normal">行政指令 / 财政拨款 / 强制力</span>
              </div>
            </label>
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">{weights.government}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.government}
            onChange={(e) => handleChange('government', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
          />
          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
             <span className="font-bold">考点提示：</span>降低该项即“政府淡出/简政放权”。过高可能导致“利维坦”式行政垄断。
          </p>
        </div>

        {/* Market Slider */}
        <div className="space-y-2 group">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 font-medium text-slate-800">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="block">市场 (Market)</span>
                <span className="text-[10px] text-slate-400 font-normal">竞争机制 / 价格信号 / 效率导向</span>
              </div>
            </label>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">{weights.market}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.market}
            onChange={(e) => handleChange('market', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 hover:accent-emerald-500 transition-all"
          />
          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
             <span className="font-bold">考点提示：</span>“市场替代”。引入PPP、合同外包。需警惕“市场失灵”导致的公平缺失。
          </p>
        </div>

        {/* Society Slider */}
        <div className="space-y-2 group">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 font-medium text-slate-800">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <span className="block">社会 (Society)</span>
                <span className="text-[10px] text-slate-400 font-normal">NGO / 社区自治 / 志愿精神</span>
              </div>
            </label>
            <span className="text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded">{weights.society}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.society}
            onChange={(e) => handleChange('society', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600 hover:accent-purple-500 transition-all"
          />
          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
             <span className="font-bold">考点提示：</span>“社会替代”。强调公民社会与第三部门的“共同生产”。
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
         <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">当前模型判定</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-200 px-2 py-1 rounded">{governanceModel}</span>
         </div>

        <button
          onClick={onSimulate}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2
            ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>AI 教授推演中...</span>
            </>
          ) : (
            <>
              <span>执行政策模拟</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;