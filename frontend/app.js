(function(){
var $=function(s){return document.querySelector(s)},LS=window.localStorage,pgs=document.querySelectorAll('.pg');
function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
/* menu */
var mb=$('.mb'),nv=$('#nv');
if(mb)mb.onclick=function(){var o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
if(nv)nv.addEventListener('click',function(e){if(e.target.closest('a,button')){nv.classList.remove('open');mb.setAttribute('aria-expanded',false)}});
/* budget */
function tot(){var s=0;document.querySelectorAll('.bi input:checked').forEach(function(i){s+=+i.dataset.p});var e=$('#tot');if(e)e.textContent='\u20b9'+s.toLocaleString('en-IN')}
document.addEventListener('change',tot);
/* preview router (only when all pages are in one file) */
function route(){var k=location.hash.replace('#/','').replace(/\/$/,'')||'home',f=0;pgs.forEach(function(p){var on=p.dataset.s==k;p.hidden=!on;if(on){f=1;document.title=p.dataset.t}});if(!f){pgs[0].hidden=false;k='home';document.title=pgs[0].dataset.t}
document.querySelectorAll('#nv a').forEach(function(a){a.toggleAttribute('aria-current',a.getAttribute('href')=='#/'+k)});document.body.classList.toggle('hm',k=='home');scrollTo(0,0);tot()}
if(pgs.length){addEventListener('hashchange',route);route()}else{tot();document.body.classList.toggle('hm',!!$('.hero'))}
/* accounts: uses the backend when config.js sets BB_API, otherwise browser-only demo mode */
var API=(window.BB_API||'').replace(/\/$/,'');
function gt(k){try{return LS.getItem(k)}catch(e){return null}}
function ap(p,b){return fetch(API+p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(function(r){return r.json().catch(function(){return{}}).then(function(d){if(!r.ok)throw new Error(d.error||'Something went wrong. Try again.');return d})},function(){throw new Error('Cannot reach the server. Check your connection and try again.')})}
function ok(d){sv('bbt',d.token);sv('bbn',d.name);auth();to('')}
function gu(){try{return JSON.parse(LS.getItem('bbu')||'{}')}catch(e){return{}}}
function sv(k,v){try{v==null?LS.removeItem(k):LS.setItem(k,v)}catch(e){}}
function cur(){try{return LS.getItem('bbs')}catch(e){return null}}
function sha(t){if(window.crypto&&crypto.subtle&&window.TextEncoder)return crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')});var h=5381;for(var i=0;i<t.length;i++)h=(h*33)^t.charCodeAt(i);return Promise.resolve('x'+(h>>>0).toString(16))}
function lk(s){return pgs.length?'#/'+s:'/'+s+'/'}
function to(s){if(pgs.length)location.hash='#/'+s;else location.href=s?'/'+s+'/':'/'}
function er(m){var e=$('#er');if(e)e.textContent=m}
function auth(){var u=API?(gt('bbt')?{name:gt('bbn')||'there'}:null):gu()[cur()],h=u?'<span class="hi">Hi, '+esc(u.name.split(' ')[0])+'</span><button class="lo" type="button">Log out</button>':'<a class="lg" href="'+lk('login')+'">Log in</a><a class="btn sm" href="'+lk('signup')+'">Sign up<i>\u273f</i></a>';['#au','#mau'].forEach(function(s){var n=$(s);if(n)n.innerHTML=h})}
auth();
document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
if(b.classList.contains('lo')){sv('bbs',null);sv('bbt',null);sv('bbn',null);auth();to('');return}
if(b.id=='li'){var m=$('#le').value.trim().toLowerCase(),p=$('#lp').value,u=gu()[m];if(!m||!p)return er('Enter your email and password.');if(API){er('Signing in... (the server may need up to a minute to wake up)');ap('/api/login',{email:m,password:p}).then(ok).catch(function(x){er(x.message)});return}if(!u)return er('No account found for that email. Create one first.');sha(u.s+p).then(function(h){if(h!==u.h)return er('Wrong password. Try again.');sv('bbs',m);auth();to('')})}
if(b.id=='ss'){var n=$('#sn').value.trim(),m2=$('#se').value.trim().toLowerCase(),p1=$('#sp').value;
if(n.length<2)return er('Enter your name.');if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m2))return er('Enter a valid email address.');if(p1.length<8)return er('Password must be at least 8 characters.');if(p1!==$('#sc').value)return er('Passwords do not match.');if(!$('#st').checked)return er('Please accept the privacy policy.');
if(API){er('Creating your account... (the server may need up to a minute to wake up)');ap('/api/signup',{name:n,email:m2,password:p1}).then(ok).catch(function(x){er(x.message)});return}var us=gu();if(us[m2])return er('An account with this email already exists. Log in instead.');var s=Math.random().toString(36).slice(2);sha(s+p1).then(function(h){us[m2]={name:n,s:s,h:h};try{LS.setItem('bbu',JSON.stringify(us))}catch(x){}sv('bbs',m2);auth();to('')})}
if(b.id=='cs')location.href='mailto:e23cseu2089@bennett.edu.in?subject='+encodeURIComponent('Balcony Bloom message from '+$('#cn').value)+'&body='+encodeURIComponent($('#cm').value)});
document.addEventListener('keydown',function(e){if(e.key=='Enter'&&e.target.closest&&e.target.closest('.authbox')){var b=$('.authbox .btn');if(b)b.click()}});
/* search */
var SP=[['Start a balcony garden','start-balcony-garden','start begin setup pots soil steps'],['Plants by sunlight','plants-by-sunlight','plants sun shade light flowers'],['Vegetables for pots','vegetables-balcony-india','vegetables tomato chilli herbs mint spinach'],['Seasonal plants','seasonal-balcony-plants','season summer monsoon winter calendar'],['Watering and care','balcony-plant-watering','water care drainage problems'],['Budget calculator','balcony-garden-budget','budget cost price calculator'],['About','about','about team minitech'],['Contact','contact','contact email message']];
var sq=$('#sq'),sr=$('#sr');
function sf(){var q=sq.value.trim().toLowerCase();if(!q){sr.hidden=true;return[]}var m=SP.filter(function(p){return(p[0]+' '+p[2]).toLowerCase().indexOf(q)>-1});sr.innerHTML=m.length?m.map(function(p){return'<a href="'+lk(p[1])+'">'+p[0]+'</a>'}).join(''):'<a href="'+lk('start-balcony-garden')+'">No match. Try the Start guide</a>';sr.hidden=false;return m}
if(sq){sq.addEventListener('input',sf);sq.addEventListener('keydown',function(e){if(e.key=='Enter'){var m=sf();if(m.length)to(m[0][1])}});document.addEventListener('click',function(e){if(!e.target.closest('.sw'))sr.hidden=true});sr.addEventListener('click',function(){sr.hidden=true;sq.value=''})}
/* hanging pot tilt */
var pt=$('.pot svg');if(pt&&!matchMedia('(prefers-reduced-motion:reduce)').matches)addEventListener('pointermove',function(e){pt.style.setProperty('--ry',((e.clientX/innerWidth-.5)*50)+'deg');pt.style.setProperty('--rx',(-(e.clientY/innerHeight-.5)*28)+'deg')});
/* floating 3D flowers, kept to the right side of the page */
var cv=$('#gl');if(!cv)return;
function gl(){
if(typeof THREE==='undefined')return;
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,dk=matchMedia('(prefers-color-scheme:dark)').matches,mob=innerWidth<1000,i;
var R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
var S=new THREE.Scene(),Cm=new THREE.PerspectiveCamera(55,1,.1,100);
S.add(new THREE.HemisphereLight(0xfff3ea,dk?0x3a2540:0xf2c9b9,dk?.95:1.05));var dl=new THREE.DirectionalLight(0xffe8d0,.7);dl.position.set(5,8,10);S.add(dl);
var pal=[0xf28fb1,0xd94f7d,0xf8b48a,0xf6d672,0xb9a2e6,0xd3b6ef,0xfff3ea,0xe8739b],mc={};
function mat(c){return mc[c]||(mc[c]=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.12,roughness:.5}))}
var pg=new THREE.SphereGeometry(.5,16,12);pg.scale(.5,1.1,.14);pg.translate(0,.6,0);
function flower(cols,n,sc){var g=new THREE.Group();for(var k=0;k<2;k++)for(var q=0;q<n;q++){var pv=new THREE.Object3D();pv.rotation.z=q/n*6.283+k*3.1/n;var p=new THREE.Mesh(pg,mat(cols[(q+k)%cols.length]));p.rotation.x=.4+k*.35;p.scale.setScalar(1-k*.25);pv.add(p);g.add(pv)}
var c=new THREE.Mesh(new THREE.SphereGeometry(.28,14,10),new THREE.MeshStandardMaterial({color:0xe3a53c,emissive:0x8a4a10,emissiveIntensity:.25,roughness:.6}));c.position.z=.1;g.add(c);g.scale.setScalar(sc);return g}
/* hero flower with a soft glow */
var hero=flower(pal,10,2.7);S.add(hero);
/* a modest number of flowers, spread down the page */
var F=[],nF=mob?4:6,spots=[[12,3,-3,.5],[4.6,4.6,-4,.42],[12.6,-3.4,-2,.5],[3.4,-3.6,-4,.36]];
for(i=0;i<nF+4;i++){var s=i<4?spots[i]:[mob?(Math.random()-.5)*15:3+Math.random()*10.5,-6-(i-4)*(24/nF)+Math.random()*1.5,-6+Math.random()*7,.38+Math.random()*.42];
var f=flower([pal[i%8],pal[(i*3+2)%8]],5+i%4,s[3]);f.position.set(s[0],s[1],s[2]);f.rotation.set(Math.random()*3,Math.random()*3,0);f.userData={s:.2+Math.random()*.4,o:Math.random()*6,y:s[1]};S.add(f);F.push(f)}
/* leaves, butterflies, pollen */
var lg=new THREE.SphereGeometry(.5,12,8);lg.scale(.5,1.2,.08);var L=[],lc=[0x7fae6f,0x93bb7c,0x6a9d62];for(i=0;i<(mob?3:5);i++){var l=new THREE.Mesh(lg,mat(lc[i%3]));l.position.set(mob?(Math.random()-.5)*15:2+Math.random()*12,3-Math.random()*30,-5+Math.random()*7);l.userData={y:l.position.y,o:Math.random()*6};S.add(l);L.push(l)}
var N=mob?60:120,pa=new Float32Array(N*3),pc=new Float32Array(N*3),cc=new THREE.Color();for(i=0;i<N;i++){pa[i*3]=mob?(Math.random()-.5)*20:Math.random()*20-4;pa[i*3+1]=6-Math.random()*36;pa[i*3+2]=-8+Math.random()*14;cc.setHex(pal[i%8]);pc.set([cc.r,cc.g,cc.b],i*3)}
var pgm=new THREE.BufferGeometry();pgm.setAttribute('position',new THREE.BufferAttribute(pa,3));pgm.setAttribute('color',new THREE.BufferAttribute(pc,3));var pts=new THREE.Points(pgm,new THREE.PointsMaterial({size:.1,vertexColors:true,transparent:true,opacity:.8}));S.add(pts);
var mx=0,my=0,sy=0,bx=6;addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
function size(){var w=innerWidth,h=innerHeight;mob=w<1000;R.setSize(w,h,false);Cm.aspect=w/h;if(mob)Cm.clearViewOffset();else Cm.setViewOffset(w,h,-w*.2,0,w,h);Cm.position.z=14;bx=mob?0:6;Cm.updateProjectionMatrix();hero.position.set(mob?3.2:7.8,mob?-1.2:.4,mob?-4:-1);hero.scale.setScalar(mob?1.8:2.7)}
addEventListener('resize',size);size();var ck=new THREE.Clock();cv.classList.add('on');
(function tick(){if(document.hidden){requestAnimationFrame(tick);return}
var t=ck.getElapsedTime()*(reduce?.12:1),mxs=Math.max(1,document.documentElement.scrollHeight-innerHeight);sy+=((-scrollY/mxs*26)-sy)*.06;
Cm.position.set(bx+mx*.8,sy-my*.6,14);Cm.lookAt(bx+mx*.3,sy,0);
hero.rotation.set(my*.5,Math.sin(t*.5)*.5+mx*.7,t*.12);hero.position.y=(mob?-1.2:.4)+Math.sin(t)*.3;
F.forEach(function(f){var d=f.userData;f.rotation.x+=.008*d.s;f.rotation.y+=.016*d.s;f.position.y=d.y+Math.sin(t*d.s+d.o)*.5});
L.forEach(function(l){var d=l.userData;l.rotation.z=Math.sin(t*.6+d.o);l.rotation.x=t*.4+d.o;l.position.y=d.y+Math.sin(t*.4+d.o)*.5});
pts.rotation.y=t*.015;R.render(S,Cm);requestAnimationFrame(tick)})();
}
function go(){var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=gl;document.head.appendChild(s)}
addEventListener('load',function(){window.requestIdleCallback?requestIdleCallback(go,{timeout:2500}):setTimeout(go,1200)});
})();
