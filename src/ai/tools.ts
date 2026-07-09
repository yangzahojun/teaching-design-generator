import type { ToolDef } from './client';
import type { APIConfig } from '../types/teaching-design';
import { searchCurriculum } from '../data/curriculum-db';
import { useAppStore } from '../store/useAppStore';
import { aiAutoGenerate } from './full-generator';
import { enhanceSection } from './enhancer';

// ===== 工具定义 =====

export const AGENT_TOOLS: ToolDef[] = [
  {
    type: 'function',
    function: {
      name: 'search_curriculum',
      description:
        '搜索本地课程数据库，根据课题名称关键词查找匹配的课程条目。返回学科、年级、单元、教材版本等信息。当用户提到的课题名称你不确定属于哪个年级/单元时，使用此工具查询。',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: '搜索关键词，如课题名称（例如：三角形面积、浮力、背影）',
          },
        },
        required: ['keyword'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_design_state',
      description:
        '获取当前教学设计表单的填写状态。返回基本信息（学段/学科/年级/课题/教材/课时/模板）以及各板块是否已填写。在决定是否需要生成完整设计前，先调用此工具了解当前状态。',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_full_design',
      description:
        '生成完整的教学设计（包含课标研读、教材分析、学情分析、学习目标、评价任务、教学活动、作业设计、板书设计、教学反思、困难设计等9大板块）。生成后所有内容会自动填入左侧表单并在右侧预览。调用此工具前，务必确保已从用户处收集齐：学科、年级、课题名称、教材版本、课时时长。',
      parameters: {
        type: 'object',
        properties: {
          subject: { type: 'string', description: '学科，如：数学、语文、物理' },
          grade: { type: 'string', description: '年级，如：五年级、八年级' },
          topic: { type: 'string', description: '课题名称，如：三角形的面积、浮力' },
          textbook: { type: 'string', description: '教材版本，如：人教版、统编版' },
          duration: { type: 'number', description: '课时时长（分钟），默认40' },
          template: {
            type: 'string',
            enum: ['standard', 'boppps', 'ubd'],
            description: '模板类型：standard=标准9板块, boppps=BOPPPS模型, ubd=UbD逆向设计',
          },
        },
        required: ['subject', 'grade', 'topic', 'textbook', 'duration'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_design_section',
      description:
        '为教学设计的某一个特定板块生成内容建议。适用于用户只想修改/补充某个板块的场景。生成的文本建议会直接返回给你，你可以整理后呈现给用户。',
      parameters: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            description:
              '板块名称：standardAnalysis=课标研读, textbookAnalysis=教材分析, learnerAnalysis=学情分析, learningObjectives=学习目标, assessmentTasks=评价任务, activities=教学活动, homework=作业设计, boardDesign=板书设计, reflection=教学反思, difficultyDesign=困难设计框架',
          },
        },
        required: ['section'],
      },
    },
  },
];

// 板块名称 → 中文标签
const SECTION_LABELS: Record<string, string> = {
  standardAnalysis: '课标研读',
  textbookAnalysis: '教材分析',
  learnerAnalysis: '学情分析',
  learningObjectives: '学习目标',
  assessmentTasks: '评价任务',
  activities: '教学活动',
  homework: '作业设计',
  boardDesign: '板书设计',
  reflection: '教学反思',
  difficultyDesign: '困难设计框架',
};

// ===== 工具执行器 =====

