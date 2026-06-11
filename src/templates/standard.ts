import type { TeachingDesign } from '../types/teaching-design';

// ===== 新课标标准模板（9板块 + 困难设计框架） =====
export function renderStandardTemplate(design: TeachingDesign): string {
  const { meta, standardAnalysis, textbookAnalysis, learnerAnalysis,
    learningObjectives, assessmentTasks, activities, homework,
    boardDesign, reflection, difficultyDesign } = design;

  const phaseLabels: Record<string, string> = {
    B: 'B 导入 (Bridge-in)', O: 'O 目标 (Objective)',
    'P-pre': 'P₁ 前测 (Pre-assessment)', 'P-participatory': 'P₂ 参与式学习 (Participatory)',
    'P-post': 'P₃ 后测 (Post-assessment)', S: 'S 总结 (Summary)',
  };

  return `# 《${meta.title}》教学设计

| 项目 | 内容 |
|------|------|
| **学科** | ${meta.subject} |
| **年级** | ${meta.grade} |
| **教材版本** | ${meta.textbookVersion} |
| **所属单元** | ${meta.unit} |
| **课时** | ${meta.duration} 分钟 |
| **设计者** | ${meta.designer} |
| **日期** | ${meta.date} |

---

## 一、课标研读

### 1.1 内容要求
${standardAnalysis.contentRequirement || '（待填写）'}

### 1.2 学业要求
${standardAnalysis.academicRequirement || '（待填写）'}

### 1.3 教学提示
${standardAnalysis.teachingHint || '（待填写）'}

### 1.4 关联核心素养
${standardAnalysis.coreCompetencies.length > 0
    ? standardAnalysis.coreCompetencies.map(c =>
      `- **${c.name}**（${c.dimension}）：${c.description}`).join('\n')
    : '（待关联）'}

---

## 二、教材分析

### 2.1 纵向分析（本课在学段/单元中的位置）
> 分析本课在该学科教材体系中的坐标位置，包括与前后知识的联系、在学段中的定位、对后续学习的铺垫作用。

${textbookAnalysis.verticalAnalysis || '（待填写）'}

### 2.2 横向对比（不同版本教材的处理方式）
> 对比不同版本教材（如人教版 vs 北师大版/苏教版/统编版）对本课内容的呈现差异，分析各版本的特色和取舍逻辑。

${textbookAnalysis.crossAnalysis || '（待填写）'}

### 2.3 教材编排与内容解析
> 详细分析所用教材（${meta.textbookVersion}）对这一内容的编排思路——包括教材中的情境导入方式、例题设计的递进逻辑、探究活动的安排、习题的分布与梯度、图文配合的意图等方面。这是教学设计最直接的依据。

${textbookAnalysis.keyKnowledge.length > 0
    ? '本课核心知识包括：' + textbookAnalysis.keyKnowledge.join('、') + '。' + (textbookAnalysis.verticalAnalysis || '')
    : '（待填写）'}

### 2.4 大概念（Big Idea）
> 大概念是本课内容背后的学科核心思想，具有统摄性、迁移性和持久性。一个好的大概念表述能帮助教师把握教学方向。

> **${textbookAnalysis.bigConcept || '（待提炼）'}**

### 2.5 教学重点

${textbookAnalysis.difficulties?.[0] || '（待填写）'}

### 2.6 教学难点

${textbookAnalysis.difficulties?.[1] || '（待填写）'}

### 2.7 突破策略

${textbookAnalysis.difficulties?.[2] || '（待填写：请结合学情分析，设计帮助学生克服上述难点的具体策略）'}

---

## 三、学情分析

| 维度 | 分析 |
|------|------|
| **已有知识基础** | ${learnerAnalysis.priorKnowledge || '（待填写）'} |
| **已有生活经验** | ${learnerAnalysis.priorExperience || '（待填写）'} |
| **认知困难预判** | ${learnerAnalysis.cognitiveDifficulty || '（待填写）'} |
| **前测设计** | ${learnerAnalysis.preAssessment || '（待填写）'} |

---

## 四、学习目标

${learningObjectives.length > 0
    ? learningObjectives.map((obj, i) =>
      `**目标 ${i + 1}**：${obj.content}
- 类型：${obj.category === 'knowledge' ? '知识' : obj.category === 'skill' ? '能力' : '情感'}
- 核心素养：${obj.competencyLink}
- 评价方式：${obj.assessmentMethod}
- 认知层级：${bloomLabel(obj.bloomLevel)}`).join('\n\n')
    : '（请添加学习目标）'}

---

## 五、评价任务

### 5.1 前测（Pre-assessment）
- **方式**：${assessmentTasks.preAssessment?.method || '（待填写）'}
- **问题**：${assessmentTasks.preAssessment?.questions?.join('；') || '（待填写）'}
- **目的**：${assessmentTasks.preAssessment?.purpose || '（待填写）'}

### 5.2 形成性评价（嵌入式评价）
${assessmentTasks.formativeAssessment?.checkpoints?.length > 0
    ? assessmentTasks.formativeAssessment.checkpoints.map(cp =>
      `- 活动「${cp.activityId}」→ ${cp.method}：${cp.criteria}`).join('\n')
    : '（待填写）'}

### 5.3 后测（Post-assessment）
- **方式**：${assessmentTasks.postAssessment?.method || '（待填写）'}
- **任务**：${assessmentTasks.postAssessment?.tasks?.join('；') || '（待填写）'}
- **评价量规**：${assessmentTasks.postAssessment?.rubric || '（待填写）'}

---

## 六、教学活动（BOPPPS结构）

| 阶段 | 活动名称 | 时长 | 教师活动 | 学生活动 | 设计意图 | 嵌入式评价 |
|------|----------|------|----------|----------|----------|------------|
${activities.length > 0
    ? activities.map(a =>
      `| ${phaseLabels[a.phase] || a.phase} | ${a.title} | ${a.duration}′ | ${a.teacherAction} | ${a.studentAction} | ${a.designIntent} | ${a.assessmentEmbedded || '-'} |`).join('\n')
    : '| （待添加活动） | | | | | | |'}

---

## 七、作业设计

### 必做作业
${homework.required?.length > 0
    ? homework.required.map((h) => `**${h.title}**：${h.description}（约${h.estimatedTime}分钟）`).join('\n\n')
    : '（待填写）'}

### 选做作业（分层）
${homework.optional?.length > 0
    ? homework.optional.map((h) => `**${h.title}**：${h.description}（约${h.estimatedTime}分钟）`).join('\n\n')
    : '（待填写）'}

> **设计意图**：${homework.designIntent || '（待填写）'}
> **分层说明**：${homework.differentiationNote || '（待填写）'}

---

## 八、板书设计

**结构化布局：**
${boardDesign.layout || '（待设计）'}

**关键要素**：${boardDesign.keyElements?.join(' → ') || '（待提炼）'}

**呈现逻辑**：${boardDesign.structureLogic || '（待说明）'}

---

## 九、教学反思

| 维度 | 内容 |
|------|------|
| **目标达成度预估** | ${reflection.targetAchievement || '（待填写）'} |
| **证据来源** | ${reflection.evidenceSources?.join('；') || '（待填写）'} |
| **改进措施** | ${reflection.improvementMeasures?.join('；') || '（待填写）'} |
| **特别关注** | ${reflection.notableObservations || '（待填写）'} |

---
## 十、困难设计框架

> 核心问题：什么困难值得保留？如何激发学生面对困难的内在意愿？

### 10.1 困难甄别

| 维度 | 分析 |
|------|------|
| **核心困难** | ${difficultyDesign?.targetDifficulty || '（待分析）'} |
| **教育价值** | ${difficultyDesign?.educationalValue || '（待分析）'} |
| **最近发展区对齐** | ${difficultyDesign?.zpdAlignment || '（待分析）'} |
| **待清除的无意义障碍** | ${difficultyDesign?.meaninglessObstacles?.join('；') || '（待识别）'} |

### 10.2 动机激发设计（基于SDT自我决定理论）

| 原则 | 策略 |
|------|------|
| **动机优先** | ${difficultyDesign?.motivationStrategy || '（待设计）'} |
| **自主性支持** | ${difficultyDesign?.autonomySupport || '（待设计）'} |
| **胜任感铺垫** | ${difficultyDesign?.competenceScaffold || '（待设计）'} |
| **关系感联结** | ${difficultyDesign?.relatednessConnection || '（待设计）'} |

### 10.3 过程设计

| 原则 | 策略 |
|------|------|
| **困难前置** | ${difficultyDesign?.difficultyFirst || '（待设计）'} |
| **过程保留** | ${difficultyDesign?.processPreservation || '（待设计）'} |
| **抽象保护** | ${difficultyDesign?.abstractionProtection || '（待设计）'} |

---

*本教案由「小羊的教案设计器」基于2022版义务教育课程标准生成*
`;
}

function bloomLabel(level: string): string {
  const map: Record<string, string> = {
    remember: '记忆', understand: '理解', apply: '应用',
    analyze: '分析', evaluate: '评价', create: '创造',
  };
  return map[level] || level;
}
