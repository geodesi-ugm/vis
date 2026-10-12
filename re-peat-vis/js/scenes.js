// Story scene definitions: text keys (see strings.js), state tweens and camera keyframes.
import {P} from './utils.js';

const FACE=P(-55,3,8,150,Math.PI-0.45,1.2);
const scenes=[
 {title:'s1.title',dur:6.5,
  narr:'s1.narr',
  start:{},tw:[{k:'cut',f:-100,to:-55,s:2.6,e:5.6}],cam:[{t:2.2,p:P(0,0,0,275,2.35,0.8)},{t:6.2,p:FACE}]},
 {title:'s2.title',dur:13.5,
  narr:'s2.narr',
  start:{cut:-55,et:1},tw:[{k:'color',f:0,to:1,s:0.3,e:1.8},{k:'t',f:0,to:75,s:2,e:13}],cam:[{t:2.5,p:P(-55,3,10,165,Math.PI-0.62,1.05)}]},
 {title:'s3.title',dur:10,
  narr:'s3.narr',
  start:{t:75,color:1,cut:-55,et:0.35},tw:[{k:'pB',f:0,to:1,s:1.5,e:9.5}],cam:[{t:2.5,p:P(-48,3,22,175,Math.PI-0.8,0.98)}]},
 {title:'s4.title',dur:11.5,
  narr:'s4.narr',
  start:{t:75,color:1,pB:1,et:0.35},tw:[{k:'gate',f:0,to:1,s:1.5,e:3},{k:'front',f:0,to:1,s:3,e:11}],cam:[{t:2.5,p:P(16,3,-28,150,0.95,0.86)}]},
 {title:'s5.title',dur:14,
  narr:'s5.narr',
  start:{t:75,color:1,pB:1,gate:1,front:1,et:0.35},tw:[{k:'t',f:75,to:95,s:0.5,e:3.5},{k:'dry',f:0,to:1,s:0.8,e:3.5},{k:'pump',f:0,to:1,s:4.5,e:13}],cam:[{t:2.5,p:P(-38,3,58,165,0.65,0.92)}]},
 {title:'s6.title',dur:5,
  narr:'s6.narr',
  start:{t:95,color:1,pB:1,gate:1,front:1,dry:1,pump:1,et:0.2},tw:[{k:'strat',f:0,to:1,s:1,e:3}],cam:[{t:2.5,p:P(0,0,0,250,2.1,0.55)}]},
 {title:'s7.title',dur:16,
  narr:'s7.narr',
  start:{color:1,pB:1,gate:1,front:1,k:0.6,et:0.3},
  tw:[{k:'t',f:0,to:90,s:1,e:7},{k:'k',f:0.6,to:1.3,s:8.5,e:8.55},{k:'t',f:0,to:90,s:8.5,e:14.5},{k:'dry',f:0,to:1,s:12,e:14},{k:'pump',f:0,to:1,s:13.5,e:15.5}],
  cam:[{t:2.5,p:P(0,0,0,255,2.35,0.78)}]}
];

export {scenes};
