import numpy as np, sys
from PIL import Image, ImageDraw, ImageFilter
def region(frame):
    a=np.array(frame)[:,:,3]
    b=Image.fromarray(((a<40)*255).astype('uint8')).convert('RGB')
    w,h=b.size; ImageDraw.floodfill(b,(w//2,h//2),(255,0,0))
    r=np.array(b); return (r[:,:,0]==255)&(r[:,:,1]==0)
def fitline(pts):  # pts Nx2, returns (point, dir)
    pts=np.array(pts,float); c=pts.mean(0); u,s,vt=np.linalg.svd(pts-c); return c,vt[0]
def inter(l1,l2):
    (p,d),(q,e)=l1,l2; A=np.array([d,-e]).T; t=np.linalg.solve(A,q-p); return p+t[0]*d
def corners(m):
    ys,xs=np.nonzero(m); y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
    H=y1-y0; W=x1-x0
    top=[];bot=[];lef=[];rig=[]
    for x in range(int(x0+W*.25),int(x1-W*.25),3):
        col=np.nonzero(m[:,x])[0]
        if len(col): top.append((x,col.min())); bot.append((x,col.max()))
    for y in range(int(y0+H*.2),int(y1-H*.2),3):
        row=np.nonzero(m[y])[0]
        if len(row): lef.append((row.min(),y)); rig.append((row.max(),y))
    T,B,L,R=fitline(top),fitline(bot),fitline(lef),fitline(rig)
    return [inter(T,L),inter(T,R),inter(B,R),inter(B,L)]  # tl,tr,br,bl
def coeffs(dst,src):
    A=[];b=[]
    for (x,y),(u,v) in zip(dst,src):
        A.append([x,y,1,0,0,0,-u*x,-u*y]); b.append(u)
        A.append([0,0,0,x,y,1,-v*x,-v*y]); b.append(v)
    return np.linalg.solve(np.array(A,float),np.array(b,float))
def compose(frame_path, screen_path, out, crop=True):
    fr=Image.open(frame_path).convert('RGBA'); m=region(fr)
    c=corners(m)
    sc=Image.open(screen_path).convert('RGBA')
    # target aspect from quad
    wq=(np.linalg.norm(c[1]-c[0])+np.linalg.norm(c[2]-c[3]))/2; hq=(np.linalg.norm(c[3]-c[0])+np.linalg.norm(c[2]-c[1]))/2
    ar=wq/hq; sw,sh=sc.size
    if 0.002<abs(sw/sh-ar)<0.01:  # near-frontal: crop to match aspect (never stretch)
        if sw/sh>ar: nw=round(sh*ar); sc=sc.crop(((sw-nw)//2,0,(sw-nw)//2+nw,sh))
        else: nh=round(sw/ar); sc=sc.crop((0,0,sw,nh))  # keep top
    sw,sh=sc.size
    src=[(0,0),(sw,0),(sw,sh),(0,sh)]
    k=coeffs([tuple(p) for p in c],src)
    warped=sc.transform(fr.size,Image.PERSPECTIVE,tuple(k),Image.BICUBIC)
    mask=Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.MaxFilter(5))
    base=Image.new('RGBA',fr.size,(0,0,0,0)); base.paste(warped,(0,0),mask)
    base.alpha_composite(fr)
    bb=base.getbbox(); base=base.crop(bb); base.save(out)
    print(out, base.size, 'quad aspect %.4f'%ar, 'screen aspect %.4f'%(sw/sh))
if __name__=='__main__':
    compose(*sys.argv[1:4])
