import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, CheckCircle2, Circle, Search, ClipboardList, Sparkles, FileText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import {
  createInitialAgentState,
  runAgentLoop,
  isInfoComplete,
  type AgentState,
  type AgentExtractedInfo,
} from '../../ai/agent';
import type { ToolCallResult } from '../../ai/tools';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===== UI 消息类型 =====
type UIMessage =
  | { type: 'user'; content: string }
  | { type: 'assistant'; content: string }
  | { type: 'tool-start'; toolName: string; label: string }
  | { type: 'tool-end'; toolName: string; label: string; result: ToolCallResult };

// ===== 工具中文标签 =====
const TOOL_LABELS: Record<string, { icon: React.ReactNode; label: string }> = {
  search_curriculum: { icon: <Search size={14} />, label: '搜索课程数据库' },
  get_design_state: { icon: <ClipboardList size={14} />, label: '查看表单状态' },
  generate_full_design: { icon: <Sparkles size={14} />, label: '生成完整教学设计' },
  generate_design_section: { icon: <FileText size={14} />, label: '生成板块内容' },
};

// ===== 进度字段配置 =====
const PROGRESS_FIELDS: { key: keyof AgentExtractedInfo; label: string }[] = [
  { key: 'subject', label: '学科' },
  { key: 'grade', label: '年级' },
  { key: 'topic', label: '课题' },
  { key: 'textbook', label: '教材' },
  { key: 'duration', label: '课时' },
];

