import type { TeachingDesign } from '../types/teaching-design';

// ===== UbD 逆向设计模板（Understanding by Design） =====
// 三阶段：确定预期结果 → 确定评估证据 → 规划学习体验

export function renderUbDTemplate(design: TeachingDesign): string {
  const { meta, standardAnalysis, textbookAnalysis, learnerAnalysis,
    learningObjectives, assessmentTasks, activities, homework,
    boardDesign, reflection, difficultyDesign } = design;

  return `# 《${meta.title}》教学设计（UbD逆向设计）

| 学科 | ${meta.subject} | 年级 | ${meta.grade} | 课时 | ${meta.duration}分钟 |
|------|------|------|------|------|------|

---

## 阶段一：确定预期结果（Desired Results）

### 1.1 确立的目标
${standardAnalysis.contentRequirement || '（待填写）'}

### 1.2 大概念（Big Ideas）
> ${textbookAnalysis.bigConcept || '（待提炼）'}

### 1.3 学生将理解……
${textbookAnalysis.keyKnowledge?.map(k => `- ${k}`).join('\n') || '（待填写）'}

### 1.4 基本问题（Essential Questions）
${difficultyDesign?.targetDifficulty
    ? `- **核心困难/问题**：${difficultyDesign.targetDifficulty}`
    : '（待设计）'}

### 1.5 学生将知道……（知识） 学生将能够……（技能）
${learningObjectives.map(obj =>
  `- ${obj.content}  [${obj.category === 'knowledge' ? '知' : obj.category === 'skill' ? '能' : '情'} · ${bloomLabel(obj.bloomLevel)}]`).join('\n')}

### 1.6 课标与核心素养关联
${standardAnalysis.coreCompetencies.map(c => `- **${c.name}**（${c.dimension}）：${c.description}`).join('\n') || '（待关联）'}

---

## 阶段二：确定评估证据（Assessment Evidence）

### 2.1 表现性任务（Performance Tasks）
${assessmentTasks.postAssessment?.tasks?.map((t, i) =>
  `${i + 1}. ${t}`).join('\n') || '（待设计）'}

### 2.2 其他证据
| 类型 | 方法 | 标准 |
|------|------|------|
| **前测** | ${assessmentTasks.preAssessment?.method || '-'} | ${assessmentTasks.preAssessment?.purpose || '-'} |
${assessmentTasks.formativeAssessment?.checkpoints?.map(cp =>
  `| **形成性** | ${cp.method} | ${cp.criteria} |`).join('\n') || '| | | |'}

### 2.3 评价量规（Rubric）
${assessmentTasks.postAssessment?.rubric || '（待设计）'}

### 2.4 学生的自我评估与反思
${reflection.evidenceSources?.map(s => `- ${s}`).join('\n') || '（待规划）'}

---

## 阶段三：规划学习体验（Learning Plan — WHERETO）

| WHERETO | 活动 | 设计说明 |
|----------|------|----------|
| **W**here（方向） | ${getW(activities)} | 确保学生知道本课目标与最终期望 |
| **H**ook（吸引） | ${getH(activities)} | 激发兴趣，引出核心问题 |
| **E**quip（装备） | ${getE(activities)} | 让学生经历探究，获取知识技能 |
| **R**ethink（反思） | ${getR(activities)} | 让学生重新思考与修正 |
| **E**valuate（评估） | ${getE2(activities)} | 自我评估与反馈 |
| **T**ailor（定制） | ${homework.differentiationNote || '分层设计'} | 个性化与差异化支持 |
| **O**rganize（组织） | 见活动序列 | 合理的教学序列 |

### 详细活动序列

${activities.map((a, i) =>
  `#### 活动 ${i + 1}：${a.title}（${a.duration}分钟）

| | 内容 |
|------|------|
| **阶段** | ${a.phase} |
| **教师** | ${a.teacherAction} |
| **学生** | ${a.studentAction} |
| **意图** | ${a.designIntent} |
| **评价** | ${a.assessmentEmbedded || '-'} |
`).join('\n\n') || '（待设计活动）'}

---

## 困难设计框架（UbD视角）

| 原则 | 在本课中的体现 |
|------|----------------|
| **动机优先** | ${difficultyDesign?.motivationStrategy || '（待设计）'} |
| **困难前置** | ${difficultyDesign?.difficultyFirst || '（待设计）'} |
| **过程保留** | ${difficultyDesign?.processPreservation || '（待设计）'} |
| **困难指征** | ${difficultyDesign?.zpdAlignment || '（待分析）'} |
| **抽象保护** | ${difficultyDesign?.abstractionProtection || '（待设计）'} |

---

## 📚 学情分析
- 已有基础：${learnerAnalysis.priorKnowledge || '（待填写）'}
- 认知困难：${learnerAnalysis.cognitiveDifficulty || '（待填写）'}

## 🖋 板书设计
${boardDesign.layout || '（待设计）'}

## 💭 教学反思
${reflection.targetAchievement || '（待评估）'}

---

*本教案由「困难的教育价值——教案设计器」基于UbD逆向设计框架（Wiggins & McTighe）生成*
`;
}

function getW(activities: TeachingDesign['activities']): string {
  const a = activities.find(a => a.phase === 'O');
  return a ? `明确目标：${a.title}` : '（待设计）';
}
function getH(activities: TeachingDesign['activities']): string {
  const a = activities.find(a => a.phase === 'B');
  return a ? a.title : '（待设计）';
}
function getE(activities: TeachingDesign['activities']): string {
  const a = activities.find(a => a.phase === 'P-participatory');
  return a ? a.title : '（待设计）';
}
function getR(activities: TeachingDesign['activities']): string {
  const a = activities.find(a => a.phase === 'P-post');
  return a ? a.title : '（待设计）';
}
function getE2(activities: TeachingDesign['activities']): string {
  const a = activities.find(a => a.phase === 'S');
  return a ? a.title : '（待设计）';
}

function bloomLabel(level: string): string {
  const map: Record<string, string> = {
    remember: '记忆', understand: '理解', apply: '应用',
    analyze: '分析', evaluate: '评价', create: '创造',
  };
  return map[level] || level;
}
