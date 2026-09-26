from common import *
def rows(rs, cols):
    head=''.join(f'<th style="width:{w}">{h}</th>' for h,w in cols)
    body=''.join('<tr>'+''.join(f'<td>{c}</td>' for c in r)+'</tr>' for r in rs)
    return f'<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>'

# ---------------- DEMO SCRIPT ----------------
D="DEMO SCRIPT &amp; TALK TRACK"
p1=f'''<div class="label limeD">20-minute walkthrough</div>
<h1 style="margin-top:3mm">Show them their own week.</h1>
<p class="lead pm" style="margin-top:4mm;max-width:150mm">The goal of the demo is not to show every feature. It's to let one person at the agency picture their own Monday inside Bod App, then say yes to a free month.</p>
<div class="grid2" style="margin-top:9mm">
 <div class="pcard"><h3>Before the call</h3><ul style="margin:3mm 0 0 4.5mm">
  <li>Ask for two or three of their real client names. Add them to the demo workspace with their own colours.</li>
  <li>Load the demo workspace with a normal-looking week: a few tasks done, one waiting on a client, one due today.</li>
  <li>Check the phone mirrors cleanly on the call. Switch the app to the theme they'll like (dark or light).</li>
  <li>Find out who's on the call: founder, PM, creative or finance. Lead with the part of the app that person lives in.</li></ul></div>
 <div class="pcard"><h3>How to sound</h3><ul style="margin:3mm 0 0 4.5mm">
  <li>Talk like a colleague showing a tool you use, not a salesperson. "This is what our team does every morning."</li>
  <li>Ask more than you tell. Every step below has a question. Use it.</li>
  <li>Let Bod Annan land on his own. Don't oversell the character; people smile at him without help.</li>
  <li>Never promise a feature that isn't in the app. If they ask for something new, write it down and say you'll come back.</li></ul></div>
</div>
<h2 style="margin-top:10mm">The flow at a glance</h2>
{rows([["0–3 min","Open","Their week, in their words"],["3–6 min","Listen","Where the admin piles up"],["6–15 min","Show","Six moments in the app"],["15–18 min","Answer","Their questions"],["18–20 min","Close","A free month, and a setup call"]],[("Time","20%"),("Part","20%"),("What it's for","60%")])}'''
steps=[
("Home and weekly win","Open the app on the home screen. Point at the weekly recap card.","“This is the first thing our team sees each week. Bod Annan tells everyone what they shipped.”","What would it do for your team to see last week's wins, without anyone writing a report?"),
("Focus Queue","Tap into Focus. Show overdue at the top, then today, blocked work tucked away.","“Nobody here plans their day any more. They open this and start at the top.”","How does your team decide what to work on first right now?"),
("Voice to task","Hold the mic and say a real task using their client's name. Show the draft task.","“Say it the way you'd say it in the office. It fills in who, what and when.”","Can you try one? Say a task you'd normally drop in WhatsApp."),
("Approvals","Open the PM approval queue. Approve the task you just made.","“Nothing lands on the board by accident. The PM approves it once.”","Who hands out work in your studio today?"),
("Follow-up nudge","Open a task waiting on a client. Show the drafted follow-up.","“When a client goes quiet, it writes the nudge for you. You just send it.”","How many client follow-ups does your team chase in a week?"),
("Standup and billing","Show the standup summary, then the Ready to bill list.","“The standup writes itself, and finished work goes straight to Finance. Nothing sits unbilled.”","What happens at month end when you work out what to bill?"),
]
p2='<div class="label limeD">6–15 min · The walkthrough</div><h2 style="margin-top:2mm">Six moments, in this order.</h2><p class="pm" style="margin-top:2mm">Each moment takes about 90 seconds. Show it, say one line, ask one question, then move on.</p><div style="margin-top:5mm">'+rows([[f'<b>{i+1}. {a}</b>',b,f'<span class="say">{c}</span>',f'<i>{d}</i>'] for i,(a,b,c,d) in enumerate(steps)],[("Moment","17%"),("What to show","27%"),("What to say","30%"),("Ask them","26%")])+'</div>'
p3=f'''<div class="label limeD">0–6 min · Open and listen</div><h2 style="margin-top:2mm">Start with their week, not the app.</h2>
<div class="pcard" style="margin-top:5mm"><h3>Opening line</h3><p class="say" style="margin-top:2mm">“Before I show you anything, tell me about last week. What took more time than it should have?”</p></div>
<h3 style="margin-top:6mm">Questions to find the pain</h3><ul style="margin:2mm 0 0 4.5mm">
<li>Where do briefs arrive today? WhatsApp, email, calls?</li><li>How do you know where a job is without asking someone?</li>
<li>What happens when a client goes quiet for a few days?</li><li>How long does your standup or status meeting take?</li>
<li>How do you make sure everything delivered gets billed?</li><li>Have you tried a project tool before? What happened to it?</li></ul>
<p class="note" style="margin-top:3mm">Write down their exact words. Use them in the walkthrough: “You said briefs get lost in WhatsApp, so watch this.”</p>
<div class="label limeD" style="margin-top:9mm">15–20 min · Answer and close</div><h2 style="margin-top:2mm">Offer the month, book the setup.</h2>
<div class="pcard" style="margin-top:5mm"><h3>The close</h3><p class="say" style="margin-top:2mm">“The easiest way to know if this fits is to run your own work through it. The first month is free for up to three people, and we'll set it up with you. Shall we book a 30-minute setup call this week?”</p></div>
<h3 style="margin-top:6mm">If they need time</h3><ul style="margin:2mm 0 0 4.5mm"><li>Send the one-pager and pricing sheet the same day, on WhatsApp.</li><li>Book a follow-up date before you hang up. Don't leave it open.</li><li>Ask who else needs to see it, and offer a second, shorter demo for them.</li></ul>
<h3 style="margin-top:6mm">After every demo</h3><ul style="margin:2mm 0 0 4.5mm"><li>Log it in the pipeline tracker with their main pain, in their words.</li><li>Note any feature request, and pass it to the product team.</li></ul>'''
open('02-Demo-Script.html','w').write(doc("Bod App — Demo script",[lightpage(1,3,D,p1),lightpage(2,3,D,p2),lightpage(3,3,D,p3)]))

