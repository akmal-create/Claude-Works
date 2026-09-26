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

  const R = { home_dark: 0.4763, nudge_dark: 0.4719, nudge_light: 0.4719, standup_dark: 0.4719, annan_waving: 0.9929, annan_pointing: 0.9936, annan_proud: 0.8307, annan_listening: 0.9086, annan_chai: 0.92, annan_celebrating: 1.0143 };
  const pic = (s, name, x, y, h, o = {}) => s.addImage({ path: IMG(name + ".png"), x, y, h, w: h * R[name], ...o });
  const bubble = (s, x, y, w, h, text, tail = "down", o = {}) => {
    s.addShape("roundRect", { x, y, w, h, fill: { color: C.white }, line: { type: "none" }, rectRadius: 0.22, shadow: { type: "outer", color: "000000", opacity: 0.35, blur: 10, offset: 3, angle: 90 } });
    const t = 0.26;
    if (tail === "down") s.addShape("triangle", { x: x + 0.45, y: y + h - 0.02, w: t, h: t, fill: { color: C.white }, line: { type: "none" }, rotate: 180 });
    if (tail === "left") s.addShape("triangle", { x: x - t + 0.04, y: y + h / 2 - t / 2, w: t, h: t, fill: { color: C.white }, line: { type: "none" }, rotate: 270 });
    if (tail === "right") s.addShape("triangle", { x: x + w - 0.04, y: y + h / 2 - t / 2, w: t, h: t, fill: { color: C.white }, line: { type: "none" }, rotate: 90 });
    T(s, text, { x: x + 0.25, y, w: w - 0.5, h, valign: "middle", fontSize: o.size || 15, bold: true, color: C.ink, lineSpacingMultiple: 1.1 });
  };
  const foot = (s) => T(s, "BOD APP  ·  THE TASK APP FOR CREATIVE AGENCIES", { x: M, y: H - 0.45, w: 7, h: 0.22, fontFace: F.label, bold: true, fontSize: 8, color: C.dim, charSpacing: 2 });

  // ===== COVER =====
  {
    const s = pres.addSlide(); n++; bg(s);
    s.addImage({ path: IMG("glow.png"), x: 6.6, y: -1.2, w: 8.4, h: 8.4 });
    s.addImage({ data: tileLime, x: M, y: 0.55, w: 0.56, h: 0.56 });
    T(s, "A BOD STUDIO PRODUCT", { x: M + 0.72, y: 0.72, w: 4, h: 0.24, fontFace: F.label, bold: true, fontSize: 9, color: C.muted, charSpacing: 2 });
    T(s, "Bod App", { x: M, y: 1.85, w: 7, h: 1.5, fontFace: F.display, bold: true, fontSize: 92 });
    T(s, "The task app for creative agencies.", { x: M, y: 3.4, w: 7, h: 0.6, fontFace: F.serif, italic: true, bold: true, fontSize: 28, color: C.lime });
    T(s, "It handles the admin, so your team can do the work.", { x: M, y: 4.1, w: 5.6, h: 0.8, fontSize: 18, color: C.muted, lineSpacingMultiple: 1.2 });
    T(s, "mybodstudio.com", { x: M, y: H - 0.5, w: 4, h: 0.25, fontFace: F.label, bold: true, fontSize: 9, color: C.dim, charSpacing: 1 });
    pic(s, "home_dark", 9.35, 0.5, 6.5, { rotate: 5 });
    pic(s, "annan_waving", 7.0, 3.95, 3.2);
    bubble(s, 7.25, 2.85, 2.75, 0.85, "Come in. Let me show you around.", "down");
    s.addNotes("Open light. Bod Annan greets the room; the phone shows the real home screen.");
  }

  // ===== 3 PM =====
  {
    const s = pres.addSlide(); n++; bg(s);
    s.addImage({ path: IMG("glow.png"), x: 6.8, y: -0.9, w: 7.8, h: 7.8 });
    T(s, "3 pm", { x: M, y: 0.95, w: 3, h: 0.6, fontFace: F.serif, italic: true, bold: true, fontSize: 34, color: C.lime });
    T(s, "The client's\ngone quiet.", { x: M, y: 1.6, w: 6.6, h: 1.6, fontFace: F.display, bold: true, fontSize: 44 });
    T(s, "After two days of waiting, Bod App drafts the follow-up. You just send it.", { x: M, y: 3.3, w: 5.8, h: 0.8, fontSize: 18, color: C.muted, lineSpacingMultiple: 1.25 });
    pic(s, "annan_pointing", 0.55, 4.45, 2.6);
    bubble(s, 3.45, 4.7, 3.3, 0.9, "Two days, no reply. I've written it for you.", "left");
    pic(s, "nudge_light", 10.25, 1.0, 5.7, { rotate: 7 });
    pic(s, "nudge_dark", 7.55, 0.5, 6.45);
    T(s, "Dark theme", { x: 7.55, y: 7.0, w: 3.05, h: 0.22, align: "center", fontFace: F.label, bold: true, fontSize: 8, color: C.dim, charSpacing: 2 });
    T(s, "Light theme", { x: 10.55, y: 7.0, w: 2.6, h: 0.22, align: "center", fontFace: F.label, bold: true, fontSize: 8, color: C.dim, charSpacing: 2 });
    s.addNotes("This is the follow-up nudge. It appears once a task has waited on a client for two days.");
  }

  // ===== HOW IT WORKS =====
  {
    const s = pres.addSlide(); n++; bg(s);
    T(s, "HOW IT WORKS", { x: M, y: 0.55, w: 4, h: 0.24, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
    T(s, "From brief to invoice.", { x: M, y: 0.9, w: 7, h: 0.8, fontFace: F.display, bold: true, fontSize: 40 });
    T(s, "Every job, every time.", { x: M, y: 1.7, w: 7, h: 0.45, fontSize: 18, color: C.muted });
    pic(s, "annan_proud", 11.25, 0.3, 1.95);
    bubble(s, 7.85, 0.75, 3.15, 0.85, "Every job, same path. I watch every step.", "right", { size: 13.5 });
    const st = [
      ["A brief comes in", "It arrives on WhatsApp at 11 pm.", "Say it, type it or drop the PDF. It becomes a task."],
      ["Someone picks it up", "“Who's doing this?”", "The PM approves it, and it goes to the right person."],
      ["The work happens", "Status lives in people's heads.", "Everyone can see where each job is, and how it's going."],
      ["The client goes quiet", "You remember three days later.", "Bod App drafts the follow-up after two."],
      ["The job is done", "It sits there, unbilled.", "It moves to a Ready to bill list, automatically."],
      ["It gets invoiced", "Someone digs through chats at month end.", "Finance sees the list, bills it, closes it."],
    ];
    const gap = 0.16, cw = (W - 2 * M - 5 * gap) / 6, ty = 2.75;
    s.addShape("line", { x: M + cw / 2, y: ty, w: W - 2 * M - cw, h: 0, line: { color: C.lime, width: 1.75, dashType: "dash" } });
    for (let i = 0; i < 6; i++) {
      const x = M + i * (cw + gap);
      s.addShape("ellipse", { x: x + cw / 2 - 0.25, y: ty - 0.25, w: 0.5, h: 0.5, fill: { color: i === 5 ? C.lime : C.bg }, line: { color: C.lime, width: 1.75 } });
      T(s, String(i + 1), { x: x + cw / 2 - 0.25, y: ty - 0.25, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: F.display, bold: true, fontSize: 14, color: i === 5 ? C.ink : C.lime });
      const cy = 3.3;
      card(s, x, cy, cw, 3.55);
      T(s, st[i][0], { x: x + 0.2, y: cy + 0.2, w: cw - 0.35, h: 0.62, fontFace: F.display, bold: true, fontSize: 14.5, lineSpacingMultiple: 1.05 });
      T(s, "USUALLY", { x: x + 0.2, y: cy + 0.95, w: cw - 0.3, h: 0.2, fontFace: F.label, bold: true, fontSize: 7.5, color: C.red, charSpacing: 1.5 });
      T(s, st[i][1], { x: x + 0.2, y: cy + 1.18, w: cw - 0.35, h: 0.72, fontSize: 11, color: C.muted, lineSpacingMultiple: 1.12 });
      s.addShape("line", { x: x + 0.2, y: cy + 1.98, w: cw - 0.4, h: 0, line: { color: C.line, width: 0.75 } });
      T(s, "WITH BOD APP", { x: x + 0.2, y: cy + 2.1, w: cw - 0.3, h: 0.2, fontFace: F.label, bold: true, fontSize: 7.5, color: C.lime, charSpacing: 1.5 });
      T(s, st[i][2], { x: x + 0.2, y: cy + 2.33, w: cw - 0.35, h: 1.1, fontSize: 11.5, bold: true, lineSpacingMultiple: 1.12 });
    }
    foot(s);
    s.addNotes("Walk the six steps left to right. Ask which step hurts most in their studio today.");
  }

  await pres.writeFile({ fileName: path.join(__dirname, "Bod-App-Sample-Slides.pptx") });
  console.log("written", n);
})();
