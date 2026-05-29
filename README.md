# 2026年春季260级控制器对比手册

这是一个控制器横向测试结果展示项目。当前运行入口已迁移为原生抖音小程序页面，原始 HTML 继续作为历史基线保留。

## 当前版本

- 版本号：1.1.5
- 当前开发分支：`codex/v1.1.5-title-logo`
- 当前稳定标签：`v1.1.4`
- 当前状态：1.1.5 已截止，已接入原生导航标题 `摩拓` 和进入页 loading

## 重要文件

- `controller-review(1).html`：原始静态展示页面
- `app.js` / `app.json` / `app.ttss`：抖音小程序全局文件
- `project.config.json`：抖音小程序项目配置
- `pages/controller-review/`：原生小程序页面
- `assets/icons/`：本地图标资源
- `assets/brand/`：品牌 logo mark 资源
- `PROJECT_SPEC.md`：项目最高规则入口
- `docs/REQUIREMENTS.md`：需求文档
- `docs/AGENT_COLLABORATION.md`：子代理协作文档
- `docs/CONTEXT_HANDOFF.md`：上下文交接文档
- `docs/V1_1_5_LOADING_HANDOFF.md`：1.1.5 Loading 交付说明
- `docs/UI_ICON_SYSTEM.md`：圆角图标体系方案
- `docs/ui-icon-preview.html`：圆角图标预览页
- `CHANGELOG.md`：版本变更记录
- `VERSION`：当前版本号

## 1.1.5 口径

- 抖音原生导航栏标题由代码设置为 `摩拓`。
- 原生导航栏左侧小程序 logo 属于平台侧配置，页面代码不能直接替换。
- 平台侧 logo 上传可使用 `assets/brand/motuo-mark-app-icon.png`。
- 页面正文大标题保持 `2026年春季260级控制器对比手册`。
- 进入页 loading 至少展示 1 秒；真实加载未完成时持续展示，背景压暗 / 模糊。
- loading 已转译为原生小程序写法，不使用浏览器 DOM。

## 版本与备份

每个正式版本都需要：

- 更新 `VERSION`
- 更新 `CHANGELOG.md`
- 创建 Git 提交
- 创建版本标签，例如 `v1.0.0`
- 推送代码和标签到 GitHub

需要回滚时，优先从 GitHub 拉取对应标签版本。