# ---------------- OBJECTIONS ----------------
O="OBJECTION HANDLING"
obj=[
("“We already use WhatsApp.”","It works, why change?","Keep WhatsApp for talking. Bod App gives the work a home, and you can copy nudges and standups straight into WhatsApp.","Ask how they find an old brief today."),
("“We tried a project tool. Nobody used it.”","They've been burned before.","Most tools need people to update them. Bod App does the updating: it sorts the day, drafts follow-ups and writes the standup.","Offer the free month so the team decides."),
("“My team won't update another app.”","Admin fatigue.","That's the point. Tasks can be spoken in, status is one tap, and the app writes the summaries.","Let one of them try voice to task live."),
("“We don't have time to set it up.”","Setup feels like a project.","We set it up with you: team, clients, colours and pipeline. Start with this week's tasks only.","Book a 30-minute setup call."),
("“It's too expensive.”","Not sure it pays back.","Put it next to the time lost to chasing and status updates. The time-saved calculator shows it in rupees.","Fill the calculator with their numbers."),
("“We're too small for this.”","Tools feel built for big teams.","It was built for our own studio. Small teams feel the admin most, because the same people do the work and chase it.","Point to the Basic plan and the free month."),
("“Is our client data safe?”","Trust and confidentiality.","The app runs on Google's Firebase cloud, with roles that control who sees what. We'll walk your team through it.","Confirm details with the product team before promising more."),
("“Does it replace Zoho or our invoicing?”","Worried about accounting changes.","No. It tells Finance what's ready to bill. Amounts and invoices stay in Zoho.","Show the Ready to bill list."),
("“Will the AI understand us?”","Language and accents.","It takes voice or text in English, Malayalam and Manglish, and fills in who, what and when.","Let them say a task their own way."),
("“The mascot feels a bit playful.”","Worried it isn't serious.","Bod Annan shows up for small moments, like a weekly win. The rest of the app is calm and focused.","Show the Focus Queue, which is all business."),
("“Can it fit our workflow?”","Every studio works differently.","Pipeline stages, categories, roles, colours and logo can all be set up to match how you work.","Ask them to describe their stages, then map them."),
("“What if it doesn't work out?”","Fear of lock-in.","Start with the free month. If it doesn't earn its place, you walk away.","Confirm current contract terms before quoting them."),
]
rs=[[f'<b>{a}</b>',f'<span class="pm">{b}</span>',f'<span class="say">{c}</span>',d] for a,b,c,d in obj]
q1='<div class="label limeD">Quick answers</div><h1 style="margin-top:3mm;font-size:30pt">What they say, and what to say back.</h1><p class="pm" style="margin-top:3mm">Listen first. Agree with the feeling, then answer in one or two sentences. Never argue.</p><div style="margin-top:6mm">'+rows(rs[:6],[("They say","22%"),("What they mean","18%"),("Say","38%"),("Then","22%")])+'</div>'
q2='<div style="margin-top:0">'+rows(rs[6:],[("They say","22%"),("What they mean","18%"),("Say","38%"),("Then","22%")])+'</div><div class="pcard" style="margin-top:8mm"><h3>Three rules</h3><ul style="margin:2mm 0 0 4.5mm"><li>If you don\'t know, say so and follow up the same day.</li><li>Don\'t promise features, dates or terms that aren\'t confirmed.</li><li>Turn every objection into a try: “Want to see it with your own task?”</li></ul></div>'
open('03-Objection-Handling.html','w').write(doc("Bod App — Objection handling",[lightpage(1,2,O,q1),lightpage(2,2,O,q2)]))

