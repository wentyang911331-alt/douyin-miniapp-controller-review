# 1.1.4 QA 审计记录

## 审计目标

验证 1.1.4 是否在不改变核心功能、数据结构、交互逻辑和业务结论的前提下，尽量还原 UI 交付包视觉。

UI 交付包来源：

- `/tmp/ui-delivery-v1.1.4-review/ui-delivery-v1.1.4-visual`

当前实现入口：

- `pages/controller-review/index.ttml`
- `pages/controller-review/index.ttss`
- `pages/controller-review/index.js`

## 已通过自动检查

运行命令：

```bash
node scripts/verify-v1.1.4-ui.js
```

当前通过项包括：

- 版本号为 `1.1.4`
- JSON 和页面 JS 可解析
- `project.config.json` 不写入正式 appid，继续保持空配置 / 测试号口径
- 页面保留 `制动巡航`，不引入 UI 包中的 `自动巡航`
- TTML 不引入浏览器 HTML 标签
- 小程序代码不引入 `window` / `document` / `innerHTML` 等浏览器运行时写法
- 暗色原生导航栏为 `#0E1623` + 白色前景，明亮模式保持白色导航栏
- 图标颜色通过多状态 SVG 路径切换实现，不依赖 CSS `filter`
- 表格 / 排行切换按钮暗色未选中态无白底，选中态为主色底白字
- 排序箭头在暗色 / 明亮模式下跟随文字色
- 顶部排名角标按钮使用 `columns.svg`
- 产品色、排行榜色和软件 / 手感 tone 规则对齐 UI 包
- 高亮型号列使用不透明实色底，横滑时不透出右侧数据文字
- 自动预览 PNG 覆盖完整状态板
- 自动生成 375 / 390 / 400 / 430 宽度横滑预览图
- 自动生成 UI 交付稿同名状态图对照
- 自动生成软件最右侧横滑、完整弹窗、显示列面板三类风险定向截图

自动预览产物：

- `/tmp/controller-review-v114-ui-verify/state-board.html`
- `/tmp/controller-review-v114-ui-verify/state-board.png`
- `/tmp/controller-review-v114-ui-verify/visual-comparison.html`
- `/tmp/controller-review-v114-ui-verify/states/dark.png`
- `/tmp/controller-review-v114-ui-verify/states/light.png`
- `/tmp/controller-review-v114-ui-verify/states/modal.png`
- `/tmp/controller-review-v114-ui-verify/states/table-scroll.png`
- `/tmp/controller-review-v114-ui-verify/states/ranking.png`
- `/tmp/controller-review-v114-ui-verify/states/sort.png`
- `/tmp/controller-review-v114-ui-verify/states/selected.png`
- `/tmp/controller-review-v114-ui-verify/states/components.png`
- `/tmp/controller-review-v114-ui-verify/width-375.png`
- `/tmp/controller-review-v114-ui-verify/width-390.png`
- `/tmp/controller-review-v114-ui-verify/width-400.png`
- `/tmp/controller-review-v114-ui-verify/width-430.png`
- `/tmp/controller-review-v114-ui-verify/risk-previews/software-rightmost.png`
- `/tmp/controller-review-v114-ui-verify/risk-previews/modal-full.png`
- `/tmp/controller-review-v114-ui-verify/risk-previews/columns-panel.png`

脚本会清理截图过程中的浏览器临时配置目录，当前验收目录仅保留 HTML / PNG 证据产物，便于人工核对和后续交接。

## 已人工核对的关键状态

- 暗色首页：主题色、背景、顶部、导航、chip、表格卡片、水印层级接近 UI 包。
- 明亮首页：白底、浅灰面板、主色按钮和文字层级可读。
- 说明弹窗：居中弹出，背景压暗并带模糊，按钮与内容层级正常。
- 说明弹窗：文案已压缩为更短的小白话，弹窗主体可滚动，完整手机高度下底部按钮可见。
- 软件 / 手感 tone：good / warn / bad 使用绿 / 黄 / 红，并保留当前业务文案。
- 排行榜：产品色、#1 标识、条形图和排序按钮状态正常。
- 表格横滑 + 高亮：型号列固定在左侧，右侧数据不覆盖型号列。
- 软件最右侧横滑：已生成 `software-rightmost.png`，可见 `驻车刹车灯` 列，高亮行不覆盖固定型号列。
- 显示列面板：列项使用主色底白字，垂直对齐正常。
- 抖音原生顶栏：已在开发者工具中核对暗色深底白前景、明亮白底黑前景。

## 平台组件处理

抖音原生 `反馈`、`三点`、`关闭` 属于平台顶栏组件，不是页面 TTML 节点，不能通过页面 CSS 单独设置。
根据抖音开放平台文档，`navigationBarTextStyle` 会影响标题、右胶囊和左返回箭头颜色，且只支持黑 / 白；`tt.setNavigationBarColor` 可动态设置导航栏背景，并且前景色也仅支持白色或黑色。

当前处理方式：

- 暗色模式：通过 JSON 默认配置和 `tt.setNavigationBarColor` 使用 `#0E1623` 背景 + 白色前景。
- 明亮模式：通过 `tt.setNavigationBarColor` 使用 `#FFFFFF` 背景 + 黑色前景。
- 同步时机：`onLoad`、`onShow`、主题切换后都重新同步，避免平台原生顶栏在重新显示页面后回到默认色。

## 图标实现说明

UI 交付包使用 `currentColor` 控制 SVG 颜色。原生小程序页面使用 `<image>` 加载 SVG 时，图片内部无法可靠继承页面文字色，因此生产实现改为多状态 SVG 变体：

- 默认暗色：`#93A0B5`
- 默认明亮：`#5B6677`
- 暗色主色选中：`#5E7BFF`
- 明亮主色选中：`#3B54D6`
- 主色按钮内图标：`#FFFFFF`
- 排序按钮文字色图标：暗色 `#EDF1F8` / 明亮 `#0F172A`

页面通过数据字段切换图标路径，不依赖 CSS `filter` 给 SVG 变色。

## 与 UI 静态稿的有意差异

UI 包的静态 `render.js` 用于视觉状态展示，并没有完全复刻当前小程序的真实排序逻辑。当前小程序保留 1.1.2 的真实排序逻辑，因此部分表格行顺序可能与 UI 静态截图不同。

这个差异属于“保留功能和交互逻辑”的结果，不按视觉换肤问题处理。

业务文案差异：

- UI 包写作 `自动巡航`
- 当前项目继续使用已确认文案 `制动巡航`

## 最终确认

1. 用户已确认 1.1.4 视觉验收通过。
2. 本版本进入提交、打 `v1.1.4` tag，并推送 GitHub 作为版本备份流程。
