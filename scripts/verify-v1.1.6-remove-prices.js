#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
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

function makePage(saved) {
  const code = read('pages/controller-review/index.js');
  let pageConfig;
  const storage = { 'ctrl-review-miniapp-v1': saved || {} };
  const context = {
    console,
    Array,
    Object,
    String,
    Math,
    Date,
    parseInt,
    setTimeout: () => 0,
    clearTimeout: () => {},
    Page: (config) => { pageConfig = config; },
    tt: {
      getStorageSync: (key) => storage[key],
      setStorageSync: (key, value) => { storage[key] = value; },
      setNavigationBarTitle: () => {},
      setNavigationBarColor: () => {}
    }
  };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'pages/controller-review/index.js' });
  pageConfig.setData = function setData(data) {
    this.data = Object.assign({}, this.data, data);
  };
  pageConfig.onLoad();
  return pageConfig;
}

const version = read('VERSION').trim();
assert(version === '1.1.6', '版本号为 1.1.6');

const runtimeFiles = [
  'app.js',
  'app.json',
  'app.ttss',
  'pages/controller-review/index.js',
  'pages/controller-review/index.json',
  'pages/controller-review/index.ttml',
  'pages/controller-review/index.ttss',
  'project.config.json'
];

const runtimeText = runtimeFiles.map(read).join('\n');
assert(!/price/i.test(runtimeText), '当前运行入口不含 price 字段');
assert(!runtimeText.includes('价格'), '当前运行入口不含价格文案');
assert(!/[0-9]+(?:\.[0-9]+)?元/.test(runtimeText), '当前运行入口不含金额元展示');

const page = makePage();
const hardware = page.data.sections.find((section) => section.id === 'hardware');
assert(!!hardware, '硬件模块存在');
assert(hardware.sortKey === 'busA', '硬件默认排序为峰值母线');
assert(hardware.visibleColumns[0].key === 'busA', '硬件首个展示列为峰值母线');
assert(hardware.columns.every((col) => col.key !== 'price' && col.label !== '价格'), '显示列配置不含价格');
assert(hardware.rankableColumns.every((col) => col.key !== 'price' && col.label !== '价格'), '排行字段不含价格');
assert(hardware.rows.every((row) => row.cells.every((cell) => cell.key !== 'price')), '表格单元格不含价格');
assert(hardware.rankItems.every((item) => !String(item.display).includes('元')), '排行榜展示不含金额元');

const oldSavedPage = makePage({
  sections: {
    hardware: {
      view: 'rank',
      sortKey: 'price',
      sortAsc: true,
      hiddenCols: ['price']
    }
  }
});
const oldHardwareState = oldSavedPage.data.sectionState.hardware;
const oldHardware = oldSavedPage.data.sections.find((section) => section.id === 'hardware');
assert(oldHardwareState.sortKey === 'busA', '旧缓存 price 排序自动回落到峰值母线');
assert(oldHardwareState.hiddenCols.indexOf('price') < 0, '旧缓存隐藏列移除 price');
assert(oldHardware.sortKey === 'busA', '旧缓存渲染排序为峰值母线');
assert(oldHardware.rankableColumns.every((col) => col.key !== 'price'), '旧缓存排行字段不恢复价格');

const hiddenBusPage = makePage({
  sections: {
    hardware: {
      view: 'rank',
      sortKey: 'price',
      hiddenCols: ['price', 'busA']
    }
  }
});
const hiddenBusState = hiddenBusPage.data.sectionState.hardware;
const hiddenBusHardware = hiddenBusPage.data.sections.find((section) => section.id === 'hardware');
assert(hiddenBusState.sortKey === 'phaseA', '旧缓存隐藏峰值母线时回落到峰值相线');
assert(hiddenBusHardware.sortKey === 'phaseA', '旧缓存隐藏峰值母线时渲染排序有效');

const requirements = read('docs/REQUIREMENTS.md');
const handoff = read('docs/CONTEXT_HANDOFF.md');
assert(requirements.includes('1.1.6 需求口径'), '需求文档记录 1.1.6');
assert(requirements.includes('当前小程序运行界面不再展示任何价格相关内容'), '需求文档记录价格移除');
assert(handoff.includes('1.1.6 当前口径'), '上下文交接记录 1.1.6');

console.log('done - 1.1.6 价格移除验收通过');
