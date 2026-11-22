# 项目简介与构建、启动指南

本文面向第一次接触本仓库的开发者，简单介绍《无名杀》是什么，以及如何构建、如何启动本项目。
装机与常见问题请配合阅读 [如何运行无名杀](./how-to-start.md)。

## 一、项目简介

《无名杀》（noname）是一款基于 [GPL-3.0](../LICENSE) 协议开源的、以三国杀玩法为核心的卡牌游戏。

- **纯 Web 技术实现**：游戏本体是 HTML + TypeScript（ESM）+ Vue 3，由 Vite 构建，同一套代码可运行在以下环境：
  - 网页端：现代浏览器（Chromium >= 91、Safari >= 16.4，暂不支持 Firefox）
  - 桌面端：Electron 打包的 Windows / macOS / Linux 客户端
  - 移动端：Capacitor 封装的 Android 客户端
  - 本地服务端：`@noname/fs` 启动的本地文件服务，静态托管构建产物并提供文件读写接口
- **完整的三国杀玩法**：武将、卡牌、技能、游戏事件与阶段循环；内置身份、国战、斗地主、塔防、战棋、Boss 挑战等多种模式，可与人机 AI 对战，也支持通过 WebSocket 服务器联机对战。
- **可扩展**：支持加载第三方扩展（武将、卡牌、模式、界面、素材等），内置若干扩展；扩展可以使用 TypeScript 和 Vue 单文件组件开发，由 `@noname/jit` 在运行时编译，无需提前构建。
- **版本**：以 `apps/core/package.json` 的 `version` 字段为准（当前为 1.11.4.x）。

## 二、仓库结构

本项目是 pnpm workspace，根目录下分为应用（`apps/`）、库（`packages/`）、脚本（`scripts/`）和文档（`docs/`）四部分：

| 路径                 | 说明                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `apps/core`          | 游戏本体：引擎、UI、AI、武将/卡牌/模式、素材、内置扩展            |
| `apps/electron`      | 桌面端外壳，基于 Electron + electron-builder                      |
| `apps/mobile`        | 移动端外壳，基于 Capacitor（Android 工程在 `apps/mobile/android`） |
| `packages/fs`        | 本地文件服务（Fastify）：开发时提供文件读写接口，也可静态托管产物 |
| `packages/jit`       | Vite 插件：让扩展在运行时编译 TypeScript / Vue 单文件组件         |
| `packages/server`    | WebSocket 联机服务器                                              |
| `packages/extension` | 扩展工作区，`pnpm init:extension` 生成的扩展放在这里              |
| `scripts`            | 根级开发、构建、打包脚本                                          |
| `docs`               | 项目文档                                                          |

游戏本体的主要结构（`apps/core`）：

| 路径                          | 说明                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| `noname/`                     | 引擎与界面源码：`init` 启动流程、`game` 事件系统、`ui`、`ai`、`get`、`lib` 等 |
| `character/` `card/` `mode/`  | 武将、卡牌、模式                                           |
| `extension/`                  | 内置扩展                                                   |
| `audio/` `image/` `font/` `theme/` `layout/` | 音频、图片、字体、主题、界面布局素材 |
| `game/`                       | 游戏配置与更新日志                                         |
| `index.html`                  | 入口页面                                                   |

## 三、环境要求

| 依赖     | 版本要求                              |
| -------- | ------------------------------------- |
| Node.js  | `^20.19.0 \|\| >=22.12.0`（推荐 22 LTS 或 24） |
| pnpm     | `>= 9`                                |
| 运行环境 | Chromium >= 91 或 Safari >= 16.4（暂不支持 Firefox） |

## 四、安装依赖

在项目根目录执行：

```bash
pnpm install
```

`pnpm-workspace.yaml` 中将 `apps/*`、`packages/*`、`packages/extension/*` 声明为 workspace 包，根目录安装即可。

## 五、构建

| 命令                         | 产物与说明                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pnpm build`                 | 构建**完整包**到 `dist/`：先构建本体（`pnpm -F noname build`），再合并本体产物、素材、内置扩展、`docs`、`LICENSE` 和 `README.md`，可直接用于静态托管或发版 |
| `pnpm -F noname build`       | 只构建游戏本体运行时，输出到 `apps/core/dist`（体积小，不含内置扩展和素材副本）                              |
| `pnpm generateTestPack`      | 先 `pnpm build`，再生成测试包到 `output/testpack`                                                              |
| `pnpm lint`                  | 对各 workspace 包执行 ESLint 检查（无报错即通过）                                                              |

> 构建目标为 `chrome91` 与 `safari16.4`（见 `apps/core/scripts/build.ts`）。

### 桌面端安装包

`electron` 打包会读取 `apps/core/dist` 与根目录的 `dist/`，因此需先执行 `pnpm build`，再在项目根目录执行对应平台的命令：

```bash
pnpm build

