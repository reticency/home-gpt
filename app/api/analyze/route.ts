import { NextRequest, NextResponse } from 'next/server';
import { DoubaoAPI } from '@/utils/ai';
import type { FloorPlanAnalysis, FamilyPlanAnalysis, DecisionAnalysis, AnalysisResult, RenderingImage } from '@/types';

const styleMap: Record<string, string> = {
  wood: '原木风',
  modern: '现代简约',
  nordic: '北欧风',
  luxury: '轻奢风',
  chinese: '新中式',
  japanese: '日式',
};

const requirementMap: Record<string, string> = {
  storage: '大量收纳',
  parenting: '亲子互动',
  work: '工作学习',
  entertainment: '休闲娱乐',
  accessibility: '无障碍',
};

function parseJSONSafely(str: string): unknown {
  try {
    const jsonMatch = str.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }
  return 0;
}

function normalizeFloorPlanAnalysis(data: unknown): FloorPlanAnalysis {
  const d = data as Partial<FloorPlanAnalysis> || {};
  return {
    structure: d.structure || '',
    roomCount: parseNumber(d.roomCount),
    area: parseNumber(d.area),
    floorHeight: parseNumber(d.floorHeight),
    lighting: typeof d.lighting === 'object' && d.lighting ? {
      score: parseNumber(d.lighting.score),
      description: d.lighting.description || '',
      windows: Array.isArray(d.lighting.windows) ? d.lighting.windows.map(w => ({
        location: w?.location || '',
        size: w?.size || '',
        orientation: w?.orientation || '',
      })).filter(w => w.location) : [],
      suggestions: Array.isArray(d.lighting.suggestions) ? d.lighting.suggestions : [],
    } : { score: 0, description: '', windows: [], suggestions: [] },
    ventilation: typeof d.ventilation === 'object' && d.ventilation ? {
      score: parseNumber(d.ventilation.score),
      description: d.ventilation.description || '',
      airFlowPaths: Array.isArray(d.ventilation.airFlowPaths) ? d.ventilation.airFlowPaths : [],
      suggestions: Array.isArray(d.ventilation.suggestions) ? d.ventilation.suggestions : [],
    } : { score: 0, description: '', airFlowPaths: [], suggestions: [] },
    zoning: typeof d.zoning === 'object' && d.zoning ? {
      score: parseNumber(d.zoning.score),
      description: d.zoning.description || '',
      publicAreas: Array.isArray(d.zoning.publicAreas) ? d.zoning.publicAreas : [],
      privateAreas: Array.isArray(d.zoning.privateAreas) ? d.zoning.privateAreas : [],
      suggestions: Array.isArray(d.zoning.suggestions) ? d.zoning.suggestions : [],
    } : { score: 0, description: '', publicAreas: [], privateAreas: [], suggestions: [] },
    utilization: typeof d.utilization === 'object' && d.utilization ? {
      score: parseNumber(d.utilization.score),
      description: d.utilization.description || '',
      wastedSpaces: Array.isArray(d.utilization.wastedSpaces) ? d.utilization.wastedSpaces : [],
      optimizableAreas: Array.isArray(d.utilization.optimizableAreas) ? d.utilization.optimizableAreas : [],
      suggestions: Array.isArray(d.utilization.suggestions) ? d.utilization.suggestions : [],
    } : { score: 0, description: '', wastedSpaces: [], optimizableAreas: [], suggestions: [] },
    advantages: Array.isArray(d.advantages) ? d.advantages : [],
    disadvantages: Array.isArray(d.disadvantages) ? d.disadvantages : [],
    overallScore: parseNumber(d.overallScore),
  };
}

