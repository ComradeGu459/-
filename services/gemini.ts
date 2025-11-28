import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, ActorWeights, SimulationResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

// System prompt to enforce the persona of a Public Administration Professor
const SYSTEM_INSTRUCTION = `
你是一位资深的公共管理学教授，专门辅导研究生入学考试（考研）。
你的任务是运行一个基于“政府职能转变”理论的模拟器。核心关注点是：
1. **政府淡出 (Government Fade-out)**：政府从“划桨”转向“掌舵”，减少微观干预。
2. **政府替代 (Government Substitution)**：
   - **市场替代**：合同外包、特许经营、凭单制（私有化逻辑）。
   - **社会替代**：多中心治理、共同生产、第三部门参与（社会化逻辑）。
3. **失灵理论**：必须分析可能出现的“政府失灵”（低效/寻租）、“市场失灵”（不公/外部性）或“志愿失灵”（资金不足/家长作风）。

请使用专业的公共管理学术语进行分析（如：新公共管理 NPM、公共选择理论、治理理论、交易成本等）。
输出必须是严格的 JSON 格式。
`;

export const generateNewScenario = async (): Promise<Scenario> => {
  if (!apiKey) throw new Error("API Key is missing");

  const prompt = `
    请生成一个用于公共管理案例分析的复杂政策场景。
    
    场景要求：
    1. 必须是一个典型的公共事务难题（如：老旧小区加装电梯、农村垃圾治理、公立医院改革、网约车监管、养老服务供给）。
    2. 这是一个两难困境，需要权衡政府、市场和社会的力量。
    3. 适合考察“政府是否应该淡出”以及“谁来替代”的问题。
    
    请返回 JSON 格式：
    {
      "id": "string",
      "title": "简短的中文标题",
      "description": "详细的案例背景描述（200字左右）",
      "category": "one of ['public_service', 'infrastructure', 'social_welfare', 'regulation']",
      "context": "该场景的理论背景提示（如：属于准公共物品的供给问题）",
      "initialMetrics": {
        "publicSatisfaction": number (0-100),
        "efficiency": number (0-100),
        "socialEquity": number (0-100),
        "budgetUsage": number (0-100)
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['public_service', 'infrastructure', 'social_welfare', 'regulation'] },
            context: { type: Type.STRING },
            initialMetrics: {
              type: Type.OBJECT,
              properties: {
                publicSatisfaction: { type: Type.NUMBER },
                efficiency: { type: Type.NUMBER },
                socialEquity: { type: Type.NUMBER },
                budgetUsage: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text) as Scenario;
  } catch (error) {
    console.error("Gemini Scenario Error:", error);
    // Fallback scenario in Chinese
    return {
      id: "fallback-cn-1",
      title: "老旧小区加装电梯的治理困境",
      description: "随着城市老龄化，老旧小区加装电梯需求迫切。但低层住户反对（采光/噪音）、高层住户资金不足。政府若全资投入财政压力巨大且不可持续；完全交给市场则会导致价格高昂，低收入群体被排除；仅靠居民自治又常因协商破裂而搁浅。",
      category: "infrastructure",
      context: "此场景考察作为'准公共物品'的社区设施，如何解决'搭便车'问题及集体行动的困境。",
      initialMetrics: { publicSatisfaction: 45, efficiency: 30, socialEquity: 50, budgetUsage: 60 }
    };
  }
};

export const simulateOutcome = async (scenario: Scenario, weights: ActorWeights): Promise<SimulationResult> => {
  if (!apiKey) throw new Error("API Key is missing");

  const prompt = `
    案例: ${scenario.title}
    背景: ${scenario.description}
    
    用户的政策配置 (投入权重 0-100):
    - 政府主导程度 (Government): ${weights.government}%
    - 市场机制引入 (Market): ${weights.market}%
    - 社会组织/自治参与 (Society): ${weights.society}%
    
    请基于公共管理理论（如萨拉蒙的工具理论、奥斯特罗姆的多中心治理）进行推演。
    
    逻辑参考：
    - 政府过高 -> 只有政府在“划桨”，可能导致财政危机、效率低下（官僚主义），但公平性通常较好。
    - 市场过高 -> 可能出现“撇脂效应”（只服务富人），效率高但公平性下降。
    - 社会过高 -> 志愿失灵（资源不足），或是“平庸的多数”。
    - 均衡模型 -> 协同治理 (Collaborative Governance)。
    
    请返回 JSON:
    {
      "metrics": { ...更新后的四个指标 0-100 },
      "analysis": "深度解析（300字左右），分析政策的优劣，运用专业术语。",
      "theoreticalAlignment": "该策略对应什么理论模型？（例如：'新公共服务 NPS' 或 'PPP模式' 或 '福利国家复归'）",
      "consequences": ["具体后果1", "具体后果2", ...],
      "score": number (0-100, 基于解决问题的有效性和可持续性)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metrics: {
              type: Type.OBJECT,
              properties: {
                publicSatisfaction: { type: Type.NUMBER },
                efficiency: { type: Type.NUMBER },
                socialEquity: { type: Type.NUMBER },
                budgetUsage: { type: Type.NUMBER }
              }
            },
            analysis: { type: Type.STRING },
            theoreticalAlignment: { type: Type.STRING },
            consequences: { type: Type.ARRAY, items: { type: Type.STRING } },
            score: { type: Type.NUMBER }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text) as SimulationResult;
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    throw error;
  }
};