import { chatCompletion, type ChatMessage } from './client';
import { AGENT_TOOLS, executeTool } from './tools';
import type { APIConfig } from '../types/teaching-design';
import type { ToolCallResult } from './tools';

// ===== Agent 系统提示词（含工具使用说明）=====

export const AGENT_SYSTEM_PROMPT = `你是"新课标智能教案工坊"的AI助手，专门帮助教师一步步完成教学设计。你有能力调用工具来完成实际的操作。

## 你的能力

你可以通过对话了解教师的需求，并在合适的时机调用以下工具：

1. **search_curriculum** — 搜索本地课程数据库，根据课题名称查找对应的年级、单元、教材版本
2. **get_design_state** — 查看当前教学设计表单的填写状态（哪些板块已填、哪些空白）
3. **generate_full_design** — 生成完整的教学设计（9大板块），自动填入表单。需要提前收集齐：学科、年级、课题、教材版本、课时
4. **generate_design_section** — 单独生成某个板块的内容建议（如只改教材分析）

## 你需要收集的信息

- **学科** (subject) — 语文、数学、英语、科学、物理、化学、生物、历史、地理、道德与法治、信息科技、艺术、体育与健康
- **年级** (grade) — 例如：三年级、七年级（初中是七年级~九年级，小学是一年级~六年级）
- **课题名称** (topic) — 例如：三角形的面积、浮力
- **教材版本** (textbook) — 例如：人教版、统编版、北师大版、苏教版
- **课时时长** (duration) — 分钟数，默认40分钟
- **模板偏好** (template) — standard（标准9板块）/ boppps（BOPPPS模型）/ ubd（UbD逆向设计），默认 standard

## 行为规则

- **像朋友一样自然聊天**，每次只问一个问题，不要一次列出所有选项。
- **主动提取信息**——用户说"我教五年级数学三角形的面积"→ 你同时提取了年级、学科、课题，只需追问教材版本。
- **善用工具**——用户提到一个课题名称，你不确定属于哪个年级时，用 search_curriculum 查询。
- **生成前先确认**——收集齐信息后，先调用 get_design_state 确认，再调用 generate_full_design。
- **生成完成后简要总结**——告诉用户生成了哪些内容，建议查看哪些关键板块。
- 用"你"称呼用户，语气温暖专业，像一位有经验的教学设计同事。

## 对话开场

用户首次打开对话时，主动发送一条友好的欢迎消息，简单介绍自己，然后自然地提出第一个问题。`;

// ===== 类型定义 =====

export interface AgentExtractedInfo {
  subject: string | null;
  grade: string | null;
  topic: string | null;
  textbook: string | null;
  duration: number;
  template: 'standard' | 'boppps' | 'ubd';
}

export interface AgentState {
  messages: ChatMessage[];
  extractedInfo: AgentExtractedInfo;
}

export interface AgentLoopCallbacks {
  onToolCall?: (toolName: string, args: Record<string, unknown>) => void;
  onToolResult?: (toolName: string, result: ToolCallResult) => void;
  onThinking?: () => void;
}

// ===== 工厂函数 =====

const WELCOME_MESSAGE = '你好！我是新课标智能教案工坊的AI助手 👋\n\n我可以帮你完成完整的教学设计——你只需要用自然语言告诉我你的想法。我还能搜索课程数据库、查看当前表单状态，并在信息齐全后自动生成教案。\n\n那么，请问你想设计哪个学科的教案呢？';

export function createInitialAgentState(): AgentState {
  return {
    messages: [
      { role: 'assistant', content: WELCOME_MESSAGE },
    ],
    extractedInfo: {
      subject: null,
      grade: null,
      topic: null,
      textbook: null,
      duration: 40,
      template: 'standard',
    },
  };
}

// ===== 辅助函数 =====

/**
 * 从工具调用参数中提取已收集的信息
 */
