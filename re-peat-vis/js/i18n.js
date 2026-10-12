// Language switching: t() lookup, data-i18n attribute binding and re-render hooks for text built in JS.
import {dict} from './strings.js';

const LANGS=Object.keys(dict);
const subs=[];
let lang='id';
try{const q=new URLSearchParams(location.search).get('lang'),s=localStorage.getItem('lang');
  lang=[q,s,'id'].find(l=>LANGS.includes(l));}catch(e){}

export const getLang=()=>lang;
export const loc=()=>lang==='en'?'en-US':'id-ID';
export function t(key,v){
  const d=dict[lang];let s=d[key];
  if(s===undefined)s=dict.id[key]??key;
  if(v&&v.n===1&&d[key+'.one']!==undefined)s=d[key+'.one'];
  return v?s.replace(/\{(\w+)\}/g,(m,k)=>v[k]??m):s;
}
export function setTip(e,key){const s=t(key);e.setAttribute('aria-label',s);e.title=e.dataset.key?s+' ('+e.dataset.key+')':s;}
export function applyDom(){
  document.querySelectorAll('[data-i18n]').forEach(e=>e.innerHTML=t(e.dataset.i18n));
  document.querySelectorAll('[data-i18n-tip]').forEach(e=>setTip(e,e.dataset.i18nTip));
  document.querySelectorAll('[data-i18n-aria]').forEach(e=>e.setAttribute('aria-label',t(e.dataset.i18nAria)));
  document.querySelectorAll('[data-i18n-title]').forEach(e=>e.title=t(e.dataset.i18nTitle));
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===lang));
  document.documentElement.lang=lang;document.title=t('doc.title');
}
// fn re-renders any text a module built in JS; it runs after every language change.
export function onLang(fn){subs.push(fn);}
export function setLang(l){
  if(!LANGS.includes(l))return;lang=l;
  try{localStorage.setItem('lang',l);}catch(e){}
  applyDom();subs.forEach(f=>f());
}
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
applyDom();
