# 小羊的教案设计器

> 基于2022版义务教育课程标准，融合认知科学与动机心理学的智能教学设计工具

## ✨ 特性

- 📝 **标准模板**：9板块完整教学设计（课标研读 → 教材分析 → 学情分析 → 学习目标 → 评价任务 → 教学活动 → 作业设计 → 板书设计 → 教学反思）
- 🔄 **三种框架**：新课标标准模板 / BOPPPS模型 / UbD逆向设计
- ★ **困难设计框架**：融合维果茨基最近发展区、Bjork理想困难理论、Kapur有效失败理论、SDT自我决定理论
- 📚 **12个范例课例**：覆盖小学+初中，语数英科理化生等各学科
- 🤖 **AI增强（可选）**：按板块AI辅助，默认支持DeepSeek（性价比最优）
- 🖨️ **一键打印/导出PDF**
- 📥 **Markdown下载**：可用于论文、教案展示等场景
- 🔒 **隐私安全**：API密钥仅存储在浏览器本地，不经过任何中间服务器

## 🚀 快速开始

### 本地运行（推荐）

```bash
# 1. 克隆或下载项目
cd 教学设计网页

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器打开 http://localhost:5173
```

### 部署到 GitHub Pages

```bash
# 1. 推送到 GitHub
git init
git add .
git commit -m "初始化教学设计生成器"
git remote add origin https://github.com/你的用户名/teaching-design-generator.git
git push -u origin main

# 2. 在 GitHub 仓库 Settings > Pages 中
#    Source 选择 "GitHub Actions"
# 3. 每次推送自动部署，几秒后即可访问
```

### 本地离线使用

```bash
npm run build
# 打开 dist/index.html 即可使用（完全无需服务器）
```

## 🎨 设计原则

本工具融合以下理论与实践：

| 理论 | 来源 | 核心观点 |
|------|------|----------|
| 最近发展区 | 维果茨基 | 最有价值的学习发生在现有水平之上、在帮助下可达到的区域 |
| 理想困难 | Bjork夫妇 | 让学习更费力反而产生更持久的长期效果 |
| 有效失败 | Kapur | 先让学生尝试失败再教学，比先教学后练习更有效 |
| 自我决定理论 | Ryan & Deci | 自主性、胜任感、关系感是内在动机的三大基础 |
| BOPPPS模型 | ISW | B导入→O目标→P前测→P参与→P后测→S总结 |
| UbD逆向设计 | Wiggins & McTighe | 先定评估证据，再设计教学活动 |

### 五项教学设计原则

1. **动机优先** — 先建立学生的"困难接受意愿"
2. **困难前置** — 困难优先于AI辅助，先经历"困惑→探索"
3. **过程保留** — AI只呈现信息验证结论，不替代思考过程
4. **困难指征** — 学生困难表现是诊断认知状态的信号
5. **抽象保护** — 保护知识抽象性，不过度依赖AI可视化

## 🤖 AI增强配置

1. 进入「设置」页面
2. 选择AI服务商（推荐DeepSeek，性价比最高）
3. 输入API密钥
4. 点击「测试连接」验证
5. 在生成器页面，可对各板块点击AI增强

**支持的服务商**：DeepSeek | OpenAI | 智谱GLM | 通义千问 | 自定义端点

> 没有API密钥？完全不影响使用！所有模板生成、范例加载、打印导出功能均不需要AI。

## 📂 项目结构

```
teaching-design-generator/
├── src/
│   ├── types/          # 核心数据类型（TeachingDesign等）
│   ├── store/          # Zustand状态管理
│   ├── templates/      # 3种教学设计模板
│   ├── engine/         # 生成引擎 + 渲染引擎
│   ├── ai/             # AI客户端 + 提示词
│   ├── data/           # 学科数据 + 课例库
│   └── components/     # React组件
├── .github/workflows/  # GitHub Actions自动部署
└── dist/               # 编译后的静态文件
```

## 🛠 技术栈

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Zustand（状态管理）
- React Router 7（HashRouter，支持file://协议）
- Lucide React（图标）

## 📄 License

MIT License — 自由使用、修改和分发。
