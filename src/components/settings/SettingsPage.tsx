import { useState } from 'react';
import { Settings, Key, Globe, Cpu, CheckCircle, XCircle, Shield } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DEFAULT_API_CONFIG } from '../../types/teaching-design';
import type { AIProvider } from '../../types/teaching-design';
import { testAPIConnection } from '../../ai/client';
import { API_KEY_MASKED } from '../../ai/builtin-key';
import Button from '../shared/Button';
import Select from '../shared/Select';
import TextInput from '../shared/TextInput';
import Card from '../shared/Card';

export default function SettingsPage() {
  const { apiConfig, setProvider, setAPIConfig } = useAppStore();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleProviderChange = (provider: string) => {
    setProvider(provider as AIProvider);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testAPIConnection(apiConfig);
      setTestResult(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '未知错误';
      setTestResult({ success: false, message: msg });
    }
    setTesting(false);
  };

  const providerOptions = [
    { value: 'deepseek', label: 'DeepSeek (推荐，性价比最高)' },
    { value: 'openai', label: 'OpenAI (GPT-4o-mini)' },
    { value: 'zhipu', label: '智谱 GLM (GLM-4-Flash)' },
    { value: 'qwen', label: '通义千问 (Qwen-Turbo)' },
    { value: 'custom', label: '自定义端点' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
          <Settings size={24} className="text-[#2563EB]" />
          设置
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          DeepSeek密钥已内置，开箱即用。如需更换，可在此输入你自己的密钥。
        </p>
      </div>

      {/* API配置 */}
      <Card padding="lg">
        <h2 className="text-base font-semibold text-[#1E293B] flex items-center gap-2 mb-4">
          <Cpu size={18} className="text-[#2563EB]" /> AI API 配置
        </h2>

        <div className="space-y-3">
          <Select
            label="AI 服务商"
            value={apiConfig.provider}
            onChange={handleProviderChange}
            options={providerOptions}
          />

          <div>
            <label className="text-xs font-medium text-[#64748B] mb-1 block">API 密钥</label>
            <div className="w-full px-3 py-2.5 text-sm border border-[#10B981]/30 rounded-lg bg-emerald-50/50 text-emerald-700 flex items-center gap-2">
              <Shield size={14} />
              <span className="font-mono tracking-wider">{API_KEY_MASKED}</span>
              <span className="ml-auto text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">已内置</span>
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1">密钥已加密内置于应用中，开箱即可使用AI一键生成</p>
          </div>

          {apiConfig.provider === 'custom' && (
            <>
              <TextInput
                label="Base URL"
                value={apiConfig.baseUrl}
                onChange={(v) => setAPIConfig({ baseUrl: v })}
                placeholder="https://your-api.com/v1"
              />
              <TextInput
                label="模型名称"
                value={apiConfig.model}
                onChange={(v) => setAPIConfig({ model: v })}
                placeholder="your-model-name"
              />
            </>
          )}

          {apiConfig.provider !== 'custom' && (
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <Globe size={12} />
              <span>Base URL: {DEFAULT_API_CONFIG[apiConfig.provider].baseUrl}</span>
              <span className="mx-1">·</span>
              <Cpu size={12} />
              <span>模型: {DEFAULT_API_CONFIG[apiConfig.provider].model}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary" size="sm" loading={testing} onClick={handleTestConnection}>
              测试连接
            </Button>
            {testResult && (
              <span className={`flex items-center gap-1 text-sm ${testResult.success ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {testResult.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {testResult.message}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* AI功能说明 */}
      <Card padding="lg">
        <h2 className="text-base font-semibold text-[#1E293B] flex items-center gap-2 mb-3">
          <Key size={18} className="text-[#2563EB]" /> AI 增强功能说明
        </h2>
        <div className="space-y-2 text-sm text-[#64748B]">
          <p>✅ <strong>无需API密钥</strong>：所有模板生成、范例加载、打印导出功能完全可用。</p>
          <p>🤖 <strong>可选AI增强</strong>：配置API密钥后，可对教学设计的任一板块使用AI辅助增强。</p>
          <p>📋 <strong>按板块增强</strong>：选中课标分析、学情分析、学习目标等任意板块，AI基于你的输入生成建议。</p>
          <p>🔒 <strong>隐私安全</strong>：API密钥仅存储在本地浏览器，直接发送到AI服务商，不经过任何中间服务器。</p>
          <p>💰 <strong>成本低廉</strong>：推荐使用DeepSeek，每次增强约消耗0.001-0.01元。</p>
        </div>
      </Card>

      {/* 关于 */}
      <Card padding="lg">
        <h2 className="text-base font-semibold text-[#1E293B] mb-3">关于小羊的教案设计器</h2>
        <div className="space-y-2 text-sm text-[#64748B]">
          <p>本工具基于以下理论与实践框架：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>2022版义务教育课程标准（新课标）</li>
            <li>BOPPPS教学模型</li>
            <li>UbD逆向设计框架（Wiggins & McTighe）</li>
            <li>维果茨基"最近发展区"理论</li>
            <li>Bjork"理想困难"（Desirable Difficulties）理论</li>
            <li>Kapur"有效失败"（Productive Failure）理论</li>
            <li>自我决定理论 SDT（Ryan & Deci）</li>
            <li>五项设计原则：动机优先、困难前置、过程保留、困难指征、抽象保护</li>
          </ul>
          <p className="mt-3 text-xs text-[#94A3B8]">版本 1.0 · MIT License</p>
        </div>
      </Card>
    </div>
  );
}
