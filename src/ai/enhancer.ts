import { chatCompletion } from './client';
import { SYSTEM_PROMPT, SECTION_PROMPTS } from './prompts';
import type { APIConfig } from '../types/teaching-design';
import { buildGenerationContext } from '../engine/renderer';
import type { TeachingDesign } from '../types/teaching-design';

// AI增强单个板块
export async function enhanceSection(
  config: APIConfig,
  design: TeachingDesign,
  section: string
): Promise<string> {
  const context = buildGenerationContext(design);
  const sectionPromptFn = SECTION_PROMPTS[section];

  if (!sectionPromptFn) {
    throw new Error(`不支持的板块: ${section}`);
  }

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: sectionPromptFn(context) },
  ];

  return chatCompletion(config, messages, { temperature: 0.7, maxTokens: 2000 });
}

// AI生成完整教学设计的初稿
export async function generateFullDesign(
  config: APIConfig,
  topic: string,
  subject: string,
  grade: string
): Promise<string> {
  const context = `课题：${topic}
学科：${subject}
年级：${grade}`;

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: SECTION_PROMPTS.fullDesign(context) },
  ];

  return chatCompletion(config, messages, { temperature: 0.7, maxTokens: 4000 });
}

// 带文件上下文的AI生成
export async function generateWithFileContext(
  config: APIConfig,
  design: TeachingDesign,
  section: string,
  fileContent: string
): Promise<string> {
  const context = buildGenerationContext(design);
  const sectionPromptFn = SECTION_PROMPTS[section];

  if (!sectionPromptFn) {
    throw new Error(`不支持的板块: ${section}`);
  }

  const enhancedContext = `${context}

=== 上传的参考文件内容 ===
${fileContent.slice(0, 8000)}

=== 请参考以上文件内容来增强「${section}」板块 ===`;

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    { role: 'user' as const, content: sectionPromptFn(enhancedContext) },
  ];

  return chatCompletion(config, messages, { temperature: 0.7, maxTokens: 2000 });
}
