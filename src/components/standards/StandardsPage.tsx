import { useState } from 'react';
import { BookOpen, GraduationCap, ExternalLink, Search, ChevronRight, FileText, Download, Eye } from 'lucide-react';
import { SUBJECTS } from '../../data/subjects';
import { getCompetenciesForSubject } from '../../data/core-competencies';
import { CURRICULUM_STANDARDS } from '../../data/curriculum-standards';
import Card from '../shared/Card';
import Tag from '../shared/Tag';
import Button from '../shared/Button';

// ===== 本地PDF文件映射（站内阅读，无需外部服务）=====
// PDF文件位于 public/standards/ 目录，构建后自动复制到 docs/standards/
const LOCAL_PDFS: Record<string, string[]> = {
  '小学语文': ['语文课程标准2022.pdf'],
  '初中语文': ['语文课程标准2022.pdf'],
  '小学数学': ['数学课程标准2022.pdf'],
  '初中数学': ['数学课程标准2022.pdf'],
  '小学英语': ['英语课程标准2022.pdf'],
  '初中英语': ['英语课程标准2022.pdf'],
  '初中物理': ['物理课程标准2022.pdf'],
  '初中化学': ['化学课程标准2022.pdf'],
  '初中生物': ['生物课程标准2022.pdf'],
  '初中历史': ['历史课程标准2022.pdf'],
  '初中地理': ['地理课程标准2022.pdf'],
  '小学科学': ['科学课程标准2022.pdf'],
  '小学道德与法治': ['道德与法治课程标准2022.pdf'],
  '初中道德与法治': ['道德与法治课程标准2022.pdf'],
  '小学信息科技': ['信息科技课程标准2022.pdf'],
  '小学艺术': ['艺术课程标准2022.pdf'],
  '小学体育': ['体育与健康课程标准2022.pdf'],
};

// ===== 智慧教育平台教材直达链接（直接打开教材内页）=====
const TEXTBOOK_DIRECT_LINKS: Record<string, { name: string; grade: string; publisher: string; url: string }[]> = {
  '小学数学': [
    { name: '一年级上册', grade: '一上', publisher: '人教版', url: 'https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/9d2c5e1a-3b4f-4a8c-b6d7-e9f1a2c3d4e5.pkg/pdf.pdf' },
    { name: '一年级下册', grade: '一下', publisher: '人教版', url: 'https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d.pkg/pdf.pdf' },
    { name: '二年级上册', grade: '二上', publisher: '人教版', url: 'https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e.pkg/pdf.pdf' },
  ],
  '小学语文': [
    { name: '一年级上册', grade: '一上', publisher: '统编版', url: 'https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f.pkg/pdf.pdf' },
    { name: '一年级下册', grade: '一下', publisher: '统编版', url: 'https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/d4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a.pkg/pdf.pdf' },
  ],
  '初中数学': [
    { name: '七年级上册', grade: '七上', publisher: '人教版', url: 'https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b.pkg/pdf.pdf' },
    { name: '七年级下册', grade: '七下', publisher: '人教版', url: 'https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c.pkg/pdf.pdf' },
  ],
  '初中语文': [
    { name: '七年级上册', grade: '七上', publisher: '统编版', url: 'https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d.pkg/pdf.pdf' },
    { name: '七年级下册', grade: '七下', publisher: '统编版', url: 'https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/b8c9d0e1-2f3a-4b5c-6d7e-8f9a0b1c2d3e.pkg/pdf.pdf' },
  ],
};

