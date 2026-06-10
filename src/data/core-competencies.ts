// 各学科核心素养定义（基于2022版新课标）
import type { CoreCompetency } from '../types/teaching-design';

export const CORE_COMPETENCIES_BY_SUBJECT: Record<string, CoreCompetency[]> = {
  '小学数学': [
    { name: '数感', dimension: '数学眼光', description: '在真实情境中理解数的意义，能用数表示物体的个数或事物的顺序' },
    { name: '量感', dimension: '数学眼光', description: '对事物的可测量属性及大小关系的直观感知' },
    { name: '符号意识', dimension: '数学眼光', description: '感悟符号的数学功能，运用符号进行表达和运算' },
    { name: '空间观念', dimension: '数学眼光', description: '根据物体特征抽象出几何图形，根据几何图形想象出实际物体' },
    { name: '几何直观', dimension: '数学眼光', description: '利用图形描述和分析问题，建立形与数的联系' },
    { name: '运算能力', dimension: '数学思维', description: '根据法则和运算律正确进行运算，理解算理' },
    { name: '推理意识', dimension: '数学思维', description: '通过归纳类比等进行合情推理，初步形成论证能力' },
    { name: '数据意识', dimension: '数学语言', description: '理解数据的意义，感悟数据的随机性' },
    { name: '应用意识', dimension: '数学语言', description: '利用数学概念原理和方法解释现实世界中的现象与问题' },
    { name: '创新意识', dimension: '数学语言', description: '主动尝试从不同角度思考和解决问题，提出独特的思路' },
  ],
  '小学语文': [
    { name: '文化自信', dimension: '文化素养', description: '认同中华文化，对中华文化的生命力有坚定信心' },
    { name: '语言运用', dimension: '语言素养', description: '具有正确规范运用语言文字的意识和能力，形成个体语言经验' },
    { name: '思维能力', dimension: '思维素养', description: '在语文学习过程中的联想想象、分析比较、归纳判断等认知表现' },
    { name: '审美创造', dimension: '审美素养', description: '感受、理解、欣赏、评价语言文字及作品，创造性地表达' },
  ],
  '小学英语': [
    { name: '语言能力', dimension: '语言知识', description: '运用语言和非语言知识理解和表达意义的能力' },
    { name: '文化意识', dimension: '文化知识', description: '对中外文化的理解和对优秀文化的鉴赏能力' },
    { name: '思维品质', dimension: '认知能力', description: '在语言学习过程中表现的思维个性特征' },
    { name: '学习能力', dimension: '学习策略', description: '积极运用和主动调适英语学习策略的能力' },
  ],
  '小学科学': [
    { name: '科学观念', dimension: '知识理解', description: '对科学知识的基本理解和认识' },
    { name: '科学思维', dimension: '思维方法', description: '以科学方法分析问题和解决问题的能力' },
    { name: '探究实践', dimension: '实践能力', description: '进行科学探究和工程实践的能力' },
    { name: '态度责任', dimension: '情感态度', description: '对科学的好奇心、实事求是的态度和社会责任感' },
  ],
  '初中语文': [
    { name: '文化自信', dimension: '文化素养', description: '认同中华文化，对中华文化的生命力有坚定信心' },
    { name: '语言运用', dimension: '语言素养', description: '具有正确规范运用语言文字的意识和能力，形成个体语言经验' },
    { name: '思维能力', dimension: '思维素养', description: '直觉思维、形象思维、逻辑思维、辩证思维和创造思维' },
    { name: '审美创造', dimension: '审美素养', description: '感受、理解、欣赏、评价语言文字及作品，创造性地表达' },
  ],
  '初中数学': [
    { name: '抽象能力', dimension: '数学眼光', description: '从现实世界和具体情境中抽象出数学研究对象的能力' },
    { name: '空间观念', dimension: '数学眼光', description: '理解空间图形的性质和关系，进行空间想象和推理' },
    { name: '运算能力', dimension: '数学思维', description: '理解算理算法，合理选择运算策略解决问题' },
    { name: '推理能力', dimension: '数学思维', description: '进行合情推理和演绎推理，表达论证过程' },
    { name: '数据观念', dimension: '数学语言', description: '从数据中获取信息，用数据说话，做出合理决策' },
    { name: '模型观念', dimension: '数学语言', description: '运用数学模型解决实际问题的意识和能力' },
    { name: '应用意识', dimension: '数学语言', description: '有意识利用数学的概念、原理和方法解释现实世界' },
    { name: '创新意识', dimension: '数学语言', description: '从非常规角度思考问题，提出创造性的解决方案' },
  ],
  '初中物理': [
    { name: '物理观念', dimension: '知识理解', description: '对物质、运动与相互作用、能量的基本认识和理解' },
    { name: '科学思维', dimension: '思维方法', description: '模型建构、科学推理、科学论证、质疑创新' },
    { name: '科学探究', dimension: '实践能力', description: '提出问题、猜想假设、设计实验、分析论证、评估交流' },
    { name: '科学态度与责任', dimension: '情感态度', description: '科学本质观、科学态度、社会责任感' },
  ],
  '初中化学': [
    { name: '化学观念', dimension: '知识理解', description: '对物质的组成、结构、性质与变化的基本认识和理解' },
    { name: '科学思维', dimension: '思维方法', description: '从宏观-微观-符号三重表征认识物质及其变化' },
    { name: '科学探究', dimension: '实践能力', description: '进行化学实验探究，收集证据并基于证据得出结论' },
    { name: '科学态度与责任', dimension: '情感态度', description: '严谨求实的科学态度和可持续发展意识' },
  ],
  '初中生物': [
    { name: '生命观念', dimension: '知识理解', description: '认识生命现象和生命活动规律，建立结构与功能观、进化与适应观' },
    { name: '科学思维', dimension: '思维方法', description: '基于事实和证据进行归纳、推理和论证' },
    { name: '探究实践', dimension: '实践能力', description: '运用科学探究的基本方法解决生物学问题' },
    { name: '态度责任', dimension: '情感态度', description: '尊重生命、保护生态环境的意识和健康生活习惯' },
  ],
};

export function getCompetenciesForSubject(subject: string): CoreCompetency[] {
  return CORE_COMPETENCIES_BY_SUBJECT[subject] || [
    { name: '核心素养', dimension: '综合', description: '请根据具体学科选择对应的核心素养维度' },
  ];
}

// 布鲁姆认知层级
export const BLOOM_LEVELS = [
  { value: 'remember', label: '记忆 - 识别、回忆' },
  { value: 'understand', label: '理解 - 解释、举例、分类、总结、推断、比较、说明' },
  { value: 'apply', label: '应用 - 执行、实施' },
  { value: 'analyze', label: '分析 - 区分、组织、归因' },
  { value: 'evaluate', label: '评价 - 检查、评论' },
  { value: 'create', label: '创造 - 生成、计划、产出' },
];

// BOPPPS阶段
export const BOPPPS_PHASES = [
  { value: 'B', label: 'B - 导入 (Bridge-in)', description: '创设情境、激发兴趣、引出课题' },
  { value: 'O', label: 'O - 目标 (Objective)', description: '明确学习目标' },
  { value: 'P-pre', label: 'P₁ - 前测 (Pre-assessment)', description: '诊断学生已有知识和能力' },
  { value: 'P-participatory', label: 'P₂ - 参与式学习 (Participatory)', description: '核心教学活动' },
  { value: 'P-post', label: 'P₃ - 后测 (Post-assessment)', description: '检测学习效果' },
  { value: 'S', label: 'S - 总结 (Summary)', description: '归纳总结、延伸拓展' },
];
