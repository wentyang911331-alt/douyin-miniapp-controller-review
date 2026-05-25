const PAGE_TITLE = '2026 年春季控制线横屏对比手册';
const STORAGE_KEY = 'ctrl-review-miniapp-v1';

const PRODUCTS = [
  { id: 'yanxin', name: '雁鑫 X300', short: '雁鑫', isRef: false, color: '#22d3ee' },
  { id: 'spd', name: 'SPD 72260S', short: 'SPD', isRef: false, color: '#f59e0b' },
  { id: 'lingbo', name: '凌博 E260 Pro Max', short: '凌博', isRef: false, color: '#10b981' },
  { id: 'apt', name: 'APT F300', short: 'APT', isRef: false, color: '#ec4899' },
  { id: 'zhike', name: '智科 72260', short: '智科', isRef: false, color: '#a855f7' },
  { id: 'datai', name: '大泰 72260', short: '大泰', isRef: false, color: '#ef4444' },
  { id: 'ninebot', name: '九号 M395C 原厂', short: '九号原厂', isRef: true, color: '#6b7280' }
];

const HARDWARE = {
  yanxin: { price: 768.75, busA: 100, phaseA: 300, vMin: 48, vMax: 72, water: '无', proto: '全协议' },
  spd: { price: 488, busA: 80, phaseA: 260, vMin: 48, vMax: 72, water: '无', proto: 'CAN协议' },
  lingbo: { price: 438, busA: 90, phaseA: 260, vMin: 48, vMax: 76, water: '无', proto: 'CAN协议' },
  apt: { price: 558, busA: 100, phaseA: 300, vMin: 48, vMax: 80, water: '无', proto: '全协议' },
  zhike: { price: 385, busA: 80, phaseA: 260, vMin: 48, vMax: 76, water: '无', proto: 'CAN协议' },
  datai: { price: 410, busA: 90, phaseA: 260, vMin: 48, vMax: 72, water: '无', proto: '全协议' },
  ninebot: { price: 143, busA: 40, phaseA: null, vMin: 72, vMax: 72, water: '无', proto: 'CAN协议' }
};

const SOFTWARE = {
  yanxin: { bt: '连3次均成功', ota: 'OTA在线升级', score: '4/5', label: '部分说明', cruise: '松油门可激活', brakeCruise: '可激活', parkLight: '不亮' },
  spd: { bt: '连3次均成功', ota: 'OTA在线升级', score: '4/5', label: '无说明', cruise: '仅拧电门可激活', brakeCruise: '不可激活', parkLight: '亮' },
  lingbo: { bt: '连3次均成功', ota: 'OTA在线升级', score: '4/5', label: '部分说明', cruise: '仅拧电门可激活', brakeCruise: '可激活', parkLight: '高温无法打开/低温不亮后灯' },
  apt: { bt: '连3次均成功', ota: 'OTA在线升级', score: '5/5', label: '说明清晰易懂', cruise: '松油门可激活', brakeCruise: '可激活', parkLight: '亮' },
  zhike: { bt: '连3次均成功', ota: 'OTA在线升级', score: '4/5', label: '部分说明', cruise: '松油门可激活', brakeCruise: '可激活', parkLight: '不亮' },
  datai: { bt: '连3次均成功', ota: 'OTA在线升级', score: '4/5', label: '部分说明', cruise: '松油门可激活', brakeCruise: '可激活', parkLight: '不亮' },
  ninebot: { bt: '—', ota: '无', score: '—', label: '无', cruise: '—', brakeCruise: '—', parkLight: '—' }
};

const HANDLING = {
  yanxin: { delay: '延迟可控', linearity: '很线性', deadzone: '适中' },
  spd: { delay: '延迟较大', linearity: '适中', deadzone: '适中' },
  lingbo: { delay: '延迟可控', linearity: '很线性', deadzone: '适中' },
  apt: { delay: '延迟可控', linearity: '不线性', deadzone: '适中' },
  zhike: { delay: '延迟可控', linearity: '适中', deadzone: '较小' },
  datai: { delay: '延迟可控', linearity: '很线性', deadzone: '适中' },
  ninebot: { delay: '延迟可控', linearity: '很线性', deadzone: '—' }
};

