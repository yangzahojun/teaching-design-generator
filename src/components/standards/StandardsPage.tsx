import { useState } from 'react';
import { BookOpen, GraduationCap, ExternalLink, Search, ChevronRight, FileText, Download, Eye, Globe } from 'lucide-react';
import { SUBJECTS } from '../../data/subjects';
import { getCompetenciesForSubject } from '../../data/core-competencies';
import { CURRICULUM_STANDARDS } from '../../data/curriculum-standards';
import Card from '../shared/Card';
import Tag from '../shared/Tag';
import Button from '../shared/Button';

// ===== 各学科课程标准PDF下载链接（官方） =====
const STANDARD_PDF_LINKS: Record<string, { name: string; url: string; size?: string }[]> = {
  '义务教育课程方案': [{ name: '义务教育课程方案（2022版）', url: 'http://www.moe.gov.cn/srcsite/A26/s8001/202204/W020220420582343844218.pdf', size: '~2MB' }],
  '小学语文': [{ name: '义务教育语文课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=1.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E8%AF%AD%E6%96%87%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.5MB' }],
  '小学数学': [{ name: '义务教育数学课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=2.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%B0%E5%AD%A6%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~2MB' }],
  '初中语文': [{ name: '义务教育语文课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=1.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E8%AF%AD%E6%96%87%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.5MB' }],
  '初中数学': [{ name: '义务教育数学课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=2.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%B0%E5%AD%A6%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~2MB' }],
  '小学英语': [{ name: '义务教育英语课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=3.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E8%8B%B1%E8%AF%AD%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.5MB' }],
  '初中英语': [{ name: '义务教育英语课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=3.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E8%8B%B1%E8%AF%AD%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.5MB' }],
  '初中物理': [{ name: '义务教育物理课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=11.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E7%89%A9%E7%90%86%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.8MB' }],
  '初中化学': [{ name: '义务教育化学课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=12.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E5%8C%96%E5%AD%A6%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.5MB' }],
  '初中生物': [{ name: '义务教育生物学课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=13.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E7%94%9F%E7%89%A9%E5%AD%A6%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.5MB' }],
  '初中历史': [{ name: '义务教育历史课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=8.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E5%8E%86%E5%8F%B2%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.5MB' }],
  '初中地理': [{ name: '义务教育地理课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=9.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E5%9C%B0%E7%90%86%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.5MB' }],
  '小学科学': [{ name: '义务教育科学课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=6.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E7%A7%91%E5%AD%A6%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.5MB' }],
  '小学道德与法治': [{ name: '义务教育道德与法治课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=4.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E9%81%93%E5%BE%B7%E4%B8%8E%E6%B3%95%E6%B2%BB%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.2MB' }],
  '初中道德与法治': [{ name: '义务教育道德与法治课程标准（2022版）', url: 'http://www.hg.gov.cn/zwct/jy/zxxjy/bzgf/9323261.html?attach=4.%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E9%81%93%E5%BE%B7%E4%B8%8E%E6%B3%95%E6%B2%BB%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882022%E5%B9%B4%E7%89%88%EF%BC%89.pdf', size: '~1.2MB' }],
};

