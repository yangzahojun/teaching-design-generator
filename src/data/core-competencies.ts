// 各学科核心素养定义（基于2022版新课标）
import type { CoreCompetency } from '../types/teaching-design';

export const CORE_COMPETENCIES_BY_SUBJECT: Record<string, CoreCompetency[]> = {
  '数学': [
    { name: '数感', dimension: '小学·数学眼光', description: '在真实情境中理解数的意义' },
    { name: '量感', dimension: '小学·数学眼光', description: '对事物的可测量属性及大小关系的直观感知' },
    { name: '符号意识', dimension: '小学·数学眼光', description: '感悟符号的数学功能' },
    { name: '空间观念', dimension: '数学眼光', description: '根据物体特征抽象出几何图形，进行空间想象和推理' },
    { name: '几何直观', dimension: '小学·数学眼光', description: '利用图形描述和分析问题' },
    { name: '抽象能力', dimension: '初中·数学眼光', description: '从现实世界和具体情境中抽象出数学研究对象' },
    { name: '运算能力', dimension: '数学思维', description: '根据法则和运算律正确进行运算，理解算理算法' },
    { name: '推理能力', dimension: '数学思维', description: '进行合情推理和演绎推理，表达论证过程' },
    { name: '数据意识', dimension: '小学·数学语言', description: '理解数据的意义，感悟数据的随机性' },
    { name: '模型观念', dimension: '初中·数学语言', description: '运用数学模型解决实际问题的意识和能力' },
    { name: '应用意识', dimension: '数学语言', description: '利用数学概念原理和方法解释现实世界' },
    { name: '创新意识', dimension: '数学语言', description: '从不同角度思考和解决问题，提出创造性方案' },
  ],
  '语文': [
    { name: '文化自信', dimension: '文化素养', description: '认同中华文化，对中华文化的生命力有坚定信心' },
    { name: '语言运用', dimension: '语言素养', description: '具有正确规范运用语言文字的意识和能力' },
    { name: '思维能力', dimension: '思维素养', description: '直觉思维、形象思维、逻辑思维、辩证思维和创造思维' },
    { name: '审美创造', dimension: '审美素养', description: '感受、理解、欣赏、评价语言文字及作品，创造性地表达' },
  ],
  '英语': [
    { name: '语言能力', dimension: '语言知识', description: '运用语言和非语言知识理解和表达意义' },
    { name: '文化意识', dimension: '文化知识', description: '对中外文化的理解和对优秀文化的鉴赏能力' },
    { name: '思维品质', dimension: '认知能力', description: '在语言学习过程中表现的思维个性特征' },
    { name: '学习能力', dimension: '学习策略', description: '积极运用和主动调适英语学习策略' },
  ],
  '科学': [
    { name: '科学观念', dimension: '知识理解', description: '对科学知识的基本理解和认识' },
    { name: '科学思维', dimension: '思维方法', description: '以科学方法分析问题和解决问题' },
    { name: '探究实践', dimension: '实践能力', description: '进行科学探究和工程实践' },
    { name: '态度责任', dimension: '情感态度', description: '对科学的好奇心、实事求是的态度和社会责任感' },
  ],
  '物理': [
    { name: '物理观念', dimension: '知识理解', description: '对物质、运动与相互作用、能量的基本认识' },
    { name: '科学思维', dimension: '思维方法', description: '模型建构、科学推理、科学论证、质疑创新' },
    { name: '科学探究', dimension: '实践能力', description: '提出问题、猜想假设、设计实验、分析论证、评估交流' },
    { name: '科学态度与责任', dimension: '情感态度', description: '科学本质观、科学态度、社会责任感' },
  ],
  '化学': [
    { name: '化学观念', dimension: '知识理解', description: '对物质的组成、结构、性质与变化的基本认识' },
    { name: '科学思维', dimension: '思维方法', description: '从宏观-微观-符号三重表征认识物质及其变化' },
    { name: '科学探究', dimension: '实践能力', description: '进行化学实验探究，基于证据得出结论' },
    { name: '科学态度与责任', dimension: '情感态度', description: '严谨求实的科学态度和可持续发展意识' },
  ],
  '生物': [
    { name: '生命观念', dimension: '知识理解', description: '认识生命现象和活动规律，建立结构与功能观、进化与适应观' },
    { name: '科学思维', dimension: '思维方法', description: '基于事实和证据进行归纳、推理和论证' },
    { name: '探究实践', dimension: '实践能力', description: '运用科学探究的基本方法解决生物学问题' },
    { name: '态度责任', dimension: '情感态度', description: '尊重生命、保护生态环境的意识和健康习惯' },
  ],
  '历史': [
    { name: '唯物史观', dimension: '历史观念', description: '初步学会在唯物史观指导下看待历史' },
    { name: '时空观念', dimension: '历史思维', description: '在特定的时间联系和空间联系中对事物进行观察分析' },
    { name: '史料实证', dimension: '历史方法', description: '初步学会依靠可信史料了解和认识历史' },
    { name: '历史解释', dimension: '历史能力', description: '初步学会有理有据地表达对历史的看法' },
    { name: '家国情怀', dimension: '历史情感', description: '形成对家乡、国家和中华民族的认同' },
  ],
  '地理': [
    { name: '人地协调观', dimension: '地理观念', description: '理解人类活动与地理环境的关系' },
    { name: '综合思维', dimension: '地理思维', description: '从多要素角度综合分析地理问题' },
    { name: '区域认知', dimension: '地理方法', description: '从区域视角认识地理环境' },
    { name: '地理实践力', dimension: '地理能力', description: '在真实情境中运用地理知识和方法' },
  ],
  '道德与法治': [
    { name: '政治认同', dimension: '政治素养', description: '拥护中国共产党的领导，坚持中国特色社会主义道路' },
    { name: '道德修养', dimension: '道德素养', description: '养成良好的道德品质和行为习惯' },
    { name: '法治观念', dimension: '法治素养', description: '树立宪法法律至上、法律面前人人平等的观念' },
    { name: '健全人格', dimension: '心理健康', description: '具有积极的心理品质和抗挫折能力' },
    { name: '责任意识', dimension: '社会责任', description: '具有担当精神和社会责任感' },
  ],
  '信息科技': [
    { name: '信息意识', dimension: '信息素养', description: '对信息的敏感度和对信息价值的判断力' },
    { name: '计算思维', dimension: '思维方式', description: '运用计算机科学的基础概念进行问题求解' },
    { name: '数字化学习与创新', dimension: '实践能力', description: '运用数字化工具进行学习和创新' },
    { name: '信息社会责任', dimension: '社会责任', description: '在信息社会中承担应有的责任' },
  ],
};