# ---------------- ONBOARDING KIT ----------------
K="FREE-MONTH ONBOARDING KIT"
k1=f'''<div class="label limeD">For the first 30 days</div><h1 style="margin-top:3mm">Make the free month count.</h1>
<p class="lead pm" style="margin-top:4mm;max-width:155mm">Everything the sales and setup team needs to take a new studio from “yes” to a team that uses Bod App every day, and a clear decision at the end of the month.</p>
<h2 style="margin-top:9mm">1. Welcome message</h2><p class="note" style="margin-top:1mm">Send on WhatsApp the same day they say yes. Edit the names.</p>
<div class="pcard" style="margin-top:3mm"><p>Hi [Name], welcome to Bod App! 👋<br><br>Your free month starts today, for up to 3 people. We'll set everything up with you on a short call, so you don't have to figure anything out alone.<br><br>Before the call, could you send us:<br>• the names and roles of the people joining<br>• your main clients (and their brand colours, if you like)<br>• your logo<br><br>Talk soon,<br>[Your name], Bod Studio</p></div>
<h2 style="margin-top:8mm">2. Setup call checklist</h2><p class="note" style="margin-top:1mm">30 minutes. Share your screen and set it up together.</p>
{rows([["Workspace","Studio name, logo and accent colour. Light or dark theme."],["People","Up to 3 people for the free month, with roles (admin, PM, team, finance)."],["Clients","Their main clients, each with its own colour."],["Pipeline","Their stages, mapped from how they work today."],["First tasks","Add this week's real tasks. Try one by voice together."],["Next date","Book the day-7 check-in before you hang up."]],[("Area","22%"),("What to set up","78%")])}'''
k2=f'''<h2>3. The month, week by week</h2>
{rows([["Week 1","Get everyone in","Everyone logs in and adds their own tasks. PM approves the first requests.","Day-7 check-in: what's working, what's confusing?"],["Week 2","Make it daily","Team works from Focus. Try voice to task and task chat instead of WhatsApp for work.","Send a short tip each morning on WhatsApp."],["Week 3","Let it do the chasing","Turn on follow-up nudges and the standup. Finance starts using Ready to bill.","Ask the PM how many follow-ups they wrote themselves."],["Week 4","Read the results","Look at the weekly wins and analytics together.","Book the day-30 review call."]],[("When","12%"),("Goal","18%"),("What the team does","42%"),("What we do","28%")])}
<h2 style="margin-top:9mm">4. Day-30 review call</h2><p class="note" style="margin-top:1mm">20 minutes. Their numbers, their decision.</p>
<div class="grid2" style="margin-top:3mm"><div class="pcard"><h3>Ask</h3><ul style="margin:2mm 0 0 4.5mm"><li>What would your team miss if we switched it off tomorrow?</li><li>How many status messages and follow-ups did you stop writing?</li><li>Did anything delivered go unbilled this month?</li><li>What still feels clunky?</li></ul></div>
<div class="pcard"><h3>Show</h3><ul style="margin:2mm 0 0 4.5mm"><li>The weekly wins from all four weeks.</li><li>Tasks completed and turnaround in analytics.</li><li>The plan that fits their team size, and the monthly total.</li></ul></div></div>
<h2 style="margin-top:8mm">5. After the call</h2>
<div class="pcard" style="margin-top:3mm"><p>Hi [Name], thanks for the review today. Here's the plan we talked about: [Plan], [number] people, ₹[amount] a month. Reply “yes” and we'll switch it on, with nothing to set up again. If you'd rather not continue, that's completely fine, and thank you for trying it.</p></div>'''
open('06-Onboarding-Kit.html','w').write(doc("Bod App — Onboarding kit",[lightpage(1,2,K,k1),lightpage(2,2,K,k2)]))
