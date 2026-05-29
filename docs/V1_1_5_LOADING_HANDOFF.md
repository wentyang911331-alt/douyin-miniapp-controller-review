# 1.1.5 Loading 设计交付说明

## 目标

进入控制器横评页面时展示 loading 动画。即使页面秒开，也至少展示 1 秒；如果真实加载超过 1 秒，则等真实加载完成后再关闭。

## 设计交付物

设计侧可以交付 HTML / CSS / JS 代码，但前端会转译为原生抖音小程序代码。

请尽量提供：

- loading 的静态结构
- 动画 CSS 或关键帧
- 深色模式效果
- 明亮模式效果
- 背景高斯模糊或压暗效果
- 关键尺寸、颜色、圆角、透明度
- 是否使用 logo mark

## 小程序约束

- 不使用 `window`
- 不使用 `document`
- 不使用 `innerHTML`
- 不依赖浏览器 DOM 查询
- 不依赖外链脚本
- 不依赖远程字体
- 不直接引入浏览器动画库
- SVG / 图片资源需要放入项目本地目录

## 运行逻辑

- 页面进入时立即显示 loading。
- loading 最短展示时间为 1000ms。
- 页面真实加载完成前，loading 不关闭。
- 页面真实加载完成且已展示满 1000ms 后，loading 关闭。
- loading 背后的主页面需要模糊或压暗。
- loading 关闭不得影响主题、高亮产品、列显示、排序、排行榜等原有状态。

## 当前接入状态

- 已接入原生抖音小程序页面。
- 页面结构位于 `pages/controller-review/index.ttml` 的 `mt-loading` 区块。
- 样式位于 `pages/controller-review/index.ttss` 的 `mt-*` loading 样式与 keyframes。
- 状态机位于 `pages/controller-review/index.js` 的 `startEntryLoading`、`markEntryReady`、`finishEntryLoading`、`closeEntryLoading` 等方法。
- 当前页面为静态数据，真实加载完成点使用 `onReady`；仍保留最短 1000ms 展示。
- UI 交付包中的 inline SVG 已转译为小程序 Canvas V2 绘制；不支持 canvas 节点时保留 view 组合动画兜底，不直接进入生产 TTML。

## 品牌资源

当前已准备圆形 logo mark：

- `assets/brand/motuo-mark-dark.svg`
- `assets/brand/motuo-mark-light.svg`
- `assets/brand/motuo-mark-app-icon.png`

深色模式圆底为 `#5E7BFF`，明亮模式圆底为 `#3B54D6`，内部图形为白色。

SVG 资源用于设计交接和后续品牌复用；PNG 资源用于平台侧小程序 logo 配置。当前进入页 loading 为了实现描边动画，运行时使用 Canvas V2 直接绘制同一套 logo 笔画；如果 Canvas V2 不可用，再使用 view 笔画动画兜底。
