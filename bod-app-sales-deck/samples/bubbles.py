import json, sys
from PIL import ImageFont
FONT="/root/.fonts/Manrope-700.ttf"; PT=15; MAXW=2.7  # inches of text
f=ImageFont.truetype(FONT, PT*10)  # measure at 10x for precision
def w_in(t): return f.getlength(t)/10/72
def wrap(t):
    words=t.split(); lines=[]; cur=""
    for wd in words:
        nxt=(cur+" "+wd).strip()
        if w_in(nxt)<=MAXW or not cur: cur=nxt
        else: lines.append(cur); cur=wd
    lines.append(cur)
    # balance two lines
    if len(lines)==2:
        best=None; ws=t.split()
        for i in range(1,len(ws)):
            b=" ".join(ws[i:])
            m=max(w_in(" ".join(ws[:i])),w_in(b))
            if m<=MAXW and (best is None or m<best[0]): best=(m,[" ".join(ws[:i]),b])
        if best: lines=best[1]
    return lines
texts=json.load(open(sys.argv[1]))
out={}
for t in texts:
    L=wrap(t); out[t]={"lines":L,"w":max(w_in(l) for l in L)}
json.dump(out,open(sys.argv[2],"w"),indent=1); print(json.dumps(out,indent=1))
