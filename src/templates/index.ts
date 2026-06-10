import type { TeachingDesign, TemplateType } from '../types/teaching-design';
import { renderStandardTemplate } from './standard';
import { renderBOPPPSTemplate } from './boppps';
import { renderUbDTemplate } from './ubd';

export function renderTemplate(design: TeachingDesign, template?: TemplateType): string {
  const t = template || design.meta.template || 'standard';
  switch (t) {
    case 'boppps': return renderBOPPPSTemplate(design);
    case 'ubd': return renderUbDTemplate(design);
    case 'standard':
    default: return renderStandardTemplate(design);
  }
}

export const templateMeta = {
  standard: {
    name: '新课标标准模板',
    description: '完整的9板块教学设计，包含课标分析、教材分析、学情分析、学习目标、评价任务、BOPPPS活动、作业、板书、反思，以及困难设计框架和教学评一致性矩阵。',
    sections: 12,
  },
  boppps: {
    name: 'BOPPPS 模型',
    description: 'B(导入)→O(目标)→P₁(前测)→P₂(参与式学习)→P₃(后测)→S(总结) 六阶段结构，聚焦互动与反馈循环。',
    sections: 6,
  },
  ubd: {
    name: 'UbD 逆向设计',
    description: '阶段一：确定预期结果 → 阶段二：确定评估证据 → 阶段三：规划学习体验（WHERETO）。评估证据先行于活动设计。',
    sections: 3,
  },
};
