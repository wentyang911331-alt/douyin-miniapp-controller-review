const PAGE_TITLE = '2026年春季260级控制器对比手册';
const NAV_TITLE = '摩拓';
const STORAGE_KEY = 'ctrl-review-miniapp-v1';
const WATERMARK_TEXT = '小拓子';
const WATERMARK_ITEMS = Array.from({ length: 72 }).map(function(_, i) {
  return { id: i, text: WATERMARK_TEXT };
});

const LOADING = {
  minMs: 1000,
  phaseOneMs: 420,
  fillMs: 220,
  holdMs: 340,
  creepPercent: 90,
  creepMs: 6000,
  drawMs: 960,
  drawPauseMs: 500,
  enterMs: 320,
  leaveMs: 280
};

const LOADING_CANVAS = {
  width: 108,
  height: 64,
  viewBox: { x: 294, y: 347, width: 252, height: 150 },
  lineWidth: 35.7,
  lineOne: [[318.9, 472], [400.4, 378.3]],
  lineTwo: [
    [383.6, 472],
    [458, 386.5],
    [464.8, 381.2],
    [474.3, 382.4],
    [490.5, 398.6],
    [490.5, 472]
  ],
  dot: { x: 529, y: 380.8, r: 20.3 }
};

const THEME = {
  dark: {
    navBg: '#0E1623',
    navFront: '#ffffff'
  },
  light: {
    navBg: '#FFFFFF',
    navFront: '#000000'
  }
};

const PRODUCTS = [
  { id: 'yanxin', name: '雁鑫 X300', short: '雁鑫', isRef: false, color: '#1FA98F' },
  { id: 'spd', name: 'SPD 72260S', short: 'SPD', isRef: false, color: '#D88A2C' },
  { id: 'lingbo', name: '凌博 E260 Pro Max', short: '凌博', isRef: false, color: '#8B5FE0' },
  { id: 'apt', name: 'APT F300', short: 'APT', isRef: false, color: '#E0524D' },
  { id: 'zhike', name: '智科 72260', short: '智科', isRef: false, color: '#5E7BFF' },
  { id: 'datai', name: '大泰 72260', short: '大泰', isRef: false, color: '#6FAE3A' },
  { id: 'ninebot', name: '九号 M395C 原厂', short: '九号原厂', isRef: true, color: '#6E7889' }
];

function iconPath(name, suffix) {
  return '/assets/icons/' + name + (suffix ? '-' + suffix : '') + '.svg';
}

function toneIcon(name, dark, active) {
  if (active) return iconPath(name, dark ? 'active' : 'active-light');
  return iconPath(name, dark ? '' : 'light');
}

function textIcon(name, dark) {
  return iconPath(name, dark ? 'text' : 'text-light');
}

function loadingProgressStyle(percent, ms, ease) {
  return 'width:' + percent + '%;transition:width ' + ms + 'ms ' + (ease || 'linear') + ';';
}

