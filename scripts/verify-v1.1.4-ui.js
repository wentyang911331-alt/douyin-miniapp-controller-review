#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const childProcess = require('child_process');

const repo = path.resolve(__dirname, '..');
const outDir = path.join('/tmp', 'controller-review-v114-ui-verify');
const previewHtml = path.join(outDir, 'state-board.html');
const previewPng = path.join(outDir, 'state-board.png');
const stateOutDir = path.join(outDir, 'states');
const riskOutDir = path.join(outDir, 'risk-previews');
const compareHtml = path.join(outDir, 'visual-comparison.html');
const previewMinHeight = 3400;
const responsiveWidths = [375, 390, 400, 430];
const uiDeliveryDir = '/tmp/ui-delivery-v1.1.4-review/ui-delivery-v1.1.4-visual';

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function assert(name, condition, detail = '') {
  if (!condition) {
    throw new Error(`${name}${detail ? `: ${detail}` : ''}`);
  }
  console.log(`ok - ${name}`);
}

function listFiles(dir) {
  const abs = path.join(repo, dir);
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(rel);
    return [rel];
  });
}

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function cleanChromeProfiles() {
  if (!fs.existsSync(outDir)) return;
  fs.readdirSync(outDir, { withFileTypes: true }).forEach((entry) => {
    if (entry.isDirectory() && entry.name.indexOf('chrome-profile') === 0) {
      fs.rmSync(path.join(outDir, entry.name), { recursive: true, force: true });
    }
  });
}

function checkTextBoundaries() {
  const pageFiles = listFiles('pages/controller-review');
  const pageText = pageFiles.map((file) => read(file)).join('\n');
  assert('保留制动巡航文案', pageText.includes('制动巡航'));
  assert('运行页面不出现自动巡航', !pageText.includes('自动巡航'));

  const forbiddenTag = /<(div|span|table|thead|tbody|tr|td|th|a|script|link|input|select|dialog)\b/;
  assert('TTML 不含浏览器 HTML 标签', !forbiddenTag.test(pageText));

  const forbiddenRuntime = /\b(window|document|innerHTML|querySelector|addEventListener|localStorage|renderApp)\b/;
  const runtimeText = ['app.js', ...pageFiles].map((file) => read(file)).join('\n');
  assert('小程序代码不含浏览器运行时写法', !forbiddenRuntime.test(runtimeText));
}

function checkJsonAndSyntax() {
  ['app.json', 'pages/controller-review/index.json', 'project.config.json'].forEach((file) => {
    JSON.parse(read(file));
  });
  assert('JSON 配置可解析', true);
  const projectConfig = JSON.parse(read('project.config.json'));
  assert('项目配置不写入正式 appid', projectConfig.appid === '');

  new vm.Script(read('pages/controller-review/index.js'), {
    filename: 'pages/controller-review/index.js',
  });
  assert('页面 JS 语法可解析', true);
}

function makePage() {
  const code = read('pages/controller-review/index.js');
  let pageConfig;
  const storage = {};
  const navCalls = [];
  const context = {
    console,
    Array,
    Object,
    String,
    Math,
    parseInt,
    tt: {
      getStorageSync: (key) => storage[key],
      setStorageSync: (key, value) => { storage[key] = value; },
      setNavigationBarTitle: () => {},
      setNavigationBarColor: (options) => { navCalls.push(options); },
    },
    Page: (config) => { pageConfig = config; },
  };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'pages/controller-review/index.js' });
  pageConfig.setData = function setData(data) {
    this.data = Object.assign({}, this.data, data);
  };
  pageConfig.__navCalls = navCalls;
  pageConfig.onLoad();
  return pageConfig;
}

function event(dataset) {
  return { currentTarget: { dataset } };
}

