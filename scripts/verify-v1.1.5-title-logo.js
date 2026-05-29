#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function json(rel) {
  return JSON.parse(read(rel));
}

function ok(label) {
  console.log('ok - ' + label);
}

function assert(condition, label) {
  if (!condition) {
    throw new Error('fail - ' + label);
  }
  ok(label);
}

const version = read('VERSION').trim();
assert(version === '1.1.5', '版本号为 1.1.5');

const appJson = json('app.json');
const pageJson = json('pages/controller-review/index.json');
const pageJs = read('pages/controller-review/index.js');
const pageTtml = read('pages/controller-review/index.ttml');
const pageTtss = read('pages/controller-review/index.ttss');
const requirements = read('docs/REQUIREMENTS.md');
const handoff = read('docs/V1_1_5_LOADING_HANDOFF.md');

assert(appJson.window.navigationBarTitleText === '摩拓', '全局原生导航栏标题为 摩拓');
assert(pageJson.navigationBarTitleText === '摩拓', '页面原生导航栏标题为 摩拓');
assert(pageJs.includes("const NAV_TITLE = '摩拓';"), '运行时导航栏标题常量为 摩拓');
assert(pageJs.includes("tt.setNavigationBarTitle({ title: NAV_TITLE });"), '运行时使用 NAV_TITLE 同步标题');
assert(pageJs.includes("const PAGE_TITLE = '2026年春季260级控制器对比手册';"), '页面正文大标题保持不变');

[
  'assets/brand/motuo-mark-dark.svg',
  'assets/brand/motuo-mark-light.svg',
  'assets/brand/motuo-mark-app-icon.png'
].forEach(function(rel) {
  assert(fs.existsSync(path.join(root, rel)), rel + ' 存在');
});

assert(!fs.existsSync(path.join(root, 'assets/brand/motuo-logo-dark.svg')), '不保留完整深色文字字标资源');
assert(!fs.existsSync(path.join(root, 'assets/brand/motuo-logo-light.svg')), '不保留完整明亮文字字标资源');
assert(read('assets/brand/motuo-mark-dark.svg').includes('#5E7BFF'), '深色 logo mark 使用主题蓝');
assert(read('assets/brand/motuo-mark-light.svg').includes('#3B54D6'), '明亮 logo mark 使用主题蓝');

assert(requirements.includes('原生导航栏标题文字从 `2026年春季260级控制器对比手册` 改为 `摩拓`'), '需求文档记录标题调整');
assert(requirements.includes('原生导航栏左侧圆形小程序 logo 属于平台控制'), '需求文档记录原生 logo 平台边界');
assert(requirements.includes('motuo-mark-app-icon.png'), '需求文档记录平台上传 PNG 资源');
assert(requirements.includes('至少展示 1 秒 loading'), '需求文档记录 loading 最短展示时间');
assert(requirements.includes('高斯模糊'), '需求文档记录 loading 背景模糊');
assert(handoff.includes('1000ms'), 'loading 交付文档记录 1000ms 规则');
assert(handoff.includes('不使用 `window`'), 'loading 交付文档记录小程序约束');
assert(handoff.includes('平台侧小程序 logo 配置'), 'loading 交付文档记录 logo 资源用途');

assert(pageJs.includes('minMs: 1000'), '运行代码设置 loading 最短 1000ms');
assert(pageJs.includes('onReady()') && pageJs.includes('this.markEntryReady();'), '页面 ready 后标记真实加载完成');
assert(pageJs.includes('startEntryLoading()'), '运行代码包含 loading 启动状态机');
assert(pageJs.includes('clearEntryLoadingTimers()'), '运行代码包含 loading 计时器清理');
assert(pageJs.includes('startLoadingLogoLoop()'), '运行代码包含 logo 独立循环');
assert(pageJs.includes('initLoadingCanvas()'), '运行代码包含 canvas logo 初始化');
assert(pageJs.includes('renderLoadingCanvas()'), '运行代码包含 canvas logo 绘制');
assert(pageJs.includes('drawLogoSegment(ctx, LOADING_CANVAS.lineOne'), 'canvas 绘制第一笔真实坐标');
assert(pageJs.includes('drawLogoSegment(ctx, LOADING_CANVAS.lineTwo'), 'canvas 绘制第二笔真实坐标');
assert(pageJs.includes('finishEntryLoading()'), '运行代码包含 loading 收尾逻辑');
assert(pageJs.includes('Math.max(LOADING.fillMs + LOADING.holdMs, LOADING.minMs - elapsed)'), 'loading 关闭遵守最短展示和收尾停留');
assert(!pageJs.includes('document.'), '小程序页面 JS 不使用 document');
assert(!pageJs.includes('window.'), '小程序页面 JS 不使用 window');
assert(!pageJs.includes('innerHTML'), '小程序页面 JS 不使用 innerHTML');

assert(pageTtml.includes('class="mt-loading'), 'TTML 包含 loading 覆盖层');
assert(pageTtml.includes('loadingVisible'), 'TTML 由 loadingVisible 控制显示');
assert(pageTtml.includes('loadingProgressStyle'), 'TTML 绑定 loading 进度条样式');
assert(pageTtml.includes('<canvas id="mtLoadingCanvas" type="2d"'), 'TTML 包含 Canvas V2 logo');
assert(pageTtml.includes('tt:if="{{!loadingCanvasReady}}"'), 'TTML 包含 canvas 不可用时的 view 兜底');
assert(!pageTtml.includes('<svg'), 'TTML 不使用 inline SVG');
assert(!pageTtml.includes('<path'), 'TTML 不使用 SVG path');

assert(pageTtss.includes('.mt-loading'), 'TTSS 包含 loading 样式');
assert(pageTtss.includes('.mt-logo-canvas'), 'TTSS 包含 canvas logo 样式');
assert(pageTtss.includes('.mt-logo-fallback'), 'TTSS 包含 fallback logo 样式');
assert(pageTtss.includes('backdrop-filter: blur(2px)'), 'loading 遮罩包含背景模糊');
assert(pageTtss.includes('backdrop-filter: blur(20px)'), 'loading 卡片包含磨砂模糊');
assert(pageTtss.includes('@keyframes mt-stroke-one'), 'loading 包含第一笔描绘动画');
assert(pageTtss.includes('@keyframes mt-stroke-two'), 'loading 包含第二笔描绘动画');
assert(pageTtss.includes('@keyframes mt-dot'), 'loading 包含第三笔描绘动画');
assert(pageTtss.includes('background: var(--accent)'), 'loading 使用主题主色');

console.log('done - 1.1.5 标题 / logo / loading 口径检查通过');
