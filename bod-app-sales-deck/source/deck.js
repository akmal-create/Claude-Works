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

  // ===== 1. COVER =====
  {
    const s = pres.addSlide(); n++; bg(s, C.lime);
    s.addImage({ data: tileBlack, x: M, y: 0.5, w: 0.62, h: 0.62 });
    T(s, "Bod App", { x: M + 0.78, y: 0.5, w: 3, h: 0.36, fontFace: F.display, bold: true, fontSize: 20, color: C.ink });
    T(s, "A BOD STUDIO PRODUCT", { x: M + 0.78, y: 0.88, w: 3, h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: "2B3510", charSpacing: 2 });
    T(s, "PRODUCT SALES DECK  ·  2026", { x: 3.6, y: 0.55, w: 3.4, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: "2B3510", charSpacing: 2, align: "right" });
    T(s, [
      { text: "Stop juggling.", options: { breakLine: true } },
      { text: "Start shipping." },
    ], { x: M, y: 1.95, w: 7.2, h: 2.3, fontFace: F.serif, italic: true, bold: true, fontSize: 66, color: C.ink, lineSpacingMultiple: 0.95 });
    T(s, "Run your whole studio from one calm app.", { x: M, y: 4.35, w: 7, h: 0.45, fontFace: F.display, bold: true, fontSize: 21, color: C.ink });
    T(s, "Tasks, approvals, billing prompts, standups and AI capture — one app instead of five. Built for marketing agencies and creative studios.", { x: M, y: 4.95, w: 6.2, h: 0.75, fontSize: 14, color: "25300C", lineSpacingMultiple: 1.2 });
    pill(s, M, 5.95, 2.1, 0.5, "START FREE TRIAL  →", { fill: C.ink, color: C.lime, size: 10, cs: 1.5 });
    pill(s, M + 2.25, 5.95, 2.1, 0.5, "BOOK A DEMO", { fill: C.lime, line: C.ink, color: C.ink, size: 10, cs: 1.5 });
    T(s, "Kochi, Kerala  ·  info@storibodcreatives.com  ·  +91 7356 333 975  ·  mybodstudio.com", { x: M, y: H - 0.45, w: 8, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: "2B3510" });
    // phone + floating chips
    const ph = 6.9, pw = ph * 0.49;
    s.addImage({ path: IMG("fig_home_crop.png"), x: 8.85, y: 0.3, w: pw, h: ph });
    const chip = (x, y, w, dot, text) => {
      s.addShape("roundRect", { x, y, w, h: 0.46, fill: { color: C.ink }, line: { type: "none" }, rectRadius: 0.23, shadow: { type: "outer", color: "000000", opacity: 0.3, blur: 8, offset: 3, angle: 90 } });
      s.addShape("ellipse", { x: x + 0.18, y: y + 0.17, w: 0.12, h: 0.12, fill: { color: dot }, line: { type: "none" } });
      T(s, text, { x: x + 0.38, y, w: w - 0.45, h: 0.46, valign: "middle", fontSize: 11, bold: true, color: C.white });
    };
    chip(7.35, 1.55, 2.35, C.red, "On fire · due today");
    chip(10.5, 4.55, 2.5, C.lime, "57% shipped this week");
    chip(7.55, 5.35, 2.2, C.green, "6 PM standup ready");
    s.addNotes("Open on the promise: one calm app that replaces the five places a studio's work lives today. Bod App is a Bod Studio product, built and run inside Storibod first.");
  }

  // ===== 2. PROBLEM =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "01  ·  THE PROBLEM", "Your team isn't disorganised. Your tools are.", "A busy studio's work lives in five places at once — so none of it can be tracked honestly.");
    T(s, "WHERE THE WORK LIVES TODAY", { x: M, y: 2.45, w: 5, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: C.dim, charSpacing: 2 });
    const rows = [
      ["LuMessageCircle", "WhatsApp", "Briefs, approvals and follow-ups"],
      ["LuSheet", "Spreadsheets", "The task list nobody updates"],
      ["LuMail", "Email", "Files, feedback and revisions"],
      ["LuBrain", "Memory", "What's done and ready to bill"],
      ["LuUsers", "Meetings", "The daily \"where are we?\""],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 2.8 + i * 0.74;
      card(s, M, y, 5.7, 0.62, C.surface, C.line, 0.12);
      await iconBadge(s, rows[i][0], M + 0.1, y + 0.1, 0.42, C.surface2, C.muted);
      T(s, rows[i][1], { x: M + 0.68, y, w: 1.6, h: 0.62, valign: "middle", fontFace: F.display, bold: true, fontSize: 14 });
      T(s, rows[i][2], { x: M + 2.3, y, w: 3.3, h: 0.62, valign: "middle", fontSize: 12.5, color: C.muted });
    }
    const pains = [
      ["LuCalendarX", C.red, "Deadlines slip quietly", "You hear about it when the client calls, not the day it happens."],
      ["LuReceipt", C.yellow, "Delivered work goes unbilled", "Shipped deliverables fall through the gap between done and invoiced."],
      ["LuEyeOff", C.blue, "Founders fly blind", "There's no honest read of where the week — or the team's capacity — went."],
    ];
    for (let i = 0; i < pains.length; i++) {
      const y = 2.45 + i * 1.3, x = 6.85;
      card(s, x, y, W - M - x, 1.15);
      await iconBadge(s, pains[i][0], x + 0.25, y + 0.3, 0.55, C.surface2, pains[i][1]);
      T(s, pains[i][2], { x: x + 1.05, y: y + 0.22, w: 4.6, h: 0.35, fontFace: F.display, bold: true, fontSize: 17 });
      T(s, pains[i][3], { x: x + 1.05, y: y + 0.6, w: 4.6, h: 0.45, fontSize: 12.5, color: C.muted });
    }
    T(s, [
      { text: "THE RESULT   ", options: { fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 } },
      { text: "The project tool gets abandoned by month two, and the team goes back to chasing each other.", options: { fontSize: 14, bold: true, color: C.white } },
    ], { x: M, y: 6.55, w: W - 2 * M, h: 0.35, valign: "middle" });
    footer(s, n);
    s.addNotes("Name the pain before the product. Most studios aren't disorganised — their work is split across WhatsApp, sheets, email, memory and meetings. The cost shows up as slipped deadlines, unbilled work and a founder with no real view.");
  }

  // ===== 3. MEET BOD APP =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "02  ·  MEET BOD APP", "One calm app for\nthe whole studio.", null, { w: 7.2, th: 1.3 });
    T(s, "The workspace a marketing agency runs on: tasks, approvals, billing, AI capture and standups in one place. Built and battle-tested inside Storibod's own studio.", { x: M, y: 2.25, w: 6.6, h: 0.8, fontSize: 14, color: C.muted, lineSpacingMultiple: 1.2 });
    const stats = [
      ["5→1", "Tools, replaced", "Tasks, approvals, billing prompts, standups and AI in one app."],
      ["3", "Languages, spoken", "Capture work in Malayalam, English or Manglish — voice or text."],
      ["6 PM", "Standup, automated", "A daily digest of what shipped and what's next, written for you."],
      ["3", "Platforms, one app", "iOS, Android and web — at the desk or on a shoot, always in sync."],
    ];
    for (let i = 0; i < 4; i++) {
      const x = M + (i % 2) * 3.35, y = 3.3 + Math.floor(i / 2) * 1.8, w = 3.2, h = 1.65;
      card(s, x, y, w, h);
      T(s, stats[i][0], { x: x + 0.3, y: y + 0.15, w: w - 0.5, h: 0.7, fontFace: F.display, bold: true, fontSize: 36, color: C.lime });
      T(s, stats[i][1].toUpperCase(), { x: x + 0.3, y: y + 0.85, w: w - 0.5, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: C.white, charSpacing: 1.5 });
      T(s, stats[i][2], { x: x + 0.3, y: y + 1.1, w: w - 0.5, h: 0.5, fontSize: 11, color: C.muted, lineSpacingMultiple: 1.1 });
    }
    const ph = 6.5;
    s.addImage({ path: IMG("fig_left_home_crop.png"), x: 7.75, y: 0.62, w: ph * 0.3627, h: ph });
    s.addImage({ path: IMG("fig_right_tasks_crop.png"), x: 10.3, y: 0.62, w: ph * 0.3613, h: ph });
    footer(s, n);
    s.addNotes("Bod App in one line: the workspace an agency runs on. Four numbers do the selling — five tools become one, three languages, a standup written at 6 PM, and one app across iOS, Android and web.");
  }

  // ===== 4. FOCUS =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const ph = 6.6;
    s.addImage({ path: IMG("fig_focus_crop.png"), x: 1.0, y: 0.45, w: ph * 0.49, h: ph });
    const x = 5.3, w = W - M - x;
    T(s, "03  ·  SMART FOCUS QUEUE", { x, y: 0.9, w, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
    T(s, "Start every day already sorted.", { x, y: 1.25, w, h: 0.75, fontFace: F.display, bold: true, fontSize: 30 });
    T(s, "Open the app and today is decided for you — overdue and blocked work first, the rest in the order that keeps clients happy. No planning meeting, no scrolling a board.", { x, y: 2.1, w: 6.9, h: 0.9, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.2 });
    const b = [
      ["LuTarget", "Overdue & blocked surfaced at the top", "The queue is auto-sorted every morning, per person."],
      ["LuZap", "One tap into a calm focus mode", "Just today's work — nothing else competing for attention."],
      ["LuSmile", "Vibe status, so the team feels the load", "Tap to set the mood of a task. Leads see pressure before it becomes a problem."],
    ];
    for (let i = 0; i < b.length; i++) {
      const y = 3.25 + i * 0.95;
      await iconBadge(s, b[i][0], x, y, 0.55);
      T(s, b[i][1], { x: x + 0.8, y: y - 0.02, w: 6.3, h: 0.32, fontFace: F.display, bold: true, fontSize: 16 });
      T(s, b[i][2], { x: x + 0.8, y: y + 0.32, w: 6.3, h: 0.5, fontSize: 12.5, color: C.muted });
    }
    T(s, "VIBE STATUS", { x, y: 6.2, w: 2, h: 0.3, valign: "middle", fontFace: F.label, bold: true, fontSize: 9, color: C.dim, charSpacing: 2 });
    const vibes = [["On fire", C.red], ["Waiting on client", C.yellow], ["Ready for review", C.green], ["Backburner", C.muted]];
    let vx = x + 1.35;
    for (const [t, c] of vibes) {
      const vw = 0.4 + t.length * 0.075;
      pill(s, vx, 6.2, vw, 0.32, t, { fill: C.surface2, color: c, size: 9.5, font: F.body, cs: 0 });
      vx += vw + 0.1;
    }
    footer(s, n);
    s.addNotes("This is the screen designers and creators live in. Every morning the queue is already sorted — overdue and blocked first. Vibe status lets the team say how a task feels, so leads spot overload early.");
  }

  // ===== 5. WORKFLOW =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "04  ·  THE WORKFLOW", "Brief to billed.", "Five stages, role-aware at every step. Nothing shipped goes uninvoiced.");
    const st = [
      ["Pending", "Captured or requested. Waits for approval.", "PM APPROVES", C.muted],
      ["In Progress", "Assigned and moving, with a live vibe.", "TEAM OWNS", C.blue],
      ["Completed", "Delivered. Counts toward your week.", "TEAM MARKS", C.green],
      ["Ready to Bill", "Enters the Finance queue with notes.", "PM HANDS OFF", C.lime],
      ["Billed", "Invoiced in Zoho and closed out.", "FINANCE CLOSES", C.yellow],
    ];
    const cw = 2.25, gap = (W - 2 * M - 5 * cw) / 4, y = 2.5, ch = 3.1;
    s.addShape("line", { x: M + 0.5, y: y + 0.62, w: W - 2 * M - 1.0, h: 0, line: { color: C.line, width: 1.5, dashType: "dash" } });
    for (let i = 0; i < 5; i++) {
      const x = M + i * (cw + gap);
      card(s, x, y, cw, ch);
      s.addShape("ellipse", { x: x + 0.25, y: y + 0.3, w: 0.62, h: 0.62, fill: { color: st[i][3] }, line: { type: "none" } });
      T(s, String(i + 1), { x: x + 0.25, y: y + 0.3, w: 0.62, h: 0.62, align: "center", valign: "middle", fontFace: F.display, bold: true, fontSize: 18, color: C.ink });
      T(s, st[i][0], { x: x + 0.25, y: y + 1.12, w: cw - 0.4, h: 0.4, fontFace: F.display, bold: true, fontSize: 18 });
      T(s, st[i][1], { x: x + 0.25, y: y + 1.58, w: cw - 0.45, h: 0.8, fontSize: 12.5, color: C.muted, lineSpacingMultiple: 1.15 });
      pill(s, x + 0.25, y + ch - 0.62, cw - 0.5, 0.36, st[i][2], { fill: C.surface2, color: st[i][3], size: 8.5, cs: 1.2 });
      if (i < 4) T(s, "→", { x: x + cw, y: y + 0.4, w: gap, h: 0.42, align: "center", valign: "middle", fontSize: 16, bold: true, color: C.dim });
    }
    T(s, [
      { text: "Role-gated at every step.  ", options: { bold: true, color: C.white } },
      { text: "People can only move work their role owns. Billed work is archived; cancelled work stays off-track.", options: { color: C.muted, breakLine: true } },
      { text: "No change to your accounting.  ", options: { bold: true, color: C.white } },
      { text: "Finance works a first-come Ready to Bill queue with an urgent-bill flag. Amounts stay in Zoho.", options: { color: C.muted } },
    ], { x: M, y: 5.95, w: W - 2 * M, h: 0.75, fontSize: 13, valign: "top", lineSpacingMultiple: 1.3 });
    footer(s, n);
    s.addNotes("Walk the pipeline left to right and name who owns each step. The key sell for founders is stage four: Ready to Bill. Delivered work lands in Finance's queue automatically, so nothing shipped goes uninvoiced. Invoicing itself stays in Zoho.");
  }

  // ===== 6. AI CAPTURE =====
  {
    const s = pres.addSlide(); n++; bg(s);
    T(s, "05  ·  AI CAPTURE", { x: M, y: 0.9, w: 6, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
    T(s, "Speak it. It becomes a task.", { x: M, y: 1.25, w: 6, h: 1.3, fontFace: F.display, bold: true, fontSize: 34 });
    T(s, "A voice note or a messy line of notes turns into a clean, assigned task — the who, what and when already filled in. In the language your team actually speaks.", { x: M, y: 2.6, w: 5.6, h: 1.0, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.2 });
    const langs = ["Malayalam", "English", "Manglish", "Voice → task", "PDF → tasks"];
    let lx = M;
    for (const l of langs) { const lw = 0.36 + l.length * 0.072; pill(s, lx, 3.75, lw, 0.34, l, { fill: C.surface2, color: C.lime, size: 9.5, font: F.body, cs: 0 }); lx += lw + 0.08; }
    const b = ["Assignee, deadline and priority parsed for you", "Lands in the PM approval queue, with duplicate detection", "Works from a voice note, rough notes or a PDF brief"];
    for (let i = 0; i < b.length; i++) {
      const y = 4.45 + i * 0.55;
      s.addImage({ data: await icon("LuCheck", C.lime, 2.5), x: M, y: y + 0.03, w: 0.26, h: 0.26 });
      T(s, b[i], { x: M + 0.42, y, w: 5.4, h: 0.34, fontSize: 14, valign: "middle" });
    }
    // chat recreation
    const cx = 7.0, cw = W - M - cx;
    card(s, cx, 0.55, cw, 6.35, C.surface, C.line, 0.22);
    s.addShape("roundRect", { x: cx + 1.5, y: 0.95, w: cw - 1.85, h: 1.25, fill: { color: "25300C" }, line: { color: "3C4D12", width: 0.75 }, rectRadius: 0.16 });
    T(s, "YOU  ·  VOICE NOTE  ·  MANGLISH", { x: cx + 1.75, y: 1.1, w: cw - 2.3, h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: C.lime, charSpacing: 1.5 });
    T(s, "“Naseem-inod OXY landing page copy Friday-il venam, high priority.”", { x: cx + 1.75, y: 1.4, w: cw - 2.3, h: 0.7, fontSize: 14, bold: true, lineSpacingMultiple: 1.15 });
    s.addImage({ data: tileLime, x: cx + 0.35, y: 2.5, w: 0.48, h: 0.48 });
    T(s, "BOD APP  ·  DRAFT TASK", { x: cx + 1.0, y: 2.52, w: 3, h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: C.muted, charSpacing: 1.5 });
    T(s, "Here's the task, ready for approval:", { x: cx + 1.0, y: 2.78, w: 4, h: 0.3, fontSize: 13 });
    const dy = 3.2;
    card(s, cx + 1.0, dy, cw - 1.35, 2.35, C.surface2, C.line, 0.14);
    const f = [["Task", "OXY landing page copy", C.white], ["Assignee", "Naseem", C.white], ["Deadline", "Friday", C.white], ["Priority", "High", C.red]];
    for (let i = 0; i < f.length; i++) {
      const ry = dy + 0.18 + i * 0.52;
      T(s, f[i][0], { x: cx + 1.25, y: ry, w: 1.3, h: 0.4, valign: "middle", fontSize: 12.5, color: C.muted });
      T(s, f[i][1], { x: cx + 2.6, y: ry, w: cw - 3.2, h: 0.4, valign: "middle", align: "right", fontSize: 13, bold: true, color: f[i][2] });
      if (i < 3) s.addShape("line", { x: cx + 1.25, y: ry + 0.47, w: cw - 1.85, h: 0, line: { color: C.line, width: 0.75 } });
    }
    pill(s, cx + 1.0, 5.8, 1.7, 0.44, "APPROVE", { fill: C.lime, color: C.ink, size: 10, cs: 1.5 });
    pill(s, cx + 2.85, 5.8, 1.4, 0.44, "EDIT", { fill: C.surface2, line: C.line, color: C.white, size: 10, cs: 1.5 });
    footer(s, n);
    s.addNotes("Play this out loud if you can. A Manglish voice note becomes a fully-formed draft task — assignee, deadline and priority parsed — sitting in the PM's approvals inbox. It also works from messy notes or a PDF brief.");
  }

  // ===== 7. ANALYTICS / FOUNDER =====
  {
    const s = pres.addSlide(); n++; bg(s);
    T(s, "06  ·  ANALYTICS & AUTO STANDUP", { x: M, y: 0.9, w: 7, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
    T(s, "See the whole studio at a glance.", { x: M, y: 1.25, w: 8.0, h: 0.75, fontFace: F.display, bold: true, fontSize: 30 });
    T(s, "Deliverables shipped, clients served, average turnaround — the numbers a founder actually asks for, without a single spreadsheet.", { x: M, y: 2.1, w: 7.2, h: 0.8, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.2 });
    const b = [
      ["LuChartColumn", "Output per client", "Every client gets its own colour, so the workload split is obvious."],
      ["LuSparkles", "AI summaries", "A daily briefing per person and a plain-English read of the week."],
      ["LuClock", "Auto standup at 6 PM", "A daily digest of what shipped and what's next. One tap to copy."],
      ["LuBellRing", "Blocked-task nudges", "48 hours waiting on a client? The follow-up is drafted for you."],
    ];
    for (let i = 0; i < 4; i++) {
      const x = M + (i % 2) * 3.7, y = 3.2 + Math.floor(i / 2) * 1.75, w = 3.55, h = 1.6;
      card(s, x, y, w, h);
      await iconBadge(s, b[i][0], x + 0.25, y + 0.25, 0.48);
      T(s, b[i][1], { x: x + 0.25, y: y + 0.85, w: w - 0.45, h: 0.3, fontFace: F.display, bold: true, fontSize: 13.5 });
      T(s, b[i][2], { x: x + 0.25, y: y + 1.13, w: w - 0.45, h: 0.42, fontSize: 10.5, color: C.muted, lineSpacingMultiple: 1.05 });
    }
    const ph = 6.6;
    s.addImage({ path: IMG("fig_analytics_crop.png"), x: 9.05, y: 0.45, w: ph * 0.49, h: ph });
    footer(s, n);
    s.addNotes("This is the founder's slide. Analytics, a weekly AI summary and a 6 PM standup mean the founder never has to ask for a status update. Blocked-task nudges take chasing off the PM's plate.");
  }

  // ===== 8. FEATURE BENTO =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "07  ·  EVERYTHING IN ONE WORKSPACE", "Less juggling. More shipping.", "Twelve features that replace a board, a sheet, a WhatsApp group and a standup meeting.");
    const f = [
      ["LuListTodo", "Focus Queue", "One auto-sorted list for today, overdue first."],
      ["LuWorkflow", "Task pipeline", "Pending to Billed, role-aware at every step."],
      ["LuSmile", "Vibe status", "Long-press a task to set its mood."],
      ["LuMic", "AI capture", "Voice or text in Malayalam, English, Manglish."],
      ["LuPalette", "Client colours", "Every client gets its own accent, everywhere."],
      ["LuBellRing", "Smart nudges", "A follow-up drafted after 48h on a client."],
      ["LuClock", "Auto standup", "A 6 PM digest, one tap to copy or post."],
      ["LuReceipt", "Billing checklist", "What to bill, not how much. Zoho keeps the rest."],
      ["LuInbox", "Approvals hub", "Requests, notes and PDF tasks in one PM inbox."],
      ["LuMessageCircle", "Team & task chat", "Group and per-task threads, files, voice notes."],
      ["LuSparkles", "What's next? AI", "Ask which task to pick up next. Get a reason."],
      ["LuSmartphone", "Home widgets", "Your top tasks and AI briefing on the home screen."],
    ];
    const gx = 0.2, gy = 0.18, cw = (W - 2 * M - 3 * gx) / 4, ch = 1.38;
    for (let i = 0; i < 12; i++) {
      const x = M + (i % 4) * (cw + gx), y = 2.35 + Math.floor(i / 4) * (ch + gy);
      card(s, x, y, cw, ch);
      await iconBadge(s, f[i][0], x + 0.22, y + 0.22, 0.46);
      T(s, f[i][1], { x: x + 0.82, y: y + 0.22, w: cw - 0.95, h: 0.46, valign: "middle", fontFace: F.display, bold: true, fontSize: 14 });
      T(s, f[i][2], { x: x + 0.22, y: y + 0.8, w: cw - 0.4, h: 0.5, fontSize: 11, color: C.muted, lineSpacingMultiple: 1.1 });
    }
    footer(s, n);
    s.addNotes("The full feature set on one page. Point out that none of these need setup or training — they show up the moment the team starts adding tasks.");
  }

  // ===== 9. ROLES =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "08  ·  BUILT FOR THE WHOLE STUDIO", "One app, every seat.", "Everyone sees the same work through their own lens — no status meetings required.");
    const r = [
      ["LuCrown", "Founder", "The whole studio at a glance — deliverables shipped, clients served, and what's ready to bill.", ["Analytics", "AI weekly summary", "6 PM standup"]],
      ["LuClipboardCheck", "Project manager", "Assign, chase and approve from one inbox. Blocked-task nudges write the follow-up.", ["Approvals hub", "Nudges", "AI capture"]],
      ["LuPenTool", "Creative team", "A calm focus queue — today's work, auto-sorted, with the vibe of each task at a tap.", ["Focus Queue", "Vibe status", "Focus mode"]],
      ["LuWallet", "Finance & HR", "A Ready to Bill queue and a “what to bill” checklist, so nothing shipped goes uninvoiced.", ["Ready to Bill", "PM–Finance board", "Leave & holidays"]],
    ];
    const cw = (W - 2 * M - 3 * 0.22) / 4, y = 2.45, ch = 4.2;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.22);
      card(s, x, y, cw, ch, i === 0 ? C.lime : C.surface, i === 0 ? null : C.line);
      const dark = i === 0;
      await iconBadge(s, r[i][0], x + 0.3, y + 0.3, 0.62, dark ? C.ink : C.surface2, C.lime);
      T(s, r[i][1], { x: x + 0.3, y: y + 1.15, w: cw - 0.5, h: 0.4, fontFace: F.display, bold: true, fontSize: 19, color: dark ? C.ink : C.white });
      T(s, r[i][2], { x: x + 0.3, y: y + 1.62, w: cw - 0.55, h: 1.3, fontSize: 12.5, color: dark ? "25300C" : C.muted, lineSpacingMultiple: 1.2 });
      T(s, "THEY LIVE IN", { x: x + 0.3, y: y + 2.95, w: cw - 0.5, h: 0.2, fontFace: F.label, bold: true, fontSize: 8, color: dark ? "3A4A10" : C.dim, charSpacing: 1.5 });
      T(s, r[i][3].join("  ·  "), { x: x + 0.3, y: y + 3.2, w: cw - 0.5, h: 0.7, fontSize: 11.5, bold: true, color: dark ? C.ink : C.white, lineSpacingMultiple: 1.2 });
    }
    footer(s, n);
    s.addNotes("Tailor this to who's in the room. If it's the founder, lead with the lime card. If it's an ops or PM lead, spend time on the approvals inbox and nudges.");
  }

  // ===== 10. BEFORE / AFTER =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "09  ·  THE CHANGE", "Same team. Different week.", "From chasing status to seeing the work.");
    const before = ["Briefs scattered across WhatsApp, email and memory", "Status known only by asking each person", "Blocked work waits until someone notices", "Delivered work slips through before it's billed", "The morning goes on a status meeting"];
    const after = ["Every brief captured once — by voice, in any language", "Status visible at a glance, with a live vibe", "Blocked-task nudges write the follow-up", "A Ready to Bill queue: nothing shipped goes uninvoiced", "A 6 PM standup digest, written for you"];
    const cw = (W - 2 * M - 0.3) / 2, y = 2.45, ch = 4.3;
    card(s, M, y, cw, ch);
    card(s, M + cw + 0.3, y, cw, ch, C.lime, null);
    T(s, "BEFORE BOD APP", { x: M + 0.4, y: y + 0.35, w: 4, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.red, charSpacing: 2 });
    T(s, "WITH BOD APP", { x: M + cw + 0.7, y: y + 0.35, w: 4, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.ink, charSpacing: 2 });
    for (let i = 0; i < 5; i++) {
      const ry = y + 0.9 + i * 0.66;
      s.addImage({ data: await icon("LuX", C.red, 2.5), x: M + 0.4, y: ry + 0.04, w: 0.24, h: 0.24 });
      T(s, before[i], { x: M + 0.8, y: ry, w: cw - 1.1, h: 0.34, valign: "middle", fontSize: 14, color: C.muted });
      s.addImage({ data: await icon("LuCheck", C.ink, 2.75), x: M + cw + 0.7, y: ry + 0.04, w: 0.24, h: 0.24 });
      T(s, after[i], { x: M + cw + 1.1, y: ry, w: cw - 1.1, h: 0.34, valign: "middle", fontSize: 14, bold: true, color: C.ink });
      if (i < 4) {
        s.addShape("line", { x: M + 0.4, y: ry + 0.5, w: cw - 0.8, h: 0, line: { color: C.line, width: 0.75 } });
        s.addShape("line", { x: M + cw + 0.7, y: ry + 0.5, w: cw - 0.8, h: 0, line: { color: "A3CC28", width: 0.75 } });
      }
    }
    footer(s, n);
    s.addNotes("Read the rows across — each 'before' has a matching 'after'. Ask the prospect which row describes their week right now.");
  }

  // ===== 11. COST =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "10  ·  THE COST", "The bill for coordination nobody counts.", "Illustration: 10 people  ·  22 working days  ·  30 minutes of coordination per person, per day.");
    const c = [
      ["30 min", "PER PERSON / DAY", "Chasing status, re-explaining briefs and hunting for files.", C.surface, C.white],
      ["110 hrs", "PER MONTH", "Lost across a ten-person team — most of a full-time salary.", C.surface, C.white],
      ["₹2,990", "BOD APP ADVANCED / MONTH", "The full setup for that same ten-person team (10 seats × ₹299).", C.lime, C.ink],
    ];
    const cw = (W - 2 * M - 2 * 0.22) / 3, y = 2.55, ch = 3.1;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.22), lime = i === 2;
      card(s, x, y, cw, ch, c[i][3], lime ? null : C.line);
      T(s, c[i][0], { x: x + 0.4, y: y + 0.4, w: cw - 0.8, h: 1.0, fontFace: F.display, bold: true, fontSize: 54, color: lime ? C.ink : C.lime });
      T(s, c[i][1], { x: x + 0.4, y: y + 1.55, w: cw - 0.8, h: 0.25, fontFace: F.label, bold: true, fontSize: 9.5, color: lime ? "2B3510" : C.white, charSpacing: 1.5 });
      T(s, c[i][2], { x: x + 0.4, y: y + 1.95, w: cw - 0.8, h: 0.8, fontSize: 13, color: lime ? "25300C" : C.muted, lineSpacingMultiple: 1.2 });
    }
    T(s, "Run the arithmetic with your own team size and hourly cost. It rarely comes out close.", { x: M, y: 6.1, w: W - 2 * M, h: 0.35, fontSize: 15, bold: true });
    footer(s, n);
    s.addNotes("10 people × 30 minutes × 22 days = 110 hours a month spent on coordination. Compare that with ₹2,990 a month for ten seats on Advanced. Ask for their team size and do the maths live.");
  }

  // ===== 12. PRICING =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "11  ·  PRICING", "Simple per-seat plans.", "14 days free. Full features. No card.");
    const p = [
      ["BASIC", "₹199", "Small teams finding their rhythm.", "The essentials, not every feature", null, ["Full task pipeline & board", "Focus Queue & vibe status", "Per-client colour", "iOS, Android & web"]],
      ["ADVANCED", "₹299", "Growing agencies, many clients.", "The full setup we run on ourselves", "Everything in Basic, plus:", ["AI capture: voice, notes, PDF", "Approvals hub & requests", "Nudges, standup & recap", "Billing checklist & analytics"]],
      ["PREMIUM", "₹499", "Studios wanting a custom build.", "Custom setup, configured with you", "Everything in Advanced, plus:", ["Custom pipeline, categories & roles", "Zoho & Sheets sync", "SSO & role controls", "Onboarding & priority support"]],
    ];
    const cw = (W - 2 * M - 2 * 0.22) / 3, y = 2.3, ch = 4.25;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.22), hi = i === 1;
      const txt = hi ? C.ink : C.white, mut = hi ? "25300C" : C.muted;
      card(s, x, y, cw, ch, hi ? C.lime : C.surface, hi ? null : C.line);
      T(s, p[i][0], { x: x + 0.35, y: y + 0.3, w: 2, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: hi ? C.ink : C.lime, charSpacing: 2 });
      if (hi) pill(s, x + cw - 1.65, y + 0.26, 1.3, 0.32, "MOST POPULAR", { fill: C.ink, color: C.lime, size: 8, cs: 1.2 });
      T(s, [
        { text: p[i][1], options: { fontFace: F.display, bold: true, fontSize: 40, color: txt } },
        { text: "  / seat / mo", options: { fontSize: 12, color: mut } },
      ], { x: x + 0.35, y: y + 0.65, w: cw - 0.6, h: 0.8, valign: "bottom" });
      T(s, p[i][2], { x: x + 0.35, y: y + 1.55, w: cw - 0.6, h: 0.3, fontSize: 13, bold: true, color: txt });
      T(s, p[i][3], { x: x + 0.35, y: y + 1.85, w: cw - 0.6, h: 0.3, fontSize: 11.5, color: mut });
      s.addShape("line", { x: x + 0.35, y: y + 2.3, w: cw - 0.7, h: 0, line: { color: hi ? "A3CC28" : C.line, width: 0.75 } });
      let ly = y + 2.45;
      if (p[i][4]) { T(s, p[i][4], { x: x + 0.35, y: ly, w: cw - 0.6, h: 0.28, fontSize: 11, bold: true, color: mut }); ly += 0.34; }
      else ly += 0.1;
      for (const it of p[i][5]) {
        s.addImage({ data: await icon("LuCheck", hi ? C.ink : C.lime, 2.5), x: x + 0.35, y: ly + 0.05, w: 0.2, h: 0.2 });
        T(s, it, { x: x + 0.65, y: ly, w: cw - 0.95, h: 0.3, valign: "middle", fontSize: 12, color: txt });
        ly += 0.36;
      }
    }
    T(s, "Per seat, per month. Talk to us about annual billing and larger teams.  ·  GCC clients can be billed in AED or SAR.", { x: M, y: 6.72, w: W - 2 * M, h: 0.25, fontSize: 11, color: C.muted });
    footer(s, n);
    s.addNotes("Advanced is the recommendation for most agencies — it's the exact setup Storibod runs on. Basic is for small teams getting started; Premium is a custom setup with Zoho and Sheets sync, SSO and priority onboarding. Every plan starts with a 14-day free trial, no card.");
  }

  // ===== 13. BUILT BY A STUDIO + STACK =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "12  ·  WHY BOD STUDIO", "Built by a studio.\nFits your stack.", null, { w: 6, th: 1.3 });
    T(s, "Bod App was built to run the Storibod floor before it was offered to anyone else. Every feature earned its place on real client work.", { x: M, y: 2.25, w: 5.8, h: 0.9, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.2 });
    card(s, M, 3.35, 5.8, 1.5);
    T(s, "BATTLE-TESTED ON WORK FOR", { x: M + 0.35, y: 3.58, w: 5, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: C.lime, charSpacing: 2 });
    T(s, "OXY  ·  Salison's  ·  Restlon  ·  Papacheri  ·  Vijayan Master's  ·  Plum Stories", { x: M + 0.35, y: 3.9, w: 5.2, h: 0.75, fontFace: F.display, bold: true, fontSize: 15, lineSpacingMultiple: 1.25 });
    card(s, M, 5.05, 5.8, 1.55);
    s.addImage({ data: tileLime, x: M + 0.35, y: 5.35, w: 0.9, h: 0.9 });
    T(s, "A Bod Studio product", { x: M + 1.5, y: 5.38, w: 4, h: 0.35, fontFace: F.display, bold: true, fontSize: 16 });
    T(s, "Built by Storibod Creatives in Kochi, Kerala. Support stays human — on WhatsApp.", { x: M + 1.5, y: 5.75, w: 4.1, h: 0.6, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.15 });
    const x0 = 6.85, gw = (W - M - x0 - 0.2) / 2, gh = 1.3;
    T(s, "PLAYS NICE WITH WHAT YOU USE", { x: x0, y: 0.95, w: 5, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: C.dim, charSpacing: 2 });
    const st = [["LuFileText", "Zoho", "Invoices & books"], ["LuSheet", "Google Sheets", "Live task sync"], ["LuMessageCircle", "WhatsApp", "Nudges & demos"], ["LuSmartphone", "iOS", "iPhone & iPad"], ["LuTabletSmartphone", "Android", "Phone & tablet"], ["LuGlobe", "Web", "Any browser"]];
    for (let i = 0; i < 6; i++) {
      const x = x0 + (i % 2) * (gw + 0.2), y = 1.3 + Math.floor(i / 2) * (gh + 0.2);
      card(s, x, y, gw, gh);
      await iconBadge(s, st[i][0], x + 0.3, y + 0.34, 0.62, C.surface2, C.white);
      T(s, st[i][1], { x: x + 1.1, y: y + 0.34, w: gw - 1.2, h: 0.34, fontFace: F.display, bold: true, fontSize: 15 });
      T(s, st[i][2], { x: x + 1.15, y: y + 0.7, w: gw - 1.3, h: 0.3, fontSize: 12, color: C.muted });
    }
    footer(s, n);
    s.addNotes("Credibility slide. This isn't a startup guessing at agency workflows — it's the tool a working agency built for itself. On integrations: invoices stay in Zoho, exports go to Sheets, and it runs on every device.");
  }

  // ===== 14. GETTING STARTED =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "13  ·  GETTING STARTED", "From first call to a decision in 14 days.", "A real workflow, not a generic demo.");
    const st = [
      ["DAY 0", "Walkthrough", "20 minutes on your actual workflow — on WhatsApp or a call."],
      ["DAY 1", "Set up", "Invite the team, set roles, add clients and their colours. No migration."],
      ["DAYS 2–13", "Run real work", "Put live client work through the pipeline. Standups and nudges run themselves."],
      ["DAY 14", "Decide", "Read your own analytics and AI summary. Keep it only if it earned its place."],
    ];
    const y0 = 2.75, cw = (W - 2 * M - 3 * 0.25) / 4;
    s.addShape("line", { x: M + 0.2, y: y0 + 0.2, w: W - 2 * M - 0.4, h: 0, line: { color: C.lime, width: 2 } });
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.25);
      s.addShape("ellipse", { x: x + 0.05, y: y0 + 0.02, w: 0.36, h: 0.36, fill: { color: i === 3 ? C.lime : C.bg }, line: { color: C.lime, width: 2 } });
      card(s, x, y0 + 0.7, cw, 2.55);
      T(s, st[i][0], { x: x + 0.3, y: y0 + 0.95, w: cw - 0.5, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
      T(s, st[i][1], { x: x + 0.3, y: y0 + 1.3, w: cw - 0.5, h: 0.4, fontFace: F.display, bold: true, fontSize: 20 });
      T(s, st[i][2], { x: x + 0.3, y: y0 + 1.8, w: cw - 0.55, h: 1.2, fontSize: 12.5, color: C.muted, lineSpacingMultiple: 1.2 });
    }
    T(s, [
      { text: "14 days, full features, no card.  ", options: { bold: true, color: C.lime } },
      { text: "If it hasn't earned its place, walk away — there's no contract to unwind.", options: { color: C.white } },
    ], { x: M, y: 6.3, w: W - 2 * M, h: 0.35, fontSize: 14, valign: "middle" });
    footer(s, n);
    s.addNotes("Make the trial the ask. Offer the 20-minute walkthrough on their real workflow, set them up on day one, and book a review call on day 14 to read the analytics together.");
  }

  // ===== 15. FAQ =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "14  ·  QUESTIONS", "The questions you're already thinking.", "Short answers. No jargon.");
    const q = [
      ["We already use WhatsApp.", "WhatsApp is where work gets discussed, not tracked. Bod App gives the work a home — and still nudges on WhatsApp."],
      ["We tried a project tool. It died.", "Usually because it demanded setup before it gave anything back. Bod App sorts your day from the first task you add."],
      ["Who has time to migrate?", "There's nothing to migrate. Start with this week's tasks — or speak them in. History can stay where it is."],
      ["Does it replace our invoicing?", "No. It runs a “what to bill” checklist and a Ready to Bill queue. Amounts and invoices stay in Zoho."],
      ["Is the AI really multilingual?", "Yes — Malayalam, English or Manglish, by voice or text. It parses the who, what and when into a draft task."],
      ["Which devices?", "iOS, Android and web from one codebase — with home-screen widgets on mobile and offline caching when the signal drops."],
    ];
    const cw = (W - 2 * M - 0.25) / 2, ch = 1.25;
    for (let i = 0; i < 6; i++) {
      const x = M + (i % 2) * (cw + 0.25), y = 2.4 + Math.floor(i / 2) * (ch + 0.18);
      card(s, x, y, cw, ch);
      T(s, q[i][0], { x: x + 0.35, y: y + 0.22, w: cw - 0.7, h: 0.32, fontFace: F.display, bold: true, fontSize: 15 });
      T(s, q[i][1], { x: x + 0.35, y: y + 0.58, w: cw - 0.7, h: 0.6, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.15 });
    }
    footer(s, n);
    s.addNotes("Pre-empt the objections. The two that come up most: 'we already use WhatsApp' and 'does it replace our invoicing'.");
  }

  // ===== 16. CTA =====
  {
    const s = pres.addSlide(); n++; bg(s, C.lime);
    s.addImage({ data: tileBlack, x: M, y: 0.5, w: 0.62, h: 0.62 });
    T(s, "Bod App", { x: M + 0.78, y: 0.5, w: 3, h: 0.36, fontFace: F.display, bold: true, fontSize: 20, color: C.ink });
    T(s, "A BOD STUDIO PRODUCT", { x: M + 0.78, y: 0.88, w: 3, h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: "2B3510", charSpacing: 2 });
    T(s, "NEXT STEP", { x: M, y: 1.75, w: 4, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: "2B3510", charSpacing: 2 });
    T(s, [{ text: "Run your studio", options: { breakLine: true } }, { text: "the calm way." }], { x: M, y: 2.1, w: 7.5, h: 1.9, fontFace: F.serif, italic: true, bold: true, fontSize: 58, color: C.ink, lineSpacingMultiple: 0.95 });
    T(s, "Start the 14-day free trial, or book a 20-minute walkthrough on your real workflow. If it doesn't hold up, you've lost two weeks and no money.", { x: M, y: 4.15, w: 6.8, h: 0.8, fontSize: 15, color: "25300C", lineSpacingMultiple: 1.2 });
    pill(s, M, 5.1, 2.3, 0.52, "START FREE TRIAL  →", { fill: C.ink, color: C.lime, size: 10.5, cs: 1.5 });
    pill(s, M + 2.45, 5.1, 2.3, 0.52, "DEMO ON WHATSAPP", { fill: C.lime, line: C.ink, color: C.ink, size: 10.5, cs: 1.5 });
    const ct = [["WHATSAPP", "+91 7356 333 975"], ["EMAIL", "info@storibodcreatives.com"], ["WEB", "mybodstudio.com"], ["INSTAGRAM", "@storibod.creatives"]];
    const cws = [1.75, 2.75, 1.75, 1.9];
    let cx = M;
    for (let i = 0; i < 4; i++) {
      T(s, ct[i][0], { x: cx, y: 6.1, w: cws[i], h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: "3A4A10", charSpacing: 2 });
      T(s, ct[i][1], { x: cx, y: 6.36, w: cws[i], h: 0.3, fontSize: 12.5, bold: true, color: C.ink });
      cx += cws[i];
    }
    const ph = 6.9;
    s.addImage({ path: IMG("fig_tasks_crop.png"), x: 9.15, y: 0.3, w: ph * 0.49, h: ph });
    s.addNotes("Close on the trial. Two options: start free (email) or a WhatsApp demo. Leave this slide up while you swap contact details.");
  }

  await pres.writeFile({ fileName: path.join(__dirname, "Bod-App-Sales-Deck.pptx") });
  console.log("written", n, "slides");
})();
