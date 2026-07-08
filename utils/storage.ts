import type { HomeGPTData, ProjectData, AnalysisResult } from '@/types';

const STORAGE_KEY = 'homegpt_data';

const defaultData: HomeGPTData = {
  currentProject: null,
  projects: [],
  analysisResults: {},
};

export const getStorageData = (): HomeGPTData => {
  if (typeof window === 'undefined') {
    return defaultData;
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
  } catch {
    return defaultData;
  }
};

export const setStorageData = (data: HomeGPTData): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('存储空间不足，请清除浏览器缓存或使用更小的图片');
    }
    throw new Error('保存数据失败，请重试');
  }
};

export const saveProject = (project: ProjectData): void => {
  const data = getStorageData();
  data.currentProject = project;
  data.projects = [project, ...data.projects.slice(0, 9)];
  setStorageData(data);
};

export const saveAnalysisResult = (result: AnalysisResult): void => {
  const data = getStorageData();
  data.analysisResults[result.projectId] = result;
  if (data.currentProject?.id === result.projectId) {
    data.currentProject.status = 'complete';
  }
  setStorageData(data);
};

export const getAnalysisResult = (projectId: string): AnalysisResult | undefined => {
  const data = getStorageData();
  return data.analysisResults[projectId];
};

export const clearCurrentProject = (): void => {
  const data = getStorageData();
  data.currentProject = null;
  setStorageData(data);
};

export const compressImage = async (file: File, maxWidth = 1024, quality = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to create canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};