function distance(a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function scaleLogoPoint(point) {
  const scale = LOADING_CANVAS.width / LOADING_CANVAS.viewBox.width;
  return [
    (point[0] - LOADING_CANVAS.viewBox.x) * scale,
    (point[1] - LOADING_CANVAS.viewBox.y) * scale
  ];
}

function drawLogoSegment(ctx, points, progress) {
  if (progress <= 0) return;
  const scaled = points.map(scaleLogoPoint);
  const lengths = [];
  let total = 0;
  for (let i = 0; i < scaled.length - 1; i += 1) {
    const len = distance(scaled[i], scaled[i + 1]);
    lengths.push(len);
    total += len;
  }
  let target = total * Math.min(progress, 1);
  ctx.beginPath();
  ctx.moveTo(scaled[0][0], scaled[0][1]);
  for (let i = 0; i < lengths.length; i += 1) {
    const start = scaled[i];
    const end = scaled[i + 1];
    if (target >= lengths[i]) {
      ctx.lineTo(end[0], end[1]);
      target -= lengths[i];
    } else {
      const ratio = lengths[i] ? target / lengths[i] : 0;
      ctx.lineTo(
        start[0] + (end[0] - start[0]) * ratio,
        start[1] + (end[1] - start[1]) * ratio
      );
      break;
    }
  }
  ctx.stroke();
}

const HARDWARE = {
  yanxin: { busA: 100, phaseA: 300, vMin: 48, vMax: 72, water: '无', proto: '全协议' },
  spd: { busA: 80, phaseA: 260, vMin: 48, vMax: 72, water: '无', proto: 'CAN协议' },
  lingbo: { busA: 90, phaseA: 260, vMin: 48, vMax: 76, water: '无', proto: 'CAN协议' },
  apt: { busA: 100, phaseA: 300, vMin: 48, vMax: 80, water: '无', proto: '全协议' },
  zhike: { busA: 80, phaseA: 260, vMin: 48, vMax: 76, water: '无', proto: 'CAN协议' },
  datai: { busA: 90, phaseA: 260, vMin: 48, vMax: 72, water: '无', proto: '全协议' },
  ninebot: { busA: 40, phaseA: null, vMin: 72, vMax: 72, water: '无', proto: 'CAN协议' }
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
  hardware: {
    title: '硬件规格怎么看',
    intro: '这一页先看能不能用、值不值、余量够不够。',
    points: [
      '母线电流像电池给出的总力气，通常越高越能撑高速和持续输出。',
      '相线电流更影响起步和低速爆发，实际快不快还要看调校和散热。',
      '电压看能不能配电池，协议看仪表、蓝牙、刹车等功能能否配合。'
    ],
    note: '九号原厂作为参考基线，不参与对比控制器排名。'
  },
  software: {
    title: '软件和辅助功能怎么看',
    intro: '这一页看日常用起来省不省心，不只看性能数字。',
    points: [
      '蓝牙和 OTA 影响后期调参、更新、排查问题是否方便。',
      '调节项标注越清楚，新手越不容易误改关键参数。',
      '巡航、制动巡航、驻车刹车灯重点看是否稳定，以及是否匹配原车逻辑。'
    ],
    note: '软件评分是基于本次测试体验整理，不能替代长期使用稳定性结论。'
  },
  handling: {
    title: '骑行手感怎么看',
    intro: '这里看低速跟车、起步补油和电门开合好不好控。',
    points: [
      '电门延迟越小，给油反应越直接，但太冲也会不好控。',
      '线性度越好，电门输出越顺，不容易突然窜车。',
      '空行程太大会觉得拧了没反应，太小又容易低速紧张。'
    ],
    note: '手感带有主观体验，本页用于横向参考，不等同于绝对性能排名。'
  },
  thermal: {
    title: '温控限流怎么看',
    intro: '温控限流就是控制器热起来后会不会主动收力。',
    points: [
      '基线电流是前 60 秒高输出参考，用来判断后面掉了多少。',
      '越晚跌破 90%、80%、60%，说明高输出保持得越久。',
      '最终保持比例越高，代表热起来后剩余输出越多。'
    ],
    note: '几乎不限流不一定永远更好，还要结合温度、保护策略和长期可靠性看。'
  },
  stable: {
    title: '稳定输出和耗电怎么看',
    intro: '这一页把控制器放在接近的输出区间里比较能耗。',
    points: [
      'Wh/km 越低，跑同样距离耗电越少，通常更省电。',
      'km/Ah 越高，代表同样电量能跑得更远。',
      '平均功率和平均电流只说明这段输出强度，不能单独当续航结论。'
    ],
    note: '里程缺失或参考样本只作辅助观察，不参与有效排名。'
  },
  accel: {
    title: '加速测试怎么看',
    intro: '加速页关注的是不同速度段的响应和后段能力。',
    points: [
      '0-30 更偏起步和低速响应，看日常起步是否轻快。',
      '0-60 和 40-70 更能看中后段持续加速能力。',
      '500m 耗时越短、尾速越高，通常说明整段加速更强。'
    ],
    note: '每项取 3 次测试平均值；未测项目只作为边界参考，不参与对应排名。'
  }
};

const SEC_CONFIG = {
  hardware: {
    title: '1. 硬件规格对比',
    mark: '1. 硬件',
    data: HARDWARE,
    columns: [
      { key: 'busA', label: '峰值母线', type: 'number', unit: 'A', better: 'high', rankable: true },
      { key: 'phaseA', label: '峰值相线', type: 'number', unit: 'A', better: 'high', rankable: true },
      { key: 'vMin', label: '最低电压', type: 'number', unit: 'V', better: 'none', rankable: true },
      { key: 'vMax', label: '最高电压', type: 'number', unit: 'V', better: 'high', rankable: true },
      { key: 'water', label: '水冷', type: 'text', rankable: false },
      { key: 'proto', label: '协议', type: 'text', rankable: false }
    ]
  },
  software: {
    title: '2. 交互软件与辅助功能',
    mark: '2. 软件',
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
    title: '3. 日常骑行手感（模拟跟车）',
    mark: '3. 手感',
    data: HANDLING,
    colorize: true,
    columns: [
      { key: 'delay', label: '电门延迟', type: 'text', rankable: false },
      { key: 'linearity', label: '电门线性度', type: 'text', rankable: false },
      { key: 'deadzone', label: '电门空行程', type: 'text', rankable: false }
    ]
  },
  thermal: {
    title: '4. 10km 温控限流路径',
    mark: '4. 温控',
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
    title: '5. 稳定输出区耗电对比',
    mark: '5. 耗电',
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
    title: '6. 加速性能横评',
    mark: '6. 加速',
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

function textTone(colKey, val) {
  if (val == null || val === '—' || val === '无') return '';
  if (colKey === 'bt' && val === '连3次均成功') return 'good';
  if (colKey === 'ota' && val === 'OTA在线升级') return 'good';
  if (colKey === 'label') {
    if (val === '说明清晰易懂') return 'good';
    if (val === '部分说明') return 'warn';
    if (val === '无说明') return 'bad';
  }
  if (colKey === 'cruise') {
    if (val === '仅拧电门可激活') return 'good';
    if (val === '松油门可激活') return 'bad';
  }
  if (colKey === 'brakeCruise') {
    if (val === '不可激活') return 'good';
    if (val === '可激活') return 'bad';
  }
  if (colKey === 'parkLight') {
    if (val === '亮') return 'good';
    if (val === '不亮') return 'bad';
    if (val.indexOf('高温') >= 0 || val.indexOf('低温') >= 0) return 'warn';
  }
  if (colKey === 'delay') {
    if (val === '延迟可控') return 'good';
    if (val === '延迟较大') return 'bad';
  }
  if (colKey === 'linearity') {
    if (val === '很线性') return 'good';
    if (val === '适中') return 'warn';
    if (val === '不线性') return 'bad';
  }
  if (colKey === 'deadzone' && val === '适中') return 'good';
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

function hexByte(value) {
  const s = Math.max(0, Math.min(255, Math.round(value))).toString(16);
  return s.length === 1 ? '0' + s : s;
}

function blendHex(fgHex, bgHex, alpha) {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  return '#' + hexByte(fg.r * alpha + bg.r * (1 - alpha)) +
    hexByte(fg.g * alpha + bg.g * (1 - alpha)) +
    hexByte(fg.b * alpha + bg.b * (1 - alpha));
}

function modelHighlightBg(color, dark) {
  return blendHex(color, dark ? '#18212F' : '#FFFFFF', dark ? 0.14 : 0.10);
}

function defaultSectionState(id, saved) {
  const cfg = SEC_CONFIG[id];
  const sectionSaved = saved && typeof saved === 'object' ? saved : {};
  const validKeys = cfg.columns.map(function(c) { return c.key; });
  const hiddenCols = Array.isArray(sectionSaved.hiddenCols)
    ? sectionSaved.hiddenCols.filter(function(key) { return validKeys.indexOf(key) >= 0; })
    : [];
  const savedSortKey = validKeys.indexOf(sectionSaved.sortKey) >= 0 && hiddenCols.indexOf(sectionSaved.sortKey) < 0
    ? sectionSaved.sortKey
    : null;
  const firstRankable = cfg.columns.find(function(c) {
    return c.rankable && hiddenCols.indexOf(c.key) < 0;
  });
  return {
    view: sectionSaved.view === 'rank' ? 'rank' : 'table',
    sortKey: savedSortKey || (firstRankable ? firstRankable.key : null),
    sortAsc: typeof sectionSaved.sortAsc === 'boolean' ? sectionSaved.sortAsc : null,
    hiddenCols: hiddenCols,
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
    showBadges: source.showBadges === true,
    showRankIdx: source.showRankIdx === true,
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
      modelStyle: highlighted ? 'color:' + p.color + ';background:' + modelHighlightBg(p.color, state.dark) + ';border-left-color:' + p.color + ';' : (p.isRef ? 'border-left-color:var(--dim);' : ''),
      cells: cols.map(function(c) {
        const raw = cfg.data[p.id] && cfg.data[p.id][c.key];
        const display = getDisplay(raw, c);
        return {
          key: c.key,
          display: display,
          longText: String(display).length > 9 || c.key === 'parkLight',
          tone: cfg.colorize ? textTone(c.key, display) : '',
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
      isLast: idx === ordered.length - 1,
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
  const dark = state.dark;
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
      let sortIcon = toneIcon('sort', dark, false);
      if (sort.col && sort.col.key === c.key) sortIcon = toneIcon(sort.isAsc ? 'up' : 'down', dark, true);
      return Object.assign({}, c, { visible: true, sortIcon: sortIcon });
    });
    const isInfoActive = state.activeInfo === id;
    const isColumnActive = sec.showColPicker;
    return {
      id: id,
      mark: cfg.mark,
      title: cfg.title,
      infoTitle: SECTION_INFO[id].title,
      infoIntro: SECTION_INFO[id].intro,
      infoPoints: SECTION_INFO[id].points,
      infoNote: SECTION_INFO[id].note,
      note: cfg.note || '',
      view: sec.view,
      sortKey: sort.col ? sort.col.key : '',
      isAsc: sort.isAsc,
      infoIcon: toneIcon('info', dark, isInfoActive),
      columnsIcon: toneIcon('columns', dark, isColumnActive),
      tableIcon: sec.view === 'table' ? iconPath('table', 'active') : toneIcon('table', dark, false),
      trophyIcon: sec.view === 'rank' ? iconPath('trophy', 'active') : toneIcon('trophy', dark, false),
      sortToggleIcon: textIcon(sort.isAsc ? 'up' : 'down', dark),
      sortHint: sortHint,
      showColPicker: sec.showColPicker,
      hasRankable: cfg.columns.some(function(c) { return c.rankable; }),
      columns: cfg.columns.map(function(c) {
        return Object.assign({}, c, { visible: sec.hiddenCols.indexOf(c.key) < 0 });
      }),
      visibleColumns: visibleColumns,
      rankableColumns: rankableColumns,
      tableWidth: 250 + cols.length * 210,
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

function activeInfoFor(id) {
  if (!id || SECTION_IDS.indexOf(id) < 0) return null;
  const info = SECTION_INFO[id];
  return {
    id: id,
    title: info.title,
    intro: info.intro,
    points: info.points,
    note: info.note
  };
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
    watermarks: WATERMARK_ITEMS,
    dark: true,
    highlighted: [],
    highlightedCountText: '',
    showBadges: true,
    showRankIdx: true,
    activeSection: 'hardware',
    activeInfo: null,
    activeInfoModal: null,
    loadingVisible: true,
    loadingEntering: false,
    loadingLeaving: false,
    loadingDrawing: false,
    loadingCanvasReady: false,
    loadingProgressStyle: loadingProgressStyle(0, 0),
    iconTheme: iconPath('theme'),
    iconBadge: iconPath('badge'),
    iconRankIdx: iconPath('columns'),
    iconClose: iconPath('close'),
    scrollInto: '',
    products: [],
    sections: [],
    sectionState: {}
  },

  onLoad() {
    this.startEntryLoading();
    const saved = normalizeSaved(readStorage());
    this.applyState(saved, false);
    this.syncNavigationBar(saved.dark);
  },

  onReady() {
    this.initLoadingCanvas();
    this.markEntryReady();
  },

  onShow() {
    this.syncNavigationBar(this.data.dark);
  },

  onUnload() {
    this.clearEntryLoadingTimers();
  },

  syncNavigationBar(dark) {
    try {
      if (typeof tt !== 'undefined' && tt.setNavigationBarTitle) {
        tt.setNavigationBarTitle({ title: NAV_TITLE });
      }
      if (typeof tt !== 'undefined' && tt.setNavigationBarColor) {
        const theme = dark ? THEME.dark : THEME.light;
        tt.setNavigationBarColor({
          frontColor: theme.navFront,
          backgroundColor: theme.navBg
        });
      }
    } catch (e) {}
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
      activeInfoModal: activeInfoFor(next.activeInfo),
      iconTheme: toneIcon('theme', state.dark, false),
      iconBadge: toneIcon('badge', state.dark, state.showBadges),
      iconRankIdx: toneIcon('columns', state.dark, state.showRankIdx),
      iconClose: toneIcon('close', state.dark, false),
      products: productsForState(state.highlighted),
      sections: buildSections(state),
      sectionState: state.sections
    };
    this.setData(data);
    if (shouldSave) writeStorage(state);
  },

  scheduleEntryLoading(fn, ms) {
    this._loadingTimers = this._loadingTimers || [];
    const timer = setTimeout(fn, ms);
    this._loadingTimers.push(timer);
    return timer;
  },

  clearEntryLoadingTimers() {
    if (this._loadingTimers) {
      this._loadingTimers.forEach(function(timer) {
        clearTimeout(timer);
      });
    }
    this._loadingTimers = [];
    if (this._loadingLogoTimer) {
      clearTimeout(this._loadingLogoTimer);
      this._loadingLogoTimer = null;
    }
    this.stopLoadingCanvasLoop();
  },

  drawLoadingLogoOnce() {
    this.setData({ loadingDrawing: false });
    this.scheduleEntryLoading(() => {
      if (!this.data.loadingVisible || this.data.loadingLeaving) return;
      this.setData({ loadingDrawing: true });
    }, 20);
  },

  startLoadingLogoLoop() {
    const loop = () => {
      if (!this.data.loadingVisible || this.data.loadingLeaving) return;
      this.drawLoadingLogoOnce();
      this._loadingLogoTimer = this.scheduleEntryLoading(loop, LOADING.drawMs + LOADING.drawPauseMs);
    };
    if (this._loadingLogoTimer) {
      clearTimeout(this._loadingLogoTimer);
      this._loadingLogoTimer = null;
    }
    loop();
  },

  initLoadingCanvas() {
    if (typeof tt === 'undefined' || !tt.createSelectorQuery) return;
    try {
      const query = this.createSelectorQuery ? this.createSelectorQuery() : tt.createSelectorQuery();
      query
        .select('#mtLoadingCanvas')
        .node()
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) return;
          const canvas = res[0].node;
          const ctx = canvas.getContext && canvas.getContext('2d');
          if (!ctx) return;
          const dpr = tt.getSystemInfoSync ? (tt.getSystemInfoSync().pixelRatio || 1) : 1;
          canvas.width = LOADING_CANVAS.width * dpr;
          canvas.height = LOADING_CANVAS.height * dpr;
          ctx.scale(dpr, dpr);
          this._loadingCanvas = canvas;
          this._loadingCanvasCtx = ctx;
          this.setData({ loadingCanvasReady: true });
          this.stopLoadingLogoLoop();
          this.startLoadingCanvasLoop();
        });
    } catch (e) {}
  },

  loadingLogoProgress(now) {
    const cycle = LOADING.drawMs + LOADING.drawPauseMs;
    const t = ((now - this._entryLoadStart) % cycle + cycle) % cycle;
    const p1 = Math.max(0, Math.min(1, (t - 60) / 340));
    const p2 = Math.max(0, Math.min(1, (t - 360) / 380));
    const dot = Math.max(0, Math.min(1, (t - 700) / 260));
    return { p1: p1, p2: p2, dot: dot };
  },

  renderLoadingCanvas() {
    const canvas = this._loadingCanvas;
    const ctx = this._loadingCanvasCtx;
    if (!canvas || !ctx || !this.data.loadingVisible || this.data.loadingLeaving) return;
    const progress = this.loadingLogoProgress(Date.now());
    const scale = LOADING_CANVAS.width / LOADING_CANVAS.viewBox.width;
    ctx.clearRect(0, 0, LOADING_CANVAS.width, LOADING_CANVAS.height);
    ctx.save();
    ctx.strokeStyle = this.data.dark ? '#5E7BFF' : '#3B54D6';
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = LOADING_CANVAS.lineWidth * scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawLogoSegment(ctx, LOADING_CANVAS.lineOne, progress.p1);
    drawLogoSegment(ctx, LOADING_CANVAS.lineTwo, progress.p2);
    if (progress.dot > 0) {
      const dot = scaleLogoPoint([LOADING_CANVAS.dot.x, LOADING_CANVAS.dot.y]);
      ctx.globalAlpha = progress.dot;
      ctx.beginPath();
      ctx.arc(dot[0], dot[1], LOADING_CANVAS.dot.r * scale * progress.dot, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    const next = () => this.renderLoadingCanvas();
    if (canvas.requestAnimationFrame) {
      this._loadingCanvasFrame = canvas.requestAnimationFrame(next);
    } else {
      this._loadingCanvasFallbackTimer = this.scheduleEntryLoading(next, 16);
    }
  },

  startLoadingCanvasLoop() {
    this.stopLoadingCanvasLoop();
    this.renderLoadingCanvas();
  },

  stopLoadingCanvasLoop() {
    if (this._loadingCanvas && this._loadingCanvasFrame && this._loadingCanvas.cancelAnimationFrame) {
      this._loadingCanvas.cancelAnimationFrame(this._loadingCanvasFrame);
    }
    this._loadingCanvasFrame = null;
    if (this._loadingCanvasFallbackTimer) {
      clearTimeout(this._loadingCanvasFallbackTimer);
      this._loadingCanvasFallbackTimer = null;
    }
  },

  stopLoadingLogoLoop() {
    if (this._loadingLogoTimer) {
      clearTimeout(this._loadingLogoTimer);
      this._loadingLogoTimer = null;
    }
    this.setData({ loadingDrawing: false });
  },

  setLoadingProgress(percent, ms, ease) {
    this.setData({
      loadingProgressStyle: loadingProgressStyle(percent, ms, ease)
    });
  },

  startEntryLoading() {
    this.clearEntryLoadingTimers();
    this._entryLoadStart = Date.now();
    this._entryRealDone = false;
    this._entryPhaseOneDone = false;
    this._entryFinishing = false;
    this.setData({
      loadingVisible: true,
      loadingEntering: false,
      loadingLeaving: false,
      loadingDrawing: false,
      loadingCanvasReady: false,
      loadingProgressStyle: loadingProgressStyle(0, 0)
    });
    this.scheduleEntryLoading(() => {
      this.setData({ loadingEntering: true });
      this.setLoadingProgress(20, LOADING.phaseOneMs);
    }, 20);
    this.scheduleEntryLoading(() => {
      this.setData({ loadingEntering: false });
    }, LOADING.enterMs);
    this.startLoadingLogoLoop();
    this.scheduleEntryLoading(() => {
      this._entryPhaseOneDone = true;
      if (this._entryRealDone) {
        this.finishEntryLoading();
      } else {
        this.setLoadingProgress(LOADING.creepPercent, LOADING.creepMs);
      }
    }, LOADING.phaseOneMs + 20);
  },

  markEntryReady() {
    this._entryRealDone = true;
    if (this._entryPhaseOneDone) {
      this.finishEntryLoading();
    }
  },

  finishEntryLoading() {
    if (this._entryFinishing || !this.data.loadingVisible) return;
    this._entryFinishing = true;
    this.setLoadingProgress(100, LOADING.fillMs, 'cubic-bezier(.4,0,.2,1)');
    const elapsed = Date.now() - this._entryLoadStart;
    const closeIn = Math.max(LOADING.fillMs + LOADING.holdMs, LOADING.minMs - elapsed);
    this.scheduleEntryLoading(() => {
      this.closeEntryLoading();
    }, closeIn);
  },

  closeEntryLoading() {
    this.stopLoadingLogoLoop();
    this.setData({
      loadingLeaving: true,
      loadingDrawing: false
    });
    this.scheduleEntryLoading(() => {
      this.setData({
        loadingVisible: false,
        loadingLeaving: false,
        loadingProgressStyle: loadingProgressStyle(0, 0)
      });
    }, LOADING.leaveMs);
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
    const nextDark = !this.data.dark;
    this.updateState(function(state) {
      state.dark = nextDark;
    });
    this.syncNavigationBar(nextDark);
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