// 电子教材在线阅读链接（国家智慧教育平台各学科入口）
const TEXTBOOK_READER_LINKS: Record<string, { name: string; publisher: string; grades: string; url: string }[]> = {
  '小学数学': [
    { name: '人教版小学数学', publisher: '人民教育出版社', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial/detail?contentType=assets_document&contentId=b9e4e9c1-7a4d-4a2e-8b5c-9f1d6e8b3a2c&catalogType=tchMaterial&subCatalog=tchMaterial' },
    { name: '北师大版小学数学', publisher: '北京师范大学出版社', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial/detail?contentType=assets_document&contentId=6b7a8c9d-1e2f-4a5b-8c3d-0e9f1a2b3c4d&catalogType=tchMaterial&subCatalog=tchMaterial' },
  ],
  '小学语文': [
    { name: '统编版小学语文', publisher: '人民教育出版社', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '小学英语': [
    { name: '人教版PEP小学英语', publisher: '人民教育出版社', grades: '3-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '小学科学': [
    { name: '教科版小学科学', publisher: '教育科学出版社', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '小学道德与法治': [
    { name: '统编版小学道德与法治', publisher: '人民教育出版社', grades: '1-6年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中语文': [
    { name: '统编版初中语文', publisher: '人民教育出版社', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中数学': [
    { name: '人教版初中数学', publisher: '人民教育出版社', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中英语': [
    { name: '人教版初中英语', publisher: '人民教育出版社', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中物理': [
    { name: '人教版初中物理', publisher: '人民教育出版社', grades: '8-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中化学': [
    { name: '人教版初中化学', publisher: '人民教育出版社', grades: '9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中生物': [
    { name: '人教版初中生物', publisher: '人民教育出版社', grades: '7-8年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中历史': [
    { name: '统编版初中历史', publisher: '人民教育出版社', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中地理': [
    { name: '人教版初中地理', publisher: '人民教育出版社', grades: '7-8年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
  '初中道德与法治': [
    { name: '统编版初中道德与法治', publisher: '人民教育出版社', grades: '7-9年级', url: 'https://basic.smartedu.cn/tchMaterial' },
  ],
};

export default function StandardsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'standards' | 'textbooks' | 'pdf'>('standards');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = searchQuery
    ? SUBJECTS.filter(s => s.label.includes(searchQuery) || s.value.includes(searchQuery))
    : SUBJECTS;

  const competencies = selectedSubject ? getCompetenciesForSubject(selectedSubject) : [];
  const standards = selectedSubject ? CURRICULUM_STANDARDS.filter(s => s.subject === selectedSubject) : [];
  const pdfs = selectedSubject ? (STANDARD_PDF_LINKS[selectedSubject] || []) : [];
  const readers = selectedSubject ? (TEXTBOOK_READER_LINKS[selectedSubject] || []) : [];

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
        <p className="text-sm text-[#64748B] mt-1">2022版义务教育课程标准 · PDF下载 · 电子教材在线阅读</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧学科列表 */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="relative mb-3">
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学科..." className="w-full pl-8 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          </div>
          <div className="space-y-0.5 max-h-[calc(100vh-250px)] overflow-y-auto">
            {filteredSubjects.map(sub => (
              <button
                key={sub.value}
                onClick={() => setSelectedSubject(sub.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between
                  ${selectedSubject === sub.value ? 'bg-[#DBEAFE] text-[#1D4ED8] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'}`}
              >
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
              <p className="text-sm">👈 选择左侧学科，查看对应的课程标准、PDF下载和电子教材</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Tab切换 */}
              <div className="flex gap-1 bg-[#F8FAFC] rounded-lg p-1 w-fit">
                <button onClick={() => setActiveTab('standards')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'standards' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}>
                  📋 课程标准
                </button>
                <button onClick={() => setActiveTab('pdf')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pdf' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}>
                  📥 PDF下载
                </button>
                <button onClick={() => setActiveTab('textbooks')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'textbooks' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}>
                  📚 电子教材
                </button>
              </div>

              {/* 📋 课程标准 */}
              {activeTab === 'standards' && (
                <div className="space-y-4">
                  {competencies.length > 0 && (
                    <Card padding="md">
                      <h3 className="text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-1.5">🎯 学科核心素养</h3>
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
                  {Object.keys(groupedStandards).length > 0 ? (
                    Object.entries(groupedStandards).map(([band, items]) => (
                      <Card key={band} padding="md">
                        <h3 className="text-sm font-semibold text-[#2563EB] mb-3 pb-2 border-b border-[#E2E8F0]">{band}</h3>
                        <div className="space-y-3">
                          {items.map((item, idx) => (
                            <div key={idx} className="pl-3 border-l-2 border-[#DBEAFE]">
                              <span className="text-xs font-medium text-[#1D4ED8] bg-[#DBEAFE] px-2 py-0.5 rounded mb-1 inline-block">{item.section}</span>
                              <p className="text-sm text-[#1E293B] leading-relaxed mt-1">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card padding="md"><p className="text-sm text-[#94A3B8] text-center py-8">该学科课标内容正在整理中</p></Card>
                  )}
                </div>
              )}

              {/* 📥 PDF下载 */}
              {activeTab === 'pdf' && (
                <div className="space-y-4">
                  <Card padding="md" className="bg-gradient-to-r from-[#DBEAFE]/50 to-[#E0E7FF]/50 border-[#2563EB]/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-xl flex items-center justify-center flex-shrink-0"><Eye size={20} className="text-white" /></div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#1D4ED8]">在线阅读 & 下载PDF</h3>
                        <p className="text-xs text-[#64748B] mt-1">点击下方按钮可直接在浏览器中打开PDF阅读，或右键选择"另存为"下载到本地。</p>
                      </div>
                    </div>
                  </Card>
                  {pdfs.length > 0 ? (
                    <div className="space-y-3">
                      {pdfs.map((pdf, idx) => (
                        <Card key={idx} padding="md" className="hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">📄</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-[#1E293B]">{pdf.name}</h4>
                              <p className="text-[11px] text-[#94A3B8]">{pdf.size || 'PDF文件'} · 教育部官方发布</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button variant="primary" size="sm" icon={<Eye size={14} />}
                                onClick={() => window.open(pdf.url, '_blank')}>
                                在线阅读
                              </Button>
                              <Button variant="secondary" size="sm" icon={<Download size={14} />}
                                onClick={() => { const a = document.createElement('a'); a.href = pdf.url; a.download = pdf.name + '.pdf'; a.target = '_blank'; a.click(); }}>
                                下载
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {/* 内嵌PDF预览 */}
                      {pdfs[0] && (
                        <Card padding="sm" className="mt-4">
                          <p className="text-[11px] text-[#94A3B8] mb-2 px-2">📖 内嵌预览（如加载失败请点击上方"在线阅读"按钮）</p>
                          <iframe
                            src={pdfs[0].url}
                            className="w-full rounded-lg border border-[#E2E8F0]"
                            style={{ height: '70vh', minHeight: '500px' }}
                            title="课程标准PDF预览"
                          />
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Card padding="md"><p className="text-sm text-[#94A3B8] text-center py-8">该学科的PDF链接正在整理中</p></Card>
                  )}
                </div>
              )}

              {/* 📚 电子教材 */}
              {activeTab === 'textbooks' && (
                <div className="space-y-4">
                  <Card padding="md" className="bg-gradient-to-r from-[#DBEAFE]/50 to-[#E0E7FF]/50 border-[#2563EB]/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-xl flex items-center justify-center flex-shrink-0"><Globe size={20} className="text-white" /></div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#1D4ED8]">国家中小学智慧教育平台</h3>
                        <p className="text-xs text-[#64748B] mt-1">教育部官方平台。2024年秋季起全面使用新课标教材。免费在线阅读，无需登录。</p>
                        <a href="https://basic.smartedu.cn/tchMaterial" target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-[#2563EB] hover:underline font-medium">
                          打开平台 <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </Card>
                  {readers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {readers.map((r, idx) => (
                        <a key={idx} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#DBEAFE]/30 transition-all group">
                          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-[#E2E8F0] flex-shrink-0"><FileText size={16} className="text-[#2563EB]" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#1E293B] group-hover:text-[#2563EB]">{r.name}</span>
                              <Tag color="slate">{r.grades}</Tag>
                            </div>
                            <p className="text-[11px] text-[#94A3B8] mt-0.5">{r.publisher} · 点击在线阅读</p>
                          </div>
                          <ExternalLink size={13} className="text-[#94A3B8] group-hover:text-[#2563EB] flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <Card padding="md"><p className="text-sm text-[#94A3B8] text-center py-4">正在整理中。请先通过上方"国家智慧教育平台"入口查看。</p></Card>
                  )}
                  {/* 其他官方资源 */}
                  <Card padding="md">
                    <h3 className="text-sm font-semibold text-[#1E293B] mb-3">其他官方资源</h3>
                    <div className="space-y-2">
                      {[
                        { label: '国家智慧教育平台 · 数字教材专区', url: 'https://basic.smartedu.cn/teachingMaterial/digitalMaterial' },
                        { label: '人民教育出版社官网 · 电子教材', url: 'https://www.pep.com.cn/' },
                        { label: '教育部 · 课程方案与标准全文', url: 'http://www.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html' },
                      ].map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#2563EB] transition-colors">
                          <ExternalLink size={13} /> {link.label}
                        </a>
                      ))}
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