function normalizeFamilyPlanAnalysis(data: unknown): FamilyPlanAnalysis {
  const d = data as Partial<FamilyPlanAnalysis> || {};
  return {
    familyType: d.familyType || '',
    familyProfile: d.familyProfile || '',
    lifestyleAnalysis: typeof d.lifestyleAnalysis === 'object' && d.lifestyleAnalysis ? {
      dailyFlow: Array.isArray(d.lifestyleAnalysis.dailyFlow) ? d.lifestyleAnalysis.dailyFlow : [],
      activityPatterns: Array.isArray(d.lifestyleAnalysis.activityPatterns) ? d.lifestyleAnalysis.activityPatterns : [],
      specialNeeds: Array.isArray(d.lifestyleAnalysis.specialNeeds) ? d.lifestyleAnalysis.specialNeeds : [],
    } : { dailyFlow: [], activityPatterns: [], specialNeeds: [] },
    storageAssessment: typeof d.storageAssessment === 'object' && d.storageAssessment ? {
      sufficiency: d.storageAssessment.sufficiency || 'moderate',
      currentCapacity: d.storageAssessment.currentCapacity || '',
      requiredCapacity: d.storageAssessment.requiredCapacity || '',
      gap: d.storageAssessment.gap || '',
      suggestions: Array.isArray(d.storageAssessment.suggestions) ? d.storageAssessment.suggestions : [],
    } : { sufficiency: 'moderate', currentCapacity: '', requiredCapacity: '', gap: '', suggestions: [] },
    growthPlanning: typeof d.growthPlanning === 'object' && d.growthPlanning ? {
      childSpace: !!d.growthPlanning.childSpace,
      childAgeRange: d.growthPlanning.childAgeRange || '',
      agingConsideration: !!d.growthPlanning.agingConsideration,
      flexibilityRequirements: Array.isArray(d.growthPlanning.flexibilityRequirements) ? d.growthPlanning.flexibilityRequirements : [],
      futureChanges: Array.isArray(d.growthPlanning.futureChanges) ? d.growthPlanning.futureChanges : [],
    } : { childSpace: false, childAgeRange: '', agingConsideration: false, flexibilityRequirements: [], futureChanges: [] },
    spaceRecommendations: typeof d.spaceRecommendations === 'object' && d.spaceRecommendations ? {
      functionalZones: Array.isArray(d.spaceRecommendations.functionalZones) ? d.spaceRecommendations.functionalZones : [],
      roomLayoutSuggestions: Array.isArray(d.spaceRecommendations.roomLayoutSuggestions) ? d.spaceRecommendations.roomLayoutSuggestions : [],
      multiPurposeSpaces: Array.isArray(d.spaceRecommendations.multiPurposeSpaces) ? d.spaceRecommendations.multiPurposeSpaces : [],
    } : { functionalZones: [], roomLayoutSuggestions: [], multiPurposeSpaces: [] },
  };
}