pnpm -F @noname/electron build:win     # Windows，产物在 output/
pnpm -F @noname/electron build:linux   # Linux AppImage
pnpm -F @noname/electron build:mac     # macOS dmg
```

产物输出到根目录的 `output/` 文件夹；macOS 上如需调整芯片架构（Intel / Apple Silicon），请修改 `apps/electron/build.ts` 中的 `main(...)` 参数。

### 移动端（Android）

移动端使用 Capacitor，需已配置 Android 开发环境：

```bash
pnpm -F @noname/mobile sync   # 同步 Capacitor 工程
```

然后用 Android Studio 打开 `apps/mobile/android` 编译安装。

## 六、启动

### 1. 开发模式（推荐）

```bash
pnpm dev
```

该命令由 `scripts/dev.ts` 启动三件事：

- `@noname/fs` 开发后端：`http://127.0.0.1:8089`，提供文件读写接口；
- `noname`（游戏本体）的 Vite 开发服务器：`http://127.0.0.1:8080`，并自动打开浏览器；文件读写请求由 Vite 代理到 8089；
- `packages/extension/**` 下的扩展监听构建（存在扩展包时生效）。

修改 `apps/core` 下的源码后刷新页面即可看到效果，无需手动重新构建。

### 2. 运行构建产物

```bash
pnpm build
pnpm serve
```

`pnpm serve` 用 `@noname/fs` 静态托管 `dist/` 目录，监听 `http://localhost:8089`（Windows 下会自动打开浏览器）。
也可以一步完成构建与启动：

```bash
pnpm start
```

### 3. 桌面端开发

```bash
pnpm -F @noname/electron dev
```

它会同时启动 Electron 外壳与游戏本体的开发服务器。

### 4. 联机服务器

```bash
pnpm -F @noname/server dev
```

WebSocket 服务监听 `8082` 端口；在游戏的联机模式中把服务器地址填写为 `localhost:8082` 即可进入联机大厅。

### 5. 扩展开发

```bash
pnpm init:extension <扩展名> [--author <作者>] [--vue]
```

命令会在 `packages/extension/<扩展名>` 下生成扩展模板（加 `--vue` 则生成使用 Vue 单文件组件的模板），随后可用 `pnpm dev` 边开发边调试。

## 七、常用命令速查

| 命令                                  | 说明                                     |
| ------------------------------------- | ---------------------------------------- |
| `pnpm install`                        | 安装全部 workspace 依赖                  |
| `pnpm dev`                            | 开发模式（8080 前端 + 8089 文件服务）    |
| `pnpm build`                          | 构建完整包到 `dist/`                     |
| `pnpm serve`                          | 静态托管 `dist/`（8089）                 |
| `pnpm start`                          | `pnpm build` + `pnpm serve`              |
| `pnpm generateTestPack`               | 构建并生成测试包到 `output/testpack`     |
| `pnpm lint`                           | ESLint 检查                              |
| `pnpm -F noname build`                | 只构建本体运行时到 `apps/core/dist`      |
| `pnpm -F @noname/electron build:win`  | 打包 Windows 客户端到 `output/`          |
| `pnpm -F @noname/server dev`          | 启动联机服务器（8082）                   |
| `pnpm -F @noname/mobile sync`         | 同步 Capacitor Android 工程              |
| `pnpm init:extension <name>`          | 生成扩展模板                             |

## 八、相关文档

- [如何运行无名杀（含常见问题）](./how-to-start.md)
- [游戏启动到进行时流程](./game-startup-flow.md)
- [异步操作指南](./async-guide.md) / [异步操作步骤指南](./step-to-async-guide.md)
- [技能格式](./lib-skill-format.md) / [皮肤指南](./skin-guide.md) / [音频指南](./audio-guide.md)
- [游戏事件文档目录](./game-event/)
- 项目 Wiki：<https://github.com/libnoname/noname/wiki>
- 代码出处：<https://github.com/libnoname/noname>
