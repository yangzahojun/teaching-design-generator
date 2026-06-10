import type { APIConfig } from '../types/teaching-design';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 通用OpenAI兼容API客户端
export async function chatCompletion(
  config: APIConfig,
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }
): Promise<string> {
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
  return data.choices[0].message.content;
}

// 检查API连接
export async function testAPIConnection(config: APIConfig): Promise<{ success: boolean; message: string }> {
  try {
    const result = await chatCompletion(config, [
      { role: 'user', content: '请回复"连接成功"（只回复这4个字）' },
    ], { maxTokens: 10 });
    return { success: result.includes('连接成功'), message: result.includes('连接成功') ? '连接成功！' : '响应格式异常' };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '未知错误';
    return { success: false, message: msg };
  }
}