export interface ToolCallResult {
  success: boolean;
  content: string;
}

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
  config: APIConfig
): Promise<ToolCallResult> {
  switch (name) {
    // ── 搜索课程数据库 ──
    case 'search_curriculum': {
      const keyword = String(args.keyword ?? '');
      if (!keyword.trim()) {
        return { success: false, content: '搜索关键词不能为空' };
      }
      const results = searchCurriculum(keyword);
      if (results.length === 0) {
        return { success: true, content: `未找到与「${keyword}」匹配的课程条目。建议请用户提供更具体的课题名称。` };
      }
      // 只返回前6条，每条精简信息
      const items = results.slice(0, 6).map(r =>
        `- ${r.subject} · ${r.grade} · 《${r.keywords[0]}》(${r.unit}) [${r.textbook}]`
      );
      return {
        success: true,
        content: `找到 ${results.length} 条匹配「${keyword}」的课程：\n${items.join('\n')}`,
      };
    }

    // ── 获取当前设计状态 ──
    case 'get_design_state': {
      const design = useAppStore.getState().currentDesign;
      const m = design.meta;
      const sections = [
        { key: 'standardAnalysis', label: '课标研读', filled: !!(design.standardAnalysis.contentRequirement || design.standardAnalysis.coreCompetencies.length > 0) },
        { key: 'textbookAnalysis', label: '教材分析', filled: !!(design.textbookAnalysis.verticalAnalysis || design.textbookAnalysis.bigConcept) },
        { key: 'learnerAnalysis', label: '学情分析', filled: !!(design.learnerAnalysis.priorKnowledge || design.learnerAnalysis.cognitiveDifficulty) },
        { key: 'learningObjectives', label: '学习目标', filled: design.learningObjectives.length > 0 && !!design.learningObjectives[0]?.content },
        { key: 'assessmentTasks', label: '评价任务', filled: !!(design.assessmentTasks.preAssessment?.method || design.assessmentTasks.postAssessment?.method) },
        { key: 'activities', label: '教学活动', filled: design.activities.length > 0 && !!design.activities[0]?.title },
        { key: 'homework', label: '作业设计', filled: !!(design.homework.designIntent || design.homework.required.length > 0) },
        { key: 'boardDesign', label: '板书设计', filled: !!(design.boardDesign.layout || design.boardDesign.keyElements.length > 0) },
        { key: 'reflection', label: '教学反思', filled: !!(design.reflection.targetAchievement || design.reflection.improvementMeasures.length > 0) },
        { key: 'difficultyDesign', label: '困难设计', filled: !!(design.difficultyDesign?.targetDifficulty) },
      ];
      const filled = sections.filter(s => s.filled).map(s => s.label);
      const empty = sections.filter(s => !s.filled).map(s => s.label);

      return {
        success: true,
        content: `【基本信息】\n学段: ${m.stage || '未设置'}\n学科: ${m.subject || '未设置'}\n年级: ${m.grade || '未设置'}\n课题: ${m.title || '未设置'}\n教材: ${m.textbookVersion || '未设置'}\n课时: ${m.duration || 40}分钟\n模板: ${m.template || 'standard'}\n\n【板块状态】\n已填写(${filled.length}/10): ${filled.join('、') || '无'}\n未填写: ${empty.join('、')}`,
      };
    }

    // ── 生成完整教学设计 ──
    case 'generate_full_design': {
      const subject = String(args.subject ?? '数学');
      const grade = String(args.grade ?? '五年级');
      const topic = String(args.topic ?? '');
      const textbook = String(args.textbook ?? '人教版');
      const duration = Number(args.duration) || 40;
      // 顺便把 meta 也更新一下
      const template = (['standard', 'boppps', 'ubd'].includes(String(args.template ?? ''))
        ? String(args.template)
        : 'standard') as 'standard' | 'boppps' | 'ubd';
      const store = useAppStore.getState();
      store.updateMeta({ subject: subject as never, grade: grade as never, title: topic, textbookVersion: textbook, duration, template });
      store.setTemplate(template);

      const result = await aiAutoGenerate(config, subject, grade, topic, textbook, duration);
      return {
        success: result.success,
        content: result.success
          ? `教学设计《${topic}》（${grade}${subject}，${textbook}，${duration}分钟）已成功生成！所有9大板块内容已自动填入表单。`
          : `生成失败：${result.message}`,
      };
    }

    // ── 生成单个板块 ──
    case 'generate_design_section': {
      const section = String(args.section ?? '');
      if (!SECTION_LABELS[section]) {
        return { success: false, content: `不支持的板块: ${section}。可用板块: ${Object.keys(SECTION_LABELS).join(', ')}` };
      }
      const design = useAppStore.getState().currentDesign;
      const text = await enhanceSection(config, design, section);
      return {
        success: true,
        content: `已为「${SECTION_LABELS[section]}」板块生成内容建议：\n\n${text}`,
      };
    }

    default:
      return { success: false, content: `未知工具: ${name}` };
  }
}
