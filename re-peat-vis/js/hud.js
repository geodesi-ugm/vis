// Per-frame HUD: KPI gauge, day text, comparison note and the hover tooltip.
import {$} from './dom.js';
import {K,CSS_CLASS} from './config.js';
import {t,loc} from './i18n.js';
import {fmt,pctTxt} from './utils.js';
import {st,nearest,isBurnt,wtdAt,classOf,allBlocks,donorGis} from './model.js';
import {canvas} from './renderer.js';
import {kpi} from './terrain.js';
import {app} from './app.js';
import {sb,CLIM,COST} from './sandbox.js';
import {cmpRes} from './story.js';
import {input} from './camera.js';
import {mouse} from './input.js';
import {pickTerrain} from './picking.js';

const tip=$('tip');let tipT=0;

function updateKpi(){
  const pc=Math.round(kpi.pct*100);$('kpiVal').textContent=app.mode==='intro'?'–':pc+'%';
  const g=$('kpiGauge');g.style.width=(app.mode==='intro'?0:pc)+'%';g.style.background=pc>=60?'var(--ok)':pc>=30?'var(--mod)':'var(--ext)';
  const day=Math.round(st.t);let dtxt='';
  if(app.mode==='story'){dtxt=app.sceneIdx===0?t('kd.start'):app.sceneIdx===4?t('kd.pump',{d:day,l:Math.round(3*4.9*72*st.pump).toLocaleString(loc())}):app.sceneIdx===6?t('kd.clim',{c:t(st.k<1?'clim.normal':'clim.el'),d:day}):t('kd.day',{d:day});}
  else if(app.mode==='sandbox'){dtxt=sb.running||sb.done?t('kd.clim',{c:t(CLIM[sb.clim].label),d:day}):t('kd.preview',{c:t(CLIM[sb.clim].label+'.l')});}
  $('kpiDay').textContent=dtxt;
  if(app.mode==='story'&&app.sceneIdx===6){let s='';if(app.elapsed>7.2)s=t('cmp.n',{p:pctTxt(cmpRes.n)});if(app.elapsed>15.6)s+=t('cmp.e',{p:pctTxt(cmpRes.e)});$('cmp').textContent=s;}
}
function updateTip(dt,hov){
  tipT-=dt;if(tipT<=0){tipT=0.08;
    if(app.mode!=='intro'&&mouse.in&&!input.down&&hov<0){const p=pickTerrain(mouse);
      if(p){const w=wtdAt(p.x,p.z);const c=classOf(w);const n=nearest(p.x,p.z);
        tip.innerHTML='<b>'+t('tip.tma',{w:fmt(w,2)})+'</b><i style="background:'+CSS_CLASS[c]+'"></i>'+t('tip.cls',{c:t('cls.'+c)})+'<br>'+t('tip.dist',{d:Math.round(n.d*K.U/10)*10})+(isBurnt(p.x,p.z)?'<br>'+t('tip.burnt'):'');
        const tx=Math.min(mouse.x+16,canvas.clientWidth-200),ty=Math.max(mouse.y-70,8);tip.style.transform=`translate(${tx}px,${ty}px)`;tip.classList.add('on');}
      else tip.classList.remove('on');}
    else if(hov>=0&&app.mode==='sandbox'){const b=allBlocks[hov];tip.innerHTML='<b>'+t(sb.blocks.has(hov)?'tip.remove':'tip.place')+'</b>'+t(sb.blocks.has(hov)?'tip.refund':'tip.cost',{n:COST.block})+(donorGis.includes(hov)?'<br>'+t('tip.donor'):'');
      tip.style.transform=`translate(${Math.min(mouse.x+16,canvas.clientWidth-200)}px,${Math.max(mouse.y-60,8)}px)`;tip.classList.add('on');}
    else tip.classList.remove('on');}
}

export {updateKpi,updateTip};
