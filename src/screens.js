// Procedural "screenshots" of real-looking work: editor, terminal, docs, chat…
// Drawn as SVG so every capture on the site shares one rendering style.

export function rng(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 320, H = 200;
const UI = "font-family=\"Geist, 'Noto Sans SC', 'PingFang SC', sans-serif\"";
const MONO = "font-family=\"'Geist Mono', ui-monospace, Menlo, monospace\"";
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const r = (x, y, w, h, fill, rx = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const t = (x, y, s, fill, size = 6, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;

function lights(dark = true) {
  return `<g opacity="${dark ? 0.9 : 1}"><circle cx="9" cy="8" r="2.6" fill="#ff5f57"/><circle cx="17" cy="8" r="2.6" fill="#febc2e"/><circle cx="25" cy="8" r="2.6" fill="#28c840"/></g>`;
}

/* ---------- code editor ---------- */
const CODE = [
  [['k', 'func '], ['f', 'refreshToken'], ['p', '(ctx context.Context) '], ['k', 'error'], ['p', ' {']],
  [['p', '  mu.'], ['f', 'Lock'], ['p', '()']],
  [['k', '  defer '], ['p', 'mu.'], ['f', 'Unlock'], ['p', '()']],
  [['c', '  // 单飞：并发请求只刷新一次']],
  [['k', '  if '], ['p', 'time.'], ['f', 'Until'], ['p', '(tok.Expiry) > '], ['n', '30'], ['p', '*time.Second {']],
  [['k', '    return '], ['k', 'nil']],
  [['p', '  }']],
  [['p', '  next, err := client.'], ['f', 'Refresh'], ['p', '(ctx, tok.Refresh)']],
  [['k', '  if '], ['p', 'err != '], ['k', 'nil'], ['p', ' {']],
  [['k', '    return '], ['p', 'fmt.'], ['f', 'Errorf'], ['p', '('], ['s', '"refresh: %w"'], ['p', ', err)']],
  [['p', '  }']],
  [['p', '  tok = next']],
  [['k', '  return '], ['k', 'nil']],
  [['p', '}']],
];
const SYN = { k: '#c792ea', f: '#82aaff', p: '#d6d3cc', s: '#ffcb8b', c: '#6b6b7a', n: '#f78c6c' };

function code(R, a) {
  let s = r(0, 0, W, H, '#16161c') + r(0, 0, W, 16, '#1e1e26') + lights();
  s += r(0, 16, 64, H - 16, '#1a1a21');
  const files = ['auth', '  session.go', '  token.go', '  token_test.go', 'api', '  ws.go', 'web', 'go.mod'];
  files.forEach((f, i) => { const on = i === 1; if (on) s += r(4, 23 + i * 10, 56, 9, 'rgba(255,255,255,.07)', 2); s += t(8, 30 + i * 10, f, on ? '#f3efe7' : '#8a8896', 5.4, MONO); });
  s += r(64, 16, 70, 13, '#16161c') + t(72, 25, 'session.go', '#f3efe7', 5.6, MONO) + r(64, 28, 70, 1.2, a);
  s += t(140, 25, 'token.go', '#6b6b7a', 5.6, MONO);
  const off = Math.floor(R() * 3);
  CODE.slice(off).forEach((line, i) => {
    const y = 42 + i * 10.4;
    if (y > H - 22) return;
    s += t(70, y, String(i + 12 + off), '#4b4b58', 5.2, MONO);
    let x = 84;
    let spans = '';
    line.forEach(([k, txt]) => { spans += `<tspan fill="${SYN[k]}">${esc(txt)}</tspan>`; x += txt.length * 3.3; });
    s += `<text x="84" y="${y}" font-size="5.6" ${MONO} xml:space="preserve">${spans}</text>`;
    if (i === 3 - off) s += r(64, y - 7, W - 64, 9.6, 'rgba(255,255,255,.04)');
  });
  s += r(0, H - 12, W, 12, a, 0, 'opacity=".9"') + t(8, H - 4, '⎇ fix/token-refresh   ✓ 12 tests', '#16161c', 5.2, MONO);
  return s;
}

/* ---------- terminal ---------- */
function terminal(R, a) {
  const L = [
    ['$ ', 'go test ./auth/... -run Refresh -v'],
    ['', '=== RUN   TestRefreshConcurrent'],
    ['', '--- PASS: TestRefreshConcurrent (0.21s)'],
    ['', '=== RUN   TestRefreshExpired'],
    ['', '--- PASS: TestRefreshExpired (0.04s)'],
    ['', 'ok    daygo/auth   0.412s'],
    ['$ ', 'git commit -am "auth: single-flight refresh"'],
    ['', '[fix/token-refresh 8c41e2a] 2 files changed'],
    ['$ ', 'git push origin fix/token-refresh'],
    ['$ ', ''],
  ];
  let s = r(0, 0, W, H, '#0f0f13') + r(0, 0, W, 16, '#1b1b22') + lights() + t(W / 2, 11, 'zsh — 120×32', '#7b7986', 5.4, `${UI} text-anchor="middle"`);
  L.forEach(([p, c], i) => {
    const y = 32 + i * 15;
    const col = c.startsWith('--- PASS') || c.startsWith('ok') ? '#7fd88f' : '#d6d3cc';
    s += `<text x="10" y="${y}" font-size="6.4" ${MONO} xml:space="preserve"><tspan fill="${a}">${esc(p)}</tspan><tspan fill="${col}">${esc(c)}</tspan></text>`;
  });
  s += r(18, 32 + 9 * 15 - 6, 4, 7, '#d6d3cc', 0, 'opacity=".8"');
  return s;
}

/* ---------- browser / docs ---------- */
function browser(R, a) {
  let s = r(0, 0, W, H, '#f6f4ef') + r(0, 0, W, 22, '#e9e6df') + lights(false);
  s += r(70, 5, 180, 12, '#ffffff', 6) + t(160, 13, 'developer.example.com/websocket/keepalive', '#6d6a73', 5.2, `${UI} text-anchor="middle"`);
  s += r(0, 22, 74, H - 22, '#efece6');
  ['概览', '连接', '心跳与超时', '重连策略', '代理与网关', '错误码'].forEach((n, i) => {
    const on = i === 2;
    if (on) s += r(6, 30 + i * 14, 62, 11, 'rgba(0,0,0,.06)', 3);
    s += t(12, 38 + i * 14, n, on ? '#16161c' : '#6d6a73', 6, UI);
  });
  s += t(88, 44, '心跳与超时', '#16161c', 12, `${UI} font-weight="600"`);
  const p = [
    '代理和网关通常会在连接空闲一段时间后主动断开。',
    '如果心跳间隔大于网关的空闲超时，连接会被静默关闭，',
    '客户端只会在下一次发送时才发现。',
    '',
    '建议：心跳间隔 < 网关空闲超时的一半。',
  ];
  p.forEach((l, i) => { if (l) s += t(88, 62 + i * 11, l, i === 4 ? '#16161c' : '#55525c', 6.2, UI); });
  s += r(88, 124, 216, 46, '#16161c', 5);
  s += `<text x="96" y="138" font-size="5.8" ${MONO} xml:space="preserve"><tspan fill="#8a8896">gateway:</tspan></text>`;
  s += `<text x="96" y="149" font-size="5.8" ${MONO} xml:space="preserve"><tspan fill="#8a8896">  idle_timeout: </tspan><tspan fill="${a}">60s</tspan></text>`;
  s += `<text x="96" y="160" font-size="5.8" ${MONO} xml:space="preserve"><tspan fill="#8a8896">  ping_interval: </tspan><tspan fill="#ffcb8b">25s</tspan></text>`;
  s += r(88, 112, 3, 1, a);
  return s;
}

/* ---------- chat ---------- */
function chat(R, a) {
  let s = r(0, 0, W, H, '#1a1a21') + r(0, 0, 86, H, '#141419') + lights();
  ['# 前端', '# 设计', '# 站会', '# 支付重构', '林夏', 'Alex Chen'].forEach((n, i) => {
    const on = i === 2;
    if (on) s += r(6, 22 + i * 13, 74, 11, a, 3, 'opacity=".22"');
    s += t(12, 30 + i * 13, n, on ? '#f3efe7' : '#8a8896', 6.2, UI);
  });
  s += t(98, 14, '# 站会', '#f3efe7', 7, `${UI} font-weight="600"`) + r(86, 20, W - 86, 0.8, 'rgba(255,255,255,.08)');
  const M = [
    ['林夏', '#ffb547', '登录过期的问题今天能修完吗？', '10:02'],
    ['你', a, '已经定位到了，是并发刷新 token 的竞态 👀', '10:05'],
    ['Alex Chen', '#9b8cff', '支付回调那块下午评审，记得来', '10:11'],
    ['你', a, '好的，PR 我晚点更新', '10:12'],
  ];
  M.forEach(([n, c, m, tm], i) => {
    const y = 36 + i * 36;
    s += `<circle cx="104" cy="${y + 4}" r="7" fill="${c}" opacity=".85"/>`;
    s += t(116, y + 2, n, '#f3efe7', 6.2, `${UI} font-weight="600"`) + t(116 + n.length * 6.6 + 6, y + 2, tm, '#6b6b7a', 5, MONO);
    s += t(116, y + 13, m, '#c9c6bf', 6.4, UI);
  });
  s += r(96, H - 22, W - 106, 14, '#24242d', 7) + t(104, H - 13, '发消息到 # 站会', '#6b6b7a', 6, UI);
  return s;
}

/* ---------- document ---------- */
function doc(R, a) {
  let s = r(0, 0, W, H, '#ecebe7') + r(0, 0, W, 18, '#e2e0da') + lights(false) + t(W / 2, 12, '支付回调重试方案 — 已编辑', '#6d6a73', 5.4, `${UI} text-anchor="middle"`);
  s += r(56, 26, 208, H - 26, '#ffffff', 2, 'filter="drop-shadow(0 1px 1px rgba(0,0,0,.08))"');
  s += t(74, 50, '支付回调重试方案', '#16161c', 11, `${UI} font-weight="700"`);
  s += r(74, 58, 26, 8, a, 4, 'opacity=".25"') + t(78, 64, '草稿', '#16161c', 5, UI);
  const p = ['## 背景', '回调失败时由接口直接重试，导致重复入账。', '', '## 方案', '1. 回调先写入队列，接口只保证幂等', '2. 幂等键 = 订单号 + 回调序号', '3. 重试由队列负责，指数退避，最多 6 次'];
  p.forEach((l, i) => {
    if (!l) return;
    const h = l.startsWith('##');
    s += t(74, 82 + i * 12, h ? l.slice(3) : l, h ? '#16161c' : '#55525c', h ? 7 : 6.2, `${UI} ${h ? 'font-weight="600"' : ''}`);
  });
  s += r(72, 160, 3, 10, a) + t(80, 168, '待确认：网关超时配置', '#55525c', 6, UI);
  return s;
}

/* ---------- design tool ---------- */
function design(R, a) {
  let s = r(0, 0, W, H, '#1c1c22') + r(0, 0, W, 18, '#25252d') + lights() + t(W / 2, 12, '时间线 · 空状态', '#9b99a3', 5.4, `${UI} text-anchor="middle"`);
  s += r(0, 18, 58, H - 18, '#202027') + r(W - 62, 18, 62, H - 18, '#202027');
  ['Frame', '  插画', '  标题', '  说明', '  按钮'].forEach((n, i) => { if (i === 1) s += r(4, 24 + i * 11, 50, 10, a, 2, 'opacity=".25"'); s += t(8, 31 + i * 11, n, '#b9b6c0', 5.6, UI); });
  ['W 320', 'H 240', '填充', '#F6F1E8', '圆角 24'].forEach((n, i) => s += t(W - 54, 31 + i * 11, n, '#9b99a3', 5.4, MONO));
  s += r(74, 34, 172, 140, '#f6f1e8', 8);
  // the illustration: a sliced sun on a horizon (our own mark)
  s += `<clipPath id="dclip${Math.floor(R() * 1e6)}"><rect x="120" y="50" width="80" height="44"/></clipPath>`;
  s += `<circle cx="160" cy="94" r="26" fill="${a}"/>`;
  [70, 78, 85, 91].forEach((y, i) => (s += r(130, y + 3, 60, 1.6 + i * 0.6, '#f6f1e8')));
  s += r(126, 96, 68, 2.4, '#16161c', 1.2);
  s += t(160, 122, '今天还没有记录', '#16161c', 8.4, `${UI} font-weight="600" text-anchor="middle"`);
  s += t(160, 135, '开始工作后，时间线会自动出现', '#7b7880', 5.8, `${UI} text-anchor="middle"`);
  s += r(134, 146, 52, 14, '#16161c', 7) + t(160, 155, '开始记录', '#f6f1e8', 6, `${UI} text-anchor="middle"`);
  s += `<rect x="119.5" y="64.5" width="81" height="34" fill="none" stroke="#5fa8ff" stroke-width=".8"/>`;
  s += `<circle cx="252" cy="84" r="5" fill="#9b8cff"/>` + r(258, 79, 34, 10, '#9b8cff', 5) + t(262, 86, 'Mia 正在看', '#fff', 5, UI);
  return s;
}

/* ---------- video meeting ---------- */
function meeting(R, a) {
  let s = r(0, 0, W, H, '#121216') + lights() + t(W / 2, 12, '支付重构评审 · 34:12', '#9b99a3', 5.6, `${UI} text-anchor="middle"`);
  const P = [['你', a], ['林夏', '#ffb547'], ['Alex', '#9b8cff'], ['周舟', '#5fa8ff']];
  P.forEach(([n, c], i) => {
    const x = 10 + (i % 2) * 152, y = 20 + Math.floor(i / 2) * 76;
    s += r(x, y, 148, 72, '#1f1f27', 6) + `<circle cx="${x + 74}" cy="${y + 32}" r="15" fill="${c}" opacity=".85"/>`;
    s += t(x + 74, y + 37, n.slice(0, 1), '#16161c', 11, `${UI} font-weight="700" text-anchor="middle"`);
    s += r(x + 6, y + 58, n.length * 7 + 12, 10, 'rgba(0,0,0,.45)', 5) + t(x + 12, y + 65, n, '#f3efe7', 5.8, UI);
    if (i === 2) s += `<rect x="${x + 0.75}" y="${y + 0.75}" width="146.5" height="70.5" rx="6" fill="none" stroke="#7fd88f" stroke-width="1.5"/>`;
  });
  s += r(118, H - 26, 84, 18, '#24242d', 9) + `<circle cx="134" cy="${H - 17}" r="4" fill="#d6d3cc"/><circle cx="152" cy="${H - 17}" r="4" fill="#d6d3cc"/><circle cx="170" cy="${H - 17}" r="4" fill="#d6d3cc"/>` + r(180, H - 22, 18, 10, '#ff5f57', 5);
  return s;
}

function away() {
  return r(0, 0, W, H, '#0d0d12') + t(W / 2, 92, '12:31', '#f3efe7', 30, `${UI} font-weight="300" text-anchor="middle"`) + t(W / 2, 108, '10 月 2 日 星期五', '#8a8896', 7, `${UI} text-anchor="middle"`) + `<circle cx="${W / 2}" cy="150" r="9" fill="none" stroke="#5b5966"/>` + t(W / 2, 172, '已锁定 · 不记录', '#5b5966', 6, `${UI} text-anchor="middle"`);
}

const kinds = { code, terminal, browser, chat, doc, design, meeting, away };
export const KINDS = Object.keys(kinds).filter((k) => k !== 'away');

export function screen(kind = 'code', seed = 1, accent = '#ffb547') {
  const R = rng(seed * 9973 + kind.length * 31);
  const body = (kinds[kind] || code)(R, accent);
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
}
