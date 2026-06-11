/**
 * 批量教案生成脚本
 * 遍历课题库 → 逐个调用 DeepSeek API → 输出为 JSON 文件
 *
 * 用法: node scripts/generate-all-plans.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = 'sk-a5d51596c2df45e5b1992f69bf3aa64e';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';
const OUTPUT_DIR = resolve(__dirname, '../public/data/plans');
const PROGRESS_FILE = resolve(__dirname, '../public/data/plans/_progress.json');

// 确保输出目录存在
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

// 读取进度
let completed = new Set();
if (existsSync(PROGRESS_FILE)) {
  completed = new Set(JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8')));
}

// ====== 课题列表（600条，覆盖义务教育全学段全学科） ======
const ENTRIES = [
  // ==================== 小学数学 人教版 ====================
  { subject:'小学数学',grade:'一年级上册',unit:'第一单元 准备课',textbook:'人教版',topic:'数一数' },
  { subject:'小学数学',grade:'一年级上册',unit:'第三单元 1~5的认识和加减法',textbook:'人教版',topic:'1~5的认识' },
  { subject:'小学数学',grade:'一年级上册',unit:'第三单元 1~5的认识和加减法',textbook:'人教版',topic:'加法' },
  { subject:'小学数学',grade:'一年级上册',unit:'第三单元 1~5的认识和加减法',textbook:'人教版',topic:'减法' },
  { subject:'小学数学',grade:'一年级上册',unit:'第七单元 认识钟表',textbook:'人教版',topic:'认识钟表' },
  { subject:'小学数学',grade:'一年级上册',unit:'第八单元 20以内的进位加法',textbook:'人教版',topic:'9加几' },
  { subject:'小学数学',grade:'一年级下册',unit:'第二单元 20以内的退位减法',textbook:'人教版',topic:'十几减9' },
  { subject:'小学数学',grade:'一年级下册',unit:'第三单元 分类与整理',textbook:'人教版',topic:'分类与整理' },
  { subject:'小学数学',grade:'一年级下册',unit:'第五单元 认识人民币',textbook:'人教版',topic:'认识人民币' },
  { subject:'小学数学',grade:'一年级下册',unit:'第六单元 100以内的加法和减法',textbook:'人教版',topic:'整十数加减整十数' },
  { subject:'小学数学',grade:'二年级上册',unit:'第一单元 长度单位',textbook:'人教版',topic:'厘米和米' },
  { subject:'小学数学',grade:'二年级上册',unit:'第三单元 角的初步认识',textbook:'人教版',topic:'角的初步认识' },
  { subject:'小学数学',grade:'二年级上册',unit:'第四单元 表内乘法',textbook:'人教版',topic:'乘法的初步认识' },
  { subject:'小学数学',grade:'二年级上册',unit:'第四单元 表内乘法',textbook:'人教版',topic:'5的乘法口诀' },
  { subject:'小学数学',grade:'二年级下册',unit:'第二单元 表内除法',textbook:'人教版',topic:'平均分' },
  { subject:'小学数学',grade:'二年级下册',unit:'第二单元 表内除法',textbook:'人教版',topic:'除法' },
  { subject:'小学数学',grade:'二年级下册',unit:'第三单元 图形的运动',textbook:'人教版',topic:'轴对称图形' },
  { subject:'小学数学',grade:'二年级下册',unit:'第六单元 有余数的除法',textbook:'人教版',topic:'有余数的除法' },
  { subject:'小学数学',grade:'二年级下册',unit:'第八单元 克和千克',textbook:'人教版',topic:'克和千克' },
  { subject:'小学数学',grade:'三年级上册',unit:'第五单元 倍的认识',textbook:'人教版',topic:'倍的认识' },
  { subject:'小学数学',grade:'三年级上册',unit:'第六单元 多位数乘一位数',textbook:'人教版',topic:'多位数乘一位数' },
  { subject:'小学数学',grade:'三年级上册',unit:'第七单元 长方形和正方形',textbook:'人教版',topic:'长方形和正方形的周长' },
  { subject:'小学数学',grade:'三年级上册',unit:'第八单元 分数的初步认识',textbook:'人教版',topic:'分数的初步认识' },
  { subject:'小学数学',grade:'三年级下册',unit:'第一单元 位置与方向',textbook:'人教版',topic:'认识东南西北' },
  { subject:'小学数学',grade:'三年级下册',unit:'第四单元 两位数乘两位数',textbook:'人教版',topic:'两位数乘两位数' },
  { subject:'小学数学',grade:'三年级下册',unit:'第五单元 面积',textbook:'人教版',topic:'面积和面积单位' },
  { subject:'小学数学',grade:'三年级下册',unit:'第五单元 面积',textbook:'人教版',topic:'长方形和正方形的面积' },
  { subject:'小学数学',grade:'三年级下册',unit:'第七单元 小数的初步认识',textbook:'人教版',topic:'小数的初步认识' },
  { subject:'小学数学',grade:'四年级上册',unit:'第一单元 大数的认识',textbook:'人教版',topic:'亿以内数的认识' },
  { subject:'小学数学',grade:'四年级上册',unit:'第三单元 角的度量',textbook:'人教版',topic:'角的度量' },
  { subject:'小学数学',grade:'四年级上册',unit:'第五单元 平行四边形和梯形',textbook:'人教版',topic:'平行与垂直' },
  { subject:'小学数学',grade:'四年级上册',unit:'第五单元 平行四边形和梯形',textbook:'人教版',topic:'平行四边形和梯形' },
  { subject:'小学数学',grade:'四年级下册',unit:'第三单元 运算定律',textbook:'人教版',topic:'加法运算定律' },
  { subject:'小学数学',grade:'四年级下册',unit:'第三单元 运算定律',textbook:'人教版',topic:'乘法运算定律' },
  { subject:'小学数学',grade:'四年级下册',unit:'第四单元 小数的意义和性质',textbook:'人教版',topic:'小数的意义' },
  { subject:'小学数学',grade:'四年级下册',unit:'第五单元 三角形',textbook:'人教版',topic:'三角形的特性' },
  { subject:'小学数学',grade:'四年级下册',unit:'第五单元 三角形',textbook:'人教版',topic:'三角形内角和' },
  { subject:'小学数学',grade:'四年级下册',unit:'第九单元 数学广角',textbook:'人教版',topic:'鸡兔同笼' },
  { subject:'小学数学',grade:'五年级上册',unit:'第一单元 小数乘法',textbook:'人教版',topic:'小数乘法' },
  { subject:'小学数学',grade:'五年级上册',unit:'第三单元 小数除法',textbook:'人教版',topic:'小数除法' },
  { subject:'小学数学',grade:'五年级上册',unit:'第五单元 简易方程',textbook:'人教版',topic:'用字母表示数' },
  { subject:'小学数学',grade:'五年级上册',unit:'第五单元 简易方程',textbook:'人教版',topic:'解方程' },
  { subject:'小学数学',grade:'五年级上册',unit:'第六单元 多边形的面积',textbook:'人教版',topic:'平行四边形的面积' },
  { subject:'小学数学',grade:'五年级上册',unit:'第六单元 多边形的面积',textbook:'人教版',topic:'三角形的面积' },
  { subject:'小学数学',grade:'五年级上册',unit:'第六单元 多边形的面积',textbook:'人教版',topic:'梯形的面积' },
  { subject:'小学数学',grade:'五年级上册',unit:'第七单元 植树问题',textbook:'人教版',topic:'植树问题' },
  { subject:'小学数学',grade:'五年级下册',unit:'第二单元 因数与倍数',textbook:'人教版',topic:'因数和倍数' },
  { subject:'小学数学',grade:'五年级下册',unit:'第二单元 因数与倍数',textbook:'人教版',topic:'质数和合数' },
  { subject:'小学数学',grade:'五年级下册',unit:'第三单元 长方体和正方体',textbook:'人教版',topic:'长方体和正方体的认识' },
  { subject:'小学数学',grade:'五年级下册',unit:'第三单元 长方体和正方体',textbook:'人教版',topic:'长方体和正方体的表面积' },
  { subject:'小学数学',grade:'五年级下册',unit:'第三单元 长方体和正方体',textbook:'人教版',topic:'长方体和正方体的体积' },
  { subject:'小学数学',grade:'五年级下册',unit:'第四单元 分数的意义和性质',textbook:'人教版',topic:'分数的意义' },
  { subject:'小学数学',grade:'五年级下册',unit:'第四单元 分数的意义和性质',textbook:'人教版',topic:'真分数和假分数' },
  { subject:'小学数学',grade:'五年级下册',unit:'第六单元 分数的加法和减法',textbook:'人教版',topic:'同分母分数加减法' },
  { subject:'小学数学',grade:'六年级上册',unit:'第一单元 分数乘法',textbook:'人教版',topic:'分数乘法' },
  { subject:'小学数学',grade:'六年级上册',unit:'第三单元 分数除法',textbook:'人教版',topic:'分数除法' },
  { subject:'小学数学',grade:'六年级上册',unit:'第四单元 比',textbook:'人教版',topic:'比的意义' },
  { subject:'小学数学',grade:'六年级上册',unit:'第五单元 圆',textbook:'人教版',topic:'圆的认识' },
  { subject:'小学数学',grade:'六年级上册',unit:'第五单元 圆',textbook:'人教版',topic:'圆的周长' },
  { subject:'小学数学',grade:'六年级上册',unit:'第五单元 圆',textbook:'人教版',topic:'圆的面积' },
  { subject:'小学数学',grade:'六年级上册',unit:'第六单元 百分数',textbook:'人教版',topic:'百分数的意义' },
  { subject:'小学数学',grade:'六年级下册',unit:'第一单元 负数',textbook:'人教版',topic:'负数' },
  { subject:'小学数学',grade:'六年级下册',unit:'第三单元 圆柱与圆锥',textbook:'人教版',topic:'圆柱的认识' },
  { subject:'小学数学',grade:'六年级下册',unit:'第三单元 圆柱与圆锥',textbook:'人教版',topic:'圆柱的表面积' },
  { subject:'小学数学',grade:'六年级下册',unit:'第三单元 圆柱与圆锥',textbook:'人教版',topic:'圆锥的体积' },
  { subject:'小学数学',grade:'六年级下册',unit:'第四单元 比例',textbook:'人教版',topic:'比例的意义' },
  { subject:'小学数学',grade:'六年级下册',unit:'第四单元 比例',textbook:'人教版',topic:'正比例和反比例' },

  // ==================== 小学语文 统编版 ====================
  { subject:'小学语文',grade:'一年级上册',unit:'识字',textbook:'统编版',topic:'天地人' },
  { subject:'小学语文',grade:'一年级上册',unit:'汉语拼音',textbook:'统编版',topic:'a o e' },
  { subject:'小学语文',grade:'一年级上册',unit:'课文',textbook:'统编版',topic:'秋天' },
  { subject:'小学语文',grade:'一年级上册',unit:'课文',textbook:'统编版',topic:'小小的船' },
  { subject:'小学语文',grade:'一年级下册',unit:'课文',textbook:'统编版',topic:'静夜思' },
  { subject:'小学语文',grade:'一年级下册',unit:'课文',textbook:'统编版',topic:'小公鸡和小鸭子' },
  { subject:'小学语文',grade:'二年级上册',unit:'课文',textbook:'统编版',topic:'曹冲称象' },
  { subject:'小学语文',grade:'二年级上册',unit:'课文',textbook:'统编版',topic:'登鹳雀楼' },
  { subject:'小学语文',grade:'二年级上册',unit:'课文',textbook:'统编版',topic:'黄山奇石' },
  { subject:'小学语文',grade:'二年级上册',unit:'寓言',textbook:'统编版',topic:'坐井观天' },
  { subject:'小学语文',grade:'二年级下册',unit:'寓言',textbook:'统编版',topic:'亡羊补牢' },
  { subject:'小学语文',grade:'二年级下册',unit:'课文',textbook:'统编版',topic:'雷锋叔叔你在哪里' },
  { subject:'小学语文',grade:'三年级上册',unit:'第一单元',textbook:'统编版',topic:'大青树下的小学' },
  { subject:'小学语文',grade:'三年级上册',unit:'第三单元',textbook:'统编版',topic:'在牛肚子里旅行' },
  { subject:'小学语文',grade:'三年级上册',unit:'第六单元',textbook:'统编版',topic:'富饶的西沙群岛' },
  { subject:'小学语文',grade:'三年级下册',unit:'第二单元',textbook:'统编版',topic:'守株待兔' },
  { subject:'小学语文',grade:'三年级下册',unit:'第四单元',textbook:'统编版',topic:'花钟' },
  { subject:'小学语文',grade:'四年级上册',unit:'第一单元',textbook:'统编版',topic:'观潮' },
  { subject:'小学语文',grade:'四年级上册',unit:'第四单元',textbook:'统编版',topic:'盘古开天地' },
  { subject:'小学语文',grade:'四年级上册',unit:'第四单元',textbook:'统编版',topic:'精卫填海' },
  { subject:'小学语文',grade:'四年级下册',unit:'第四单元',textbook:'统编版',topic:'猫' },
  { subject:'小学语文',grade:'四年级下册',unit:'第四单元',textbook:'统编版',topic:'白鹅' },
  { subject:'小学语文',grade:'五年级上册',unit:'第一单元',textbook:'统编版',topic:'白鹭' },
  { subject:'小学语文',grade:'五年级上册',unit:'第一单元',textbook:'统编版',topic:'落花生' },
  { subject:'小学语文',grade:'五年级上册',unit:'第四单元',textbook:'统编版',topic:'圆明园的毁灭' },
  { subject:'小学语文',grade:'五年级上册',unit:'第六单元',textbook:'统编版',topic:'慈母情深' },
  { subject:'小学语文',grade:'五年级下册',unit:'第二单元',textbook:'统编版',topic:'草船借箭' },
  { subject:'小学语文',grade:'五年级下册',unit:'第二单元',textbook:'统编版',topic:'景阳冈' },
  { subject:'小学语文',grade:'五年级下册',unit:'第四单元',textbook:'统编版',topic:'军神' },
  { subject:'小学语文',grade:'六年级上册',unit:'第一单元',textbook:'统编版',topic:'草原' },
  { subject:'小学语文',grade:'六年级上册',unit:'第四单元',textbook:'统编版',topic:'桥' },
  { subject:'小学语文',grade:'六年级上册',unit:'第七单元',textbook:'统编版',topic:'月光曲' },
  { subject:'小学语文',grade:'六年级上册',unit:'第八单元',textbook:'统编版',topic:'少年闰土' },
  { subject:'小学语文',grade:'六年级下册',unit:'第一单元',textbook:'统编版',topic:'北京的春节' },
  { subject:'小学语文',grade:'六年级下册',unit:'第三单元',textbook:'统编版',topic:'匆匆' },

  // ==================== 初中语文 统编版 ====================
  { subject:'初中语文',grade:'七年级上册',unit:'第一单元',textbook:'统编版',topic:'春' },
  { subject:'初中语文',grade:'七年级上册',unit:'第一单元',textbook:'统编版',topic:'济南的冬天' },
  { subject:'初中语文',grade:'七年级上册',unit:'第三单元',textbook:'统编版',topic:'从百草园到三味书屋' },
  { subject:'初中语文',grade:'七年级上册',unit:'第三单元',textbook:'统编版',topic:'论语十二章' },
  { subject:'初中语文',grade:'七年级上册',unit:'第四单元',textbook:'统编版',topic:'纪念白求恩' },
  { subject:'初中语文',grade:'七年级上册',unit:'第五单元',textbook:'统编版',topic:'狼' },
  { subject:'初中语文',grade:'七年级上册',unit:'第六单元',textbook:'统编版',topic:'皇帝的新装' },
  { subject:'初中语文',grade:'七年级下册',unit:'第一单元',textbook:'统编版',topic:'邓稼先' },
  { subject:'初中语文',grade:'七年级下册',unit:'第二单元',textbook:'统编版',topic:'木兰诗' },
  { subject:'初中语文',grade:'七年级下册',unit:'第三单元',textbook:'统编版',topic:'阿长与山海经' },
  { subject:'初中语文',grade:'七年级下册',unit:'第四单元',textbook:'统编版',topic:'陋室铭' },
  { subject:'初中语文',grade:'七年级下册',unit:'第四单元',textbook:'统编版',topic:'爱莲说' },
  { subject:'初中语文',grade:'七年级下册',unit:'第五单元',textbook:'统编版',topic:'紫藤萝瀑布' },
  { subject:'初中语文',grade:'八年级上册',unit:'第三单元',textbook:'统编版',topic:'三峡' },
  { subject:'初中语文',grade:'八年级上册',unit:'第三单元',textbook:'统编版',topic:'记承天寺夜游' },
  { subject:'初中语文',grade:'八年级上册',unit:'第四单元',textbook:'统编版',topic:'背影' },
  { subject:'初中语文',grade:'八年级上册',unit:'第四单元',textbook:'统编版',topic:'白杨礼赞' },
  { subject:'初中语文',grade:'八年级上册',unit:'第六单元',textbook:'统编版',topic:'愚公移山' },
  { subject:'初中语文',grade:'八年级下册',unit:'第三单元',textbook:'统编版',topic:'桃花源记' },
  { subject:'初中语文',grade:'八年级下册',unit:'第三单元',textbook:'统编版',topic:'小石潭记' },
  { subject:'初中语文',grade:'八年级下册',unit:'第四单元',textbook:'统编版',topic:'最后一次讲演' },
  { subject:'初中语文',grade:'九年级上册',unit:'第三单元',textbook:'统编版',topic:'岳阳楼记' },
  { subject:'初中语文',grade:'九年级上册',unit:'第三单元',textbook:'统编版',topic:'醉翁亭记' },
  { subject:'初中语文',grade:'九年级上册',unit:'第六单元',textbook:'统编版',topic:'智取生辰纲' },
  { subject:'初中语文',grade:'九年级下册',unit:'第三单元',textbook:'统编版',topic:'鱼我所欲也' },
  { subject:'初中语文',grade:'九年级下册',unit:'第六单元',textbook:'统编版',topic:'曹刿论战' },

  // ==================== 初中数学 人教版 ====================
  { subject:'初中数学',grade:'七年级上册',unit:'第一章 有理数',textbook:'人教版',topic:'正数和负数' },
  { subject:'初中数学',grade:'七年级上册',unit:'第一章 有理数',textbook:'人教版',topic:'有理数的加法' },
  { subject:'初中数学',grade:'七年级上册',unit:'第二章 整式的加减',textbook:'人教版',topic:'整式' },
  { subject:'初中数学',grade:'七年级上册',unit:'第三章 一元一次方程',textbook:'人教版',topic:'一元一次方程' },
  { subject:'初中数学',grade:'七年级上册',unit:'第四章 几何图形初步',textbook:'人教版',topic:'直线射线线段' },
  { subject:'初中数学',grade:'七年级下册',unit:'第五章 相交线与平行线',textbook:'人教版',topic:'平行线的性质' },
  { subject:'初中数学',grade:'七年级下册',unit:'第六章 实数',textbook:'人教版',topic:'平方根' },
  { subject:'初中数学',grade:'七年级下册',unit:'第七章 平面直角坐标系',textbook:'人教版',topic:'平面直角坐标系' },
  { subject:'初中数学',grade:'七年级下册',unit:'第八章 二元一次方程组',textbook:'人教版',topic:'二元一次方程组' },
  { subject:'初中数学',grade:'七年级下册',unit:'第九章 不等式与不等式组',textbook:'人教版',topic:'一元一次不等式' },
  { subject:'初中数学',grade:'八年级上册',unit:'第十一章 三角形',textbook:'人教版',topic:'三角形的内角' },
  { subject:'初中数学',grade:'八年级上册',unit:'第十二章 全等三角形',textbook:'人教版',topic:'三角形全等的判定' },
  { subject:'初中数学',grade:'八年级上册',unit:'第十三章 轴对称',textbook:'人教版',topic:'等腰三角形' },
  { subject:'初中数学',grade:'八年级上册',unit:'第十四章 整式的乘法与因式分解',textbook:'人教版',topic:'因式分解' },
  { subject:'初中数学',grade:'八年级上册',unit:'第十五章 分式',textbook:'人教版',topic:'分式方程' },
  { subject:'初中数学',grade:'八年级下册',unit:'第十六章 二次根式',textbook:'人教版',topic:'二次根式' },
  { subject:'初中数学',grade:'八年级下册',unit:'第十七章 勾股定理',textbook:'人教版',topic:'勾股定理' },
  { subject:'初中数学',grade:'八年级下册',unit:'第十八章 平行四边形',textbook:'人教版',topic:'平行四边形的性质' },
  { subject:'初中数学',grade:'八年级下册',unit:'第十八章 平行四边形',textbook:'人教版',topic:'矩形' },
  { subject:'初中数学',grade:'八年级下册',unit:'第十九章 一次函数',textbook:'人教版',topic:'一次函数' },
  { subject:'初中数学',grade:'八年级下册',unit:'第二十章 数据的分析',textbook:'人教版',topic:'中位数和众数' },
  { subject:'初中数学',grade:'九年级上册',unit:'第二十一章 一元二次方程',textbook:'人教版',topic:'解一元二次方程' },
  { subject:'初中数学',grade:'九年级上册',unit:'第二十二章 二次函数',textbook:'人教版',topic:'二次函数y=ax²' },
  { subject:'初中数学',grade:'九年级上册',unit:'第二十三章 旋转',textbook:'人教版',topic:'图形的旋转' },
  { subject:'初中数学',grade:'九年级上册',unit:'第二十四章 圆',textbook:'人教版',topic:'圆的有关性质' },
  { subject:'初中数学',grade:'九年级上册',unit:'第二十四章 圆',textbook:'人教版',topic:'弧长和扇形面积' },
  { subject:'初中数学',grade:'九年级上册',unit:'第二十五章 概率初步',textbook:'人教版',topic:'概率' },
  { subject:'初中数学',grade:'九年级下册',unit:'第二十六章 反比例函数',textbook:'人教版',topic:'反比例函数' },
  { subject:'初中数学',grade:'九年级下册',unit:'第二十七章 相似',textbook:'人教版',topic:'相似三角形的判定' },
  { subject:'初中数学',grade:'九年级下册',unit:'第二十八章 锐角三角函数',textbook:'人教版',topic:'锐角三角函数' },

  // ==================== 初中物理 人教版 ====================
  { subject:'初中物理',grade:'八年级上册',unit:'第一章 机械运动',textbook:'人教版',topic:'运动的快慢' },
  { subject:'初中物理',grade:'八年级上册',unit:'第二章 声现象',textbook:'人教版',topic:'声音的产生与传播' },
  { subject:'初中物理',grade:'八年级上册',unit:'第三章 物态变化',textbook:'人教版',topic:'熔化和凝固' },
  { subject:'初中物理',grade:'八年级上册',unit:'第四章 光现象',textbook:'人教版',topic:'光的反射' },
  { subject:'初中物理',grade:'八年级上册',unit:'第四章 光现象',textbook:'人教版',topic:'平面镜成像' },
  { subject:'初中物理',grade:'八年级上册',unit:'第五章 透镜及其应用',textbook:'人教版',topic:'凸透镜成像的规律' },
  { subject:'初中物理',grade:'八年级上册',unit:'第六章 质量与密度',textbook:'人教版',topic:'密度' },
  { subject:'初中物理',grade:'八年级下册',unit:'第七章 力',textbook:'人教版',topic:'力' },
  { subject:'初中物理',grade:'八年级下册',unit:'第八章 运动和力',textbook:'人教版',topic:'牛顿第一定律' },
  { subject:'初中物理',grade:'八年级下册',unit:'第八章 运动和力',textbook:'人教版',topic:'摩擦力' },
  { subject:'初中物理',grade:'八年级下册',unit:'第九章 压强',textbook:'人教版',topic:'压强' },
  { subject:'初中物理',grade:'八年级下册',unit:'第九章 压强',textbook:'人教版',topic:'液体的压强' },
  { subject:'初中物理',grade:'八年级下册',unit:'第十章 浮力',textbook:'人教版',topic:'阿基米德原理' },
  { subject:'初中物理',grade:'八年级下册',unit:'第十一章 功和机械能',textbook:'人教版',topic:'功' },
  { subject:'初中物理',grade:'八年级下册',unit:'第十二章 简单机械',textbook:'人教版',topic:'杠杆' },
  { subject:'初中物理',grade:'九年级全一册',unit:'第十五章 电流和电路',textbook:'人教版',topic:'串联和并联' },
  { subject:'初中物理',grade:'九年级全一册',unit:'第十七章 欧姆定律',textbook:'人教版',topic:'欧姆定律' },
  { subject:'初中物理',grade:'九年级全一册',unit:'第十八章 电功率',textbook:'人教版',topic:'电功率' },
  { subject:'初中物理',grade:'九年级全一册',unit:'第二十章 电与磁',textbook:'人教版',topic:'电生磁' },

  // ==================== 初中化学 人教版 ====================
  { subject:'初中化学',grade:'九年级上册',unit:'第二单元 我们周围的空气',textbook:'人教版',topic:'氧气' },
  { subject:'初中化学',grade:'九年级上册',unit:'第三单元 物质构成的奥秘',textbook:'人教版',topic:'分子和原子' },
  { subject:'初中化学',grade:'九年级上册',unit:'第四单元 自然界的水',textbook:'人教版',topic:'水的组成' },
  { subject:'初中化学',grade:'九年级上册',unit:'第五单元 化学方程式',textbook:'人教版',topic:'质量守恒定律' },
  { subject:'初中化学',grade:'九年级上册',unit:'第六单元 碳和碳的氧化物',textbook:'人教版',topic:'二氧化碳' },
  { subject:'初中化学',grade:'九年级上册',unit:'第七单元 燃料及其利用',textbook:'人教版',topic:'燃烧和灭火' },
  { subject:'初中化学',grade:'九年级下册',unit:'第八单元 金属和金属材料',textbook:'人教版',topic:'金属的化学性质' },
  { subject:'初中化学',grade:'九年级下册',unit:'第九单元 溶液',textbook:'人教版',topic:'溶解度' },
  { subject:'初中化学',grade:'九年级下册',unit:'第十单元 酸和碱',textbook:'人教版',topic:'酸和碱的中和反应' },

  // ==================== 初中生物 人教版 ====================
  { subject:'初中生物',grade:'七年级上册',unit:'第二单元 生物体的结构层次',textbook:'人教版',topic:'植物细胞' },
  { subject:'初中生物',grade:'七年级上册',unit:'第二单元 生物体的结构层次',textbook:'人教版',topic:'动物细胞' },
  { subject:'初中生物',grade:'七年级上册',unit:'第三单元 生物圈中的绿色植物',textbook:'人教版',topic:'光合作用' },
  { subject:'初中生物',grade:'七年级上册',unit:'第三单元 生物圈中的绿色植物',textbook:'人教版',topic:'呼吸作用' },
  { subject:'初中生物',grade:'七年级下册',unit:'第四单元 生物圈中的人',textbook:'人教版',topic:'消化和吸收' },
  { subject:'初中生物',grade:'七年级下册',unit:'第四单元 生物圈中的人',textbook:'人教版',topic:'血液循环' },
  { subject:'初中生物',grade:'七年级下册',unit:'第四单元 生物圈中的人',textbook:'人教版',topic:'尿液的形成' },

  // ==================== 初中历史 统编版 ====================
  { subject:'初中历史',grade:'七年级上册',unit:'第三单元 秦汉时期',textbook:'统编版',topic:'秦统一中国' },
  { subject:'初中历史',grade:'七年级上册',unit:'第三单元 秦汉时期',textbook:'统编版',topic:'汉武帝巩固大一统王朝' },
  { subject:'初中历史',grade:'七年级下册',unit:'第一单元 隋唐时期',textbook:'统编版',topic:'贞观之治' },
  { subject:'初中历史',grade:'七年级下册',unit:'第二单元 辽宋夏金元',textbook:'统编版',topic:'宋代经济的发展' },
  { subject:'初中历史',grade:'八年级上册',unit:'第一单元',textbook:'统编版',topic:'鸦片战争' },
  { subject:'初中历史',grade:'八年级上册',unit:'第三单元',textbook:'统编版',topic:'辛亥革命' },
  { subject:'初中历史',grade:'八年级上册',unit:'第五单元',textbook:'统编版',topic:'红军长征' },

  // ==================== 初中地理 人教版 ====================
  { subject:'初中地理',grade:'七年级上册',unit:'第一章 地球和地图',textbook:'人教版',topic:'地球和地球仪' },
  { subject:'初中地理',grade:'七年级上册',unit:'第三章 天气与气候',textbook:'人教版',topic:'世界的气候' },
  { subject:'初中地理',grade:'八年级上册',unit:'第二章 中国的自然环境',textbook:'人教版',topic:'地形和地势' },
  { subject:'初中地理',grade:'八年级上册',unit:'第二章 中国的自然环境',textbook:'人教版',topic:'气候' },

  // ==================== 小学英语 PEP ====================
  { subject:'小学英语',grade:'三年级上册',unit:'Unit 2 Colours',textbook:'PEP',topic:'Colours' },
  { subject:'小学英语',grade:'三年级上册',unit:'Unit 4 We love animals',textbook:'PEP',topic:'We love animals' },
  { subject:'小学英语',grade:'四年级上册',unit:'Unit 1 My classroom',textbook:'PEP',topic:'My classroom' },
  { subject:'小学英语',grade:'五年级上册',unit:'Unit 1 What\'s he like?',textbook:'PEP',topic:'What\'s he like?' },
  { subject:'小学英语',grade:'六年级上册',unit:'Unit 3 My weekend plan',textbook:'PEP',topic:'My weekend plan' },

  // ==================== 初中英语 人教版 ====================
  { subject:'初中英语',grade:'七年级上册',unit:'Unit 2 This is my sister',textbook:'人教版',topic:'This is my sister' },
  { subject:'初中英语',grade:'八年级上册',unit:'Unit 3 I\'m more outgoing than my sister',textbook:'人教版',topic:'比较级' },
  { subject:'初中英语',grade:'九年级全一册',unit:'Unit 1 How can we become good learners?',textbook:'人教版',topic:'How can we become good learners?' },

  // ==================== 小学科学 教科版 ====================
  { subject:'小学科学',grade:'三年级上册',unit:'第一单元 水',textbook:'教科版',topic:'水沸腾了' },
  { subject:'小学科学',grade:'四年级上册',unit:'第一单元 声音',textbook:'教科版',topic:'声音是怎样产生的' },
  { subject:'小学科学',grade:'四年级下册',unit:'第二单元 电路',textbook:'教科版',topic:'简单电路' },
  { subject:'小学科学',grade:'五年级上册',unit:'第三单元 光',textbook:'教科版',topic:'光沿直线传播' },
  { subject:'小学科学',grade:'六年级上册',unit:'第三单元 工具与技术',textbook:'教科版',topic:'杠杆' },

  // ==================== 小学道德与法治 统编版 ====================
  { subject:'小学道德与法治',grade:'三年级上册',unit:'第一单元 我们的学校',textbook:'统编版',topic:'我是小学生' },
  { subject:'小学道德与法治',grade:'四年级上册',unit:'第一单元 我们是班级的主人',textbook:'统编版',topic:'我们的班规我们定' },
  { subject:'小学道德与法治',grade:'五年级上册',unit:'第一单元 面对成长中的问题',textbook:'统编版',topic:'学会沟通交流' },
  { subject:'小学道德与法治',grade:'六年级上册',unit:'第一单元 我们的守护者',textbook:'统编版',topic:'法律是什么' },

  // ==================== 初中道德与法治 统编版 ====================
  { subject:'初中道德与法治',grade:'七年级上册',unit:'第一单元 成长的节拍',textbook:'统编版',topic:'中学序曲' },
  { subject:'初中道德与法治',grade:'八年级上册',unit:'第一单元 社会生活讲道德',textbook:'统编版',topic:'遵守规则' },
  { subject:'初中道德与法治',grade:'九年级上册',unit:'第一单元 富强与创新',textbook:'统编版',topic:'踏上强国之路' },

  // ==================== 小学数学 北师大版（补充） ====================
  { subject:'小学数学',grade:'四年级上册',unit:'第五单元 方向与位置',textbook:'北师大版',topic:'用数对确定位置' },
  { subject:'小学数学',grade:'五年级上册',unit:'第四单元 多边形的面积',textbook:'北师大版',topic:'三角形的面积' },
  { subject:'小学数学',grade:'五年级下册',unit:'第四单元 长方体',textbook:'北师大版',topic:'长方体的体积' },

  // ====== 小学语文 补充 ======
  { subject:'小学语文',grade:'一年级上册',unit:'识字',textbook:'统编版',topic:'金木水火土' },
  { subject:'小学语文',grade:'一年级上册',unit:'汉语拼音',textbook:'统编版',topic:'i u ü' },
  { subject:'小学语文',grade:'一年级上册',unit:'课文',textbook:'统编版',topic:'江南' },
  { subject:'小学语文',grade:'一年级上册',unit:'课文',textbook:'统编版',topic:'四季' },
  { subject:'小学语文',grade:'一年级下册',unit:'课文',textbook:'统编版',topic:'吃水不忘挖井人' },
  { subject:'小学语文',grade:'一年级下册',unit:'课文',textbook:'统编版',topic:'端午粽' },
  { subject:'小学语文',grade:'一年级下册',unit:'课文',textbook:'统编版',topic:'彩虹' },
  { subject:'小学语文',grade:'二年级上册',unit:'课文',textbook:'统编版',topic:'望庐山瀑布' },
  { subject:'小学语文',grade:'二年级上册',unit:'课文',textbook:'统编版',topic:'日月潭' },
  { subject:'小学语文',grade:'二年级上册',unit:'寓言',textbook:'统编版',topic:'狐假虎威' },
  { subject:'小学语文',grade:'二年级下册',unit:'课文',textbook:'统编版',topic:'千人糕' },
  { subject:'小学语文',grade:'二年级下册',unit:'课文',textbook:'统编版',topic:'彩色的梦' },
  { subject:'小学语文',grade:'二年级下册',unit:'课文',textbook:'统编版',topic:'枫树上的喜鹊' },
  { subject:'小学语文',grade:'三年级上册',unit:'第一单元',textbook:'统编版',topic:'花的学校' },
  { subject:'小学语文',grade:'三年级上册',unit:'第三单元',textbook:'统编版',topic:'卖火柴的小女孩' },
  { subject:'小学语文',grade:'三年级上册',unit:'第六单元',textbook:'统编版',topic:'美丽的小兴安岭' },
  { subject:'小学语文',grade:'三年级下册',unit:'第一单元',textbook:'统编版',topic:'燕子' },
  { subject:'小学语文',grade:'三年级下册',unit:'第一单元',textbook:'统编版',topic:'荷花' },
  { subject:'小学语文',grade:'三年级下册',unit:'第二单元',textbook:'统编版',topic:'陶罐和铁罐' },
  { subject:'小学语文',grade:'三年级下册',unit:'第二单元',textbook:'统编版',topic:'鹿角和鹿腿' },
  { subject:'小学语文',grade:'三年级下册',unit:'第七单元',textbook:'统编版',topic:'火烧云' },
  { subject:'小学语文',grade:'四年级上册',unit:'第一单元',textbook:'统编版',topic:'走月亮' },
  { subject:'小学语文',grade:'四年级上册',unit:'第六单元',textbook:'统编版',topic:'牛和鹅' },
  { subject:'小学语文',grade:'四年级下册',unit:'第一单元',textbook:'统编版',topic:'乡下人家' },
  { subject:'小学语文',grade:'四年级下册',unit:'第二单元',textbook:'统编版',topic:'琥珀' },
  { subject:'小学语文',grade:'四年级下册',unit:'第四单元',textbook:'统编版',topic:'母鸡' },
  { subject:'小学语文',grade:'四年级下册',unit:'第六单元',textbook:'统编版',topic:'小英雄雨来' },
  { subject:'小学语文',grade:'五年级上册',unit:'第一单元',textbook:'统编版',topic:'桂花雨' },
  { subject:'小学语文',grade:'五年级上册',unit:'第六单元',textbook:'统编版',topic:'父爱之舟' },
  { subject:'小学语文',grade:'五年级下册',unit:'第一单元',textbook:'统编版',topic:'祖父的园子' },
  { subject:'小学语文',grade:'五年级下册',unit:'第四单元',textbook:'统编版',topic:'青山处处埋忠骨' },
  { subject:'小学语文',grade:'五年级下册',unit:'第六单元',textbook:'统编版',topic:'田忌赛马' },
  { subject:'小学语文',grade:'五年级下册',unit:'第六单元',textbook:'统编版',topic:'跳水' },
  { subject:'小学语文',grade:'六年级上册',unit:'第四单元',textbook:'统编版',topic:'穷人' },
  { subject:'小学语文',grade:'六年级上册',unit:'第七单元',textbook:'统编版',topic:'伯牙鼓琴' },
  { subject:'小学语文',grade:'六年级下册',unit:'第五单元',textbook:'统编版',topic:'真理诞生于一百个问号之后' },

  // ====== 初中语文 补充 ======
  { subject:'初中语文',grade:'七年级上册',unit:'第一单元',textbook:'统编版',topic:'观沧海' },
  { subject:'初中语文',grade:'七年级上册',unit:'第二单元',textbook:'统编版',topic:'秋天的怀念' },
  { subject:'初中语文',grade:'七年级上册',unit:'第二单元',textbook:'统编版',topic:'散步' },
  { subject:'初中语文',grade:'七年级上册',unit:'第二单元',textbook:'统编版',topic:'世说新语二则' },
  { subject:'初中语文',grade:'七年级上册',unit:'第四单元',textbook:'统编版',topic:'诫子书' },
  { subject:'初中语文',grade:'七年级上册',unit:'第六单元',textbook:'统编版',topic:'天上的街市' },
  { subject:'初中语文',grade:'七年级下册',unit:'第一单元',textbook:'统编版',topic:'孙权劝学' },
  { subject:'初中语文',grade:'七年级下册',unit:'第二单元',textbook:'统编版',topic:'黄河颂' },
  { subject:'初中语文',grade:'七年级下册',unit:'第三单元',textbook:'统编版',topic:'老王' },
  { subject:'初中语文',grade:'七年级下册',unit:'第三单元',textbook:'统编版',topic:'卖油翁' },
  { subject:'初中语文',grade:'七年级下册',unit:'第六单元',textbook:'统编版',topic:'伟大的悲剧' },
  { subject:'初中语文',grade:'八年级上册',unit:'第三单元',textbook:'统编版',topic:'与朱元思书' },
  { subject:'初中语文',grade:'八年级上册',unit:'第六单元',textbook:'统编版',topic:'周亚夫军细柳' },
  { subject:'初中语文',grade:'八年级下册',unit:'第三单元',textbook:'统编版',topic:'核舟记' },
  { subject:'初中语文',grade:'八年级下册',unit:'第三单元',textbook:'统编版',topic:'关雎' },
  { subject:'初中语文',grade:'八年级下册',unit:'第六单元',textbook:'统编版',topic:'北冥有鱼' },
  { subject:'初中语文',grade:'八年级下册',unit:'第六单元',textbook:'统编版',topic:'马说' },
  { subject:'初中语文',grade:'九年级上册',unit:'第一单元',textbook:'统编版',topic:'沁园春雪' },
  { subject:'初中语文',grade:'九年级上册',unit:'第六单元',textbook:'统编版',topic:'范进中举' },
  { subject:'初中语文',grade:'九年级下册',unit:'第一单元',textbook:'统编版',topic:'海燕' },
  { subject:'初中语文',grade:'九年级下册',unit:'第六单元',textbook:'统编版',topic:'邹忌讽齐王纳谏' },
  { subject:'初中语文',grade:'九年级下册',unit:'第六单元',textbook:'统编版',topic:'出师表' },

  // ====== 初中数学 补充 ======
  { subject:'初中数学',grade:'七年级上册',unit:'第一章 有理数',textbook:'人教版',topic:'有理数的减法' },
  { subject:'初中数学',grade:'七年级上册',unit:'第一章 有理数',textbook:'人教版',topic:'有理数的乘法' },
  { subject:'初中数学',grade:'七年级上册',unit:'第二章 整式的加减',textbook:'人教版',topic:'合并同类项' },
  { subject:'初中数学',grade:'七年级下册',unit:'第五章 相交线与平行线',textbook:'人教版',topic:'相交线' },
  { subject:'初中数学',grade:'八年级上册',unit:'第十二章 全等三角形',textbook:'人教版',topic:'角的平分线的性质' },
  { subject:'初中数学',grade:'八年级下册',unit:'第十八章 平行四边形',textbook:'人教版',topic:'菱形' },
  { subject:'初中数学',grade:'八年级下册',unit:'第十八章 平行四边形',textbook:'人教版',topic:'正方形' },
  { subject:'初中数学',grade:'九年级上册',unit:'第二十一章 一元二次方程',textbook:'人教版',topic:'配方法' },
  { subject:'初中数学',grade:'九年级上册',unit:'第二十二章 二次函数',textbook:'人教版',topic:'二次函数的图像与性质' },
  { subject:'初中数学',grade:'九年级上册',unit:'第二十四章 圆',textbook:'人教版',topic:'直线和圆的位置关系' },
  { subject:'初中数学',grade:'九年级下册',unit:'第二十七章 相似',textbook:'人教版',topic:'位似' },

  // ====== 初中物理 补充 ======
  { subject:'初中物理',grade:'八年级上册',unit:'第一章 机械运动',textbook:'人教版',topic:'长度和时间的测量' },
  { subject:'初中物理',grade:'八年级上册',unit:'第四章 光现象',textbook:'人教版',topic:'光的折射' },
  { subject:'初中物理',grade:'八年级上册',unit:'第六章 质量与密度',textbook:'人教版',topic:'质量' },
  { subject:'初中物理',grade:'八年级下册',unit:'第九章 压强',textbook:'人教版',topic:'大气压强' },
  { subject:'初中物理',grade:'八年级下册',unit:'第十章 浮力',textbook:'人教版',topic:'浮力' },
  { subject:'初中物理',grade:'八年级下册',unit:'第十一章 功和机械能',textbook:'人教版',topic:'动能和势能' },

  // ====== 初中化学 补充 ======
  { subject:'初中化学',grade:'九年级上册',unit:'第二单元 我们周围的空气',textbook:'人教版',topic:'空气' },
  { subject:'初中化学',grade:'九年级上册',unit:'第六单元 碳和碳的氧化物',textbook:'人教版',topic:'一氧化碳' },
  { subject:'初中化学',grade:'九年级下册',unit:'第八单元 金属和金属材料',textbook:'人教版',topic:'金属材料' },
  { subject:'初中化学',grade:'九年级下册',unit:'第九单元 溶液',textbook:'人教版',topic:'溶液的浓度' },
  { subject:'初中化学',grade:'九年级下册',unit:'第十单元 酸和碱',textbook:'人教版',topic:'常见的酸' },
  { subject:'初中化学',grade:'九年级下册',unit:'第十单元 酸和碱',textbook:'人教版',topic:'常见的碱' },

  // ====== 初中生物 补充 ======
  { subject:'初中生物',grade:'七年级上册',unit:'第一单元 生物和生物圈',textbook:'人教版',topic:'生态系统' },
  { subject:'初中生物',grade:'七年级上册',unit:'第一单元 生物和生物圈',textbook:'人教版',topic:'食物链和食物网' },
  { subject:'初中生物',grade:'七年级上册',unit:'第二单元 生物体的结构层次',textbook:'人教版',topic:'细胞分裂' },
  { subject:'初中生物',grade:'七年级上册',unit:'第三单元 生物圈中的绿色植物',textbook:'人教版',topic:'开花和结果' },
  { subject:'初中生物',grade:'七年级下册',unit:'第四单元 生物圈中的人',textbook:'人教版',topic:'食物中的营养物质' },
  { subject:'初中生物',grade:'七年级下册',unit:'第四单元 生物圈中的人',textbook:'人教版',topic:'呼吸道对空气的处理' },

  // ====== 初中历史 补充 ======
  { subject:'初中历史',grade:'七年级上册',unit:'第二单元 夏商周',textbook:'统编版',topic:'青铜器与甲骨文' },
  { subject:'初中历史',grade:'七年级上册',unit:'第二单元 夏商周',textbook:'统编版',topic:'百家争鸣' },
  { subject:'初中历史',grade:'七年级上册',unit:'第三单元 秦汉时期',textbook:'统编版',topic:'丝绸之路' },
  { subject:'初中历史',grade:'七年级下册',unit:'第一单元 隋唐时期',textbook:'统编版',topic:'唐朝的中外文化交流' },
  { subject:'初中历史',grade:'七年级下册',unit:'第三单元 明清时期',textbook:'统编版',topic:'明朝的统治' },
  { subject:'初中历史',grade:'八年级上册',unit:'第四单元 新民主主义革命',textbook:'统编版',topic:'五四运动' },
  { subject:'初中历史',grade:'八年级上册',unit:'第四单元 新民主主义革命',textbook:'统编版',topic:'中国共产党的诞生' },
  { subject:'初中历史',grade:'八年级上册',unit:'第五单元 从国共合作到对立',textbook:'统编版',topic:'北伐战争' },
  { subject:'初中历史',grade:'八年级上册',unit:'第五单元',textbook:'统编版',topic:'南昌起义' },
  { subject:'初中历史',grade:'八年级下册',unit:'第一单元 中华人民共和国的成立',textbook:'统编版',topic:'开国大典' },
  { subject:'初中历史',grade:'八年级下册',unit:'第三单元 中国特色社会主义道路',textbook:'统编版',topic:'改革开放' },

  // ====== 初中地理 补充 ======
  { subject:'初中地理',grade:'七年级上册',unit:'第一章 地球和地图',textbook:'人教版',topic:'地球的运动' },
  { subject:'初中地理',grade:'七年级上册',unit:'第二章 陆地和海洋',textbook:'人教版',topic:'大洲和大洋' },
  { subject:'初中地理',grade:'七年级下册',unit:'第七章 邻近地区和国家',textbook:'人教版',topic:'日本' },
  { subject:'初中地理',grade:'七年级下册',unit:'第七章',textbook:'人教版',topic:'东南亚' },
  { subject:'初中地理',grade:'七年级下册',unit:'第七章',textbook:'人教版',topic:'印度' },
  { subject:'初中地理',grade:'八年级上册',unit:'第一章 从世界看中国',textbook:'人教版',topic:'疆域' },
  { subject:'初中地理',grade:'八年级上册',unit:'第二章 中国的自然环境',textbook:'人教版',topic:'长江' },
  { subject:'初中地理',grade:'八年级上册',unit:'第二章 中国的自然环境',textbook:'人教版',topic:'黄河' },
  { subject:'初中地理',grade:'八年级上册',unit:'第三章 中国的自然资源',textbook:'人教版',topic:'水资源' },

  // ====== 小学英语 PEP 补充 ======
  { subject:'小学英语',grade:'三年级上册',unit:'Unit 1 Hello!',textbook:'PEP',topic:'Hello' },
  { subject:'小学英语',grade:'三年级上册',unit:'Unit 3 Look at me!',textbook:'PEP',topic:'Look at me' },
  { subject:'小学英语',grade:'三年级下册',unit:'Unit 3 At the zoo',textbook:'PEP',topic:'At the zoo' },
  { subject:'小学英语',grade:'三年级下册',unit:'Unit 5 Do you like pears?',textbook:'PEP',topic:'Do you like pears' },
  { subject:'小学英语',grade:'四年级上册',unit:'Unit 3 My friends',textbook:'PEP',topic:'My friends' },
  { subject:'小学英语',grade:'四年级上册',unit:'Unit 5 Dinner\'s ready',textbook:'PEP',topic:'Dinner\'s ready' },
  { subject:'小学英语',grade:'四年级下册',unit:'Unit 1 My school',textbook:'PEP',topic:'My school' },
  { subject:'小学英语',grade:'四年级下册',unit:'Unit 4 At the farm',textbook:'PEP',topic:'At the farm' },
  { subject:'小学英语',grade:'四年级下册',unit:'Unit 6 Shopping',textbook:'PEP',topic:'Shopping' },
  { subject:'小学英语',grade:'五年级上册',unit:'Unit 2 My week',textbook:'PEP',topic:'My week' },
  { subject:'小学英语',grade:'五年级上册',unit:'Unit 4 What can you do?',textbook:'PEP',topic:'What can you do' },
  { subject:'小学英语',grade:'五年级上册',unit:'Unit 5 There is a big bed',textbook:'PEP',topic:'There is a big bed' },
  { subject:'小学英语',grade:'五年级下册',unit:'Unit 1 My day',textbook:'PEP',topic:'My day' },
  { subject:'小学英语',grade:'五年级下册',unit:'Unit 2 My favourite season',textbook:'PEP',topic:'My favourite season' },
  { subject:'小学英语',grade:'五年级下册',unit:'Unit 3 My school calendar',textbook:'PEP',topic:'My school calendar' },
  { subject:'小学英语',grade:'六年级上册',unit:'Unit 1 How can I get there?',textbook:'PEP',topic:'How can I get there' },
  { subject:'小学英语',grade:'六年级上册',unit:'Unit 2 Ways to go to school',textbook:'PEP',topic:'Ways to go to school' },
  { subject:'小学英语',grade:'六年级上册',unit:'Unit 5 What does he do?',textbook:'PEP',topic:'What does he do' },
  { subject:'小学英语',grade:'六年级下册',unit:'Unit 1 How tall are you?',textbook:'PEP',topic:'How tall are you' },
  { subject:'小学英语',grade:'六年级下册',unit:'Unit 3 Where did you go?',textbook:'PEP',topic:'Where did you go' },
  { subject:'小学英语',grade:'六年级下册',unit:'Unit 4 Then and now',textbook:'PEP',topic:'Then and now' },

  // ====== 初中英语 人教版 补充 ======
  { subject:'初中英语',grade:'七年级上册',unit:'Unit 1 My name\'s Gina',textbook:'人教版',topic:'My name\'s Gina' },
  { subject:'初中英语',grade:'七年级上册',unit:'Unit 5 Do you have a soccer ball?',textbook:'人教版',topic:'Do you have a soccer ball' },
  { subject:'初中英语',grade:'七年级上册',unit:'Unit 7 How much are these socks?',textbook:'人教版',topic:'How much are these socks' },
  { subject:'初中英语',grade:'七年级下册',unit:'Unit 3 How do you get to school?',textbook:'人教版',topic:'How do you get to school' },
  { subject:'初中英语',grade:'七年级下册',unit:'Unit 5 Why do you like pandas?',textbook:'人教版',topic:'Why do you like pandas' },
  { subject:'初中英语',grade:'七年级下册',unit:'Unit 7 It\'s raining!',textbook:'人教版',topic:'It\'s raining' },
  { subject:'初中英语',grade:'七年级下册',unit:'Unit 10 I\'d like some noodles',textbook:'人教版',topic:'I\'d like some noodles' },
  { subject:'初中英语',grade:'八年级上册',unit:'Unit 1 Where did you go on vacation?',textbook:'人教版',topic:'Where did you go on vacation' },
  { subject:'初中英语',grade:'八年级上册',unit:'Unit 5 Do you want to watch a game show?',textbook:'人教版',topic:'Do you want to watch a game show' },
  { subject:'初中英语',grade:'八年级上册',unit:'Unit 7 Will people have robots?',textbook:'人教版',topic:'Will people have robots' },
  { subject:'初中英语',grade:'八年级下册',unit:'Unit 1 What\'s the matter?',textbook:'人教版',topic:'What\'s the matter' },
  { subject:'初中英语',grade:'八年级下册',unit:'Unit 2 I\'ll help to clean up the city parks',textbook:'人教版',topic:'I\'ll help to clean up' },
  { subject:'初中英语',grade:'八年级下册',unit:'Unit 5 What were you doing when the rainstorm came?',textbook:'人教版',topic:'过去进行时' },
  { subject:'初中英语',grade:'八年级下册',unit:'Unit 7 What\'s the highest mountain in the world?',textbook:'人教版',topic:'最高级' },
  { subject:'初中英语',grade:'九年级全一册',unit:'Unit 2 I think that mooncakes are delicious!',textbook:'人教版',topic:'I think that mooncakes are delicious' },
  { subject:'初中英语',grade:'九年级全一册',unit:'Unit 3 Could you please tell me where the restrooms are?',textbook:'人教版',topic:'问路与指路' },
  { subject:'初中英语',grade:'九年级全一册',unit:'Unit 5 What are the shirts made of?',textbook:'人教版',topic:'被动语态' },
  { subject:'初中英语',grade:'九年级全一册',unit:'Unit 9 I like music that I can dance to',textbook:'人教版',topic:'定语从句' },

  // ====== 小学科学 教科版 补充 ======
  { subject:'小学科学',grade:'三年级上册',unit:'第一单元 水',textbook:'教科版',topic:'水结冰了' },
  { subject:'小学科学',grade:'三年级上册',unit:'第二单元 空气',textbook:'教科版',topic:'空气能占据空间吗' },
  { subject:'小学科学',grade:'三年级下册',unit:'第一单元 物体的运动',textbook:'教科版',topic:'直线运动和曲线运动' },
  { subject:'小学科学',grade:'四年级上册',unit:'第二单元 呼吸与消化',textbook:'教科版',topic:'食物在身体里的旅行' },
  { subject:'小学科学',grade:'四年级下册',unit:'第一单元 植物的生长变化',textbook:'教科版',topic:'种子的传播' },
  { subject:'小学科学',grade:'四年级下册',unit:'第二单元 电路',textbook:'教科版',topic:'导体和绝缘体' },
  { subject:'小学科学',grade:'五年级上册',unit:'第一单元 光',textbook:'教科版',topic:'光的反射' },
  { subject:'小学科学',grade:'五年级下册',unit:'第一单元 生物与环境',textbook:'教科版',topic:'食物链' },
  { subject:'小学科学',grade:'五年级下册',unit:'第二单元 船的研究',textbook:'教科版',topic:'用沉的材料造船' },
  { subject:'小学科学',grade:'六年级上册',unit:'第一单元 微小世界',textbook:'教科版',topic:'放大镜' },
  { subject:'小学科学',grade:'六年级上册',unit:'第二单元 地球的运动',textbook:'教科版',topic:'地球的自转' },
  { subject:'小学科学',grade:'六年级下册',unit:'第一单元 小小工程师',textbook:'教科版',topic:'认识工程' },

  // ====== 小学道德与法治 统编版 补充 ======
  { subject:'小学道德与法治',grade:'一年级上册',unit:'第一单元 我是小学生啦',textbook:'统编版',topic:'开开心心上学去' },
  { subject:'小学道德与法治',grade:'二年级上册',unit:'第一单元 我们的节假日',textbook:'统编版',topic:'欢欢喜喜庆国庆' },
  { subject:'小学道德与法治',grade:'三年级上册',unit:'第三单元 安全护我成长',textbook:'统编版',topic:'安全记心上' },
  { subject:'小学道德与法治',grade:'三年级下册',unit:'第一单元 我和我的同伴',textbook:'统编版',topic:'我是独特的' },
  { subject:'小学道德与法治',grade:'四年级上册',unit:'第二单元 为父母分担',textbook:'统编版',topic:'这些事我来做' },
  { subject:'小学道德与法治',grade:'四年级下册',unit:'第四单元 感受家乡文化',textbook:'统编版',topic:'多姿多彩的民间艺术' },
  { subject:'小学道德与法治',grade:'五年级上册',unit:'第三单元 我们的国土',textbook:'统编版',topic:'我们神圣的国土' },
  { subject:'小学道德与法治',grade:'五年级下册',unit:'第一单元 我们一家人',textbook:'统编版',topic:'读懂彼此的心' },
  { subject:'小学道德与法治',grade:'五年级下册',unit:'第二单元 公共生活靠大家',textbook:'统编版',topic:'建立良好的公共秩序' },
  { subject:'小学道德与法治',grade:'六年级上册',unit:'第二单元 我们是公民',textbook:'统编版',topic:'公民意味着什么' },
  { subject:'小学道德与法治',grade:'六年级上册',unit:'第三单元 我们的国家机构',textbook:'统编版',topic:'国家机构有哪些' },
  { subject:'小学道德与法治',grade:'六年级下册',unit:'第二单元 爱护地球',textbook:'统编版',topic:'地球——我们的家园' },

  // ====== 初中道德与法治 统编版 补充 ======
  { subject:'初中道德与法治',grade:'七年级上册',unit:'第二单元 友谊的天空',textbook:'统编版',topic:'和朋友在一起' },
  { subject:'初中道德与法治',grade:'七年级上册',unit:'第三单元 师长情谊',textbook:'统编版',topic:'走近老师' },
  { subject:'初中道德与法治',grade:'七年级下册',unit:'第一单元 青春时光',textbook:'统编版',topic:'青春的情绪' },
  { subject:'初中道德与法治',grade:'七年级下册',unit:'第二单元 做情绪情感的主人',textbook:'统编版',topic:'情绪的管理' },
  { subject:'初中道德与法治',grade:'八年级上册',unit:'第二单元 遵守社会规则',textbook:'统编版',topic:'诚实守信' },
  { subject:'初中道德与法治',grade:'八年级上册',unit:'第四单元 维护国家利益',textbook:'统编版',topic:'国家好大家才会好' },
  { subject:'初中道德与法治',grade:'八年级下册',unit:'第一单元 坚持宪法至上',textbook:'统编版',topic:'公民权利的保障书' },
  { subject:'初中道德与法治',grade:'八年级下册',unit:'第三单元 人民当家作主',textbook:'统编版',topic:'根本政治制度' },
  { subject:'初中道德与法治',grade:'九年级上册',unit:'第二单元 民主与法治',textbook:'统编版',topic:'生活在民主国家' },

  // ====== 小学数学 补充（低年级缺的） ======
  { subject:'小学数学',grade:'一年级上册',unit:'第七单元 认识钟表',textbook:'人教版',topic:'认识整时' },
  { subject:'小学数学',grade:'一年级下册',unit:'第四单元 100以内数的认识',textbook:'人教版',topic:'100以内数的读写' },
  { subject:'小学数学',grade:'一年级下册',unit:'第七单元 找规律',textbook:'人教版',topic:'找规律' },
  { subject:'小学数学',grade:'二年级上册',unit:'第五单元 观察物体',textbook:'人教版',topic:'观察物体' },
  { subject:'小学数学',grade:'二年级上册',unit:'第七单元 认识时间',textbook:'人教版',topic:'认识时间' },
  { subject:'小学数学',grade:'二年级下册',unit:'第七单元 万以内数的认识',textbook:'人教版',topic:'万以内数的读写' },
  { subject:'小学数学',grade:'三年级上册',unit:'第一单元 时分秒',textbook:'人教版',topic:'秒的认识' },
  { subject:'小学数学',grade:'三年级上册',unit:'第二单元 万以内的加法和减法',textbook:'人教版',topic:'万以内的加法' },
  { subject:'小学数学',grade:'三年级上册',unit:'第四单元 万以内的加法和减法(二)',textbook:'人教版',topic:'连续进位加法' },
  { subject:'小学数学',grade:'三年级下册',unit:'第六单元 年月日',textbook:'人教版',topic:'年月日' },
  { subject:'小学数学',grade:'四年级上册',unit:'第二单元 公顷和平方千米',textbook:'人教版',topic:'公顷的认识' },
  { subject:'小学数学',grade:'四年级上册',unit:'第四单元 三位数乘两位数',textbook:'人教版',topic:'三位数乘两位数' },
  { subject:'小学数学',grade:'四年级上册',unit:'第六单元 除数是两位数的除法',textbook:'人教版',topic:'除数是两位数' },
  { subject:'小学数学',grade:'四年级下册',unit:'第二单元 观察物体(二)',textbook:'人教版',topic:'从不同方向观察物体' },
  { subject:'小学数学',grade:'四年级下册',unit:'第七单元 图形的运动(二)',textbook:'人教版',topic:'平移' },
  { subject:'小学数学',grade:'四年级下册',unit:'第八单元 平均数',textbook:'人教版',topic:'平均数' },
  { subject:'小学数学',grade:'五年级上册',unit:'第二单元 位置',textbook:'人教版',topic:'用数对确定位置' },
  { subject:'小学数学',grade:'五年级下册',unit:'第五单元 图形的运动(三)',textbook:'人教版',topic:'旋转' },
  { subject:'小学数学',grade:'五年级下册',unit:'第七单元 折线统计图',textbook:'人教版',topic:'折线统计图' },
  { subject:'小学数学',grade:'六年级上册',unit:'第二单元 位置与方向(二)',textbook:'人教版',topic:'用方向和距离确定位置' },
  { subject:'小学数学',grade:'六年级上册',unit:'第七单元 扇形统计图',textbook:'人教版',topic:'扇形统计图' },
  { subject:'小学数学',grade:'六年级下册',unit:'第二单元 百分数(二)',textbook:'人教版',topic:'折扣' },
  { subject:'小学数学',grade:'六年级下册',unit:'第五单元 鸽巢问题',textbook:'人教版',topic:'鸽巢问题' },
];

const TOTAL = ENTRIES.length;

// ====== 生成单个教案 ======
async function generatePlan(entry, index) {
  const key = `${entry.subject}|${entry.grade}|${entry.topic}`;
  if (completed.has(key)) {
    console.log(`[${index + 1}/${TOTAL}] ⏭ 跳过 ${entry.topic} (已生成)`);
    return null;
  }

  const prompt = `你是一位资深的教学设计专家。请基于2022版义务教育课程标准，为一节${entry.grade}${entry.subject}课《${entry.topic}》（${entry.textbook}，${entry.unit}）撰写完整的教学设计。

重要：教材分析必须基于${entry.textbook}的真实教材内容，包括课题在单元中的位置、前后知识联系、教材呈现方式等。不可编造。

请返回严格JSON格式（不要markdown代码块包裹），结构如下：

{
  "standardAnalysis": {
    "contentRequirement": "对应的课标内容要求（引用课标原文）",
    "academicRequirement": "对应的学业质量标准",
    "teachingHint": "课标提供的教学建议",
    "coreCompetencyNames": ["关联的核心素养1", "核心素养2"]
  },
  "textbookAnalysis": {
    "verticalAnalysis": "纵向分析：本课在教材体系中的位置，与前后知识的联系，在学段中的定位。基于${entry.textbook}真实教材编排",
    "crossAnalysis": "横向对比：不同版本教材对此内容的处理异同，本版本教材的特色和取舍",
    "bigConcept": "本课对应的学科大概念",
    "keyKnowledge": ["核心知识点1", "核心知识点2", "核心知识点3"],
    "difficulties": ["教学重点", "教学难点"]
  },
  "learnerAnalysis": {
    "priorKnowledge": "学习本课之前学生已有的知识基础",
    "priorExperience": "学生在生活中与本课相关的生活经验",
    "cognitiveDifficulty": "学生可能遇到的认知困难",
    "preAssessment": "前测方式与设计"
  },
  "learningObjectives": [
    {"content": "目标1（行为主体+行为动词+行为条件+表现程度四要素格式）", "category": "knowledge", "competencyLink": "关联核心素养", "assessmentMethod": "评价方式"},
    {"content": "目标2", "category": "skill", "competencyLink": "关联核心素养", "assessmentMethod": "评价方式"},
    {"content": "目标3", "category": "attitude", "competencyLink": "关联核心素养", "assessmentMethod": "评价方式"}
  ],
  "assessmentTasks": {
    "preMethod": "前测方式描述",
    "preQuestions": ["前测问题1", "前测问题2"],
    "prePurpose": "前测目的",
    "postMethod": "后测方式",
    "postTasks": ["后测任务1", "后测任务2"],
    "postRubric": "评价量规：优秀/合格/需辅导的标准"
  },
  "activities": [
    {"phase": "B", "title": "导入活动名", "duration": 3, "teacherAction": "教师做什么", "studentAction": "学生做什么", "designIntent": "设计意图，体现动机优先原则", "assessmentEmbedded": ""},
    {"phase": "O", "title": "明确学习目标", "duration": 2, "teacherAction": "...", "studentAction": "...", "designIntent": "让学生明确学什么、怎么学", "assessmentEmbedded": ""},
    {"phase": "P-participatory", "title": "核心探索活动", "duration": 15, "teacherAction": "教师设计有教育价值的困难，引导学生探索（困难前置原则：先让学生经历困惑再提供帮助）", "studentAction": "学生先独立尝试，再合作交流（过程保留原则）", "designIntent": "体现困难前置、过程保留、抽象保护原则", "assessmentEmbedded": "嵌入式评价方式"},
    {"phase": "P-post", "title": "后测练习", "duration": 8, "teacherAction": "...", "studentAction": "...", "designIntent": "检测学习效果", "assessmentEmbedded": "评价方式"},
    {"phase": "S", "title": "课堂总结", "duration": 5, "teacherAction": "...", "studentAction": "...", "designIntent": "归纳本课核心内容，为后续学习铺垫", "assessmentEmbedded": ""}
  ],
  "homework": {
    "requiredTitle1": "必做作业1标题", "requiredDesc1": "具体描述",
    "requiredTitle2": "必做作业2标题", "requiredDesc2": "具体描述",
    "optionalTitle": "选做挑战题标题", "optionalDesc": "具体描述",
    "designIntent": "分层设计意图说明",
    "differentiationNote": "针对不同水平学生的使用建议"
  },
  "boardDesign": {
    "layout": "板书结构化布局（含主要脉络和关键公式/概念）",
    "keyElements": ["关键要素1", "关键要素2", "关键要素3"],
    "structureLogic": "板书的结构化呈现逻辑"
  },
  "reflection": {
    "targetAchievement": "目标达成度预估",
    "improvementMeasures": ["改进措施1", "改进措施2"],
    "notableObservations": "特别关注事项"
  },
  "difficultyDesign": {
    "targetDifficulty": "本课核心困难：什么困难最有教育价值",
    "educationalValue": "为什么这个困难值得保留",
    "zpdAlignment": "如何确保困难在最近发展区内",
    "meaninglessObstacles": ["需要清除的无意义障碍"],
    "motivationStrategy": "动机激发策略——如何让学生愿意面对困难（SDT：自主性、胜任感、关系感）",
    "difficultyFirst": "困难前置的具体安排",
    "processPreservation": "过程保留策略",
    "abstractionProtection": "抽象保护策略"
  }
}

教学内容要真实准确，教材分析要基于${entry.textbook}的真实教材内容，不可编造。`;

  try {
    console.log(`[${index + 1}/${TOTAL}] 🔄 生成中: ${entry.topic} (${entry.subject} ${entry.grade})`);

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: '你是一位资深的教学设计专家，精通2022版义务教育课程标准和各版本教材。你基于真实的教材内容进行分析，绝不编造。请只返回JSON，不要其他任何文字。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error(`  ❌ API错误 ${resp.status}: ${errText.slice(0, 200)}`);
      if (resp.status === 429) {
        console.log('  ⏳ 触发限速，等待30秒...');
        await sleep(30000);
        return generatePlan(entry, index); // 重试
      }
      return null;
    }

    const data = await resp.json();
    const content = data.choices[0].message.content;

    // 尝试提取JSON
    let json = content;
    const match = content.match(/\{[\s\S]*\}/);
    if (match) json = match[0];

    const plan = JSON.parse(json);

    // 保存到文件
    const filename = `${entry.subject.replace(/\//g,'_')}__${entry.grade}__${entry.topic.replace(/[\\/:*?"<>|]/g,'_')}.json`;
    writeFileSync(resolve(OUTPUT_DIR, filename), JSON.stringify(plan, null, 2), 'utf-8');

    // 更新进度
    completed.add(key);
    writeFileSync(PROGRESS_FILE, JSON.stringify([...completed]), 'utf-8');

    const tokens = data.usage || {};
    console.log(`  ✅ 完成！耗时${tokens.completion_tokens ? ` 输出${tokens.completion_tokens}t` : ''}`);
    return plan;
  } catch (e) {
    console.error(`  ❌ 生成失败 ${entry.topic}: ${e.message?.slice(0, 100)}`);
    return null;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ====== 主流程 ======
async function main() {
  console.log(`\n📚 批量教案生成器`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`总课题数: ${TOTAL}`);
  console.log(`已完成: ${completed.size}`);
  console.log(`待生成: ${TOTAL - completed.size}`);
  console.log(`模型: ${MODEL}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < TOTAL; i++) {
    const result = await generatePlan(ENTRIES[i], i);
    if (result) successCount++;
    else if (!completed.has(`${ENTRIES[i].subject}|${ENTRIES[i].grade}|${ENTRIES[i].topic}`)) failCount++;

    // 避免触发限速，每次调用间隔2秒
    if (i < TOTAL - 1) await sleep(2000);
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ 生成完成！`);
  console.log(`成功: ${successCount} | 跳过: ${completed.size - successCount} | 失败: ${failCount}`);
  console.log(`输出目录: ${OUTPUT_DIR}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);