export function updateExtractedInfo(info: AgentExtractedInfo, toolName: string, args: Record<string, unknown>): AgentExtractedInfo {
  const next = { ...info };
  switch (toolName) {
    case 'generate_full_design':
      if (args.subject) next.subject = String(args.subject);
      if (args.grade) next.grade = String(args.grade);
      if (args.topic) next.topic = String(args.topic);
      if (args.textbook) next.textbook = String(args.textbook);
      if (args.duration) next.duration = Number(args.duration);
      if (args.template) next.template = String(args.template) as AgentExtractedInfo['template'];
      break;
    case 'get_design_state':
      // get_design_state 返回的是文本，不提取字段
      break;
    case 'search_curriculum':
      // search_curriculum 返回搜索结果，不直接提取
      break;
  }
  return next;
}

/**
 * 检查是否已收集齐所有必填信息
 */
export function isInfoComplete(info: AgentExtractedInfo): boolean {
  return !!(info.subject && info.grade && info.topic && info.textbook && info.duration > 0);
}

// 最大 Agent 循环次数（防止无限循环）
const MAX_LOOP_ITERATIONS = 8;

// ===== 核心：Agent 循环 =====

export interface AgentLoopResult {
  assistantMessage: string;
  extractedInfo: AgentExtractedInfo;
  toolCallsMade: Array<{ name: string; args: Record<string, unknown>; result: ToolCallResult }>;
}

export async function runAgentLoop(
  config: APIConfig,
  state: AgentState,
  userMessage: string,
  callbacks?: AgentLoopCallbacks
): Promise<AgentLoopResult> {
  // 1. 追加用户消息
  state.messages.push({ role: 'user', content: userMessage });

  const toolCallsMade: Array<{ name: string; args: Record<string, unknown>; result: ToolCallResult }> = [];

  // Agent 循环
  for (let i = 0; i < MAX_LOOP_ITERATIONS; i++) {
    callbacks?.onThinking?.();

    // 构建 API 消息列表
    const apiMessages: ChatMessage[] = [
      { role: 'system', content: AGENT_SYSTEM_PROMPT },
      ...state.messages,
    ];

    // 调用 API（带工具定义）
    const response = await chatCompletion(config, apiMessages, {
      temperature: 0.7,
      maxTokens: 1500,
      tools: AGENT_TOOLS,
    });

    // 情况 1: 模型想调用工具
    if (response.toolCalls && response.toolCalls.length > 0) {
      // 添加助手的 tool_calls 消息
      state.messages.push({
        role: 'assistant',
        content: null,
        tool_calls: response.toolCalls,
      });

      // 逐个执行工具
      for (const tc of response.toolCalls) {
        const toolName = tc.function.name;
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(tc.function.arguments);
        } catch { /* args 解析失败用空对象 */ }

        callbacks?.onToolCall?.(toolName, args);

        const result = await executeTool(toolName, args, config);
        toolCallsMade.push({ name: toolName, args, result });

        callbacks?.onToolResult?.(toolName, result);

        // 提取信息更新进度
        state.extractedInfo = updateExtractedInfo(state.extractedInfo, toolName, args);

        // 添加工具结果消息
        state.messages.push({
          role: 'tool',
          content: result.content,
          tool_call_id: tc.id,
          name: toolName,
        });
      }

      // 继续循环，让模型处理工具结果
      continue;
    }

    // 情况 2: 模型返回文本回复（最终响应）
    const text = response.content ?? '';

    if (text) {
      state.messages.push({ role: 'assistant', content: text });
    }

    return {
      assistantMessage: text,
      extractedInfo: state.extractedInfo,
      toolCallsMade,
    };
  }

  // 超出最大循环次数
  const fallbackMsg = '抱歉，处理流程似乎陷入循环。请尝试用更简洁的方式描述你的需求，或直接在左侧表单中填写信息后点击"一键生成"。';
  state.messages.push({ role: 'assistant', content: fallbackMsg });
  return {
    assistantMessage: fallbackMsg,
    extractedInfo: state.extractedInfo,
    toolCallsMade,
  };
}
