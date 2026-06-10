import type { TeachingDesign } from '../types/teaching-design';

// ===== BOPPPS 模板 =====
// 将9板块重新组织为BOPPPS六阶段结构

export function renderBOPPPSTemplate(design: TeachingDesign): string {
  const { meta, standardAnalysis, textbookAnalysis, learnerAnalysis,
    learningObjectives, assessmentTasks, activities, homework,
    boardDesign, reflection, difficultyDesign } = design;

  return `# 《${meta.title}》教学设计（BOPPPS框架）

| 学科 | ${meta.subject} | 年级 | ${meta.grade} | 课时 | ${meta.duration}分钟 |
|------|------|------|------|------|------|

---

## B — Bridge-in（导入）

### 情境创设
${getPhaseActivities(activities, 'B').map(a =>
  `**${a.title}**（${a.duration}分钟）
- 教师：${a.teacherAction}
- 学生：${a.studentAction}
- 设计意图：${a.designIntent}`).join('\n\n') || '（待设计导入活动）'}

### 导入意图
通过真实情境引出本课核心问题：**${difficultyDesign?.targetDifficulty || meta.title}**

---

## O — Objective（学习目标）

${learningObjectives.map((obj, i) =>
  `${i + 1}. **${obj.content}**（${obj.category === 'knowledge' ? '知识' : obj.category === 'skill' ? '能力' : '情感'} · ${bloomLabel(obj.bloomLevel)}）`).join('\n')}

---

## P₁ — Pre-assessment（前测）

### 前测方式
${assessmentTasks.preAssessment?.method || '（待设计）'}

### 前测问题
${assessmentTasks.preAssessment?.questions?.map((q, i) => `${i + 1}. ${q}`).join('\n') || '（待设计）'}

### 目的
${assessmentTasks.preAssessment?.purpose || '诊断学生起点，为教学设计提供依据'}

---

## P₂ — Participatory Learning（参与式学习）

> 核心原则：**困难前置** — 先让学生经历"困惑→探索"的认知过程，再提供指导（Kapur"有效失败"）

${getPhaseActivities(activities, 'P-participatory').map((a, i) =>
  `### 活动 ${i + 1}：${a.title}（${a.duration}分钟）

| | 内容 |
|------|------|
| **教师活动** | ${a.teacherAction} |
| **学生活动** | ${a.studentAction} |
| **设计意图** | ${a.designIntent} |
| **嵌入式评价** | ${a.assessmentEmbedded || '-'} |
| **所需材料** | ${a.materials?.join('、') || '-'} |
| **过程保留** | ${difficultyDesign?.processPreservation || '确保学生亲历思考过程，AI仅用于验证结论'} |
`).join('\n\n') || '（待设计参与式学习活动）'}

---

## P₃ — Post-assessment（后测）

### 后测方式
${assessmentTasks.postAssessment?.method || '（待设计）'}

### 后测任务
${assessmentTasks.postAssessment?.tasks?.map((t, i) => `${i + 1}. ${t}`).join('\n') || '（待设计）'}

### 评价量规
${assessmentTasks.postAssessment?.rubric || '（待设计）'}

---

## S — Summary（总结）

${getPhaseActivities(activities, 'S').map(a =>
  `**${a.title}**（${a.duration}分钟）
- 教师：${a.teacherAction}
- 学生：${a.studentAction}`).join('\n\n') || '（待设计总结环节）'}

---

## 📋 教学设计依据

### 课标分析
${standardAnalysis.contentRequirement || '（待填写）'}

**关联核心素养**：${standardAnalysis.coreCompetencies.map(c => c.name).join('、') || '（待关联）'}

### 教材分析
- **大概念**：${textbookAnalysis.bigConcept || '（待提炼）'}
- **重点**：${textbookAnalysis.keyKnowledge?.join('、') || '（待填写）'}
- **难点**：${textbookAnalysis.difficulties?.join('、') || '（待填写）'}

### 学情分析
- 已有基础：${learnerAnalysis.priorKnowledge || '（待填写）'}
- 认知困难预判：${learnerAnalysis.cognitiveDifficulty || '（待填写）'}

---

## 📝 作业设计

### 必做
${homework.required?.map(h => `- **${h.title}**：${h.description}`).join('\n') || '（待设计）'}
### 选做
${homework.optional?.map(h => `- **${h.title}**：${h.description}`).join('\n') || '（待设计）'}

> ${homework.designIntent || ''}

---

## 🖋 板书设计

${boardDesign.layout || '（待设计）'}

---

## 💭 教学反思

| 维度 | 内容 |
|------|------|
| 目标达成 | ${reflection.targetAchievement || '（待评估）'} |
| 证据 | ${reflection.evidenceSources?.join('；') || '（待收集）'} |
| 改进 | ${reflection.improvementMeasures?.join('；') || '（待规划）'} |

---

*本教案由「困难的教育价值——教案设计器」基于BOPPPS模型生成*
`;
}

function getPhaseActivities(activities: TeachingDesign['activities'], phase: string) {
  return activities.filter(a => a.phase === phase);
}

function bloomLabel(level: string): string {
  const map: Record<string, string> = {
    remember: '记忆', understand: '理解', apply: '应用',
    analyze: '分析', evaluate: '评价', create: '创造',
  };
  return map[level] || level;
}
