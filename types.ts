export interface SimulationMetrics {
  publicSatisfaction: number; // 公众满意度
  efficiency: number;         // 行政/运行效率
  socialEquity: number;       // 社会公平性
  budgetUsage: number;        // 财政预算消耗
}

export interface ActorWeights {
  government: number; // 政府介入程度
  market: number;     // 市场机制引入
  society: number;    // 社会组织/第三部门参与
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: 'public_service' | 'infrastructure' | 'social_welfare' | 'regulation';
  initialMetrics: SimulationMetrics;
  context: string; // Background theory context
}

export interface SimulationResult {
  metrics: SimulationMetrics;
  analysis: string;        // AI analysis of the outcome
  theoreticalAlignment: string; // How this relates to Fade-out/Substitution theories
  consequences: string[]; // List of specific events triggered
  score: number;          // Overall success score (0-100)
}

export interface HistoryItem {
  round: number;
  scenarioTitle: string;
  weights: ActorWeights;
  result: SimulationResult;
}

export const INITIAL_METRICS: SimulationMetrics = {
  publicSatisfaction: 50,
  efficiency: 50,
  socialEquity: 50,
  budgetUsage: 50,
};