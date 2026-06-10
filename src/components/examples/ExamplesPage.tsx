import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, GraduationCap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import examples from '../../data/examples';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Tag from '../shared/Tag';

export default function ExamplesPage() {
  const navigate = useNavigate();
  const { setDesign, setTemplate } = useAppStore();
  const [subjectFilter, setSubjectFilter] = useState<string>('');

  const filtered = subjectFilter
    ? examples.filter(e => e.meta.subject === subjectFilter)
    : examples;

  const handleLoadExample = (example: typeof examples[0]) => {
    setDesign(example);
    setTemplate(example.meta.template);
    navigate('/');
  };

  // 按学科分组
  const subjects = [...new Set(examples.map(e => e.meta.subject))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
          <BookOpen size={24} className="text-[#2563EB]" />
          范例课例库
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          点击任一范例自动加载到生成器，可在此基础上修改为你自己的教学设计。
        </p>
      </div>

      {/* 筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSubjectFilter('')}
          className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer
            ${!subjectFilter ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#2563EB]'}`}
        >
          全部 ({examples.length})
        </button>
        {subjects.map(sub => {
          const count = examples.filter(e => e.meta.subject === sub).length;
          return (
            <button
              key={sub}
              onClick={() => setSubjectFilter(sub)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer
                ${subjectFilter === sub ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#2563EB]'}`}
            >
              {sub} ({count})
            </button>
          );
        })}
      </div>

      {/* 范例网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((example, idx) => (
          <Card key={idx} padding="md" className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => handleLoadExample(example)}
          >
            <div className="space-y-3">
              {/* 标题 */}
              <div>
                <h3 className="font-semibold text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
                  《{example.meta.title}》
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Tag color="blue">{example.meta.subject}</Tag>
                  <Tag color="slate">{example.meta.grade}</Tag>
                  <Tag color="cyan">{example.meta.textbookVersion}</Tag>
                </div>
              </div>

              {/* 核心素养 */}
              {example.standardAnalysis.coreCompetencies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {example.standardAnalysis.coreCompetencies.slice(0, 3).map(c => (
                    <span key={c.name} className="text-[10px] px-2 py-0.5 bg-[#F8FAFC] text-[#64748B] rounded-full">
                      {c.name}
                    </span>
                  ))}
                </div>
              )}

              {/* 大概念 */}
              {example.textbookAnalysis.bigConcept && (
                <p className="text-xs text-[#64748B] line-clamp-2 italic border-l-2 border-[#DBEAFE] pl-2">
                  大概念：{example.textbookAnalysis.bigConcept}
                </p>
              )}

              {/* 困难设计 */}
              {example.difficultyDesign?.targetDifficulty && (
                <p className="text-xs text-[#94A3B8] line-clamp-2">
                  🧗 核心困难：{example.difficultyDesign.targetDifficulty.slice(0, 60)}...
                </p>
              )}

              {/* 加载按钮 */}
              <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                <span className="text-[10px] text-[#94A3B8]">
                  {example.learningObjectives.length}个目标 · {example.activities.length}个活动
                </span>
                <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />}>
                  加载此范例
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#94A3B8]">
          <GraduationCap size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">该学科暂无范例，请选择其他学科或查看全部范例</p>
        </div>
      )}

      {/* 提示 */}
      <div className="bg-[#DBEAFE] border border-[#2563EB]/20 rounded-xl p-4 text-sm text-[#1D4ED8]">
        <strong>💡 提示：</strong>范例加载后可以在生成器中自由修改。范例包含完整的9板块教学设计数据和困难设计框架，是你自主设计的起点。
      </div>
    </div>
  );
}
