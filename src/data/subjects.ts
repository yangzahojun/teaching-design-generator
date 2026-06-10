import type { Subject, Grade } from '../types/teaching-design';

export const SUBJECTS: { value: Subject; label: string; grades: Grade[] }[] = [
  { value: '小学语文', label: '小学语文', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'] },
  { value: '小学数学', label: '小学数学', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'] },
  { value: '小学英语', label: '小学英语', grades: ['三年级', '四年级', '五年级', '六年级'] },
  { value: '小学科学', label: '小学科学', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'] },
  { value: '小学道德与法治', label: '小学道德与法治', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'] },
  { value: '小学信息科技', label: '小学信息科技', grades: ['三年级', '四年级', '五年级', '六年级'] },
  { value: '小学艺术', label: '小学艺术', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'] },
  { value: '小学体育', label: '小学体育', grades: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'] },
  { value: '初中语文', label: '初中语文', grades: ['七年级', '八年级', '九年级'] },
  { value: '初中数学', label: '初中数学', grades: ['七年级', '八年级', '九年级'] },
  { value: '初中英语', label: '初中英语', grades: ['七年级', '八年级', '九年级'] },
  { value: '初中物理', label: '初中物理', grades: ['八年级', '九年级'] },
  { value: '初中化学', label: '初中化学', grades: ['九年级'] },
  { value: '初中生物', label: '初中生物', grades: ['七年级', '八年级'] },
  { value: '初中历史', label: '初中历史', grades: ['七年级', '八年级', '九年级'] },
  { value: '初中地理', label: '初中地理', grades: ['七年级', '八年级'] },
  { value: '初中道德与法治', label: '初中道德与法治', grades: ['七年级', '八年级', '九年级'] },
];

export const ALL_GRADES: Grade[] = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'];

export const TEXTBOOK_VERSIONS = ['人教版', '统编版', '北师大版', '苏教版', '教科版', '沪教版', '浙教版', '鲁教版', 'PEP', '外研版', '新课标'];

export function getGradesForSubject(subject: Subject): Grade[] {
  return SUBJECTS.find(s => s.value === subject)?.grades || ALL_GRADES;
}
