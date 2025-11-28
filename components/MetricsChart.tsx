import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SimulationMetrics } from '../types';

interface MetricsChartProps {
  data: SimulationMetrics;
  previousData?: SimulationMetrics;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ data, previousData }) => {
  const chartData = [
    { subject: '公众满意度', A: data.publicSatisfaction, B: previousData?.publicSatisfaction || 0, fullMark: 100 },
    { subject: '行政效率', A: data.efficiency, B: previousData?.efficiency || 0, fullMark: 100 },
    { subject: '社会公平', A: data.socialEquity, B: previousData?.socialEquity || 0, fullMark: 100 },
    { subject: '财政健康(反预算)', A: 100 - data.budgetUsage, B: previousData ? 100 - previousData.budgetUsage : 0, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-500 mb-2">政策绩效评估雷达图</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="当前预测"
            dataKey="A"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="#0ea5e9"
            fillOpacity={0.4}
          />
          {previousData && (
            <Radar
              name="基准/前次"
              dataKey="B"
              stroke="#94a3b8"
              strokeWidth={1}
              fill="#94a3b8"
              fillOpacity={0.1}
            />
          )}
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            itemStyle={{ color: '#0f172a' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;