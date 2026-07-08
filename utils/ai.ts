import { logAIRequest, logAIResponse } from './logger';

export interface SeedreamResponse {
  model: string;
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

export class DoubaoAPI {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey?: string, baseUrl?: string, model?: string) {
    this.apiKey = apiKey || process.env.ARK_API_KEY || '';
    this.baseUrl = baseUrl || process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
    this.model = model || process.env.ARK_MODEL_ID || 'doubao-seed-2-1-pro-260628';
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Doubao API key not configured');
    }

    const prompt = messages.map(m => m.content).join('\n');
    const requestBody = {
      model: this.model,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    };
    
    const logId = logAIRequest('chat', 'DoubaoAPI', '/chat/completions', this.model, prompt);
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (data.error) {
        logAIResponse(logId, undefined, duration, false, data.error.message || 'Doubao API error');
        throw new Error(data.error.message || 'Doubao API error');
      }

      const content = data.choices?.[0]?.message?.content || '';
      logAIResponse(logId, content, duration, true);

      return content;
    } catch (error) {
      const duration = Date.now() - startTime;
      logAIResponse(logId, undefined, duration, false, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async analyzeFloorPlan(imageBase64: string, meta: Record<string, unknown>): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Doubao API key not configured');
    }

    const prompt = `
请用中文分析这张户型图，识别以下内容并以JSON格式返回：

1. 户型结构（几室几厅几卫、面积估算）
2. 采光分析（朝向、窗户位置、采光时长、评分0-100）
3. 通风分析（空气对流路径、通风效果、评分0-100）
4. 动静分区（公共区域与私密区域的划分、评分0-100）
5. 空间利用率（是否有浪费空间、可优化区域、评分0-100）
6. 优缺点总结

辅助信息：
- 家庭成员：${JSON.stringify(meta.familyMembers || [])}
- 装修风格：${meta.style || '现代简约'}
- 用户需求：${JSON.stringify(meta.requirements || [])}

请返回严格的JSON格式，所有字段的值必须使用中文，包含以下字段：
- structure: 户型结构描述
- roomCount: 房间数量
- area: 面积估算（平方米）
- floorHeight: 层高估算（米）
- lighting: { score, description, windows[], suggestions[] }
- ventilation: { score, description, airFlowPaths[], suggestions[] }
- zoning: { score, description, publicAreas[], privateAreas[], suggestions[] }
- utilization: { score, description, wastedSpaces[], optimizableAreas[], suggestions[] }
- advantages: []
- disadvantages: []
- overallScore: 综合评分
    `.trim();

    const messages: Array<{ role: string; content: any }> = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } },
        ],
      },
    ];

    const requestBody = {
      model: this.model,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    };

    const logId = logAIRequest('analysis', 'DoubaoAPI', '/chat/completions', this.model, prompt);
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (data.error) {
        logAIResponse(logId, undefined, duration, false, data.error.message || 'Doubao API error');
        throw new Error(data.error.message || 'Doubao API error');
      }

      const content = data.choices?.[0]?.message?.content || '';
      logAIResponse(logId, content, duration, true);

      return content;
    } catch (error) {
      const duration = Date.now() - startTime;
      logAIResponse(logId, undefined, duration, false, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async analyzeFamilyPlan(familyMembers: Record<string, unknown>[], floorPlanInfo: Record<string, unknown>, requirements: Record<string, unknown>[]): Promise<string> {
    const prompt = `
请用中文基于以下家庭信息进行生活规划分析，并以JSON格式返回：

家庭成员：${JSON.stringify(familyMembers)}

户型信息：
- 房间数：${floorPlanInfo.rooms || '未知'}
- 面积：${floorPlanInfo.area || '未知'}平方米
- 结构：${floorPlanInfo.structure || '未知'}

用户需求：${JSON.stringify(requirements)}

请分析并返回：
1. familyType: 家庭类型（单身/新婚/有娃/老人同住/多代同堂）
2. familyProfile: 家庭画像描述
3. lifestyleAnalysis: { dailyFlow[], activityPatterns[{ time, activity, location }], specialNeeds[] }
4. storageAssessment: { sufficiency, currentCapacity, requiredCapacity, gap, suggestions[{ area, solution, estimatedCost }] }
5. growthPlanning: { childSpace, childAgeRange, agingConsideration, flexibilityRequirements[], futureChanges[{ timeframe, change, planningSuggestion }] }
6. spaceRecommendations: { functionalZones[], roomLayoutSuggestions[{ room, layout, furniture[] }], multiPurposeSpaces[{ space, purposes[], implementation }] }

所有字段的值必须使用中文，sufficiency可选值：'adequate' | 'moderate' | 'insufficient'
    `.trim();

    const messages: Array<{ role: string; content: string }> = [
      { role: 'user', content: prompt },
    ];

    return this.chat(messages);
  }

  async analyzeDecision(floorPlanAnalysis: string, familyPlanAnalysis: string, budget: number, style: string): Promise<string> {
    const prompt = `
综合以下两个分析结果，给出装修决策建议，并以JSON格式返回：

[户型分析结果]
${floorPlanAnalysis}

[家庭规划结果]
${familyPlanAnalysis}

预算：${budget}元
风格：${style}

请用中文输出：
1. renovationPriority: { phases[{ phase, name, duration, costRange, focus[], keyTasks[] }], criticalPath[] }
2. costEstimation: { totalEstimate, currency, breakdown[{ category, amount, percentage, items[{ name, unit, quantity, unitPrice, totalPrice }] }], costSavingTips[] }
3. pitfalls: [{ category, items[{ title, riskLevel, description, prevention, solution }] }]
   riskLevel可选值：'high' | 'medium' | 'low'
4. constructionTips: [{ area, tips[] }]
5. materialSuggestions: [{ area, recommendations[{ material, brand, reason, priceRange }] }]
6. timeline: { totalDuration, milestones[{ date, event, responsible }] }

注意：
- 所有字段的值必须使用中文
- 费用估算要基于${budget}元的预算进行合理分配
- 去掉百分比呈现，多用真实内容
- 给出具体的施工建议和材料推荐
    `.trim();

    const messages: Array<{ role: string; content: string }> = [
      { role: 'user', content: prompt },
    ];

    return this.chat(messages);
  }

  async generateImagePrompt(floorPlanAnalysis: string, familyPlanAnalysis: string, area: string, style: string): Promise<string> {
    const prompt = `
根据以下设计方案为${area}生成AI绘图提示词：

户型分析：${floorPlanAnalysis.substring(0, 500)}...

家庭规划：${familyPlanAnalysis.substring(0, 500)}...

风格：${style}

请生成详细的AI绘图提示词，包含：
- 空间类型和功能
- 装修风格和配色方案
- 主要家具和装饰品
- 光线和氛围描述
- 材质和质感

只需返回提示词内容，不要JSON格式。
    `.trim();

    const messages: Array<{ role: string; content: string }> = [
      { role: 'user', content: prompt },
    ];

    return this.chat(messages);
  }
}

export class SeedreamAPI {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey?: string, baseUrl?: string, model?: string) {
    this.apiKey = apiKey || process.env.ARK_API_KEY || '';
    this.baseUrl = baseUrl || process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
    this.model = model || process.env.ARK_IMAGE_MODEL_ID || 'doubao-seedream-4-0-250828';
  }

  async generateImage(prompt: string, size: string = '1024x1024', images?: string[]): Promise<SeedreamResponse> {
    if (!this.apiKey) {
      throw new Error('Seedream API key not configured');
    }

    const body: Record<string, unknown> = {
      model: this.model,
      prompt,
      size,
      watermark: false,
      sequential_image_generation: 'disabled',
    };

    if (images && images.length > 0) {
      body.images = images;
    }

    const logId = logAIRequest('image', 'SeedreamAPI', '/images/generations', this.model, prompt);
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (data.error) {
        logAIResponse(logId, undefined, duration, false, data.error.message || 'Seedream API error');
        throw new Error(data.error.message || 'Seedream API error');
      }

      const imageUrl = data.data?.[0]?.url || data.data?.[0]?.b64_json ? 'base64 image' : 'no image';
      logAIResponse(logId, `Image URL: ${imageUrl}`, duration, true);

      return data as SeedreamResponse;
    } catch (error) {
      const duration = Date.now() - startTime;
      logAIResponse(logId, undefined, duration, false, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}
