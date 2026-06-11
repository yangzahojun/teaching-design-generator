import type { Subject, Grade, Stage } from '../types/teaching-design';

export const STAGES: Stage[] = ['小学', '初中'];

export const SUBJECTS_BY_STAGE: Record<Stage, { value: Subject; label: string; grades: Grade[]; textbooks: string[] }[]> = {
  '小学': [
    { value: '语文', label: '语文', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], textbooks: ['统编版'] },
    { value: '数学', label: '数学', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], textbooks: ['人教版', '北师大版', '苏教版'] },
    { value: '英语', label: '英语', grades: ['三年级', '四年级', '五年级', '六年级'], textbooks: ['PEP', '外研版'] },
    { value: '科学', label: '科学', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], textbooks: ['教科版', '苏教版'] },
    { value: '道德与法治', label: '道德与法治', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], textbooks: ['统编版'] },
    { value: '信息科技', label: '信息科技', grades: ['三年级', '四年级', '五年级', '六年级'], textbooks: ['新课标'] },
    { value: '艺术', label: '艺术', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], textbooks: ['人教版', '人音版', '人美版'] },
    { value: '体育与健康', label: '体育与健康', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], textbooks: ['人教版'] },
  ],
  '初中': [
    { value: '语文', label: '语文', grades: ['七年级', '八年级', '九年级'], textbooks: ['统编版'] },
    { value: '数学', label: '数学', grades: ['七年级', '八年级', '九年级'], textbooks: ['人教版', '北师大版', '华师大版'] },
    { value: '英语', label: '英语', grades: ['七年级', '八年级', '九年级'], textbooks: ['人教版', '外研版'] },
    { value: '物理', label: '物理', grades: ['八年级', '九年级'], textbooks: ['人教版', '教科版', '北师大版', '沪科版'] },
    { value: '化学', label: '化学', grades: ['九年级'], textbooks: ['人教版', '沪教版', '鲁教版'] },
    { value: '生物', label: '生物', grades: ['七年级', '八年级'], textbooks: ['人教版', '北师大版', '苏教版'] },
    { value: '历史', label: '历史', grades: ['七年级', '八年级', '九年级'], textbooks: ['统编版'] },
    { value: '地理', label: '地理', grades: ['七年级', '八年级'], textbooks: ['人教版', '湘教版', '中图版'] },
    { value: '道德与法治', label: '道德与法治', grades: ['七年级', '八年级', '九年级'], textbooks: ['统编版'] },
    { value: '信息科技', label: '信息科技', grades: ['七年级', '八年级', '九年级'], textbooks: ['新课标'] },
    { value: '艺术', label: '艺术', grades: ['七年级', '八年级', '九年级'], textbooks: ['人教版', '人音版', '人美版'] },
    { value: '体育与健康', label: '体育与健康', grades: ['七年级', '八年级', '九年级'], textbooks: ['人教版'] },
  ],
};

export const ALL_GRADES: Grade[] = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'];

export function getGradesForSubject(subject: Subject, stage?: Stage): Grade[] {
  if (stage) {
    const s = SUBJECTS_BY_STAGE[stage].find(s => s.value === subject);
    return s?.grades || [];
  }
  for (const st of STAGES) {
    const s = SUBJECTS_BY_STAGE[st].find(s => s.value === subject);
    if (s) return s.grades;
  }
  return ALL_GRADES;
}

export function getTextbooksForSubject(subject: Subject, stage?: Stage): string[] {
  if (stage) {
    const s = SUBJECTS_BY_STAGE[stage].find(s => s.value === subject);
    return s?.textbooks || ['人教版'];
  }
  for (const st of STAGES) {
    const s = SUBJECTS_BY_STAGE[st].find(s => s.value === subject);
    if (s) return s.textbooks;
  }
  return ['人教版', '统编版'];
}
