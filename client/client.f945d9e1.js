function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function s(t){t.forEach(n)}function o(t){return"function"==typeof t}function a(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t,n,r,s){return t[1]&&s?e(r.ctx.slice(),t[1](s(n))):r.ctx}function i(t,e,n,r,s,o,a){const i=function(t,e,n,r){if(t[2]&&r){const s=t[2](r(n));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],n=Math.max(e.dirty.length,s.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|s[r];return t}return e.dirty|s}return e.dirty}(e,r,s,o);if(i){const s=c(e,n,r,a);t.p(s,i)}}function l(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function f(t){t.parentNode.removeChild(t)}function p(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function h(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function m(){return d(" ")}function g(){return d("")}function v(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function $(t){return Array.from(t.childNodes)}function y(t,e,n,r){for(let r=0;r<t.length;r+=1){const s=t[r];if(s.nodeName===e){let e=0;const o=[];for(;e<s.attributes.length;){const t=s.attributes[e++];n[t.name]||o.push(t.name)}for(let t=0;t<o.length;t++)s.removeAttribute(o[t]);return t.splice(r,1)[0]}}return r?function(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}(e):h(e)}function E(t,e){for(let n=0;n<t.length;n+=1){const r=t[n];if(3===r.nodeType)return r.data=""+e,t.splice(n,1)[0]}return d(e)}function b(t){return E(t," ")}function _(t,e){e=""+e,t.data!==e&&(t.data=e)}function S(t,e=document.body){return Array.from(e.querySelectorAll(t))}class x{constructor(t=null){this.a=t,this.e=this.n=null}m(t,e,n=null){this.e||(this.e=h(e.nodeName),this.t=e,this.h(t)),this.i(n)}h(t){this.e.innerHTML=t,this.n=Array.from(this.e.childNodes)}i(t){for(let e=0;e<this.n.length;e+=1)u(this.t,this.n[e],t)}p(t){this.d(),this.h(t),this.i(this.a)}d(){this.n.forEach(f)}}let A;function w(t){A=t}function P(){if(!A)throw new Error("Function called outside component initialization");return A}const j=[],k=[],R=[],L=[],C=Promise.resolve();let N=!1;function q(t){R.push(t)}let O=!1;const I=new Set;function M(){if(!O){O=!0;do{for(let t=0;t<j.length;t+=1){const e=j[t];w(e),U(e.$$)}for(j.length=0;k.length;)k.pop()();for(let t=0;t<R.length;t+=1){const e=R[t];I.has(e)||(I.add(e),e())}R.length=0}while(j.length);for(;L.length;)L.pop()();N=!1,O=!1,I.clear()}}function U(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(q)}}const D=new Set;let H;function J(){H={r:0,c:[],p:H}}function T(){H.r||s(H.c),H=H.p}function V(t,e){t&&t.i&&(D.delete(t),t.i(e))}function z(t,e,n,r){if(t&&t.o){if(D.has(t))return;D.add(t),H.c.push(()=>{D.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}function B(t,e){const n={},r={},s={$$scope:1};let o=t.length;for(;o--;){const a=t[o],c=e[o];if(c){for(const t in a)t in c||(r[t]=1);for(const t in c)s[t]||(n[t]=c[t],s[t]=1);t[o]=c}else for(const t in a)s[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}function G(t){return"object"==typeof t&&null!==t?t:{}}function K(t){t&&t.c()}function Y(t,e){t&&t.l(e)}function F(t,e,r){const{fragment:a,on_mount:c,on_destroy:i,after_update:l}=t.$$;a&&a.m(e,r),q(()=>{const e=c.map(n).filter(o);i?i.push(...e):s(e),t.$$.on_mount=[]}),l.forEach(q)}function W(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function X(t,e){-1===t.$$.dirty[0]&&(j.push(t),N||(N=!0,C.then(M)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Q(e,n,o,a,c,i,l=[-1]){const u=A;w(e);const p=n.props||{},h=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:c,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:l};let d=!1;if(h.ctx=o?o(e,p,(t,n,...r)=>{const s=r.length?r[0]:n;return h.ctx&&c(h.ctx[t],h.ctx[t]=s)&&(h.bound[t]&&h.bound[t](s),d&&X(e,t)),n}):[],h.update(),d=!0,s(h.before_update),h.fragment=!!a&&a(h.ctx),n.target){if(n.hydrate){const t=$(n.target);h.fragment&&h.fragment.l(t),t.forEach(f)}else h.fragment&&h.fragment.c();n.intro&&V(e.$$.fragment),F(e,n.target,n.anchor),M()}w(u)}class Z{$destroy(){W(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}const tt=[];function et(e,n=t){let r;const s=[];function o(t){if(a(e,t)&&(e=t,r)){const t=!tt.length;for(let t=0;t<s.length;t+=1){const n=s[t];n[1](),tt.push(n,e)}if(t){for(let t=0;t<tt.length;t+=2)tt[t][0](tt[t+1]);tt.length=0}}}return{set:o,update:function(t){o(t(e))},subscribe:function(a,c=t){const i=[a,c];return s.push(i),1===s.length&&(r=n(o)||t),a(e),()=>{const t=s.indexOf(i);-1!==t&&s.splice(t,1),0===s.length&&(r(),r=null)}}}}const nt={},rt=()=>({});function st(e){let n,r,s,o,a,c,i,p,g,_,S,x,A,w,P,j,k,R,L,C,N,q,O,I,M,U,D,H,J,T,V,z,B,G;return{c(){n=h("nav"),r=h("input"),s=m(),o=h("a"),a=d("JonMarsh"),c=m(),i=h("label"),p=h("img"),_=m(),S=h("img"),A=m(),w=h("span"),P=h("div"),j=h("a"),k=d("Home"),L=m(),C=h("div"),N=h("a"),q=d("Projects"),I=m(),M=h("span"),U=h("div"),D=h("a"),H=d("Site Map"),T=m(),V=h("div"),z=h("a"),B=d("Policies"),this.h()},l(t){n=y(t,"NAV",{class:!0});var e=$(n);r=y(e,"INPUT",{type:!0,id:!0,name:!0,checked:!0,class:!0}),s=b(e),o=y(e,"A",{href:!0,id:!0,class:!0});var l=$(o);a=E(l,"JonMarsh"),l.forEach(f),c=b(e),i=y(e,"LABEL",{for:!0,class:!0});var u=$(i);p=y(u,"IMG",{alt:!0,src:!0,class:!0}),_=b(u),S=y(u,"IMG",{alt:!0,src:!0,class:!0}),u.forEach(f),A=b(e),w=y(e,"SPAN",{class:!0});var h=$(w);P=y(h,"DIV",{class:!0});var d=$(P);j=y(d,"A",{"aria-current":!0,href:!0,class:!0});var m=$(j);k=E(m,"Home"),m.forEach(f),d.forEach(f),L=b(h),C=y(h,"DIV",{class:!0});var g=$(C);N=y(g,"A",{rel:!0,"aria-current":!0,href:!0,class:!0});var v=$(N);q=E(v,"Projects"),v.forEach(f),g.forEach(f),h.forEach(f),I=b(e),M=y(e,"SPAN",{class:!0});var x=$(M);U=y(x,"DIV",{class:!0});var R=$(U);D=y(R,"A",{"aria-current":!0,href:!0,class:!0});var O=$(D);H=E(O,"Site Map"),O.forEach(f),R.forEach(f),T=b(x),V=y(x,"DIV",{class:!0});var J=$(V);z=y(J,"A",{"aria-current":!0,href:!0,class:!0});var G=$(z);B=E(G,"Policies"),G.forEach(f),J.forEach(f),x.forEach(f),e.forEach(f),this.h()},h(){v(r,"type","checkbox"),v(r,"id","menutoggle"),v(r,"name","menutoggle"),r.checked=!0,v(r,"class","svelte-7a56kt"),v(o,"href","."),v(o,"id","JonMarsh"),v(o,"class","svelte-7a56kt"),v(p,"alt","open navigation menu (hamburger icon emoji)"),p.src!==(g="images/openmoji/E250.svg")&&v(p,"src","images/openmoji/E250.svg"),v(p,"class","svelte-7a56kt"),v(S,"alt","close navigation menu (close icon emoji)"),S.src!==(x="images/openmoji/E24E.svg")&&v(S,"src","images/openmoji/E24E.svg"),v(S,"class","svelte-7a56kt"),v(i,"for","menutoggle"),v(i,"class","svelte-7a56kt"),v(j,"aria-current",R=void 0===e[0]?"page":void 0),v(j,"href","."),v(j,"class","svelte-7a56kt"),v(P,"class","svelte-7a56kt"),v(N,"rel","prefetch"),v(N,"aria-current",O="project"===e[0]?"page":void 0),v(N,"href","project"),v(N,"class","svelte-7a56kt"),v(C,"class","svelte-7a56kt"),v(w,"class","svelte-7a56kt"),v(D,"aria-current",J="sitemap"===e[0]?"page":void 0),v(D,"href","sitemap"),v(D,"class","svelte-7a56kt"),v(U,"class","svelte-7a56kt"),v(z,"aria-current",G="policies"===e[0]?"page":void 0),v(z,"href","policies"),v(z,"class","svelte-7a56kt"),v(V,"class","svelte-7a56kt"),v(M,"class","svelte-7a56kt"),v(n,"class","svelte-7a56kt")},m(t,e){u(t,n,e),l(n,r),l(n,s),l(n,o),l(o,a),l(n,c),l(n,i),l(i,p),l(i,_),l(i,S),l(n,A),l(n,w),l(w,P),l(P,j),l(j,k),l(w,L),l(w,C),l(C,N),l(N,q),l(n,I),l(n,M),l(M,U),l(U,D),l(D,H),l(M,T),l(M,V),l(V,z),l(z,B)},p(t,[e]){1&e&&R!==(R=void 0===t[0]?"page":void 0)&&v(j,"aria-current",R),1&e&&O!==(O="project"===t[0]?"page":void 0)&&v(N,"aria-current",O),1&e&&J!==(J="sitemap"===t[0]?"page":void 0)&&v(D,"aria-current",J),1&e&&G!==(G="policies"===t[0]?"page":void 0)&&v(z,"aria-current",G)},i:t,o:t,d(t){t&&f(n)}}}function ot(t,e,n){let{segment:r}=e;return t.$set=t=>{"segment"in t&&n(0,r=t.segment)},[r]}class at extends Z{constructor(t){super(),Q(this,t,ot,st,a,{segment:0})}}function ct(t){let e,n,r,s;e=new at({props:{segment:t[0]}});const o=t[2].default,a=function(t,e,n,r){if(t){const s=c(t,e,n,r);return t[0](s)}}(o,t,t[1],null);return{c(){K(e.$$.fragment),n=m(),r=h("main"),a&&a.c(),this.h()},l(t){Y(e.$$.fragment,t),n=b(t),r=y(t,"MAIN",{class:!0});var s=$(r);a&&a.l(s),s.forEach(f),this.h()},h(){v(r,"class","svelte-s8c1vq")},m(t,o){F(e,t,o),u(t,n,o),u(t,r,o),a&&a.m(r,null),s=!0},p(t,[n]){const r={};1&n&&(r.segment=t[0]),e.$set(r),a&&a.p&&2&n&&i(a,o,t,t[1],n,null,null)},i(t){s||(V(e.$$.fragment,t),V(a,t),s=!0)},o(t){z(e.$$.fragment,t),z(a,t),s=!1},d(t){W(e,t),t&&f(n),t&&f(r),a&&a.d(t)}}}function it(t,e,n){let{segment:r}=e,{$$slots:s={},$$scope:o}=e;return t.$set=t=>{"segment"in t&&n(0,r=t.segment),"$$scope"in t&&n(1,o=t.$$scope)},[r,o,s]}class lt extends Z{constructor(t){super(),Q(this,t,it,ct,a,{segment:0})}}function ut(t){let e,n,r=t[1].stack+"";return{c(){e=h("pre"),n=d(r)},l(t){e=y(t,"PRE",{});var s=$(e);n=E(s,r),s.forEach(f)},m(t,r){u(t,e,r),l(e,n)},p(t,e){2&e&&r!==(r=t[1].stack+"")&&_(n,r)},d(t){t&&f(e)}}}function ft(e){let n,r,s,o,a,c,i,p,g,x,A=e[1].message+"";document.title=n="Jonathan Marsh - "+e[0];let w=e[1].stack&&ut(e);return{c(){r=m(),s=h("main"),o=h("section"),a=h("span"),c=d(e[0]),i=m(),p=h("p"),g=d(A),x=m(),w&&w.c(),this.h()},l(t){S('[data-svelte="svelte-1q9htxg"]',document.head).forEach(f),r=b(t),s=y(t,"MAIN",{class:!0});var n=$(s);o=y(n,"SECTION",{class:!0});var l=$(o);a=y(l,"SPAN",{class:!0});var u=$(a);c=E(u,e[0]),u.forEach(f),i=b(l),p=y(l,"P",{class:!0});var h=$(p);g=E(h,A),h.forEach(f),l.forEach(f),x=b(n),w&&w.l(n),n.forEach(f),this.h()},h(){v(a,"class","svelte-zuknyx"),v(p,"class","svelte-zuknyx"),v(o,"class","svelte-zuknyx"),v(s,"class","svelte-zuknyx")},m(t,e){u(t,r,e),u(t,s,e),l(s,o),l(o,a),l(a,c),l(o,i),l(o,p),l(p,g),l(s,x),w&&w.m(s,null)},p(t,[e]){1&e&&n!==(n="Jonathan Marsh - "+t[0])&&(document.title=n),1&e&&_(c,t[0]),2&e&&A!==(A=t[1].message+"")&&_(g,A),t[1].stack?w?w.p(t,e):(w=ut(t),w.c(),w.m(s,null)):w&&(w.d(1),w=null)},i:t,o:t,d(t){t&&f(r),t&&f(s),w&&w.d()}}}function pt(t,e,n){let{status:r}=e,{error:s}=e;return t.$set=t=>{"status"in t&&n(0,r=t.status),"error"in t&&n(1,s=t.error)},[r,s]}class ht extends Z{constructor(t){super(),Q(this,t,pt,ft,a,{status:0,error:1})}}function dt(t){let n,r,s;const o=[t[4].props];var a=t[4].component;function c(t){let n={};for(let t=0;t<o.length;t+=1)n=e(n,o[t]);return{props:n}}return a&&(n=new a(c())),{c(){n&&K(n.$$.fragment),r=g()},l(t){n&&Y(n.$$.fragment,t),r=g()},m(t,e){n&&F(n,t,e),u(t,r,e),s=!0},p(t,e){const s=16&e?B(o,[G(t[4].props)]):{};if(a!==(a=t[4].component)){if(n){J();const t=n;z(t.$$.fragment,1,0,()=>{W(t,1)}),T()}a?(n=new a(c()),K(n.$$.fragment),V(n.$$.fragment,1),F(n,r.parentNode,r)):n=null}else a&&n.$set(s)},i(t){s||(n&&V(n.$$.fragment,t),s=!0)},o(t){n&&z(n.$$.fragment,t),s=!1},d(t){t&&f(r),n&&W(n,t)}}}function mt(t){let e,n;return e=new ht({props:{error:t[0],status:t[1]}}),{c(){K(e.$$.fragment)},l(t){Y(e.$$.fragment,t)},m(t,r){F(e,t,r),n=!0},p(t,n){const r={};1&n&&(r.error=t[0]),2&n&&(r.status=t[1]),e.$set(r)},i(t){n||(V(e.$$.fragment,t),n=!0)},o(t){z(e.$$.fragment,t),n=!1},d(t){W(e,t)}}}function gt(t){let e,n,r,s;const o=[mt,dt],a=[];function c(t,e){return t[0]?0:1}return e=c(t),n=a[e]=o[e](t),{c(){n.c(),r=g()},l(t){n.l(t),r=g()},m(t,n){a[e].m(t,n),u(t,r,n),s=!0},p(t,s){let i=e;e=c(t),e===i?a[e].p(t,s):(J(),z(a[i],1,1,()=>{a[i]=null}),T(),n=a[e],n||(n=a[e]=o[e](t),n.c()),V(n,1),n.m(r.parentNode,r))},i(t){s||(V(n),s=!0)},o(t){z(n),s=!1},d(t){a[e].d(t),t&&f(r)}}}function vt(t){let n,r;const s=[{segment:t[2][0]},t[3].props];let o={$$slots:{default:[gt]},$$scope:{ctx:t}};for(let t=0;t<s.length;t+=1)o=e(o,s[t]);return n=new lt({props:o}),{c(){K(n.$$.fragment)},l(t){Y(n.$$.fragment,t)},m(t,e){F(n,t,e),r=!0},p(t,[e]){const r=12&e?B(s,[4&e&&{segment:t[2][0]},8&e&&G(t[3].props)]):{};147&e&&(r.$$scope={dirty:e,ctx:t}),n.$set(r)},i(t){r||(V(n.$$.fragment,t),r=!0)},o(t){z(n.$$.fragment,t),r=!1},d(t){W(n,t)}}}function $t(t,e,n){let{stores:r}=e,{error:s}=e,{status:o}=e,{segments:a}=e,{level0:c}=e,{level1:i=null}=e,{notify:l}=e;var u,f,p;return u=l,P().$$.after_update.push(u),f=nt,p=r,P().$$.context.set(f,p),t.$set=t=>{"stores"in t&&n(5,r=t.stores),"error"in t&&n(0,s=t.error),"status"in t&&n(1,o=t.status),"segments"in t&&n(2,a=t.segments),"level0"in t&&n(3,c=t.level0),"level1"in t&&n(4,i=t.level1),"notify"in t&&n(6,l=t.notify)},[s,o,a,c,i,r,l]}class yt extends Z{constructor(t){super(),Q(this,t,$t,vt,a,{stores:5,error:0,status:1,segments:2,level0:3,level1:4,notify:6})}}const Et=[],bt=[{js:()=>import("./index.3614f2b0.js"),css:[]},{js:()=>import("./policies.1255bfb8.js"),css:[]},{js:()=>import("./index.7b054627.js"),css:[]},{js:()=>import("./[slug].f50fa909.js"),css:[]},{js:()=>import("./sitemap.fe869a75.js"),css:[]},{js:()=>import("./[slug].4cc47efd.js"),css:[]}],_t=(St=decodeURIComponent,[{pattern:/^\/$/,parts:[{i:0}]},{pattern:/^\/policies\/?$/,parts:[{i:1}]},{pattern:/^\/project\/?$/,parts:[{i:2}]},{pattern:/^\/project\/([^\/]+?)\/?$/,parts:[null,{i:3,params:t=>({slug:St(t[1])})}]},{pattern:/^\/sitemap\/?$/,parts:[{i:4}]},{pattern:/^\/tag\/([^\/]+?)\/?$/,parts:[null,{i:5,params:t=>({slug:St(t[1])})}]}]);var St;const xt="undefined"!=typeof __SAPPER__&&__SAPPER__;let At,wt,Pt,jt=!1,kt=[],Rt="{}";const Lt={page:function(t){const e=et(t);let n=!0;return{notify:function(){n=!0,e.update(t=>t)},set:function(t){n=!1,e.set(t)},subscribe:function(t){let r;return e.subscribe(e=>{(void 0===r||n&&e!==r)&&t(r=e)})}}}({}),preloading:et(null),session:et(xt&&xt.session)};let Ct,Nt;Lt.session.subscribe(async t=>{if(Ct=t,!jt)return;Nt=!0;const e=Jt(new URL(location.href)),n=wt={},{redirect:r,props:s,branch:o}=await Bt(e);n===wt&&await zt(r,o,s,e.page)});let qt,Ot=null;let It,Mt=1;const Ut="undefined"!=typeof history?history:{pushState:(t,e,n)=>{},replaceState:(t,e,n)=>{},scrollRestoration:""},Dt={};function Ht(t){const e=Object.create(null);return t.length>0&&t.slice(1).split("&").forEach(t=>{let[,n,r=""]=/([^=]*)(?:=(.*))?/.exec(decodeURIComponent(t.replace(/\+/g," ")));"string"==typeof e[n]&&(e[n]=[e[n]]),"object"==typeof e[n]?e[n].push(r):e[n]=r}),e}function Jt(t){if(t.origin!==location.origin)return null;if(!t.pathname.startsWith(xt.baseUrl))return null;let e=t.pathname.slice(xt.baseUrl.length);if(""===e&&(e="/"),!Et.some(t=>t.test(e)))for(let n=0;n<_t.length;n+=1){const r=_t[n],s=r.pattern.exec(e);if(s){const n=Ht(t.search),o=r.parts[r.parts.length-1],a=o.params?o.params(s):{},c={host:location.host,path:e,query:n,params:a};return{href:t.href,route:r,match:s,page:c}}}}function Tt(){return{x:pageXOffset,y:pageYOffset}}async function Vt(t,e,n,r){if(e)It=e;else{const t=Tt();Dt[It]=t,e=It=++Mt,Dt[It]=n?t:{x:0,y:0}}It=e,At&&Lt.preloading.set(!0);const s=Ot&&Ot.href===t.href?Ot.promise:Bt(t);Ot=null;const o=wt={},{redirect:a,props:c,branch:i}=await s;if(o===wt&&(await zt(a,i,c,t.page),document.activeElement&&document.activeElement.blur(),!n)){let t=Dt[e];if(r){const e=document.getElementById(r.slice(1));e&&(t={x:0,y:e.getBoundingClientRect().top+scrollY})}Dt[It]=t,t&&scrollTo(t.x,t.y)}}async function zt(t,e,n,r){if(t)return function(t,e={replaceState:!1}){const n=Jt(new URL(t,document.baseURI));return n?(Ut[e.replaceState?"replaceState":"pushState"]({id:It},"",t),Vt(n,null).then(()=>{})):(location.href=t,new Promise(t=>{}))}(t.location,{replaceState:!0});if(Lt.page.set(r),Lt.preloading.set(!1),At)At.$set(n);else{n.stores={page:{subscribe:Lt.page.subscribe},preloading:{subscribe:Lt.preloading.subscribe},session:Lt.session},n.level0={props:await Pt},n.notify=Lt.page.notify;const t=document.querySelector("#sapper-head-start"),e=document.querySelector("#sapper-head-end");if(t&&e){for(;t.nextSibling!==e;)Kt(t.nextSibling);Kt(t),Kt(e)}At=new yt({target:qt,props:n,hydrate:!0})}kt=e,Rt=JSON.stringify(r.query),jt=!0,Nt=!1}async function Bt(t){const{route:e,page:n}=t,r=n.path.split("/").filter(Boolean);let s=null;const o={error:null,status:200,segments:[r[0]]},a={fetch:(t,e)=>fetch(t,e),redirect:(t,e)=>{if(s&&(s.statusCode!==t||s.location!==e))throw new Error("Conflicting redirects");s={statusCode:t,location:e}},error:(t,e)=>{o.error="string"==typeof e?new Error(e):e,o.status=t}};let c;Pt||(Pt=xt.preloaded[0]||rt.call(a,{host:n.host,path:n.path,query:n.query,params:{}},Ct));let i=1;try{const s=JSON.stringify(n.query),l=e.pattern.exec(n.path);let u=!1;c=await Promise.all(e.parts.map(async(e,c)=>{const f=r[c];if(function(t,e,n,r){if(r!==Rt)return!0;const s=kt[t];return!!s&&(e!==s.segment||(!(!s.match||JSON.stringify(s.match.slice(1,t+2))===JSON.stringify(n.slice(1,t+2)))||void 0))}(c,f,l,s)&&(u=!0),o.segments[i]=r[c+1],!e)return{segment:f};const p=i++;if(!Nt&&!u&&kt[c]&&kt[c].part===e.i)return kt[c];u=!1;const{default:h,preload:d}=await function(t){const e="string"==typeof t.css?[]:t.css.map(Gt);return e.unshift(t.js()),Promise.all(e).then(t=>t[0])}(bt[e.i]);let m;return m=jt||!xt.preloaded[c+1]?d?await d.call(a,{host:n.host,path:n.path,query:n.query,params:e.params?e.params(t.match):{}},Ct):{}:xt.preloaded[c+1],o["level"+p]={component:h,props:m,segment:f,match:l,part:e.i}}))}catch(t){o.error=t,o.status=500,c=[]}return{redirect:s,props:o,branch:c}}function Gt(t){const e="client/"+t;if(!document.querySelector(`link[href="${e}"]`))return new Promise((t,n)=>{const r=document.createElement("link");r.rel="stylesheet",r.href=e,r.onload=()=>t(),r.onerror=n,document.head.appendChild(r)})}function Kt(t){t.parentNode.removeChild(t)}function Yt(t){const e=Jt(new URL(t,document.baseURI));if(e)return Ot&&t===Ot.href||function(t,e){Ot={href:t,promise:e}}(t,Bt(e)),Ot.promise}let Ft;function Wt(t){clearTimeout(Ft),Ft=setTimeout(()=>{Xt(t)},20)}function Xt(t){const e=Zt(t.target);e&&"prefetch"===e.rel&&Yt(e.href)}function Qt(t){if(1!==function(t){return null===t.which?t.button:t.which}(t))return;if(t.metaKey||t.ctrlKey||t.shiftKey)return;if(t.defaultPrevented)return;const e=Zt(t.target);if(!e)return;if(!e.href)return;const n="object"==typeof e.href&&"SVGAnimatedString"===e.href.constructor.name,r=String(n?e.href.baseVal:e.href);if(r===location.href)return void(location.hash||t.preventDefault());if(e.hasAttribute("download")||"external"===e.getAttribute("rel"))return;if(n?e.target.baseVal:e.target)return;const s=new URL(r);if(s.pathname===location.pathname&&s.search===location.search)return;const o=Jt(s);if(o){Vt(o,null,e.hasAttribute("sapper-noscroll"),s.hash),t.preventDefault(),Ut.pushState({id:It},"",s.href)}}function Zt(t){for(;t&&"A"!==t.nodeName.toUpperCase();)t=t.parentNode;return t}function te(t){if(Dt[It]=Tt(),t.state){const e=Jt(new URL(location.href));e?Vt(e,t.state.id):location.href=location.href}else Mt=Mt+1,function(t){It=t}(Mt),Ut.replaceState({id:It},"",location.href)}var ee;ee={target:document.querySelector("#sapper")},"scrollRestoration"in Ut&&(Ut.scrollRestoration="manual"),addEventListener("beforeunload",()=>{Ut.scrollRestoration="auto"}),addEventListener("load",()=>{Ut.scrollRestoration="manual"}),function(t){qt=t}(ee.target),addEventListener("click",Qt),addEventListener("popstate",te),addEventListener("touchstart",Xt),addEventListener("mousemove",Wt),Promise.resolve().then(()=>{const{hash:t,href:e}=location;Ut.replaceState({id:Mt},"",e);const n=new URL(location.href);if(xt.error)return function(t){const{host:e,pathname:n,search:r}=location,{session:s,preloaded:o,status:a,error:c}=xt;Pt||(Pt=o&&o[0]),zt(null,[],{error:c,status:a,session:s,level0:{props:Pt},level1:{props:{status:a,error:c},component:ht},segments:o},{host:e,path:n,query:Ht(r),params:{}})}();const r=Jt(n);return r?Vt(r,Mt,!0,t):void 0});export{J as A,_ as B,g as C,x as H,Z as S,m as a,y as b,b as c,f as d,h as e,$ as f,E as g,v as h,Q as i,u as j,l as k,K as l,Y as m,t as n,F as o,B as p,S as q,G as r,a as s,d as t,V as u,z as v,W as w,T as x,p as y,e as z};
