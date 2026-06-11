import { chatCompletion } from './client';
import { SYSTEM_PROMPT, FULL_DESIGN_JSON_PROMPT } from './prompts';
import { loadFromBuiltinLibrary, loadFromLocalCache, saveToLocalCache } from './plan-cache';
import type { APIConfig, LearningObjective, TeachingActivity } from '../types/teaching-design';
import { useAppStore } from '../store/useAppStore';

// 应用生成的JSON数据到store
function applyPlanData(data: Record<string, unknown>) {
  const store = useAppStore.getState();
  const design = store.currentDesign;

  // 课标
  if (data.standardAnalysis) {
    const sa = data.standardAnalysis as Record<string, unknown>;
    const existingCompetencies = design.standardAnalysis.coreCompetencies;
    const competencyNames: string[] = (sa.coreCompetencyNames as string[]) || [];
    const competencies = competencyNames.map((name: string) => {
      const existing = existingCompetencies.find(c => c.name === name);
      return existing || { name, dimension: '素养维度', description: `${name}——符合2022版课标要求` };
    });
    store.updateSection('standardAnalysis', {
      contentRequirement: (sa.contentRequirement as string) || '',
      academicRequirement: (sa.academicRequirement as string) || '',
      teachingHint: (sa.teachingHint as string) || '',
      coreCompetencies: competencies.length > 0 ? competencies : existingCompetencies,
    });
  }

  // 教材
  if (data.textbookAnalysis) {
    const ta = data.textbookAnalysis as Record<string, unknown>;
    store.updateSection('textbookAnalysis', {
      verticalAnalysis: (ta.verticalAnalysis as string) || '',
      crossAnalysis: (ta.crossAnalysis as string) || '',
      bigConcept: (ta.bigConcept as string) || '',
      keyKnowledge: (ta.keyKnowledge as string[]) || [],
      difficulties: (ta.difficulties as string[]) || [],
    });
  }

  // 学情
  if (data.learnerAnalysis) {
    const la = data.learnerAnalysis as Record<string, unknown>;
    store.updateSection('learnerAnalysis', {
      priorKnowledge: (la.priorKnowledge as string) || '',
      priorExperience: (la.priorExperience as string) || '',
      cognitiveDifficulty: (la.cognitiveDifficulty as string) || '',
      preAssessment: (la.preAssessment as string) || '',
    });
  }

  // 学习目标
  if (data.learningObjectives && Array.isArray(data.learningObjectives)) {
    const objectives: LearningObjective[] = (data.learningObjectives as Record<string, string>[]).map(
      (obj, i) => ({
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
    const at = data.assessmentTasks as Record<string, unknown>;
    store.updateSection('assessmentTasks', {
      preAssessment: {
        method: (at.preMethod as string) || '',
        questions: (at.preQuestions as string[]) || [],
        purpose: (at.prePurpose as string) || '',
      },
      formativeAssessment: { checkpoints: [] },
      postAssessment: {
        method: (at.postMethod as string) || '',
        tasks: (at.postTasks as string[]) || [],
        rubric: (at.postRubric as string) || '',
      },
    });
  }

  // 教学活动
  if (data.activities && Array.isArray(data.activities)) {
    const activities: TeachingActivity[] = (data.activities as Record<string, unknown>[]).map(
      (act, i) => ({
        id: `act${i + 1}`,
        phase: (act.phase as TeachingActivity['phase']) || 'P-participatory',
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
    const hw = data.homework as Record<string, unknown>;
    const required = [];
    if (hw.requiredTitle1) required.push({ title: String(hw.requiredTitle1), description: String(hw.requiredDesc1 || ''), targetObjective: 'obj1', estimatedTime: 10 });
    if (hw.requiredTitle2) required.push({ title: String(hw.requiredTitle2), description: String(hw.requiredDesc2 || ''), targetObjective: 'obj2', estimatedTime: 8 });
    const optional = [];
    if (hw.optionalTitle) optional.push({ title: String(hw.optionalTitle), description: String(hw.optionalDesc || ''), targetObjective: 'obj3', estimatedTime: 15 });
    store.updateSection('homework', {
      required, optional,
      designIntent: (hw.designIntent as string) || '',
      differentiationNote: (hw.differentiationNote as string) || '',
    });
  }

  // 板书
  if (data.boardDesign) {
    const bd = data.boardDesign as Record<string, unknown>;
    store.updateSection('boardDesign', {
      layout: (bd.layout as string) || '',
      keyElements: (bd.keyElements as string[]) || [],
      structureLogic: (bd.structureLogic as string) || '',
    });
  }

  // 反思
  if (data.reflection) {
    const rf = data.reflection as Record<string, unknown>;
    store.updateSection('reflection', {
      targetAchievement: (rf.targetAchievement as string) || '',
      evidenceSources: [],
      improvementMeasures: (rf.improvementMeasures as string[]) || [],
      notableObservations: (rf.notableObservations as string) || '',
    });
  }

  // 困难设计
  if (data.difficultyDesign) {
    const dd = data.difficultyDesign as Record<string, unknown>;
    store.updateSection('difficultyDesign', {
      targetDifficulty: (dd.targetDifficulty as string) || '',
      educationalValue: (dd.educationalValue as string) || '',
      zpdAlignment: (dd.zpdAlignment as string) || '',
      meaninglessObstacles: (dd.meaninglessObstacles as string[]) || [],
      motivationStrategy: (dd.motivationStrategy as string) || '',
      autonomySupport: (dd.autonomySupport as string) || '',
      competenceScaffold: (dd.competenceScaffold as string) || '',
      relatednessConnection: (dd.relatednessConnection as string) || '',
      difficultyFirst: (dd.difficultyFirst as string) || '',
      processPreservation: (dd.processPreservation as string) || '',
      abstractionProtection: (dd.abstractionProtection as string) || '',
    });
  }
}

// 核心函数：缓存优先 → API兜底
export async function aiAutoGenerate(
  config: APIConfig,
  subject: string,
  grade: string,
  topic: string,
  textbook: string,
  duration: number
): Promise<{ success: boolean; message: string }> {
  if (!topic.trim()) {
    return { success: false, message: '请先填写课题名称' };
  }

  try {
    // ★ 第一步：尝试从预生成库加载（秒出，0 token）
    const builtin = await loadFromBuiltinLibrary(subject, grade, topic);
    if (builtin) {
      applyPlanData(builtin);
      return { success: true, message: `📚 《${topic}》从教案库中秒出！零token消耗。` };
    }

    // ★ 第二步：尝试从localStorage缓存加载（之前API生成过的）
    const cached = loadFromLocalCache(subject, grade, topic);
    if (cached) {
      applyPlanData(cached);
      return { success: true, message: `💾 《${topic}》从本地缓存加载（曾用API生成过）` };
    }

    // ★ 第三步：都没有 → 调API生成
    if (!config.apiKey) {
      return { success: false, message: '教案库中未找到该课题，且未配置API密钥。请在设置页面配置或选择库中已有课题。' };
    }

    const prompt = FULL_DESIGN_JSON_PROMPT(subject, grade, topic, textbook, duration);
    const raw = await chatCompletion(config, [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ], { temperature: 0.7, maxTokens: 4000 });

    // 解析JSON
    let jsonStr = raw;
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    jsonStr = jsonStr.trim();

    const data = JSON.parse(jsonStr);
    applyPlanData(data);

    // 保存到localStorage，下次秒开
    saveToLocalCache(subject, grade, topic, data);

    return { success: true, message: `🤖 《${topic}》已生成并缓存（本次消耗~0.008元）。下次同样课题秒出！` };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '未知错误';
    if (msg.includes('JSON')) {
      return { success: false, message: `AI返回格式有误，请重试（${msg.slice(0, 50)}...）` };
    }
    return { success: false, message: msg };
  }
}
