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
const IMG = (f) => path.join(__dirname, "img", f);

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

  const small = (s, text, x, y, w, color = C.dim) => T(s, text, { x, y, w, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color, charSpacing: 2 });
  const foot = (s) => footer(s, n);
  const timeTag = (s, t, x, y) => T(s, t, { x, y, w: 4, h: 0.5, fontFace: F.serif, italic: true, bold: true, fontSize: 28, color: C.lime });

  // ===== 1. COVER =====
  {
    const s = pres.addSlide(); n++; bg(s, C.lime);
    s.addImage({ data: tileBlack, x: M, y: 0.5, w: 0.62, h: 0.62 });
    T(s, "Bod App", { x: M + 0.78, y: 0.5, w: 3, h: 0.36, fontFace: F.display, bold: true, fontSize: 20, color: C.ink });
    T(s, "A BOD STUDIO PRODUCT", { x: M + 0.78, y: 0.88, w: 3, h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: "2B3510", charSpacing: 2 });
    T(s, [{ text: "Made in a studio,", options: { breakLine: true } }, { text: "for studios." }], { x: M, y: 2.35, w: 7.8, h: 2.2, fontFace: F.serif, italic: true, bold: true, fontSize: 60, color: C.ink, lineSpacingMultiple: 0.95 });
    T(s, "The task app we built for our own team at Storibod.", { x: M, y: 4.7, w: 7, h: 0.4, fontSize: 17, color: "25300C" });
    T(s, "Kochi, Kerala  ·  mybodstudio.com", { x: M, y: H - 0.45, w: 8, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: "2B3510" });
    const ph = 6.9;
    s.addImage({ path: IMG("fig_home_crop.png"), x: 8.85, y: 0.3, w: ph * 0.49, h: ph });
    s.addNotes("Keep the opening soft. This is a studio sharing the tool it built for itself.");
  }

  // ===== 2. WE LOVE THE WORK =====
  {
    const s = pres.addSlide(); n++; bg(s);
    T(s, "We love the work.", { x: M + 0.4, y: 2.55, w: 11, h: 1.0, fontFace: F.display, bold: true, fontSize: 54 });
    T(s, "The ideas, the shoots, the late edits that finally click.", { x: M + 0.4, y: 3.65, w: 11, h: 0.5, fontSize: 20, color: C.muted });
    foot(s);
    s.addNotes("Pause here. Most studio owners will nod. This is why they started.");
  }

  // ===== 3. THE REST OF IT =====
  {
    const s = pres.addSlide(); n++; bg(s);
    T(s, "It's the rest of it.", { x: M + 0.4, y: 1.2, w: 11, h: 1.0, fontFace: F.display, bold: true, fontSize: 54 });
    const chores = ["Updating the status, again.", "Chasing a reply from the client.", "“Where's that file?”", "The 10 am standup.", "Working out what to bill this month."];
    const shades = [C.white, "D3D9D6", "AEB7B3", "8A9590", "66716D"];
    for (let i = 0; i < chores.length; i++) {
      T(s, chores[i], { x: M + 0.4, y: 2.65 + i * 0.66, w: 10, h: 0.5, fontSize: 24, color: shades[i] });
    }
    foot(s);
    s.addNotes("Read these slowly. Every studio lives with them. None of it is the work clients pay for.");
  }

  // ===== 4. SO WE BUILT SOMETHING =====
  {
    const s = pres.addSlide(); n++; bg(s);
    s.addImage({ path: IMG("annan.png"), x: M + 0.4, y: 1.75, w: 1.25, h: 1.25 * 330 / 230 });
    T(s, [{ text: "So we built something", options: { breakLine: true } }, { text: "to handle the rest." }], { x: M + 0.4, y: 3.75, w: 11, h: 1.7, fontFace: F.display, bold: true, fontSize: 48, lineSpacingMultiple: 1.0 });
    T(s, "We made it for our own team first. This is Bod Annan, who lives inside it.", { x: M + 0.4, y: 5.55, w: 10, h: 0.45, fontSize: 18, color: C.muted });
    foot(s);
    s.addNotes("Bod App ran the Storibod floor before anyone else saw it. Introduce Bod Annan lightly. He comes back later in the story.");
  }

  // ===== 5. 9 AM =====
  {
    const s = pres.addSlide(); n++; bg(s);
    timeTag(s, "9 am", M + 0.4, 2.2);
    T(s, [{ text: "You open it and the day", options: { breakLine: true } }, { text: "is already in order." }], { x: M + 0.4, y: 2.85, w: 7.5, h: 1.6, fontFace: F.display, bold: true, fontSize: 38 });
    T(s, "Overdue work first, then what's due today. Anything stuck waits quietly at the bottom.", { x: M + 0.4, y: 4.55, w: 6.8, h: 0.8, fontSize: 16, color: C.muted, lineSpacingMultiple: 1.25 });
    const ph = 6.6;
    s.addImage({ path: IMG("fig_focus_crop.png"), x: 9.05, y: 0.45, w: ph * 0.49, h: ph });
    foot(s);
    s.addNotes("This is the Focus Queue. Nobody has to plan the day or scroll a board.");
  }

  // ===== 6. 11 AM =====
  {
    const s = pres.addSlide(); n++; bg(s);
    timeTag(s, "11 am", M + 0.4, 2.2);
    T(s, "Say it the way you'd say it.", { x: M + 0.4, y: 2.85, w: 6.2, h: 1.6, fontFace: F.display, bold: true, fontSize: 38 });
    T(s, "Malayalam, English or Manglish, by voice or text. It turns into a task with a name and a date.", { x: M + 0.4, y: 4.55, w: 5.8, h: 0.8, fontSize: 16, color: C.muted, lineSpacingMultiple: 1.25 });
    const cx = 7.1, cw = W - M - cx;
    card(s, cx, 1.0, cw, 5.5, C.surface, C.line, 0.22);
    s.addShape("roundRect", { x: cx + 1.3, y: 1.35, w: cw - 1.65, h: 1.2, fill: { color: "25300C" }, line: { color: "3C4D12", width: 0.75 }, rectRadius: 0.16 });
    small(s, "VOICE NOTE", cx + 1.55, 1.52, 3, C.lime);
    T(s, "“Naseem-inod OXY landing page copy Friday-il venam, high priority.”", { x: cx + 1.55, y: 1.8, w: cw - 2.1, h: 0.7, fontSize: 13.5, bold: true, lineSpacingMultiple: 1.15 });
    s.addImage({ data: tileLime, x: cx + 0.35, y: 2.85, w: 0.46, h: 0.46 });
    T(s, "Here's the task. Look right?", { x: cx + 0.98, y: 2.9, w: 4, h: 0.36, valign: "middle", fontSize: 13 });
    const dy = 3.45;
    card(s, cx + 0.98, dy, cw - 1.33, 2.1, C.surface2, C.line, 0.14);
    const f = [["Task", "OXY landing page copy", C.white], ["For", "Naseem", C.white], ["By", "Friday", C.white], ["Priority", "High", C.red]];
    for (let i = 0; i < f.length; i++) {
      const ry = dy + 0.15 + i * 0.47;
      T(s, f[i][0], { x: cx + 1.2, y: ry, w: 1.3, h: 0.38, valign: "middle", fontSize: 12.5, color: C.muted });
      T(s, f[i][1], { x: cx + 2.5, y: ry, w: cw - 3.1, h: 0.38, valign: "middle", align: "right", fontSize: 13, bold: true, color: f[i][2] });
    }
    pill(s, cx + 0.98, 5.8, 1.6, 0.42, "LOOKS GOOD", { fill: C.lime, color: C.ink, size: 9.5, cs: 1.5 });
    foot(s);
    s.addNotes("Play a voice note live if you can. The task goes to the project manager to approve, so nothing lands on the board by accident.");
  }

  // ===== 7. 3 PM =====
  {
    const s = pres.addSlide(); n++; bg(s);
    timeTag(s, "3 pm", M + 0.4, 2.2);
    T(s, "Still waiting on the client?", { x: M + 0.4, y: 2.85, w: 6.2, h: 1.6, fontFace: F.display, bold: true, fontSize: 38 });
    T(s, "After two days, it writes the follow-up for you. You just send it.", { x: M + 0.4, y: 4.55, w: 5.8, h: 0.8, fontSize: 16, color: C.muted, lineSpacingMultiple: 1.25 });
    const cx = 7.1, cw = W - M - cx;
    card(s, cx, 1.55, cw, 1.35, C.surface, C.line, 0.18);
    T(s, "OXY landing page copy", { x: cx + 0.35, y: 1.8, w: 4, h: 0.34, fontFace: F.display, bold: true, fontSize: 15 });
    T(s, "OXY Studios", { x: cx + 0.35, y: 2.14, w: 3, h: 0.28, fontSize: 11.5, color: C.red, bold: true });
    pill(s, cx + 0.35, 2.47, 1.9, 0.3, "Waiting on client · 2 days", { fill: C.surface2, color: C.yellow, size: 9, font: F.body, cs: 0 });
    card(s, cx, 3.1, cw, 3.0, "1A2210", "3C4D12", 0.18);
    s.addImage({ path: IMG("annan.png"), x: cx + 0.35, y: 3.35, w: 0.42, h: 0.42 * 330 / 230 });
    small(s, "A FOLLOW-UP, READY TO GO", cx + 0.95, 3.45, 4, C.lime);
    T(s, "“Hi! Just checking in on the landing page copy. Could we get your feedback by Thursday so we can wrap it up Friday?”", { x: cx + 0.95, y: 3.78, w: cw - 1.3, h: 1.2, fontSize: 14, lineSpacingMultiple: 1.25 });
    pill(s, cx + 0.95, 5.3, 1.3, 0.42, "SEND", { fill: C.lime, color: C.ink, size: 9.5, cs: 1.5 });
    pill(s, cx + 2.4, 5.3, 1.3, 0.42, "LATER", { fill: C.surface2, color: C.white, size: 9.5, cs: 1.5 });
    foot(s);
    s.addNotes("This is the nudge. It only appears once a task has been waiting on a client for 48 hours.");
  }

  // ===== 8. 6 PM =====
  {
    const s = pres.addSlide(); n++; bg(s);
    timeTag(s, "6 pm", M + 0.4, 2.2);
    T(s, "The standup is\nalready written.", { x: M + 0.4, y: 2.85, w: 5.9, h: 1.6, fontFace: F.display, bold: true, fontSize: 38 });
    T(s, "Read it, send it to the team, go home.", { x: M + 0.4, y: 4.55, w: 5.8, h: 0.8, fontSize: 16, color: C.muted, lineSpacingMultiple: 1.25 });
    const cx = 7.1, cw = W - M - cx;
    card(s, cx, 1.0, cw, 5.5, C.surface, C.line, 0.22);
    small(s, "TODAY  ·  6:00 PM", cx + 0.4, 1.35, 4, C.lime);
    T(s, "Your standup", { x: cx + 0.4, y: 1.65, w: 4, h: 0.45, fontFace: F.display, bold: true, fontSize: 20 });
    const g = [
      ["DONE", C.green, ["Reel edit for Halo", "Carousel for Lumen"]],
      ["MOVING", C.blue, ["Email header draft for Verde"]],
      ["STUCK", C.yellow, ["OXY landing page copy, waiting on feedback"]],
    ];
    let yy = 2.35;
    for (const [lab, col, items] of g) {
      small(s, lab, cx + 0.4, yy, 2, col);
      yy += 0.32;
      for (const it of items) { T(s, it, { x: cx + 0.4, y: yy, w: cw - 0.8, h: 0.34, fontSize: 13.5 }); yy += 0.38; }
      yy += 0.18;
    }
    pill(s, cx + 0.4, 5.75, 1.5, 0.42, "SEND", { fill: C.lime, color: C.ink, size: 9.5, cs: 1.5 });
    pill(s, cx + 2.05, 5.75, 1.3, 0.42, "COPY", { fill: C.surface2, color: C.white, size: 9.5, cs: 1.5 });
    foot(s);
    s.addNotes("Every evening the day's standup is drafted from what actually moved. No morning meeting needed.");
  }

  // ===== 9. MONDAY =====
  {
    const s = pres.addSlide(); n++; bg(s);
    timeTag(s, "Monday", M + 0.4, 0.95);
    T(s, "And someone notices the good work.", { x: M + 0.4, y: 1.55, w: 11, h: 0.8, fontFace: F.display, bold: true, fontSize: 38 });
    const iw = 8.4, ih = iw * 728 / 2002;
    s.addImage({ path: IMG("recap_card.png"), x: (W - iw) / 2, y: 2.9, w: iw, h: ih });
    T(s, "Every week starts with what the team got done.", { x: M + 0.4, y: 6.3, w: W - 2 * M - 0.8, h: 0.4, align: "center", fontSize: 16, color: C.muted });
    foot(s);
    s.addNotes("This is the moment people smile at. Small, honest recognition, every Monday.");
  }

  // ===== 10. LIGHTER =====
  {
    const s = pres.addSlide(); n++; bg(s);
    T(s, "The week feels lighter.", { x: M + 0.4, y: 1.3, w: 11, h: 1.0, fontFace: F.display, bold: true, fontSize: 54 });
    const cw = 5.4;
    small(s, "LESS OF", M + 0.4, 3.1, 3, C.dim);
    T(s, "Any update?\nJust following up.\nWho's on this?", { x: M + 0.4, y: 3.45, w: cw, h: 2.2, fontSize: 24, color: "66716D", lineSpacingMultiple: 1.35 });
    small(s, "MORE OF", M + 6.4, 3.1, 3, C.lime);
    T(s, "The work itself.\nClear heads.\nLeaving on time.", { x: M + 6.4, y: 3.45, w: cw, h: 2.2, fontSize: 24, bold: true, lineSpacingMultiple: 1.35 });
    foot(s);
    s.addNotes("That's the story. From here, show how it works and what's in the app.");
  }

  // ===== 11. HOW IT WORKS =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "HOW IT WORKS", "From a message to a billed job.", "Every task moves through the same five steps. Each person only sees the steps that are theirs.");
    const st = [
      ["Capture", "Someone speaks, types or sends a PDF brief.", "ANYONE", C.muted],
      ["Approve", "The project manager checks it once and puts it on the board.", "PROJECT MANAGER", C.blue],
      ["Work", "It shows up in the right person's day, with chat and files attached.", "THE TEAM", C.green],
      ["Ready to bill", "Finished work moves to Finance with a note on what to bill.", "PROJECT MANAGER", C.lime],
      ["Billed", "Finance invoices it in Zoho and closes it out.", "FINANCE", C.yellow],
    ];
    const cw = 2.25, gap = (W - 2 * M - 5 * cw) / 4, y = 2.55, ch = 3.1;
    for (let i = 0; i < 5; i++) {
      const x = M + i * (cw + gap);
      card(s, x, y, cw, ch);
      s.addShape("ellipse", { x: x + 0.25, y: y + 0.3, w: 0.58, h: 0.58, fill: { color: st[i][3] }, line: { type: "none" } });
      T(s, String(i + 1), { x: x + 0.25, y: y + 0.3, w: 0.58, h: 0.58, align: "center", valign: "middle", fontFace: F.display, bold: true, fontSize: 17, color: C.ink });
      T(s, st[i][0], { x: x + 0.25, y: y + 1.1, w: cw - 0.4, h: 0.4, fontFace: F.display, bold: true, fontSize: 18 });
      T(s, st[i][1], { x: x + 0.25, y: y + 1.55, w: cw - 0.45, h: 0.9, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.15 });
      small(s, st[i][2], x + 0.25, y + ch - 0.5, cw - 0.4, st[i][3]);
      if (i < 4) T(s, "→", { x: x + cw, y: y + 0.38, w: gap, h: 0.42, align: "center", valign: "middle", fontSize: 16, bold: true, color: C.dim });
    }
    T(s, "Amounts and invoices stay in Zoho. Bod App only keeps track of what's ready to bill.", { x: M, y: 6.1, w: W - 2 * M, h: 0.35, fontSize: 13.5, color: C.muted });
    foot(s);
    s.addNotes("Walk the five steps. The point for founders: finished work can't slip through before it's billed.");
  }

  // ===== 12. IN THE APP TODAY =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "IN THE APP TODAY", "What your team gets on day one.", null);
    const f = [
      ["LuListTodo", "Tasks and boards", "Owners, deadlines, priority and status."],
      ["LuMic", "Voice to task", "Speak in Malayalam, English or Manglish."],
      ["LuInbox", "Approval queue", "Requests and PDF briefs, duplicates caught."],
      ["LuMessageCircle", "Team and task chat", "Voice notes, files and replies in one thread."],
      ["LuSunrise", "Daily AI summary", "A short read of your day, every morning."],
      ["LuSparkles", "“What's next?”", "Ask which task to pick up next."],
      ["LuClock", "AI standup", "One tap to post the day's standup to the team."],
      ["LuChartColumn", "Analytics", "Shipped work and turnaround, in plain words."],
      ["LuUsers", "Clients and team", "Every client, every person, every role."],
      ["LuSheet", "Google Sheets sync", "Your task data, mirrored to a sheet."],
      ["LuBellRing", "Notifications", "Assignments, status changes and chat."],
      ["LuSmartphone", "Phone, tablet and web", "iOS, Android and web, with home-screen widgets."],
    ];
    const gx = 0.2, gy = 0.16, cw = (W - 2 * M - 3 * gx) / 4, ch = 1.48;
    for (let i = 0; i < 12; i++) {
      const x = M + (i % 4) * (cw + gx), y = 1.95 + Math.floor(i / 4) * (ch + gy);
      card(s, x, y, cw, ch);
      s.addImage({ data: await icon(f[i][0], C.lime), x: x + 0.25, y: y + 0.25, w: 0.32, h: 0.32 });
      T(s, f[i][1], { x: x + 0.25, y: y + 0.66, w: cw - 0.4, h: 0.3, fontFace: F.display, bold: true, fontSize: 13.5 });
      T(s, f[i][2], { x: x + 0.25, y: y + 0.97, w: cw - 0.4, h: 0.45, fontSize: 10.5, color: C.muted });
    }
    foot(s);
    s.addNotes("Everything on this page is in the live app now.");
  }

  // ===== 13. COMING WITH THE NEW UPDATE =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "COMING WITH THE NEW UPDATE", "A calmer, friendlier app.", "A full redesign, with the features from the story.", { w: 7.6, noBrand: true });
    const f = [
      ["LuTarget", "Focus Queue", "Your day, sorted every morning."],
      ["LuSmile", "Bod Annan and weekly wins", "A small celebration of last week's work."],
      ["LuSparkles", "Task vibes", "Long-press a task to say how it's going."],
      ["LuPalette", "Client colours", "Every client gets its own colour."],
      ["LuBellRing", "Follow-up nudges", "A reply drafted after two days of waiting."],
      ["LuFileText", "Notes to tasks", "Paste messy notes and get clean tasks."],
      ["LuClock", "6 pm digest", "Your standup, written before you leave."],
    ];
    for (let i = 0; i < f.length; i++) {
      const y = 2.45 + i * 0.6;
      s.addImage({ data: await icon(f[i][0], C.lime), x: M, y: y + 0.06, w: 0.3, h: 0.3 });
      T(s, f[i][1], { x: M + 0.55, y, w: 3.4, h: 0.42, valign: "middle", fontFace: F.display, bold: true, fontSize: 14.5 });
      T(s, f[i][2], { x: M + 3.8, y, w: 3.7, h: 0.42, valign: "middle", fontSize: 12.5, color: C.muted });
      if (i < f.length - 1) s.addShape("line", { x: M, y: y + 0.52, w: 7.5, h: 0, line: { color: C.line, width: 0.75 } });
    }
    const ph = 6.2;
    s.addImage({ path: IMG("fig_left_home_crop.png"), x: 8.45, y: 0.65, w: ph * 0.3627, h: ph });
    s.addImage({ path: IMG("fig_right_tasks_crop.png"), x: 10.78, y: 0.65, w: ph * 0.3613, h: ph });
    foot(s);
    s.addNotes("Be clear that these arrive with the redesign. Trial customers get them as they ship.");
  }

  // ===== 14. TRY IT =====
  {
    const s = pres.addSlide(); n++; bg(s);
    T(s, "Try it with your team for two weeks.", { x: M + 0.4, y: 1.2, w: 11, h: 0.9, fontFace: F.display, bold: true, fontSize: 40 });
    T(s, "No card needed. Run real client work through it and see how the week feels.", { x: M + 0.4, y: 2.15, w: 11, h: 0.5, fontSize: 17, color: C.muted });
    small(s, "IF YOU STAY  ·  PER PERSON, PER MONTH", M + 0.4, 3.3, 6, C.dim);
    const p = [["Basic", "₹199", "The essentials for a small team."], ["Advanced", "₹299", "Everything we use at Storibod."], ["Premium", "₹499", "Set up around your own workflow."]];
    const cw = (W - 2 * M - 0.8 - 0.4) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + 0.4 + i * (cw + 0.2), hi = i === 1;
      card(s, x, 3.7, cw, 2.2, hi ? C.lime : C.surface, hi ? null : C.line);
      T(s, p[i][0], { x: x + 0.35, y: 3.95, w: cw - 0.6, h: 0.3, fontFace: F.display, bold: true, fontSize: 15, color: hi ? C.ink : C.white });
      T(s, p[i][1], { x: x + 0.35, y: 4.35, w: cw - 0.6, h: 0.8, fontFace: F.display, bold: true, fontSize: 40, color: hi ? C.ink : C.lime });
      T(s, p[i][2], { x: x + 0.35, y: 5.25, w: cw - 0.6, h: 0.4, fontSize: 13, color: hi ? "25300C" : C.muted });
    }
    foot(s);
    s.addNotes("Keep pricing low-key. Offer the trial first; the plan conversation comes at the end of week two.");
  }

  // ===== 15. CLOSE =====
  {
    const s = pres.addSlide(); n++; bg(s, C.lime);
    s.addImage({ data: tileBlack, x: M, y: 0.5, w: 0.62, h: 0.62 });
    T(s, "Bod App", { x: M + 0.78, y: 0.5, w: 3, h: 0.36, fontFace: F.display, bold: true, fontSize: 20, color: C.ink });
    T(s, "A BOD STUDIO PRODUCT", { x: M + 0.78, y: 0.88, w: 3, h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: "2B3510", charSpacing: 2 });
    T(s, [{ text: "Come see", options: { breakLine: true } }, { text: "how it feels." }], { x: M, y: 2.0, w: 8, h: 2.1, fontFace: F.serif, italic: true, bold: true, fontSize: 60, color: C.ink, lineSpacingMultiple: 0.95 });
    T(s, "A 20-minute walkthrough on your own workflow. Just message us.", { x: M, y: 4.3, w: 7.2, h: 0.5, fontSize: 17, color: "25300C" });
    const ct = [["WHATSAPP", "+91 7356 333 975"], ["EMAIL", "info@storibodcreatives.com"], ["WEB", "mybodstudio.com"]];
    const cws = [2.0, 3.0, 2.0];
    let cx = M;
    for (let i = 0; i < 3; i++) {
      T(s, ct[i][0], { x: cx, y: 5.55, w: cws[i], h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: "3A4A10", charSpacing: 2 });
      T(s, ct[i][1], { x: cx, y: 5.82, w: cws[i], h: 0.3, fontSize: 13, bold: true, color: C.ink });
      cx += cws[i];
    }
    const ph = 6.9;
    s.addImage({ path: IMG("fig_tasks_crop.png"), x: 9.15, y: 0.3, w: ph * 0.49, h: ph });
    s.addNotes("Close by offering the walkthrough, not the sale.");
  }

  await pres.writeFile({ fileName: path.join(__dirname, "Bod-App-Sales-Deck.pptx") });
  console.log("written", n, "slides");
})();
