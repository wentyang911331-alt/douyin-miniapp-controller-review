# 上下文交接文档

## 当前状态

项目中的核心原始页面文件为：

- `controller-review(1).html`

当前阶段已完成 1.1.1 原生抖音小程序迁移。

当前版本为 1.1.1，对应 Git 标签为 `v1.1.1`。该版本包含原生抖音小程序项目结构和页面迁移。

UI 图标体系已验收通过并接入页面。采用「圆角容器 + 圆角线性 SVG」；最佳徽章采用「星标 + 最佳」；排名角标保留 `#1/#2/#3`。

1.1.1 已迁移为原生抖音小程序项目。`controller-review(1).html` 作为历史基线保留，不再作为小程序运行入口。

1.1.1 实施口径已确认：静态数据先放在小程序前端代码中；横向滚动优先保证可读性，首列固定根据实现成本决定；暂不加入 `appid`；主控继续调度前端子代理，UI 子代理只在视觉偏差明显时介入。

## 项目一句话

这是一个控制线横向测试结果展示项目。1.1.0 已完成静态 HTML 测评报告页面，1.1.1 已迁移为原生抖音小程序项目。

## 已确认口径

- 标题：2026 年春季控制线横屏对比手册
- 水印：小拓子横评
- UI 风格：测评报告
- 说明方式：模块标题旁信息图标，点击后弹出小浮窗
- 1.1.1 落地方式：创建原生抖音小程序工程结构，不使用 `web-view`
- 小程序迁移：使用 `.ttml`、`.ttss`、`.js`、`.json` 组织页面，交互使用 `Page`、`data`、`setData`、`bindtap`
- 后端：当前不需要
- 子代理：1.1.1 优先启用前端子代理，UI 子代理只在迁移后出现明显视觉偏差时介入

## 当前非目标

- 不创建后端
- 不接入接口
- 不引入第三方依赖
- 不改测试数据

## 下一步

1. 后续新需求先写入需求文档。
2. 按新版本号继续 UI/前端协作、实现和验证。
3. 每个正式版本继续提交、打标签并推送 GitHub 备份。

## 重要文件

- 当前版本号：`VERSION`
- 版本记录：`CHANGELOG.md`
- 项目规范入口：`PROJECT_SPEC.md`
- 需求文档：`docs/REQUIREMENTS.md`
- 子代理协作：`docs/AGENT_COLLABORATION.md`
- 上下文交接：`docs/CONTEXT_HANDOFF.md`
- 图标体系：`docs/UI_ICON_SYSTEM.md`
- 图标预览：`docs/ui-icon-preview.html`
- 小程序全局配置：`app.json`
- 小程序页面：`pages/controller-review/index.ttml`
- 小程序页面逻辑：`pages/controller-review/index.js`
- 小程序页面样式：`pages/controller-review/index.ttss`
- 原始页面：`controller-review(1).html`

## 恢复工作时先读

如果发生上下文压缩、会话恢复或更换代理，先读：

1. `PROJECT_SPEC.md`
2. `docs/CONTEXT_HANDOFF.md`
3. `docs/REQUIREMENTS.md`
4. `docs/AGENT_COLLABORATION.md`

确认当前仍处于哪个阶段后再行动。
