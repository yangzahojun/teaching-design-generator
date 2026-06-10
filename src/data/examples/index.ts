import type { TeachingDesign } from '../../types/teaching-design';

const examples: TeachingDesign[] = [
  {
    meta: {
      title: '三角形的面积',
      subject: '小学数学',
      grade: '五年级',
      textbookVersion: '人教版',
      unit: '第五单元 多边形的面积',
      duration: 40,
      designer: '范例设计者',
      date: '2026-06-10',
      template: 'standard',
    },
    standardAnalysis: {
      contentRequirement: '探索并掌握三角形面积的计算公式，能解决简单的实际问题。',
      academicRequirement: '能运用转化思想，探索平面图形的面积公式，形成空间观念和推理意识。',
      teachingHint: '通过拼剪、割补等操作活动，让学生经历面积公式的推导过程，体会"转化"的数学思想。',
      coreCompetencies: [
        { name: '空间观念', dimension: '数学眼光', description: '通过图形割补操作，建立三角形与平行四边形的关系' },
        { name: '推理意识', dimension: '数学思维', description: '由平行四边形面积推导三角形面积公式' },
        { name: '运算能力', dimension: '数学思维', description: '正确运用面积公式进行计算' },
      ],
    },
    textbookAnalysis: {
      verticalAnalysis: '本课位于"多边形的面积"单元，是在学生学习了长方形、正方形、平行四边形面积之后的教学内容，为后续学习梯形、组合图形面积和立体图形表面积打下基础。',
      crossAnalysis: '人教版采用"用两个全等三角形拼成平行四边形"的推导路径；北师大版强调从方格纸数格子到公式推导的渐进过程。两者本质都是"转化"思想。',
      bigConcept: '转化思想——将未知图形转化为已知图形，通过寻找两者关系推导出新公式。',
      keyKnowledge: ['三角形面积公式 S = ah ÷ 2', '"等底等高"概念的理解', '转化思想的体验与应用'],
      difficulties: ['理解为什么是"底×高÷2"而非"底×高"', '正确找到对应的底和高', '在变式情境中灵活运用公式'],
    },
    learnerAnalysis: {
      priorKnowledge: '学生已掌握平行四边形面积公式及其推导方法（割补法），对"转化"思想有初步体验。',
      priorExperience: '生活中见过各种三角形物体（三角尺、路标、屋顶等），对三角形有感性认识。',
      cognitiveDifficulty: '学生容易混淆"三角形面积÷2"与"三角形周长无关"；在用公式时需要准确识别对应的底和高。',
      preAssessment: '课前检测：1. 画出一个平行四边形，标出底和高，写出面积公式；2. 给出一个三角形，让学生说说关于它你知道什么？',
    },
    learningObjectives: [
      { id: 'obj1', content: '通过动手操作（拼剪、叠合），探索并推导出三角形面积计算公式，经历"转化—找关系—推公式"的认知过程', category: 'knowledge', competencyLink: '推理意识', assessmentMethod: '观察操作过程+提问推导过程', bloomLevel: 'understand' },
      { id: 'obj2', content: '能正确运用三角形面积公式S=ah÷2进行计算，解决简单的实际问题', category: 'skill', competencyLink: '运算能力', assessmentMethod: '课堂练习+变式题检测', bloomLevel: 'apply' },
      { id: 'obj3', content: '在探索过程中感受"转化"的数学思想，体验成功克服困难的成就感', category: 'attitude', competencyLink: '创新意识', assessmentMethod: '课堂观察+学生自评', bloomLevel: 'evaluate' },
    ],
    assessmentTasks: {
      preAssessment: {
        method: '回顾复习 + 提问',
        questions: ['平行四边形的面积公式是什么？', '我们是怎么推导出平行四边形面积公式的？（割补法）', '如果让你求一个三角形的面积，你可能会怎么想？'],
        purpose: '激活已有知识"转化思想"，暴露学生前概念',
      },
      formativeAssessment: {
        checkpoints: [
          { activityId: '拼剪操作', method: '观察+提问', criteria: '学生能正确完成两个全等三角形的拼合，并说出拼出的是什么图形' },
          { activityId: '公式推导', method: '提问+板演', criteria: '学生能用自己的话解释为什么三角形面积是底×高÷2' },
          { activityId: '练习应用', method: '巡视+抽查', criteria: '85%以上学生能正确计算基本题' },
        ],
      },
      postAssessment: {
        method: '课堂检测 + 拓展题',
        tasks: ['基础：计算下面三角形的面积（给出底和高）', '变式：找出三角形中正确的底和高并计算', '拓展：画一个面积为12cm²的三角形，你能画几种？'],
        rubric: '优秀：三题全对且能解释推导过程；合格：基础题和变式题正确；需辅导：基础题有误',
      },
    },
    activities: [
      { id: 'act1', phase: 'B', title: '情境导入：三角形土地的面积', duration: 3, teacherAction: '出示情境：一块三角形土地，需要知道面积来估算产量。提问：我们学过了平行四边形面积，三角形的面积怎么求？', studentAction: '观察情境，思考问题，产生疑问', designIntent: '创设真实情境引出课题，激发探索欲望', assessmentEmbedded: '', materials: ['PPT展示情境图'] },
      { id: 'act2', phase: 'O', title: '明确目标与任务', duration: 2, teacherAction: '展示本课学习目标和探索任务：用学具拼一拼、想一想，自己找出三角形面积的计算方法', studentAction: '明确学习目标，了解探索任务', designIntent: '目标导向，让学生知道要做什么', assessmentEmbedded: '', materials: ['PPT展示目标'] },
      { id: 'act3', phase: 'P-participatory', title: '★核心探索：拼剪实验（困难前置）', duration: 12, teacherAction: '发放学具（每组两个全等三角形），引导学生先独立思考再小组合作：你能用这两个三角形拼成学过的图形吗？拼出的图形面积和三角形有什么关系？推导三角形面积公式。教师巡视、等待、不急于给出答案（过程保留）。', studentAction: '学生先独立尝试拼剪→组内交流发现→代表板演汇报推导过程', designIntent: '困难前置原则：让学生在教师讲解前自主探索，经历"困惑→尝试→发现"的认知过程，体现Kapur"有效失败"理念', assessmentEmbedded: '观察学生操作，追问"为什么除以2"', materials: ['两个全等的三角形（每组一套）', '剪刀', '方格纸'] },
      { id: 'act4', phase: 'P-participatory', title: '全班交流与公式确认', duration: 5, teacherAction: '组织各小组分享推导方法，引导全班归纳公式S=ah÷2，强调"等底等高"的条件和"÷2"的含义', studentAction: '小组代表上台展示拼法，全班讨论补充，共同归纳公式', designIntent: '教师引导确认正确公式，确保全班达成共识', assessmentEmbedded: '提问"为什么除以2"，检查深层理解', materials: ['实物展台'] },
      { id: 'act5', phase: 'P-participatory', title: '公式应用与变式练习', duration: 8, teacherAction: '设计阶梯式练习：基础题（已知底和高求面积）→变式题（换方向找底和高）→逆向题（已知面积求高）。巡视关注不同水平学生。', studentAction: '独立完成练习，全班订正，互相答疑', designIntent: '通过有层次的困难提升，让每个学生在自己的ZPD内成长', assessmentEmbedded: '检查练习正确率，识别典型错误', materials: ['练习题单'] },
      { id: 'act6', phase: 'P-post', title: '后测挑战', duration: 5, teacherAction: '发放检测题，观察学生完成情况', studentAction: '独立完成三组检测题', designIntent: '检测教学目标达成度', assessmentEmbedded: '收集检测数据，评估目标达成', materials: ['后测题单'] },
      { id: 'act7', phase: 'S', title: '总结与延伸', duration: 5, teacherAction: '引导总结：我们是怎么学会三角形面积公式的？（转化思想）；延伸提问：如果要求梯形的面积，你能想到什么方法？', studentAction: '回顾学习过程，提炼"转化"思想，思考课后延伸问题', designIntent: '强化转化思想这一大概念，为后续学习梯形面积和组合图形面积做铺垫', assessmentEmbedded: '', materials: [] },
    ],
    homework: {
      required: [
        { title: '基础练习', description: '完成课本练习十五第1-3题（三角形面积计算）', targetObjective: 'obj2', estimatedTime: 10 },
        { title: '解释推导', description: '回家后向家长讲解三角形面积公式的推导过程', targetObjective: 'obj1', estimatedTime: 5 },
      ],
      optional: [
        { title: '探索挑战', description: '画三个不同形状但面积都是12cm²的三角形，你有什么发现？', targetObjective: 'obj3', estimatedTime: 8 },
      ],
      designIntent: '必做巩固公式应用，选做深化"等底等高"概念的理解，书面练习与口头表达相结合。',
      differentiationNote: '基础薄弱的学生重点完成必做练习，学有余力的学生鼓励完成选做挑战。',
    },
    boardDesign: {
      layout: `┌─────────────────────────────────┐
│    三角形的面积                │
│                                │
│  ┌──────────┐   S = ah ÷ 2     │
│  │  拼剪图  │                 │
│  │ △+△=▱   │   转化思想：     │
│  │          │   未知→已知      │
│  │ 底×高÷2 │                 │
│  └──────────┘  重点：÷2的含义  │
│                                │
└─────────────────────────────────┘`,
      keyElements: ['转化思想', 'S = ah ÷ 2', '等底等高', '拼剪操作过程'],
      structureLogic: '从上到下：操作演示（左）→公式（右）→思想方法（底部）。体现"做中学"的逻辑顺序。',
    },
    reflection: {
      targetAchievement: '预计85%以上学生能正确推导和应用三角形面积公式，部分学生能用自己的话解释"为什么除以2"。',
      evidenceSources: ['课堂拼剪操作观察记录', '后测题检测数据', '全班交流中的提问和回答质量'],
      improvementMeasures: ['如学生对"找对应底和高"存在普遍困难，下节课增加专项训练', '对仍不理解"÷2"的学生进行个别辅导，用实物再次演示'],
      notableObservations: '关注学生在自主探索环节中是否真正经历了认知冲突和解决过程，而非直接等待教师告知答案。这是"过程保留"原则的关键体现。',
    },
    alignmentMatrix: [
      { objectiveId: '目标1：推导公式', assessmentTaskId: '形成性：观察操作+提问', activityIds: ['拼剪实验', '全班交流'], consistencyNote: '核心探索活动直接服务于推导目标，评价嵌入在操作和交流中' },
      { objectiveId: '目标2：应用公式', assessmentTaskId: '后测：课堂检测', activityIds: ['变式练习', '后测挑战'], consistencyNote: '练习和后测直接检测公式应用能力，练习为"教"，后测为"评"' },
      { objectiveId: '目标3：感受转化思想', assessmentTaskId: '形成性：学生自评', activityIds: ['拼剪实验', '总结延伸'], consistencyNote: '通过操作体验和总结回顾，让学生感悟转化思想' },
    ],
    difficultyDesign: {
      targetDifficulty: '理解"为什么三角形面积要除以2"——这背后涉及"等底等高"的"等积变形"概念，是学生认知的关键节点。',
      educationalValue: '这一困难蕴含着"转化—找关系"的数学核心思想。克服它不仅是学会一个公式，更是掌握一种思维方式——面对未知问题，将其转化为已知来求解。这是Bjork"理想困难"的典型例证：表面上是计算的挫折，实质上是深层思维正在建构的信号。',
      zpdAlignment: '学生已掌握"割补法"推导平行四边形的经验（现有水平），在适当引导下能从"两个三角形拼成平行四边形"推导出面积公式（最近发展区）。教师通过提供学具（两个全等三角形）和引导性问题（"你拼出的是什么图形？拼出的图形面积和三角形有什么关系？"）作为脚手架。',
      meaninglessObstacles: ['学生因剪刀使用不熟练导致的拼剪困难（提前准备好精确裁剪的学具）', '等底等高概念表述过于抽象导致无法理解（先用具体操作代替抽象表述）'],
      motivationStrategy: '意义先行：从"三角形土地面积估算"的真实需求出发，而非直接告知"今天学三角形面积"；让学生理解"为什么要克服这个困难"——因为你需要用数学解决真实问题。',
      autonomySupport: '允许学生自由选择拼剪方案（从不同顶点画高），按自己的方式探索推导路径；在练习环节提供不同难度的题目供学生自选。',
      competenceScaffold: '课前复习平行四边形的"割补法"推导，唤醒"转化"经验；核心探索前鼓励学生"我知道你们能够自己发现——你们已经有过类似的成功经验"。',
      relatednessConnection: '小组合作拼剪探索，在讨论和交流中共同面对困难、分享发现，建立"我们在一起攻克一个难题"的集体感。',
      difficultyFirst: '拼剪实验环节严格安排在教师讲解公式之前。教师不给任何暗示，先让学生自己动手尝试、遇到困惑、产生猜想——在"不愤不启，不悱不发"的状态中，教师的正式讲解才真正有意义。',
      processPreservation: '全班交流环节中，优先让学生讲解自己的推导过程，教师只在学生卡住时提供启发式追问（"你拼出来的是什么形状？这个形状的面积你会算吗？"），而非直接告知结论。练习答案由学生互相检查，而非教师公布。',
      abstractionProtection: '不过度依赖PPT动画演示拼剪过程——保留让学生亲自动手操作、从实物中抽象出公式的思维跨度。这是概念形成（而非概念同化）的关键。',
    },
    aiRoleDefinition: {
      asDifficultyDesigner: '分析学生数据，识别不同学生在"等底等高"理解上的薄弱点，为不同水平的学生设计有梯度的变式练习——如对于理解"等积变形"困难的学生，可以先用方格纸直观呈现等底等高的多个三角形。',
      asMotivationEnhancer: '记录和可视化学在拼剪实验中的"探索轨迹"——从尝试失败到最终发现的完整过程，让学生看到自己的成长，而非只关注正确答案。',
      asObstacleRemover: '为学生提供"等底等高三角形面积相同"的可视化验证工具（动态几何软件GeoGebra），帮助消除因空间想象力不足造成的理解障碍——但前提是学生已经经历了实物拼剪的思考过程。',
      coreBoundary: 'AI不能替代学生亲身经历"困惑—拼剪尝试—发现关系—推导公式"的思考过程。就像宾大实验所警示的：当学生直接获得解题步骤，他们在无AI的考试中反而比不用AI的学生低17%。过程的跳过，就是学习的跳过。',
    },
  },

  // ===== 范例2: 初中语文《陋室铭》 =====
  {
    meta: {
      title: '陋室铭',
      subject: '初中语文',
      grade: '七年级',
      textbookVersion: '统编版',
      unit: '第四单元',
      duration: 45,
      designer: '范例设计者',
      date: '2026-06-10',
      template: 'standard',
    },
    standardAnalysis: {
      contentRequirement: '诵读古代诗词，阅读浅易文言文，能借助注释和工具书理解基本内容。注重积累、感悟和运用，提高欣赏品位。',
      academicRequirement: '能阅读浅易文言文，理解基本内容。背诵优秀诗文80篇（段）。',
      teachingHint: '引导学生通过诵读感受文言文的韵律美，通过品味语言来把握作者的思想感情。',
      coreCompetencies: [
        { name: '文化自信', dimension: '文化素养', description: '感受中国古代文人安贫乐道的精神境界' },
        { name: '语言运用', dimension: '语言素养', description: '品味骈散结合的语言之美' },
        { name: '思维能力', dimension: '思维素养', description: '分析托物言志的写作手法' },
        { name: '审美创造', dimension: '审美素养', description: '鉴赏文言的韵律美和意境美' },
      ],
    },
    textbookAnalysis: {
      verticalAnalysis: '本课是七年级上册第四单元的一篇文言文，学生此前已学习了《〈论语〉十二章》（语录体）、《诫子书》（书信体），本文是"铭"这种文体，短小精悍，对仗工整。',
      crossAnalysis: '统编版将其作为"托物言志"的代表篇章，强调文体特征和写作手法。',
      bigConcept: '托物言志——借对陋室的描写表达作者安贫乐道、高洁傲岸的情操。',
      keyKnowledge: ['"铭"的文体特征', '骈散结合的语言特点', '托物言志的手法', '刘禹锡的生平与写作背景'],
      difficulties: ['理解"何陋之有"的深层含义与用典', '体会"陋室不陋"的辩证关系'],
    },
    learnerAnalysis: {
      priorKnowledge: '学生已学过一些浅易文言文，掌握基本的文言实词和虚词知识，初步了解"铭"这种文体。',
      priorExperience: '学生对"简陋"与"丰富"的辩证关系有生活体验，如物质条件一般但精神生活充实的情境。',
      cognitiveDifficulty: '文言文语言隔膜使学生难以直接感受文章的情感力量和艺术魅力。',
      preAssessment: '提问：你心中的"陋室"是什么样子的？如果让你住在一个简陋的房间里，你会怎么想？引出学生对"陋"与"不陋"的初步思考。',
    },
    learningObjectives: [
      { id: 'obj1', content: '能正确、流利、有感情地朗读并背诵全文，感受骈散结合的语言韵律美', category: 'knowledge', competencyLink: '文化自信', assessmentMethod: '朗读展示+背诵检查', bloomLevel: 'remember' },
      { id: 'obj2', content: '借助注释和工具书理解文言词句，分析"托物言志"的写作手法及其表达效果', category: 'skill', competencyLink: '思维能力', assessmentMethod: '课堂讨论+写作分析', bloomLevel: 'analyze' },
      { id: 'obj3', content: '体会作者安贫乐道、高洁傲岸的情操，形成对"物质与精神"关系的辩证认识', category: 'attitude', competencyLink: '文化自信', assessmentMethod: '课后小作文', bloomLevel: 'evaluate' },
    ],
    assessmentTasks: {
      preAssessment: { method: '开放式提问', questions: ['你心中的"陋室"是什么样子的？', '一个人住在简陋的房间里，他会不会觉得羞耻？'], purpose: '激活对"陋"与"不陋"的思考' },
      formativeAssessment: { checkpoints: [] },
      postAssessment: { method: '背诵+分析写作', tasks: ['背诵全文', '分析"托物言志"手法在文中的具体体现'], rubric: '' },
    },
    activities: [],
    homework: {
      required: [{ title: '背诵全文', description: '背诵并默写《陋室铭》全文', targetObjective: 'obj1', estimatedTime: 15 }],
      optional: [{ title: '仿写', description: '以"____铭"为题，仿写一篇托物言志的小短文', targetObjective: 'obj3', estimatedTime: 20 }],
      designIntent: '',
      differentiationNote: '',
    },
    boardDesign: { layout: '陋室不陋——托物言志', keyElements: [], structureLogic: '' },
    reflection: { targetAchievement: '', evidenceSources: [], improvementMeasures: [], notableObservations: '' },
    alignmentMatrix: [],
    difficultyDesign: {
      targetDifficulty: '理解"何陋之有"反诘句式的深层含义——这不是辩解，而是自信与超然的宣言。',
      educationalValue: '这一困难是通向作者精神世界的钥匙。',
      zpdAlignment: '',
      meaninglessObstacles: [],
      motivationStrategy: '',
      autonomySupport: '',
      competenceScaffold: '',
      relatednessConnection: '',
      difficultyFirst: '先让学生自己读文言文原文、试着翻译理解，遇到困惑后再提供注释帮助。',
      processPreservation: '',
      abstractionProtection: '不过度使用动画或配图——文言文的留白和想象力本身就是重要的审美体验。',
    },
    aiRoleDefinition: {
      asDifficultyDesigner: '', asMotivationEnhancer: '', asObstacleRemover: '',
      coreBoundary: 'AI不能替代学生亲身经历"困惑—拼剪尝试—发现关系—推导公式"的思考过程。',
    },
  },
];

export default examples;