function checkBehavior() {
  const page = makePage();
  const products = page.data.products;
  const lastNav = () => page.__navCalls[page.__navCalls.length - 1];
  const expectedColors = {
    yanxin: '#1FA98F',
    spd: '#D88A2C',
    lingbo: '#8B5FE0',
    apt: '#E0524D',
    zhike: '#5E7BFF',
    datai: '#6FAE3A',
    ninebot: '#6E7889',
  };
  assert('默认最佳徽章关闭', page.data.showBadges === false);
  assert('默认排名角标关闭', page.data.showRankIdx === false);
  assert('原生顶栏默认暗色白字', lastNav().backgroundColor === '#0E1623' && lastNav().frontColor === '#ffffff');
  page.onShow();
  assert('页面恢复时重新同步原生顶栏', lastNav().backgroundColor === '#0E1623' && lastNav().frontColor === '#ffffff');
  assert('暗色默认图标使用暗色资源', page.data.iconTheme === '/assets/icons/theme.svg' && page.data.iconBadge === '/assets/icons/badge.svg');
  page.toggleBadges();
  page.toggleRankIdx();
  assert('暗色选中图标使用主色资源', page.data.iconBadge === '/assets/icons/badge-active.svg' && page.data.iconRankIdx === '/assets/icons/columns-active.svg');
  page.toggleDark();
  assert('切换明亮模式后原生顶栏白底黑字', lastNav().backgroundColor === '#FFFFFF' && lastNav().frontColor === '#000000');
  assert('明亮选中图标使用亮色主色资源', page.data.iconTheme === '/assets/icons/theme-light.svg' && page.data.iconBadge === '/assets/icons/badge-active-light.svg');
  page.toggleDark();
  assert('切回暗色模式后原生顶栏深底白字', lastNav().backgroundColor === '#0E1623' && lastNav().frontColor === '#ffffff');
  page.toggleBadges();
  page.toggleRankIdx();
  Object.entries(expectedColors).forEach(([id, color]) => {
    const product = products.find((item) => item.id === id);
    assert(`产品色 ${id}`, product && product.color === color, product && product.color);
  });

  const software = page.data.sections.find((section) => section.id === 'software');
  const handling = page.data.sections.find((section) => section.id === 'handling');
  assert('制动巡航 label 正确', software.columns.find((col) => col.key === 'brakeCruise').label === '制动巡航');

  function tone(section, rowId, key) {
    return section.rows.find((row) => row.id === rowId).cells.find((cell) => cell.key === key).tone;
  }

  assert('制动巡航 不可激活 = good', tone(software, 'spd', 'brakeCruise') === 'good');
  assert('制动巡航 可激活 = bad', tone(software, 'yanxin', 'brakeCruise') === 'bad');
  assert('驻车刹车灯异常 = warn', tone(software, 'lingbo', 'parkLight') === 'warn');
  assert('手感线性适中 = warn', tone(handling, 'spd', 'linearity') === 'warn');
  assert('空行程较小不上色', tone(handling, 'zhike', 'deadzone') === '');
  assert('参考行无值不上色', tone(software, 'ninebot', 'bt') === '');

  page.toggleHighlight(event({ id: 'apt' }));
  page.toggleHighlight(event({ id: 'zhike' }));
  assert('高亮数量正确', page.data.highlighted.length === 2);
  assert('APT chip 使用产品色', page.data.products.find((item) => item.id === 'apt').chipStyle.includes('#E0524D'));
  const hardware = page.data.sections.find((section) => section.id === 'hardware');
  const aptRow = hardware.rows.find((row) => row.id === 'apt');
  assert('高亮型号列使用不透底实色背景', /background:#[0-9a-fA-F]{6};/.test(aptRow.modelStyle) && !aptRow.modelStyle.includes('rgba(') && !aptRow.modelStyle.includes('var(--panel)'));

  page.setView(event({ id: 'thermal', view: 'rank' }));
  const thermal = page.data.sections.find((section) => section.id === 'thermal');
  assert('排行榜视图可切换', thermal.view === 'rank');
  assert('排行榜首项有 #1', thermal.rankItems[0].rankLabel === '#1');
  assert('排行榜末项无底部分割线标记', thermal.rankItems[thermal.rankItems.length - 1].isLast === true);
}

function checkStyles() {
  const styleText = [
    read('app.ttss'),
    read('pages/controller-review/index.ttss'),
    read('app.json'),
    read('pages/controller-review/index.json'),
  ].join('\n');

  const pageStyle = read('pages/controller-review/index.ttss');
  const appStyle = read('app.ttss');
  assert('暗色原生导航栏使用底层深色', styleText.includes('"navigationBarBackgroundColor": "#0E1623"') && read('pages/controller-review/index.js').includes("navBg: '#0E1623'"));
  assert('亮色原生导航栏保持白色', read('pages/controller-review/index.js').includes("navBg: '#FFFFFF'"));
  const pageButtonBlock = pageStyle.match(/button\s*\{[\s\S]*?\}/);
  const appButtonBlock = appStyle.match(/button\s*\{[\s\S]*?\}/);
  assert('页面按钮默认背景透明', pageButtonBlock && pageButtonBlock[0].includes('background: transparent'));
  assert('页面按钮默认颜色继承', pageButtonBlock && pageButtonBlock[0].includes('color: inherit'));
  assert('全局按钮默认背景透明', appButtonBlock && appButtonBlock[0].includes('background: transparent'));
  assert('全局按钮默认颜色继承', appButtonBlock && appButtonBlock[0].includes('color: inherit'));
  const segBtnBlock = pageStyle.match(/\.seg-btn\s*\{[\s\S]*?\}/);
  const segActiveBlock = pageStyle.match(/\.seg-btn\.active\s*\{[\s\S]*?\}/);
  assert('表格/排行未选中按钮背景透明', segBtnBlock && segBtnBlock[0].includes('background: transparent'));
  assert('表格/排行未选中文字为次级色', segBtnBlock && segBtnBlock[0].includes('color: var(--muted)'));
  assert('表格/排行选中按钮使用主色底', segActiveBlock && segActiveBlock[0].includes('background: var(--accent)'));
  assert('表格/排行选中文字为白色', segActiveBlock && segActiveBlock[0].includes('color: var(--accent-text)'));
  const pageMarkup = read('pages/controller-review/index.ttml');
  const pageLogic = read('pages/controller-review/index.js');
  assert('顶部排名角标使用列图标', pageMarkup.includes('aria-label="排名角标"') && pageMarkup.includes('src="{{iconRankIdx}}"') && pageLogic.includes("iconRankIdx: toneIcon('columns'"));
  assert('表格排行切换文案对齐 UI 包', pageMarkup.includes('<text>排行</text>'));
  assert('固定型号列层级高于数据列', pageStyle.includes('z-index: 5') && pageStyle.includes('.data-cell') && pageStyle.includes('z-index: 0'));
  assert('排序箭头通过状态图标跟随文字色', pageLogic.includes("sortToggleIcon: textIcon(sort.isAsc ? 'up' : 'down', dark)"));
  assert('图标颜色不依赖 CSS filter', !/(^|[;{\\s])filter\\s*:/.test(pageStyle));
  assert('图标按明暗和选中状态切换路径', pageMarkup.includes('src="{{iconTheme}}"') && pageMarkup.includes('src="{{section.infoIcon}}"') && pageMarkup.includes('src="{{section.sortToggleIcon}}"'));

  [
    '#0E1623',
    '#18212F',
    '#232E40',
    '#5E7BFF',
    '#F4F6FA',
    '#EEF1F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
  ].forEach((token) => {
    assert(`视觉 token ${token}`, styleText.includes(token));
  });

  [
    '#101722',
    '#171F2E',
    '#4E67E8',
    '#3F57C8',
    '#6D7890',
    '#727B8E',
    '#6E788A',
    '#747D8D',
    '#858D9A',
    '#687385',
  ].forEach((oldColor) => {
    assert(`运行样式无旧色 ${oldColor}`, !styleText.includes(oldColor));
  });

  const icons = listFiles('assets/icons').filter((file) => file.endsWith('.svg'));
  assert('SVG 图标数量为 37', icons.length === 37, String(icons.length));
  [
    'badge-active.svg',
    'badge-active-light.svg',
    'columns-active.svg',
    'columns-active-light.svg',
    'info-active.svg',
    'info-active-light.svg',
    'up-text.svg',
    'up-text-light.svg',
    'down-text.svg',
    'down-text-light.svg',
    'table-light.svg',
    'trophy-light.svg',
  ].forEach((file) => {
    assert(`SVG 图标变体 ${file}`, icons.includes(`assets/icons/${file}`));
  });
  icons.forEach((file) => {
    const svg = read(file);
    assert(`${file} 无硬填充`, svg.includes('fill="none"'));
    assert(`${file} 线性圆角`, svg.includes('stroke-linecap="round"') && svg.includes('stroke-linejoin="round"'));
  });
}

function cssToPreview(css, width = 400) {
  return css
    .replace(/([0-9]*\.?[0-9]+)rpx/g, (_, n) => `${Number(n) * width / 750}px`)
    .replace(/page\s*\{/g, 'body {');
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

function icon(name, className = 'icon-img') {
  return `<img class="${className}" src="file://${repo}/assets/icons/${name}.svg">`;
}

function iconSrc(src, className = 'icon-img') {
  return `<img class="${className}" src="file://${repo}${src}">`;
}

function assetIcon(name, suffix = '') {
  return `/assets/icons/${name}${suffix ? '-' + suffix : ''}.svg`;
}

function renderTable(section) {
  return `<div class="table-card"><div class="table" style="width:${section.tableWidth * 400 / 750}px;">
    <div class="tr th-row"><div class="cell model-cell model-head">型号</div>${section.visibleColumns.map((col) => `<button class="cell head-cell ${col.rankable ? 'sortable' : ''} ${section.sortKey === col.key ? 'sorted' : ''}"><span>${esc(col.label)}</span>${col.rankable ? `<img class="sort-img" src="file://${repo}${col.sortIcon}">` : ''}</button>`).join('')}</div>
    ${section.rows.map((row) => `<div class="tr ${row.highlighted ? 'is-highlight' : ''} ${row.isRef ? 'is-ref' : ''}" style="${esc(row.rowStyle)}"><div class="cell model-cell ${row.isRef ? 'ref' : ''}" style="${esc(row.modelStyle)}"><div class="model-inline">${row.rankLabel ? `<span class="rank-badge ${row.rankLabel === '#1' ? 'first' : ''}">${esc(row.rankLabel)}</span>` : ''}<span>${esc(row.name)}</span></div></div>${row.cells.map((cell) => `<div class="cell data-cell ${cell.longText ? 'long' : ''} ${cell.tone} ${row.highlighted ? 'strong' : ''}"><span>${esc(cell.display)}</span>${cell.best ? '<span class="best-badge">☆ 最佳</span>' : ''}</div>`).join('')}</div>`).join('')}
  </div></div>`;
}

function renderRank(section) {
  return `<div class="rank-card">${section.rankItems.map((rankItem) => `<div class="rank-item ${rankItem.isLast ? 'last' : ''}"><div class="rank-main"><div class="rank-name"><span class="rank-number ${rankItem.rankLabel === '#1' ? 'first' : ''}">${esc(rankItem.rankLabel)}</span><span class="rank-product" style="${esc(rankItem.productStyle)}">${esc(rankItem.name)}</span></div><span class="rank-value" style="${esc(rankItem.valueStyle)}">${esc(rankItem.display)}</span></div><div class="bar"><div class="bar-fill" style="${esc(rankItem.barStyle)}"></div>${rankItem.avgLineStyle ? `<div class="avg-line" style="${esc(rankItem.avgLineStyle)}"></div>` : ''}</div></div>`).join('')}${section.averageText ? `<div class="avg-note"><span class="avg-mark"></span><span>${esc(section.averageText)}</span></div>` : ''}</div>`;
}

function renderTop(state, activeId) {
  return `<div class="topbar"><div class="topline"><div class="title">${esc(state.pageTitle)}</div><div class="tool-row"><button class="icon-btn">${iconSrc(state.iconTheme)}</button><button class="icon-btn ${state.showBadges ? 'active' : ''}">${iconSrc(state.iconBadge)}</button><button class="icon-btn ${state.showRankIdx ? 'active' : ''}">${iconSrc(state.iconRankIdx)}</button></div></div><div class="nav-row">${state.sections.map((section) => `<button class="nav-btn ${section.id === activeId ? 'active' : ''}">${esc(section.mark)}</button>`).join('')}</div><div class="highlight-head"><span class="highlight-label">高亮产品 ${state.highlightedCountText}</span>${state.highlighted.length ? `<button class="clear-btn">${iconSrc(state.iconClose, 'inline-img')}<span>清除</span></button>` : ''}</div><div class="chip-row">${state.products.map((product) => `<button class="chip ${product.isRef ? 'ref' : ''} ${product.highlighted ? 'on' : ''}" style="${esc(product.chipStyle)}">${esc(product.short)}</button>`).join('')}</div></div>`;
}

function renderSectionForPreview(state, section) {
  return `<div class="section"><div class="section-head"><div class="title-group"><span class="section-title">${esc(section.title)}</span><button class="section-icon-btn ${state.activeInfo === section.id ? 'active' : ''}">${iconSrc(section.infoIcon)}</button></div><button class="section-icon-btn ${section.showColPicker ? 'active' : ''}">${iconSrc(section.columnsIcon)}</button></div>${section.note ? `<span class="note">${esc(section.note)}</span>` : ''}${section.showColPicker ? `<div class="col-panel"><span class="col-title">显示列</span><div class="col-chips">${section.columns.map((col) => `<button class="col-chip ${col.visible ? 'on' : ''}">${esc(col.label)}</button>`).join('')}</div></div>` : ''}${section.hasRankable ? `<div class="view-row"><div class="seg"><button class="seg-btn ${section.view === 'table' ? 'active' : ''}">${iconSrc(section.tableIcon, 'inline-img')}<span>表格</span></button><button class="seg-btn ${section.view === 'rank' ? 'active' : ''}">${iconSrc(section.trophyIcon, 'inline-img')}<span>排行</span></button></div>${section.view === 'rank' ? `<div class="rank-tools"><div class="rank-col-scroll">${section.rankableColumns.slice(0, 3).map((col) => `<button class="sort-chip ${section.sortKey === col.key ? 'active' : ''}">${esc(col.label)}</button>`).join('')}</div><button class="sort-btn">${iconSrc(section.sortToggleIcon, 'inline-img')}<span>${section.isAsc ? '升序' : '降序'}</span></button></div>` : ''}</div>` : ''}${section.view === 'rank' ? renderRank(section) : renderTable(section)}</div>`;
}

function renderFrame(label, page, targetId, modal = false, extraClass = '', targetIds = null) {
  const state = page.data;
  const ids = targetIds || [targetId];
  const sections = ids.map((id) => state.sections.find((item) => item.id === id)).filter(Boolean);
  const modalHtml = modal && state.activeInfoModal ? `<div class="modal-layer"><div class="modal-backdrop"></div><div class="info-modal"><div class="info-modal-head"><span class="info-modal-title">${esc(state.activeInfoModal.title)}</span><button class="modal-close">${iconSrc(state.iconClose)}</button></div><div class="info-modal-body"><span class="info-intro">${esc(state.activeInfoModal.intro)}</span>${state.activeInfoModal.points.map((point) => `<div class="info-point"><span class="info-dot"></span><span class="info-point-text">${esc(point)}</span></div>`).join('')}<span class="info-note">${esc(state.activeInfoModal.note)}</span></div><button class="modal-ok">我知道了</button></div></div>` : '';
  const sectionHtml = sections.map((section) => renderSectionForPreview(state, section)).join('');
  return `<div class="frame-wrap ${esc(extraClass)}"><div class="state-label">${esc(label)}</div><div class="phone"><div class="app ${state.dark ? '' : 'light'}"><div class="watermark">${state.watermarks.map((mark) => `<span class="watermark-item">${esc(mark.text)}</span>`).join('')}</div>${renderTop(state, targetId)}<div class="content">${sectionHtml}<div class="footer">数据来源：7 款控制器实测。九号 M395C 原厂作为参考基线，不参与对比控制器的排序比较。</div></div>${modalHtml}</div></div></div>`;
}

function prepareState(name) {
  const page = makePage();
  if (name === 'light') page.toggleDark();
  if (name === 'modal') page.toggleInfo(event({ id: 'hardware' }));
  if (name === 'software') {
    page.toggleHighlight(event({ id: 'apt' }));
    page.toggleHighlight(event({ id: 'zhike' }));
    page.scrollToSection(event({ id: 'software' }));
  }
  if (name === 'ranking') {
    page.toggleHighlight(event({ id: 'yanxin' }));
    page.toggleHighlight(event({ id: 'lingbo' }));
    page.toggleHighlight(event({ id: 'spd' }));
    page.setView(event({ id: 'thermal', view: 'rank' }));
    page.scrollToSection(event({ id: 'thermal' }));
  }
  if (name === 'handling') {
    page.toggleHighlight(event({ id: 'spd' }));
    page.toggleHighlight(event({ id: 'apt' }));
    page.scrollToSection(event({ id: 'handling' }));
  }
  if (name === 'accel') {
    page.toggleHighlight(event({ id: 'spd' }));
    page.toggleHighlight(event({ id: 'lingbo' }));
    page.setView(event({ id: 'accel', view: 'rank' }));
    page.scrollToSection(event({ id: 'accel' }));
  }
  if (name === 'sort') {
    page.toggleBadges();
    page.toggleRankIdx();
  }
  if (name === 'tableScroll') {
    page.toggleHighlight(event({ id: 'spd' }));
    page.toggleHighlight(event({ id: 'lingbo' }));
  }
  if (name === 'columns') page.toggleColPicker(event({ id: 'hardware' }));
  return page;
}

function sectionById(page, id) {
  return page.data.sections.find((section) => section.id === id);
}

function setColumnCount(page, id, count) {
  const section = sectionById(page, id);
  section.columns.forEach((col, index) => {
    if (index >= count && col.visible) {
      page.toggleColumn(event({ id, key: col.key }));
    }
  });
}

function setSort(page, id, key, isAsc) {
  let section = sectionById(page, id);
  if (section.sortKey !== key) {
    page.sortBy(event({ id, key }));
  }
  section = sectionById(page, id);
  if (section.isAsc !== isAsc) {
    page.toggleSort(event({ id }));
  }
}

function setHighlights(page, ids) {
  page.clearHighlights();
  ids.forEach((id) => page.toggleHighlight(event({ id })));
}

function prepareDeliveryState(name) {
  const page = makePage();
  if (name === 'light') {
    page.toggleDark();
    setHighlights(page, ['spd']);
    setColumnCount(page, 'hardware', 3);
    setSort(page, 'hardware', 'price', false);
  } else if (name === 'modal') {
    setColumnCount(page, 'hardware', 3);
    setSort(page, 'hardware', 'price', false);
    page.toggleInfo(event({ id: 'hardware' }));
  } else if (name === 'ranking') {
    setHighlights(page, ['zhike', 'yanxin', 'apt']);
    page.setView(event({ id: 'thermal', view: 'rank' }));
    page.scrollToSection(event({ id: 'thermal' }));
  } else if (name === 'selected') {
    setHighlights(page, ['yanxin', 'apt', 'zhike']);
    page.setView(event({ id: 'thermal', view: 'rank' }));
    page.scrollToSection(event({ id: 'thermal' }));
  } else if (name === 'sort') {
    setColumnCount(page, 'hardware', 4);
    page.toggleBadges();
    page.toggleRankIdx();
    setSort(page, 'hardware', 'price', true);
  } else if (name === 'table-scroll') {
    setHighlights(page, ['apt', 'zhike']);
    page.scrollToSection(event({ id: 'software' }));
  } else {
    setColumnCount(page, 'hardware', 3);
    setSort(page, 'hardware', 'price', false);
  }
  return page;
}

function generatePreview() {
  fs.mkdirSync(outDir, { recursive: true });
  let css = cssToPreview(read('pages/controller-review/index.ttss'), 400);
  css += `
html,body{margin:0;padding:0;background:#0a0e15;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",Arial,sans-serif;}
.board{display:grid;grid-template-columns:repeat(3,400px);gap:28px;padding:24px;}
.frame-wrap{position:relative;}
.state-label{color:#c8d0dc;font-size:13px;font-weight:800;margin:0 0 8px 4px;}
.phone{width:400px;height:820px;overflow:hidden;border-radius:28px;box-shadow:0 30px 80px rgba(0,0,0,.45);background:var(--bg);}
.phone .app{height:100%;min-height:100%;}
img{display:block;}
.table-card{overflow-x:hidden;}
.content{overflow:auto;}
.modal-layer{position:absolute;}
button{font-family:inherit;background:transparent;color:inherit;}
.rank-col-scroll{overflow:hidden;}
.scroll-proof .table-card{overflow-x:auto;}
`;
  const frames = [
    renderFrame('dark / hardware', prepareState('dark'), 'hardware'),
    renderFrame('light / hardware', prepareState('light'), 'hardware'),
    renderFrame('modal / hardware', prepareState('modal'), 'hardware', true),
    renderFrame('software / tone + highlight', prepareState('software'), 'software'),
    renderFrame('handling / tone', prepareState('handling'), 'handling'),
    renderFrame('ranking / thermal', prepareState('ranking'), 'thermal'),
    renderFrame('ranking / accel', prepareState('accel'), 'accel'),
    renderFrame('sort / badges + rank', prepareState('sort'), 'hardware'),
    renderFrame('table scroll / highlight', prepareState('tableScroll'), 'hardware', false, 'scroll-proof'),
    renderFrame('columns / picker', prepareState('columns'), 'hardware'),
  ].join('');
  fs.writeFileSync(previewHtml, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="board">${frames}</div><script>requestAnimationFrame(function(){document.querySelectorAll('.scroll-proof .table-card').forEach(function(el){el.scrollLeft=190;});});</script></body></html>`);
  console.log(`ok - 预览 HTML ${previewHtml}`);

  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chrome)) {
    console.log('skip - 未找到 Google Chrome，跳过 PNG 截图');
    return;
  }
  const result = childProcess.spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    `--user-data-dir=${path.join(outDir, 'chrome-profile')}`,
    '--window-size=1280,3600',
    `--screenshot=${previewPng}`,
    `file://${previewHtml}`,
  ], { encoding: 'utf8', timeout: 15000 });

  assert('预览 PNG 已生成', fs.existsSync(previewPng), result.stderr || result.stdout || 'missing screenshot');
  const size = pngSize(previewPng);
  assert('预览 PNG 覆盖完整状态板', size.width >= 1280 && size.height >= previewMinHeight, `${size.width}x${size.height}`);
  console.log(`ok - 预览 PNG ${previewPng}`);
}

function generateResponsivePreviews() {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chrome)) {
    console.log('skip - 未找到 Google Chrome，跳过响应式 PNG 截图');
    return;
  }
  responsiveWidths.forEach((width) => {
    let css = cssToPreview(read('pages/controller-review/index.ttss'), width);
    css += `
html,body{margin:0;padding:0;background:#0a0e15;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",Arial,sans-serif;}
.frame-wrap{position:relative;padding:16px;}
.state-label{color:#c8d0dc;font-size:13px;font-weight:800;margin:0 0 8px 4px;}
.phone{width:${width}px;height:820px;overflow:hidden;border-radius:28px;box-shadow:0 30px 80px rgba(0,0,0,.45);background:var(--bg);}
.phone .app{height:100%;min-height:100%;}
img{display:block;}
.content{overflow:auto;}
.table-card{overflow-x:auto;}
button{font-family:inherit;background:transparent;color:inherit;}
`;
    const html = path.join(outDir, `width-${width}.html`);
    const png = path.join(outDir, `width-${width}.png`);
    const scrollLeft = Math.round(width * 0.48);
    const frame = renderFrame(`width ${width} / table scroll + highlight`, prepareState('tableScroll'), 'hardware', false, 'scroll-proof');
    fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${frame}<script>requestAnimationFrame(function(){document.querySelectorAll('.scroll-proof .table-card').forEach(function(el){el.scrollLeft=${scrollLeft};});});</script></body></html>`);
    const result = childProcess.spawnSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      `--user-data-dir=${path.join(outDir, 'chrome-profile-' + width)}`,
      `--window-size=${width + 80},900`,
      `--screenshot=${png}`,
      `file://${html}`,
    ], { encoding: 'utf8', timeout: 15000 });
    assert(`响应式预览 ${width}px 已生成`, fs.existsSync(png), result.stderr || result.stdout || 'missing screenshot');
    const size = pngSize(png);
    assert(`响应式预览 ${width}px 尺寸正确`, size.width >= width && size.height >= 850, `${size.width}x${size.height}`);
    console.log(`ok - 响应式预览 ${width}px ${png}`);
  });
}

