// ===== 核心教学设计数据结构 =====
// 融合2022版义务教育新课标 + PDF五项设计原则

// ---- 基础枚举 ----
export type Stage = '小学' | '初中';

export type Subject =
  | '语文' | '数学' | '英语' | '科学' | '道德与法治'
  | '信息科技' | '艺术' | '体育与健康'
  | '物理' | '化学' | '生物' | '历史' | '地理';

export type Grade =
  | '一年级' | '二年级' | '三年级' | '四年级' | '五年级' | '六年级'
  | '七年级' | '八年级' | '九年级';

export type TemplateType = 'standard' | 'boppps' | 'ubd';

export type BOPPPSPhase = 'B' | 'O' | 'P-pre' | 'P-participatory' | 'P-post' | 'S';

export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

export interface CoreCompetency {
  name: string;
  dimension: string;
  description: string;
}

export interface LearningObjective {
  id: string;
  content: string;
  category: 'knowledge' | 'skill' | 'attitude';
  competencyLink: string;
  assessmentMethod: string;
  bloomLevel: BloomLevel;
}

export interface TeachingActivity {
  id: string;
  phase: BOPPPSPhase;
  title: string;
  duration: number;
  teacherAction: string;
  studentAction: string;
  designIntent: string;
  assessmentEmbedded: string;
  materials: string[];
}

export interface HomeworkItem {
  title: string;
  description: string;
  targetObjective: string;
  estimatedTime: number;
}

export interface AssessmentCheckpoint {
  activityId: string;
  method: string;
  criteria: string;
}

export interface AlignmentEntry {
  objectiveId: string;
  assessmentTaskId: string;
  activityIds: string[];
  consistencyNote: string;
}

// ---- 困难判断框架（来自PDF核心理论） ----
export interface DifficultyDesign {
  // 甄别：区分有教育价值的困难 vs 无意义障碍
  targetDifficulty: string;           // 本课核心困难是什么
  educationalValue: string;           // 为什么这个困难有教育价值
  zpdAlignment: string;               // 如何确保处于最近发展区内
  meaninglessObstacles: string[];     // 需要清除的无意义障碍

  // 激发：动机设计
  motivationStrategy: string;         // 动机激发策略（动机优先原则）
  autonomySupport: string;            // 自主性支持（SDT）
  competenceScaffold: string;         // 胜任感铺垫
  relatednessConnection: string;      // 关系感联结

  // 过程设计
  difficultyFirst: string;            // 困难前置的具体安排
  processPreservation: string;        // 过程保留策略
  abstractionProtection: string;      // 抽象保护策略
}

// ---- 主数据结构 ----
export interface TeachingDesign {
  meta: {
    title: string;
    stage: Stage;           // 学段
    subject: Subject;
    grade: Grade;
    textbookVersion: string;
    unit: string;
    duration: number;
    designer: string;
    date: string;
    template: TemplateType;
  };

  // 一、课标研读
  standardAnalysis: {
    contentRequirement: string;
    academicRequirement: string;
    teachingHint: string;
    coreCompetencies: CoreCompetency[];
  };

  // 二、教材分析
  textbookAnalysis: {
    verticalAnalysis: string;
    crossAnalysis: string;
    bigConcept: string;
    keyKnowledge: string[];
    difficulties: string[];
  };

  // 三、学情分析
  learnerAnalysis: {
    priorKnowledge: string;
    priorExperience: string;
    cognitiveDifficulty: string;
    preAssessment: string;
  };

  // 四、学习目标
  learningObjectives: LearningObjective[];

  // 五、评价任务
  assessmentTasks: {
    preAssessment: {
      method: string;
      questions: string[];
      purpose: string;
    };
    formativeAssessment: {
      checkpoints: AssessmentCheckpoint[];
    };
    postAssessment: {
      method: string;
      tasks: string[];
      rubric: string;
    };
  };

  // 六、教学活动（BOPPPS结构）
  activities: TeachingActivity[];

  // 七、作业设计
  homework: {
    required: HomeworkItem[];
    optional: HomeworkItem[];
    designIntent: string;
    differentiationNote: string;
  };

  // 八、板书设计
  boardDesign: {
    layout: string;
    keyElements: string[];
    structureLogic: string;
  };

