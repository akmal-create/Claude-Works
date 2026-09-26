from common import *
feat=[("Your day, sorted","Everyone opens the app to a short, ordered list. Overdue first."),
("Say it, it's a task","Speak or type in English, Malayalam or Manglish. Who, what and when get filled in."),
("Follow-ups, drafted","When a client goes quiet, Bod App writes the nudge. You just send it."),
("The standup writes itself","What got done, what's moving, what's stuck. Ready to send."),
("Weekly wins","Every week starts with what the team shipped, so good work gets noticed."),
("Nothing goes unbilled","Finished work moves to a Ready to bill list for Finance.")]
steps=["Brief comes in","Gets assigned","Work happens","Client nudged","Billed"]
fc=''.join(f'<div class="card" style="padding:4.2mm"><h3 style="font-size:11.5pt">{a}</h3><p class="muted" style="font-size:9pt;margin-top:1.5mm;line-height:1.45">{b}</p></div>' for a,b in feat)
st=''.join(f'<div style="flex:1"><div style="width:7mm;height:7mm;border-radius:50%;border:1.4px solid var(--lime);color:var(--lime);font-family:Epilogue;font-weight:700;font-size:9pt;display:flex;align-items:center;justify-content:center;background:var(--bg);position:relative;z-index:1">{i+1}</div><div style="font-size:9pt;font-weight:700;margin-top:2mm">{s}</div></div>' for i,s in enumerate(steps))
html=doc("Bod App — One-pager",[f'''<section class="page dark">
<div style="position:absolute;right:-40mm;top:-30mm;width:150mm;height:150mm;background:radial-gradient(circle,rgba(184,230,46,.22),rgba(184,230,46,0) 62%)"></div>
<div class="brand">{TILE}<span class="label muted">A Bod Studio product</span></div>
<div style="display:flex;gap:6mm;margin-top:12mm">
 <div style="flex:1.25">
  <h1 style="font-size:40pt">Bod App</h1>
  <div style="font-family:Epilogue;font-weight:700;font-size:15pt;color:var(--lime);margin-top:3mm">The task app for creative agencies.</div>
  <p class="lead muted" style="margin-top:4mm">It handles the admin, so your team can do the work.</p>
  <p class="muted" style="margin-top:7mm;font-size:10pt">We love the work. It's the rest of it that wears a studio down: updating the status, chasing a reply, the morning standup, working out what to bill. So we built Bod App for our own team at Storibod first.</p>
 </div>
 <div style="flex:1;position:relative;height:92mm">
  <img src="m_front_home_dark.png" style="position:absolute;right:0;top:0;height:92mm">
  <img src="annan_waving.png" style="position:absolute;left:-2mm;bottom:0;height:40mm">
  <div class="bubble" style="position:absolute;left:-6mm;top:27mm;--tx:34%">Come in. Let me<br>show you around.</div>
 </div>
</div>
<div class="label lime" style="margin-top:8mm">What it does</div>
<div class="grid3" style="margin-top:3.5mm;gap:3mm">{fc}</div>
<div class="label lime" style="margin-top:7mm">How it works</div>
<div style="position:relative;display:flex;gap:3mm;margin-top:3.5mm"><div style="position:absolute;left:3.5mm;right:30mm;top:3.5mm;height:1px;background:var(--line)"></div>{st}</div>
<div style="margin-top:7mm;background:var(--lime);color:var(--ink);border-radius:4mm;padding:5mm 6mm;display:flex;justify-content:space-between;align-items:center">
 <div><div style="font-family:Epilogue;font-weight:700;font-size:16pt">Start with a month free.</div><div style="font-size:10pt;margin-top:1mm">Up to 3 people, basic setup, on us.</div></div>
 <div style="display:flex;gap:7mm;text-align:left">{''.join(f'<div><div class="label" style="font-size:7pt">{n}</div><div style="font-family:Epilogue;font-weight:700;font-size:15pt">{p}</div></div>' for n,p in [("Basic","₹199"),("Advanced","₹299"),("Premium","₹499")])}<div style="font-size:8pt;align-self:flex-end;max-width:22mm;line-height:1.3">per person, per month</div></div>
</div>
<div class="foot" style="bottom:10mm"><span style="font-size:8.6pt;font-weight:700;white-space:nowrap">{CONTACT}</span><span class="label dim" style="font-size:7pt;white-space:nowrap">Powered by Bod Studio</span></div>
</section>'''])
open('01-One-Pager.html','w').write(html)