function renderComponentsFrame(label) {
  const page = makePage();
  const state = page.data;
  return `<div class="frame-wrap components-state"><div class="state-label">${esc(label)}</div><div class="phone"><div class="app"><div class="component-screen"><div class="component-top"><span class="component-title">组件状态总览</span><div class="tool-row"><button class="icon-btn">${iconSrc(state.iconTheme)}</button><button class="icon-btn active">${iconSrc(assetIcon('columns', 'active'))}</button></div></div><div class="component-grid"><div class="component-card"><span class="component-card-title">按钮状态</span><div class="component-row"><button class="nav-btn active">选中</button><button class="nav-btn">未选中</button></div><button class="modal-ok mini">点击</button></div><div class="component-card"><span class="component-card-title">图标状态</span><div class="component-row icon-row">${iconSrc(assetIcon('table', 'active'), 'inline-img')} ${iconSrc(assetIcon('trophy'), 'inline-img')} ${iconSrc(assetIcon('sort'), 'inline-img')} ${iconSrc(assetIcon('info'), 'inline-img')}</div></div><div class="component-card"><span class="component-card-title">颜色</span><div class="swatch-row"><span class="swatch accent"></span><span class="swatch bg"></span><span class="swatch panel"></span><span class="swatch panel2"></span><span class="swatch muted"></span></div></div><div class="component-card"><span class="component-card-title">长文本</span><div class="long-sample">凌博 E260 Pro Max 在窄屏或横滑末端需要保证不顶出表格边界。</div></div></div><div class="component-card tone-card"><span class="component-card-title">tone 配色规则（软件 / 手感）</span><div class="tone-row"><span>蓝牙稳定</span><span class="good">连3次均成功</span></div><div class="tone-row"><span>固件升级</span><span class="good">OTA在线升级</span></div><div class="tone-row"><span>调节项标注</span><span class="good">说明清晰易懂</span><span class="warn">部分说明</span><span class="bad">无说明</span></div><div class="tone-row"><span>巡航激活</span><span class="good">仅拧电门可激活</span><span class="bad">松油门可激活</span></div></div></div></div></div></div>`;
}