function normalizeDecisionAnalysis(data: unknown, budget: number): DecisionAnalysis {
  const d = data as Partial<DecisionAnalysis> || {};
  
  const phases = Array.isArray(d.renovationPriority?.phases) ? d.renovationPriority.phases.map(phase => ({
    phase: parseNumber(phase?.phase),
    name: phase?.name || '',
    duration: phase?.duration || '',
    costRange: phase?.costRange || '',
    focus: Array.isArray(phase?.focus) ? phase.focus : [],
    keyTasks: Array.isArray(phase?.keyTasks) ? phase.keyTasks : [],
  })).filter(p => p.name) : [];
  
  const breakdown = Array.isArray(d.costEstimation?.breakdown) ? d.costEstimation.breakdown.map(cat => ({
    category: cat?.category || '',
    description: cat?.description || '',
    amount: parseNumber(cat?.amount),
    percentage: parseNumber(cat?.percentage),
    items: Array.isArray(cat?.items) ? cat.items.map(item => ({
      name: item?.name || '',
      unit: item?.unit || '',
      quantity: parseNumber(item?.quantity),
      unitPrice: parseNumber(item?.unitPrice),
      totalPrice: parseNumber(item?.totalPrice),
    })).filter(i => i.name) : [],
  })).filter(c => c.category) : [];
  
  const pitfalls = Array.isArray(d.pitfalls) ? d.pitfalls.map(cat => ({
    category: cat?.category || '',
    items: Array.isArray(cat?.items) ? cat.items.map(item => ({
      title: item?.title || '',
      riskLevel: (item?.riskLevel as 'high' | 'medium' | 'low') || 'medium',
      description: item?.description || '',
      prevention: item?.prevention || '',
      solution: item?.solution || '',
    })).filter(i => i.title) : [],
  })).filter(c => c.category) : [];
  
  const materialSuggestions = Array.isArray(d.materialSuggestions) ? d.materialSuggestions.map(mat => ({
    area: mat?.area || '',
    recommendations: Array.isArray(mat?.recommendations) ? mat.recommendations.map(r => ({
      material: r?.material || '',
      brand: r?.brand || '',
      reason: r?.reason || '',
      priceRange: r?.priceRange || '',
    })).filter(r => r.material) : [],
  })).filter(m => m.area) : [];
  
  const milestones = Array.isArray(d.timeline?.milestones) ? d.timeline.milestones.map(m => ({
    date: m?.date || '',
    event: m?.event || '',
    responsible: m?.responsible || '',
  })).filter(m => m.event) : [];
  
  return {
    renovationPriority: {
      phases,
      criticalPath: Array.isArray(d.renovationPriority?.criticalPath) ? d.renovationPriority.criticalPath : [],
    },
    costEstimation: {
      totalEstimate: typeof d.costEstimation?.totalEstimate === 'number' && d.costEstimation.totalEstimate > 0 ? d.costEstimation.totalEstimate : budget,
      currency: d.costEstimation?.currency || '元',
      breakdown,
      costSavingTips: Array.isArray(d.costEstimation?.costSavingTips) ? d.costEstimation.costSavingTips : [],
    },
    pitfalls,
    constructionTips: Array.isArray(d.constructionTips) ? d.constructionTips.map(tip => ({
      area: tip?.area || '',
      tips: Array.isArray(tip?.tips) ? tip.tips : [],
    })).filter(t => t.area) : [],
    materialSuggestions,
    timeline: {
      totalDuration: d.timeline?.totalDuration || '',
      milestones,
    },
  };
}

async function getMockFloorPlanAnalysis(): Promise<FloorPlanAnalysis> {
  return {
    structure: '三室两厅一卫',
    roomCount: 5,
    area: 120,
    floorHeight: 2.8,
    lighting: {
      score: 85,
      description: '整体采光良好，客厅和主卧朝南，次卧朝东，厨房窗户较小',
      windows: [
        { location: '客厅', size: '1.8m×1.5m', orientation: '朝南' },
        { location: '主卧', size: '1.5m×1.2m', orientation: '朝南' },
        { location: '次卧', size: '1.2m×1.0m', orientation: '朝东' },
        { location: '厨房', size: '0.8m×0.8m', orientation: '朝北' },
      ],
      suggestions: [
        '客厅可增加落地窗，提升采光面积',
        '厨房建议加装灯带，弥补采光不足',
        '次卧可考虑使用浅色墙面增强光线感',
      ],
    },
    ventilation: {
      score: 78,
      description: '南北通透，客厅与餐厅形成对流，但卫生间通风较差',
      airFlowPaths: ['客厅→餐厅→阳台', '主卧→客厅'],
      suggestions: [
        '卫生间建议安装强力排气扇',
        '餐厅与阳台之间可考虑移门设计',
        '可在过道增加通风百叶',
      ],
    },
    zoning: {
      score: 90,
      description: '动静分区合理，卧室集中在一侧，公共区域在另一侧',
      publicAreas: ['客厅', '餐厅', '厨房', '阳台'],
      privateAreas: ['主卧', '次卧', '书房'],
      suggestions: [
        '入户可增加玄关柜，形成入户缓冲区',
        '客厅与餐厅之间可考虑半隔断设计',
      ],
    },
    utilization: {
      score: 82,
      description: '整体利用率较高，但存在部分浪费空间',
      wastedSpaces: ['入户走廊较宽', '主卧卫生间门口空间'],
      optimizableAreas: ['阳台', '过道', '飘窗'],
      suggestions: [
        '入户走廊可增加到顶柜',
        '阳台可设计多功能柜，兼顾洗衣和收纳',
        '飘窗可改造为储物空间',
      ],
    },
    advantages: ['南北通透', '动静分离', '采光良好', '户型方正'],
    disadvantages: ['厨房采光不足', '入户空间浪费', '卫生间通风较差'],
    overallScore: 84,
  };
}