const THERMAL = {
  yanxin: { strategy: '中速渐降(低位保持)', baseline: 75.7, d90: { s: 257, disp: '4分17秒 / 82°C / 3.70km' }, d80: { s: 296, disp: '4分56秒 / 86°C / 4.20km' }, d60: { s: 370, disp: '6分10秒 / 94°C / 5.18km' }, d40: { s: 562, disp: '9分22秒 / 102°C / 7.48km' }, final: { v: 32, disp: '24.4A (32%)' } },
  spd: { strategy: '中速渐降(中位保持)', baseline: 76.6, d90: { s: 251, disp: '4分11秒 / 83°C / 3.62km' }, d80: { s: 274, disp: '4分34秒 / 87°C / 3.93km' }, d60: { s: 387, disp: '6分27秒 / 96°C / 5.37km' }, d40: { s: null, disp: '—' }, final: { v: 48, disp: '37.2A (48%)' } },
  lingbo: { strategy: '几乎不限流', baseline: 77.6, d90: { s: null, disp: '—' }, d80: { s: null, disp: '—' }, d60: { s: null, disp: '—' }, d40: { s: null, disp: '—' }, final: { v: 94, disp: '73.0A (94%)' } },
  apt: { strategy: '断崖式(低位保持)', baseline: 72.3, d90: { s: 314, disp: '5分14秒 / 84°C / 4.22km' }, d80: { s: 326, disp: '5分26秒 / 86°C / 4.37km' }, d60: { s: 329, disp: '5分29秒 / 86°C / 4.39km' }, d40: { s: 393, disp: '6分33秒 / 92°C / 5.00km' }, final: { v: 25, disp: '18.7A (25%)' } },
  zhike: { strategy: '断崖式(低位保持)', baseline: 75.3, d90: { s: 177, disp: '2分57秒 / 78°C / 2.45km' }, d80: { s: 177, disp: '2分57秒 / 78°C / 2.45km' }, d60: { s: 212, disp: '3分32秒 / 87°C / 2.92km' }, d40: { s: 318, disp: '5分18秒 / 92°C / 4.11km' }, final: { v: 29, disp: '22.1A (29%)' } },
  datai: { strategy: '硬断电', baseline: 73.8, d90: { s: 368, disp: '6分08秒 / 95°C' }, d80: { s: 380, disp: '6分20秒 / 98°C' }, d60: { s: 380, disp: '6分20秒 / 98°C' }, d40: { s: 380, disp: '6分20秒 / 98°C' }, final: { v: 0, disp: '断电 (6分14秒/97°C)' } },
  ninebot: { strategy: '硬断电', baseline: 36.4, d90: { s: 240, disp: '4分00秒 / 94°C' }, d80: { s: 257, disp: '4分17秒 / 97°C' }, d60: { s: 346, disp: '5分46秒 / 104°C' }, d40: { s: 493, disp: '8分13秒 / 112°C' }, final: { v: 0, disp: '断电 (8分06秒/111°C)' } }
};

const STABLE = {
  yanxin: { endTime: '4分17秒', endKm: '3.69km', avgPower: 4313, whPerH: 4313, whPerKm: 83.7, kmPerAh: 0.94, avgV: 78.60, avgA: 55.07 },
  spd: { endTime: '4分11秒', endKm: '3.62km', avgPower: 4243, whPerH: 4243, whPerKm: 82.1, kmPerAh: 0.96, avgV: 78.97, avgA: 53.94 },
  lingbo: { endTime: '12分02秒', endKm: '10.00km', avgPower: 3903, whPerH: 3903, whPerKm: 78.4, kmPerAh: 1.00, avgV: 78.98, avgA: 49.65 },
  apt: { endTime: '5分14秒', endKm: '4.22km', avgPower: 3780, whPerH: 3780, whPerKm: 78.4, kmPerAh: 0.97, avgV: 76.59, avgA: 49.58 },
  zhike: { endTime: '2分57秒', endKm: '2.45km', avgPower: 3724, whPerH: 3724, whPerKm: 75.1, kmPerAh: 1.04, avgV: 78.52, avgA: 47.64 },
  datai: { endTime: '6分08秒', endKm: '—', avgPower: 4147, whPerH: 4147, whPerKm: null, kmPerAh: null, avgV: 78.04, avgA: 53.33 },
  ninebot: { endTime: '4分00秒', endKm: '—', avgPower: 2144, whPerH: 2144, whPerKm: null, kmPerAh: null, avgV: 77.17, avgA: 27.81 }
};

