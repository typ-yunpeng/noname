# 无名杀 - 简化版

一个基于 Vue 3 + TypeScript + Vite 的简化版三国杀卡牌游戏。

## 项目简介

这是无名杀项目的简化重构版本，旨在提供一个清晰、易维护、可扩展的三国杀游戏实现。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供类型安全
- **Vite** - 下一代前端构建工具

## 项目结构

```
noname-simple/
├── src/
│   ├── core/              # 核心游戏逻辑
│   │   ├── game.ts       # 游戏主类
│   │   ├── player.ts     # 玩家类
│   │   └── card.ts       # 卡牌类
│   ├── components/        # Vue 组件
│   │   ├── App.vue       # 根组件
│   │   ├── GameArena.vue # 游戏场地
│   │   └── PlayerInfo.vue # 玩家信息
│   ├── types/            # TypeScript 类型定义
│   │   └── index.ts      # 核心类型
│   ├── App.vue           # 应用主组件
│   ├── main.ts           # 应用入口
│   └── style.css         # 全局样式
├── public/               # 静态资源
├── index.html            # HTML 模板
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 配置
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 当前功能

### 已实现（阶段1）

- ✅ 项目基础架构搭建
- ✅ TypeScript 类型系统
- ✅ 核心游戏引擎框架
- ✅ 玩家类实现
- ✅ 卡牌类实现
- ✅ 基础 UI 组件
- ✅ 游戏场地布局

### 待实现（后续阶段）

- ⏳ 游戏数据层（武将、卡牌、技能）
- ⏳ 完整的游戏流程
- ⏳ 卡牌使用逻辑
- ⏳ 技能系统
- ⏳ 回合制流程
- ⏳ 胜负判定

## 开发路线

### 阶段1：基础架构搭建 ✅
- 初始化项目（Vite + Vue 3 + TypeScript）
- 配置开发环境
- 设计项目结构
- 定义核心类型
- 搭建基础UI框架

### 阶段2：核心游戏引擎（进行中）
- 实现Game类（游戏流程控制）
- 实现Player类（玩家管理）
- 实现Card类（卡牌系统）
- 实现回合制流程
- 实现胜负判定

### 阶段3：数据层实现
- 实现标准武将包
- 实现基本卡牌包
- 实现技能系统
- 数据加载和管理

### 阶段4：用户界面开发
- 实现游戏场地布局
- 实现玩家信息展示
- 实现手牌区交互
- 实现技能按钮
- 实现卡牌使用交互

### 阶段5：游戏逻辑完善
- 实现卡牌使用逻辑
- 实现技能触发机制
- 实现判定阶段
- 实现弃牌阶段
- 实现游戏结束判定

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

GPL-3.0

## 致谢

本项目基于原无名杀项目进行简化重构，感谢原作者的贡献。