function deliveryStateSpecs() {
  return [
    { name: 'dark', label: 'STATE · 深色（无高亮）', target: 'hardware', sections: ['hardware'] },
    { name: 'light', label: 'STATE · 明亮（高亮 SPD 演示）', target: 'hardware', sections: ['hardware'] },
    { name: 'modal', label: 'STATE · 弹窗 + 遮罩', target: 'hardware', sections: ['hardware'], modal: true },
    { name: 'table-scroll', label: 'STATE · 横滑 · 软件 / 手感 双 section · tone 配色规则演示', target: 'software', sections: ['software', 'handling'] },
    { name: 'ranking', label: 'STATE · 排行 + 多产品高亮（智科 / 雁鑫 / APT）', target: 'thermal', sections: ['thermal'] },
    { name: 'sort', label: 'STATE · 排序 · 价格升序', target: 'hardware', sections: ['hardware'] },
    { name: 'selected', label: 'STATE · 多产品 + 排行视图 + sort-chip 选中', target: 'thermal', sections: ['thermal'] },
    { name: 'components', label: 'STATE · 组件总览', components: true },
  ];
}

function deliveryPreviewCss() {
  let css = cssToPreview(read('pages/controller-review/index.ttss'), 400);
  css += `
html,body{margin:0;padding:0;width:909px;height:540px;overflow:hidden;background:#0a0f17;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",Arial,sans-serif;}
.frame-wrap{position:relative;width:909px;height:540px;overflow:hidden;background:#0a0f17;}
.state-label{position:absolute;left:16px;top:16px;z-index:5;color:#c8d0dc;font-size:12px;font-weight:800;letter-spacing:.06em;border:1px solid rgba(255,255,255,.12);background:#121a27;border-radius:999px;padding:5px 11px;margin:0;}
.phone{position:absolute;left:255px;top:24px;width:400px;height:820px;overflow:hidden;border-radius:28px;box-shadow:0 30px 90px rgba(0,0,0,.38);background:var(--bg);}
.phone .app{height:100%;min-height:100%;}
img{display:block;}
.table-card{overflow-x:hidden;}
.content{overflow:visible;}
.modal-layer{position:absolute;}
button{font-family:inherit;background:transparent;color:inherit;}
.rank-col-scroll{overflow:hidden;}
.component-screen{height:100%;background:var(--bg);color:var(--text);}
.component-top{height:64px;padding:0 13px;border-bottom:1px solid var(--border);background:linear-gradient(180deg,#1A2433 0%,#18212F 100%);display:flex;align-items:center;justify-content:space-between;}
.component-title{font-size:18px;font-weight:800;}
.component-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 12px 10px;}
.component-card{border:1px solid var(--border);background:var(--panel);border-radius:14px;padding:12px;box-shadow:0 1px 2px rgba(0,0,0,.35),0 6px 20px rgba(0,0,0,.22);}
.component-card-title{display:block;font-size:13px;font-weight:800;margin-bottom:10px;color:var(--text);}
.component-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.icon-row{color:var(--muted);}
.mini{width:auto;min-width:62px;height:31px;margin-top:9px;padding:0 16px;}
.swatch-row{display:flex;gap:8px;flex-wrap:wrap;}
.swatch{width:31px;height:31px;border-radius:8px;border:1px solid var(--border);}
.swatch.accent{background:var(--accent);}
.swatch.bg{background:var(--bg);}
.swatch.panel{background:var(--panel);}
.swatch.panel2{background:var(--panel-2);}
.swatch.muted{background:var(--muted);}
.long-sample{background:var(--panel-2);border-radius:10px;padding:10px;color:var(--text);font-size:13px;line-height:1.5;}
.tone-card{margin:0 12px;}
.tone-row{display:flex;align-items:center;gap:10px;min-height:32px;border-bottom:1px dashed var(--border-soft);font-size:12px;color:var(--muted);}
.tone-row:last-child{border-bottom:0;}
.tone-row .good,.tone-row .warn,.tone-row .bad{font-weight:800;}
.tone-row .good{color:var(--success);}
.tone-row .warn{color:var(--warning);}
.tone-row .bad{color:var(--danger);}
`;
  return css;
}