const ACCEL = {
  yanxin: { a030: 4.00, a060: 11.71, a4070: 10.64, t500: 29.88, v500: 81.45 },
  spd: { a030: 3.50, a060: 10.24, a4070: 9.36, t500: 28.52, v500: 85.06 },
  lingbo: { a030: 3.65, a060: 10.35, a4070: 9.34, t500: 28.76, v500: 85.09 },
  apt: { a030: 3.79, a060: 11.75, a4070: 10.84, t500: 29.68, v500: 81.11 },
  zhike: { a030: 3.72, a060: 11.07, a4070: 10.21, t500: 29.32, v500: 83.52 },
  datai: { a030: 3.69, a060: 10.61, a4070: 9.99, t500: 29.16, v500: 83.76 },
  ninebot: { a030: null, a060: null, a4070: null, t500: 43.52, v500: 59.75 }
};

const SECTION_INFO = {
  hardware: '硬件规格用于横向确认价格、电流、电压和协议边界。带“越大/越小越好”的数值项参与排序；最低电压、水冷、协议等只作为适配参考。九号原厂为基准样本，不计入改装控制器排名。',
  software: '本模块记录连接、升级、调节项说明和辅助功能表现，偏向实际使用体验。软件评分与标注清晰度为人工整理口径，不和电流、加速等性能项混排；“最佳”只标出本表内明确优势项。',
  handling: '模拟跟车关注低速启停、跟车补油和电门开合的主观手感。延迟、线性度、空行程用于描述骑行可控性，不等同于绝对性能排名；九号原厂仅提供原车参照。',
  thermal: '10km 温控限流以起步后 60 秒内峰值电流作为基线，记录首次持续跌破各比例的时刻。越晚跌破、最终保持越高代表热稳定性更好；断电或缺失值会排在有效数据之后。',
  stable: '稳定输出区从车辆起步到首次跌破 90% 基线截取，凌博因全程未限流按 10km 全段计算。耗电项按同一区间归一化比较，里程缺失或参考样本不参与有效排名。',
  accel: '加速性能按每项 3 次测试平均值展示，秒数类越低越好，极速越高越好。九号原厂受 40A 硬件限制，部分加速项未测，只作为 500m 参考边界。'
};

