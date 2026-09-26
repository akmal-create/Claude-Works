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
      { text: "Less admin.", options: { breakLine: true } },
      { text: "More actual work." },
    ], { x: M, y: 1.85, w: 7.6, h: 2.3, fontFace: F.serif, italic: true, bold: true, fontSize: 62, color: C.ink, lineSpacingMultiple: 0.95 });
    T(s, "The task app your team looks forward to opening.", { x: M, y: 4.25, w: 7.6, h: 0.45, fontFace: F.display, bold: true, fontSize: 19, color: C.ink });
    T(s, "Bod App takes care of the updates, follow-ups and standups, tells everyone what to do next and by when, and cheers the team on along the way.", { x: M, y: 4.85, w: 6.4, h: 0.8, fontSize: 14, color: "25300C", lineSpacingMultiple: 1.2 });
    pill(s, M, 5.95, 2.1, 0.5, "START FREE TRIAL  →", { fill: C.ink, color: C.lime, size: 10, cs: 1.5 });
    pill(s, M + 2.25, 5.95, 2.1, 0.5, "BOOK A DEMO", { fill: C.lime, line: C.ink, color: C.ink, size: 10, cs: 1.5 });
    T(s, "Kochi, Kerala  ·  info@storibodcreatives.com  ·  +91 7356 333 975  ·  mybodstudio.com", { x: M, y: H - 0.45, w: 8, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: "2B3510" });
    const ph = 6.9, pw = ph * 0.49;
    s.addImage({ path: IMG("fig_home_crop.png"), x: 8.85, y: 0.3, w: pw, h: ph });
    const chip = (x, y, w, dot, text) => {
      s.addShape("roundRect", { x, y, w, h: 0.46, fill: { color: C.ink }, line: { type: "none" }, rectRadius: 0.23, shadow: { type: "outer", color: "000000", opacity: 0.3, blur: 8, offset: 3, angle: 90 } });
      s.addShape("ellipse", { x: x + 0.18, y: y + 0.17, w: 0.12, h: 0.12, fill: { color: dot }, line: { type: "none" } });
      T(s, text, { x: x + 0.38, y, w: w - 0.45, h: 0.46, valign: "middle", fontSize: 11, bold: true, color: C.white });
    };
    chip(10.35, 2.85, 2.55, C.lime, "Nice — 4 shipped last week");
    chip(10.5, 4.55, 2.5, C.red, "On fire · due today");
    chip(7.45, 5.35, 2.5, C.green, "Standup written for you");
    s.addNotes("Open on the feeling, not the feature list. Bod App is a task app people want to open, because it does the boring half of work for them and makes the rest feel lighter.");
  }

  // ===== 2. PROBLEM =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "01  ·  THE PROBLEM", "Nobody joined a studio to update trackers.", "But creative teams lose a slice of every day to the boring half of work.");
    T(s, "THE BORING HALF", { x: M, y: 2.45, w: 5, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: C.dim, charSpacing: 2 });
    const rows = [
      ["LuListTodo", "Updating task status, again"],
      ["LuMessageCircle", "Chasing follow-ups on WhatsApp"],
      ["LuUsers", "Writing and sitting through the standup"],
      ["LuCalendarX", "Working out who's doing what, by when"],
      ["LuReceipt", "Digging for what's ready to bill"],
      ["LuSheet", "Building a report for the founder"],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 2.8 + i * 0.62;
      card(s, M, y, 6.1, 0.52, C.surface, C.line, 0.12);
      s.addImage({ data: await icon(rows[i][0], C.muted), x: M + 0.2, y: y + 0.13, w: 0.26, h: 0.26 });
      T(s, rows[i][1], { x: M + 0.65, y, w: 5.3, h: 0.52, valign: "middle", fontSize: 14 });
    }
    const x = 7.1, w = W - M - x;
    card(s, x, 2.45, w, 2.35, C.surface);
    T(s, "30 min", { x: x + 0.4, y: 2.7, w: 3, h: 0.8, fontFace: F.display, bold: true, fontSize: 44, color: C.lime });
    T(s, "PER PERSON, EVERY DAY", { x: x + 0.4, y: 3.55, w: w - 0.8, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: C.white, charSpacing: 1.5 });
    T(s, "For a ten-person team that's about 110 hours a month — most of a full-time salary spent on admin.", { x: x + 0.4, y: 3.85, w: w - 0.8, h: 0.7, fontSize: 12.5, color: C.muted, lineSpacingMultiple: 1.15 });
    card(s, x, 4.95, w, 1.45, C.surface);
    await iconBadge(s, "LuEyeOff", x + 0.3, 5.2, 0.5, C.surface2, C.red);
    T(s, "So the tool gets abandoned.", { x: x + 1.0, y: 5.15, w: w - 1.3, h: 0.34, fontFace: F.display, bold: true, fontSize: 15 });
    T(s, "Project software feels like homework. By month two, people stop opening it.", { x: x + 1.0, y: 5.52, w: w - 1.3, h: 0.7, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.15 });
    T(s, "Illustration: 10 people · 22 working days · 30 minutes of coordination per person per day.", { x: M, y: 6.72, w: W - 2 * M, h: 0.22, fontSize: 9.5, color: C.dim });
    footer(s, n);
    s.addNotes("Every creative team has a boring half: updating status, chasing follow-ups, standups, billing checks, reports. It costs about 30 minutes a person a day, and it's why project tools get abandoned. They add to the homework instead of removing it.");
  }

  // ===== 3. THE IDEA =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "02  ·  THE IDEA", "Bod App does the boring half.\nYour team does the work.", null, { th: 1.3 });
    const cw = (W - 2 * M - 0.3) / 2, y = 2.5, ch = 3.65;
    card(s, M, y, cw, ch, C.lime, null);
    T(s, "THE APP TAKES CARE OF", { x: M + 0.4, y: y + 0.35, w: 5, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.ink, charSpacing: 2 });
    const app = [["LuTarget", "Sorting today's priorities"], ["LuBellRing", "Follow-ups and reminders"], ["LuClock", "The daily standup"], ["LuReceipt", "The what-to-bill checklist"], ["LuChartColumn", "Reports for the founder"]];
    for (let i = 0; i < app.length; i++) {
      const ry = y + 0.8 + i * 0.52;
      s.addImage({ data: await icon(app[i][0], C.ink, 2), x: M + 0.4, y: ry + 0.05, w: 0.28, h: 0.28 });
      T(s, app[i][1], { x: M + 0.85, y: ry, w: cw - 1.2, h: 0.38, valign: "middle", fontSize: 15, bold: true, color: C.ink });
    }
    const x2 = M + cw + 0.3;
    card(s, x2, y, cw, ch);
    T(s, "YOUR TEAM GETS BACK TO", { x: x2 + 0.4, y: y + 0.35, w: 5, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
    const team = [["LuPenTool", "The brief and the design"], ["LuMic", "The script, the shoot, the edit"], ["LuSparkles", "The campaign idea"], ["LuUsers", "The client conversation"], ["LuSmile", "Actually enjoying the week"]];
    for (let i = 0; i < team.length; i++) {
      const ry = y + 0.8 + i * 0.52;
      s.addImage({ data: await icon(team[i][0], C.lime, 2), x: x2 + 0.4, y: ry + 0.05, w: 0.28, h: 0.28 });
      T(s, team[i][1], { x: x2 + 0.85, y: ry, w: cw - 1.2, h: 0.38, valign: "middle", fontSize: 15, bold: true });
    }
    T(s, [
      { text: "One clear answer every time you open it:  ", options: { bold: true, color: C.white } },
      { text: "what to do next, and by when.", options: { bold: true, color: C.lime } },
    ], { x: M, y: 6.4, w: W - 2 * M, h: 0.35, fontSize: 15, valign: "middle" });
    footer(s, n);
    s.addNotes("This is the whole pitch in one slide. The app takes the clerical work off people's plates, so the team spends its time on the work clients actually pay for.");
  }

  // ===== 4. PLAYFUL =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "03  ·  THE PLAYFUL PART", "Work that feels a bit like Duolingo.", "Small wins celebrated. Gentle nudges, never scolding. A reason to open the app every day.");
    const cx = M, cy = 2.5, cwid = 6.3;
    card(s, cx, cy, cwid, 4.1, C.surface);
    T(s, "EVERY MONDAY, ON THE HOME SCREEN", { x: cx + 0.35, y: cy + 0.3, w: 5.5, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: C.dim, charSpacing: 2 });
    const iw = cwid - 0.7, ih = iw * 728 / 2002;
    s.addImage({ path: IMG("recap_card.png"), x: cx + 0.35, y: cy + 0.7, w: iw, h: ih, rounding: false });
    T(s, "Bod Annan, the studio's in-app buddy, turns last week into a small win the whole team can see.", { x: cx + 0.35, y: cy + 0.9 + ih, w: iw, h: 0.7, fontSize: 13, color: C.muted, lineSpacingMultiple: 1.2 });
    const p = [
      ["LuSmile", "Meet Bod Annan", "Shows up for the good moments — a recap, a milestone, an empty inbox. Never to scold."],
      ["LuZap", "Weekly momentum", "What you shipped, clients served and turnaround, celebrated every week."],
      ["LuSparkles", "Vibe status", "Long-press a task to set its mood: On fire, Waiting on client, Ready for review."],
      ["LuMessageCircle", "Words that encourage", "“Nice — you shipped 4 things this week.” Not “4 pending action items!!!”"],
    ];
    const x = 7.2, w = W - M - x;
    for (let i = 0; i < 4; i++) {
      const y = 2.5 + i * 1.05;
      card(s, x, y, w, 0.92);
      await iconBadge(s, p[i][0], x + 0.22, y + 0.2, 0.52);
      T(s, p[i][1], { x: x + 0.95, y: y + 0.12, w: w - 1.1, h: 0.32, fontFace: F.display, bold: true, fontSize: 14.5 });
      T(s, p[i][2], { x: x + 0.95, y: y + 0.45, w: w - 1.1, h: 0.42, fontSize: 11, color: C.muted, lineSpacingMultiple: 1.05 });
    }
    footer(s, n);
    s.addNotes("This is what makes Bod App different from every other task tool. Like Duolingo, it makes coming back feel good: a weekly win from Bod Annan, a vibe on every task, and copy that encourages instead of nagging. Bod Annan appears at about one in five moments, so it stays charming, not annoying.");
  }

  // ===== 5. A DAY WITH BOD APP =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "04  ·  A DAY WITH BOD APP", "The app runs the admin.\nYou run the day.", null, { w: 7.5, th: 1.3, noBrand: true });
    const d = [
      ["9:00 AM", "Open the app. Today is already sorted.", "“4 tasks need your attention today” — overdue first."],
      ["11:30 AM", "Speak a task in Manglish. It's assigned.", "Assignee, deadline and priority filled in for you."],
      ["2:00 PM", "Waiting on a client? The nudge is drafted.", "After 48 hours, the follow-up writes itself."],
      ["4:30 PM", "Long-press to set the vibe.", "Leads feel the load without a single check-in."],
      ["6:00 PM", "Your standup is written. One tap to post.", "What shipped and what's next, for the whole team."],
      ["MONDAY", "Bod Annan celebrates last week.", "“You shipped 4 deliverables last week.”"],
    ];
    const x0 = M, y0 = 2.45, rh = 0.7;
    s.addShape("line", { x: x0 + 0.62, y: y0 + 0.2, w: 0, h: rh * 5, line: { color: C.line, width: 1.5 } });
    for (let i = 0; i < d.length; i++) {
      const y = y0 + i * rh, last = i === d.length - 1;
      pill(s, x0, y + 0.04, 1.24, 0.32, d[i][0], { fill: last ? C.lime : C.surface2, color: last ? C.ink : C.lime, size: 8.5, cs: 1 });
      T(s, d[i][1], { x: x0 + 1.5, y: y, w: 6.3, h: 0.34, fontFace: F.display, bold: true, fontSize: 14.5 });
      T(s, d[i][2], { x: x0 + 1.5, y: y + 0.33, w: 6.3, h: 0.3, fontSize: 11.5, color: C.muted });
    }
    const ph = 6.6;
    s.addImage({ path: IMG("fig_focus_crop.png"), x: 9.15, y: 0.45, w: ph * 0.49, h: ph });
    footer(s, n);
    s.addNotes("Walk through a real day. Notice that nobody on the team updates a tracker, writes a standup or chases a client by hand. The app does it, and the team's attention stays on the work.");
  }

  // ===== 6. WHAT TO DO, BY WHEN =====
  {
    const s = pres.addSlide(); n++; bg(s);
    const ph = 6.6;
    s.addImage({ path: IMG("fig_home_crop.png"), x: 1.0, y: 0.45, w: ph * 0.49, h: ph });
    const x = 5.3, w = W - M - x;
    T(s, "05  ·  WHAT TO DO, BY WHEN", { x, y: 0.9, w, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
    T(s, "No planning. Just the next thing.", { x, y: 1.25, w, h: 0.75, fontFace: F.display, bold: true, fontSize: 30 });
    T(s, "Everyone opens the app to a short, sorted list and a clear deadline. The app decides the order, so the team can just start.", { x, y: 2.1, w: 6.9, h: 0.9, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.2 });
    const b = [
      ["LuTarget", "Smart Focus Queue", "Overdue and due-today first, blocked work tucked aside. Sorted every morning, per person."],
      ["LuSparkles", "“What's next?” AI", "Not sure what to pick up? Ask, and get the next task with a reason."],
      ["LuSunrise", "A daily AI briefing", "A short personal summary of the day, right on the home screen."],
      ["LuSmartphone", "Home-screen widgets", "Top tasks and the AI briefing without even opening the app."],
    ];
    for (let i = 0; i < b.length; i++) {
      const y = 3.2 + i * 0.85;
      await iconBadge(s, b[i][0], x, y, 0.55);
      T(s, b[i][1], { x: x + 0.8, y: y - 0.02, w: 6.3, h: 0.32, fontFace: F.display, bold: true, fontSize: 15.5 });
      T(s, b[i][2], { x: x + 0.8, y: y + 0.3, w: 6.3, h: 0.45, fontSize: 12, color: C.muted });
    }
    footer(s, n);
    s.addNotes("The core promise for team members: you never have to decide what to work on. The Focus Queue sorts the day, the AI answers 'what's next?', and the widget puts it on the home screen.");
  }

  // ===== 6. AI CAPTURE =====
  {
    const s = pres.addSlide(); n++; bg(s);
    T(s, "06  ·  NO TYPING, NO FORMS", { x: M, y: 0.9, w: 6, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
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

  // ===== 8. AUTOMATIONS =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "07  ·  THE APP DOES THE CHASING", "The clerical work, handled.", "Six jobs your team does by hand today, which Bod App now does on its own.");
    const a = [
      ["LuClock", "The standup", "Writing the daily update.", "A 6 PM digest is written for you. One tap to post."],
      ["LuBellRing", "Follow-ups", "Chasing clients on WhatsApp.", "48 hours waiting? A nudge is drafted and ready."],
      ["LuSmile", "Status checks", "Asking everyone where things are.", "Status and vibe live on every task card."],
      ["LuTarget", "Planning the day", "Scrolling a board to decide.", "The Focus Queue sorts it every morning."],
      ["LuReceipt", "Billing", "Digging through chats for billables.", "Done work lands in the Ready to Bill queue."],
      ["LuChartColumn", "Reports", "Building a sheet for the founder.", "Analytics and a plain-English AI summary."],
    ];
    const gx = 0.22, cw = (W - 2 * M - 2 * gx) / 3, ch = 2.0;
    for (let i = 0; i < 6; i++) {
      const x = M + (i % 3) * (cw + gx), y = 2.4 + Math.floor(i / 3) * (ch + 0.2);
      card(s, x, y, cw, ch);
      await iconBadge(s, a[i][0], x + 0.28, y + 0.28, 0.5);
      T(s, a[i][1], { x: x + 0.95, y: y + 0.28, w: cw - 1.2, h: 0.5, valign: "middle", fontFace: F.display, bold: true, fontSize: 16 });
      T(s, [{ text: "BEFORE  ", options: { fontFace: F.label, bold: true, fontSize: 8, color: C.red, charSpacing: 1.5 } }, { text: a[i][2], options: { color: C.muted, fontSize: 11.5 } }], { x: x + 0.28, y: y + 0.95, w: cw - 0.5, h: 0.3, valign: "middle" });
      T(s, [{ text: "NOW  ", options: { fontFace: F.label, bold: true, fontSize: 8, color: C.lime, charSpacing: 1.5 } }, { text: a[i][3], options: { color: C.white, fontSize: 11.5, bold: true } }], { x: x + 0.28, y: y + 1.3, w: cw - 0.5, h: 0.55, valign: "top", lineSpacingMultiple: 1.1 });
    }
    footer(s, n);
    s.addNotes("Go card by card and ask who on their team does this today. Every card is a job the app now does by itself.");
  }

  // ===== 9. DATA, MADE FRIENDLY =====
  {
    const s = pres.addSlide(); n++; bg(s);
    T(s, "08  ·  DATA, MADE FRIENDLY", { x: M, y: 0.9, w: 7, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: C.lime, charSpacing: 2 });
    T(s, "Numbers that cheer you on.", { x: M, y: 1.25, w: 8.0, h: 0.75, fontFace: F.display, bold: true, fontSize: 30 });
    T(s, "Shipped work, clients served and turnaround in plain words, with an AI summary that reads like a team lead talking, not a dashboard shouting.", { x: M, y: 2.05, w: 7.6, h: 0.8, fontSize: 14.5, color: C.muted, lineSpacingMultiple: 1.2 });
    card(s, M, 3.05, 7.6, 1.2, "1A2210", "3C4D12");
    T(s, "AI SUMMARY  ·  EXAMPLE", { x: M + 0.35, y: 3.25, w: 5, h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: C.lime, charSpacing: 1.5 });
    T(s, "“Output is up 18% vs last week. Design is your busiest category; two OXY tasks are blocked on client feedback.”", { x: M + 0.35, y: 3.52, w: 6.9, h: 0.65, fontSize: 13.5, bold: true, lineSpacingMultiple: 1.15 });
    T(s, "HOW BOD APP TALKS", { x: M, y: 4.5, w: 5, h: 0.22, fontFace: F.label, bold: true, fontSize: 9, color: C.dim, charSpacing: 2 });
    const t = [["4 tasks need your attention today.", "You have 4 pending action items!!!"], ["Ready to bill — 6 deliverables.", "Invoice-eligible entities: 6."], ["Nice — you shipped 4 things this week.", "Weekly throughput report generated."]];
    for (let i = 0; i < 3; i++) {
      const y = 4.85 + i * 0.58;
      card(s, M, y, 3.72, 0.48, C.surface, C.line, 0.1);
      s.addImage({ data: await icon("LuCheck", C.lime, 2.5), x: M + 0.15, y: y + 0.12, w: 0.22, h: 0.22 });
      T(s, t[i][0], { x: M + 0.48, y, w: 3.2, h: 0.48, valign: "middle", fontSize: 11.5, bold: true });
      card(s, M + 3.88, y, 3.72, 0.48, C.surface, C.line, 0.1);
      s.addImage({ data: await icon("LuX", C.red, 2.5), x: M + 4.03, y: y + 0.12, w: 0.22, h: 0.22 });
      T(s, t[i][1], { x: M + 4.36, y, w: 3.2, h: 0.48, valign: "middle", fontSize: 11.5, color: C.dim });
    }
    const ph = 6.6;
    s.addImage({ path: IMG("fig_analytics_crop.png"), x: 9.05, y: 0.45, w: ph * 0.49, h: ph });
    footer(s, n);
    s.addNotes("Founders get the numbers they ask for without building a sheet, and the team gets encouragement instead of pressure. The tone is part of the product: it talks like a calm team lead.");
  }

  // ===== 10. ROLES =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "09  ·  EVERY SEAT GETS LIGHTER", "What each person stops doing.", "Same work, seen through each person's lens — minus the admin.");
    const r = [
      ["LuCrown", "Founder", "Stops asking “where are we?”", "Gets the whole studio at a glance, a weekly AI read and a 6 PM standup."],
      ["LuClipboardCheck", "Project manager", "Stops chasing people and clients", "Gets one approvals inbox, drafted nudges and tasks spoken in by voice."],
      ["LuPenTool", "Creative team", "Stops filling in trackers", "Gets a sorted Focus Queue, a vibe on every task and weekly wins."],
      ["LuWallet", "Finance & HR", "Stops hunting for what to bill", "Gets a Ready to Bill queue, a what-to-bill checklist, and leave in one place."],
    ];
    const cw = (W - 2 * M - 3 * 0.22) / 4, y = 2.45, ch = 4.1;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.22), dark = i === 2;
      card(s, x, y, cw, ch, dark ? C.lime : C.surface, dark ? null : C.line);
      await iconBadge(s, r[i][0], x + 0.3, y + 0.3, 0.62, dark ? C.ink : C.surface2, C.lime);
      T(s, r[i][1], { x: x + 0.3, y: y + 1.15, w: cw - 0.5, h: 0.4, fontFace: F.display, bold: true, fontSize: 19, color: dark ? C.ink : C.white });
      T(s, r[i][2], { x: x + 0.3, y: y + 1.65, w: cw - 0.55, h: 0.7, fontSize: 14, bold: true, color: dark ? C.ink : C.lime, lineSpacingMultiple: 1.15 });
      T(s, r[i][3], { x: x + 0.3, y: y + 2.5, w: cw - 0.55, h: 1.3, fontSize: 12, color: dark ? "25300C" : C.muted, lineSpacingMultiple: 1.2 });
    }
    footer(s, n);
    s.addNotes("Tailor this to who's in the room. The creative team card is highlighted on purpose: if the people doing the work enjoy the app, everything else follows.");
  }

  // ===== 10. BEFORE / AFTER =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "10  ·  THE CHANGE", "Monday morning, before and after.", "Same team, same clients. A much lighter start to the week.");
    const before = ["Open WhatsApp to 40 unread messages", "Ask three people where the OXY copy is", "Nobody is sure what's due today", "A status meeting eats the first hour", "Last week's wins go unnoticed"];
    const after = ["Open Bod App to 4 sorted tasks", "Status and vibe live on every card", "Today's deadlines at the top of the queue", "Friday's 6 PM digest already went out", "Bod Annan: \u201CYou shipped 4 deliverables\u201D"];
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
    s.addNotes("Read the rows across — each 'before' has a matching 'after'. Ask the prospect which row describes their Monday right now.");
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
      ["Isn't “playful” a distraction?", "The fun is small and in the right places: a weekly win, a vibe, a kind nudge. Bod Annan shows up at about one in five moments."],
      ["Will my team actually use it?", "Opening it saves time instead of costing it. Today's list is already sorted, and the updates write themselves."],
      ["We already use WhatsApp.", "Keep it for conversation. Bod App gives the work a home, and still sends nudges on WhatsApp."],
      ["Who has time to migrate?", "There's nothing to migrate. Start with this week's tasks, or just speak them in."],
      ["Does it replace our invoicing?", "No. It tells Finance what to bill. Amounts and invoices stay in Zoho."],
      ["Is the AI really multilingual?", "Yes: Malayalam, English or Manglish, by voice or text. iOS, Android and web."],
    ];
    const cw = (W - 2 * M - 0.25) / 2, ch = 1.25;
    for (let i = 0; i < 6; i++) {
      const x = M + (i % 2) * (cw + 0.25), y = 2.4 + Math.floor(i / 2) * (ch + 0.18);
      card(s, x, y, cw, ch);
      T(s, q[i][0], { x: x + 0.35, y: y + 0.22, w: cw - 0.7, h: 0.32, fontFace: F.display, bold: true, fontSize: 15 });
      T(s, q[i][1], { x: x + 0.35, y: y + 0.58, w: cw - 0.7, h: 0.6, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.15 });
    }
    footer(s, n);
    s.addNotes("The first two are the real objections for a 'playful' tool. Answer them with the time saved, not the fun.");
  }

  // ===== 16. CTA =====
  {
    const s = pres.addSlide(); n++; bg(s, C.lime);
    s.addImage({ data: tileBlack, x: M, y: 0.5, w: 0.62, h: 0.62 });
    T(s, "Bod App", { x: M + 0.78, y: 0.5, w: 3, h: 0.36, fontFace: F.display, bold: true, fontSize: 20, color: C.ink });
    T(s, "A BOD STUDIO PRODUCT", { x: M + 0.78, y: 0.88, w: 3, h: 0.22, fontFace: F.label, bold: true, fontSize: 8.5, color: "2B3510", charSpacing: 2 });
    T(s, "NEXT STEP", { x: M, y: 1.75, w: 4, h: 0.25, fontFace: F.label, bold: true, fontSize: 10, color: "2B3510", charSpacing: 2 });
    T(s, [{ text: "Give your team", options: { breakLine: true } }, { text: "the fun half back." }], { x: M, y: 2.1, w: 8, h: 1.9, fontFace: F.serif, italic: true, bold: true, fontSize: 56, color: C.ink, lineSpacingMultiple: 0.95 });
    T(s, "Start the 14-day free trial, or book a 20-minute walkthrough on your real workflow. If your team doesn't enjoy it, you've lost two weeks and no money.", { x: M, y: 4.15, w: 7.2, h: 0.8, fontSize: 15, color: "25300C", lineSpacingMultiple: 1.2 });
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
    s.addNotes("Close on the trial. Two options: start free by email or a WhatsApp demo. Leave this slide up while you swap contact details.");
  }

  // ===== 8. FEATURE BENTO =====
  {
    const s = pres.addSlide(); n++; bg(s);
    header(s, "APPENDIX  ·  EVERYTHING INCLUDED", "The full feature list.", "Twelve features that replace a board, a sheet, a WhatsApp group and a standup meeting.");
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

  await pres.writeFile({ fileName: path.join(__dirname, "Bod-App-Sales-Deck.pptx") });
  console.log("written", n, "slides");
})();
