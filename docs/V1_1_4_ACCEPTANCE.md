# 1.1.4 验收说明

## 目标

1.1.4 的验收目标是尽量还原 UI 交付包视觉，前端目标还原度为 98%。

本版本只做视觉换肤，不改核心功能、数据结构、交互逻辑、排序逻辑、模块顺序和业务结论。

## 已确认口径

- 控制器代表色和排行榜颜色以 UI 交付包为准。
- 业务判断处颜色规则以 UI 交付包为准。
- 业务文案以当前项目为准，继续使用 `制动巡航`，不改为 UI 包中的 `自动巡航`。

## 自动检查

在项目根目录运行：

```bash
node scripts/verify-v1.1.4-ui.js
```

脚本会检查：

- `VERSION` 是否为 `1.1.4`
- JSON 配置和页面 JS 是否可解析
- `project.config.json` 不写入正式 appid，继续使用空配置 / 测试号口径
- 小程序页面中是否保留 `制动巡航`
- 小程序页面中是否不存在 `自动巡航`
- 是否未引入浏览器 HTML 标签和浏览器运行时写法
- 产品代表色是否使用 UI 交付包版本
- 软件 / 手感模块 good / warn / bad 业务颜色规则是否正确
- 主题 tokens 是否已替换为 UI 交付包版本
- 旧色值是否未残留在运行样式中
- SVG 图标资源数量和线性圆角风格是否正确
- 图标颜色是否通过多状态 SVG 路径切换实现，不依赖 CSS `filter`
- 表格 / 排行切换按钮：未选中态暗色下不得出现白底，选中态为主色底白字
- 排序按钮上下箭头需在暗色 / 明亮模式下跟随文字色
- 顶部排名角标按钮使用 UI 包的列图标风格
- 默认首页状态对齐 UI 包：最佳徽章和排名角标默认关闭
- 抖音原生顶栏黑暗模式背景使用底层深色，明亮模式保持白色
- 高亮产品后横向滚动表格，右侧数据文字不得覆盖左侧固定型号列

脚本还会生成本地多状态预览：

- HTML：`/tmp/controller-review-v114-ui-verify/state-board.html`
- PNG：`/tmp/controller-review-v114-ui-verify/state-board.png`
- UI 交付稿 / 当前实现左右对照入口：`/tmp/controller-review-v114-ui-verify/visual-comparison.html`
- 同名 UI 状态截图：`/tmp/controller-review-v114-ui-verify/states/*.png`
- 375 / 390 / 400 / 430 宽度横滑预览：
  - `/tmp/controller-review-v114-ui-verify/width-375.png`
  - `/tmp/controller-review-v114-ui-verify/width-390.png`
  - `/tmp/controller-review-v114-ui-verify/width-400.png`
  - `/tmp/controller-review-v114-ui-verify/width-430.png`
- 风险定向预览：
  - `/tmp/controller-review-v114-ui-verify/risk-previews/software-rightmost.png`
  - `/tmp/controller-review-v114-ui-verify/risk-previews/modal-full.png`
  - `/tmp/controller-review-v114-ui-verify/risk-previews/columns-panel.png`

脚本会自动清理截图过程中产生的浏览器临时配置，只保留 HTML / PNG 验收产物。

## 人工视觉验收

在抖音开发者工具中打开项目根目录：

```text
/Users/tatajialideheipingguo/Documents/抖音小程序开发-v1.1.4
```

需要重点检查：

- 暗色模式和明亮模式都无旧色残留。
- 顶部标题、导航、产品 chip、工具图标不挤压。
- 默认首屏不展示排名角标和“最佳”徽章；开启后才出现。
- 表格 / 排行切换按钮在暗色模式下，未选中项为透明底和次级灰字，不得出现白底。
- 排行排序按钮的箭头颜色需要与“升序 / 降序”文字一致。
- 抖音原生“反馈 / 三点 / 关闭”属于平台顶栏组件，不是页面节点；黑暗模式通过原生导航栏深色背景和白色前景纳入整体配色，明亮模式保持白底黑字。页面 `onLoad`、`onShow`、主题切换时都需要同步一次，避免平台顶栏在重新显示后恢复默认色。
- 表格横滑顺畅，型号列固定在左侧；选中任意高亮产品后，横向滚动时右侧数据文字不得盖到型号列上。
- 软件 / 手感模块的 good / warn / bad 颜色符合 UI 包。
- 多产品高亮时 chip、表格、排行榜颜色同步。
- 排行榜 #1 为主色方块，条形颜色使用对应产品色。
- 显示列面板文字垂直居中。
- 说明弹窗居中，遮罩压暗，按钮和 note 区域接近 UI 包。
- 说明弹窗文案保持小白话短句；内容区可滚动，底部“我知道了”按钮在完整手机高度内可见。
- 水印足够淡，不抢正文。
- 375 / 390 / 400 / 430 宽度下无明显文字溢出或布局断裂。

## 当前限制

本机已可用抖音开发者工具，并已能导入项目运行。当前已在开发者工具中核对暗色和明亮模式下的抖音原生顶栏：暗色为深色导航栏白色前景，明亮模式为白色导航栏黑色前景。

用户已确认 1.1.4 人工视觉验收通过；本版本进入提交、打 `v1.1.4` tag 并推送 GitHub 备份流程。
