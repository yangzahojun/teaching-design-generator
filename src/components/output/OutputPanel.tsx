import { useAppStore } from '../../store/useAppStore';
import { renderTemplate, templateMeta } from '../../templates';
import type { TemplateType } from '../../types/teaching-design';
import { Printer, Copy, Download, Check, FileText } from 'lucide-react';
import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import Button from '../shared/Button';
import Select from '../shared/Select';

export default function OutputPanel() {
  const { currentDesign, selectedTemplate, setTemplate } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const rendered = renderTemplate(currentDesign, selectedTemplate);

  const handlePrint = () => window.print();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rendered);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleDownloadMD = () => {
    const blob = new Blob([rendered], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDesign.meta.title || '教学设计'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = useCallback(async () => {
    setPdfGenerating(true);
    try {
      // Build a clean HTML document for PDF
      const title = currentDesign.meta.title || '教学设计';
      const htmlContent = document.getElementById('pdf-content')?.innerHTML || '';

      const pdfContainer = document.createElement('div');
      pdfContainer.innerHTML = htmlContent;
      pdfContainer.style.cssText = 'padding:20px;font-family:"PingFang SC","Microsoft YaHei",sans-serif;color:#1e293b;';

      const opt = {
        margin: [15, 20, 15, 20] as [number, number, number, number],
        filename: `${title}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as const },
      };

      await html2pdf().set(opt).from(pdfContainer).save();
    } catch (e) {
      console.error('PDF generation error:', e);
    }
    setPdfGenerating(false);
  }, [currentDesign.meta.title]);

  const templateOptions = Object.entries(templateMeta).map(([key, meta]) => ({
    value: key,
    label: meta.name,
  }));

  // Generate clean HTML for PDF export (hidden, used by html2pdf)
  const pdfHtmlContent = generatePdfHtml(currentDesign, selectedTemplate);

  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="no-print flex items-center gap-2 p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex-wrap">
        <Select
          value={selectedTemplate}
          onChange={(v) => setTemplate(v as TemplateType)}
          options={templateOptions}
          className="min-w-[180px]"
        />
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={handleCopy} icon={copied ? <Check size={14} /> : <Copy size={14} />}>
          {copied ? '已复制' : '复制'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDownloadMD} icon={<Download size={14} />}>
          MD
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleDownloadPDF}
          loading={pdfGenerating}
          icon={pdfGenerating ? undefined : <FileText size={14} />}
        >
          {pdfGenerating ? '生成中...' : '下载PDF'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handlePrint} icon={<Printer size={14} />}>
          打印
        </Button>
      </div>

      {/* 隐藏的PDF内容模板 */}
      <div id="pdf-content" className="hidden" dangerouslySetInnerHTML={{ __html: pdfHtmlContent }} />

      {/* 预览内容 */}
      <div className="flex-1 overflow-y-auto p-6 bg-white markdown-preview">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {rendered || '*请在左侧填写教学设计信息（课题必填），然后点击"一键生成"按钮，预览将在此显示...*'}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// 生成适合PDF的HTML内容
function generatePdfHtml(design: ReturnType<typeof useAppStore.getState>['currentDesign'], _template: TemplateType): string {
  const phaseLabels: Record<string, string> = {
    B: 'B 导入', O: 'O 目标', 'P-pre': '前测', 'P-participatory': '参与式学习', 'P-post': '后测', S: 'S 总结',
  };

  return `
<style>
  * { box-sizing: border-box; }
  body { font-family: "PingFang SC","Microsoft YaHei","SimSun",sans-serif; font-size: 12px; line-height: 1.8; color: #1e293b; }
  .pdf-cover { text-align: center; padding: 40px 0; page-break-after: always; }
  .pdf-cover h1 { font-size: 26px; color: #1D4ED8; margin-bottom: 8px; }
  .pdf-cover .subtitle { font-size: 16px; color: #64748B; }
  .pdf-cover .meta { margin-top: 30px; font-size: 13px; color: #64748B; line-height: 2.2; }
  h2 { font-size: 16px; color: #1D4ED8; border-bottom: 2px solid #DBEAFE; padding-bottom: 4px; margin-top: 24px; page-break-after: avoid; }
  h3 { font-size: 13px; color: #2563EB; margin-top: 16px; page-break-after: avoid; }
  p { margin: 4px 0; text-indent: 2em; }
  ul, ol { padding-left: 2em; }
  li { margin: 2px 0; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 11px; page-break-inside: avoid; }
  th { background: #DBEAFE; color: #1D4ED8; padding: 6px 8px; text-align: left; font-weight: 600; border: 1px solid #E2E8F0; }
  td { padding: 6px 8px; border: 1px solid #E2E8F0; vertical-align: top; }
  .section-intro { font-style: italic; color: #64748B; text-indent: 0; }
  .highlight-box { background: #F8FAFC; border-left: 3px solid #2563EB; padding: 8px 12px; margin: 8px 0; }
  .difficulty-box { background: #FFF7ED; border-left: 3px solid #F59E0B; padding: 8px 12px; margin: 8px 0; }
  .footer-note { text-align: center; font-size: 10px; color: #94A3B8; margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 12px; }
  .page-break { page-break-before: always; }
</style>

<div class="pdf-cover">
  <h1>《${design.meta.title}》</h1>
  <div class="subtitle">教 学 设 计</div>
  <div class="meta">
    学科：${design.meta.subject}　|　年级：${design.meta.grade}　|　教材：${design.meta.textbookVersion}<br/>
    课时：${design.meta.duration}分钟　|　设计者：${design.meta.designer}　|　日期：${design.meta.date}
  </div>
</div>

<h2>一、课标研读</h2>
<h3>内容要求</h3>
<p>${design.standardAnalysis.contentRequirement || '（待填写）'}</p>
<h3>学业要求</h3>
<p>${design.standardAnalysis.academicRequirement || '（待填写）'}</p>
<h3>关联核心素养</h3>
<ul>${design.standardAnalysis.coreCompetencies.map(c => `<li><b>${c.name}</b>（${c.dimension}）：${c.description}</li>`).join('') || '<li>（待关联）</li>'}</ul>

<h2>二、教材分析</h2>
<p><b>大概念：</b>${design.textbookAnalysis.bigConcept || '（待提炼）'}</p>
<p><b>纵向分析：</b>${design.textbookAnalysis.verticalAnalysis || '（待填写）'}</p>
<p><b>核心知识点：</b>${design.textbookAnalysis.keyKnowledge?.join('、') || '（待填写）'}</p>
<p><b>重难点：</b>${design.textbookAnalysis.difficulties?.join('、') || '（待填写）'}</p>

<h2>三、学情分析</h2>
<table>
  <tr><th width="120">已有知识基础</th><td>${design.learnerAnalysis.priorKnowledge || '（待填写）'}</td></tr>
  <tr><th>生活经验</th><td>${design.learnerAnalysis.priorExperience || '（待填写）'}</td></tr>
  <tr><th>认知困难预判</th><td>${design.learnerAnalysis.cognitiveDifficulty || '（待填写）'}</td></tr>
</table>

<h2>四、学习目标</h2>
${design.learningObjectives.length > 0
    ? design.learningObjectives.map((o, i) =>
      `<p><b>目标${i + 1}：</b>${o.content}</p>
       <p style="text-indent:0;font-size:11px;color:#64748B;">类型：${o.category === 'knowledge' ? '知识' : o.category === 'skill' ? '能力' : '情感'}　|　核心素养：${o.competencyLink}　|　评价方式：${o.assessmentMethod}</p>`).join('')
    : '<p>（待填写）</p>'}

<h2>五、评价任务</h2>
<p><b>前测：</b>${design.assessmentTasks.preAssessment?.method || '（待填写）'} — ${design.assessmentTasks.preAssessment?.questions?.join('；') || ''}</p>
<p><b>后测：</b>${design.assessmentTasks.postAssessment?.method || '（待填写）'} — ${design.assessmentTasks.postAssessment?.tasks?.join('；') || ''}</p>
<p><b>评价量规：</b>${design.assessmentTasks.postAssessment?.rubric || '（待填写）'}</p>

<h2>六、教学活动</h2>
<table>
  <tr><th width="70">阶段</th><th>活动名称</th><th width="40">时长</th><th>教师活动</th><th>学生活动</th><th>设计意图</th></tr>
  ${design.activities.map(a =>
    `<tr><td>${phaseLabels[a.phase] || a.phase}</td><td>${a.title}</td><td>${a.duration}′</td><td>${a.teacherAction}</td><td>${a.studentAction}</td><td>${a.designIntent}</td></tr>`
  ).join('') || '<tr><td colspan="6">（待添加活动）</td></tr>'}
</table>

<h2 class="page-break">七、作业设计</h2>
<p><b>必做：</b></p>
<ul>${design.homework.required?.map(h => `<li><b>${h.title}</b>：${h.description}（约${h.estimatedTime}分钟）</li>`).join('') || '<li>（待填写）</li>'}</ul>
<p><b>选做：</b></p>
<ul>${design.homework.optional?.map(h => `<li><b>${h.title}</b>：${h.description}（约${h.estimatedTime}分钟）</li>`).join('') || '<li>（待填写）</li>'}</ul>

<h2>八、板书设计</h2>
<pre style="font-family:inherit;white-space:pre-wrap;background:#F8FAFC;padding:12px;border-radius:6px;">${design.boardDesign.layout || '（待设计）'}</pre>
<p>关键要素：${design.boardDesign.keyElements?.join(' → ') || '（待提炼）'}</p>

<h2>九、教学反思</h2>
<table>
  <tr><th width="100">目标达成度</th><td>${design.reflection.targetAchievement || '（待填写）'}</td></tr>
  <tr><th>改进措施</th><td>${design.reflection.improvementMeasures?.join('；') || '（待填写）'}</td></tr>
</table>

<h2>★ 困难设计框架</h2>
<div class="difficulty-box">
  <p><b>核心困难：</b>${design.difficultyDesign?.targetDifficulty || '（待分析）'}</p>
  <p><b>教育价值：</b>${design.difficultyDesign?.educationalValue || '（待分析）'}</p>
</div>
<p><b>动机策略：</b>${design.difficultyDesign?.motivationStrategy || '（待设计）'}</p>
<p><b>困难前置：</b>${design.difficultyDesign?.difficultyFirst || '（待设计）'}</p>
<p><b>过程保留：</b>${design.difficultyDesign?.processPreservation || '（待设计）'}</p>
<p><b>抽象保护：</b>${design.difficultyDesign?.abstractionProtection || '（待设计）'}</p>

<div class="footer-note">
  本教案由「小羊的教案设计器」生成<br/>
  基于2022版义务教育课程标准 · 融合维果茨基最近发展区、Bjork理想困难理论、Kapur有效失败理论
</div>`;
}
