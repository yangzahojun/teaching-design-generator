// ===== AI提示词模板库 =====

export const SYSTEM_PROMPT = `你是一位资深的教学设计专家，精通：
1. 2022版义务教育课程标准（新课标）的学科核心素养体系
2. BOPPPS教学模型、UbD逆向设计框架
3. 学习科学理论（维果茨基最近发展区、Bjork理想困难理论、Kapur有效失败理论）
4. 动机心理学（自我决定理论SDT、成长型思维）
5. 五项教学设计原则：动机优先、困难前置、过程保留、困难指征、抽象保护

你的教学设计必须体现以下理念：
- 困难不是学习的敌人，而是学习本身发生的关键条件
- AI的角色是设计有教育价值的困难、激发学习动机、清除无关障碍
- 核心边界：AI不能替代学生亲身经历思考的过程——不愤不启，不悱不发

请使用专业准确的中文教育学术语，回应简洁有条理。`;

// JSON格式完整生成提示词
export const FULL_DESIGN_JSON_PROMPT = (subject: string, grade: string, topic: string, textbook: string, duration: number) =>
  `请为一节${grade}${subject}课《${topic}》生成完整的教学设计。

教材版本：${textbook}
课时：${duration}分钟

请以JSON格式返回，严格按照以下结构。每个字段都必须是中文字符串或字符串数组：

{
  "standardAnalysis": {
    "contentRequirement": "引用2022版课标的具体内容要求（1-2句话）",
    "academicRequirement": "课标规定的学业质量标准（1-2句话）",
    "teachingHint": "课标提供的教学建议",
    "coreCompetencyNames": ["核心素养1", "核心素养2"]
  },
  "textbookAnalysis": {
    "verticalAnalysis": "本课在学段/单元中的前后联系",
    "crossAnalysis": "不同版本教材处理方式对比",
    "bigConcept": "本课背后的大概念（一句话）",
    "keyKnowledge": ["知识点1", "知识点2", "知识点3"],
    "difficulties": ["教学重点内容", "教学难点内容", "突破策略与建议"],
  },
  "learnerAnalysis": {
    "priorKnowledge": "学生已有的知识基础",
    "priorExperience": "学生已有的生活经验",
    "cognitiveDifficulty": "预判的认知困难",
    "preAssessment": "前测设计建议"
  },
  "learningObjectives": [
    {"content": "目标1（四要素格式）", "category": "knowledge", "competencyLink": "核心素养名", "assessmentMethod": "评价方式"},
    {"content": "目标2", "category": "skill", "competencyLink": "...", "assessmentMethod": "..."},
    {"content": "目标3", "category": "attitude", "competencyLink": "...", "assessmentMethod": "..."}
  ],
  "assessmentTasks": {
    "preMethod": "前测方式",
    "preQuestions": ["前测问题1", "前测问题2"],
    "prePurpose": "前测目的",
    "postMethod": "后测方式",
    "postTasks": ["后测任务1", "后测任务2"],
    "postRubric": "评价量规：优秀/合格/需辅导"
  },
  "activities": [
    {"phase": "B", "title": "导入活动名", "duration": 3, "teacherAction": "教师做什么", "studentAction": "学生做什么", "designIntent": "设计意图", "assessmentEmbedded": "嵌入式评价"},
    {"phase": "O", "title": "目标明确", "duration": 2, "teacherAction": "...", "studentAction": "...", "designIntent": "...", "assessmentEmbedded": ""},
    {"phase": "P-participatory", "title": "核心探索", "duration": 15, "teacherAction": "...", "studentAction": "...", "designIntent": "...", "assessmentEmbedded": "..."},
    {"phase": "P-post", "title": "后测练习", "duration": 8, "teacherAction": "...", "studentAction": "...", "designIntent": "...", "assessmentEmbedded": "..."},
    {"phase": "S", "title": "总结延伸", "duration": 5, "teacherAction": "...", "studentAction": "...", "designIntent": "...", "assessmentEmbedded": ""}
  ],
  "homework": {
    "requiredTitle1": "必做作业1标题",
    "requiredDesc1": "必做作业1描述",
    "requiredTitle2": "必做作业2标题",
    "requiredDesc2": "必做作业2描述",
    "optionalTitle": "选做作业标题",
    "optionalDesc": "选做作业描述",
    "designIntent": "作业设计整体意图",
    "differentiationNote": "分层说明"
  },
  "boardDesign": {
    "layout": "板书布局描述（可用ASCII图示）",
    "keyElements": ["要素1", "要素2", "要素3"],
    "structureLogic": "结构化呈现逻辑"
  },
  "reflection": {
    "targetAchievement": "目标达成度预估",
    "improvementMeasures": ["改进措施1", "改进措施2"],
    "notableObservations": "特别关注事项"
  },
  "difficultyDesign": {
    "targetDifficulty": "本课核心困难是什么",
    "educationalValue": "为什么这个困难有教育价值",
    "zpdAlignment": "如何确保处于最近发展区",
    "meaninglessObstacles": ["需清除的障碍1"],
    "motivationStrategy": "动机激发策略",
    "autonomySupport": "自主性支持策略",
    "competenceScaffold": "胜任感铺垫策略",
    "relatednessConnection": "关系感联结策略",
    "difficultyFirst": "困难前置安排",
    "processPreservation": "过程保留策略",
    "abstractionProtection": "抽象保护策略"
  }
}

要求：每个字段写出具体、可执行的内容，不要空泛。教学活动体现BOPPPS结构和困难前置原则。只返回JSON，不要其他文字。`;

// 简易结构化提示词（兜底方案——返回Markdown后手动解析）
export const SECTION_PROMPTS: Record<string, (context: string) => string> = {
  standardAnalysis: (ctx) =>
    `请基于2022版义务教育课程标准，为以下教学设计撰写「课标研读」板块：\n${ctx}\n请包含：内容要求、学业要求、教学提示、关联核心素养。`,
  textbookAnalysis: (ctx) =>
    `请分析以下教学设计的教材内容：\n${ctx}\n请包含：纵向分析、横向对比、大概念提炼、核心知识点与教学重难点。`,
  learnerAnalysis: (ctx) =>
    `请分析学情：\n${ctx}\n请包含：已有知识基础、已有生活经验、预判认知困难、前测设计。`,
  learningObjectives: (ctx) =>
    `请设计3-4个素养导向的学习目标：\n${ctx}\n要求：四要素格式、覆盖知识能力情感、标注核心素养和布鲁姆层级。`,
  assessmentTasks: (ctx) =>
    `请设计评价任务：\n${ctx}\n包含前测、形成性评价、后测及评价量规。`,
  activities: (ctx) =>
    `请设计BOPPPS教学活动：\n${ctx}\n体现困难前置和过程保留原则。`,
  homework: (ctx) =>
    `请设计分层作业：\n${ctx}\n包含必做、选做及设计意图。`,
  difficultyDesign: (ctx) =>
    `请完成困难设计框架：\n${ctx}\n基于五项原则：动机优先、困难前置、过程保留、困难指征、抽象保护。`,
  fullDesign: (ctx) =>
    `请为一节课撰写完整教学设计：\n${ctx}\n请按新课标9板块格式输出，确保体现五项设计原则。`,
};