function generateDeliveryStatePreviews() {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chrome)) {
    console.log('skip - 未找到 Google Chrome，跳过 UI 对照 PNG 截图');
    return;
  }
  fs.mkdirSync(stateOutDir, { recursive: true });
  const css = deliveryPreviewCss();
  const specs = deliveryStateSpecs();
  specs.forEach((spec) => {
    const html = path.join(stateOutDir, `${spec.name}.html`);
    const png = path.join(stateOutDir, `${spec.name}.png`);
    const frame = spec.components
      ? renderComponentsFrame(spec.label)
      : renderFrame(spec.label, prepareDeliveryState(spec.name), spec.target, !!spec.modal, '', spec.sections);
    fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${frame}</body></html>`);
    const result = childProcess.spawnSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      `--user-data-dir=${path.join(outDir, 'chrome-profile-state-' + spec.name)}`,
      '--window-size=909,540',
      `--screenshot=${png}`,
      `file://${html}`,
    ], { encoding: 'utf8', timeout: 15000 });
    assert(`UI 对照截图 ${spec.name} 已生成`, fs.existsSync(png), result.stderr || result.stdout || 'missing screenshot');
    const size = pngSize(png);
    assert(`UI 对照截图 ${spec.name} 尺寸正确`, size.width === 909 && size.height === 540, `${size.width}x${size.height}`);
  });

  const rows = specs.map((spec) => {
    const ref = path.join(uiDeliveryDir, 'screenshots', `${spec.name}.png`);
    const cur = path.join(stateOutDir, `${spec.name}.png`);
    return `<section><h2>${esc(spec.label)}</h2><div class="pair"><figure><figcaption>UI 交付稿</figcaption><img src="file://${ref}"></figure><figure><figcaption>当前小程序实现</figcaption><img src="file://${cur}"></figure></div></section>`;
  }).join('');
  fs.writeFileSync(compareHtml, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#f3f5f8;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",Arial,sans-serif;}main{padding:24px;}h1{font-size:22px;margin:0 0 18px;}h2{font-size:15px;margin:24px 0 10px;}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;}figure{margin:0;background:#fff;border:1px solid #dbe0ea;border-radius:10px;padding:10px;box-shadow:0 2px 12px rgba(15,23,42,.06);}figcaption{font-size:12px;font-weight:800;color:#526071;margin:0 0 8px;}img{width:100%;display:block;border-radius:6px;}</style></head><body><main><h1>v1.1.4 UI 交付稿 / 当前实现对照</h1>${rows}</main></body></html>`);
  console.log(`ok - UI 对照入口 ${compareHtml}`);
}

