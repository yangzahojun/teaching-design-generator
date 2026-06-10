import type { TeachingDesign, AlignmentEntry } from '../types/teaching-design';
import { createEmptyDesign } from '../types/teaching-design';

// 核心生成引擎：将表单数据组装成完整的TeachingDesign

export function generateAlignmentMatrix(design: TeachingDesign): AlignmentEntry[] {
  const matrix: AlignmentEntry[] = [];
  const { learningObjectives, assessmentTasks, activities } = design;

  for (const obj of learningObjectives) {
    const assessmentId = assessmentTasks.postAssessment?.tasks?.length
      ? '后测任务'
      : '（待关联评价）';
    const relatedActivities = activities
      .filter(a => a.assessmentEmbedded && a.assessmentEmbedded.includes(obj.id))
      .map(a => a.title);
    const allActivityIds = activities.length > 0
      ? activities.map(a => a.title)
      : ['（待关联活动）'];

    matrix.push({
      objectiveId: `目标：${obj.content.slice(0, 30)}...`,
      assessmentTaskId: assessmentId,
      activityIds: relatedActivities.length > 0 ? relatedActivities : allActivityIds,
      consistencyNote: relatedActivities.length > 0
        ? '目标-评价-活动一致'
        : '请确保评价任务和活动与目标对齐',
    });
  }

  return matrix;
}

export function generateFullDesign(partial: Partial<TeachingDesign>): TeachingDesign {
  const base = createEmptyDesign();

  const merged: TeachingDesign = {
    ...base,
    ...partial,
    meta: { ...base.meta, ...partial.meta },
    standardAnalysis: { ...base.standardAnalysis, ...partial.standardAnalysis },
    textbookAnalysis: { ...base.textbookAnalysis, ...partial.textbookAnalysis },
    learnerAnalysis: { ...base.learnerAnalysis, ...partial.learnerAnalysis },
    learningObjectives: partial.learningObjectives || base.learningObjectives,
    assessmentTasks: {
      preAssessment: { ...base.assessmentTasks.preAssessment, ...partial.assessmentTasks?.preAssessment },
      formativeAssessment: partial.assessmentTasks?.formativeAssessment || base.assessmentTasks.formativeAssessment,
      postAssessment: { ...base.assessmentTasks.postAssessment, ...partial.assessmentTasks?.postAssessment },
    },
    activities: partial.activities || base.activities,
    homework: {
      required: partial.homework?.required || base.homework.required,
      optional: partial.homework?.optional || base.homework.optional,
      designIntent: partial.homework?.designIntent || base.homework.designIntent,
      differentiationNote: partial.homework?.differentiationNote || base.homework.differentiationNote,
    },
    boardDesign: { ...base.boardDesign, ...partial.boardDesign },
    reflection: { ...base.reflection, ...partial.reflection },
    alignmentMatrix: partial.alignmentMatrix || [],
    difficultyDesign: { ...base.difficultyDesign, ...partial.difficultyDesign },
    aiRoleDefinition: { ...base.aiRoleDefinition, ...partial.aiRoleDefinition },
  };

  if (merged.alignmentMatrix.length === 0 && merged.learningObjectives.length > 0) {
    merged.alignmentMatrix = generateAlignmentMatrix(merged);
  }

  return merged;
}
