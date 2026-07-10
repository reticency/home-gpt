'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, RotateCcw, Download, CheckCircle2, XCircle, TrendingUp, ChevronDown, ChevronUp, Sun, Wind, Layout, Boxes, Clock, AlertTriangle, Hammer, Layers, RefreshCw, ImageIcon, Users } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { StepIndicator } from '@/components/StepIndicator';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/20 overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[rgba(30,50,90,0.05)] rounded-[12px] flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-lg font-semibold text-[#2D2D2D]">{title}</h2>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-[#5E6470]" /> : <ChevronDown className="w-5 h-5 text-[#5E6470]" />}
      </button>
      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

function ScoreCard({ score, label, color }: { score: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white/40 rounded-[1rem]">
      <div className="relative w-20 h-20 mb-3">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r="36" stroke="#E5E5EA" strokeWidth="8" fill="none" />
          <circle
            cx="40" cy="40" r="36"
            stroke={color} strokeWidth="8" fill="none"
            strokeLinecap="round"
            strokeDasharray={`${score * 2.26} 226`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#2D2D2D]">{score}</span>
      </div>
      <span className="text-sm text-[#5E6470]">{label}</span>
    </div>
  );
}

function RiskBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const colors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-green-100 text-green-700',
  };
  const labels = { high: '高风险', medium: '中风险', low: '低风险' };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
      {labels[level]}
    </span>
  );
}