// ===== 消息气泡 =====
function ChatBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-[#2563EB] text-white rounded-l-xl rounded-tr-xl'
            : 'bg-[#F1F5F9] text-[#1E293B] rounded-r-xl rounded-tl-xl border border-[#E2E8F0]'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

// ===== 工具调用状态气泡 =====
function ToolCallBubble({ label, icon, status, result }: {
  label: string;
  icon: React.ReactNode;
  status: 'running' | 'done' | 'error';
  result?: ToolCallResult;
}) {
  return (
    <div className="flex justify-start">
      <div className={`max-w-[85%] px-3 py-2 text-xs rounded-r-xl rounded-tl-xl border flex items-center gap-2 ${
        status === 'running'
          ? 'bg-[#EFF6FF] border-[#93C5FD] text-[#1D4ED8]'
          : status === 'error'
            ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626]'
            : 'bg-[#F0FDF4] border-[#86EFAC] text-[#16A34A]'
      }`}>
        {status === 'running' ? (
          <Loader2 size={14} className="animate-spin flex-shrink-0" />
        ) : status === 'error' ? (
          <X size={14} className="flex-shrink-0" />
        ) : (
          <CheckCircle2 size={14} className="flex-shrink-0" />
        )}
        <span className="flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </span>
        {status === 'done' && result && (
          <span className="text-[10px] text-[#64748B] truncate max-w-[200px]">
            {result.content.slice(0, 80)}...
          </span>
        )}
      </div>
    </div>
  );
}

// ===== 打字指示器 =====
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] rounded-r-xl rounded-tl-xl px-4 py-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// ===== 主组件 =====
export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const { apiConfig } = useAppStore();
  const [agentState, setAgentState] = useState<AgentState>(createInitialAgentState);
  const [uiMessages, setUiMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化 UI 消息（欢迎消息）
  useEffect(() => {
    if (isOpen) {
      setAgentState(createInitialAgentState());
      setUiMessages([]);
      setError(null);
      setInputValue('');
    }
  }, [isOpen]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [uiMessages, loading]);

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const { extractedInfo } = agentState;

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || loading) return;
    setInputValue('');
    setLoading(true);
    setError(null);

    // 添加用户消息到 UI
    setUiMessages(prev => [...prev, { type: 'user', content: text }]);

    // 当前正在执行的工具标签（用于后续替换）
    let currentToolLabel = '';

    try {
      const result = await runAgentLoop(apiConfig, agentState, text, {
        onToolCall: (toolName, args) => {
          const info = TOOL_LABELS[toolName] ?? { icon: <></>, label: toolName };
          currentToolLabel = info.label;
          setUiMessages(prev => [...prev, { type: 'tool-start', toolName, label: info.label }]);
        },
        onToolResult: (toolName, result) => {
          const info = TOOL_LABELS[toolName] ?? { icon: <></>, label: toolName };
          setUiMessages(prev => [...prev, { type: 'tool-end', toolName, label: info.label, result }]);
        },
        onThinking: () => {
          // 切换 typing 状态
        },
      });

      // 更新 extractedInfo（从 agent state 同步）
      setAgentState(prev => ({
        ...prev,
        extractedInfo: result.extractedInfo,
        messages: prev.messages, // messages 在 runAgentLoop 中已 mutate
      }));

      // 添加助手回复到 UI
      if (result.assistantMessage) {
        setUiMessages(prev => [...prev, { type: 'assistant', content: result.assistantMessage }]);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '请求失败，请重试';
      setError(msg);
      setUiMessages(prev => [...prev, {
        type: 'assistant',
        content: `抱歉，请求出错了：${msg}\n\n请检查网络连接和 API 配置后重试。`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/30 transition-opacity" onClick={onClose} />

      {/* 抽屉面板 */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-lg flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1E293B]">AI助手</h3>
              <p className="text-[10px] text-[#94A3B8]">
                {loading ? '思考中...' : '可调用工具 · 自动生成'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#E2E8F0] transition-colors cursor-pointer text-[#64748B]"
          >
            <X size={18} />
          </button>
        </div>

        {/* 进度条 */}
        <div className="px-4 py-2.5 border-b border-[#E2E8F0]/50 bg-white flex-shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {PROGRESS_FIELDS.map(({ key, label }) => {
              const done = key === 'duration'
                ? (extractedInfo.duration && extractedInfo.duration > 0)
                : !!extractedInfo[key as keyof AgentExtractedInfo];
              return (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded ${
                    done
                      ? 'text-[#059669] bg-[#ECFDF5]'
                      : 'text-[#94A3B8] bg-[#F8FAFC]'
                  }`}
                >
                  {done ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* 欢迎消息 */}
          <ChatBubble role="assistant" content={createInitialAgentState().messages[0].content} />

          {/* 对话消息 */}
          {uiMessages.map((msg, i) => {
            if (msg.type === 'user') {
              return <ChatBubble key={i} role="user" content={msg.content} />;
            }
            if (msg.type === 'assistant') {
              return <ChatBubble key={i} role="assistant" content={msg.content} />;
            }
            if (msg.type === 'tool-start') {
              const info = TOOL_LABELS[msg.toolName] ?? { icon: <></>, label: msg.toolName };
              return (
                <ToolCallBubble key={i} label={msg.label} icon={info.icon} status="running" />
              );
            }
            if (msg.type === 'tool-end') {
              const info = TOOL_LABELS[msg.toolName] ?? { icon: <></>, label: msg.toolName };
              const isError = !msg.result.success;
              return (
                <ToolCallBubble
                  key={i}
                  label={msg.label}
                  icon={info.icon}
                  status={isError ? 'error' : 'done'}
                  result={msg.result}
                />
              );
            }
            return null;
          })}

          {loading && <TypingIndicator />}

          {error && (
            <div className="text-center text-xs text-[#EF4444] bg-red-50 px-2 py-1 rounded-lg">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区 */}
        <div className="border-t border-[#E2E8F0] p-3 bg-white flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={loading ? 'AI 正在处理...' : '输入你的需求...'}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-150 disabled:bg-[#F8FAFC] disabled:text-[#94A3B8]"
            />
            <button
              onClick={handleSend}
              disabled={loading || !inputValue.trim()}
              className="p-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] transition-colors cursor-pointer flex-shrink-0"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-1.5 text-center">
            按 Enter 发送 · Agent 会自动调用工具完成你的需求
          </p>
        </div>
      </div>

      {/* 滑入动画样式 */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
