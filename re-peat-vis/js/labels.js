// Floating text labels per scene and the virtual monitoring wells (pins).

import {K,CSS_CLASS} from './config.js';
import {fmt} from './utils.js';
import {scene,clipList,camera} from './renderer.js';
import {kompStrategy,s0,surfNG,surfaceY,st,burns,C2,cpt,wtdAt,classOf} from './model.js';
import {gate,pumps} from './structures.js';
import {app} from './app.js';
import {kompartemen} from './water.js';
import {t,onLang} from './i18n.js';

const labelBox=document.getElementById('labels');const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const labels=[
  {t:'lbl.dome',sc:[0],pos:()=>V(10,s0(10,10)+7,10)},
  {t:'lbl.komp',v:{n:1},k:0,sc:[0,3,5],when:()=>kompartemen.visible,pos:()=>V(-70,s0(-70,50)+3,50)},
  {t:'lbl.komp',v:{n:2},k:1,sc:[0,3,5],when:()=>kompartemen.visible,pos:()=>V(35,s0(35,45)+3,45)},
  {t:'lbl.komp',v:{n:3},k:2,sc:[0,3,5],when:()=>kompartemen.visible,pos:()=>V(-45,s0(-45,-50)+3,-50)},
  {t:'lbl.komp',v:{n:4},k:3,sc:[0,3,5],when:()=>kompartemen.visible,pos:()=>V(55,s0(55,-40)+3,-40)},
  {t:'lbl.canal',sc:[0,1],pos:()=>st.cut>-100?V(st.cut+4,surfNG(st.cut+4,0)+2.5,0):V(-30,s0(-30,0)+2.5,0)},
  {t:'lbl.wt',sc:[0,1],prof:true,pos:()=>{const z=-45,w=wtdAt(st.cut,z);return V(st.cut,surfNG(st.cut,z)-w*K.VE-0.6,z);}},
  {t:'lbl.limit',sc:[0,1,2],prof:true,pos:()=>V(st.cut,surfNG(st.cut,50)-0.4*K.VE-0.5,50)},
  {t:'lbl.burnt',sc:[1],pos:()=>V(burns[0].x+6,s0(burns[0].x,burns[0].z)+5,burns[0].z)},
  {t:'lbl.block',sc:[2],when:()=>st.pB>0.5,pos:()=>{const b=C2.blocks[6];return V(b.x,b.yFinal+3,b.z);}},
  {t:'lbl.reach',sc:[2],prof:true,when:()=>st.pB>0.3,pos:()=>V(st.cut,surfNG(st.cut,4)+5.2,K.W+4)},
  {t:'lbl.reachBurnt',sc:[2],when:()=>st.pB>0.6,pos:()=>V(burns[0].x+4,s0(burns[0].x,burns[0].z)+5,burns[0].z)},
  {t:'lbl.surplus',sc:[3],pos:()=>V(32,s0(32,0)+4,0)},
  {t:'lbl.gate',sc:[3],pos:()=>V(gate.position.x,gate.position.y+5,gate.position.z)},
  {t:'lbl.deficit',sc:[3],pos:()=>V(10,s0(10,-50)+4,-50)},
  {t:'lbl.canalDry',sc:[4],when:()=>st.dry>0.6&&st.pump<0.25,pos:()=>V(-20,s0(-20,0)+3,0)},
  {t:'lbl.pumpRiver',sc:[4],pos:()=>V(pumps[0].x,pumps[0].y+3.5,pumps[0].z)},
  {t:'lbl.pumpBoost',sc:[4],pos:()=>V(pumps[1].x+2,pumps[1].y+3.5,pumps[1].z)},
  {t:'lbl.speed',sc:[4],when:()=>st.pump>0.05&&st.pump<0.97,pos:()=>{const q=cpt(C2,C2.L*st.pump);return V(q[0]-3,s0(q[0],q[1])+4,q[1]);}},
  {t:'lbl.bore',sc:[5],when:()=>st.strat>0.6,pos:()=>V(-44,s0(-44,40)+4,40)},
  {t:'lbl.remain',sc:[5],when:()=>st.strat>0.6,pos:()=>V(21,s0(21,-48)+5,-48)}
];
labels.forEach(l=>{l.el=document.createElement('div');l.el.className='lbl';labelBox.appendChild(l.el);});
const lblText=l=>t(l.t,l.v);
function retext(){labels.forEach(l=>l.el.textContent=lblText(l));}
retext();onLang(retext);
const pins=[];
const pinMat=new THREE.MeshStandardMaterial({color:0xF4F1E6,roughness:.6,clippingPlanes:clipList});
const PIN_COL=[0x2F7FB5,0x7E5BA8,0x9C6B3C];
function addPin(x,z){if(pins.length>=3){const o=pins.shift();scene.remove(o.g);o.el.remove();}
  const g=new THREE.Group();const y=surfaceY(x,z);const post=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,4,6),pinMat);post.position.y=2;
  const cap=new THREE.Mesh(new THREE.SphereGeometry(0.6,8,6),new THREE.MeshBasicMaterial({color:PIN_COL[pins.length]}));cap.position.y=4.2;g.add(post,cap);g.position.set(x,y,z);scene.add(g);
  const el=document.createElement('div');el.className='lbl pin on';labelBox.appendChild(el);pins.push({g,x,z,y,el,cap,hist:[]});
  document.getElementById('clearPins').hidden=false;}
document.getElementById('clearPins').onclick=()=>{pins.forEach(p=>{scene.remove(p.g);p.el.remove();});pins.length=0;document.getElementById('clearPins').hidden=true;};
const pv=new THREE.Vector3();
function place(el,p,w,h,dy){pv.copy(p).project(camera);if(pv.z>1)return false;el.style.transform=`translate(${(pv.x*.5+.5)*w}px,${(-pv.y*.5+.5)*h}px) translate(-50%,${dy||-120}%)`;return true;}
function updateLabels(w,h){
  labels.forEach(l=>{let on=app.mode==='story'&&l.sc.includes(app.sceneIdx)&&(!l.when||l.when());
    if(on&&l.prof&&st.cut<=-100)on=false;
    if(on){const p=l.pos();if(!l.prof&&st.cut>-100&&p.x<st.cut-0.5)on=false;if(on)on=place(l.el,p,w,h);}
    if(on&&l.k!==undefined)l.el.textContent=app.sceneIdx===5&&st.strat>0.6?lblText(l)+': '+t('act.'+kompStrategy()[l.k]):lblText(l);
    l.el.classList.toggle('on',on);});
  pins.forEach((p,i)=>{const wv=wtdAt(p.x,p.z);const c=classOf(wv);p.el.style.borderLeftColor=CSS_CLASS[c];
    p.el.textContent=t('well.pin',{n:i+1,w:fmt(wv,2)});p.cap.material.color.setHex(PIN_COL[i]);
    const vis=!(st.cut>-100&&p.x<st.cut)&&app.mode!=='intro';p.el.classList.toggle('on',vis&&place(p.el,V(p.x,p.y+5.2,p.z),w,h));});}

export {updateLabels,addPin,pins,PIN_COL};
