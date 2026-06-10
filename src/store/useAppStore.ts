import { create } from 'zustand';
import type {
  TeachingDesign,
  APIConfig,
  AIProvider,
  TemplateType,
} from '../types/teaching-design';
import {
  createEmptyDesign,
  DEFAULT_API_CONFIG,
} from '../types/teaching-design';
import { BUILTIN_API_CONFIG } from '../ai/builtin-key';

interface AppState {
  // 当前教学设计
  currentDesign: TeachingDesign;
  // AI配置
  apiConfig: APIConfig;
  // UI状态
  selectedTemplate: TemplateType;
  // 历史记录
  history: TeachingDesign[];
  // AI生成中
  isAIGenerating: boolean;

  // 操作：设置设计
  setDesign: (design: TeachingDesign) => void;
  updateMeta: (meta: Partial<TeachingDesign['meta']>) => void;
  updateSection: <K extends keyof TeachingDesign>(section: K, data: Partial<TeachingDesign[K]>) => void;
  // 操作：模板
  setTemplate: (template: TemplateType) => void;
  // 操作：AI配置
  setAPIConfig: (config: Partial<APIConfig>) => void;
  setProvider: (provider: AIProvider) => void;
  setAPIKey: (key: string) => void;
  // 操作：历史
  saveToHistory: () => void;
  clearHistory: () => void;
  loadFromHistory: (index: number) => void;
  // 操作：AI状态
  setAIGenerating: (generating: boolean) => void;
  // 重置
  resetDesign: () => void;
}

function loadFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveToLocalStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota exceeded */ }
}

export const useAppStore = create<AppState>((set, get) => ({
  currentDesign: createEmptyDesign(),
  apiConfig: loadFromLocalStorage<APIConfig>('tdg-api-config', {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    apiKey: BUILTIN_API_CONFIG.apiKey,
  }),
  selectedTemplate: 'standard',
  history: loadFromLocalStorage<TeachingDesign[]>('tdg-history', []),
  isAIGenerating: false,

  setDesign: (design) => set({ currentDesign: design }),

  updateMeta: (meta) =>
    set((s) => ({ currentDesign: { ...s.currentDesign, meta: { ...s.currentDesign.meta, ...meta } } })),

  updateSection: (section, data) =>
    set((s) => ({
      currentDesign: {
        ...s.currentDesign,
        [section]: typeof s.currentDesign[section] === 'object' && !Array.isArray(s.currentDesign[section])
          ? { ...(s.currentDesign[section] as object), ...(data as object) }
          : data,
      },
    })),

  setTemplate: (template) => {
    set((s) => ({
      selectedTemplate: template,
      currentDesign: { ...s.currentDesign, meta: { ...s.currentDesign.meta, template } },
    }));
  },

  setAPIConfig: (config) =>
    set((s) => {
      const newConfig = { ...s.apiConfig, ...config };
      saveToLocalStorage('tdg-api-config', newConfig);
      return { apiConfig: newConfig };
    }),

  setProvider: (provider) => {
    const defaults = DEFAULT_API_CONFIG[provider];
    set((s) => {
      const newConfig = { ...defaults, apiKey: s.apiConfig.apiKey };
      saveToLocalStorage('tdg-api-config', newConfig);
      return { apiConfig: newConfig };
    });
  },

  setAPIKey: (key) =>
    set((s) => {
      const newConfig = { ...s.apiConfig, apiKey: key };
      saveToLocalStorage('tdg-api-config', newConfig);
      return { apiConfig: newConfig };
    }),

  saveToHistory: () => {
    const design = get().currentDesign;
    if (!design.meta.title) return;
    const history = get().history.filter((h) => h.meta.title !== design.meta.title);
    const newHistory = [design, ...history].slice(0, 20);
    saveToLocalStorage('tdg-history', newHistory);
    set({ history: newHistory });
  },

  clearHistory: () => {
    localStorage.removeItem('tdg-history');
    set({ history: [] });
  },

  loadFromHistory: (index) => {
    const item = get().history[index];
    if (item) set({ currentDesign: item });
  },

  setAIGenerating: (generating) => set({ isAIGenerating: generating }),

  resetDesign: () => set({ currentDesign: createEmptyDesign() }),
}));
