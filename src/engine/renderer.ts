import { renderTemplate } from '../templates';
import type { TeachingDesign } from '../types/teaching-design';

// 获取各板块的纯文本（用于AI上下文）

export function getSectionText(design: TeachingDesign, section: string): string {
  const d = design;
  switch (section) {
    case 'standardAnalysis':
      return `课标要求：${d.standardAnalysis.contentRequirement}
学业要求：${d.standardAnalysis.academicRequirement}
教学提示：${d.standardAnalysis.teachingHint}
核心素养：${d.standardAnalysis.coreCompetencies.map(c => c.name).join('、')}`;

    case 'textbookAnalysis':
      return `纵向分析：${d.textbookAnalysis.verticalAnalysis}
横向对比：${d.textbookAnalysis.crossAnalysis}
大概念：${d.textbookAnalysis.bigConcept}
重点：${d.textbookAnalysis.keyKnowledge.join('、')}
难点：${d.textbookAnalysis.difficulties.join('、')}`;

    case 'learnerAnalysis':
      return `已有基础：${d.learnerAnalysis.priorKnowledge}
生活经验：${d.learnerAnalysis.priorExperience}
认知困难：${d.learnerAnalysis.cognitiveDifficulty}
前测设计：${d.learnerAnalysis.preAssessment}`;

    case 'learningObjectives':
      return d.learningObjectives.map((o, i) =>
        `${i + 1}. ${o.content}（${o.category}·${o.competencyLink}·${o.assessmentMethod}）`
      ).join('\n');

    case 'assessmentTasks':
      return `前测：${d.assessmentTasks.preAssessment?.method} - ${d.assessmentTasks.preAssessment?.questions?.join('；')}
后测：${d.assessmentTasks.postAssessment?.method} - ${d.assessmentTasks.postAssessment?.tasks?.join('；')}
量规：${d.assessmentTasks.postAssessment?.rubric}`;

    case 'activities':
      return d.activities.map(a =>
        `[${a.phase}] ${a.title}(${a.duration}′) → 师：${a.teacherAction} / 生：${a.studentAction} / 意图：${a.designIntent}`
      ).join('\n');

    case 'homework':
      return `必做：${d.homework.required?.map(h => h.title).join('、')}
选做：${d.homework.optional?.map(h => h.title).join('、')}
意图：${d.homework.designIntent}`;

    case 'difficultyDesign':
      return `核心困难：${d.difficultyDesign.targetDifficulty}
教育价值：${d.difficultyDesign.educationalValue}
动机策略：${d.difficultyDesign.motivationStrategy}
困难前置：${d.difficultyDesign.difficultyFirst}
过程保留：${d.difficultyDesign.processPreservation}`;

    default:
      return renderTemplate(design);
  }
}

// 构建完整的生成上下文
export function buildGenerationContext(design: TeachingDesign): string {
  return `当前教学设计信息：
学科：${design.meta.subject}
年级：${design.meta.grade}
课题：${design.meta.title}
教材版本：${design.meta.textbookVersion}
课时：${design.meta.duration}分钟

=== 课标分析 ===
${getSectionText(design, 'standardAnalysis')}

=== 教材分析 ===
${getSectionText(design, 'textbookAnalysis')}

=== 学情分析 ===
${getSectionText(design, 'learnerAnalysis')}

=== 学习目标 ===
${getSectionText(design, 'learningObjectives')}

=== 困难设计 ===
${getSectionText(design, 'difficultyDesign')}`;
}
