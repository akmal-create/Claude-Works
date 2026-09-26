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
  const R = { m_front_home_dark: 0.4833, m_front_nudge_dark: 0.4833, m_front_nudge_light: 0.4833, annan_waving: 0.9929, annan_pointing: 0.9936, annan_proud: 0.8307 };
  const pic = (s, name, x, y, h, o = {}) => s.addImage({ path: IMG(name + ".png"), x, y, h, w: h * R[name], ...o });
  const label = (s, text, x, y, w, color = C.lime) => T(s, text, { x, y, w, h: 0.22, fontFace: F.label, bold: true, fontSize: TS.label, color, charSpacing: 2 });
  const bubble = (s, x, y, w, h, text, tail, tx = 0.4) => {
    s.addShape("roundRect", { x, y, w, h, fill: { color: C.white }, line: { type: "none" }, rectRadius: 0.2 });
    const t = 0.24;
    if (tail === "down") s.addShape("triangle", { x: x + tx, y: y + h - 0.01, w: t, h: t * 0.8, fill: { color: C.white }, line: { type: "none" }, rotate: 180 });
    if (tail === "left") s.addShape("triangle", { x: x - t * 0.8 + 0.01, y: y + h / 2 - t / 2, w: t, h: t * 0.8, fill: { color: C.white }, line: { type: "none" }, rotate: 270 });
    if (tail === "right") s.addShape("triangle", { x: x + w - 0.01, y: y + h / 2 - t / 2, w: t, h: t * 0.8, fill: { color: C.white }, line: { type: "none" }, rotate: 90 });
    T(s, text, { x: x + 0.25, y, w: w - 0.5, h, valign: "middle", fontSize: TS.small + 1, bold: true, color: C.ink, lineSpacingMultiple: 1.1 });
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
    label(s, "MYBODSTUDIO.COM", GM, BASE, 4, C.dim);
    pic(s, "m_front_home_dark", phX, phY, phH);
    const aH = 2.7, aW = aH * R.annan_waving, aX = phX - aW + 0.3, aY = phY + phH - aH;
    pic(s, "annan_waving", aX, aY, aH);
    bubble(s, aX + 0.4, aY - 1.05, 2.6, 0.78, "Come in. Let me show you around.", "down", 0.7);
    s.addNotes("Open light. Bod Annan greets the room; the phone shows the home screen.");
  }

  // ===== 3 PM =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const phH = 6.0, phW = phH * R.m_front_nudge_dark, dX = cx(8), phY = TOP + 0.05;
    const lH = 5.3, lW = lH * R.m_front_nudge_light, lX = W - GM - lW, lY = phY + phH - lH;
    s.addImage({ path: IMG("glow.png"), x: dX - 1.6, y: -0.6, w: 7.6, h: 7.6 });
    label(s, "3 PM", GM, TOP, 3);
    T(s, "The client's\ngone quiet.", { x: GM, y: TOP + 0.4, w: span(1, 6), h: 1.55, fontFace: F.display, bold: true, fontSize: TS.h1, lineSpacingMultiple: 1.0 });
    T(s, "After two days of waiting, Bod App drafts the follow-up. You just send it.", { x: GM, y: TOP + 2.1, w: span(1, 5), h: 0.85, fontSize: TS.body, color: C.muted, lineSpacingMultiple: 1.25 });
    const aH = 2.45, aY = BASE - 0.2 - aH;
    pic(s, "annan_pointing", GM - 0.15, aY, aH);
    bubble(s, GM + aH * R.annan_pointing + 0.2, aY + 0.35, 2.75, 0.85, "Two days, no reply. I've written it for you.", "left");
    pic(s, "m_front_nudge_light", lX, lY, lH);
    pic(s, "m_front_nudge_dark", dX, phY, phH);
    T(s, "DARK THEME", { x: dX, y: BASE, w: phW, h: 0.22, align: "center", fontFace: F.label, bold: true, fontSize: TS.label, color: C.dim, charSpacing: 2 });
    T(s, "LIGHT THEME", { x: dX + phW, y: BASE, w: lX + lW - dX - phW, h: 0.22, align: "center", fontFace: F.label, bold: true, fontSize: TS.label, color: C.dim, charSpacing: 2 });
    label(s, "BOD APP  ·  THE TASK APP FOR CREATIVE AGENCIES", GM, BASE, 5.5, C.dim);
    s.addNotes("This is the follow-up nudge. It appears once a task has waited on a client for two days.");
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
      ["LuBellRing", "Client nudged", "Quiet for two days? It follows up."],
      ["LuReceipt", "Billed", "Done work goes straight to billing."],
    ];
    const g = 0.35, cw = (W - 2 * GM - 4 * g) / 5, iy = 3.05, is = 0.95;
    s.addShape("line", { x: GM + is, y: iy + is / 2, w: W - 2 * GM - cw - is + is, h: 0, line: { color: C.line, width: 1.5 } });
    for (let i = 0; i < 5; i++) {
      const x = GM + i * (cw + g);
      s.addShape("ellipse", { x, y: iy, w: is, h: is, fill: { color: i === 4 ? C.lime : C.surface }, line: { color: i === 4 ? C.lime : C.line, width: 1 } });
      s.addImage({ data: await icon(st[i][0], i === 4 ? C.ink : C.lime, 2), x: x + is * 0.28, y: iy + is * 0.28, w: is * 0.44, h: is * 0.44 });
      label(s, "STEP " + (i + 1), x, iy + is + 0.35, cw, C.dim);
      T(s, st[i][1], { x, y: iy + is + 0.65, w: cw, h: 0.8, fontFace: F.display, bold: true, fontSize: TS.h2, lineSpacingMultiple: 1.0 });
      T(s, st[i][2], { x, y: iy + is + 1.55, w: cw, h: 0.7, fontSize: TS.small + 1, color: C.muted, lineSpacingMultiple: 1.25 });
    }
    const aH = 1.9, aW = aH * R.annan_proud, aX = W - GM - aW, aY = TOP - 0.05;
    pic(s, "annan_proud", aX, aY, aH);
    bubble(s, aX - 3.05, aY + 0.45, 2.75, 0.8, "Every job, same path. I watch every step.", "right");
    foot(s, 11);
    s.addNotes("Usually: briefs arrive on WhatsApp at 11 pm, nobody knows who owns what, status lives in people's heads, the client goes quiet for three days, and finished work sits unbilled. With Bod App each of those steps is handled.");
  }

  await pres.writeFile({ fileName: path.join(__dirname, "Bod-App-Sample-Slides.pptx") });
  console.log("written", n);
})();
