# 上下文交接文档

## 当前状态

项目中的核心原始页面文件为：

- `controller-review(1).html`

当前阶段已完成 1.1.2 视觉、交互和说明文案修补，并已从 `v1.1.2` 建立 1.1.4 视觉换肤开发分支。

当前开发版本为 1.1.4，开发分支为 `codex/v1.1.4-visual-reskin-from-v1.1.2`。代码基线为 `v1.1.2`。`v1.1.3` 保留为闲置历史阶段，不进入本次实现范围。

1.1.4 已收到 UI 侧交付的静态 HTML/CSS 状态稿。用户已确认三个关键口径：控制器代表色和排行榜颜色以 UI 为准；业务文案以当前项目为准，`制动巡航` 不改为 `自动巡航`；业务判断处的颜色规则以 UI 为准。下一步进入前端落地。

UI 图标体系已验收通过并接入页面。采用「圆角容器 + 圆角线性 SVG」；最佳徽章采用「星标 + 最佳」；排名角标保留 `#1/#2/#3`。

1.1.1 已迁移为原生抖音小程序项目。`controller-review(1).html` 作为历史基线保留，不再作为小程序运行入口。

1.1.1 实施口径已确认：静态数据先放在小程序前端代码中；横向滚动优先保证可读性，首列固定根据实现成本决定；暂不加入 `appid`；主控继续调度前端子代理，UI 子代理只在视觉偏差明显时介入。

1.1.2 已完成原生小程序迁移后的视觉、交互和说明文案修补。重点包括标题改为 `2026年春季260级控制器对比手册`、模块导航简称化、明亮模式导航栏和图标适配、图标蓝与低饱和灰蓝配色体系、水印 `小拓子` 恢复、说明浮窗居中弹出和小白话术重写。

当前开发节奏已确认：主控调动两个子代理协作。UI 子代理先使用 Figma 插件产出可验收 UI 方案；前端子代理先做只读落地方案。用户已验收 UI，1.1.2 前端实现已完成。

前端子代理只读方案已完成，结论是 1.1.2 不需要后端，所有需求已在原生小程序前端中完成。UI 子代理已完成 Figma 验收稿，链接为 `https://www.figma.com/design/hT8h1tjecsM2zBVmBCXUQD`。用户已验收通过，代码实现已完成。

## 项目一句话

这是一个控制器横向测试结果展示项目。1.1.0 已完成静态 HTML 测评报告页面，1.1.1 已迁移为原生抖音小程序项目，1.1.4 在 1.1.2 基础上还原 UI 交付包的视觉换肤效果。

## 1.1.4 当前口径

- 版本号：1.1.4
- 分支：`codex/v1.1.4-visual-reskin-from-v1.1.2`
- 基线：`v1.1.2`
- `v1.1.3`：闲置，不继续推进
- 范围：只做 UI 视觉换肤，还原 UI 交付包
- 不改：功能、数据结构、交互逻辑、业务结论、模块顺序
- 当前状态：用户已确认 1.1.4 视觉验收通过，前端视觉落地已完成 tokens、图标、产品色、业务颜色规则、主要 TTSS 样式、默认状态、表格 / 排行按钮暗色态、排序箭头跟色、抖音原生顶栏暗 / 亮配置、表格高亮后横滑不覆盖型号列修复、说明弹窗完整按钮可见、UI 同名状态截图对照和风险定向截图
- UI 包采纳：控制器代表色、排行榜颜色、业务判断颜色规则
- UI 包不采纳：`自动巡航` 文案，仍保留当前项目的 `制动巡航`
- 自动验收入口：`node scripts/verify-v1.1.4-ui.js`
- 自动验收产物：`/tmp/controller-review-v114-ui-verify/state-board.html`、`/tmp/controller-review-v114-ui-verify/state-board.png`、`/tmp/controller-review-v114-ui-verify/visual-comparison.html`、`/tmp/controller-review-v114-ui-verify/states/*.png`、`/tmp/controller-review-v114-ui-verify/risk-previews/*.png`
- 默认首页状态：最佳徽章和排名角标默认关闭；顶部排名角标按钮使用 `columns.svg` 风格；表格 / 排行切换未选中态不得出现白底。

## 1.1.1 历史基线口径

- 标题：2026 年春季控制线横屏对比手册
- 水印：小拓子横评
- UI 风格：测评报告
- 说明方式：模块标题旁信息图标，点击后弹出小浮窗
- 1.1.1 落地方式：创建原生抖音小程序工程结构，不使用 `web-view`
- 小程序迁移：使用 `.ttml`、`.ttss`、`.js`、`.json` 组织页面，交互使用 `Page`、`data`、`setData`、`bindtap`
- 后端：当前不需要
- 子代理：1.1.1 优先启用前端子代理，UI 子代理只在迁移后出现明显视觉偏差时介入

## 1.1.2 已确认口径

- 标题：2026年春季260级控制器对比手册
- 水印：小拓子
- 模块导航：由数字切换为简称，例如 `1. 硬件`、`2. 软件`
- UI 风格：测评报告，整体高亮改为图标蓝并同步调整低纯度低明度灰蓝辅色；主题色底的选中标签统一白字；当前 UI 稿建议底层背景 `#101722`、暗色内容面 `#171F2E`
- 说明方式：模块标题旁信息图标，点击后居中弹出说明浮窗，背景暗化或模糊
- 后端：当前不需要
- 子代理：前端子代理为主，UI 子代理按需介入配色、弹窗和水印细节

## 当前非目标

- 不创建后端
- 不接入接口
- 不引入第三方依赖
- 不改测试数据

## 下一步

1. 提交 1.1.4 视觉换肤实现。
2. 打 `v1.1.4` 标签并推送 GitHub 备份。
3. 如验收提出微调，继续只在视觉层修改，不改功能、数据结构、交互逻辑和业务结论。

## 重要文件

- 当前版本号：`VERSION`
- 版本记录：`CHANGELOG.md`
- 项目规范入口：`PROJECT_SPEC.md`
- 需求文档：`docs/REQUIREMENTS.md`
- 子代理协作：`docs/AGENT_COLLABORATION.md`
- 上下文交接：`docs/CONTEXT_HANDOFF.md`
- 1.1.4 视觉换肤说明：`docs/V1_1_4_VISUAL_RESKIN.md`
- 1.1.4 验收说明：`docs/V1_1_4_ACCEPTANCE.md`
- 1.1.4 QA 审计记录：`docs/V1_1_4_QA_AUDIT.md`
- 1.1.4 自动验收脚本：`scripts/verify-v1.1.4-ui.js`
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
5. `docs/V1_1_4_VISUAL_RESKIN.md`
6. `docs/V1_1_4_ACCEPTANCE.md`
7. `docs/V1_1_4_QA_AUDIT.md`

确认当前仍处于哪个阶段后再行动。
