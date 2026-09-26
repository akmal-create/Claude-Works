// Bod App — Sales Deck (Bod App brand: near-black ground, lime signal)
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const React = require("react");
const RDS = require("react-dom/server");
const Lu = require("react-icons/lu");
const path = require("path");

const C = {
  bg: "0B0D0C", surface: "15191A", surface2: "1C2123", line: "262C2E",
  lime: "B8E62E", ink: "0B0D0C", white: "F4F6F5", muted: "9AA7A2", dim: "6B7773",
  red: "FF5C7A", yellow: "FFC24B", green: "4ADE80", blue: "5B8CF0", navy: "233645",
};
const F = { display: "Epilogue", body: "Manrope", label: "Plus Jakarta Sans", serif: "Fraunces" };
const W = 13.333, H = 7.5, M = 0.6;
const IMG = (f) => path.join(__dirname, "s", "img", f);

const MONO = `<path d="M20 31a9 9 0 019-9h16a9 9 0 019 9v58a9 9 0 01-9 9H29a9 9 0 01-9-9V31zM31 33h13a1 1 0 011 1v18a1 1 0 01-1 1H31a1 1 0 01-1-1V34a1 1 0 011-1zM31 66h13a1 1 0 011 1v18a1 1 0 01-1 1H31a1 1 0 01-1-1V67a1 1 0 011-1z"/><path d="M79 23a18 18 0 100 36a18 18 0 000-36zM77 33h4v6h6v4h-6v6h-4v-6h-6v-4h6z"/><path d="M63 62h15a18 18 0 010 36H63a1 1 0 01-1-1V63a1 1 0 011-1zM73 72h4a8 8 0 010 16h-4a1 1 0 01-1-1V73a1 1 0 011-1z"/>`;
async function monoTile(tile, mark) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="480" height="480"><rect width="120" height="120" rx="28" fill="#${tile}"/><g fill="#${mark}" fill-rule="evenodd">${MONO}</g></svg>`;
  return "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
}
const iconCache = {};
async function icon(name, color, stroke = 1.75) {
  const k = name + color;
  if (iconCache[k]) return iconCache[k];
  let svg = RDS.renderToStaticMarkup(React.createElement(Lu[name], { color: "#" + color, size: 256, strokeWidth: stroke }));
  if (!svg.includes("xmlns")) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  const d = "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
  return (iconCache[k] = d);
}

// ---------- helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, fontFace: F.body, color: C.white, valign: "top", ...o });
function card(slide, x, y, w, h, fill = C.surface, line = C.line, r = 0.16) {
  slide.addShape("roundRect", { x, y, w, h, fill: { color: fill }, line: line ? { color: line, width: 0.75 } : { type: "none" }, rectRadius: r });
}
function pill(slide, x, y, w, h, text, o = {}) {
  slide.addShape("roundRect", { x, y, w, h, fill: { color: o.fill || C.surface2 }, line: o.line ? { color: o.line, width: 0.75 } : { type: "none" }, rectRadius: h / 2 });
  T(slide, text, { x, y, w, h, align: "center", valign: "middle", fontFace: o.font || F.label, bold: true, fontSize: o.size || 10, color: o.color || C.white, charSpacing: o.cs ?? 0.5 });
}
async function iconBadge(slide, name, x, y, s = 0.52, fill = C.surface2, color = C.lime) {
  slide.addShape("roundRect", { x, y, w: s, h: s, fill: { color: fill }, line: { type: "none" }, rectRadius: s * 0.28 });
  const p = s * 0.24;
  slide.addImage({ data: await icon(name, color), x: x + p, y: y + p, w: s - 2 * p, h: s - 2 * p });
}
function header(slide, eyebrow, title, sub, o = {}) {
  const w = o.w || W - 2 * M;
  T(slide, eyebrow, { x: M, y: 0.5, w: 8, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
  if (!o.noBrand) T(slide, "BOD APP  /  SALES DECK", { x: W - M - 4, y: 0.5, w: 4, h: 0.25, align: "right", fontFace: F.label, bold: true, fontSize: 9, color: C.dim, charSpacing: 2 });
  T(slide, title, { x: M, y: 0.88, w, h: o.th || 0.75, fontFace: F.display, bold: true, fontSize: o.ts || 34, color: C.white, valign: "top" });
  if (sub) T(slide, sub, { x: M, y: (o.subY || 1.68), w: o.sw || w, h: 0.6, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.15 });
}
function footer(slide, n, dark = true) {
  T(slide, "BOD APP  ·  RUN YOUR STUDIO THE CALM WAY", { x: M, y: H - 0.45, w: 6, h: 0.22, fontFace: F.label, bold: true, fontSize: 8, color: dark ? C.dim : "3A4A10", charSpacing: 2 });
  T(slide, String(n).padStart(2, "0"), { x: W - M - 1, y: H - 0.45, w: 1, h: 0.22, align: "right", fontFace: F.label, bold: true, fontSize: 9, color: dark ? C.dim : "3A4A10" });
}
const bg = (slide, c = C.bg) => (slide.background = { color: c });

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "Bod App — Sales Deck";
  pres.author = "Bod Studio · Storibod Creatives";
  pres.company = "Bod Studio";

  const tileBlack = await monoTile("0B0D0C", "B8E62E");
  const tileLime = await monoTile("B8E62E", "0B0D0C");
  let n = 0;

  // ---------- GRID (strict) ----------
  // 12 cols, 0.75" side margins, 0.25" gutters. Type scale: 88 / 44 / 22 / 18 / 14 / 10 label.
  const GM = 0.75, GUT = 0.25, COL = (W - 2 * GM - 11 * GUT) / 12;
  const cx = (c) => GM + (c - 1) * (COL + GUT);            // left edge of column c (1-based)
  const span = (a, b) => (b - a + 1) * COL + (b - a) * GUT; // width from col a to col b
  const TOP = 0.7, BASE = 6.95;                              // top margin, footer baseline row
  const TS = { hero: 88, h1: 44, h2: 22, body: 18, small: 14, label: 10 };
  const AM = JSON.parse(require("fs").readFileSync(path.join(__dirname, "s", "img", "annan_metrics.json"), "utf8"));
  const BM = JSON.parse(require("fs").readFileSync(path.join(__dirname, "bubble_metrics.json"), "utf8"));
  const ratio = (name) => name.startsWith("m_front_") ? 0.4833 : name.startsWith("m_angR_") ? 0.4567 : name.startsWith("m_angL_") ? 0.4228 : null;
  const R = new Proxy({}, { get: (_, k) => ratio(k) });
  const pic = (s, name, x, y, h, o = {}) => s.addImage({ path: IMG(name + ".png"), x, y, h, w: h * ratio(name), ...o });
  const label = (s, text, x, y, w, color = C.lime) => T(s, text, { x, y, w, h: 0.22, fontFace: F.label, bold: true, fontSize: TS.label, color, charSpacing: 2 });
  // Bod Annan: place a pose and return head/eye anchors (inches)
  const annan = (s, pose, x, y, h) => {
    const m = AM[pose], w = h * m.ar;
    s.addImage({ path: IMG("annan_" + pose + ".png"), x, y, w, h });
    return { x, y, w, h, top: y + m.top * h, cx: x + m.headCx * w, hl: x + m.headL * w, hr: x + m.headR * w, eye: y + m.eyeY * h };
  };
  // Speech bubble (style B): solid lime pill, one smooth outline with the tail, dark text.
  // Size comes from measured text; tail tip always lands on Bod Annan's head.
  const sharp = require("sharp");
  const PADX = 0.3, PADY = 0.19, LH = 0.255, DPI = 200;
  const bubble = async (s, a, text, mode, f = 0.3) => {
    const mt = BM[text]; if (!mt) throw new Error("measure bubble: " + text);
    const w = mt.w + 2 * PADX + 0.06, h = mt.lines.length * LH + 2 * PADY, r = h / 2;
    let x, y, tailX, tip;
    if (mode === "above") { x = a.cx - f * w; y = a.top - 0.3 - h; tailX = a.cx - 0.06; tip = [a.cx + 0.02, a.top - 0.04]; }
    if (mode === "left")  { x = a.hl + 0.25 - w; y = a.top - 0.3 - h; tailX = x + w - r * 0.9; tip = [a.hl + 0.32, a.top - 0.04]; }
    // canvas covering bubble + tail
    const bx0 = Math.min(x, tip[0]) - 0.05, by0 = y - 0.05, bx1 = Math.max(x + w, tip[0]) + 0.05, by1 = Math.max(y + h, tip[1]) + 0.05;
    const P = (v) => (v * DPI).toFixed(1);
    const X = (v) => P(v - bx0), Y = (v) => P(v - by0);
    const b = y + h, hw = 0.13, t0 = tailX - hw, t1 = tailX + hw;
    const c1 = [t1 * 0.55 + tip[0] * 0.45, b + (tip[1] - b) * 0.4], c2 = [t0 * 0.45 + tip[0] * 0.55 - 0.03, b + (tip[1] - b) * 0.5];
    const d = `M${X(x + r)},${Y(y)} H${X(x + w - r)} A${P(r)},${P(r)} 0 0 1 ${X(x + w - r)},${Y(b)} H${X(t1)} Q${X(c1[0])},${Y(c1[1])} ${X(tip[0])},${Y(tip[1])} Q${X(c2[0])},${Y(c2[1])} ${X(t0)},${Y(b)} H${X(x + r)} A${P(r)},${P(r)} 0 0 1 ${X(x + r)},${Y(y)} Z`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${P(bx1 - bx0)}" height="${P(by1 - by0)}"><path d="${d}" fill="#B8E62E" stroke="#B8E62E" stroke-width="1" stroke-linejoin="round"/></svg>`;
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    s.addImage({ data: "image/png;base64," + buf.toString("base64"), x: bx0, y: by0, w: bx1 - bx0, h: by1 - by0 });
    T(s, mt.lines.join("\n"), { x: x + PADX, y: y + PADY, w: w - 2 * PADX + 0.02, h: h - 2 * PADY, valign: "middle", fontSize: 15, bold: true, color: C.ink, lineSpacing: 18.4 });
    return { x, y, w, h };
  };
  const foot = (s, num) => {
    label(s, "BOD APP  ·  THE TASK APP FOR CREATIVE AGENCIES", GM, BASE, 7, C.dim);
    T(s, String(num).padStart(2, "0"), { x: W - GM - 1, y: BASE, w: 1, h: 0.22, align: "right", fontFace: F.label, bold: true, fontSize: TS.label, color: C.dim });
  };

  const glow = (s, x, y, d) => s.addImage({ path: IMG("glow.png"), x, y, w: d, h: d });
  const pageNo = (s) => foot(s, n);
  // Story slide: text left, Annan bottom-left with bubble, dark phone + light phone right.
  const story = async ({ tag, title, body, pose, line, dark, light, notes }) => {
    const s = pres.addSlide(); n++; bg(s);
    const phH = 6.0, phW = phH * 0.4833, dX = cx(8), phY = TOP + 0.05;
    const lH = 5.3, lW = lH * 0.4833, lX = W - GM - lW, lY = phY + phH - lH;
    glow(s, dX - 1.6, -0.6, 7.6);
    label(s, tag, GM, TOP, 5);
    T(s, title, { x: GM, y: TOP + 0.4, w: span(1, 6), h: 1.55, fontFace: F.display, bold: true, fontSize: TS.h1, lineSpacingMultiple: 1.0 });
    T(s, body, { x: GM, y: TOP + 2.0, w: span(1, 5), h: 1.0, fontSize: TS.body, color: C.muted, lineSpacingMultiple: 1.25 });
    const aH = 1.8, a = annan(s, pose, GM - 0.1, BASE - 0.2 - aH, aH);
    await bubble(s, a, line, "above", 0.3);
    if (light) pic(s, light, lX, lY, lH);
    pic(s, dark, dX, phY, phH);
    T(s, "DARK THEME", { x: dX, y: BASE, w: phW, h: 0.22, align: "center", fontFace: F.label, bold: true, fontSize: TS.label, color: C.dim, charSpacing: 2 });
    if (light) T(s, "LIGHT THEME", { x: dX + phW, y: BASE, w: lX + lW - dX - phW, h: 0.22, align: "center", fontFace: F.label, bold: true, fontSize: TS.label, color: C.dim, charSpacing: 2 });
    label(s, "BOD APP  ·  THE TASK APP FOR CREATIVE AGENCIES", GM, BASE, 5.5, C.dim);
    s.addNotes(notes);
    return s;
  };
  // Word slide: big type left, Annan right with bubble.
  const wordSlide = async ({ title, pose, line, notes, body }) => {
    const s = pres.addSlide(); n++; bg(s);
    const aH = 3.4, aW = aH * AM[pose].ar, a = annan(s, pose, W - GM - aW, BASE - 0.25 - aH, aH);
    await bubble(s, a, line, "above", 0.3);
    body(s);
    T(s, title, { x: GM, y: title.includes("\n") ? 1.6 : 2.0, w: span(1, 8), h: title.includes("\n") ? 1.9 : 1.0, fontFace: F.display, bold: true, fontSize: 56, lineSpacingMultiple: 1.0 });
    pageNo(s); s.addNotes(notes);
  };

  // ===== 1. COVER =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const phH = 6.1, phW = phH * 0.4833, phX = W - GM - phW, phY = (H - phH) / 2;
    glow(s, phX - 2.2, phY - 1.2, phW + 4.4);
    s.addImage({ data: tileLime, x: GM, y: TOP, w: 0.5, h: 0.5 });
    label(s, "A BOD STUDIO PRODUCT", GM + 0.7, TOP + 0.14, 4, C.muted);
    T(s, "Bod App", { x: GM, y: 2.35, w: span(1, 7), h: 1.4, fontFace: F.display, bold: true, fontSize: TS.hero, valign: "bottom" });
    T(s, "The task app for creative agencies.", { x: GM, y: 3.85, w: span(1, 7), h: 0.5, fontFace: F.display, bold: true, fontSize: 26, color: C.lime });
    T(s, "It handles the admin, so your team can do the work.", { x: GM, y: 4.45, w: span(1, 5), h: 0.8, fontSize: TS.body, color: C.muted, lineSpacingMultiple: 1.25 });
    label(s, "BODSTUDIO.COM", GM, BASE, 4, C.dim);
    pic(s, "m_front_home_dark", phX, phY, phH);
    const aH = 2.7, a = annan(s, "waving", phX - aH * AM.waving.ar + 0.3, phY + phH - aH, aH);
    await bubble(s, a, "Come in. Let me show you around.", "above", 0.22);
    s.addNotes("Open light. This is a studio sharing the tool it built for itself. Bod Annan will guide the story.");
  }

  // ===== 2. WE LOVE THE WORK =====
  await wordSlide({ title: "We all love\nthe work.", pose: "proud", line: "This part? You're good at this.",
    body: (s) => T(s, "The ideas, the shoots, the late edits that finally click.", { x: GM, y: 3.65, w: span(1, 6), h: 0.8, fontSize: 20, color: C.muted, lineSpacingMultiple: 1.25 }),
    notes: "Pause here. Most studio owners will nod. This is why they started." });

  // ===== 3. THE REST OF IT =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const aH = 3.4, aW = aH * AM.listening.ar, a = annan(s, "listening", W - GM - aW, BASE - 0.25 - aH, aH);
    await bubble(s, a, "And this part… I know.", "above", 0.3);
    T(s, "It's the rest of it.", { x: GM, y: TOP + 0.4, w: span(1, 8), h: 1.0, fontFace: F.display, bold: true, fontSize: 56 });
    const chores = ["Updating the status, again.", "Chasing a reply from the client.", "“Where's that file?”", "The morning standup.", "Working out what to bill."];
    const shades = [C.white, "C9D0CD", "A3ACA8", "7F8A86", "5E6864"];
    for (let i = 0; i < chores.length; i++) T(s, chores[i], { x: GM, y: 2.45 + i * 0.72, w: span(1, 8), h: 0.55, fontSize: 26, bold: i === 0, color: shades[i] });
    pageNo(s); s.addNotes("Read these slowly. Every studio lives with them. None of it is the work clients pay for.");
  }

  // ===== 4. SO WE BUILT BOD APP =====
  {
    const s = pres.addSlide(); n++; bg(s);
    glow(s, 7.6, -0.8, 7.2);
    label(s, "MEET BOD APP", GM, TOP, 4);
    T(s, "So we built\nBod App.", { x: GM, y: TOP + 0.4, w: span(1, 7), h: 1.55, fontFace: F.display, bold: true, fontSize: TS.h1, lineSpacingMultiple: 1.0 });
    T(s, "A task app that takes care of the rest. Made for our own studio first.", { x: GM, y: TOP + 2.0, w: span(1, 5), h: 0.9, fontSize: TS.body, color: C.muted, lineSpacingMultiple: 1.25 });
    const aH = 1.8, a = annan(s, "waving", GM - 0.1, BASE - 0.2 - aH, aH);
    await bubble(s, a, "I'm Bod Annan. Leave the rest to me.", "above", 0.3);
    pic(s, "m_angL_tasks_dark", cx(8) - 0.1, TOP + 0.1, 6.0);
    pic(s, "m_angR_focus_light", W - GM - 6.0 * 0.4567 + 0.05, TOP + 0.35, 5.6);
    pageNo(s); s.addNotes("Bod App ran the Storibod floor before anyone else saw it. Introduce Bod Annan lightly; he guides the rest of the story.");
  }

  // ===== 5-9. STORY =====
  await story({ tag: "FOCUS QUEUE", title: "Your day,\nalready sorted.", body: "Overdue first, then what's due. Anything stuck waits at the bottom.", pose: "pointing", line: "Start with the reel. It's due today.", dark: "m_front_focus_dark", light: "m_front_focus_light", notes: "Nobody has to plan the day or scroll a board. Open the app and the order is decided." });
  await story({ tag: "AI CAPTURE", title: "Just say what\nneeds doing.", body: "Say it or type it. It becomes a task, with who, what and when filled in.", pose: "listening", line: "Heard you. It's on Priya's list.", dark: "m_front_ai_dark", light: "m_front_ai_light", notes: "Works by voice or text, in English, Malayalam or Manglish. New tasks go to the project manager to approve." });
  await story({ tag: "FOLLOW-UPS", title: "The client's\ngone quiet.", body: "Bod App notices, and drafts the follow-up for you. You just send it.", pose: "pointing", line: "No reply yet? I've written the follow-up for you.", dark: "m_front_nudge_dark", light: "m_front_nudge_light", notes: "The nudge appears when a task has been waiting on a client. Each team sets how long that is." });
  await story({ tag: "STANDUP", title: "The standup\nwrites itself.", body: "What got done, what's moving and what's stuck. Read it, send it, go home.", pose: "chai", line: "Go home. I've got it from here.", dark: "m_front_standup_dark", light: "m_front_standup_light", notes: "The daily standup is drafted from what actually moved. Teams choose when it arrives." });
  await story({ tag: "WEEKLY WINS", title: "The week starts\nwith a win.", body: "Every week opens with what your team shipped, so good work gets noticed.", pose: "celebrating", line: "Four deliverables. Proud of you lot.", dark: "m_front_home_dark", light: "m_front_home_light", notes: "This is the moment people smile at. Small, honest recognition every week." });

  // ===== 10. LIGHTER =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const aH = 3.1, aW = aH * AM.chai.ar, a = annan(s, "chai", W - GM - aW, BASE - 0.25 - aH, aH);
    await bubble(s, a, "See? Less chasing. More making.", "above", 0.3);
    T(s, "The week\nfeels lighter.", { x: GM, y: TOP + 0.4, w: span(1, 8), h: 1.9, fontFace: F.display, bold: true, fontSize: 56, lineSpacingMultiple: 1.0 });
    const colW = span(1, 4);
    label(s, "LESS OF", GM, 3.45, colW, C.dim);
    label(s, "MORE OF", cx(5), 3.45, colW, C.lime);
    const less = ["“Any update?”", "“Just following up.”", "“Who's on this?”"], more = ["The work itself.", "Clear heads.", "Leaving on time."];
    for (let i = 0; i < 3; i++) {
      T(s, less[i], { x: GM, y: 3.85 + i * 0.62, w: colW, h: 0.5, fontSize: 24, color: "6B7773" });
      T(s, more[i], { x: cx(5), y: 3.85 + i * 0.62, w: colW, h: 0.5, fontSize: 24, bold: true });
    }
    pageNo(s); s.addNotes("That's the story. From here, show how it works and what's in the app.");
  }

  // ===== 11. HOW IT WORKS =====
  {
    const s = pres.addSlide(); n++; bg(s);
    label(s, "HOW IT WORKS", GM, TOP, 4);
    T(s, "From brief to invoice.", { x: GM, y: TOP + 0.4, w: span(1, 8), h: 0.8, fontFace: F.display, bold: true, fontSize: TS.h1 });
    T(s, "Every job takes the same five steps.", { x: GM, y: TOP + 1.25, w: span(1, 8), h: 0.45, fontSize: TS.body, color: C.muted });
    const st = [
      ["LuMic", "Brief comes in", "Say it, type it or drop the PDF."],
      ["LuUserCheck", "Gets assigned", "The PM approves it once."],
      ["LuEye", "Work happens", "Everyone can see where it's at."],
      ["LuBellRing", "Client nudged", "Gone quiet? It drafts the follow-up."],
      ["LuReceipt", "Billed", "Done work goes straight to billing."],
    ];
    const g = 0.35, cw = (W - 2 * GM - 4 * g) / 5, iy = 3.4, is = 0.95;
    s.addShape("line", { x: GM + is, y: iy + is / 2, w: W - 2 * GM - cw, h: 0, line: { color: C.line, width: 1.5 } });
    for (let i = 0; i < 5; i++) {
      const x = GM + i * (cw + g);
      s.addShape("ellipse", { x, y: iy, w: is, h: is, fill: { color: i === 4 ? C.lime : C.surface }, line: { color: i === 4 ? C.lime : C.line, width: 1 } });
      s.addImage({ data: await icon(st[i][0], i === 4 ? C.ink : C.lime, 2), x: x + is * 0.28, y: iy + is * 0.28, w: is * 0.44, h: is * 0.44 });
      label(s, "STEP " + (i + 1), x, iy + is + 0.35, cw, C.dim);
      T(s, st[i][1], { x, y: iy + is + 0.65, w: cw, h: 0.8, fontFace: F.display, bold: true, fontSize: TS.h2, lineSpacingMultiple: 1.0 });
      T(s, st[i][2], { x, y: iy + is + 1.55, w: cw, h: 0.7, fontSize: TS.small + 1, color: C.muted, lineSpacingMultiple: 1.25 });
    }
    const aH = 1.5, a = annan(s, "proud", W - GM - aH * AM.proud.ar + 0.1, 1.72, aH);
    await bubble(s, a, "Every job, same path. I watch every step.", "left");
    pageNo(s);
    s.addNotes("Usually: briefs arrive on WhatsApp late at night, nobody knows who owns what, status lives in people's heads, the client goes quiet, and finished work sits unbilled. With Bod App each of those steps is handled.");
  }

  // ===== 12. EVERYTHING =====
  {
    const s = pres.addSlide(); n++; bg(s);
    label(s, "WHAT'S INSIDE", GM, TOP, 4);
    T(s, "Everything in Bod App.", { x: GM, y: TOP + 0.4, w: span(1, 8), h: 0.8, fontFace: F.display, bold: true, fontSize: TS.h1 });
    const f = [["LuListTodo", "Tasks and boards"], ["LuTarget", "Focus Queue"], ["LuMic", "Voice to task"], ["LuFileText", "Notes and PDFs to tasks"], ["LuInbox", "Approvals"],
      ["LuSmile", "Task vibes"], ["LuPalette", "Client colours"], ["LuBellRing", "Follow-up nudges"], ["LuMessageCircle", "Team and task chat"], ["LuSunrise", "Daily AI summary"],
      ["LuSparkles", "“What's next?”"], ["LuClock", "Auto standup"], ["LuZap", "Weekly wins"], ["LuChartColumn", "Analytics"], ["LuReceipt", "Ready to bill"],
      ["LuUsers", "Leave and HR"], ["LuSheet", "Google Sheets sync"], ["LuCrown", "Roles and permissions"], ["LuSmartphone", "Widgets and alerts"], ["LuGlobe", "iOS, Android and web"]];
    const g = 0.18, cw = (span(1, 9) - 3 * g) / 4, ch = 0.74, y0 = 2.2;
    for (let i = 0; i < 20; i++) {
      const x = GM + (i % 4) * (cw + g), y = y0 + Math.floor(i / 4) * (ch + 0.14);
      card(s, x, y, cw, ch, C.surface, C.line, 0.14);
      s.addImage({ data: await icon(f[i][0], C.lime), x: x + 0.22, y: y + (ch - 0.3) / 2, w: 0.3, h: 0.3 });
      T(s, f[i][1], { x: x + 0.62, y, w: cw - 0.72, h: ch, valign: "middle", fontSize: 13, bold: true, lineSpacingMultiple: 1.05 });
    }
    const aH = 2.5, a = annan(s, "proud", W - GM - aH * AM.proud.ar + 0.1, BASE - 0.25 - aH, aH);
    await bubble(s, a, "All of this. Quietly, in the background.", "above", 0.55);
    pageNo(s); s.addNotes("Everything here is in the app today.");
  }

  // ===== 13. YOUR LOOK =====
  {
    const s = pres.addSlide(); n++; bg(s);
    glow(s, 7.0, -0.8, 7.6);
    label(s, "MADE FOR YOUR STUDIO", GM, TOP, 5);
    T(s, "Your look,\nyour way.", { x: GM, y: TOP + 0.4, w: span(1, 6), h: 1.55, fontFace: F.display, bold: true, fontSize: TS.h1, lineSpacingMultiple: 1.0 });
    T(s, "Light or dark, in your colours and logo, with your pipeline, categories and roles. We can set it all up for you.", { x: GM, y: TOP + 2.0, w: span(1, 5), h: 1.3, fontSize: TS.body, color: C.muted, lineSpacingMultiple: 1.25 });
    const aH = 1.9, a = annan(s, "proud", GM - 0.1, BASE - 0.2 - aH, aH);
    await bubble(s, a, "Your colours suit me.", "above", 0.3);
    const x0 = cx(7) + 0.1, x1 = W - GM, gp = 0.22, w3 = (x1 - x0 - 2 * gp) / 3, h3 = w3 / 0.4833, y3 = (BASE - 0.35 - h3) / 2 + 0.35;
    const ph = [["m_front_home_dark", "BOD APP DARK"], ["m_front_home_light", "BOD APP LIGHT"], ["m_front_home_custom", "YOUR BRAND"]];
    ph.forEach(([img, t], i) => {
      const x = x0 + i * (w3 + gp);
      pic(s, img, x, y3, h3);
      T(s, t, { x, y: y3 + h3 + 0.2, w: w3, h: 0.22, align: "center", fontFace: F.label, bold: true, fontSize: TS.label, color: i === 2 ? C.lime : C.dim, charSpacing: 2 });
    });
    label(s, "BOD APP  ·  THE TASK APP FOR CREATIVE AGENCIES", GM, BASE, 5.5, C.dim);
    s.addNotes("Every studio gets its own look: theme, accent colour, logo, pipeline stages, categories and roles. We set it up with you.");
  }

  // ===== 14. OFFER =====
  {
    const s = pres.addSlide(); n++; bg(s);
    label(s, "GET STARTED", GM, TOP, 4);
    T(s, "Start with a month free.", { x: GM, y: TOP + 0.4, w: span(1, 9), h: 0.8, fontFace: F.display, bold: true, fontSize: TS.h1 });
    T(s, "Up to 3 people, basic setup, on us. Then pick the plan that fits.", { x: GM, y: TOP + 1.25, w: span(1, 8), h: 0.45, fontSize: TS.body, color: C.muted });
    const aH = 1.5, a = annan(s, "celebrating", W - GM - aH * AM.celebrating.ar + 0.05, 1.9, aH);
    await bubble(s, a, "Bring the team. First month's on us.", "left");
    const p = [["Basic", "₹199", "The essentials for a small team."], ["Advanced", "₹299", "Everything we use at Storibod."], ["Premium", "₹499", "Set up around your own workflow."]];
    const g = 0.25, cw = (W - 2 * GM - 2 * g) / 3, y = 3.55, ch = 2.55;
    for (let i = 0; i < 3; i++) {
      const x = GM + i * (cw + g), hi = i === 1;
      card(s, x, y, cw, ch, hi ? C.lime : C.surface, hi ? null : C.line, 0.2);
      label(s, p[i][0].toUpperCase(), x + 0.4, y + 0.38, cw - 0.8, hi ? C.ink : C.lime);
      T(s, p[i][1], { x: x + 0.4, y: y + 0.72, w: cw - 0.8, h: 0.85, fontFace: F.display, bold: true, fontSize: 48, color: hi ? C.ink : C.white });
      T(s, "per person, per month", { x: x + 0.4, y: y + 1.55, w: cw - 0.8, h: 0.3, fontSize: 13, color: hi ? "3A4A10" : C.muted });
      T(s, p[i][2], { x: x + 0.4, y: y + 1.95, w: cw - 0.8, h: 0.35, fontSize: 15, bold: true, color: hi ? C.ink : C.white });
    }
    pageNo(s); s.addNotes("Lead with the free month. Advanced is the setup Storibod runs on. Premium is configured around their workflow.");
  }

  // ===== 15. CTA =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const phH = 6.1, phW = phH * 0.4567, phX = W - GM - phW, phY = (H - phH) / 2;
    glow(s, phX - 2.4, phY - 1.3, phW + 4.8);
    label(s, "LET'S TALK", GM, TOP, 4);
    T(s, "Come see\nhow it feels.", { x: GM, y: TOP + 0.4, w: span(1, 7), h: 1.55, fontFace: F.display, bold: true, fontSize: TS.h1, lineSpacingMultiple: 1.0 });
    T(s, "A 20-minute walkthrough on your own workflow.", { x: GM, y: TOP + 2.0, w: span(1, 6), h: 0.45, fontSize: TS.body, color: C.muted });
    T(s, "bodstudio.com", { x: GM, y: 3.75, w: span(1, 6), h: 0.65, fontFace: F.display, bold: true, fontSize: 36, color: C.lime });
    const rows = [["SALES", "+91 7356 333 965"], ["EMAIL", "info@storibodcreatives.com"], ["INSTAGRAM", "@storibodstudio"]];
    for (let i = 0; i < rows.length; i++) {
      const y = 4.65 + i * 0.5;
      label(s, rows[i][0], GM, y + 0.06, 1.4, C.dim);
      T(s, rows[i][1], { x: GM + 1.5, y, w: span(1, 6) - 1.5, h: 0.34, valign: "middle", fontSize: TS.body, bold: true });
    }
    s.addImage({ data: tileLime, x: GM, y: BASE - 0.12, w: 0.4, h: 0.4 });
    label(s, "POWERED BY BOD STUDIO", GM + 0.55, BASE, 4, C.muted);
    pic(s, "m_angR_focus_light", phX, phY, phH);
    const aH = 2.5, a = annan(s, "waving", phX - aH * AM.waving.ar + 0.35, phY + phH - aH, aH);
    await bubble(s, a, "Come by. I'll show you around.", "above", 0.25);
    s.addNotes("Close by offering the walkthrough, not the sale.");
  }

  await pres.writeFile({ fileName: path.join(__dirname, "Bod-App-Pitch-Deck.pptx") });
  console.log("written", n);
})();