function generateRiskPreviews() {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chrome)) {
    console.log('skip - 未找到 Google Chrome，跳过风险定向截图');
    return;
  }
  fs.mkdirSync(riskOutDir, { recursive: true });
  let css = cssToPreview(read('pages/controller-review/index.ttss'), 400);
  css += `
html,body{margin:0;padding:0;background:#0a0e15;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",Arial,sans-serif;}
.frame-wrap{position:relative;padding:16px;}
.state-label{color:#c8d0dc;font-size:13px;font-weight:800;margin:0 0 8px 4px;}
.phone{width:400px;height:820px;overflow:hidden;border-radius:28px;box-shadow:0 30px 80px rgba(0,0,0,.45);background:var(--bg);}
.phone .app{height:100%;min-height:100%;}
img{display:block;}
.content{overflow:auto;}
.table-card{overflow-x:auto;}
.modal-layer{position:absolute;}
button{font-family:inherit;background:transparent;color:inherit;}
`;
  const previews = [
    {
      name: 'software-rightmost',
      html: renderFrame('software rightmost / highlight + park light', prepareDeliveryState('table-scroll'), 'software', false, 'scroll-proof', ['software']),
      script: `requestAnimationFrame(function(){document.querySelectorAll('.scroll-proof .table-card').forEach(function(el){el.scrollLeft=9999;});});`,
      assertText: '驻车刹车灯',
    },
    {
      name: 'modal-full',
      html: renderFrame('modal full height / button visible', prepareDeliveryState('modal'), 'hardware', true, '', ['hardware']),
      script: '',
      assertText: '我知道了',
    },
    {
      name: 'columns-panel',
      html: renderFrame('columns panel / vertical alignment', prepareState('columns'), 'hardware', false, '', ['hardware']),
      script: '',
      assertText: '显示列',
    },
  ];

  previews.forEach((preview) => {
    const html = path.join(riskOutDir, `${preview.name}.html`);
    const png = path.join(riskOutDir, `${preview.name}.png`);
    fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${preview.html}<script>${preview.script}</script></body></html>`);
    assert(`风险截图 ${preview.name} HTML 包含 ${preview.assertText}`, fs.readFileSync(html, 'utf8').includes(preview.assertText));
    const result = childProcess.spawnSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      `--user-data-dir=${path.join(outDir, 'chrome-profile-risk-' + preview.name)}`,
      '--window-size=480,900',
      `--screenshot=${png}`,
      `file://${html}`,
    ], { encoding: 'utf8', timeout: 15000 });
    assert(`风险截图 ${preview.name} 已生成`, fs.existsSync(png), result.stderr || result.stdout || 'missing screenshot');
    const size = pngSize(png);
    assert(`风险截图 ${preview.name} 尺寸正确`, size.width === 480 && size.height === 900, `${size.width}x${size.height}`);
  });
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  cleanChromeProfiles();
  assert('版本号为 1.1.4', read('VERSION').trim() === '1.1.4');
  checkJsonAndSyntax();
  checkTextBoundaries();
  checkStyles();
  checkBehavior();
  generatePreview();
  generateResponsivePreviews();
  generateDeliveryStatePreviews();
  generateRiskPreviews();
  console.log('done - 1.1.4 UI 验收脚本通过');
}

try {
  main();
} finally {
  cleanChromeProfiles();
}