async function getMockFamilyPlanAnalysis(familyMembers: unknown[], requirements: unknown[]): Promise<FamilyPlanAnalysis> {
  const hasChild = (familyMembers as Array<{ type: string }>).some(m => m.type === 'child');
  const hasElder = (familyMembers as Array<{ type: string }>).some(m => m.type === 'elder');
  const hasStorage = (requirements as Array<{ type: string }>).some(r => r.type === 'storage');

  return {
    familyType: hasChild && hasElder ? '多代同堂' : hasChild ? '有娃家庭' : '新婚夫妻',
    familyProfile: hasChild 
      ? '夫妻二人+1个孩子，需要充足的收纳空间和儿童活动区域' 
      : '年轻夫妻，注重生活品质和空间利用',
    lifestyleAnalysis: {
      dailyFlow: [
        '早晨：主卧起床→卫生间洗漱→厨房早餐→客厅整装→出门',
        '晚间：入户→厨房准备晚餐→餐厅用餐→客厅休闲→卧室休息',
      ],
      activityPatterns: [
        { time: '07:00-08:00', activity: '洗漱早餐', location: '卫生间、厨房、餐厅' },
        { time: '08:00-09:00', activity: '准备出门', location: '客厅、玄关' },
        { time: '18:00-19:00', activity: '晚餐准备', location: '厨房' },
        { time: '19:00-21:00', activity: '家庭时光', location: '客厅、餐厅' },
        { time: '21:00-22:00', activity: '睡前准备', location: '卧室、卫生间' },
      ],
      specialNeeds: hasChild 
        ? ['儿童安全防护', '儿童学习空间', '亲子互动区域']
        : ['工作学习空间', '休闲娱乐区域'],
    },
    storageAssessment: {
      sufficiency: hasStorage ? 'insufficient' : 'moderate',
      currentCapacity: '约30立方米',
      requiredCapacity: '约45立方米',
      gap: '约15立方米',
      suggestions: [
        { area: '玄关', solution: '到顶玄关柜，底部留空放鞋，中间留空放钥匙', estimatedCost: '3000-5000元' },
        { area: '客厅', solution: '电视柜+背景墙收纳柜组合', estimatedCost: '8000-12000元' },
        { area: '餐厅', solution: '餐边柜+酒柜组合，兼顾储物和展示', estimatedCost: '5000-8000元' },
        { area: '卧室', solution: 'L型到顶衣柜，分区明确', estimatedCost: '10000-15000元' },
        { area: '阳台', solution: '阳台柜+洗衣机柜组合', estimatedCost: '4000-6000元' },
      ],
    },
    growthPlanning: {
      childSpace: hasChild,
      childAgeRange: hasChild ? '0-6岁' : '',
      agingConsideration: hasElder,
      flexibilityRequirements: [
        '儿童房预留学习区',
        '公共区域预留无障碍改造空间',
        '家具选择可调节高度的款式',
      ],
      futureChanges: [
        { timeframe: '3-5年', change: '孩子长大，需要独立学习空间', planningSuggestion: '儿童房预留书桌位置，可后期改造' },
        { timeframe: '5-10年', change: '可能需要照顾老人', planningSuggestion: '次卧预留护理床空间，卫生间预留扶手安装位' },
        { timeframe: '10年以上', change: '孩子独立，空间重新规划', planningSuggestion: '客厅可预留开放式书房改造可能' },
      ],
    },
    spaceRecommendations: {
      functionalZones: ['玄关收纳区', '客厅休闲区', '餐厅用餐区', '厨房操作区', '卧室休息区', '儿童活动区', '工作学习区'],
      roomLayoutSuggestions: [
        {
          room: '客厅',
          layout: '沙发靠墙，电视墙对面，留出中央活动空间',
          furniture: ['三人沙发', '茶几', '电视柜', '边柜'],
        },
        {
          room: '主卧',
          layout: '床居中，两侧床头柜，L型衣柜靠墙',
          furniture: ['1.8米床', '床头柜×2', 'L型衣柜', '梳妆台'],
        },
        {
          room: '儿童房',
          layout: '上床下桌设计，最大化利用空间',
          furniture: ['高低床', '书桌', '书架', '玩具收纳架'],
        },
        {
          room: '厨房',
          layout: 'U型操作台，洗切炒动线合理',
          furniture: ['橱柜', '吊柜', '电器柜', '餐边柜'],
        },
      ],
      multiPurposeSpaces: [
        {
          space: '阳台',
          purposes: ['洗衣晾晒', '储物', '休闲阅读'],
          implementation: '阳台柜+洗衣机+休闲椅组合',
        },
        {
          space: '客厅角落',
          purposes: ['临时办公', '孩子学习', '展示'],
          implementation: '可移动书桌+书架组合',
        },
      ],
    },
  };
}

