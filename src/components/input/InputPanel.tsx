import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader2, AlertCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SUBJECTS_BY_STAGE, getGradesForSubject, getTextbooksForSubject } from '../../data/subjects';
import { getCompetenciesForSubject, BOPPPS_PHASES } from '../../data/core-competencies';
import type { LearningObjective, TeachingActivity, CoreCompetency } from '../../types/teaching-design';
import { aiAutoGenerate } from '../../ai/full-generator';
import { searchCurriculum } from '../../data/curriculum-db';
import type { CurriculumEntry } from '../../data/curriculum-db';
import Button from '../shared/Button';
import Select from '../shared/Select';
import TextInput from '../shared/TextInput';
import Card from '../shared/Card';

export default function InputPanel() {
  const { currentDesign, apiConfig, updateMeta, updateSection } = useAppStore();
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiToast, setAiToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [topicSuggestions, setTopicSuggestions] = useState<CurriculumEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { meta, standardAnalysis, textbookAnalysis, learnerAnalysis,
    learningObjectives, assessmentTasks, activities, homework, boardDesign,
    reflection, difficultyDesign } = currentDesign;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    standard: true,
    textbook: true,
    learner: true,
    objectives: true,
    activities: true,
    assessment: true,
    homework: true,
    board: true,
    reflection: true,
    difficulty: true,
  });

  const toggleSection = (key: string) =>
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const SectionHeader = ({ id, title, icon }: { id: string; title: string; icon: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-2.5 hover:bg-[#F8FAFC] rounded-lg px-1 transition-colors cursor-pointer"
    >
      <span className="flex items-center gap-2 text-base font-semibold text-[#1E293B]">
        <span className="text-base">{icon}</span> {title}
      </span>
      {expandedSections[id] ? <ChevronUp size={16} className="text-[#94A3B8]" /> : <ChevronDown size={16} className="text-[#94A3B8]" />}
    </button>
  );

  // === 学习目标操作 ===
  const addObjective = () => {
    const newObj: LearningObjective = {
      id: `obj${learningObjectives.length + 1}`,
      content: '', category: 'knowledge', competencyLink: '',
      assessmentMethod: '', bloomLevel: 'understand',
    };
    updateSection('learningObjectives', [...learningObjectives, newObj]);
  };

  const updateObjective = (idx: number, field: keyof LearningObjective, value: string) => {
    const updated = [...learningObjectives];
    updated[idx] = { ...updated[idx], [field]: value };
    updateSection('learningObjectives', updated);
  };

  const removeObjective = (idx: number) => {
    updateSection('learningObjectives', learningObjectives.filter((_, i) => i !== idx));
  };

  // === 教学活动操作 ===
  const addActivity = () => {
    const newAct: TeachingActivity = {
      id: `act${activities.length + 1}`,
      phase: 'P-participatory', title: '', duration: 5,
      teacherAction: '', studentAction: '', designIntent: '',
      assessmentEmbedded: '', materials: [],
    };
    updateSection('activities', [...activities, newAct]);
  };

  const updateActivity = (idx: number, field: keyof TeachingActivity, value: string | number | string[]) => {
    const updated = [...activities];
    updated[idx] = { ...updated[idx], [field]: value };
    updateSection('activities', updated);
  };

  const removeActivity = (idx: number) => {
    updateSection('activities', activities.filter((_, i) => i !== idx));
  };

  // === 核心素养操作 ===
  const toggleCompetency = (competency: CoreCompetency) => {
    const exists = standardAnalysis.coreCompetencies.find(c => c.name === competency.name);
    if (exists) {
      updateSection('standardAnalysis', {
        coreCompetencies: standardAnalysis.coreCompetencies.filter(c => c.name !== competency.name),
      });
    } else {
      updateSection('standardAnalysis', {
        coreCompetencies: [...standardAnalysis.coreCompetencies, competency],
      });
    }
  };

  const handleTopicChange = (value: string) => {
    updateMeta({ title: value });
    if (value.trim().length >= 1) {
      const results = searchCurriculum(value);
      setTopicSuggestions(results);
      const exactMatch = results.find(r => r.keywords.some(kw => kw === value.trim()));
      if (exactMatch) {
        const isMiddle = exactMatch.grade.startsWith('七') || exactMatch.grade.startsWith('八') || exactMatch.grade.startsWith('九');
        const stage: '小学'|'初中' = isMiddle ? '初中' : '小学';
        updateMeta({
          stage,
          subject: exactMatch.subject as typeof meta.subject,
          grade: exactMatch.grade as typeof meta.grade,
          textbookVersion: exactMatch.textbook,
          unit: exactMatch.unit,
        });
        setShowSuggestions(false);
        return;
      }
      setShowSuggestions(results.length > 0);
    } else {
      setTopicSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectTopic = (entry: CurriculumEntry) => {
    const bestKeyword = entry.keywords[0] || '';
    const title = bestKeyword.length > (meta.title || '').length ? bestKeyword : meta.title;
    const isMiddle = entry.grade.startsWith('七') || entry.grade.startsWith('八') || entry.grade.startsWith('九');
    const stage: '小学'|'初中' = isMiddle ? '初中' : '小学';
    updateMeta({
      title: title || bestKeyword,
      stage,
      subject: entry.subject as typeof meta.subject,
      grade: entry.grade as typeof meta.grade,
      textbookVersion: entry.textbook,
      unit: entry.unit,
    });
    setShowSuggestions(false);
    setTopicSuggestions([]);
  };

  const handleTopicBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleAIGenerate = async () => {
    setAiGenerating(true);
    setAiToast(null);
    try {
      const result = await aiAutoGenerate(
        apiConfig,
        meta.subject || '数学',
        meta.grade || '五年级',
        meta.title || '',
        meta.textbookVersion || '人教版',
        meta.duration || 40
      );
      setAiToast({ type: result.success ? 'success' : 'error', message: result.message });
    } catch (e: unknown) {
      setAiToast({ type: 'error', message: e instanceof Error ? e.message : '生成失败' });
    }
    setAiGenerating(false);
  };

  return (
    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] pr-1">
      {/* ===== AI 一键生成按钮 ===== */}

      <div className="bg-gradient-to-r from-[#DBEAFE] via-[#E0E7FF] to-[#DBEAFE] border border-[#2563EB]/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#1D4ED8]">AI 一键生成教学设计</h3>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              填写左侧基本信息（课题名称必填），点击按钮，AI自动生成全部9大板块
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            loading={aiGenerating}
            onClick={handleAIGenerate}
            icon={aiGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            className="flex-shrink-0"
          >
            {aiGenerating ? '生成中...' : '一键生成'}
          </Button>
        </div>
        {aiToast && aiToast.type === 'error' && (
          <div className="mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600">
            <AlertCircle size={13} />
            {aiToast.message}
          </div>
        )}
      </div>
      <Card padding="sm">
        <SectionHeader id="basic" title="基本信息" icon="📋" />
        {expandedSections.basic && (
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-3 gap-2">
              <Select label="学段" value={meta.stage || '小学'}
                onChange={(v) => updateMeta({ stage: v as typeof meta.stage, grade: v === '初中' ? '七年级' : '一年级' })}
                options={[{ value: '小学', label: '小学' }, { value: '初中', label: '初中' }]} />
              <Select label="学科" value={meta.subject || '数学'}
                onChange={(v) => updateMeta({ subject: v as typeof meta.subject })}
                options={(SUBJECTS_BY_STAGE[meta.stage || '小学'] || []).map(s => ({ value: s.value, label: s.label }))} />
              <Select label="年级" value={meta.grade || ''}
                onChange={(v) => updateMeta({ grade: v as typeof meta.grade })}
                options={getGradesForSubject(meta.subject || '数学', meta.stage || '小学').map(g => ({ value: g, label: g }))} />
            </div>
            {/* 智能课题输入 — 自动匹配年级+单元 */}
            <div className="flex flex-col gap-1 relative overflow-visible">
              <label className="text-xs font-medium text-[#64748B]">
                课题名称<span className="text-[#EF4444] ml-0.5">*</span>
                <span className="text-[10px] text-[#94A3B8] ml-1 font-normal">输入后自动匹配年级和单元</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={meta.title || ''}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  onFocus={() => { if (topicSuggestions.length > 0) setShowSuggestions(true); }}
                  onBlur={handleTopicBlur}
                  placeholder="例如：三角形的面积"
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-150"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              </div>
              {showSuggestions && topicSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-64 overflow-y-auto"
                  style={{ top: '64px' }}>
                  {topicSuggestions.map((entry, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); selectTopic(entry); }}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#DBEAFE] transition-colors border-b border-[#E2E8F0]/50 last:border-0 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-[#1E293B]">{entry.keywords[0]}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#DBEAFE] text-[#1D4ED8] rounded font-medium">{entry.subject}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-[#64748B] rounded">{entry.grade}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 truncate">{entry.unit} · {entry.textbook}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                label="教材版本"
                value={meta.textbookVersion || ''}
                onChange={(v) => updateMeta({ textbookVersion: v })}
                options={getTextbooksForSubject(meta.subject || '数学', meta.stage || '小学').map(v => ({ value: v, label: v }))}
              />
              <TextInput label="课时(分钟)" value={String(meta.duration || '')} onChange={(v) => updateMeta({ duration: Number(v) || 40 })} placeholder="40" />
            </div>
            <TextInput label="所属单元" value={meta.unit || ''} onChange={(v) => updateMeta({ unit: v })} placeholder="例如：第五单元 多边形的面积" />
            <TextInput label="设计者" value={meta.designer || ''} onChange={(v) => updateMeta({ designer: v })} placeholder="输入姓名" />
          </div>
        )}
      </Card>

      {/* ===== 课标研读 ===== */}
      <Card padding="sm">
        <SectionHeader id="standard" title="课标研读" icon="🎯" />
        {expandedSections.standard && (
          <div className="space-y-2 mt-2">
            <TextInput label="内容要求" value={standardAnalysis.contentRequirement || ''} onChange={(v) => updateSection('standardAnalysis', { contentRequirement: v })} placeholder="引用课标原文..." multiline rows={2} />
            <TextInput label="学业要求" value={standardAnalysis.academicRequirement || ''} onChange={(v) => updateSection('standardAnalysis', { academicRequirement: v })} placeholder="课标规定的学业质量标准..." multiline rows={2} />
            <TextInput label="教学提示" value={standardAnalysis.teachingHint || ''} onChange={(v) => updateSection('standardAnalysis', { teachingHint: v })} placeholder="课标提供的教学建议..." multiline rows={2} />
            <div>
              <label className="text-xs font-medium text-[#64748B] mb-1.5 block">关联核心素养（点击选择）</label>
              <div className="flex flex-wrap gap-1.5">
                {getCompetenciesForSubject(meta.subject || '数学').map((c) => {
                  const selected = standardAnalysis.coreCompetencies.some(sc => sc.name === c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleCompetency(c)}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer
                        ${selected ? 'bg-[#DBEAFE] border-[#2563EB] text-[#1D4ED8] font-medium' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB]'}`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ===== 教材分析 ===== */}
      <Card padding="sm">
        <SectionHeader id="textbook" title="教材分析" icon="📖" />
        {expandedSections.textbook && (
          <div className="space-y-2 mt-2">
            <TextInput label="纵向分析" value={textbookAnalysis.verticalAnalysis || ''} onChange={(v) => updateSection('textbookAnalysis', { verticalAnalysis: v })} placeholder="本课在学段/单元中的前后联系..." multiline rows={2} />
            <TextInput label="横向对比" value={textbookAnalysis.crossAnalysis || ''} onChange={(v) => updateSection('textbookAnalysis', { crossAnalysis: v })} placeholder="不同版本教材的处理方式有何异同..." multiline rows={2} />
            <TextInput label="大概念(Big Idea)" value={textbookAnalysis.bigConcept || ''} onChange={(v) => updateSection('textbookAnalysis', { bigConcept: v })} placeholder="本课背后的核心概念..." />
            <TextInput label="教学重点" value={textbookAnalysis.difficulties?.[0] || ''} onChange={(v) => { const arr = [...(textbookAnalysis.difficulties||[])]; arr[0] = v; updateSection('textbookAnalysis', { difficulties: arr }); }} placeholder="本课的教学重点" />
            <TextInput label="教学难点" value={textbookAnalysis.difficulties?.[1] || ''} onChange={(v) => { const arr = [...(textbookAnalysis.difficulties||[])]; arr[1] = v; updateSection('textbookAnalysis', { difficulties: arr }); }} placeholder="学生可能遇到的最大障碍" />
            <TextInput label="突破策略" value={textbookAnalysis.difficulties?.[2] || ''} onChange={(v) => { const arr = [...(textbookAnalysis.difficulties||[])]; arr[2] = v; updateSection('textbookAnalysis', { difficulties: arr }); }} placeholder="帮助学生突破难点的具体教学策略..." multiline rows={2} />
          </div>
        )}
      </Card>

      {/* ===== 学情分析 ===== */}
      <Card padding="sm">
        <SectionHeader id="learner" title="学情分析" icon="👨‍🎓" />
        {expandedSections.learner && (
          <div className="space-y-2 mt-2">
            <TextInput label="已有知识基础" value={learnerAnalysis.priorKnowledge || ''} onChange={(v) => updateSection('learnerAnalysis', { priorKnowledge: v })} placeholder="学生已掌握的与本课相关的知识..." multiline rows={2} />
            <TextInput label="已有生活经验" value={learnerAnalysis.priorExperience || ''} onChange={(v) => updateSection('learnerAnalysis', { priorExperience: v })} placeholder="学生生活中与本课相关的经验..." multiline rows={2} />
            <TextInput label="认知困难预判" value={learnerAnalysis.cognitiveDifficulty || ''} onChange={(v) => updateSection('learnerAnalysis', { cognitiveDifficulty: v })} placeholder="预判学生可能遇到的理解困难..." multiline rows={2} />
            <TextInput label="前测设计" value={learnerAnalysis.preAssessment || ''} onChange={(v) => updateSection('learnerAnalysis', { preAssessment: v })} placeholder="如何检测学生的知识起点..." multiline rows={2} />
          </div>
        )}
      </Card>

      {/* ===== 学习目标 ===== */}
      <Card padding="sm">
        <SectionHeader id="objectives" title="学习目标" icon="📝" />
        {expandedSections.objectives && (
          <div className="space-y-2 mt-2">
            {learningObjectives.map((obj, idx) => (
              <div key={obj.id} className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#64748B]">目标 {idx + 1}</span>
                  <button onClick={() => removeObjective(idx)} className="text-[#EF4444] hover:bg-red-50 p-0.5 rounded"><Trash2 size={14} /></button>
                </div>
                <TextInput value={obj.content} onChange={(v) => updateObjective(idx, 'content', v)} placeholder="例如：通过动手操作，探索并推导出三角形面积计算公式..." />
                <div className="grid grid-cols-3 gap-1.5">
                  <Select value={obj.category} onChange={(v) => updateObjective(idx, 'category', v)} options={[
                    { value: 'knowledge', label: '知识' }, { value: 'skill', label: '能力' }, { value: 'attitude', label: '情感' },
                  ]} />
                  <TextInput value={obj.competencyLink} onChange={(v) => updateObjective(idx, 'competencyLink', v)} placeholder="核心素养" />
                  <TextInput value={obj.assessmentMethod} onChange={(v) => updateObjective(idx, 'assessmentMethod', v)} placeholder="评价方式" />
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={addObjective} icon={<Plus size={14} />}>添加目标</Button>
          </div>
        )}
      </Card>

      {/* ===== 教学活动 (BOPPPS) ===== */}
      <Card padding="sm">
        <SectionHeader id="activities" title="教学活动 (BOPPPS结构)" icon="🏗️" />
        {expandedSections.activities && (
          <div className="space-y-2 mt-2">
            {activities.map((act, idx) => (
              <div key={act.id} className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#64748B]">活动 {idx + 1}</span>
                  <button onClick={() => removeActivity(idx)} className="text-[#EF4444] hover:bg-red-50 p-0.5 rounded"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <Select value={act.phase} onChange={(v) => updateActivity(idx, 'phase', v)} options={BOPPPS_PHASES.map(p => ({ value: p.value, label: p.label }))} />
                  <TextInput value={String(act.duration)} onChange={(v) => updateActivity(idx, 'duration', Number(v) || 5)} placeholder="分钟" />
                </div>
                <TextInput value={act.title} onChange={(v) => updateActivity(idx, 'title', v)} placeholder="活动名称" />
                <TextInput value={act.teacherAction} onChange={(v) => updateActivity(idx, 'teacherAction', v)} placeholder="教师活动..." multiline rows={2} />
                <TextInput value={act.studentAction} onChange={(v) => updateActivity(idx, 'studentAction', v)} placeholder="学生活动..." multiline rows={2} />
                <TextInput value={act.designIntent} onChange={(v) => updateActivity(idx, 'designIntent', v)} placeholder="设计意图..." />
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={addActivity} icon={<Plus size={14} />}>添加活动</Button>
          </div>
        )}
      </Card>

      {/* ===== 评价设计 ===== */}
      <Card padding="sm">
        <SectionHeader id="assessment" title="评价任务" icon="✅" />
        {expandedSections.assessment && (
          <div className="space-y-2 mt-2">
            <TextInput label="前测方式" value={assessmentTasks.preAssessment?.method || ''} onChange={(v) => updateSection('assessmentTasks', { preAssessment: { ...assessmentTasks.preAssessment, method: v, questions: assessmentTasks.preAssessment?.questions || [], purpose: assessmentTasks.preAssessment?.purpose || '' } })} placeholder="如：回顾提问、小测..." />
            <TextInput label="前测问题" value={assessmentTasks.preAssessment?.questions?.join('；') || ''} onChange={(v) => updateSection('assessmentTasks', { preAssessment: { ...assessmentTasks.preAssessment, method: assessmentTasks.preAssessment?.method || '', questions: v.split('；').filter(Boolean), purpose: assessmentTasks.preAssessment?.purpose || '' } })} placeholder="用分号(；)分隔多个问题" />
            <TextInput label="后测方式" value={assessmentTasks.postAssessment?.method || ''} onChange={(v) => updateSection('assessmentTasks', { postAssessment: { ...assessmentTasks.postAssessment, method: v } })} placeholder="如：课堂检测、作品展示..." />
            <TextInput label="后测任务" value={assessmentTasks.postAssessment?.tasks?.join('；') || ''} onChange={(v) => updateSection('assessmentTasks', { postAssessment: { ...assessmentTasks.postAssessment, tasks: v.split('；').filter(Boolean) } })} placeholder="用分号(；)分隔" />
            <TextInput label="评价量规" value={assessmentTasks.postAssessment?.rubric || ''} onChange={(v) => updateSection('assessmentTasks', { postAssessment: { ...assessmentTasks.postAssessment, rubric: v } })} placeholder="描述优秀/合格/需辅导的标准..." multiline />
          </div>
        )}
      </Card>

      {/* ===== 作业设计 ===== */}
      <Card padding="sm">
        <SectionHeader id="homework" title="作业设计" icon="📚" />
        {expandedSections.homework && (
          <div className="space-y-2 mt-2">
            <TextInput label="设计意图" value={homework.designIntent || ''} onChange={(v) => updateSection('homework', { designIntent: v })} placeholder="整体设计意图..." />
            <TextInput label="分层说明" value={homework.differentiationNote || ''} onChange={(v) => updateSection('homework', { differentiationNote: v })} placeholder="针对不同水平学生的分层策略..." />
          </div>
        )}
      </Card>

      {/* ===== 困难设计框架 ★ ===== */}
      <Card padding="sm">
        <SectionHeader id="difficulty" title="★ 困难设计框架" icon="🧗" />
        {expandedSections.difficulty && (
          <div className="space-y-2 mt-2">
            <TextInput label="核心困难" value={difficultyDesign?.targetDifficulty || ''} onChange={(v) => updateSection('difficultyDesign', { targetDifficulty: v })} placeholder="本课最有教育价值的困难是什么？..." multiline rows={2} />
            <TextInput label="教育价值" value={difficultyDesign?.educationalValue || ''} onChange={(v) => updateSection('difficultyDesign', { educationalValue: v })} placeholder="为什么这个困难值得保留？..." multiline rows={2} />
            <TextInput label="ZPD对齐" value={difficultyDesign?.zpdAlignment || ''} onChange={(v) => updateSection('difficultyDesign', { zpdAlignment: v })} placeholder="如何确保困难在最近发展区内..." multiline rows={2} />
            <TextInput label="动机激发策略" value={difficultyDesign?.motivationStrategy || ''} onChange={(v) => updateSection('difficultyDesign', { motivationStrategy: v })} placeholder="动机优先——如何让学生愿意面对困难..." multiline rows={2} />
            <TextInput label="困难前置" value={difficultyDesign?.difficultyFirst || ''} onChange={(v) => updateSection('difficultyDesign', { difficultyFirst: v })} placeholder="如何在AI/教师帮助前先让学生经历困惑..." multiline rows={2} />
            <TextInput label="过程保留" value={difficultyDesign?.processPreservation || ''} onChange={(v) => updateSection('difficultyDesign', { processPreservation: v })} placeholder="如何确保核心思维环节由学生完成..." multiline rows={2} />
            <TextInput label="抽象保护" value={difficultyDesign?.abstractionProtection || ''} onChange={(v) => updateSection('difficultyDesign', { abstractionProtection: v })} placeholder="如何保护知识的抽象性和思维深度..." multiline rows={2} />
          </div>
        )}
      </Card>

      {/* ===== 板书与反思 ===== */}
      <Card padding="sm">
        <SectionHeader id="board" title="板书设计" icon="🖊️" />
        {expandedSections.board && (
          <div className="space-y-2 mt-2">
            <TextInput label="板书布局" value={boardDesign.layout || ''} onChange={(v) => updateSection('boardDesign', { layout: v })} placeholder="描述板书的结构化布局..." multiline rows={3} />
            <TextInput label="关键要素" value={boardDesign.keyElements?.join(' → ') || ''} onChange={(v) => updateSection('boardDesign', { keyElements: v.split('→').map(s => s.trim()).filter(Boolean) })} placeholder="用箭头(→)连接" />
          </div>
        )}
      </Card>

      <Card padding="sm">
        <SectionHeader id="reflection" title="教学反思" icon="💭" />
        {expandedSections.reflection && (
          <div className="space-y-2 mt-2">
            <TextInput label="目标达成度预估" value={reflection.targetAchievement || ''} onChange={(v) => updateSection('reflection', { targetAchievement: v })} multiline rows={2} />
            <TextInput label="改进措施" value={reflection.improvementMeasures?.join('；') || ''} onChange={(v) => updateSection('reflection', { improvementMeasures: v.split('；').filter(Boolean) })} placeholder="用分号(；)分隔" />
          </div>
        )}
      </Card>
    </div>
  );
}
