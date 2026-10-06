document.documentElement.classList.add('js');
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
document.body.classList.remove('leaving');
addEventListener('pageshow',()=>document.body.classList.remove('leaving'));
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||a.target||e.metaKey||e.ctrlKey||a.origin!==location.origin||a.pathname===location.pathname||calm)return;e.preventDefault();document.body.classList.add('leaving');setTimeout(()=>location.href=a.href,220)});

/* Titre : apparition mot par mot */
document.querySelectorAll('.split').forEach(h=>{if(calm)return;let i=0;const walk=n=>[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))f.append(t);else{const s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=t;f.append(s)}});c.replaceWith(f)}else walk(c)});walk(h)});

/* Apparition au défilement, échelonnée par groupe */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;el.classList.add('in-view');io.unobserve(el);setTimeout(()=>el.classList.remove('rv','in-view'),1500+(+el.dataset.n||0)*90)}),{threshold:.15});
const cnt=new Map();document.querySelectorAll('.rv').forEach(el=>{const n=cnt.get(el.parentElement)||0;cnt.set(el.parentElement,n+1);el.dataset.n=n;el.style.setProperty('--d',n*.09+'s');io.observe(el)});

/* Braises dorées + halo qui suit le pointeur */
document.querySelectorAll('[data-fx]').forEach(host=>{
const c=host.querySelector('.fx'),x=c.getContext('2d'),light=host.dataset.fx==='light',col=light?'108,59,154':'212,175,106';
host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;host.style.setProperty('--mx',mx+'px');host.style.setProperty('--my',my+'px')});
host.addEventListener('pointerleave',()=>mx=my=-999);
if(calm)return;
let w,h,P=[],mx=-999,my=-999,raf=0;const dpr=Math.min(devicePixelRatio||1,2);
const mk=init=>({x:Math.random()*w,y:init?Math.random()*h:h+10,r:Math.random()*1.8+.6,v:Math.random()*.35+.15,s:Math.random()*6.28,a:Math.random()*.5+.3});
const size=()=>{const r=host.getBoundingClientRect();w=r.width;h=r.height;c.width=w*dpr;c.height=h*dpr;x.setTransform(dpr,0,0,dpr,0,0);P=Array.from({length:Math.min(70,Math.round(w*h/(innerWidth<700?14000:11000)))},()=>mk(true))};
const frame=()=>{x.clearRect(0,0,w,h);
for(const p of P){p.y-=p.v;p.s+=.012;p.x+=Math.sin(p.s)*.25;const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);if(d<120){p.x+=dx/d*(120-d)*.02;p.y+=dy/d*(120-d)*.02}
if(p.y<-10)Object.assign(p,mk(false));
x.shadowBlur=light?0:8;x.shadowColor=`rgba(${col},.8)`;x.fillStyle=`rgba(${col},${p.a*(.6+.4*Math.sin(p.s*2))})`;x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill()}
x.shadowBlur=0;x.lineWidth=.6;
for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<95){x.strokeStyle=`rgba(${col},${(1-d/95)*.2})`;x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.stroke()}}
raf=requestAnimationFrame(frame)};
new ResizeObserver(size).observe(host);
new IntersectionObserver(([e])=>{cancelAnimationFrame(raf);if(e.isIntersecting)raf=requestAnimationFrame(frame)}).observe(host)});

/* Inclinaison douce des cartes équipe */
if(!calm&&matchMedia('(hover:hover)').matches)document.querySelectorAll('[data-tilt]').forEach(el=>{
el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(800px) rotateY(${px*8}deg) rotateX(${-py*8}deg) translateY(-4px)`});
el.addEventListener('pointerleave',()=>el.style.transform='')});

const burger=document.querySelector('.burger'),nav=document.querySelector('.nav');
burger?.addEventListener('click',()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.querySelector('i').className=o?'fa-solid fa-xmark':'fa-solid fa-bars'});

/* Point d'intégration : remplacer par un fetch vers votre endpoint PHP (mail ou MySQL) */
function sendMessage(data){return new Promise(res=>setTimeout(()=>res({ok:true}),900))}

const form=document.getElementById('contact-form');
if(form){
const rules={
nom:v=>v.trim().length>=2||'Indiquez votre nom (2 caractères minimum).',
email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||'Saisissez une adresse e-mail valide, par exemple nom@domaine.com.',
sujet:v=>!!v||'Choisissez le sujet de votre message.',
message:v=>v.trim().length>=15||'Votre message doit contenir au moins 15 caractères.'};
const check=el=>{const box=el.closest('.f'),r=rules[el.name](el.value);box.classList.toggle('bad',r!==true);box.classList.toggle('ok',r===true);box.querySelector('.err').textContent=r===true?'':r;return r===true};
form.querySelectorAll('input,select,textarea').forEach(el=>{el.addEventListener('blur',()=>check(el));el.addEventListener('input',()=>el.closest('.f').classList.contains('bad')&&check(el))});
form.addEventListener('submit',async e=>{e.preventDefault();
const els=[...form.querySelectorAll('input,select,textarea')],valid=els.map(check).every(Boolean);
if(!valid){els.find(el=>el.closest('.f').classList.contains('bad')).focus();return}
const b=form.querySelector('button');b.disabled=true;b.innerHTML='<i class="fa-solid fa-circle-notch fa-spin"></i> Envoi en cours';
try{await sendMessage(Object.fromEntries(new FormData(form)));form.classList.add('sent')}
catch{b.disabled=false;b.innerHTML='<i class="fa-solid fa-paper-plane"></i> Réessayer';alert("L'envoi a échoué. Vérifiez votre connexion et réessayez.")}})}
