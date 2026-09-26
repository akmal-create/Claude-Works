from common import *
plans=[("Basic","₹199","Small teams finding their rhythm.","The essentials",["Full task pipeline and boards","Focus Queue and task vibes","Client colours","iOS, Android and web"]),
("Advanced","₹299","Growing agencies with many clients.","Everything we use at Storibod",["Everything in Basic, plus:","AI capture: voice, notes, PDF","Approvals and requests","Follow-up nudges, standup, weekly wins","Ready to bill and analytics"]),
("Premium","₹499","Studios that want it built around them.","Set up with you",["Everything in Advanced, plus:","Your own pipeline, categories and roles","Zoho and Google Sheets sync","Advanced role controls","Onboarding and priority support"])]
def card(p,hi):
    n,price,who,tag,items=p
    bg='var(--lime)' if hi else 'var(--surface)'; fg='var(--ink)' if hi else 'var(--white)'; mu='#3A4A10' if hi else 'var(--muted)'
    li=''.join(f'<li style="list-style:none;display:flex;gap:2.5mm;margin-top:2mm;font-size:9.5pt;{"font-weight:700;" if i.endswith("plus:") else ""}"><span style="color:{"var(--ink)" if hi else "var(--lime)"};font-weight:800">{"" if i.endswith("plus:") else "✓"}</span>{i}</li>' for i in items)
    return f'''<div style="flex:1;background:{bg};color:{fg};border-radius:4mm;padding:6mm;{"" if hi else "border:1px solid var(--line)"}">
<div class="label" style="color:{"var(--ink)" if hi else "var(--lime)"}">{n}</div>
<div style="font-family:Epilogue;font-weight:700;font-size:28pt;margin-top:3mm">{price}</div>
<div style="font-size:8.5pt;color:{mu}">per person, per month</div>
<div style="font-weight:700;font-size:10.5pt;margin-top:4mm">{who}</div><div style="font-size:9pt;color:{mu}">{tag}</div>
<div style="height:1px;background:{"rgba(11,13,12,.2)" if hi else "var(--line)"};margin:4mm 0 1mm"></div><ul>{li}</ul></div>'''
html=doc("Bod App — Pricing",[f'''<section class="page dark">
<div class="draft" style="color:#FF8A6A">FIRST DRAFT · FOR REVIEW</div>
<div class="brand">{TILE}<span class="label muted">Bod App pricing</span></div>
<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:12mm">
 <div><h1>Simple plans,<br>per person.</h1><p class="lead muted" style="margin-top:4mm">Start with a month free. Pick a plan when you're sure.</p></div>
 <div style="position:relative;width:52mm;height:52mm"><img src="annan_celebrating.png" style="position:absolute;right:0;bottom:0;height:34mm"><div class="bubble" style="position:absolute;right:6mm;top:0;--tx:60%;white-space:nowrap">Bring the team.</div></div>
</div>
<div style="margin-top:8mm;background:var(--s2);border:1px solid var(--lime);border-radius:4mm;padding:5mm 6mm;display:flex;justify-content:space-between;align-items:center">
 <div><div class="label lime">Free month</div><div style="font-family:Epilogue;font-weight:700;font-size:15pt;margin-top:1.5mm">Your first month is on us.</div></div>
 <div style="font-size:10pt;text-align:right">Up to 3 people · Basic setup · No card<br><span class="muted">We set it up with you on a short call.</span></div></div>
<div style="display:flex;gap:4mm;margin-top:6mm">{card(plans[0],0)}{card(plans[1],1)}{card(plans[2],0)}</div>
<div class="grid3" style="margin-top:7mm;gap:4mm">
 <div><div class="label lime">Billing</div><p class="muted" style="font-size:9pt;margin-top:1.5mm">Prices are per person, per month. Talk to us about annual billing and larger teams.</p></div>
 <div><div class="label lime">Taxes</div><p class="muted" style="font-size:9pt;margin-top:1.5mm">Prices exclude GST. [Confirm GST treatment before sending.]</p></div>
 <div><div class="label lime">Setup</div><p class="muted" style="font-size:9pt;margin-top:1.5mm">Every plan starts with a setup call. Premium is configured fully around your workflow.</p></div>
</div>
<div class="foot" style="bottom:10mm"><span style="font-size:8.6pt;font-weight:700;white-space:nowrap">{CONTACT}</span><span class="label dim" style="font-size:7pt;white-space:nowrap">Powered by Bod Studio</span></div>
</section>'''])
open('04-Pricing-Sheet.html','w').write(html)
