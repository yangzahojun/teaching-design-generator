// ===== 教案缓存层 =====
// 优先从预生成库加载 → 没有则查localStorage → 都没有就调API

const CACHE_PREFIX = 'plan_cache_';

export function getCacheKey(subject: string, grade: string, topic: string): string {
  return `${subject}|${grade}|${topic}`;
}

export function getPlanFilename(subject: string, grade: string, topic: string): string {
  const safe = (s: string) => s.replace(/[\\/:*?"<>|]/g, '_');
  return `${safe(subject)}__${safe(grade)}__${safe(topic)}.json`;
}

// 尝试从预生成库加载（GitHub Pages上的JSON文件）
export async function loadFromBuiltinLibrary(
  subject: string, grade: string, topic: string
): Promise<Record<string, unknown> | null> {
  try {
    const filename = getPlanFilename(subject, grade, topic);
    const url = `./data/plans/${filename}`;
    const resp = await fetch(url);
    if (resp.ok) {
      return await resp.json();
    }
  } catch {
    // 文件不存在或网络错误
  }
  return null;
}

// 从localStorage缓存加载
export function loadFromLocalCache(
  subject: string, grade: string, topic: string
): Record<string, unknown> | null {
  try {
    const key = CACHE_PREFIX + getCacheKey(subject, grade, topic);
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

// 保存到localStorage缓存
export function saveToLocalCache(
  subject: string, grade: string, topic: string, data: Record<string, unknown>
): void {
  try {
    const key = CACHE_PREFIX + getCacheKey(subject, grade, topic);
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* quota exceeded */ }
}
