'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { ProjectData, AnalysisResult, FloorPlan, FamilyMember, StyleType, UserRequirement } from '@/types';
import { getStorageData, saveProject, saveAnalysisResult, getAnalysisResult, clearCurrentProject, generateId } from '@/utils/storage';

interface ProjectContextType {
  currentProject: ProjectData | null;
  analysisResult: AnalysisResult | null;
  setFloorPlan: (floorPlan: FloorPlan) => void;
  setRequirements: (familyMembers: FamilyMember[], budget: number, style: StyleType, requirements: UserRequirement[]) => void;
  startAnalysis: () => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  resetProject: () => void;
  isLoading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

const getInitialData = () => {
  if (typeof window === 'undefined') {
    return { currentProject: null, analysisResult: null };
  }
  const data = getStorageData();
  if (data.currentProject?.status === 'complete') {
    const result = getAnalysisResult(data.currentProject.id);
    return { currentProject: data.currentProject, analysisResult: result || null };
  }
  return { currentProject: data.currentProject || null, analysisResult: null };
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const initialData = getInitialData();
  const [currentProject, setCurrentProjectState] = useState<ProjectData | null>(initialData.currentProject);
  const [analysisResult, setAnalysisResultState] = useState<AnalysisResult | null>(initialData.analysisResult);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFloorPlan = useCallback(async (floorPlan: FloorPlan) => {
    const project: ProjectData = {
      id: generateId(),
      floorPlan,
      familyMembers: [],
      budget: 0,
      style: 'wood',
      requirements: [],
      status: 'pending',
      createdAt: Date.now(),
    };
    setCurrentProjectState(project);
    try {
      saveProject(project);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    }
  }, []);

  const setRequirements = useCallback((familyMembers: FamilyMember[], budget: number, style: StyleType, requirements: UserRequirement[]) => {
    setCurrentProjectState((prev) => {
      if (!prev) return prev;
      const updatedProject: ProjectData = {
        ...prev,
        familyMembers,
        budget: budget * 10000,
        style,
        requirements,
      };
      saveProject(updatedProject);
      return updatedProject;
    });
  }, []);

  const startAnalysis = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setCurrentProjectState((prev) => {
      if (!prev) return prev;
      const updatedProject: ProjectData = {
        ...prev,
        status: 'analyzing',
      };
      saveProject(updatedProject);
      return updatedProject;
    });
  }, []);

  const setAnalysisResult = useCallback((result: AnalysisResult) => {
    setAnalysisResultState(result);
    saveAnalysisResult(result);
    setIsLoading(false);
  }, []);

  const resetProject = useCallback(() => {
    setCurrentProjectState(null);
    setAnalysisResultState(null);
    setError(null);
    clearCurrentProject();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        analysisResult,
        setFloorPlan,
        setRequirements,
        startAnalysis,
        setAnalysisResult,
        resetProject,
        isLoading,
        error,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};