  // 九、教学反思
  reflection: {
    targetAchievement: string;
    evidenceSources: string[];
    improvementMeasures: string[];
    notableObservations: string;
  };

  // 附加：教学评一致性矩阵
  alignmentMatrix: AlignmentEntry[];

  // ★ 困难设计框架（融合PDF五项原则）
  difficultyDesign: DifficultyDesign;

  // AI在教学设计中的角色定位
  aiRoleDefinition: {
    asDifficultyDesigner: string;    // AI为困难设计者
    asMotivationEnhancer: string;    // AI为动机激发者
    asObstacleRemover: string;       // AI为无关障碍清除者
    coreBoundary: string;            // AI不可逾越的边界
  };
}

// ===== 表单输入模型 =====
export interface TeachingDesignForm {
  meta: Partial<TeachingDesign['meta']>;
  standardAnalysis: Partial<TeachingDesign['standardAnalysis']>;
  textbookAnalysis: Partial<TeachingDesign['textbookAnalysis']>;
  learnerAnalysis: Partial<TeachingDesign['learnerAnalysis']>;
  learningObjectives: LearningObjective[];
  assessmentTasks: Partial<TeachingDesign['assessmentTasks']>;
  activities: TeachingActivity[];
  homework: Partial<TeachingDesign['homework']>;
  boardDesign: Partial<TeachingDesign['boardDesign']>;
  reflection: Partial<TeachingDesign['reflection']>;
  difficultyDesign: Partial<DifficultyDesign>;
  aiRoleDefinition: Partial<TeachingDesign['aiRoleDefinition']>;
}

// ===== AI配置 =====
export type AIProvider = 'deepseek' | 'openai' | 'zhipu' | 'qwen' | 'custom';

export interface APIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

// ===== 默认值 =====
export const DEFAULT_API_CONFIG: Record<AIProvider, Omit<APIConfig, 'apiKey'>> = {
  deepseek: {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
  },
  openai: {
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  zhipu: {
    provider: 'zhipu',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash',
  },
  qwen: {
    provider: 'qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-turbo',
  },
  custom: {
    provider: 'custom',
    baseUrl: '',
    model: '',
  },
};

export function createEmptyDesign(): TeachingDesign {
  return {
    meta: {
      title: '',
      stage: '小学' as Stage,
      subject: '数学' as Subject,
      grade: '五年级',
      textbookVersion: '人教版',
      unit: '',
      duration: 40,
      designer: '',
      date: new Date().toISOString().split('T')[0],
      template: 'standard',
    },
    standardAnalysis: {
      contentRequirement: '',
      academicRequirement: '',
      teachingHint: '',
      coreCompetencies: [],
    },
    textbookAnalysis: {
      verticalAnalysis: '',
      crossAnalysis: '',
      bigConcept: '',
      keyKnowledge: [],
      difficulties: [],
    },
    learnerAnalysis: {
      priorKnowledge: '',
      priorExperience: '',
      cognitiveDifficulty: '',
      preAssessment: '',
    },
    learningObjectives: [],
    assessmentTasks: {
      preAssessment: { method: '', questions: [], purpose: '' },
      formativeAssessment: { checkpoints: [] },
      postAssessment: { method: '', tasks: [], rubric: '' },
    },
    activities: [],
    homework: {
      required: [],
      optional: [],
      designIntent: '',
      differentiationNote: '',
    },
    boardDesign: {
      layout: '',
      keyElements: [],
      structureLogic: '',
    },
    reflection: {
      targetAchievement: '',
      evidenceSources: [],
      improvementMeasures: [],
      notableObservations: '',
    },
    alignmentMatrix: [],
    difficultyDesign: {
      targetDifficulty: '',
      educationalValue: '',
      zpdAlignment: '',
      meaninglessObstacles: [],
      motivationStrategy: '',
      autonomySupport: '',
      competenceScaffold: '',
      relatednessConnection: '',
      difficultyFirst: '',
      processPreservation: '',
      abstractionProtection: '',
    },
    aiRoleDefinition: {
      asDifficultyDesigner: '',
      asMotivationEnhancer: '',
      asObstacleRemover: '',
      coreBoundary: 'AI不能替代学生亲身经历思考的过程——不愤不启，不悱不发。',
    },
  };
}