async function getMockDecisionAnalysis(budget: number): Promise<DecisionAnalysis> {
  return {
    renovationPriority: {
      phases: [
        {
          phase: 1,
          name: '基础改造',
          duration: '2-3周',
          costRange: `${Math.floor(budget * 0.3)}-${Math.floor(budget * 0.4)}元`,
          focus: ['水电改造', '墙体拆改', '地面找平'],
          keyTasks: ['确定水电点位', '拆除非承重墙', '地面墙面找平', '防水处理'],
        },
        {
          phase: 2,
          name: '硬装施工',
          duration: '4-6周',
          costRange: `${Math.floor(budget * 0.35)}-${Math.floor(budget * 0.45)}元`,
          focus: ['瓷砖铺贴', '墙面处理', '吊顶安装', '门窗更换'],
          keyTasks: ['厨卫瓷砖铺贴', '墙面乳胶漆', '客厅吊顶', '卧室木地板'],
        },
        {
          phase: 3,
          name: '定制安装',
          duration: '2-3周',
          costRange: `${Math.floor(budget * 0.15)}-${Math.floor(budget * 0.2)}元`,
          focus: ['定制柜体', '厨房安装', '卫浴安装'],
          keyTasks: ['橱柜安装', '衣柜安装', '卫浴洁具安装', '开关插座安装'],
        },
        {
          phase: 4,
          name: '软装收尾',
          duration: '1-2周',
          costRange: `${Math.floor(budget * 0.1)}-${Math.floor(budget * 0.15)}元`,
          focus: ['家具进场', '软装布置', '清洁验收'],
          keyTasks: ['沙发茶几进场', '床和床垫', '窗帘安装', '装饰画和绿植'],
        },
      ],
      criticalPath: ['水电改造', '防水验收', '瓷砖铺贴', '柜体安装'],
    },
    costEstimation: {
      totalEstimate: budget,
      currency: '元',
      breakdown: [
        {
          category: '基础工程',
          description: '水电改造、防水、墙体拆改等',
          amount: Math.floor(budget * 0.35),
          percentage: 35,
          items: [
            { name: '水电改造', unit: '米', quantity: 150, unitPrice: 80, totalPrice: 12000 },
            { name: '防水处理', unit: '平方米', quantity: 30, unitPrice: 120, totalPrice: 3600 },
            { name: '墙体拆改', unit: '平方米', quantity: 20, unitPrice: 150, totalPrice: 3000 },
            { name: '地面找平', unit: '平方米', quantity: 120, unitPrice: 35, totalPrice: 4200 },
          ],
        },
        {
          category: '硬装材料',
          description: '瓷砖、木地板、乳胶漆等',
          amount: Math.floor(budget * 0.25),
          percentage: 25,
          items: [
            { name: '瓷砖', unit: '平方米', quantity: 80, unitPrice: 150, totalPrice: 12000 },
            { name: '木地板', unit: '平方米', quantity: 40, unitPrice: 200, totalPrice: 8000 },
            { name: '乳胶漆', unit: '桶', quantity: 5, unitPrice: 600, totalPrice: 3000 },
            { name: '吊顶材料', unit: '平方米', quantity: 30, unitPrice: 100, totalPrice: 3000 },
          ],
        },
        {
          category: '定制柜体',
          description: '橱柜、衣柜、玄关柜等',
          amount: Math.floor(budget * 0.2),
          percentage: 20,
          items: [
            { name: '整体橱柜', unit: '延米', quantity: 4, unitPrice: 3500, totalPrice: 14000 },
            { name: '主卧衣柜', unit: '平方米', quantity: 6, unitPrice: 1500, totalPrice: 9000 },
            { name: '玄关柜', unit: '个', quantity: 1, unitPrice: 4000, totalPrice: 4000 },
            { name: '阳台柜', unit: '个', quantity: 1, unitPrice: 3000, totalPrice: 3000 },
          ],
        },
        {
          category: '软装家具',
          description: '沙发、床、餐桌椅等',
          amount: Math.floor(budget * 0.12),
          percentage: 12,
          items: [
            { name: '沙发', unit: '套', quantity: 1, unitPrice: 8000, totalPrice: 8000 },
            { name: '床', unit: '张', quantity: 2, unitPrice: 5000, totalPrice: 10000 },
            { name: '餐桌椅', unit: '套', quantity: 1, unitPrice: 3000, totalPrice: 3000 },
            { name: '窗帘', unit: '套', quantity: 4, unitPrice: 800, totalPrice: 3200 },
          ],
        },
        {
          category: '家电设备',
          description: '空调、洗衣机、热水器等',
          amount: Math.floor(budget * 0.08),
          percentage: 8,
          items: [
            { name: '空调', unit: '台', quantity: 3, unitPrice: 4000, totalPrice: 12000 },
            { name: '洗衣机', unit: '台', quantity: 1, unitPrice: 3000, totalPrice: 3000 },
            { name: '热水器', unit: '台', quantity: 1, unitPrice: 2000, totalPrice: 2000 },
          ],
        },
      ],
      costSavingTips: [
        '瓷砖选择广东佛山品牌，性价比高',
        '乳胶漆选择国产一线品牌，环保达标且价格适中',
        '定制柜体可选择本地工厂，比品牌店节省30%',
        '家具可在电商平台促销时购买，节省20-30%',
        '水电改造尽量走直线，减少管线长度',
      ],
    },
    pitfalls: [
      {
        category: '水电改造',
        items: [
          {
            title: '管线走向不规范',
            riskLevel: 'high',
            description: '水电管线随意排布，后期维修困难',
            prevention: '开工前绘制详细管线图，标注所有点位',
            solution: '使用透明线管，便于后期检修',
          },
          {
            title: '防水不到位',
            riskLevel: 'high',
            description: '卫生间防水做的不好，容易漏水到楼下',
            prevention: '防水施工后做24小时闭水试验',
            solution: '闭水试验合格后再进行下一步施工',
          },
        ],
      },
      {
        category: '瓷砖铺贴',
        items: [
          {
            title: '空鼓率过高',
            riskLevel: 'medium',
            description: '瓷砖粘贴不牢固，容易脱落',
            prevention: '使用瓷砖胶而非水泥砂浆',
            solution: '铺贴时敲击检查，发现空鼓及时重贴',
          },
          {
            title: '缝隙不均匀',
            riskLevel: 'medium',
            description: '瓷砖缝隙大小不一，影响美观',
            prevention: '使用十字卡控制缝隙大小',
            solution: '铺贴时及时调整，确保缝隙均匀',
          },
        ],
      },
      {
        category: '定制柜体',
        items: [
          {
            title: '尺寸误差',
            riskLevel: 'medium',
            description: '测量不准确导致柜体无法安装',
            prevention: '多次测量确认尺寸',
            solution: '安装前再次核对现场尺寸',
          },
          {
            title: '板材环保不达标',
            riskLevel: 'high',
            description: '板材甲醛超标，影响健康',
            prevention: '选择E0级或ENF级板材',
            solution: '要求商家提供环保检测报告',
          },
        ],
      },
    ],
    constructionTips: [
      {
        area: '水电改造',
        tips: [
          '强电走顶，弱电走地，避免交叉干扰',
          '厨房和卫生间插座要带防溅盒',
          '空调、冰箱等大功率电器要单独回路',
          '开关高度统一1.3米，插座高度统一0.3米',
        ],
      },
      {
        area: '瓷砖铺贴',
        tips: [
          '地砖从门口开始铺贴，保证进门视觉效果',
          '墙砖从下往上铺贴，留缝2-3毫米',
          '地漏周围瓷砖要做八字切割，便于排水',
          '铺贴完成后及时清理表面水泥',
        ],
      },
      {
        area: '墙面处理',
        tips: [
          '墙面要批刮三遍腻子，打磨平整',
          '乳胶漆要涂刷两遍底漆一遍面漆',
          '阴阳角要找直，使用护角条',
          '开关插座周边要贴美纹纸，避免污染',
        ],
      },
      {
        area: '定制安装',
        tips: [
          '橱柜安装要先装地柜再装吊柜',
          '衣柜安装要保证垂直，使用水平仪',
          '五金配件要选择品牌产品，耐用性好',
          '安装完成后要调试柜门开关是否顺畅',
        ],
      },
    ],
    materialSuggestions: [
      {
        area: '地面',
        recommendations: [
          { material: '广东瓷砖', brand: '东鹏/马可波罗', reason: '性价比高，质量稳定', priceRange: '80-150元/㎡' },
          { material: '多层实木地板', brand: '大自然/圣象', reason: '脚感舒适，环保性好', priceRange: '150-250元/㎡' },
          { material: 'SPC石塑地板', brand: '天格/生活家', reason: '防水防潮，安装方便', priceRange: '80-120元/㎡' },
        ],
      },
      {
        area: '墙面',
        recommendations: [
          { material: '乳胶漆', brand: '立邦/多乐士', reason: '环保达标，色彩丰富', priceRange: '400-600元/桶' },
          { material: '墙布', brand: '柔然/摩曼', reason: '质感好，无缝铺贴', priceRange: '80-150元/㎡' },
          { material: '硅藻泥', brand: '大津/兰舍', reason: '环保透气，调节湿度', priceRange: '150-300元/㎡' },
        ],
      },
      {
        area: '橱柜',
        recommendations: [
          { material: '颗粒板柜体', brand: '露水河/大亚', reason: '性价比高，平整度好', priceRange: '800-1200元/㎡' },
          { material: '多层实木板', brand: '兔宝宝/莫干山', reason: '稳定性好，承重能力强', priceRange: '1200-1800元/㎡' },
          { material: '石英石台面', brand: '赛凯隆/中迅', reason: '硬度高，耐刮擦', priceRange: '600-1000元/延米' },
        ],
      },
      {
        area: '卫浴',
        recommendations: [
          { material: '马桶', brand: '恒洁/箭牌', reason: '冲水效果好，节水', priceRange: '1500-3000元' },
          { material: '花洒', brand: '九牧/摩恩', reason: '出水均匀，耐用', priceRange: '800-1500元' },
          { material: '浴室柜', brand: '箭牌/法恩莎', reason: '防水防潮，收纳空间大', priceRange: '2000-4000元' },
        ],
      },
    ],
    timeline: {
      totalDuration: '10-14周',
      milestones: [
        { date: '第1周', event: '设计确认，签订合同', responsible: '业主+设计师' },
        { date: '第2-3周', event: '水电改造，防水施工', responsible: '水电工' },
        { date: '第4-6周', event: '瓷砖铺贴，墙面处理', responsible: '瓦工+油工' },
        { date: '第7-8周', event: '吊顶安装，门窗更换', responsible: '木工' },
        { date: '第9-10周', event: '定制柜体安装', responsible: '安装工' },
        { date: '第11-12周', event: '卫浴洁具安装', responsible: '水电工' },
        { date: '第13周', event: '家具进场，软装布置', responsible: '业主+软装师' },
        { date: '第14周', event: '竣工验收，交付使用', responsible: '业主+监理' },
      ],
    },
  };
}