const SEC_CONFIG = {
  hardware: {
    title: '① 硬件规格对比',
    mark: '①',
    data: HARDWARE,
    columns: [
      { key: 'price', label: '价格', type: 'number', unit: '元', better: 'low', rankable: true },
      { key: 'busA', label: '峰值母线', type: 'number', unit: 'A', better: 'high', rankable: true },
      { key: 'phaseA', label: '峰值相线', type: 'number', unit: 'A', better: 'high', rankable: true },
      { key: 'vMin', label: '最低电压', type: 'number', unit: 'V', better: 'none', rankable: true },
      { key: 'vMax', label: '最高电压', type: 'number', unit: 'V', better: 'high', rankable: true },
      { key: 'water', label: '水冷', type: 'text', rankable: false },
      { key: 'proto', label: '协议', type: 'text', rankable: false }
    ]
  },
  software: {
    title: '② 交互软件与辅助功能',
    mark: '②',
    data: SOFTWARE,
    colorize: true,
    columns: [
      { key: 'bt', label: '蓝牙稳定', type: 'text', rankable: false },
      { key: 'ota', label: '固件升级', type: 'text', rankable: false },
      { key: 'score', label: '软件评分', type: 'text', rankable: false, highlight: ['apt'] },
      { key: 'label', label: '调节项标注', type: 'text', rankable: false, highlight: ['apt'] },
      { key: 'cruise', label: '巡航激活', type: 'text', rankable: false },
      { key: 'brakeCruise', label: '制动巡航', type: 'text', rankable: false },
      { key: 'parkLight', label: '驻车刹车灯', type: 'text', rankable: false }
    ]
  },
  handling: {
    title: '③ 日常骑行手感（模拟跟车）',
    mark: '③',
    data: HANDLING,
    colorize: true,
    columns: [
      { key: 'delay', label: '电门延迟', type: 'text', rankable: false },
      { key: 'linearity', label: '电门线性度', type: 'text', rankable: false },
      { key: 'deadzone', label: '电门空行程', type: 'text', rankable: false }
    ]
  },
  thermal: {
    title: '④ 10km 温控限流路径',
    mark: '④',
    data: THERMAL,
    note: '基线 = 起步后前 60 秒内峰值电流滚动最大值。跌破 = 包络首次持续低于基线百分比的时刻。',
    columns: [
      { key: 'strategy', label: '限流策略', type: 'text', rankable: false },
      { key: 'baseline', label: '基线电流', type: 'number', unit: 'A', better: 'high', rankable: true },
      { key: 'd90', label: '首次跌破90%', type: 'time', better: 'high', rankable: true, valKey: 's', dispKey: 'disp' },
      { key: 'd80', label: '跌破80%', type: 'time', better: 'high', rankable: true, valKey: 's', dispKey: 'disp' },
      { key: 'd60', label: '跌破60%', type: 'time', better: 'high', rankable: true, valKey: 's', dispKey: 'disp' },
      { key: 'd40', label: '跌破40%', type: 'time', better: 'high', rankable: true, valKey: 's', dispKey: 'disp' },
      { key: 'final', label: '最终保持', type: 'percent', better: 'high', rankable: true, valKey: 'v', dispKey: 'disp' }
    ]
  },
  stable: {
    title: '⑤ 稳定输出区耗电对比',
    mark: '⑤',
    data: STABLE,
    note: '从车辆起步（电流首次 > 5A）至首次跌破 90% 基线的区间。凌博全程未限流即全段 10km。',
    columns: [
      { key: 'endTime', label: '截止时间', type: 'text', rankable: false },
      { key: 'endKm', label: '区间里程', type: 'text', rankable: false },
      { key: 'avgPower', label: '平均功率', type: 'number', unit: 'W', better: 'high', rankable: true },
      { key: 'whPerH', label: '单位时间耗能', type: 'number', unit: 'W·h/h', better: 'low', rankable: true },
      { key: 'whPerKm', label: 'Wh/km', type: 'number', unit: '', better: 'low', rankable: true },
      { key: 'kmPerAh', label: 'km/Ah', type: 'number', unit: '', better: 'high', rankable: true },
      { key: 'avgV', label: '平均电压', type: 'number', unit: 'V', better: 'none', rankable: true },
      { key: 'avgA', label: '平均电流', type: 'number', unit: 'A', better: 'none', rankable: true }
    ]
  },
  accel: {
    title: '⑥ 加速性能横评',
    mark: '⑥',
    data: ACCEL,
    note: '每项取 3 次测试平均值。九号原厂受 40A 硬件限制未执行 0-30/0-60/40-70，仅作参考。',
    columns: [
      { key: 'a030', label: '0-30', type: 'number', unit: 's', better: 'low', rankable: true },
      { key: 'a060', label: '0-60', type: 'number', unit: 's', better: 'low', rankable: true },
      { key: 'a4070', label: '40-70', type: 'number', unit: 's', better: 'low', rankable: true },
      { key: 't500', label: '500m耗时', type: 'number', unit: 's', better: 'low', rankable: true },
      { key: 'v500', label: '500m极速', type: 'number', unit: 'km/h', better: 'high', rankable: true }
    ]
  }
};

const SECTION_IDS = ['hardware', 'software', 'handling', 'thermal', 'stable', 'accel'];

function getNumeric(val, col) {
  if (val == null) return null;
  if (typeof val === 'object') return val[col.valKey] == null ? null : val[col.valKey];
  if (typeof val === 'number') return val;
  return null;
}

function getDisplay(val, col) {
  if (val == null || val === '—') return '—';
  if (typeof val === 'object') return val[col.dispKey] || '—';
  if (col.unit && typeof val === 'number') return '' + val + col.unit;
  return String(val);
}

