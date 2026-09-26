MONO='<svg viewBox="10 10 100 100" fill="#0B0D0C" fill-rule="evenodd"><path d="M20 31a9 9 0 019-9h16a9 9 0 019 9v58a9 9 0 01-9 9H29a9 9 0 01-9-9V31zM31 33h13a1 1 0 011 1v18a1 1 0 01-1 1H31a1 1 0 01-1-1V34a1 1 0 011-1zM31 66h13a1 1 0 011 1v18a1 1 0 01-1 1H31a1 1 0 01-1-1V67a1 1 0 011-1z"/><path d="M79 23a18 18 0 100 36a18 18 0 000-36zM77 33h4v6h6v4h-6v6h-4v-6h-6v-4h6z"/><path d="M63 62h15a18 18 0 010 36H63a1 1 0 01-1-1V63a1 1 0 011-1zM73 72h4a8 8 0 010 16h-4a1 1 0 01-1-1V73a1 1 0 011-1z"/></svg>'
TILE=f'<span class="tile">{MONO}</span>'
CONTACT='bodstudio.com &nbsp;·&nbsp; +91 7356 333 965 &nbsp;·&nbsp; info@storibodcreatives.com &nbsp;·&nbsp; @storibodstudio'
def doc(title, pages):
    return f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><link rel="stylesheet" href="base.css"></head><body>{"".join(pages)}</body></html>'
def lightpage(n, total, doc_name, inner, draft=True):
    return f'''<section class="page light">{'<div class="draft">FIRST DRAFT · FOR REVIEW</div>' if draft else ''}
<div class="brand" style="margin-bottom:9mm">{TILE}<div><div style="font-family:Epilogue;font-weight:700;font-size:13pt">Bod App</div><div class="label pm" style="font-size:7pt">{doc_name}</div></div></div>
{inner}
<div class="foot"><span class="label pm" style="font-size:7pt">BOD APP · POWERED BY BOD STUDIO</span><span class="label pm" style="font-size:7pt">{n:02d} / {total:02d}</span></div></section>'''