export function getCompetenciesForSubject(subject: string): CoreCompetency[] {
  return CORE_COMPETENCIES_BY_SUBJECT[subject] || [
    { name: '核心素养', dimension: '综合', description: '请根据具体学科选择对应的核心素养维度' },
  ];
}

export const BLOOM_LEVELS = [
  { value: 'remember', label: '记忆 - 识别、回忆' },
  { value: 'understand', label: '理解 - 解释、举例、分类、总结、推断、比较、说明' },
  { value: 'apply', label: '应用 - 执行、实施' },
  { value: 'analyze', label: '分析 - 区分、组织、归因' },
  { value: 'evaluate', label: '评价 - 检查、评论' },
  { value: 'create', label: '创造 - 生成、计划、产出' },
];

export const BOPPPS_PHASES = [
  { value: 'B', label: 'B - 导入 (Bridge-in)', description: '创设情境、激发兴趣、引出课题' },
  { value: 'O', label: 'O - 目标 (Objective)', description: '明确学习目标' },
  { value: 'P-pre', label: 'P₁ - 前测 (Pre-assessment)', description: '诊断学生已有知识和能力' },
  { value: 'P-participatory', label: 'P₂ - 参与式学习 (Participatory)', description: '核心教学活动' },
  { value: 'P-post', label: 'P₃ - 后测 (Post-assessment)', description: '检测学习效果' },
  { value: 'S', label: 'S - 总结 (Summary)', description: '归纳总结、延伸拓展' },
];
