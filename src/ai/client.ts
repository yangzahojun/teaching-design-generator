import type { APIConfig } from '../types/teaching-design';

// ===== 扩展类型：支持 Function Calling =====

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ToolDef {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
}

export interface ChatCompletionResult {
  content: string | null;
  toolCalls?: ToolCall[];
  finishReason: string;
}

// ===== 通用 OpenAI 兼容 API 客户端（支持 function calling） =====

export async function chatCompletion(
  config: APIConfig,
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
    tools?: ToolDef[];
    toolChoice?: 'auto' | 'none';
  }
): Promise<ChatCompletionResult> {
  if (!config.apiKey) throw new Error('未配置API密钥');

  const body: Record<string, unknown> = {
    model: config.model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
  };

  if (options?.jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  if (options?.tools && options.tools.length > 0) {
    body.tools = options.tools;
    body.tool_choice = options?.toolChoice ?? 'auto';
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    if (response.status === 429) throw new Error('请求过于频繁，请稍后再试');
    if (response.status === 401) throw new Error('API密钥无效，请检查设置');
    throw new Error(`API请求失败 (${response.status}): ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  const choice = data.choices[0];
  const msg = choice.message;

  return {
    content: msg.content ?? null,
    toolCalls: msg.tool_calls as ToolCall[] | undefined,
    finishReason: choice.finish_reason ?? 'stop',
  };
}

// ===== 检查API连接 =====

export async function testAPIConnection(config: APIConfig): Promise<{ success: boolean; message: string }> {
  try {
    const result = await chatCompletion(config, [
      { role: 'user', content: '请回复"连接成功"（只回复这4个字）' },
    ], { maxTokens: 10 });
    return {
      success: (result.content ?? '').includes('连接成功'),
      message: (result.content ?? '').includes('连接成功') ? '连接成功！' : '响应格式异常',
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '未知错误';
    return { success: false, message: msg };
  }
}
