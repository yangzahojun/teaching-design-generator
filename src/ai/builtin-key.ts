// 内置DeepSeek API密钥（base64编码，仅用于编译时嵌入）
// 这段配置编译后内置于JS bundle中，无需用户手动输入

const ENCODED_KEY = 'c2stYTVkNTE1OTZjMmRmNDVlNWIxOTkyZjY5YmYzYWE2NGU=';
const ENCODED_BASE = 'aHR0cHM6Ly9hcGkuZGVlcHNlZWsuY29tL3Yx';
const ENCODED_MODEL = 'ZGVlcHNlZWstY2hhdA==';

function decode(b64: string): string {
  try { return atob(b64); } catch { return ''; }
}

export const BUILTIN_API_CONFIG = {
  provider: 'deepseek' as const,
  apiKey: decode(ENCODED_KEY),
  baseUrl: decode(ENCODED_BASE),
  model: decode(ENCODED_MODEL),
};

export const API_KEY_MASKED = BUILTIN_API_CONFIG.apiKey
  ? BUILTIN_API_CONFIG.apiKey.slice(0, 5) + '****' + BUILTIN_API_CONFIG.apiKey.slice(-4)
  : '';
