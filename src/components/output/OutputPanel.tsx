import { useAppStore } from '../../store/useAppStore';
import { renderTemplate, templateMeta } from '../../templates';
import type { TemplateType } from '../../types/teaching-design';
import { Printer, Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Button from '../shared/Button';
import Select from '../shared/Select';

export default function OutputPanel() {
  const { currentDesign, selectedTemplate, setTemplate } = useAppStore();
  const [copied, setCopied] = useState(false);
  const rendered = renderTemplate(currentDesign, selectedTemplate);

  const handlePrint = () => window.print();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rendered);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleDownload = () => {
    const blob = new Blob([rendered], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDesign.meta.title || '教学设计'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const templateOptions = Object.entries(templateMeta).map(([key, meta]) => ({
    value: key,
    label: meta.name,
  }));

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
        <Button variant="ghost" size="sm" onClick={handleDownload} icon={<Download size={14} />}>
          下载
        </Button>
        <Button variant="primary" size="sm" onClick={handlePrint} icon={<Printer size={14} />}>
          打印
        </Button>
      </div>

      {/* 预览内容 */}
      <div className="flex-1 overflow-y-auto p-6 bg-white markdown-preview">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {rendered || '*请在左侧填写教学设计信息，预览将实时更新...*'}
        </ReactMarkdown>
      </div>
    </div>
  );
}
