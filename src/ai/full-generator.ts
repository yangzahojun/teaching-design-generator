import { chatCompletion } from './client';
import { SYSTEM_PROMPT, FULL_DESIGN_JSON_PROMPT } from './prompts';
import type { APIConfig, LearningObjective, TeachingActivity } from '../types/teaching-design';
import { useAppStore } from '../store/useAppStore';

// 解析AI返回的JSON → 更新Zustand store
export async function aiAutoGenerate(
  config: APIConfig,
  subject: string,
  grade: string,
  topic: string,
  textbook: string,
  duration: number
): Promise<{ success: boolean; message: string }> {
  if (!config.apiKey) {
    return { success: false, message: '请先在设置页面配置API密钥' };
  }
  if (!topic.trim()) {
    return { success: false, message: '请先填写课题名称' };
  }

  const store = useAppStore.getState();

  try {
    const prompt = FULL_DESIGN_JSON_PROMPT(subject, grade, topic, textbook, duration);
    const raw = await chatCompletion(config, [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ], { temperature: 0.7, maxTokens: 4000 });

    // 解析JSON（AI可能在JSON外面包了markdown代码块）
    let jsonStr = raw;
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    jsonStr = jsonStr.trim();

    const data = JSON.parse(jsonStr);

    // === 解析各板块并更新store ===
    const design = store.currentDesign;

    // 课标
    if (data.standardAnalysis) {
      const sa = data.standardAnalysis;
      const existingCompetencies = design.standardAnalysis.coreCompetencies;
      const competencyNames: string[] = sa.coreCompetencyNames || [];
      const competencies = competencyNames.map((name: string) => {
        const existing = existingCompetencies.find(c => c.name === name);
        return existing || { name, dimension: '相关维度', description: `${name}——符合2022版课标要求` };
      });

      store.updateSection('standardAnalysis', {
        contentRequirement: sa.contentRequirement || '',
        academicRequirement: sa.academicRequirement || '',
        teachingHint: sa.teachingHint || '',
        coreCompetencies: competencies.length > 0 ? competencies : existingCompetencies,
      });
    }

    // 教材
    if (data.textbookAnalysis) {
      const ta = data.textbookAnalysis;
      store.updateSection('textbookAnalysis', {
        verticalAnalysis: ta.verticalAnalysis || '',
        crossAnalysis: ta.crossAnalysis || '',
        bigConcept: ta.bigConcept || '',
        keyKnowledge: ta.keyKnowledge || [],
        difficulties: ta.difficulties || [],
      });
    }

    // 学情
    if (data.learnerAnalysis) {
      const la = data.learnerAnalysis;
      store.updateSection('learnerAnalysis', {
        priorKnowledge: la.priorKnowledge || '',
        priorExperience: la.priorExperience || '',
        cognitiveDifficulty: la.cognitiveDifficulty || '',
        preAssessment: la.preAssessment || '',
      });
    }

    // 学习目标
    if (data.learningObjectives && Array.isArray(data.learningObjectives)) {
      const objectives: LearningObjective[] = data.learningObjectives.map(
        (obj: Record<string, string>, i: number) => ({
          id: `obj${i + 1}`,
          content: obj.content || '',
          category: (obj.category || 'knowledge') as LearningObjective['category'],
          competencyLink: obj.competencyLink || '',
          assessmentMethod: obj.assessmentMethod || '',
          bloomLevel: 'understand' as const,
        })
      );
      store.updateSection('learningObjectives', objectives);
    }

    // 评价
    if (data.assessmentTasks) {
      const at = data.assessmentTasks;
      store.updateSection('assessmentTasks', {
        preAssessment: {
          method: at.preMethod || '',
          questions: at.preQuestions || [],
          purpose: at.prePurpose || '',
        },
        formativeAssessment: { checkpoints: [] },
        postAssessment: {
          method: at.postMethod || '',
          tasks: at.postTasks || [],
          rubric: at.postRubric || '',
        },
      });
    }

    // 教学活动
    if (data.activities && Array.isArray(data.activities)) {
      const activities: TeachingActivity[] = data.activities.map(
        (act: Record<string, string | number>, i: number) => ({
          id: `act${i + 1}`,
          phase: (act.phase || 'P-participatory') as TeachingActivity['phase'],
          title: String(act.title || ''),
          duration: Number(act.duration) || 5,
          teacherAction: String(act.teacherAction || ''),
          studentAction: String(act.studentAction || ''),
          designIntent: String(act.designIntent || ''),
          assessmentEmbedded: String(act.assessmentEmbedded || ''),
          materials: [],
        })
      );
      store.updateSection('activities', activities);
    }

    // 作业
    if (data.homework) {
      const hw = data.homework;
      const required = [];
      if (hw.requiredTitle1) required.push({ title: hw.requiredTitle1, description: hw.requiredDesc1 || '', targetObjective: 'obj1', estimatedTime: 10 });
      if (hw.requiredTitle2) required.push({ title: hw.requiredTitle2, description: hw.requiredDesc2 || '', targetObjective: 'obj2', estimatedTime: 8 });
      const optional = [];
      if (hw.optionalTitle) optional.push({ title: hw.optionalTitle, description: hw.optionalDesc || '', targetObjective: 'obj3', estimatedTime: 15 });

      store.updateSection('homework', {
        required,
        optional,
        designIntent: hw.designIntent || '',
        differentiationNote: hw.differentiationNote || '',
      });
    }

    // 板书
    if (data.boardDesign) {
      const bd = data.boardDesign;
      store.updateSection('boardDesign', {
        layout: bd.layout || '',
        keyElements: bd.keyElements || [],
        structureLogic: bd.structureLogic || '',
      });
    }

    // 反思
    if (data.reflection) {
      const rf = data.reflection;
      store.updateSection('reflection', {
        targetAchievement: rf.targetAchievement || '',
        evidenceSources: [],
        improvementMeasures: rf.improvementMeasures || [],
        notableObservations: rf.notableObservations || '',
      });
    }

    // 困难设计
    if (data.difficultyDesign) {
      const dd = data.difficultyDesign;
      store.updateSection('difficultyDesign', {
        targetDifficulty: dd.targetDifficulty || '',
        educationalValue: dd.educationalValue || '',
        zpdAlignment: dd.zpdAlignment || '',
        meaninglessObstacles: dd.meaninglessObstacles || [],
        motivationStrategy: dd.motivationStrategy || '',
        autonomySupport: dd.autonomySupport || '',
        competenceScaffold: dd.competenceScaffold || '',
        relatednessConnection: dd.relatednessConnection || '',
        difficultyFirst: dd.difficultyFirst || '',
        processPreservation: dd.processPreservation || '',
        abstractionProtection: dd.abstractionProtection || '',
      });
    }

    return { success: true, message: `✅ 《${topic}》教学设计已自动生成！请查看右侧预览并修改。` };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '未知错误';
    if (msg.includes('JSON')) {
      return { success: false, message: `AI返回格式有误，请重试（${msg.slice(0, 50)}...）` };
    }
    return { success: false, message: msg };
  }
}