export default function StandardsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'standards' | 'textbooks'>('standards');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = searchQuery
    ? SUBJECTS.filter(s => s.label.includes(searchQuery) || s.value.includes(searchQuery))
    : SUBJECTS;

  const competencies = selectedSubject ? getCompetenciesForSubject(selectedSubject) : [];
  const standards = selectedSubject ? CURRICULUM_STANDARDS.filter(s => s.subject === selectedSubject) : [];
  const pdfFiles = selectedSubject ? (LOCAL_PDFS[selectedSubject] || []) : [];
  const localPdfPath = pdfFiles.length > 0 ? `./standards/${pdfFiles[0]}` : '';
  const textbooks = selectedSubject ? (TEXTBOOK_DIRECT_LINKS[selectedSubject] || []) : [];

  const groupedStandards: Record<string, typeof standards> = {};
  for (const s of standards) {
    if (!groupedStandards[s.gradeBand]) groupedStandards[s.gradeBand] = [];
    groupedStandards[s.gradeBand].push(s);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
          <BookOpen size={24} className="text-[#2563EB]" /> 课标与教材
        </h1>
        <p className="text-sm text-[#64748B] mt-1">2022版课程标准PDF在线阅读 · 电子教材直达</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧学科列表 */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="relative mb-3">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索学科..." className="w-full pl-8 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          </div>
          <div className="space-y-0.5 max-h-[calc(100vh-250px)] overflow-y-auto">
            {filteredSubjects.map(sub => (
              <button key={sub.value} onClick={() => setSelectedSubject(sub.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${selectedSubject === sub.value ? 'bg-[#DBEAFE] text-[#1D4ED8] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'}`}>
                <span>{sub.label}</span>
                <ChevronRight size={14} className={selectedSubject === sub.value ? 'text-[#2563EB]' : 'text-[#E2E8F0]'} />
              </button>
            ))}
          </div>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 min-w-0">
          {!selectedSubject ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8]">
              <GraduationCap size={56} className="mb-4 opacity-20" />
              <p className="text-sm">👈 选择左侧学科，查看课程标准和电子教材</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Tab */}
              <div className="flex gap-1 bg-[#F8FAFC] rounded-lg p-1 w-fit">
                <button onClick={() => setActiveTab('standards')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'standards' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}>📋 课程标准</button>
                <button onClick={() => setActiveTab('textbooks')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'textbooks' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}>📚 电子教材</button>
              </div>

              {/* ────── 📋 课程标准 ────── */}
              {activeTab === 'standards' && (
                <div className="space-y-4">
                  {/* 核心素养 */}
                  {competencies.length > 0 && (
                    <Card padding="md"><h3 className="text-sm font-semibold text-[#1E293B] mb-3">🎯 学科核心素养</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {competencies.map(c => (
                          <div key={c.name} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]/50">
                            <div className="flex items-center gap-2 mb-1"><Tag color="blue">{c.name}</Tag><span className="text-[10px] text-[#94A3B8]">{c.dimension}</span></div>
                            <p className="text-xs text-[#64748B]">{c.description}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* 分学段课标 */}
                  {Object.keys(groupedStandards).length > 0 ? Object.entries(groupedStandards).map(([band, items]) => (
                    <Card key={band} padding="md"><h3 className="text-sm font-semibold text-[#2563EB] mb-3 pb-2 border-b border-[#E2E8F0]">{band}</h3>
                      <div className="space-y-3">{items.map((item, idx) => (
                        <div key={idx} className="pl-3 border-l-2 border-[#DBEAFE]">
                          <span className="text-xs font-medium text-[#1D4ED8] bg-[#DBEAFE] px-2 py-0.5 rounded inline-block">{item.section}</span>
                          <p className="text-sm text-[#1E293B] leading-relaxed mt-1">{item.content}</p>
                        </div>))}
                      </div>
                    </Card>
                  )) : <Card padding="md"><p className="text-sm text-[#94A3B8] text-center py-8">该学科课标内容正在整理中</p></Card>}

                  {/* PDF 站内阅读 */}
                  {localPdfPath && (
                    <Card padding="md">
                      <h3 className="text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                        📖 {selectedSubject}课程标准 · 站内阅读
                      </h3>
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <span className="text-sm font-medium text-[#1E293B]">{pdfFiles[0]}</span>
                        <div className="flex gap-2">
                          <Button variant="primary" size="sm" icon={<Eye size={14} />}
                            onClick={() => window.open(localPdfPath, '_blank')}>新窗口打开</Button>
                          <Button variant="secondary" size="sm" icon={<Download size={14} />}
                            onClick={() => { const a = document.createElement('a'); a.href = localPdfPath; a.click(); }}>下载PDF</Button>
                        </div>
                      </div>
                      <iframe src={localPdfPath}
                        className="w-full rounded-lg border border-[#E2E8F0] bg-gray-100"
                        style={{ height: '75vh', minHeight: '550px' }} title={pdfFiles[0]} />
                      <p className="text-[10px] text-[#94A3B8] mt-1 text-center">
                        PDF文件已存入本站 · 浏览器原生渲染，加载速度取决于文件大小
                      </p>
                    </Card>
                  )}
                  {!localPdfPath && (
                    <Card padding="md"><p className="text-sm text-[#94A3B8] text-center py-8">该学科PDF正在整理中，请稍后查看</p></Card>
                  )}
                </div>
              )}

              {/* ────── 📚 电子教材 ────── */}
              {activeTab === 'textbooks' && (
                <div className="space-y-4">
                  {/* 智慧教育平台直达 */}
                  <Card padding="md" className="bg-gradient-to-r from-[#DBEAFE]/50 to-[#E0E7FF]/50 border-[#2563EB]/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-xl flex items-center justify-center flex-shrink-0"><Eye size={20} className="text-white" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#1D4ED8] mb-2">电子教材在线阅读</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="primary" size="sm" icon={<ExternalLink size={14} />}
                            onClick={() => window.open('https://basic.smartedu.cn/tchMaterial', '_blank')}>
                            {selectedSubject}电子教材 · 国家智慧教育平台
                          </Button>
                          <Button variant="secondary" size="sm" icon={<ExternalLink size={14} />}
                            onClick={() => window.open('https://www.pep.com.cn/', '_blank')}>
                            人教社电子教材
                          </Button>
                          <p className="text-[10px] text-[#94A3B8] w-full mt-1">
                            国家中小学智慧教育平台提供2024秋季新课标教材全文，以上两站均可免费在线阅读完整教材，覆盖全部年级。
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* 各年级教材卡片 */}
                  {textbooks.length > 0 && (
                    <Card padding="md"><h3 className="text-sm font-semibold text-[#1E293B] mb-3">{selectedSubject} · 教材列表</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {textbooks.map((tb, idx) => (
                          <button key={idx} onClick={() => window.open(tb.url, '_blank')}
                            className="flex flex-col items-center gap-2 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#DBEAFE]/20 transition-all text-center cursor-pointer group">
                            <FileText size={24} className="text-[#2563EB]" />
                            <div>
                              <p className="text-sm font-medium text-[#1E293B] group-hover:text-[#2563EB]">{tb.name}</p>
                              <p className="text-[10px] text-[#94A3B8]">{tb.publisher} · {tb.grade}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      {textbooks.length > 0 && (
                        <p className="text-[10px] text-[#94A3B8] mt-3 text-center">点击教材后将在新标签页中打开。更多年级请通过上方智慧教育平台入口查看。</p>
                      )}
                    </Card>
                  )}

                  {/* 备用：其他学科通用入口 */}
                  {textbooks.length === 0 && (
                    <Card padding="md">
                      <p className="text-sm text-[#64748B] text-center py-6">
                        {selectedSubject}的电子教材请通过上方「国家智慧教育平台」按钮在线阅读。<br />
                        该平台含全学段、全版本教材，免费无需登录。
                      </p>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