function textTone(val) {
  const good = ['连3次均成功', '说明清晰易懂', '可激活', '很线性', '延迟可控', '亮', 'OTA在线升级', '全协议'];
  const bad = ['无说明', '不可激活', '不亮', '不线性', '延迟较大', '断电', '硬断电', '几乎不限流'];
  const warn = ['部分说明', '适中', '较小', '高温无法打开/低温不亮后灯', 'CAN协议'];
  if (good.some(function(k) { return val === k; })) return 'good';
  if (bad.some(function(k) { return val.indexOf(k) >= 0; })) return 'bad';
  if (warn.some(function(k) { return val === k; })) return 'warn';
  return '';
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function rgba(hex, alpha) {
  const c = hexToRgb(hex);
  return 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + alpha + ')';
}

function defaultSectionState(id, saved) {
  const cfg = SEC_CONFIG[id];
  const firstRankable = cfg.columns.find(function(c) { return c.rankable; });
  const sectionSaved = saved && typeof saved === 'object' ? saved : {};
  return {
    view: sectionSaved.view === 'rank' ? 'rank' : 'table',
    sortKey: sectionSaved.sortKey || (firstRankable ? firstRankable.key : null),
    sortAsc: typeof sectionSaved.sortAsc === 'boolean' ? sectionSaved.sortAsc : null,
    hiddenCols: Array.isArray(sectionSaved.hiddenCols) ? sectionSaved.hiddenCols : [],
    showColPicker: !!sectionSaved.showColPicker
  };
}

function normalizeSaved(saved) {
  const source = saved && typeof saved === 'object' ? saved : {};
  const sections = {};
  SECTION_IDS.forEach(function(id) {
    sections[id] = defaultSectionState(id, source.sections && source.sections[id]);
  });
  return {
    dark: source.dark !== false,
    highlighted: Array.isArray(source.highlighted) ? source.highlighted : [],
    showBadges: source.showBadges !== false,
    showRankIdx: source.showRankIdx !== false,
    activeSection: SECTION_IDS.indexOf(source.activeSection) >= 0 ? source.activeSection : 'hardware',
    sections: sections
  };
}

function visibleCols(id, sectionState) {
  const hidden = sectionState.hiddenCols || [];
  return SEC_CONFIG[id].columns.filter(function(c) {
    return hidden.indexOf(c.key) < 0;
  });
}

function currentSort(id, sectionState, cols) {
  const col = cols.find(function(c) { return c.key === sectionState.sortKey; }) || cols.find(function(c) { return c.rankable; }) || null;
  const defaultAsc = col && col.better === 'low';
  return {
    col: col,
    isAsc: sectionState.sortAsc === null || sectionState.sortAsc === undefined ? !!defaultAsc : sectionState.sortAsc
  };
}

function buildBestMap(cfg, cols) {
  const map = {};
  cols.forEach(function(c) {
    if (!c.rankable || c.better === 'none' || c.better == null) return;
    const items = PRODUCTS.filter(function(p) { return !p.isRef; }).map(function(p) {
      return { id: p.id, v: getNumeric(cfg.data[p.id] && cfg.data[p.id][c.key], c) };
    }).filter(function(x) {
      return x.v != null;
    });
    if (!items.length) return;
    items.sort(function(a, b) {
      return c.better === 'low' ? a.v - b.v : b.v - a.v;
    });
    map[c.key] = items[0].id;
  });
  cols.forEach(function(c) {
    if (c.highlight && !map[c.key]) map[c.key] = c.highlight[0];
  });
  return map;
}

function sortProducts(cfg, sortCol, isAsc) {
  if (!sortCol || !sortCol.rankable) return PRODUCTS.slice();
  const nonRef = PRODUCTS.filter(function(p) { return !p.isRef; });
  const ref = PRODUCTS.filter(function(p) { return p.isRef; });
  const withVal = nonRef.filter(function(p) {
    return getNumeric(cfg.data[p.id] && cfg.data[p.id][sortCol.key], sortCol) != null;
  });
  const noVal = nonRef.filter(function(p) {
    return getNumeric(cfg.data[p.id] && cfg.data[p.id][sortCol.key], sortCol) == null;
  });
  withVal.sort(function(a, b) {
    const av = getNumeric(cfg.data[a.id] && cfg.data[a.id][sortCol.key], sortCol);
    const bv = getNumeric(cfg.data[b.id] && cfg.data[b.id][sortCol.key], sortCol);
    return isAsc ? av - bv : bv - av;
  });
  return withVal.concat(noVal).concat(ref);
}

function buildRankIndexMap(cfg, sortCol, showRankIdx) {
  if (!sortCol || !sortCol.rankable || !showRankIdx || sortCol.better === 'none') return {};
  const map = {};
  const items = PRODUCTS.filter(function(p) { return !p.isRef; }).map(function(p) {
    return { id: p.id, v: getNumeric(cfg.data[p.id] && cfg.data[p.id][sortCol.key], sortCol) };
  }).filter(function(x) {
    return x.v != null;
  });
  items.sort(function(a, b) {
    return sortCol.better === 'low' ? a.v - b.v : b.v - a.v;
  });
  items.forEach(function(x, i) {
    map[x.id] = i + 1;
  });
  return map;
}

function buildRows(cfg, cols, sortCol, isAsc, state) {
  const bestMap = buildBestMap(cfg, cols);
  const rankIndexMap = buildRankIndexMap(cfg, sortCol, state.showRankIdx);
  return sortProducts(cfg, sortCol, isAsc).map(function(p) {
    const highlighted = state.highlighted.indexOf(p.id) >= 0;
    const rankIdx = rankIndexMap[p.id];
    return {
      id: p.id,
      name: p.name,
      isRef: p.isRef,
      highlighted: highlighted,
      rankLabel: rankIdx && !p.isRef ? '#' + rankIdx : '',
      rowStyle: highlighted ? 'background:' + rgba(p.color, 0.10) + ';' : (p.isRef ? 'background:var(--ref-bg);' : ''),
      modelStyle: highlighted ? 'color:' + p.color + ';background:' + rgba(p.color, 0.14) + ';border-left-color:' + p.color + ';' : (p.isRef ? 'border-left-color:var(--dim);' : ''),
      cells: cols.map(function(c) {
        const raw = cfg.data[p.id] && cfg.data[p.id][c.key];
        const display = getDisplay(raw, c);
        return {
          key: c.key,
          display: display,
          tone: cfg.colorize ? textTone(display) : '',
          best: state.showBadges && bestMap[c.key] === p.id && !p.isRef
        };
      })
    };
  });
}

function buildRank(cfg, col, isAsc, highlighted) {
  if (!col) {
    return { rankItems: [], averageText: '', refRank: null };
  }
  const items = PRODUCTS.filter(function(p) { return !p.isRef; }).map(function(p) {
    return {
      product: p,
      value: getNumeric(cfg.data[p.id] && cfg.data[p.id][col.key], col),
      display: getDisplay(cfg.data[p.id] && cfg.data[p.id][col.key], col)
    };
  });
  const withVal = items.filter(function(x) { return x.value != null; });
  const noVal = items.filter(function(x) { return x.value == null; });
  withVal.sort(function(a, b) {
    return isAsc ? a.value - b.value : b.value - a.value;
  });
  const values = withVal.map(function(x) { return x.value; });
  const absMax = values.length ? Math.max.apply(null, values) : 0;
  const average = values.length ? values.reduce(function(a, b) { return a + b; }, 0) / values.length : 0;
  const byGood = withVal.slice().sort(function(a, b) {
    return col.better === 'low' ? a.value - b.value : b.value - a.value;
  });
  const ordered = withVal.concat(noVal);
  const rankItems = ordered.map(function(item, idx) {
    const p = item.product;
    const isHl = highlighted.indexOf(p.id) >= 0;
    let rankIdx = idx + 1;
    if (col.better && col.better !== 'none') {
      const goodIdx = byGood.findIndex(function(x) { return x.product.id === p.id; });
      rankIdx = goodIdx >= 0 ? goodIdx + 1 : null;
    }
    const width = item.value == null || !absMax ? 0 : Math.max(0, item.value / absMax * 100);
    const avgLine = item.value != null && absMax > 0 ? average / absMax * 100 : 0;
    return {
      id: p.id,
      name: p.name,
      display: item.display,
      rankLabel: rankIdx ? '#' + rankIdx : '—',
      productStyle: isHl ? 'color:' + p.color + ';border-left-color:' + p.color + ';' : '',
      valueStyle: isHl ? 'color:' + p.color + ';' : '',
      barStyle: 'width:' + width + '%;background:' + (isHl ? p.color : rgba(p.color, 0.70)) + ';',
      avgLineStyle: avgLine > 0 ? 'left:' + avgLine + '%;' : ''
    };
  });
  const refProduct = PRODUCTS.find(function(p) { return p.isRef; });
  const refValue = refProduct ? getNumeric(cfg.data[refProduct.id] && cfg.data[refProduct.id][col.key], col) : null;
  const refRank = refProduct && refValue != null ? {
    name: refProduct.name,
    display: getDisplay(cfg.data[refProduct.id] && cfg.data[refProduct.id][col.key], col),
    barStyle: 'width:' + (absMax ? Math.max(0, refValue / absMax * 100) : 0) + '%;'
  } : null;
  return {
    rankItems: rankItems,
    averageText: values.length ? '平均值 ' + average.toFixed(col.unit === '' ? 2 : 1) + (col.unit || '') : '',
    refRank: refRank
  };
}

function buildSections(state) {
  return SECTION_IDS.map(function(id) {
    const cfg = SEC_CONFIG[id];
    const sec = state.sections[id] || defaultSectionState(id);
    const cols = visibleCols(id, sec);
    const sort = currentSort(id, sec, cols);
    const rankableColumns = cols.filter(function(c) { return c.rankable; });
    const sortHint = sort.col && sort.col.better && sort.col.better !== 'none'
      ? (sort.col.better === 'low' ? '越小越好' : '越大越好')
      : '';
    const rank = buildRank(cfg, sort.col, sort.isAsc, state.highlighted);
    const visibleColumns = cols.map(function(c) {
      let sortIcon = '/assets/icons/sort.svg';
      if (sort.col && sort.col.key === c.key) sortIcon = sort.isAsc ? '/assets/icons/up.svg' : '/assets/icons/down.svg';
      return Object.assign({}, c, { visible: true, sortIcon: sortIcon });
    });
    return {
      id: id,
      mark: cfg.mark,
      title: cfg.title,
      info: SECTION_INFO[id],
      note: cfg.note || '',
      view: sec.view,
      sortKey: sort.col ? sort.col.key : '',
      isAsc: sort.isAsc,
      sortHint: sortHint,
      showColPicker: sec.showColPicker,
      hasRankable: cfg.columns.some(function(c) { return c.rankable; }),
      columns: cfg.columns.map(function(c) {
        return Object.assign({}, c, { visible: sec.hiddenCols.indexOf(c.key) < 0 });
      }),
      visibleColumns: visibleColumns,
      rankableColumns: rankableColumns,
      tableWidth: 220 + cols.length * 190,
      rows: buildRows(cfg, cols, sort.col, sort.isAsc, state),
      rankItems: rank.rankItems,
      averageText: rank.averageText,
      refRank: rank.refRank
    };
  });
}

function productsForState(highlighted) {
  return PRODUCTS.map(function(p) {
    const on = highlighted.indexOf(p.id) >= 0;
    return Object.assign({}, p, {
      highlighted: on,
      chipStyle: on ? 'border-color:' + p.color + ';background:' + rgba(p.color, 0.14) + ';color:' + p.color + ';' : ''
    });
  });
}

function readStorage() {
  try {
    if (typeof tt !== 'undefined' && tt.getStorageSync) {
      return tt.getStorageSync(STORAGE_KEY) || {};
    }
  } catch (e) {}
  return {};
}

function writeStorage(state) {
  try {
    if (typeof tt !== 'undefined' && tt.setStorageSync) {
      tt.setStorageSync(STORAGE_KEY, {
        dark: state.dark,
        highlighted: state.highlighted,
        showBadges: state.showBadges,
        showRankIdx: state.showRankIdx,
        activeSection: state.activeSection,
        sections: state.sections
      });
    }
  } catch (e) {}
}

Page({
  data: {
    pageTitle: PAGE_TITLE,
    dark: true,
    highlighted: [],
    highlightedCountText: '',
    showBadges: true,
    showRankIdx: true,
    activeSection: 'hardware',
    activeInfo: null,
    scrollInto: '',
    products: [],
    sections: [],
    sectionState: {}
  },

  onLoad() {
    const saved = normalizeSaved(readStorage());
    this.applyState(saved, false);
  },

  applyState(next, shouldSave) {
    const state = normalizeSaved(next);
    const data = {
      dark: state.dark,
      highlighted: state.highlighted,
      highlightedCountText: state.highlighted.length ? '(' + state.highlighted.length + ')' : '',
      showBadges: state.showBadges,
      showRankIdx: state.showRankIdx,
      activeSection: state.activeSection,
      activeInfo: next.activeInfo || null,
      products: productsForState(state.highlighted),
      sections: buildSections(state),
      sectionState: state.sections
    };
    this.setData(data);
    if (shouldSave) writeStorage(state);
  },

  currentState() {
    return {
      dark: this.data.dark,
      highlighted: this.data.highlighted,
      showBadges: this.data.showBadges,
      showRankIdx: this.data.showRankIdx,
      activeSection: this.data.activeSection,
      activeInfo: this.data.activeInfo,
      sections: this.data.sectionState
    };
  },

  updateState(mutator, shouldSave) {
    const state = this.currentState();
    mutator(state);
    this.applyState(state, shouldSave !== false);
  },

  toggleDark() {
    this.updateState(function(state) {
      state.dark = !state.dark;
    });
  },

  toggleBadges() {
    this.updateState(function(state) {
      state.showBadges = !state.showBadges;
    });
  },

  toggleRankIdx() {
    this.updateState(function(state) {
      state.showRankIdx = !state.showRankIdx;
    });
  },

  toggleInfo(e) {
    const id = e.currentTarget.dataset.id;
    this.updateState(function(state) {
      state.activeInfo = state.activeInfo === id ? null : id;
    }, false);
  },

  closeInfo() {
    this.updateState(function(state) {
      state.activeInfo = null;
    }, false);
  },

  toggleHighlight(e) {
    const id = e.currentTarget.dataset.id;
    this.updateState(function(state) {
      state.highlighted = state.highlighted.indexOf(id) >= 0
        ? state.highlighted.filter(function(x) { return x !== id; })
        : state.highlighted.concat(id);
    });
  },

  clearHighlights() {
    this.updateState(function(state) {
      state.highlighted = [];
    });
  },

  scrollToSection(e) {
    const id = e.currentTarget.dataset.id;
    this.updateState(function(state) {
      state.activeSection = id;
    });
    this.setData({ scrollInto: 'sec-' + id });
  },

  toggleColPicker(e) {
    const id = e.currentTarget.dataset.id;
    this.updateState(function(state) {
      state.sections[id].showColPicker = !state.sections[id].showColPicker;
    });
  },

  toggleColumn(e) {
    const id = e.currentTarget.dataset.id;
    const key = e.currentTarget.dataset.key;
    this.updateState(function(state) {
      const sec = state.sections[id];
      sec.hiddenCols = sec.hiddenCols.indexOf(key) >= 0
        ? sec.hiddenCols.filter(function(x) { return x !== key; })
        : sec.hiddenCols.concat(key);
      const cols = visibleCols(id, sec);
      if (!cols.some(function(c) { return c.key === sec.sortKey; })) {
        const next = cols.find(function(c) { return c.rankable; });
        sec.sortKey = next ? next.key : null;
        sec.sortAsc = null;
      }
    });
  },

  setView(e) {
    const id = e.currentTarget.dataset.id;
    const view = e.currentTarget.dataset.view;
    this.updateState(function(state) {
      state.sections[id].view = view;
    });
  },

  setSortKey(e) {
    const id = e.currentTarget.dataset.id;
    const key = e.currentTarget.dataset.key;
    this.updateState(function(state) {
      state.sections[id].sortKey = key;
      state.sections[id].sortAsc = null;
    });
  },

  toggleSort(e) {
    const id = e.currentTarget.dataset.id;
    this.updateState(function(state) {
      const sec = state.sections[id];
      const sort = currentSort(id, sec, visibleCols(id, sec));
      sec.sortAsc = !sort.isAsc;
    });
  },

  sortBy(e) {
    const id = e.currentTarget.dataset.id;
    const key = e.currentTarget.dataset.key;
    this.updateState(function(state) {
      const col = SEC_CONFIG[id].columns.find(function(c) { return c.key === key; });
      if (!col || !col.rankable) return;
      const sec = state.sections[id];
      const sort = currentSort(id, sec, visibleCols(id, sec));
      if (sec.sortKey === key) {
        sec.sortAsc = !sort.isAsc;
      } else {
        sec.sortKey = key;
        sec.sortAsc = null;
      }
    });
  }
});
