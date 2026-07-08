# HomeGPT

基于 AI Agent 的家庭空间设计助手，帮助用户设计未来想要的生活，而非仅仅装修房子。

## ✨ 特性

- 📐 **智能户型分析** - 上传户型图，AI 自动识别户型结构、采光、通风、动静分区
- 👨‍👩‍👧‍👦 **家庭生活规划** - 根据家庭成员、生活习惯定制专属空间方案
- 💰 **装修预算规划** - 智能预算分配，提供详细费用估算和省钱建议
- 🎨 **AI 效果图生成** - 一键生成各空间装修效果图
- 📄 **报告导出** - 支持导出完整设计方案报告（含图片）
- 📱 **响应式设计** - 完美适配手机、平板、桌面端

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- Yarn >= 1.22.0

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-username/home-gpt.git
cd home-gpt

# 安装依赖
yarn install
```

### 配置 API Key

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 AI API Key：

```env
USE_AI=true
ARK_API_KEY=your-api-key-here
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
ARK_MODEL_ID=doubao-seed-2-1-pro-260628
ARK_IMAGE_MODEL_ID=doubao-seedream-4-0-250828
```

### 启动开发服务器

```bash
yarn dev
```

访问 http://localhost:3000 即可使用。

### 构建生产版本

```bash
yarn build
yarn start
```

## 📖 使用流程

1. **上传户型图** - 支持图片（JPG/PNG）、PDF、截图
2. **填写需求** - 家庭成员、预算（万元）、装修风格、特殊需求
3. **AI 分析** - 自动召集户型分析师、家庭规划师、收纳设计师、装修预算师
4. **查看报告** - 一页式报告展示：评分、优缺点、建议、预算分配、AI 效果图

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 3 |
| 图标 | Lucide React |
| 状态管理 | React Context |
| 存储 | localStorage |
| AI 服务 | 字节跳动豆包 API / 即梦 API |

## 📁 项目结构

```
home-gpt/
├── app/                    # Next.js 应用路由
│   ├── upload/             # 上传页面
│   ├── requirements/       # 需求填写页面
│   ├── analyzing/          # AI 分析页面
│   ├── result/             # 结果展示页面
│   ├── api/                # API 路由
│   │   ├── analyze/        # 户型分析 API
│   │   └── generate/       # 图片生成 API
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # 通用组件
│   └── StepIndicator.tsx   # 步骤指示器
├── context/                # React Context
│   └── ProjectContext.tsx  # 项目状态管理
├── types/                  # TypeScript 类型定义
│   └── index.ts            # 全局类型
├── utils/                  # 工具函数
│   ├── ai.ts               # AI API 封装
│   ├── logger.ts           # AI 调用日志
│   └── storage.ts          # localStorage 操作
├── .env.local              # 环境变量（需自行创建）
├── next.config.js          # Next.js 配置
├── tailwind.config.ts      # Tailwind CSS 配置
└── package.json            # 项目依赖
```

## 🔌 API 配置说明

### 字节跳动豆包 API

本项目使用字节跳动的豆包大模型和即梦图像生成模型：

1. 注册 [火山引擎](https://www.volcengine.com/) 账号
2. 创建 API Key，确保开通以下服务：
   - 豆包大模型（doubao-seed-2-1-pro-260628）
   - 即梦图像生成（doubao-seedream-4-0-250828）

### API 调用日志

服务端运行时会在终端输出详细的 AI 调用日志，包括：
- 请求提示词（Prompt）
- API 接口和模型名称
- 响应内容
- 调用耗时和状态

## 📝 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系

如有问题或建议，欢迎通过 Issue 交流。