function PhaseTimeline({ phases }: { phases: Array<{ phase: number; name: string; duration: string; costRange: string; focus: string[]; keyTasks: string[] }> }) {
  return (
    <div className="relative">
      {phases.map((phase, index) => (
        <div key={`${phase.phase}-${index}`} className="flex gap-4 pb-6 last:pb-0">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[rgba(30,50,90,0.8)] text-white flex items-center justify-center font-bold text-sm">
              {phase.phase}
            </div>
            {index < phases.length - 1 && <div className="w-0.5 h-full bg-[#E5E5EA] mt-2" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#2D2D2D]">{phase.name}</h3>
              <span className="text-sm text-[#5E6470]">{phase.duration}</span>
            </div>
            <p className="text-sm text-[rgba(30,50,90,0.8)] mb-3">{phase.costRange}</p>
            <div className="mb-3">
              <p className="text-xs text-[#5E6470] mb-1">重点工作：</p>
              <div className="flex flex-wrap gap-2">
                {phase.focus.map((f, i) => (
                  <span key={i} className="px-2 py-1 bg-[rgba(30,50,90,0.05)] rounded text-xs text-[rgba(30,50,90,0.8)]">{f}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#5E6470] mb-1">关键任务：</p>
              <ul className="list-disc list-inside text-sm text-[#374151] space-y-1">
                {phase.keyTasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { currentProject, analysisResult, resetProject } = useProject();
  const [regeneratingArea, setRegeneratingArea] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProject || !analysisResult) {
      router.push('/upload');
    }
  }, [currentProject, analysisResult, router]);

  const handleRedesign = () => {
    resetProject();
    router.push('/upload');
  };

  const handleRegenerateImage = async (area: string, prompt: string) => {
    setRegeneratingArea(area);
    try {
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, area }),
      });
      const data = await response.json();
      if (data.success && data.result) {
        setRenderingsState(prev => prev.map(r => 
          r.area === area ? { ...r, ...data.result } : r
        ));
      }
    } catch (error) {
      console.error('Image regeneration failed:', error);
    } finally {
      setRegeneratingArea(null);
    }
  };

  const handleExportWord = () => {
    const imagesSection = (renderings || []).filter(r => r.status === 'generated' && r.imageUrl).map(r => `
### ${r.area}效果图
![${r.area}](${r.imageUrl})
`).join('\n');

    const content = `
# HomeGPT 设计方案报告

## 一、项目信息
- 户型：${fpAnalysis.structure || ''}
- 面积：${fpAnalysis.area || ''}平方米
- 风格：${currentProject?.style || ''}
- 预算：${currentProject?.budget?.toLocaleString() || ''}元

## 二、户型分析

### 2.1 户型结构
${fpAnalysis.structure || ''}

### 2.2 采光分析
评分：${fpAnalysis.lighting.score || ''}分
${fpAnalysis.lighting.description || ''}

### 2.3 通风分析
评分：${fpAnalysis.ventilation.score || ''}分
${fpAnalysis.ventilation.description || ''}

### 2.4 动静分区
评分：${fpAnalysis.zoning.score || ''}分
${fpAnalysis.zoning.description || ''}

### 2.5 空间利用率
评分：${fpAnalysis.utilization.score || ''}分
${fpAnalysis.utilization.description || ''}

### 2.6 优缺点
优点：${(fpAnalysis.advantages || []).join('、')}
缺点：${(fpAnalysis.disadvantages || []).join('、')}

## 三、家庭生活规划

### 3.1 家庭画像
${fpAnalysis2.familyProfile || ''}

### 3.2 生活方式分析
${(fpAnalysis2.lifestyleAnalysis.dailyFlow || []).join('\n')}

### 3.3 收纳评估
当前容量：${fpAnalysis2.storageAssessment.currentCapacity || ''}
所需容量：${fpAnalysis2.storageAssessment.requiredCapacity || ''}

### 3.4 空间规划建议
${(fpAnalysis2.spaceRecommendations.functionalZones || []).join('、')}

## 四、装修决策

### 4.1 装修优先级
${fpAnalysis3.renovationPriority.phases.map((p) => `${p.phase}. ${p.name} - ${p.duration} - ${p.costRange}`).join('\n') || ''}

### 4.2 费用估算
总预算：${fpAnalysis3.costEstimation.totalEstimate?.toLocaleString() || ''}元

### 4.3 避坑指南
${fpAnalysis3.pitfalls.map((cat) => `【${cat.category}】\n${cat.items.map((item) => `- ${item.title}（${item.riskLevel}）`).join('\n')}`).join('\n\n') || ''}

### 4.4 施工建议
${fpAnalysis3.constructionTips.map((tip) => `【${tip.area}】\n${tip.tips.map((t) => `- ${t}`).join('\n')}`).join('\n\n') || ''}

### 4.5 材料推荐
${fpAnalysis3.materialSuggestions.map((mat) => `【${mat.area}】\n${mat.recommendations.map((r) => `- ${r.material}（${r.brand}）-${r.priceRange}`).join('\n')}`).join('\n\n') || ''}

## 五、时间规划
总工期：${fpAnalysis3.timeline.totalDuration || ''}

${imagesSection ? '## 六、设计效果图\n' + imagesSection : ''}

---
生成时间：${new Date(analysisResult?.analyzedAt || Date.now()).toLocaleString()}
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HomeGPT 设计方案报告</title>
  <style>
    body { font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #333; }
    h1 { text-align: center; color: #1E325A; margin-bottom: 40px; }
    h2 { color: #1D1D1F; border-bottom: 2px solid #1E325A; padding-bottom: 10px; margin-top: 30px; }
    h3 { color: #2D2D2D; margin-top: 20px; }
    h4 { color: #1E325A; }
    p { margin: 10px 0; }
    ul { margin: 10px 0; padding-left: 20px; }
    li { margin: 5px 0; }
    .section { margin-bottom: 30px; }
    .highlight { color: #1E325A; font-weight: bold; }
    .total-budget { font-size: 24px; font-weight: bold; color: #1E325A; text-align: right; }
    img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; }
    .image-caption { text-align: center; color: #5E6470; font-size: 14px; margin-bottom: 20px; }
    .footer { text-align: center; color: #999; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E5EA; }
  </style>
</head>
<body>
  <h1>HomeGPT 设计方案报告</h1>
  
  <div class="section">
    <h2>一、项目信息</h2>
    <p><strong>户型：</strong>${fpAnalysis.structure || ''}</p>
    <p><strong>面积：</strong>${fpAnalysis.area || ''}平方米</p>
    <p><strong>风格：</strong>${currentProject?.style || ''}</p>
    <p><strong>预算：</strong>${currentProject?.budget?.toLocaleString() || ''}元</p>
  </div>
  
  <div class="section">
    <h2>二、户型分析</h2>
    <h3>2.1 户型结构</h3>
    <p>${fpAnalysis.structure || ''}</p>
    
    <h3>2.2 采光分析</h3>
    <p><strong>评分：</strong>${fpAnalysis.lighting.score || ''}分</p>
    <p>${fpAnalysis.lighting.description || ''}</p>
    
    <h3>2.3 通风分析</h3>
    <p><strong>评分：</strong>${fpAnalysis.ventilation.score || ''}分</p>
    <p>${fpAnalysis.ventilation.description || ''}</p>
    
    <h3>2.4 动静分区</h3>
    <p><strong>评分：</strong>${fpAnalysis.zoning.score || ''}分</p>
    <p>${fpAnalysis.zoning.description || ''}</p>
    
    <h3>2.5 空间利用率</h3>
    <p><strong>评分：</strong>${fpAnalysis.utilization.score || ''}分</p>
    <p>${fpAnalysis.utilization.description || ''}</p>
    
    <h3>2.6 优缺点</h3>
    <p><strong>优点：</strong>${(fpAnalysis.advantages || []).join('、')}</p>
    <p><strong>缺点：</strong>${(fpAnalysis.disadvantages || []).join('、')}</p>
  </div>
  
  <div class="section">
    <h2>三、家庭生活规划</h2>
    <h3>3.1 家庭画像</h3>
    <p>${fpAnalysis2.familyProfile || ''}</p>
    
    <h3>3.2 生活方式分析</h3>
    <ul>${(fpAnalysis2.lifestyleAnalysis.dailyFlow || []).map((f: string) => `<li>${f}</li>`).join('')}</ul>
    
    <h3>3.3 收纳评估</h3>
    <p><strong>当前容量：</strong>${fpAnalysis2.storageAssessment.currentCapacity || ''}</p>
    <p><strong>所需容量：</strong>${fpAnalysis2.storageAssessment.requiredCapacity || ''}</p>
    
    <h3>3.4 空间规划建议</h3>
    <p>${(fpAnalysis2.spaceRecommendations.functionalZones || []).join('、')}</p>
  </div>
  
  <div class="section">
    <h2>四、装修决策</h2>
    <h3>4.1 装修优先级</h3>
    <ul>${fpAnalysis3.renovationPriority.phases.map((p: any) => `<li>${p.phase}. ${p.name} - ${p.duration} - ${p.costRange}</li>`).join('')}</ul>
    
    <h3>4.2 费用估算</h3>
    <p class="total-budget">总预算：${fpAnalysis3.costEstimation.totalEstimate?.toLocaleString() || ''}元</p>
    
    <h3>4.3 避坑指南</h3>
    ${fpAnalysis3.pitfalls.map((cat: any) => `<h4>${cat.category}</h4><ul>${cat.items.map((item: any) => `<li><strong>${item.title}</strong>（${item.riskLevel}）</li>`).join('')}</ul>`).join('')}
    
    <h3>4.4 施工建议</h3>
    ${fpAnalysis3.constructionTips.map((tip: any) => `<h4>${tip.area}</h4><ul>${(tip.tips || []).map((t: string) => `<li>${t}</li>`).join('')}</ul>`).join('')}
    
    <h3>4.5 材料推荐</h3>
    ${fpAnalysis3.materialSuggestions.map((mat: any) => `<h4>${mat.area}</h4><ul>${(mat.recommendations || []).map((r: any) => `<li>${r.material}（${r.brand}）-${r.priceRange}</li>`).join('')}</ul>`).join('')}
  </div>
  
  <div class="section">
    <h2>五、时间规划</h2>
    <p><strong>总工期：</strong>${fpAnalysis3.timeline.totalDuration || ''}</p>
  </div>
  
  ${(renderings || []).filter((r: any) => r.status === 'generated' && r.imageUrl).length > 0 ? `
  <div class="section">
    <h2>六、设计效果图</h2>
    ${(renderings || []).filter((r: any) => r.status === 'generated' && r.imageUrl).map((r: any) => `
      <h3>${r.area}效果图</h3>
      <img src="${r.imageUrl}" alt="${r.area}" />
      <p class="image-caption">${r.prompt || ''}</p>
    `).join('')}
  </div>
  ` : ''}
  
  <div class="footer">
    生成时间：${new Date(analysisResult?.analyzedAt || Date.now()).toLocaleString()}
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HomeGPT设计方案_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!currentProject || !analysisResult) {
    return null;
  }

  const { floorPlanAnalysis, familyPlanAnalysis, decisionAnalysis, renderings: initialRenderings } = analysisResult;
  const [renderingsState, setRenderingsState] = useState(initialRenderings || []);
  const renderings = renderingsState;
  
  const fpAnalysis = {
    structure: typeof floorPlanAnalysis?.structure === 'string' ? floorPlanAnalysis.structure : '',
    area: typeof floorPlanAnalysis?.area === 'number' ? floorPlanAnalysis.area : 0,
    floorHeight: typeof floorPlanAnalysis?.floorHeight === 'number' ? floorPlanAnalysis.floorHeight : 0,
    lighting: typeof floorPlanAnalysis?.lighting === 'object' && floorPlanAnalysis.lighting ? {
      score: typeof floorPlanAnalysis.lighting.score === 'number' ? floorPlanAnalysis.lighting.score : 0,
      description: typeof floorPlanAnalysis.lighting.description === 'string' ? floorPlanAnalysis.lighting.description : '',
      windows: Array.isArray(floorPlanAnalysis.lighting.windows) ? floorPlanAnalysis.lighting.windows : [],
      suggestions: Array.isArray(floorPlanAnalysis.lighting.suggestions) ? floorPlanAnalysis.lighting.suggestions : [],
    } : { score: 0, description: '', windows: [], suggestions: [] },
    ventilation: typeof floorPlanAnalysis?.ventilation === 'object' && floorPlanAnalysis.ventilation ? {
      score: typeof floorPlanAnalysis.ventilation.score === 'number' ? floorPlanAnalysis.ventilation.score : 0,
      description: typeof floorPlanAnalysis.ventilation.description === 'string' ? floorPlanAnalysis.ventilation.description : '',
      airFlowPaths: Array.isArray(floorPlanAnalysis.ventilation.airFlowPaths) ? floorPlanAnalysis.ventilation.airFlowPaths : [],
      suggestions: Array.isArray(floorPlanAnalysis.ventilation.suggestions) ? floorPlanAnalysis.ventilation.suggestions : [],
    } : { score: 0, description: '', airFlowPaths: [], suggestions: [] },
    zoning: typeof floorPlanAnalysis?.zoning === 'object' && floorPlanAnalysis.zoning ? {
      score: typeof floorPlanAnalysis.zoning.score === 'number' ? floorPlanAnalysis.zoning.score : 0,
      description: typeof floorPlanAnalysis.zoning.description === 'string' ? floorPlanAnalysis.zoning.description : '',
      publicAreas: Array.isArray(floorPlanAnalysis.zoning.publicAreas) ? floorPlanAnalysis.zoning.publicAreas : [],
      privateAreas: Array.isArray(floorPlanAnalysis.zoning.privateAreas) ? floorPlanAnalysis.zoning.privateAreas : [],
      suggestions: Array.isArray(floorPlanAnalysis.zoning.suggestions) ? floorPlanAnalysis.zoning.suggestions : [],
    } : { score: 0, description: '', publicAreas: [], privateAreas: [], suggestions: [] },
    utilization: typeof floorPlanAnalysis?.utilization === 'object' && floorPlanAnalysis.utilization ? {
      score: typeof floorPlanAnalysis.utilization.score === 'number' ? floorPlanAnalysis.utilization.score : 0,
      description: typeof floorPlanAnalysis.utilization.description === 'string' ? floorPlanAnalysis.utilization.description : '',
      wastedSpaces: Array.isArray(floorPlanAnalysis.utilization.wastedSpaces) ? floorPlanAnalysis.utilization.wastedSpaces : [],
      optimizableAreas: Array.isArray(floorPlanAnalysis.utilization.optimizableAreas) ? floorPlanAnalysis.utilization.optimizableAreas : [],
      suggestions: Array.isArray(floorPlanAnalysis.utilization.suggestions) ? floorPlanAnalysis.utilization.suggestions : [],
    } : { score: 0, description: '', wastedSpaces: [], optimizableAreas: [], suggestions: [] },
    advantages: Array.isArray(floorPlanAnalysis?.advantages) ? floorPlanAnalysis.advantages : [],
    disadvantages: Array.isArray(floorPlanAnalysis?.disadvantages) ? floorPlanAnalysis.disadvantages : [],
    overallScore: typeof floorPlanAnalysis?.overallScore === 'number' ? floorPlanAnalysis.overallScore : 0,
    roomCount: typeof floorPlanAnalysis?.roomCount === 'number' ? floorPlanAnalysis.roomCount : 0,
  };
  
  const fpAnalysis2 = {
    familyType: familyPlanAnalysis?.familyType || '',
    familyProfile: familyPlanAnalysis?.familyProfile || '',
    lifestyleAnalysis: {
      dailyFlow: familyPlanAnalysis?.lifestyleAnalysis?.dailyFlow || [],
      activityPatterns: familyPlanAnalysis?.lifestyleAnalysis?.activityPatterns || [],
      specialNeeds: familyPlanAnalysis?.lifestyleAnalysis?.specialNeeds || [],
    },
    storageAssessment: {
      sufficiency: familyPlanAnalysis?.storageAssessment?.sufficiency || 'moderate',
      currentCapacity: familyPlanAnalysis?.storageAssessment?.currentCapacity || '',
      requiredCapacity: familyPlanAnalysis?.storageAssessment?.requiredCapacity || '',
      gap: familyPlanAnalysis?.storageAssessment?.gap || '',
      suggestions: familyPlanAnalysis?.storageAssessment?.suggestions || [],
    },
    growthPlanning: {
      childSpace: familyPlanAnalysis?.growthPlanning?.childSpace || false,
      childAgeRange: familyPlanAnalysis?.growthPlanning?.childAgeRange || '',
      agingConsideration: familyPlanAnalysis?.growthPlanning?.agingConsideration || false,
      flexibilityRequirements: familyPlanAnalysis?.growthPlanning?.flexibilityRequirements || [],
      futureChanges: familyPlanAnalysis?.growthPlanning?.futureChanges || [],
    },
    spaceRecommendations: {
      functionalZones: familyPlanAnalysis?.spaceRecommendations?.functionalZones || [],
      roomLayoutSuggestions: familyPlanAnalysis?.spaceRecommendations?.roomLayoutSuggestions || [],
      multiPurposeSpaces: familyPlanAnalysis?.spaceRecommendations?.multiPurposeSpaces || [],
    },
  };
  
  const fpAnalysis3 = {
    renovationPriority: typeof decisionAnalysis?.renovationPriority === 'object' && decisionAnalysis.renovationPriority ? {
      phases: Array.isArray(decisionAnalysis.renovationPriority.phases) ? decisionAnalysis.renovationPriority.phases : [],
      criticalPath: Array.isArray(decisionAnalysis.renovationPriority.criticalPath) ? decisionAnalysis.renovationPriority.criticalPath : [],
    } : { phases: [], criticalPath: [] },
    costEstimation: typeof decisionAnalysis?.costEstimation === 'object' && decisionAnalysis.costEstimation ? {
      totalEstimate: typeof decisionAnalysis.costEstimation.totalEstimate === 'number' ? decisionAnalysis.costEstimation.totalEstimate : 0,
      currency: decisionAnalysis.costEstimation.currency || '元',
      breakdown: Array.isArray(decisionAnalysis.costEstimation.breakdown) ? decisionAnalysis.costEstimation.breakdown : [],
      costSavingTips: Array.isArray(decisionAnalysis.costEstimation.costSavingTips) ? decisionAnalysis.costEstimation.costSavingTips : [],
    } : { totalEstimate: 0, currency: '元', breakdown: [], costSavingTips: [] },
    pitfalls: Array.isArray(decisionAnalysis?.pitfalls) ? decisionAnalysis.pitfalls : [],
    constructionTips: Array.isArray(decisionAnalysis?.constructionTips) ? decisionAnalysis.constructionTips : [],
    materialSuggestions: Array.isArray(decisionAnalysis?.materialSuggestions) ? decisionAnalysis.materialSuggestions : [],
    timeline: typeof decisionAnalysis?.timeline === 'object' && decisionAnalysis.timeline ? {
      totalDuration: decisionAnalysis.timeline.totalDuration || '',
      milestones: Array.isArray(decisionAnalysis.timeline.milestones) ? decisionAnalysis.timeline.milestones : [],
    } : { totalDuration: '', milestones: [] },
  };
  
  const fpAnalysis4 = renderings || [];

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-helvetica">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between py-6 px-6 md:px-10 w-full max-w-[1536px] mx-auto">
          <Link href="/" className="flex items-center gap-[12px]">
            <div className="w-[32px] h-[32px] bg-[rgba(30,50,90,0.8)] rounded-[8px] flex items-center justify-center">
              <Home className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-regular tracking-tighter text-xl text-[rgba(30,50,90,0.9)]">HomeGPT</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8">
            <StepIndicator currentStep={4} />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#2D2D2D] mb-4">
              HomeGPT 设计方案报告
            </h1>
            <p className="text-[#5E6470]">
              以下是为您生成的专属设计建议，包含户型分析、家庭规划和装修决策
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white/20 p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-[rgba(30,50,90,0.8)]" />
              <span className="text-lg font-medium text-[#2D2D2D]">综合评分</span>
            </div>
            <div className="text-center">
              <span className="text-6xl font-bold text-[rgba(30,50,90,0.8)]">{fpAnalysis.overallScore}</span>
              <span className="text-2xl font-medium text-[#374151] ml-2">分</span>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreCard score={fpAnalysis.lighting.score} label="采光" color="#FFB800" />
              <ScoreCard score={fpAnalysis.ventilation.score} label="通风" color="#00D4FF" />
              <ScoreCard score={fpAnalysis.zoning.score} label="分区" color="#1E325A" />
              <ScoreCard score={fpAnalysis.utilization.score} label="利用率" color="#34C759" />
            </div>
          </div>

          <Section title="户型分析师" icon={<Layout className="w-5 h-5 text-[rgba(30,50,90,0.8)]" />}>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">户型结构</h3>
                <p className="text-[#374151]">
                  {fpAnalysis.structure}，面积约{fpAnalysis.area}平方米，层高{fpAnalysis.floorHeight}米
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#FFB800]" />
                  采光分析
                </h3>
                <p className="text-[#374151] mb-3">{fpAnalysis.lighting.description}</p>
                <div className="mb-3">
                  <p className="text-sm text-[#5E6470] mb-2">窗户分布：</p>
                  <div className="grid grid-cols-2 gap-2">
                    {fpAnalysis.lighting.windows.map((win, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[#374151]">
                        <span className="w-2 h-2 bg-[#FFB800] rounded-full" />
                        {win.location}：{win.size}，{win.orientation}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#5E6470] mb-2">优化建议：</p>
                  <ul className="space-y-2">
                    {fpAnalysis.lighting.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#34C759] mt-0.5" />
                        <span className="text-sm text-[#374151]">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#00D4FF]" />
                  通风分析
                </h3>
                <p className="text-[#374151] mb-3">{fpAnalysis.ventilation.description}</p>
                <div className="mb-3">
                  <p className="text-sm text-[#5E6470] mb-2">空气对流路径：</p>
                  <div className="flex flex-wrap gap-2">
                    {fpAnalysis.ventilation.airFlowPaths.map((path, i) => (
                      <span key={i} className="px-3 py-1 bg-[rgba(30,50,90,0.05)] rounded-full text-sm text-[rgba(30,50,90,0.8)]">
                        {path}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#5E6470] mb-2">优化建议：</p>
                  <ul className="space-y-2">
                    {fpAnalysis.ventilation.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#34C759] mt-0.5" />
                        <span className="text-sm text-[#374151]">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
                  动静分区
                </h3>
                <p className="text-[#374151] mb-3">{fpAnalysis.zoning.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-[#5E6470] mb-2">公共区域：</p>
                    <div className="flex flex-wrap gap-2">
                      {fpAnalysis.zoning.publicAreas.map((area, i) => (
                        <span key={i} className="px-2 py-1 bg-[rgba(30,50,90,0.05)] rounded text-xs text-[rgba(30,50,90,0.8)]">{area}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#5E6470] mb-2">私密区域：</p>
                    <div className="flex flex-wrap gap-2">
                      {fpAnalysis.zoning.privateAreas.map((area, i) => (
                        <span key={i} className="px-2 py-1 bg-[rgba(30,50,90,0.05)] rounded text-xs text-[rgba(30,50,90,0.8)]">{area}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2 flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-[#34C759]" />
                  空间利用率
                </h3>
                <p className="text-[#374151] mb-3">{fpAnalysis.utilization.description}</p>
                <div className="mb-3">
                  <p className="text-sm text-[#FF3B30] mb-2">浪费空间：</p>
                  <ul className="space-y-1">
                    {fpAnalysis.utilization.wastedSpaces.map((space, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-[#FF3B30]" />
                        <span className="text-[#374151]">{space}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-[#34C759] mb-2">可优化区域：</p>
                  <div className="flex flex-wrap gap-2">
                    {fpAnalysis.utilization.optimizableAreas.map((area, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 rounded text-xs text-green-700">{area}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-[#34C759] mb-2">优点</h3>
                  <ul className="space-y-2">
                    {fpAnalysis.advantages.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                        <span className="text-sm text-[#374151]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#FF3B30] mb-2">缺点</h3>
                  <ul className="space-y-2">
                    {fpAnalysis.disadvantages.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-[#FF3B30]" />
                        <span className="text-sm text-[#374151]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          <Section title="家庭生活规划师" icon={<Users className="w-5 h-5 text-[rgba(30,50,90,0.8)]" />}>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">家庭画像</h3>
                <p className="text-[#374151]">{fpAnalysis2.familyProfile}</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">生活方式分析</h3>
                <div className="space-y-3">
                  {fpAnalysis2.lifestyleAnalysis.dailyFlow.map((flow, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-white/40 rounded-lg">
                      <Clock className="w-4 h-4 text-[rgba(30,50,90,0.8)] mt-0.5" />
                      <span className="text-sm text-[#374151]">{flow}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">日常活动模式</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E5EA]">
                        <th className="text-left py-2 px-3 text-[#5E6470]">时间段</th>
                        <th className="text-left py-2 px-3 text-[#5E6470]">活动内容</th>
                        <th className="text-left py-2 px-3 text-[#5E6470]">活动地点</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fpAnalysis2.lifestyleAnalysis.activityPatterns.map((pattern, i) => (
                        <tr key={i} className="border-b border-[#E5E5EA]/50">
                          <td className="py-2 px-3 text-[#374151]">{pattern.time}</td>
                          <td className="py-2 px-3 text-[#374151]">{pattern.activity}</td>
                          <td className="py-2 px-3 text-[#374151]">{pattern.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">特殊需求</h3>
                <div className="flex flex-wrap gap-2">
                  {fpAnalysis2.lifestyleAnalysis.specialNeeds.map((need, i) => (
                    <span key={i} className="px-3 py-1 bg-[rgba(30,50,90,0.05)] rounded-full text-sm text-[rgba(30,50,90,0.8)]">
                      {need}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">收纳评估</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/40 rounded-lg">
                    <p className="text-xs text-[#5E6470] mb-1">当前容量</p>
                    <p className="font-semibold text-[#2D2D2D]">{fpAnalysis2.storageAssessment.currentCapacity}</p>
                  </div>
                  <div className="text-center p-3 bg-white/40 rounded-lg">
                    <p className="text-xs text-[#5E6470] mb-1">所需容量</p>
                    <p className="font-semibold text-[#2D2D2D]">{fpAnalysis2.storageAssessment.requiredCapacity}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-600 mb-1">缺口</p>
                    <p className="font-semibold text-orange-700">{fpAnalysis2.storageAssessment.gap}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#5E6470] mb-3">收纳解决方案：</p>
                  <div className="space-y-3">
                    {fpAnalysis2.storageAssessment.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/40 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-[rgba(30,50,90,0.8)] text-white text-xs flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-[#2D2D2D]">{s.area}</p>
                          <p className="text-sm text-[#374151]">{s.solution}</p>
                          <p className="text-xs text-[rgba(30,50,90,0.8)] mt-1">{s.estimatedCost}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">成长空间规划</h3>
                <div className="space-y-4">
                  {fpAnalysis2.growthPlanning.futureChanges.map((change, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <span className="px-2 py-1 bg-[rgba(30,50,90,0.05)] rounded text-xs text-[rgba(30,50,90,0.8)]">{change.timeframe}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#2D2D2D]">{change.change}</p>
                        <p className="text-sm text-[#374151]">{change.planningSuggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">空间规划建议</h3>
                <div className="space-y-4">
                  {fpAnalysis2.spaceRecommendations.roomLayoutSuggestions.map((room, i) => (
                    <div key={i} className="p-4 bg-white/40 rounded-lg">
                      <p className="font-semibold text-[#2D2D2D] mb-1">{room.room}</p>
                      <p className="text-sm text-[#374151] mb-2">{room.layout}</p>
                      <div className="flex flex-wrap gap-2">
                        {room.furniture.map((f, j) => (
                          <span key={j} className="px-2 py-1 bg-white rounded text-xs text-[#374151] border border-[#E5E5EA]">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="装修决策师" icon={<Layers className="w-5 h-5 text-[rgba(30,50,90,0.8)]" />}>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-3">装修优先级（分阶段实施）</h3>
                <PhaseTimeline phases={fpAnalysis3.renovationPriority.phases} />
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-3">费用估算明细</h3>
                <div className="bg-white/40 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5E6470]">总预算</span>
                    <span className="text-2xl font-bold text-[rgba(30,50,90,0.8)]">
                      {fpAnalysis3.costEstimation.totalEstimate.toLocaleString()}元
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {fpAnalysis3.costEstimation.breakdown.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-[#2D2D2D]">{cat.category}</span>
                        <span className="text-sm text-[#5E6470] ml-2">{cat.description}</span>
                      </div>
                      <span className="font-semibold text-[rgba(30,50,90,0.8)]">
                        {cat.amount.toLocaleString()}元
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">省钱小贴士：</p>
                  <ul className="space-y-1">
                    {fpAnalysis3.costEstimation.costSavingTips.map((tip, i) => (
                      <li key={i} className="text-sm text-blue-600">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-3">装修避坑指南</h3>
                <div className="space-y-4">
                  {fpAnalysis3.pitfalls.map((cat, i) => (
                    <div key={i} className="p-4 bg-white/40 rounded-lg">
                      <h4 className="font-semibold text-[#2D2D2D] mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        {cat.category}
                      </h4>
                      <div className="space-y-2">
                        {cat.items.map((item, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <div className="flex-1">
                              <p className="font-medium text-[#2D2D2D]">{item.title}</p>
                              <p className="text-sm text-[#5E6470]">{item.description}</p>
                              <RiskBadge level={item.riskLevel as 'high' | 'medium' | 'low'} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-3">施工建议</h3>
                <div className="space-y-4">
                  {fpAnalysis3.constructionTips.map((tip, i) => (
                    <div key={i} className="p-4 bg-white/40 rounded-lg">
                      <h4 className="font-semibold text-[#2D2D2D] mb-2 flex items-center gap-2">
                        <Hammer className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
                        {tip.area}
                      </h4>
                      <ul className="space-y-1">
                        {(tip.tips || []).map((t, j) => (
                          <li key={j} className="text-sm text-[#374151]">{t}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-3">材料推荐</h3>
                <div className="space-y-4">
                  {fpAnalysis3.materialSuggestions.map((mat, i) => (
                    <div key={i} className="p-4 bg-white/40 rounded-lg">
                      <h4 className="font-semibold text-[#2D2D2D] mb-2">{mat.area}</h4>
                      <div className="space-y-2">
                        {(mat.recommendations || []).map((r, j) => (
                          <div key={j} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[#2D2D2D]">{r.material}</p>
                              <p className="text-sm text-[#5E6470]">{r.brand}</p>
                            </div>
                            <span className="text-sm text-[rgba(30,50,90,0.8)]">{r.priceRange}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2D2D2D] mb-3">时间规划</h3>
                <div className="p-4 bg-white/40 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#5E6470]">总工期</span>
                    <span className="text-xl font-bold text-[rgba(30,50,90,0.8)]">{fpAnalysis3.timeline.totalDuration}</span>
                  </div>
                  <div className="space-y-2">
                    {fpAnalysis3.timeline.milestones.map((m, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-[#374151]">{m.event}</span>
                        <span className="text-[#5E6470]">{m.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {fpAnalysis4.length > 0 && (
            <Section title="AI 设计效果图" icon={<ImageIcon className="w-5 h-5 text-[rgba(30,50,90,0.8)]" />}>
              <div className="grid md:grid-cols-2 gap-6">
                {fpAnalysis4.map((rendering, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      {rendering.status === 'generated' && rendering.imageUrl ? (
                        <img
                          src={rendering.imageUrl}
                          alt={rendering.area}
                          className="w-full h-full object-cover"
                        />
                      ) : rendering.status === 'generating' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <RefreshCw className="w-8 h-8 text-[rgba(30,50,90,0.8)] animate-spin" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#5E6470]">
                          暂无效果图
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-[#2D2D2D]">{rendering.area}</h4>
                        <p className="text-sm text-[#5E6470]">{rendering.style}</p>
                      </div>
                      {rendering.status === 'generated' && rendering.imageUrl && (
                        <button
                          onClick={() => handleRegenerateImage(rendering.area, rendering.prompt)}
                          disabled={regeneratingArea === rendering.area}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-[rgba(30,50,90,0.8)] hover:bg-[rgba(30,50,90,0.05)] rounded-lg transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${regeneratingArea === rendering.area ? 'animate-spin' : ''}`} />
                          重新生成
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button
              onClick={handleExportWord}
              className="flex items-center gap-2 px-6 py-3 bg-white/80 text-[rgba(30,50,90,0.8)] rounded-full border border-white/20 hover:bg-white/60 transition-colors"
            >
              <Download className="w-4 h-4" />
              导出报告
            </button>
            <button
              onClick={handleRedesign}
              className="flex items-center gap-2 px-6 py-3 bg-[rgba(30,50,90,0.8)] text-white rounded-full hover:bg-[rgba(30,50,90,1)] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重新设计
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
