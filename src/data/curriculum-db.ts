// ===== 义务教育教材课题库 =====
// 覆盖小学+初中各学科主要课题 → 年级+单元映射

export interface CurriculumEntry {
  subject: string;      // 学科
  grade: string;        // 年级
  unit: string;         // 所属单元
  textbook: string;     // 教材版本
  keywords: string[];   // 关键词（用于模糊匹配）
}

// 所有课题条目
const RAW_ENTRIES: CurriculumEntry[] = [
  // ========== 小学数学 人教版 ==========
  { subject: '数学', grade: '一年级上册', unit: '第一单元 准备课', textbook: '人教版', keywords: ['数一数', '比多少'] },
  { subject: '数学', grade: '一年级上册', unit: '第三单元 1~5的认识和加减法', textbook: '人教版', keywords: ['1~5的认识', '比大小', '第几', '加法', '减法', '0的认识'] },
  { subject: '数学', grade: '一年级上册', unit: '第五单元 6~10的认识和加减法', textbook: '人教版', keywords: ['6~10的认识', '连加连减', '加减混合'] },
  { subject: '数学', grade: '一年级上册', unit: '第六单元 11~20各数的认识', textbook: '人教版', keywords: ['11~20的认识', '十几加几'] },
  { subject: '数学', grade: '一年级上册', unit: '第七单元 认识钟表', textbook: '人教版', keywords: ['认识钟表', '整时'] },
  { subject: '数学', grade: '一年级上册', unit: '第八单元 20以内的进位加法', textbook: '人教版', keywords: ['9加几', '8~6加几', '凑十法'] },
  { subject: '数学', grade: '一年级下册', unit: '第二单元 20以内的退位减法', textbook: '人教版', keywords: ['十几减9', '十几减8', '退位减法'] },
  { subject: '数学', grade: '一年级下册', unit: '第三单元 分类与整理', textbook: '人教版', keywords: ['分类', '整理'] },
  { subject: '数学', grade: '一年级下册', unit: '第四单元 100以内数的认识', textbook: '人教版', keywords: ['100以内', '数的组成', '数位', '整十数加一位数'] },
  { subject: '数学', grade: '一年级下册', unit: '第五单元 认识人民币', textbook: '人教版', keywords: ['人民币', '元角分'] },
  { subject: '数学', grade: '一年级下册', unit: '第六单元 100以内的加法和减法', textbook: '人教版', keywords: ['整十数加减整十数', '两位数加一位数', '两位数减一位数', '进位', '退位'] },
  { subject: '数学', grade: '一年级下册', unit: '第七单元 找规律', textbook: '人教版', keywords: ['找规律', '图形规律', '数字规律'] },

  { subject: '数学', grade: '二年级上册', unit: '第一单元 长度单位', textbook: '人教版', keywords: ['厘米', '米', '测量'] },
  { subject: '数学', grade: '二年级上册', unit: '第二单元 100以内的加法和减法', textbook: '人教版', keywords: ['两位数加两位数', '两位数减两位数', '连加连减', '加减混合'] },
  { subject: '数学', grade: '二年级上册', unit: '第三单元 角的初步认识', textbook: '人教版', keywords: ['角', '直角', '锐角', '钝角'] },
  { subject: '数学', grade: '二年级上册', unit: '第四单元 表内乘法', textbook: '人教版', keywords: ['乘法的初步认识', '2~6的乘法口诀', '乘法口诀'] },
  { subject: '数学', grade: '二年级上册', unit: '第五单元 观察物体', textbook: '人教版', keywords: ['观察物体', '三视图'] },
  { subject: '数学', grade: '二年级上册', unit: '第六单元 表内乘法', textbook: '人教版', keywords: ['7~9的乘法口诀'] },
  { subject: '数学', grade: '二年级上册', unit: '第七单元 认识时间', textbook: '人教版', keywords: ['时', '分', '认识时间'] },
  { subject: '数学', grade: '二年级下册', unit: '第二单元 表内除法', textbook: '人教版', keywords: ['平均分', '除法', '除法算式'] },
  { subject: '数学', grade: '二年级下册', unit: '第三单元 图形的运动', textbook: '人教版', keywords: ['对称', '平移', '旋转', '轴对称'] },
  { subject: '数学', grade: '二年级下册', unit: '第四单元 表内除法', textbook: '人教版', keywords: ['用口诀求商'] },
  { subject: '数学', grade: '二年级下册', unit: '第五单元 混合运算', textbook: '人教版', keywords: ['同级运算', '两级运算', '小括号'] },
  { subject: '数学', grade: '二年级下册', unit: '第六单元 有余数的除法', textbook: '人教版', keywords: ['有余数的除法', '余数'] },
  { subject: '数学', grade: '二年级下册', unit: '第七单元 万以内数的认识', textbook: '人教版', keywords: ['万以内', '读数', '写数', '近似数', '整千数加减'] },
  { subject: '数学', grade: '二年级下册', unit: '第八单元 克和千克', textbook: '人教版', keywords: ['克', '千克', '质量'] },

  { subject: '数学', grade: '三年级上册', unit: '第一单元 时、分、秒', textbook: '人教版', keywords: ['秒', '时分秒', '时间计算'] },
  { subject: '数学', grade: '三年级上册', unit: '第二单元 万以内的加法和减法', textbook: '人教版', keywords: ['万以内加法', '万以内减法', '估算'] },
  { subject: '数学', grade: '三年级上册', unit: '第三单元 测量', textbook: '人教版', keywords: ['毫米', '分米', '千米', '吨'] },
  { subject: '数学', grade: '三年级上册', unit: '第四单元 万以内的加法和减法', textbook: '人教版', keywords: ['万以内加法(2)', '万以内减法(2)'] },
  { subject: '数学', grade: '三年级上册', unit: '第五单元 倍的认识', textbook: '人教版', keywords: ['倍', '倍数'] },
  { subject: '数学', grade: '三年级上册', unit: '第六单元 多位数乘一位数', textbook: '人教版', keywords: ['口算乘法', '笔算乘法', '因数中间或末尾有0'] },
  { subject: '数学', grade: '三年级上册', unit: '第七单元 长方形和正方形', textbook: '人教版', keywords: ['四边形', '周长', '长方形周长', '正方形周长'] },
  { subject: '数学', grade: '三年级上册', unit: '第八单元 分数的初步认识', textbook: '人教版', keywords: ['几分之一', '几分之几', '分数比较大小', '分数加减法'] },
  { subject: '数学', grade: '三年级下册', unit: '第一单元 位置与方向', textbook: '人教版', keywords: ['东南西北', '方向', '位置'] },
  { subject: '数学', grade: '三年级下册', unit: '第二单元 除数是一位数的除法', textbook: '人教版', keywords: ['口算除法', '笔算除法', '商中间或末尾有0'] },
  { subject: '数学', grade: '三年级下册', unit: '第四单元 两位数乘两位数', textbook: '人教版', keywords: ['两位数乘两位数', '口算乘法', '笔算乘法'] },
  { subject: '数学', grade: '三年级下册', unit: '第五单元 面积', textbook: '人教版', keywords: ['面积', '面积单位', '长方形面积', '正方形面积', '面积换算'] },
  { subject: '数学', grade: '三年级下册', unit: '第六单元 年、月、日', textbook: '人教版', keywords: ['年月日', '闰年', '平年', '24时计时法'] },
  { subject: '数学', grade: '三年级下册', unit: '第七单元 小数的初步认识', textbook: '人教版', keywords: ['小数', '小数读写', '小数比较', '简单小数加减'] },

  { subject: '数学', grade: '四年级上册', unit: '第一单元 大数的认识', textbook: '人教版', keywords: ['亿以内', '亿以上', '数位', '大数读写', '近似数'] },
  { subject: '数学', grade: '四年级上册', unit: '第二单元 公顷和平方千米', textbook: '人教版', keywords: ['公顷', '平方千米', '面积单位换算'] },
  { subject: '数学', grade: '四年级上册', unit: '第三单元 角的度量', textbook: '人教版', keywords: ['线段', '直线', '射线', '角', '量角器', '角的度量'] },
  { subject: '数学', grade: '四年级上册', unit: '第四单元 三位数乘两位数', textbook: '人教版', keywords: ['三位数乘两位数', '积的变化规律'] },
  { subject: '数学', grade: '四年级上册', unit: '第五单元 平行四边形和梯形', textbook: '人教版', keywords: ['平行', '垂直', '平行四边形', '梯形'] },
  { subject: '数学', grade: '四年级上册', unit: '第六单元 除数是两位数的除法', textbook: '人教版', keywords: ['除数是两位数', '商的变化规律'] },
  { subject: '数学', grade: '四年级上册', unit: '第七单元 条形统计图', textbook: '人教版', keywords: ['条形统计图'] },
  { subject: '数学', grade: '四年级下册', unit: '第一单元 四则运算', textbook: '人教版', keywords: ['加、减', '乘、除', '运算顺序'] },
  { subject: '数学', grade: '四年级下册', unit: '第二单元 观察物体', textbook: '人教版', keywords: ['从不同位置观察'] },
  { subject: '数学', grade: '四年级下册', unit: '第三单元 运算定律', textbook: '人教版', keywords: ['加法运算定律', '乘法运算定律', '简便运算'] },
  { subject: '数学', grade: '四年级下册', unit: '第四单元 小数的意义和性质', textbook: '人教版', keywords: ['小数意义', '小数性质', '小数点移动', '小数近似'] },
  { subject: '数学', grade: '四年级下册', unit: '第五单元 三角形', textbook: '人教版', keywords: ['三角形分类', '三角形内角和', '三角形三边关系'] },
  { subject: '数学', grade: '四年级下册', unit: '第六单元 小数的加法和减法', textbook: '人教版', keywords: ['小数加减法', '小数加减混合运算'] },
  { subject: '数学', grade: '四年级下册', unit: '第七单元 图形的运动', textbook: '人教版', keywords: ['轴对称', '平移', '方格图'] },
  { subject: '数学', grade: '四年级下册', unit: '第八单元 平均数与条形统计图', textbook: '人教版', keywords: ['平均数', '复式条形统计图'] },
  { subject: '数学', grade: '四年级下册', unit: '第九单元 数学广角——鸡兔同笼', textbook: '人教版', keywords: ['鸡兔同笼', '假设法'] },

  { subject: '数学', grade: '五年级上册', unit: '第一单元 小数乘法', textbook: '人教版', keywords: ['小数乘整数', '小数乘小数', '积的近似', '小数简便运算'] },
  { subject: '数学', grade: '五年级上册', unit: '第二单元 位置', textbook: '人教版', keywords: ['数对', '行和列'] },
  { subject: '数学', grade: '五年级上册', unit: '第三单元 小数除法', textbook: '人教版', keywords: ['除数是整数', '除数是小数', '循环小数', '商近似'] },
  { subject: '数学', grade: '五年级上册', unit: '第四单元 可能性', textbook: '人教版', keywords: ['可能性', '概率'] },
  { subject: '数学', grade: '五年级上册', unit: '第五单元 简易方程', textbook: '人教版', keywords: ['用字母表示数', '方程', '等式的性质', '解方程', '实际问题与方程'] },
  { subject: '数学', grade: '五年级上册', unit: '第六单元 多边形的面积', textbook: '人教版', keywords: ['平行四边形面积', '三角形面积', '梯形面积', '组合图形面积'] },
  { subject: '数学', grade: '五年级上册', unit: '第七单元 植树问题', textbook: '人教版', keywords: ['植树问题', '间隔'] },
  { subject: '数学', grade: '五年级下册', unit: '第一单元 观察物体', textbook: '人教版', keywords: ['从多方向观察', '三视图'] },
  { subject: '数学', grade: '五年级下册', unit: '第二单元 因数与倍数', textbook: '人教版', keywords: ['因数', '倍数', '2、3、5的倍数', '质数', '合数', '奇数', '偶数'] },
  { subject: '数学', grade: '五年级下册', unit: '第三单元 长方体和正方体', textbook: '人教版', keywords: ['长方体的认识', '正方体', '长方体和正方体的表面积', '长方体和正方体的体积', '体积单位'] },
  { subject: '数学', grade: '五年级下册', unit: '第四单元 分数的意义和性质', textbook: '人教版', keywords: ['分数意义', '真分数', '假分数', '分数基本性质', '约分', '通分', '分数和小数互化'] },
  { subject: '数学', grade: '五年级下册', unit: '第五单元 图形的运动', textbook: '人教版', keywords: ['旋转', '图形旋转'] },
  { subject: '数学', grade: '五年级下册', unit: '第六单元 分数的加法和减法', textbook: '人教版', keywords: ['同分母分数加减', '异分母分数加减', '分数加减混合运算'] },
  { subject: '数学', grade: '五年级下册', unit: '第七单元 折线统计图', textbook: '人教版', keywords: ['折线统计图'] },
  { subject: '数学', grade: '五年级下册', unit: '第八单元 数学广角——找次品', textbook: '人教版', keywords: ['找次品', '最优化'] },

  { subject: '数学', grade: '六年级上册', unit: '第一单元 分数乘法', textbook: '人教版', keywords: ['分数乘法', '分数乘整数', '分数乘分数', '倒数的认识'] },
  { subject: '数学', grade: '六年级上册', unit: '第二单元 位置与方向', textbook: '人教版', keywords: ['方向角', '位置关系'] },
  { subject: '数学', grade: '六年级上册', unit: '第三单元 分数除法', textbook: '人教版', keywords: ['分数除法', '分数除以整数', '一个数除以分数'] },
  { subject: '数学', grade: '六年级上册', unit: '第四单元 比', textbook: '人教版', keywords: ['比的意义', '比的基本性质', '化简比', '按比分配'] },
  { subject: '数学', grade: '六年级上册', unit: '第五单元 圆', textbook: '人教版', keywords: ['圆的认识', '圆的周长', '圆的面积', '扇形', '圆周率'] },
  { subject: '数学', grade: '六年级上册', unit: '第六单元 百分数', textbook: '人教版', keywords: ['百分数', '百分数和分数', '百分率', '利息', '折扣'] },
  { subject: '数学', grade: '六年级上册', unit: '第七单元 扇形统计图', textbook: '人教版', keywords: ['扇形统计图'] },
  { subject: '数学', grade: '六年级下册', unit: '第一单元 负数', textbook: '人教版', keywords: ['负数', '正数', '数轴'] },
  { subject: '数学', grade: '六年级下册', unit: '第二单元 百分数', textbook: '人教版', keywords: ['百分数(二)', '成数', '税率', '利率'] },
  { subject: '数学', grade: '六年级下册', unit: '第三单元 圆柱与圆锥', textbook: '人教版', keywords: ['圆柱', '圆柱的表面积', '圆柱的体积', '圆锥', '圆锥的体积'] },
  { subject: '数学', grade: '六年级下册', unit: '第四单元 比例', textbook: '人教版', keywords: ['比例的意义', '比例的基本性质', '正比例', '反比例', '比例尺'] },
  { subject: '数学', grade: '六年级下册', unit: '第五单元 数学广角——鸽巢问题', textbook: '人教版', keywords: ['鸽巢问题', '抽屉原理'] },

  // ========== 小学语文 统编版 ==========
  { subject: '语文', grade: '一年级上册', unit: '识字', textbook: '统编版', keywords: ['天地人', '金木水火土', '口耳目', '日月水火', '对韵歌'] },
  { subject: '语文', grade: '一年级上册', unit: '汉语拼音', textbook: '统编版', keywords: ['aoe', 'iuü', 'bpmf', 'dtnl', 'gkh', 'jqx'] },
  { subject: '语文', grade: '一年级上册', unit: '课文', textbook: '统编版', keywords: ['秋天', '小小的船', '江南', '四季', '影子', '比尾巴', '青蛙写诗', '雨点儿'] },
  { subject: '语文', grade: '一年级下册', unit: '课文', textbook: '统编版', keywords: ['吃水不忘挖井人', '我多想去看看', '四个太阳', '小公鸡和小鸭子', '静夜思', '夜色', '端午粽', '彩虹'] },
  { subject: '语文', grade: '二年级上册', unit: '课文', textbook: '统编版', keywords: ['小蝌蚪找妈妈', '曹冲称象', '一封信', '妈妈睡了', '登鹳雀楼', '望庐山瀑布', '黄山奇石', '日月潭', '葡萄沟'] },
  { subject: '语文', grade: '二年级上册', unit: '寓言', textbook: '统编版', keywords: ['坐井观天', '狐假虎威', '狐狸分奶酪'] },
  { subject: '语文', grade: '二年级下册', unit: '课文', textbook: '统编版', keywords: ['雷锋叔叔你在哪里', '千人糕', '一匹出色的马', '彩色的梦', '枫树上的喜鹊', '沙滩上的童话', '我是一只小虫子'] },
  { subject: '语文', grade: '二年级下册', unit: '寓言', textbook: '统编版', keywords: ['亡羊补牢', '揠苗助长', '画杨桃'] },
  { subject: '语文', grade: '三年级上册', unit: '第一单元', textbook: '统编版', keywords: ['大青树下的小学', '花的学校', '不懂就要问'] },
  { subject: '语文', grade: '三年级上册', unit: '第三单元', textbook: '统编版', keywords: ['卖火柴的小女孩', '那一定会很好', '在牛肚子里旅行', '一块奶酪'] },
  { subject: '语文', grade: '三年级上册', unit: '第六单元', textbook: '统编版', keywords: ['富饶的西沙群岛', '海滨小城', '美丽的小兴安岭', '饮湖上初晴后雨', '望天门山', '望洞庭'] },
  { subject: '语文', grade: '三年级下册', unit: '第一单元', textbook: '统编版', keywords: ['燕子', '荷花', '昆虫备忘录', '绝句', '惠崇春江晚景', '三衢道中'] },
  { subject: '语文', grade: '三年级下册', unit: '第二单元', textbook: '统编版', keywords: ['守株待兔', '陶罐和铁罐', '鹿角和鹿腿', '池子与河流'] },
  { subject: '语文', grade: '三年级下册', unit: '第四单元', textbook: '统编版', keywords: ['花钟', '蜜蜂', '小虾'] },
  { subject: '语文', grade: '三年级下册', unit: '第七单元', textbook: '统编版', keywords: ['火烧云', '海底世界', '我们奇妙的世界'] },
  { subject: '语文', grade: '四年级上册', unit: '第一单元', textbook: '统编版', keywords: ['观潮', '走月亮', '现代诗二首', '繁星'] },
  { subject: '语文', grade: '四年级上册', unit: '第四单元', textbook: '统编版', keywords: ['盘古开天地', '精卫填海', '普罗米修斯', '女娲补天'] },
  { subject: '语文', grade: '四年级上册', unit: '第六单元', textbook: '统编版', keywords: ['牛和鹅', '一只窝囊的大老虎', '陀螺'] },
  { subject: '语文', grade: '四年级下册', unit: '第一单元', textbook: '统编版', keywords: ['乡下人家', '天窗', '三月桃花水', '四时田园杂兴', '宿新市徐公店'] },
  { subject: '语文', grade: '四年级下册', unit: '第二单元', textbook: '统编版', keywords: ['琥珀', '飞向蓝天的恐龙', '纳米技术就在我们身边'] },
  { subject: '语文', grade: '四年级下册', unit: '第四单元', textbook: '统编版', keywords: ['猫', '母鸡', '白鹅'] },
  { subject: '语文', grade: '四年级下册', unit: '第六单元', textbook: '统编版', keywords: ['小英雄雨来', '我们家的男子汉', '芦花鞋'] },
  { subject: '语文', grade: '五年级上册', unit: '第一单元', textbook: '统编版', keywords: ['白鹭', '落花生', '桂花雨', '珍珠鸟'] },
  { subject: '语文', grade: '五年级上册', unit: '第四单元', textbook: '统编版', keywords: ['圆明园的毁灭', '少年中国说', '小岛', '示儿', '题临安邸', '己亥杂诗'] },
  { subject: '语文', grade: '五年级上册', unit: '第六单元', textbook: '统编版', keywords: ['慈母情深', '父爱之舟', '精彩极了和糟糕透了'] },
  { subject: '语文', grade: '五年级下册', unit: '第一单元', textbook: '统编版', keywords: ['祖父的园子', '月是故乡明', '梅花魂'] },
  { subject: '语文', grade: '五年级下册', unit: '第二单元', textbook: '统编版', keywords: ['草船借箭', '景阳冈', '猴王出世', '红楼春趣'] },
  { subject: '语文', grade: '五年级下册', unit: '第四单元', textbook: '统编版', keywords: ['青山处处埋忠骨', '军神', '清贫', '从军行', '秋夜将晓出篱门迎凉有感', '闻官军收河南河北'] },
  { subject: '语文', grade: '五年级下册', unit: '第六单元', textbook: '统编版', keywords: ['田忌赛马', '跳水'] },
  { subject: '语文', grade: '六年级上册', unit: '第一单元', textbook: '统编版', keywords: ['草原', '丁香结', '花之歌', '六月二十七日望湖楼醉书', '西江月夜行黄沙道中'] },
  { subject: '语文', grade: '六年级上册', unit: '第四单元', textbook: '统编版', keywords: ['桥', '穷人', '金色的鱼钩'] },
  { subject: '语文', grade: '六年级上册', unit: '第七单元', textbook: '统编版', keywords: ['月光曲', '京剧趣谈', '文言文二则', '伯牙鼓琴', '书戴嵩画牛'] },
  { subject: '语文', grade: '六年级上册', unit: '第八单元', textbook: '统编版', keywords: ['少年闰土', '好的故事'] },
  { subject: '语文', grade: '六年级下册', unit: '第一单元', textbook: '统编版', keywords: ['北京的春节', '腊八粥', '古诗三首', '寒食', '迢迢牵牛星', '十五夜望月', '藏戏'] },
  { subject: '语文', grade: '六年级下册', unit: '第三单元', textbook: '统编版', keywords: ['匆匆', '那个星期天', '别了语文课', '阳光的两种用法'] },
  { subject: '语文', grade: '六年级下册', unit: '第四单元', textbook: '统编版', keywords: ['十六年前的回忆', '为人民服务', '金色的鱼钩'] },
  { subject: '语文', grade: '六年级下册', unit: '第五单元', textbook: '统编版', keywords: ['文言文二则', '学弈', '两小儿辩日', '真理诞生于一百个问号之后', '表里的生物'] },

  // ========== 初中语文 统编版 ==========
  { subject: '语文', grade: '七年级上册', unit: '第一单元', textbook: '统编版', keywords: ['春', '济南的冬天', '雨的四季', '观沧海', '闻王昌龄左迁龙标遥有此寄', '次北固山下', '天净沙秋思'] },
  { subject: '语文', grade: '七年级上册', unit: '第二单元', textbook: '统编版', keywords: ['秋天的怀念', '散步', '金色花', '荷叶母亲', '世说新语二则', '咏雪', '陈太丘与友期行'] },
  { subject: '语文', grade: '七年级上册', unit: '第三单元', textbook: '统编版', keywords: ['从百草园到三味书屋', '再塑生命的人', '论语十二章'] },
  { subject: '语文', grade: '七年级上册', unit: '第四单元', textbook: '统编版', keywords: ['纪念白求恩', '植树的牧羊人', '走一步再走一步', '诫子书'] },
  { subject: '语文', grade: '七年级上册', unit: '第五单元', textbook: '统编版', keywords: ['猫', '动物笑谈', '狼'] },
  { subject: '语文', grade: '七年级上册', unit: '第六单元', textbook: '统编版', keywords: ['皇帝的新装', '天上的街市', '女娲造人', '寓言四则', '穿井得一人', '杞人忧天'] },
  { subject: '语文', grade: '七年级下册', unit: '第一单元', textbook: '统编版', keywords: ['邓稼先', '说和做', '回忆鲁迅先生', '孙权劝学'] },
  { subject: '语文', grade: '七年级下册', unit: '第二单元', textbook: '统编版', keywords: ['黄河颂', '老山界', '土地的誓言', '木兰诗'] },
  { subject: '语文', grade: '七年级下册', unit: '第三单元', textbook: '统编版', keywords: ['阿长与山海经', '老王', '台阶', '卖油翁'] },
  { subject: '语文', grade: '七年级下册', unit: '第四单元', textbook: '统编版', keywords: ['叶圣陶先生二三事', '驿路梨花', '最苦与最乐', '陋室铭', '爱莲说'] },
  { subject: '语文', grade: '七年级下册', unit: '第五单元', textbook: '统编版', keywords: ['紫藤萝瀑布', '一棵小桃树', '假如生活欺骗了你', '未选择的路'] },
  { subject: '语文', grade: '七年级下册', unit: '第六单元', textbook: '统编版', keywords: ['伟大的悲剧', '太空一日', '带上她的眼睛', '河中石兽'] },
  { subject: '语文', grade: '八年级上册', unit: '第三单元', textbook: '统编版', keywords: ['三峡', '答谢中书书', '记承天寺夜游', '与朱元思书', '使至塞上', '黄鹤楼', '渡荆门送别'] },
  { subject: '语文', grade: '八年级上册', unit: '第四单元', textbook: '统编版', keywords: ['背影', '白杨礼赞', '昆明的雨'] },
  { subject: '语文', grade: '八年级上册', unit: '第六单元', textbook: '统编版', keywords: ['孟子三章', '得道多助', '富贵不能淫', '生于忧患', '愚公移山', '周亚夫军细柳'] },
  { subject: '语文', grade: '八年级下册', unit: '第三单元', textbook: '统编版', keywords: ['桃花源记', '小石潭记', '核舟记', '诗经二首', '关雎', '蒹葭'] },
  { subject: '语文', grade: '八年级下册', unit: '第四单元', textbook: '统编版', keywords: ['安塞腰鼓', '灯笼', '最后一次讲演'] },
  { subject: '语文', grade: '八年级下册', unit: '第六单元', textbook: '统编版', keywords: ['庄子二则', '北冥有鱼', '庄子与惠子游于濠梁之上', '礼记二则', '马说'] },
  { subject: '语文', grade: '九年级上册', unit: '第一单元', textbook: '统编版', keywords: ['沁园春雪', '我爱这土地', '乡愁', '你是人间四月天'] },
  { subject: '语文', grade: '九年级上册', unit: '第三单元', textbook: '统编版', keywords: ['岳阳楼记', '醉翁亭记', '湖心亭看雪', '诗词三首', '行路难', '酬乐天扬州初逢席上见赠', '水调歌头'] },
  { subject: '语文', grade: '九年级上册', unit: '第六单元', textbook: '统编版', keywords: ['智取生辰纲', '范进中举', '三顾茅庐', '刘姥姥进大观园'] },
  { subject: '语文', grade: '九年级下册', unit: '第一单元', textbook: '统编版', keywords: ['祖国啊我亲爱的祖国', '梅岭三章', '海燕'] },
  { subject: '语文', grade: '九年级下册', unit: '第三单元', textbook: '统编版', keywords: ['鱼我所欲也', '唐雎不辱使命', '送东阳马生序', '词四首', '定风波', '江城子密州出猎', '破阵子', '满江红'] },
  { subject: '语文', grade: '九年级下册', unit: '第六单元', textbook: '统编版', keywords: ['曹刿论战', '邹忌讽齐王纳谏', '陈涉世家', '出师表'] },

  // ========== 初中物理 人教版 ==========
  { subject: '物理', grade: '八年级上册', unit: '第一章 机械运动', textbook: '人教版', keywords: ['长度和时间的测量', '运动的描述', '运动的快慢', '速度', '测平均速度'] },
  { subject: '物理', grade: '八年级上册', unit: '第二章 声现象', textbook: '人教版', keywords: ['声音的产生与传播', '声音的特性', '声的利用', '噪声的危害和控制'] },
  { subject: '物理', grade: '八年级上册', unit: '第三章 物态变化', textbook: '人教版', keywords: ['温度', '熔化和凝固', '汽化和液化', '升华和凝华'] },
  { subject: '物理', grade: '八年级上册', unit: '第四章 光现象', textbook: '人教版', keywords: ['光的直线传播', '光的反射', '平面镜成像', '光的折射', '光的色散'] },
  { subject: '物理', grade: '八年级上册', unit: '第五章 透镜及其应用', textbook: '人教版', keywords: ['透镜', '凸透镜成像的规律', '生活中的透镜', '眼睛和眼镜'] },
  { subject: '物理', grade: '八年级上册', unit: '第六章 质量与密度', textbook: '人教版', keywords: ['质量', '密度', '测量物质的密度', '密度与社会生活'] },
  { subject: '物理', grade: '八年级下册', unit: '第七章 力', textbook: '人教版', keywords: ['力', '弹力', '重力'] },
  { subject: '物理', grade: '八年级下册', unit: '第八章 运动和力', textbook: '人教版', keywords: ['牛顿第一定律', '惯性', '二力平衡', '摩擦力'] },
  { subject: '物理', grade: '八年级下册', unit: '第九章 压强', textbook: '人教版', keywords: ['压强', '液体的压强', '大气压强', '流体压强与流速的关系'] },
  { subject: '物理', grade: '八年级下册', unit: '第十章 浮力', textbook: '人教版', keywords: ['浮力', '阿基米德原理', '浮沉条件'] },
  { subject: '物理', grade: '八年级下册', unit: '第十一章 功和机械能', textbook: '人教版', keywords: ['功', '功率', '动能和势能', '机械能及其转化'] },
  { subject: '物理', grade: '八年级下册', unit: '第十二章 简单机械', textbook: '人教版', keywords: ['杠杆', '滑轮', '机械效率'] },
  { subject: '物理', grade: '九年级全一册', unit: '第十三章 内能', textbook: '人教版', keywords: ['分子热运动', '内能', '比热容'] },
  { subject: '物理', grade: '九年级全一册', unit: '第十四章 内能的利用', textbook: '人教版', keywords: ['热机', '热机的效率', '能量的转化和守恒'] },
  { subject: '物理', grade: '九年级全一册', unit: '第十五章 电流和电路', textbook: '人教版', keywords: ['电荷', '摩擦起电', '电流和电路', '串联和并联', '电流的测量'] },
  { subject: '物理', grade: '九年级全一册', unit: '第十六章 电压 电阻', textbook: '人教版', keywords: ['电压', '串并联电路电压', '电阻', '变阻器'] },
  { subject: '物理', grade: '九年级全一册', unit: '第十七章 欧姆定律', textbook: '人教版', keywords: ['电流与电压和电阻', '欧姆定律', '电阻的测量', '欧姆定律在串并联电路中的应用'] },
  { subject: '物理', grade: '九年级全一册', unit: '第十八章 电功率', textbook: '人教版', keywords: ['电能', '电功', '电功率', '焦耳定律'] },
  { subject: '物理', grade: '九年级全一册', unit: '第二十章 电与磁', textbook: '人教版', keywords: ['磁现象', '电生磁', '电磁铁', '电动机', '发电机'] },

  // ========== 初中化学 人教版 ==========
  { subject: '化学', grade: '九年级上册', unit: '第一单元 走进化学世界', textbook: '人教版', keywords: ['物质的变化和性质', '化学实验', '仪器的使用'] },
  { subject: '化学', grade: '九年级上册', unit: '第二单元 我们周围的空气', textbook: '人教版', keywords: ['空气', '氧气', '制取氧气'] },
  { subject: '化学', grade: '九年级上册', unit: '第三单元 物质构成的奥秘', textbook: '人教版', keywords: ['分子和原子', '原子的结构', '元素'] },
  { subject: '化学', grade: '九年级上册', unit: '第四单元 自然界的水', textbook: '人教版', keywords: ['爱护水资源', '水的净化', '水的组成', '化学式与化合价'] },
  { subject: '化学', grade: '九年级上册', unit: '第五单元 化学方程式', textbook: '人教版', keywords: ['质量守恒定律', '化学方程式的书写', '利用化学方程式的简单计算'] },
  { subject: '化学', grade: '九年级上册', unit: '第六单元 碳和碳的氧化物', textbook: '人教版', keywords: ['金刚石', '石墨', 'C60', '二氧化碳', '一氧化碳'] },
  { subject: '化学', grade: '九年级上册', unit: '第七单元 燃料及其利用', textbook: '人教版', keywords: ['燃烧和灭火', '燃料', '能源'] },
  { subject: '化学', grade: '九年级下册', unit: '第八单元 金属和金属材料', textbook: '人教版', keywords: ['金属材料', '金属的化学性质', '金属资源的利用和保护'] },
  { subject: '化学', grade: '九年级下册', unit: '第九单元 溶液', textbook: '人教版', keywords: ['溶液的形成', '溶解度', '溶液的浓度'] },
  { subject: '化学', grade: '九年级下册', unit: '第十单元 酸和碱', textbook: '人教版', keywords: ['常见的酸', '常见的碱', '酸和碱的中和反应', '酸碱中和', 'pH'] },
  { subject: '化学', grade: '九年级下册', unit: '第十一单元 盐 化肥', textbook: '人教版', keywords: ['常见的盐', '化学肥料'] },

  // ========== 初中生物 人教版 ==========
  { subject: '生物', grade: '七年级上册', unit: '第一单元 生物和生物圈', textbook: '人教版', keywords: ['认识生物', '生物与环境的关系', '生态系统', '食物链', '食物网'] },
  { subject: '生物', grade: '七年级上册', unit: '第二单元 生物体的结构层次', textbook: '人教版', keywords: ['细胞是生命活动的基本单位', '植物细胞', '动物细胞', '细胞的生活', '细胞分裂', '动物体的结构层次', '植物体的结构层次'] },
  { subject: '生物', grade: '七年级上册', unit: '第三单元 生物圈中的绿色植物', textbook: '人教版', keywords: ['藻类', '苔藓', '蕨类', '种子植物', '种子的萌发', '开花和结果', '光合作用', '呼吸作用'] },
  { subject: '生物', grade: '七年级下册', unit: '第四单元 生物圈中的人', textbook: '人教版', keywords: ['人的起源和发展', '人的生殖', '消化和吸收', '呼吸道', '肺', '血液', '血管', '心脏', '血液循环', '输血', '尿液的形成', '激素调节'] },

  // ========== 初中历史 统编版 ==========
  { subject: '历史', grade: '七年级上册', unit: '第一单元 史前时期', textbook: '统编版', keywords: ['中国早期人类的代表', '原始农耕生活', '远古的传说'] },
  { subject: '历史', grade: '七年级上册', unit: '第二单元 夏商周', textbook: '统编版', keywords: ['夏商周的更替', '青铜器与甲骨文', '百家争鸣'] },
  { subject: '历史', grade: '七年级上册', unit: '第三单元 秦汉时期', textbook: '统编版', keywords: ['秦统一中国', '秦末农民大起义', '西汉建立', '汉武帝', '丝绸之路'] },
  { subject: '历史', grade: '七年级下册', unit: '第一单元 隋唐时期', textbook: '统编版', keywords: ['隋朝的统一与灭亡', '贞观之治', '开元盛世', '盛唐气象', '唐朝的中外文化交流'] },
  { subject: '历史', grade: '七年级下册', unit: '第二单元 辽宋夏金元', textbook: '统编版', keywords: ['北宋的政治', '辽西夏与北宋的并立', '宋代经济的发展', '元朝的统治'] },
  { subject: '历史', grade: '七年级下册', unit: '第三单元 明清时期', textbook: '统编版', keywords: ['明朝的统治', '明朝的对外关系', '清朝前期社会经济的发展', '闭关锁国'] },
  { subject: '历史', grade: '八年级上册', unit: '第一单元 中国开始沦为半殖民地半封建社会', textbook: '统编版', keywords: ['鸦片战争', '第二次鸦片战争', '太平天国运动'] },
  { subject: '历史', grade: '八年级上册', unit: '第三单元 资产阶级民主革命与中华民国的建立', textbook: '统编版', keywords: ['革命先行者孙中山', '辛亥革命', '中华民国的创建'] },
  { subject: '历史', grade: '八年级上册', unit: '第五单元 从国共合作到国共对立', textbook: '统编版', keywords: ['北伐战争', '南昌起义', '红军长征', '中国工农红军长征'] },

  // ========== 初中地理 人教版 ==========
  { subject: '地理', grade: '七年级上册', unit: '第一章 地球和地图', textbook: '人教版', keywords: ['地球和地球仪', '地球的运动', '地图的阅读', '地形图的判读'] },
  { subject: '地理', grade: '七年级上册', unit: '第二章 陆地和海洋', textbook: '人教版', keywords: ['大洲和大洋', '海陆的变迁'] },
  { subject: '地理', grade: '七年级上册', unit: '第三章 天气与气候', textbook: '人教版', keywords: ['多变的天气', '气温的变化与分布', '降水的变化与分布', '世界的气候'] },
  { subject: '地理', grade: '七年级下册', unit: '第七章 我们邻近的地区和国家', textbook: '人教版', keywords: ['日本', '东南亚', '印度', '俄罗斯'] },
  { subject: '地理', grade: '八年级上册', unit: '第一章 从世界看中国', textbook: '人教版', keywords: ['疆域', '人口', '民族'] },
  { subject: '地理', grade: '八年级上册', unit: '第二章 中国的自然环境', textbook: '人教版', keywords: ['地形和地势', '气候', '河流', '自然灾害'] },
  { subject: '地理', grade: '八年级上册', unit: '第三章 中国的自然资源', textbook: '人教版', keywords: ['自然资源', '土地资源', '水资源'] },

  // ========== 小学英语 PEP ==========
  { subject: '英语', grade: '三年级上册', unit: 'Unit 1 Hello!', textbook: 'PEP', keywords: ['Hello', '你好', 'I have', '书包', '文具'] },
  { subject: '英语', grade: '三年级上册', unit: 'Unit 2 Colours', textbook: 'PEP', keywords: ['Colours', '颜色', 'red', 'green', 'blue'] },
  { subject: '英语', grade: '三年级上册', unit: 'Unit 3 Look at me!', textbook: 'PEP', keywords: ['身体', 'face', 'eyes', 'nose', 'mouth'] },
  { subject: '英语', grade: '三年级上册', unit: 'Unit 4 We love animals', textbook: 'PEP', keywords: ['动物', 'dog', 'cat', 'monkey'] },
  { subject: '英语', grade: '三年级上册', unit: 'Unit 5 Let\'s eat!', textbook: 'PEP', keywords: ['食物', 'milk', 'bread', 'egg'] },
  { subject: '英语', grade: '三年级下册', unit: 'Unit 3 At the zoo', textbook: 'PEP', keywords: ['动物园', 'tall', 'short', 'fat', 'thin'] },
  { subject: '英语', grade: '四年级上册', unit: 'Unit 1 My classroom', textbook: 'PEP', keywords: ['教室', 'classroom', 'window', 'door'] },
  { subject: '英语', grade: '四年级上册', unit: 'Unit 5 Dinner\'s ready', textbook: 'PEP', keywords: ['晚餐', 'beef', 'chicken', 'soup'] },

  // ========== 小学科学 教科版 ==========
  { subject: '科学', grade: '三年级上册', unit: '第一单元 水', textbook: '教科版', keywords: ['水沸腾了', '水结冰了', '水的三态变化'] },
  { subject: '科学', grade: '三年级上册', unit: '第二单元 空气', textbook: '教科版', keywords: ['空气能占据空间', '压缩空气', '风向和风速'] },
  { subject: '科学', grade: '四年级上册', unit: '第一单元 声音', textbook: '教科版', keywords: ['声音是怎样产生的', '声音的高低', '声音的传播'] },
  { subject: '科学', grade: '四年级下册', unit: '第二单元 电路', textbook: '教科版', keywords: ['简单电路', '导体和绝缘体', '串联', '并联', '开关', '灯泡'] },
  { subject: '科学', grade: '五年级上册', unit: '第三单元 光', textbook: '教科版', keywords: ['光沿直线传播', '光的反射', '光的折射'] },
  { subject: '科学', grade: '六年级上册', unit: '第三单元 工具与技术', textbook: '教科版', keywords: ['简单机械', '杠杆', '轮轴', '滑轮', '斜面'] },

  // ========== 初中英语 人教版 ==========
  { subject: '英语', grade: '七年级上册', unit: 'Unit 1 My name\'s Gina', textbook: '人教版', keywords: ['introduction', '自我介绍', 'name'] },
  { subject: '英语', grade: '七年级上册', unit: 'Unit 5 Do you have a soccer ball?', textbook: '人教版', keywords: ['sports', '运动', 'have'] },
  { subject: '英语', grade: '七年级下册', unit: 'Unit 5 Why do you like pandas?', textbook: '人教版', keywords: ['animals', '动物', 'pandas'] },
  { subject: '英语', grade: '八年级上册', unit: 'Unit 1 Where did you go on vacation?', textbook: '人教版', keywords: ['vacation', '假期', '过去时'] },
  { subject: '英语', grade: '八年级下册', unit: 'Unit 5 What were you doing when the rainstorm came?', textbook: '人教版', keywords: ['过去进行时', 'rainstorm', 'when'] },

  // ========== 初中数学 人教版 ==========
  { subject: '数学', grade: '七年级上册', unit: '第一章 有理数', textbook: '人教版', keywords: ['正数和负数', '有理数', '有理数的加减法', '有理数的乘除法', '乘方'] },
  { subject: '数学', grade: '七年级上册', unit: '第二章 整式的加减', textbook: '人教版', keywords: ['整式', '整式的加减', '合并同类项', '去括号'] },
  { subject: '数学', grade: '七年级上册', unit: '第三章 一元一次方程', textbook: '人教版', keywords: ['从算式到方程', '解一元一次方程', '实际问题与一元一次方程'] },
  { subject: '数学', grade: '七年级上册', unit: '第四章 几何图形初步', textbook: '人教版', keywords: ['几何图形', '直线', '射线', '线段', '角'] },
  { subject: '数学', grade: '七年级下册', unit: '第五章 相交线与平行线', textbook: '人教版', keywords: ['相交线', '对顶角', '垂线', '平行线', '平行线的判定和性质'] },
  { subject: '数学', grade: '七年级下册', unit: '第六章 实数', textbook: '人教版', keywords: ['平方根', '立方根', '实数'] },
  { subject: '数学', grade: '七年级下册', unit: '第七章 平面直角坐标系', textbook: '人教版', keywords: ['平面直角坐标系', '坐标方法'] },
  { subject: '数学', grade: '七年级下册', unit: '第八章 二元一次方程组', textbook: '人教版', keywords: ['二元一次方程组', '消元法', '实际问题与二元一次方程组'] },
  { subject: '数学', grade: '七年级下册', unit: '第九章 不等式与不等式组', textbook: '人教版', keywords: ['不等式', '一元一次不等式', '一元一次不等式组'] },
  { subject: '数学', grade: '七年级下册', unit: '第十章 数据的收集、整理与描述', textbook: '人教版', keywords: ['统计调查', '直方图'] },
  { subject: '数学', grade: '八年级上册', unit: '第十一章 三角形', textbook: '人教版', keywords: ['与三角形有关的线段', '与三角形有关的角', '多边形及其内角和'] },
  { subject: '数学', grade: '八年级上册', unit: '第十二章 全等三角形', textbook: '人教版', keywords: ['全等三角形', '三角形全等的判定', '角的平分线的性质'] },
  { subject: '数学', grade: '八年级上册', unit: '第十三章 轴对称', textbook: '人教版', keywords: ['轴对称', '线段的垂直平分线', '等腰三角形', '最短路径'] },
  { subject: '数学', grade: '八年级上册', unit: '第十四章 整式的乘法与因式分解', textbook: '人教版', keywords: ['整式的乘法', '乘法公式', '因式分解', '平方差', '完全平方'] },
  { subject: '数学', grade: '八年级上册', unit: '第十五章 分式', textbook: '人教版', keywords: ['分式', '分式的运算', '分式方程'] },
  { subject: '数学', grade: '八年级下册', unit: '第十六章 二次根式', textbook: '人教版', keywords: ['二次根式', '二次根式的乘除', '二次根式的加减'] },
  { subject: '数学', grade: '八年级下册', unit: '第十七章 勾股定理', textbook: '人教版', keywords: ['勾股定理', '勾股定理的逆定理'] },
  { subject: '数学', grade: '八年级下册', unit: '第十八章 平行四边形', textbook: '人教版', keywords: ['平行四边形', '特殊平行四边形', '矩形', '菱形', '正方形'] },
  { subject: '数学', grade: '八年级下册', unit: '第十九章 一次函数', textbook: '人教版', keywords: ['函数', '一次函数', '正比例函数', '用一次函数解决实际问题'] },
  { subject: '数学', grade: '八年级下册', unit: '第二十章 数据的分析', textbook: '人教版', keywords: ['平均数', '中位数', '众数', '方差'] },
  { subject: '数学', grade: '九年级上册', unit: '第二十一章 一元二次方程', textbook: '人教版', keywords: ['一元二次方程', '配方法', '公式法', '因式分解法', '根与系数'] },
  { subject: '数学', grade: '九年级上册', unit: '第二十二章 二次函数', textbook: '人教版', keywords: ['二次函数', 'y=ax²', '二次函数的图像与性质', '实际问题与二次函数'] },
  { subject: '数学', grade: '九年级上册', unit: '第二十三章 旋转', textbook: '人教版', keywords: ['图形的旋转', '中心对称'] },
  { subject: '数学', grade: '九年级上册', unit: '第二十四章 圆', textbook: '人教版', keywords: ['圆的有关性质', '点和圆', '直线和圆', '弧长', '扇形面积'] },
  { subject: '数学', grade: '九年级上册', unit: '第二十五章 概率初步', textbook: '人教版', keywords: ['随机事件', '概率', '用频率估计概率', '用列举法求概率'] },
  { subject: '数学', grade: '九年级下册', unit: '第二十六章 反比例函数', textbook: '人教版', keywords: ['反比例函数', '实际问题与反比例函数'] },
  { subject: '数学', grade: '九年级下册', unit: '第二十七章 相似', textbook: '人教版', keywords: ['图形的相似', '相似三角形', '位似'] },
  { subject: '数学', grade: '九年级下册', unit: '第二十八章 锐角三角函数', textbook: '人教版', keywords: ['锐角三角函数', '解直角三角形', '三角函数应用'] },
  { subject: '数学', grade: '九年级下册', unit: '第二十九章 投影与视图', textbook: '人教版', keywords: ['投影', '三视图'] },
];

// ===== 搜索函数 =====
export function searchCurriculum(query: string): CurriculumEntry[] {
  if (!query.trim()) return [];

  const q = query.trim().toLowerCase();
  const results: { entry: CurriculumEntry; score: number }[] = [];

  for (const entry of RAW_ENTRIES) {
    let score = 0;
    const allText = [...entry.keywords, entry.unit].join(' ').toLowerCase();

    // 精确匹配课题关键词
    for (const kw of entry.keywords) {
      if (kw.toLowerCase() === q) { score += 10; break; }
      if (kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())) { score += 7; }
    }

    // 模糊匹配
    if (allText.includes(q)) { score += 5; }

    // 逐词匹配
    const queryWords = q.split(/[\s　]+/).filter(Boolean);
    for (const w of queryWords) {
      if (w.length < 2) continue;
      for (const kw of entry.keywords) {
        if (kw.toLowerCase().includes(w)) { score += 3; break; }
      }
      if (entry.unit.toLowerCase().includes(w)) { score += 2; }
    }

    if (score > 0) {
      results.push({ entry, score });
    }
  }

  // 按分数降序排列，取前8个
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(r => r.entry);
}