function getMockRenderings(): RenderingImage[] {
  return [
    {
      area: '客厅',
      imageUrl: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop',
      prompt: '现代简约风格客厅，落地窗，灰色布艺沙发，原木茶几，绿植装饰，明亮通透，阳光充足',
      style: '现代简约风格',
      status: 'generated',
      generatedAt: Date.now(),
    },
    {
      area: '厨房',
      imageUrl: 'https://images.unsplash.com/photo-1566753295584-4c424787a8a7?w=800&h=600&fit=crop',
      prompt: '现代简约风格厨房，U型操作台，白色橱柜，灰色瓷砖，嵌入式电器，整洁明亮',
      style: '现代简约风格',
      status: 'generated',
      generatedAt: Date.now(),
    },
    {
      area: '卧室',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      prompt: '现代简约风格卧室，1.8米大床，灰色床头背景墙，原木衣柜，温馨柔和的灯光',
      style: '现代简约风格',
      status: 'generated',
      generatedAt: Date.now(),
    },
    {
      area: '卫生间',
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=600&fit=crop',
      prompt: '现代简约风格卫生间，干湿分离，白色瓷砖，智能马桶，淋浴区玻璃隔断',
      style: '现代简约风格',
      status: 'generated',
      generatedAt: Date.now(),
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, imageBase64, familyMembers, budget, style, requirements } = body;

    console.log('Analysis request received:', {
      projectId,
      hasImage: !!imageBase64,
      familyMembersCount: Array.isArray(familyMembers) ? familyMembers.length : 0,
      budget,
      style,
      requirementsCount: Array.isArray(requirements) ? requirements.length : 0,
    });

    const useAI = process.env.USE_AI === 'true' && !!process.env.ARK_API_KEY;

    let floorPlanAnalysis: FloorPlanAnalysis;
    let familyPlanAnalysis: FamilyPlanAnalysis;
    let decisionAnalysis: DecisionAnalysis;

    if (useAI) {
      const doubao = new DoubaoAPI();

      if (imageBase64 && imageBase64.startsWith('data:')) {
        try {
          const floorPlanResult = await doubao.analyzeFloorPlan(
            imageBase64,
            { familyMembers, style, requirements }
          );
          const floorPlanData = parseJSONSafely(floorPlanResult);
          floorPlanAnalysis = normalizeFloorPlanAnalysis(floorPlanData);
          console.log('Floor plan analysis completed');
        } catch (error) {
          console.error('Floor plan analysis failed:', error);
          floorPlanAnalysis = await getMockFloorPlanAnalysis();
          console.log('Using mock floor plan analysis');
        }
      } else {
        floorPlanAnalysis = await getMockFloorPlanAnalysis();
      }

      try {
        const familyResult = await doubao.analyzeFamilyPlan(
          familyMembers,
          { rooms: floorPlanAnalysis.roomCount || 5, area: floorPlanAnalysis.area || 120, structure: floorPlanAnalysis.structure || '三室两厅一卫' },
          requirements
        );
        const familyData = parseJSONSafely(familyResult);
        familyPlanAnalysis = normalizeFamilyPlanAnalysis(familyData);
        console.log('Family plan analysis completed');
      } catch (error) {
        console.error('Family plan analysis failed:', error);
        familyPlanAnalysis = await getMockFamilyPlanAnalysis(familyMembers, requirements);
        console.log('Using mock family plan analysis');
      }

      try {
        const decisionResult = await doubao.analyzeDecision(
          JSON.stringify(floorPlanAnalysis),
          JSON.stringify(familyPlanAnalysis),
          budget,
          styleMap[style] || style
        );
        const decisionData = parseJSONSafely(decisionResult);
        decisionAnalysis = normalizeDecisionAnalysis(decisionData, budget);
        console.log('Decision analysis completed');
      } catch (error) {
        console.error('Decision analysis failed:', error);
        decisionAnalysis = await getMockDecisionAnalysis(budget);
        console.log('Using mock decision analysis');
      }
    } else {
      console.log('AI not configured, using mock data');
      floorPlanAnalysis = await getMockFloorPlanAnalysis();
      familyPlanAnalysis = await getMockFamilyPlanAnalysis(familyMembers, requirements);
      decisionAnalysis = await getMockDecisionAnalysis(budget);
    }

    const result: AnalysisResult = {
      projectId,
      floorPlanAnalysis,
      familyPlanAnalysis,
      decisionAnalysis,
      renderings: getMockRenderings(),
      analyzedAt: Date.now(),
    };

    console.log('Analysis completed successfully');
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '分析失败' 
    }, { status: 500 });
  }
}