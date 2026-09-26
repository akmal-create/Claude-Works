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
  const R = { m_front_home_dark: 0.4833, m_front_nudge_dark: 0.4833, m_front_nudge_light: 0.4833, m_angR_focus_light: 0.4567, m_angL_tasks_dark: 0.4228 };
  const pic = (s, name, x, y, h, o = {}) => s.addImage({ path: IMG(name + ".png"), x, y, h, w: h * R[name], ...o });
  const label = (s, text, x, y, w, color = C.lime) => T(s, text, { x, y, w, h: 0.22, fontFace: F.label, bold: true, fontSize: TS.label, color, charSpacing: 2 });
  // Bod Annan: place a pose and return head/eye anchors (inches)
  const annan = (s, pose, x, y, h) => {
    const m = AM[pose], w = h * m.ar;
    s.addImage({ path: IMG("annan_" + pose + ".png"), x, y, w, h });
    return { x, y, w, h, top: y + m.top * h, cx: x + m.headCx * w, hl: x + m.headL * w, hr: x + m.headR * w, eye: y + m.eyeY * h };
  };
  // Speech bubble: size from measured text; fixed padding; tail always points at Annan's head.
  const PADX = 0.26, PADY = 0.18, LH = 0.255, TAIL = 0.2, GAP = 0.06;
  const bubble = (s, a, text, mode, f = 0.32) => {
    const mt = BM[text]; if (!mt) throw new Error("measure bubble: " + text);
    const w = mt.w + 2 * PADX + 0.08, h = mt.lines.length * LH + 2 * PADY;
    let x, y;
    if (mode === "above") { x = a.cx - f * w; y = a.top - TAIL - GAP - h; }
    if (mode === "left")  { x = a.hl - TAIL - GAP - w; y = a.eye - h / 2; }
    if (mode === "right") { x = a.hr + TAIL + GAP; y = a.eye - h / 2; }
    s.addShape("roundRect", { x, y, w, h, fill: { color: C.white }, line: { type: "none" }, rectRadius: 0.18 });
    const tw = 0.26;
    if (mode === "above") s.addShape("triangle", { x: a.cx - tw / 2, y: y + h - 0.01, w: tw, h: TAIL, fill: { color: C.white }, line: { type: "none" }, rotate: 180 });
    if (mode === "left")  s.addShape("triangle", { x: x + w - 0.01 - (tw - TAIL) / 2, y: a.eye - TAIL / 2 - (tw - TAIL) / 2, w: tw, h: TAIL, fill: { color: C.white }, line: { type: "none" }, rotate: 90 });
    if (mode === "right") s.addShape("triangle", { x: x - TAIL + 0.01 - (tw - TAIL) / 2, y: a.eye - TAIL / 2 - (tw - TAIL) / 2, w: tw, h: TAIL, fill: { color: C.white }, line: { type: "none" }, rotate: 270 });
    T(s, mt.lines.join("\n"), { x: x + PADX, y: y + PADY, w: w - 2 * PADX, h: h - 2 * PADY, valign: "middle", fontSize: 15, bold: true, color: C.ink, lineSpacing: 18.4 });
    return { x, y, w, h };
  };
  const foot = (s, num) => {
    label(s, "BOD APP  ·  THE TASK APP FOR CREATIVE AGENCIES", GM, BASE, 7, C.dim);
    T(s, String(num).padStart(2, "0"), { x: W - GM - 1, y: BASE, w: 1, h: 0.22, align: "right", fontFace: F.label, bold: true, fontSize: TS.label, color: C.dim });
  };

  // ===== COVER =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const phH = 6.1, phW = phH * R.m_front_home_dark, phX = W - GM - phW, phY = (H - phH) / 2;
    s.addImage({ path: IMG("glow.png"), x: phX - 2.2, y: phY - 1.2, w: phW + 4.4, h: phW + 4.4 });
    s.addImage({ data: tileLime, x: GM, y: TOP, w: 0.5, h: 0.5 });
    label(s, "A BOD STUDIO PRODUCT", GM + 0.7, TOP + 0.14, 4, C.muted);
    T(s, "Bod App", { x: GM, y: 2.35, w: span(1, 7), h: 1.4, fontFace: F.display, bold: true, fontSize: TS.hero, valign: "bottom" });
    T(s, "The task app for creative agencies.", { x: GM, y: 3.85, w: span(1, 7), h: 0.5, fontFace: F.display, bold: true, fontSize: 26, color: C.lime });
    T(s, "It handles the admin, so your team can do the work.", { x: GM, y: 4.45, w: span(1, 5), h: 0.8, fontSize: TS.body, color: C.muted, lineSpacingMultiple: 1.25 });
    label(s, "BODSTUDIO.COM", GM, BASE, 4, C.dim);
    pic(s, "m_front_home_dark", phX, phY, phH);
    const aH = 2.7, a = annan(s, "waving", phX - aH * AM.waving.ar + 0.3, phY + phH - aH, aH);
    bubble(s, a, "Come in. Let me show you around.", "above", 0.2);
    s.addNotes("Open light. Bod Annan greets the room; the phone shows the home screen.");
  }

  // ===== CLIENT GONE QUIET =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const phH = 6.0, phW = phH * R.m_front_nudge_dark, dX = cx(8), phY = TOP + 0.05;
    const lH = 5.3, lW = lH * R.m_front_nudge_light, lX = W - GM - lW, lY = phY + phH - lH;
    s.addImage({ path: IMG("glow.png"), x: dX - 1.6, y: -0.6, w: 7.6, h: 7.6 });
    label(s, "FOLLOW-UPS", GM, TOP, 3);
    T(s, "The client's\ngone quiet.", { x: GM, y: TOP + 0.4, w: span(1, 6), h: 1.55, fontFace: F.display, bold: true, fontSize: TS.h1, lineSpacingMultiple: 1.0 });
    T(s, "Bod App notices, and drafts the follow-up for you. You just send it.", { x: GM, y: TOP + 2.0, w: span(1, 5), h: 0.85, fontSize: TS.body, color: C.muted, lineSpacingMultiple: 1.25 });
    const aH = 1.9, a = annan(s, "pointing", GM - 0.1, BASE - 0.2 - aH, aH);
    bubble(s, a, "No reply yet? I've written the follow-up for you.", "above");
    pic(s, "m_front_nudge_light", lX, lY, lH);
    pic(s, "m_front_nudge_dark", dX, phY, phH);
    T(s, "DARK THEME", { x: dX, y: BASE, w: phW, h: 0.22, align: "center", fontFace: F.label, bold: true, fontSize: TS.label, color: C.dim, charSpacing: 2 });
    T(s, "LIGHT THEME", { x: dX + phW, y: BASE, w: lX + lW - dX - phW, h: 0.22, align: "center", fontFace: F.label, bold: true, fontSize: TS.label, color: C.dim, charSpacing: 2 });
    label(s, "BOD APP  ·  THE TASK APP FOR CREATIVE AGENCIES", GM, BASE, 5.5, C.dim);
    s.addNotes("The follow-up nudge appears when a task has been waiting on a client. Each team sets how long that is.");
  }

  // ===== HOW IT WORKS =====
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
    const g = 0.35, cw = (W - 2 * GM - 4 * g) / 5, iy = 3.05, is = 0.95;
    s.addShape("line", { x: GM + is, y: iy + is / 2, w: W - 2 * GM - cw, h: 0, line: { color: C.line, width: 1.5 } });
    for (let i = 0; i < 5; i++) {
      const x = GM + i * (cw + g);
      s.addShape("ellipse", { x, y: iy, w: is, h: is, fill: { color: i === 4 ? C.lime : C.surface }, line: { color: i === 4 ? C.lime : C.line, width: 1 } });
      s.addImage({ data: await icon(st[i][0], i === 4 ? C.ink : C.lime, 2), x: x + is * 0.28, y: iy + is * 0.28, w: is * 0.44, h: is * 0.44 });
      label(s, "STEP " + (i + 1), x, iy + is + 0.35, cw, C.dim);
      T(s, st[i][1], { x, y: iy + is + 0.65, w: cw, h: 0.8, fontFace: F.display, bold: true, fontSize: TS.h2, lineSpacingMultiple: 1.0 });
      T(s, st[i][2], { x, y: iy + is + 1.55, w: cw, h: 0.7, fontSize: TS.small + 1, color: C.muted, lineSpacingMultiple: 1.25 });
    }
    const aH = 1.95, a = annan(s, "proud", W - GM - aH * AM.proud.ar + 0.12, TOP - 0.1, aH);
    bubble(s, a, "Every job, same path. I watch every step.", "left");
    foot(s, 3);
    s.addNotes("Usually: briefs arrive on WhatsApp late at night, nobody knows who owns what, status lives in people's heads, the client goes quiet, and finished work sits unbilled. With Bod App each of those steps is handled.");
  }

  // ===== CTA =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const phH = 6.1, phW = phH * R.m_angR_focus_light, phX = W - GM - phW, phY = (H - phH) / 2;
    s.addImage({ path: IMG("glow.png"), x: phX - 2.4, y: phY - 1.3, w: phW + 4.8, h: phW + 4.8 });
    label(s, "LET'S TALK", GM, TOP, 4);
    T(s, "Come see\nhow it feels.", { x: GM, y: TOP + 0.4, w: span(1, 7), h: 1.55, fontFace: F.display, bold: true, fontSize: TS.h1, lineSpacingMultiple: 1.0 });
    T(s, "A 20-minute walkthrough on your own workflow.", { x: GM, y: TOP + 2.0, w: span(1, 6), h: 0.45, fontSize: TS.body, color: C.muted });
    T(s, "bodstudio.com", { x: GM, y: 3.75, w: span(1, 6), h: 0.65, fontFace: F.display, bold: true, fontSize: 36, color: C.lime });
    const rows = [["SALES", "+91 7356 333 965"], ["EMAIL", "info@storibodcreatives.com"], ["SOCIAL", "@bodstudio"]];
    for (let i = 0; i < rows.length; i++) {
      const y = 4.65 + i * 0.5;
      label(s, rows[i][0], GM, y + 0.06, 1.2, C.dim);
      T(s, rows[i][1], { x: GM + 1.3, y, w: span(1, 6) - 1.3, h: 0.34, valign: "middle", fontSize: TS.body, bold: true });
    }
    s.addImage({ data: tileLime, x: GM, y: BASE - 0.12, w: 0.4, h: 0.4 });
    label(s, "POWERED BY BOD STUDIO", GM + 0.55, BASE, 4, C.muted);
    pic(s, "m_angR_focus_light", phX, phY, phH);
    const aH = 2.5, a = annan(s, "waving", phX - aH * AM.waving.ar + 0.35, phY + phH - aH, aH);
    bubble(s, a, "Come by. I'll show you around.", "above", 0.25);
    s.addNotes("Close by offering the walkthrough, not the sale.");
  }

  await pres.writeFile({ fileName: path.join(__dirname, "Bod-App-Sample-Slides.pptx") });
  console.log("written", n);
})();
