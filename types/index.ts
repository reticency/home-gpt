export const FamilyMemberType = {
  SINGLE: 'single',
  COUPLE: 'couple',
  CHILD: 'child',
  ELDER: 'elder',
  PET: 'pet',
} as const;

export type FamilyMemberType = typeof FamilyMemberType[keyof typeof FamilyMemberType];

export const StyleType = {
  WOOD: 'wood',
  MODERN: 'modern',
  NORDIC: 'nordic',
  LUXURY: 'luxury',
  CHINESE: 'chinese',
  JAPANESE: 'japanese',
} as const;

export type StyleType = typeof StyleType[keyof typeof StyleType];

export const RequirementType = {
  STORAGE: 'storage',
  PARENTING: 'parenting',
  WORK: 'work',
  ENTERTAINMENT: 'entertainment',
  ACCESSIBILITY: 'accessibility',
} as const;

export type RequirementType = typeof RequirementType[keyof typeof RequirementType];

export const ProjectStatus = {
  PENDING: 'pending',
  ANALYZING: 'analyzing',
  COMPLETE: 'complete',
  FAILED: 'failed',
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface FloorPlan {
  base64: string;
  filename: string;
  type: 'image' | 'pdf' | 'screenshot';
  size: number;
}

export interface FamilyMember {
  type: FamilyMemberType;
  count?: number;
}

export interface UserRequirement {
  type: RequirementType;
}

export interface ProjectData {
  id: string;
  floorPlan: FloorPlan;
  familyMembers: FamilyMember[];
  budget: number;
  style: StyleType;
  requirements: UserRequirement[];
  status: ProjectStatus;
  createdAt: number;
}

export interface FloorPlanAnalysis {
  structure: string;
  roomCount: number;
  area: number;
  floorHeight: number;
  lighting: {
    score: number;
    description: string;
    windows: {
      location: string;
      size: string;
      orientation: string;
    }[];
    suggestions: string[];
  };
  ventilation: {
    score: number;
    description: string;
    airFlowPaths: string[];
    suggestions: string[];
  };
  zoning: {
    score: number;
    description: string;
    publicAreas: string[];
    privateAreas: string[];
    suggestions: string[];
  };
  utilization: {
    score: number;
    description: string;
    wastedSpaces: string[];
    optimizableAreas: string[];
    suggestions: string[];
  };
  advantages: string[];
  disadvantages: string[];
  overallScore: number;
}

export interface FamilyPlanAnalysis {
  familyType: string;
  familyProfile: string;
  lifestyleAnalysis: {
    dailyFlow: string[];
    activityPatterns: {
      time: string;
      activity: string;
      location: string;
    }[];
    specialNeeds: string[];
  };
  storageAssessment: {
    sufficiency: 'adequate' | 'moderate' | 'insufficient';
    currentCapacity: string;
    requiredCapacity: string;
    gap: string;
    suggestions: {
      area: string;
      solution: string;
      estimatedCost: string;
    }[];
  };
  growthPlanning: {
    childSpace: boolean;
    childAgeRange: string;
    agingConsideration: boolean;
    flexibilityRequirements: string[];
    futureChanges: {
      timeframe: string;
      change: string;
      planningSuggestion: string;
    }[];
  };
  spaceRecommendations: {
    functionalZones: string[];
    roomLayoutSuggestions: {
      room: string;
      layout: string;
      furniture: string[];
    }[];
    multiPurposeSpaces: {
      space: string;
      purposes: string[];
      implementation: string;
    }[];
  };
}

export interface DecisionAnalysis {
  renovationPriority: {
    phases: {
      phase: number;
      name: string;
      duration: string;
      costRange: string;
      focus: string[];
      keyTasks: string[];
    }[];
    criticalPath: string[];
  };
  costEstimation: {
    totalEstimate: number;
    currency: string;
    breakdown: {
      category: string;
      description: string;
      amount: number;
      percentage: number;
      items: {
        name: string;
        unit: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }[];
    }[];
    costSavingTips: string[];
  };
  pitfalls: {
    category: string;
    items: {
      title: string;
      riskLevel: 'high' | 'medium' | 'low';
      description: string;
      prevention: string;
      solution: string;
    }[];
  }[];
  constructionTips: {
    area: string;
    tips: string[];
  }[];
  materialSuggestions: {
    area: string;
    recommendations: {
      material: string;
      brand: string;
      reason: string;
      priceRange: string;
    }[];
  }[];
  timeline: {
    totalDuration: string;
    milestones: {
      date: string;
      event: string;
      responsible: string;
    }[];
  };
}

export interface RenderingImage {
  area: string;
  imageUrl: string;
  prompt: string;
  style: string;
  status: 'pending' | 'generating' | 'generated' | 'failed';
  generatedAt?: number;
}

export interface AnalysisResult {
  projectId: string;
  floorPlanAnalysis: FloorPlanAnalysis;
  familyPlanAnalysis: FamilyPlanAnalysis;
  decisionAnalysis: DecisionAnalysis;
  renderings: RenderingImage[];
  analyzedAt: number;
}

export interface HomeGPTData {
  currentProject: ProjectData | null;
  projects: ProjectData[];
  analysisResults: Record<string, AnalysisResult>;
}