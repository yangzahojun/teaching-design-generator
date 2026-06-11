import { useState } from 'react';
import { BookOpen, GraduationCap, ExternalLink, Search, ChevronRight, FileText } from 'lucide-react';
import { searchStandards } from '../../data/curriculum-standards';
import { SUBJECTS } from '../../data/subjects';
import { getCompetenciesForSubject } from '../../data/core-competencies';
import Card from '../shared/Card';
import Tag from '../shared/Tag';

// 各学科教材版本映射
const TEXTBOOK_PUBLISHERS: Record<string, { name: string; grades: string; url: string }[]> = {
  '小学数学': [
    { name: '人教版', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
    { name: '北师大版', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
    { name: '苏教版', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '小学语文': [
    { name: '统编版', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '小学英语': [
    { name: 'PEP(人教)', grades: '3-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
    { name: '外研版', grades: '3-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '小学科学': [
    { name: '教科版', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
    { name: '苏教版', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '小学道德与法治': [
    { name: '统编版', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中语文': [
    { name: '统编版', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中数学': [
    { name: '人教版', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
    { name: '北师大版', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中英语': [
    { name: '人教版', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
    { name: '外研版', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中物理': [
    { name: '人教版', grades: '8-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
    { name: '教科版', grades: '8-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中化学': [
    { name: '人教版', grades: '9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中生物': [
    { name: '人教版', grades: '7-8年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中历史': [
    { name: '统编版', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中地理': [
    { name: '人教版', grades: '7-8年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中道德与法治': [
    { name: '统编版', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
};

export default function StandardsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'standards' | 'textbooks'>('standards');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = searchQuery
    ? SUBJECTS.filter(s => s.label.includes(searchQuery) || s.value.includes(searchQuery))
    : SUBJECTS;

  const standards = selectedSubject ? searchStandards(selectedSubject) : [];
  const competencies = selectedSubject ? getCompetenciesForSubject(selectedSubject) : [];
  const publishers = selectedSubject ? TEXTBOOK_PUBLISHERS[selectedSubject] || [] : [];

  // 按学段分组课标
  const groupedStandards: Record<string, typeof standards> = {};
  for (const s of standards) {
    if (!groupedStandards[s.gradeBand]) groupedStandards[s.gradeBand] = [];
    groupedStandards[s.gradeBand].push(s);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
          <BookOpen size={24} className="text-[#2563EB]" />
          课标与教材
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          2022版义务教育课程标准 + 各版本电子教材索引
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ===== 左侧：学科列表 ===== */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学科..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          </div>

          <div className="space-y-0.5 max-h-[calc(100vh-250px)] overflow-y-auto">
            {filteredSubjects.map(sub => (
              <button
                key={sub.value}
                onClick={() => setSelectedSubject(sub.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between
                  ${selectedSubject === sub.value
                    ? 'bg-[#DBEAFE] text-[#1D4ED8] font-medium'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                  }`}
              >
                <span>{sub.label}</span>
                <ChevronRight size={14} className={selectedSubject === sub.value ? 'text-[#2563EB]' : 'text-[#E2E8F0]'} />
              </button>
            ))}
          </div>
        </div>

        {/* ===== 右侧：内容区 ===== */}
        <div className="flex-1 min-w-0">
          {!selectedSubject ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8]">
              <GraduationCap size={56} className="mb-4 opacity-20" />
              <p className="text-sm">👈 选择左侧学科，查看对应的课程标准和电子教材</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tab切换 */}
              <div className="flex gap-1 bg-[#F8FAFC] rounded-lg p-1 w-fit">
                <button
                  onClick={() => setActiveTab('standards')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'standards' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  📋 课程标准
                </button>
                <button
                  onClick={() => setActiveTab('textbooks')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'textbooks' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  📚 电子教材
                </button>
              </div>

              {/* 课程标准 Tab */}
              {activeTab === 'standards' && (
                <div className="space-y-6">
                  {/* 核心素养 */}
                  {competencies.length > 0 && (
                    <Card padding="md">
                      <h3 className="text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-1.5">
                        🎯 学科核心素养
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {competencies.map((c) => (
                          <div key={c.name} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]/50">
                            <div className="flex items-center gap-2 mb-1">
                              <Tag color="blue">{c.name}</Tag>
                              <span className="text-[10px] text-[#94A3B8]">{c.dimension}</span>
                            </div>
                            <p className="text-xs text-[#64748B]">{c.description}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* 分学段课标内容 */}
                  {Object.keys(groupedStandards).length > 0 ? (
                    Object.entries(groupedStandards).map(([band, items]) => (
                      <Card key={band} padding="md">
                        <h3 className="text-sm font-semibold text-[#2563EB] mb-3 pb-2 border-b border-[#E2E8F0]">
                          {band}
                        </h3>
                        <div className="space-y-3">
                          {items.map((item, idx) => (
                            <div key={idx} className="pl-3 border-l-2 border-[#DBEAFE]">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-[#1D4ED8] bg-[#DBEAFE] px-2 py-0.5 rounded">
                                  {item.section}
                                </span>
                              </div>
                              <p className="text-sm text-[#1E293B] leading-relaxed">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card padding="md">
                      <p className="text-sm text-[#94A3B8] text-center py-8">
                        该学科的课程标准内容正在整理中，敬请期待。
                      </p>
                    </Card>
                  )}
                </div>
              )}

              {/* 电子教材 Tab */}
              {activeTab === 'textbooks' && (
                <div className="space-y-4">
                  {/* 官方平台入口 */}
                  <Card padding="md" className="bg-gradient-to-r from-[#DBEAFE]/50 to-[#E0E7FF]/50 border-[#2563EB]/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-xl flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#1D4ED8]">国家中小学智慧教育平台</h3>
                        <p className="text-xs text-[#64748B] mt-1">
                          教育部官方平台，包含全部学科2024年秋季启用的新课标教材电子版，支持在线阅读。
                          无需登录即可浏览。
                        </p>
                        <a
                          href="https://basic.smartedu.cn/tchMaterial"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-[#2563EB] hover:underline font-medium"
                        >
                          前往平台 <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </Card>

                  {/* 各版本教材 */}
                  {publishers.length > 0 ? (
                    <Card padding="md">
                      <h3 className="text-sm font-semibold text-[#1E293B] mb-3">
                        {selectedSubject} · 教材版本
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {publishers.map((pub) => (
                          <a
                            key={pub.name}
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#DBEAFE]/30 transition-all group"
                          >
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-[#E2E8F0] flex-shrink-0">
                              <FileText size={16} className="text-[#2563EB]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[#1E293B] group-hover:text-[#2563EB]">
                                  {pub.name}
                                </span>
                                <Tag color="slate">{pub.grades}</Tag>
                              </div>
                              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                                点击跳转至智慧教育平台在线阅读
                              </p>
                            </div>
                            <ExternalLink size={13} className="text-[#94A3B8] group-hover:text-[#2563EB] flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </Card>
                  ) : (
                    <Card padding="md">
                      <p className="text-sm text-[#94A3B8] text-center py-8">
                        该学科的教材版本信息正在整理中。
                      </p>
                    </Card>
                  )}

                  {/* 人教社链接 */}
                  <Card padding="md">
                    <h3 className="text-sm font-semibold text-[#1E293B] mb-3">其他官方资源</h3>
                    <div className="space-y-2">
                      <a
                        href="https://www.pep.com.cn/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#2563EB] transition-colors"
                      >
                        <ExternalLink size={13} />
                        人民教育出版社官网 — 教材电子版在线阅读
                      </a>
                      <a
                        href="https://basic.smartedu.cn/teachingMaterial/digitalMaterial"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#2563EB] transition-colors"
                      >
                        <ExternalLink size={13} />
                        国家智慧教育平台 · 数字教材专区
                      </a>
                      <a
                        href="https://www.pep.com.cn/xw/zt/rjwy/yjkb2022/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#2563EB] transition-colors"
                      >
                        <ExternalLink size={13} />
                        2022版义务教育课程标准（全文）
                      </a>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
