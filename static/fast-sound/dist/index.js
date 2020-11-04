!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("fs")):"function"==typeof define&&define.amd?define(["fs"],n):"object"==typeof exports?exports.FastSound=n(require("fs")):e.FastSound=n(e.fs)}("undefined"!=typeof self?self:this,(function(__WEBPACK_EXTERNAL_MODULE__3__){return function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=1)}([function(e,n){function t(e,n){for(var t=0,r=e.length-1;r>=0;r--){var o=e[r];"."===o?e.splice(r,1):".."===o?(e.splice(r,1),t++):t&&(e.splice(r,1),t--)}if(n)for(;t--;t)e.unshift("..");return e}function r(e,n){if(e.filter)return e.filter(n);for(var t=[],r=0;r<e.length;r++)n(e[r],r,e)&&t.push(e[r]);return t}n.resolve=function(){for(var e="",n=!1,o=arguments.length-1;o>=-1&&!n;o--){var u=o>=0?arguments[o]:process.cwd();if("string"!=typeof u)throw new TypeError("Arguments to path.resolve must be strings");u&&(e=u+"/"+e,n="/"===u.charAt(0))}return(n?"/":"")+(e=t(r(e.split("/"),(function(e){return!!e})),!n).join("/"))||"."},n.normalize=function(e){var u=n.isAbsolute(e),i="/"===o(e,-1);return(e=t(r(e.split("/"),(function(e){return!!e})),!u).join("/"))||u||(e="."),e&&i&&(e+="/"),(u?"/":"")+e},n.isAbsolute=function(e){return"/"===e.charAt(0)},n.join=function(){var e=Array.prototype.slice.call(arguments,0);return n.normalize(r(e,(function(e,n){if("string"!=typeof e)throw new TypeError("Arguments to path.join must be strings");return e})).join("/"))},n.relative=function(e,t){function r(e){for(var n=0;n<e.length&&""===e[n];n++);for(var t=e.length-1;t>=0&&""===e[t];t--);return n>t?[]:e.slice(n,t-n+1)}e=n.resolve(e).substr(1),t=n.resolve(t).substr(1);for(var o=r(e.split("/")),u=r(t.split("/")),i=Math.min(o.length,u.length),a=i,s=0;s<i;s++)if(o[s]!==u[s]){a=s;break}var f=[];for(s=a;s<o.length;s++)f.push("..");return(f=f.concat(u.slice(a))).join("/")},n.sep="/",n.delimiter=":",n.dirname=function(e){if("string"!=typeof e&&(e+=""),0===e.length)return".";for(var n=e.charCodeAt(0),t=47===n,r=-1,o=!0,u=e.length-1;u>=1;--u)if(47===(n=e.charCodeAt(u))){if(!o){r=u;break}}else o=!1;return-1===r?t?"/":".":t&&1===r?"/":e.slice(0,r)},n.basename=function(e,n){var t=function(e){"string"!=typeof e&&(e+="");var n,t=0,r=-1,o=!0;for(n=e.length-1;n>=0;--n)if(47===e.charCodeAt(n)){if(!o){t=n+1;break}}else-1===r&&(o=!1,r=n+1);return-1===r?"":e.slice(t,r)}(e);return n&&t.substr(-1*n.length)===n&&(t=t.substr(0,t.length-n.length)),t},n.extname=function(e){"string"!=typeof e&&(e+="");for(var n=-1,t=0,r=-1,o=!0,u=0,i=e.length-1;i>=0;--i){var a=e.charCodeAt(i);if(47!==a)-1===r&&(o=!1,r=i+1),46===a?-1===n?n=i:1!==u&&(u=1):-1!==n&&(u=-1);else if(!o){t=i+1;break}}return-1===n||-1===r||0===u||1===u&&n===r-1&&n===t+1?"":e.slice(n,r)};var o="b"==="ab".substr(-1)?function(e,n,t){return e.substr(n,t)}:function(e,n,t){return n<0&&(n=e.length+n),e.substr(n,t)}},function(e,n,t){const r=t(2),o=t(4);e.exports=o(r,"fast-sound.min.asm.js")},function(e,n,t){(function(n,r){var o,u=(o=(o="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||n,function(e){var n,u;e=e||{},n||(n=void 0!==e?e:{}),n.ready=new Promise((function(e){u=e}));var i,a={};for(i in n)n.hasOwnProperty(i)&&(a[i]=n[i]);var s,f,c,l,p="./this.program";s="object"==typeof window,f="function"==typeof importScripts,c="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,l=!s&&!c&&!f;var d,m,y,g,_="";c?(_=f?t(0).dirname(_)+"/":r+"/",d=function(e,n){return y||(y=t(3)),g||(g=t(0)),e=g.normalize(e),y.readFileSync(e,n?null:"utf8")},m=function(e){return(e=d(e,!0)).buffer||(e=new Uint8Array(e)),e.buffer||G("Assertion failed: undefined"),e},1<process.argv.length&&(p=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),process.on("uncaughtException",(function(e){throw e})),process.on("unhandledRejection",G),n.inspect=function(){return"[Emscripten Module object]"}):l?("undefined"!=typeof read&&(d=function(e){return read(e)}),m=function(e){return"function"==typeof readbuffer?new Uint8Array(readbuffer(e)):("object"==typeof(e=read(e,"binary"))||G("Assertion failed: undefined"),e)},"undefined"!=typeof print&&("undefined"==typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!=typeof printErr?printErr:print)):(s||f)&&(f?_=self.location.href:document.currentScript&&(_=document.currentScript.src),o&&(_=o),_=0!==_.indexOf("blob:")?_.substr(0,_.lastIndexOf("/")+1):"",d=function(e){var n=new XMLHttpRequest;return n.open("GET",e,!1),n.send(null),n.responseText},f&&(m=function(e){var n=new XMLHttpRequest;return n.open("GET",e,!1),n.responseType="arraybuffer",n.send(null),new Uint8Array(n.response)}));var h=n.print||console.log.bind(console),v=n.printErr||console.warn.bind(console);for(i in a)a.hasOwnProperty(i)&&(n[i]=a[i]);function b(e){var n=C[T>>2];return C[T>>2]=n+e+15&-16,n}a=null,n.thisProgram&&(p=n.thisProgram);var w,A={"f64-rem":function(e,n){return e%n},debugger:function(){}};n.wasmBinary&&(w=n.wasmBinary),n.noExitRuntime&&n.noExitRuntime,"object"!=typeof WebAssembly&&v("no native wasm support detected");var E,S=new WebAssembly.Table({initial:483,maximum:483,element:"anyfunc"}),M=!1,D="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function O(e,n,t){var r=n+t;for(t=n;e[t]&&!(t>=r);)++t;if(16<t-n&&e.subarray&&D)return D.decode(e.subarray(n,t));for(r="";n<t;){var o=e[n++];if(128&o){var u=63&e[n++];if(192==(224&o))r+=String.fromCharCode((31&o)<<6|u);else{var i=63&e[n++];65536>(o=224==(240&o)?(15&o)<<12|u<<6|i:(7&o)<<18|u<<12|i<<6|63&e[n++])?r+=String.fromCharCode(o):(o-=65536,r+=String.fromCharCode(55296|o>>10,56320|1023&o))}}else r+=String.fromCharCode(o)}return r}function x(e){return e?O(I,e,void 0):""}function R(e,n,t,r){if(0<r){r=t+r-1;for(var o=0;o<e.length;++o){var u=e.charCodeAt(o);if(55296<=u&&57343>=u&&(u=65536+((1023&u)<<10)|1023&e.charCodeAt(++o)),127>=u){if(t>=r)break;n[t++]=u}else{if(2047>=u){if(t+1>=r)break;n[t++]=192|u>>6}else{if(65535>=u){if(t+2>=r)break;n[t++]=224|u>>12}else{if(t+3>=r)break;n[t++]=240|u>>18,n[t++]=128|u>>12&63}n[t++]=128|u>>6&63}n[t++]=128|63&u}}n[t]=0}}function F(e){for(var n=0,t=0;t<e.length;++t){var r=e.charCodeAt(t);55296<=r&&57343>=r&&(r=65536+((1023&r)<<10)|1023&e.charCodeAt(++t)),127>=r?++n:n=2047>=r?n+2:65535>=r?n+3:n+4}return n}var j,P,I,C,T=68544,N=n.INITIAL_MEMORY||16777216;(E=n.wasmMemory?n.wasmMemory:new WebAssembly.Memory({initial:N/65536,maximum:N/65536}))&&(j=E.buffer),N=j.byteLength;var Y=j;function W(e){for(;0<e.length;){var t=e.shift();if("function"==typeof t)t(n);else{var r=t.S;"number"==typeof r?void 0===t.R?n.dynCall_v(r):n.dynCall_vi(r,t.R):r(void 0===t.R?null:t.R)}}}j=Y,n.HEAP8=P=new Int8Array(Y),n.HEAP16=new Int16Array(Y),n.HEAP32=C=new Int32Array(Y),n.HEAPU8=I=new Uint8Array(Y),n.HEAPU16=new Uint16Array(Y),n.HEAPU32=new Uint32Array(Y),n.HEAPF32=new Float32Array(Y),n.HEAPF64=new Float64Array(Y),C[T>>2]=5311616;var H=[],L=[],U=[],k=[],J=!1;function K(){var e=n.preRun.shift();H.unshift(e)}var B=0,z=null,X=null;function G(e){throw n.onAbort&&n.onAbort(e),h(e),v(e),M=!0,new WebAssembly.RuntimeError("abort("+e+"). Build with -s ASSERTIONS=1 for more info.")}function Z(e){var n=V;return String.prototype.startsWith?n.startsWith(e):0===n.indexOf(e)}function q(){return Z("data:application/octet-stream;base64,")}n.preloadedImages={},n.preloadedAudios={};var V="fast-sound.min.wasm";if(!q()){var $=V;V=n.locateFile?n.locateFile($,_):_+$}function Q(){try{if(w)return new Uint8Array(w);if(m)return m(V);throw"both async and sync fetching of the wasm failed"}catch(e){G(e)}}n.asm=function(){function e(e){n.asm=e.exports,B--,n.monitorRunDependencies&&n.monitorRunDependencies(B),0==B&&(null!==z&&(clearInterval(z),z=null),X&&(e=X,X=null,e()))}function t(n){e(n.instance)}function r(e){return(w||!s&&!f||"function"!=typeof fetch||Z("file://")?new Promise((function(e){e(Q())})):fetch(V,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at '"+V+"'";return e.arrayBuffer()})).catch((function(){return Q()}))).then((function(e){return WebAssembly.instantiate(e,o)})).then(e,(function(e){v("failed to asynchronously prepare wasm: "+e),G(e)}))}var o={env:le,wasi_snapshot_preview1:le,global:{NaN:NaN,Infinity:1/0},"global.Math":Math,asm2wasm:A};if(B++,n.monitorRunDependencies&&n.monitorRunDependencies(B),n.instantiateWasm)try{return n.instantiateWasm(o,e)}catch(e){return v("Module.instantiateWasm callback failed with error: "+e),!1}return function(){if(w||"function"!=typeof WebAssembly.instantiateStreaming||q()||Z("file://")||"function"!=typeof fetch)return r(t);fetch(V,{credentials:"same-origin"}).then((function(e){return WebAssembly.instantiateStreaming(e,o).then(t,(function(e){return v("wasm streaming compile failed: "+e),v("falling back to ArrayBuffer instantiation"),r(t)}))}))}(),{}},L.push({S:function(){ge()}});var ee={},ne={},te=[null,[],[]],re={};function oe(){return oe.K||(oe.K=[]),oe.K.push(he()),oe.K.length-1}function ue(e){return 0==e%4&&(0!=e%100||0==e%400)}function ie(e,n){for(var t=0,r=0;r<=n;t+=e[r++]);return t}var ae=[31,29,31,30,31,30,31,31,30,31,30,31],se=[31,28,31,30,31,30,31,31,30,31,30,31];function fe(e,n){for(e=new Date(e.getTime());0<n;){var t=e.getMonth(),r=(ue(e.getFullYear())?ae:se)[t];if(!(n>r-e.getDate())){e.setDate(e.getDate()+n);break}n-=r-e.getDate()+1,e.setDate(1),11>t?e.setMonth(t+1):(e.setMonth(0),e.setFullYear(e.getFullYear()+1))}return e}function ce(e,n,t,r){function o(e,n,t){for(e="number"==typeof e?e.toString():e||"";e.length<n;)e=t[0]+e;return e}function u(e,n){return o(e,n,"0")}function i(e,n){function t(e){return 0>e?-1:0<e?1:0}var r;return 0===(r=t(e.getFullYear()-n.getFullYear()))&&0===(r=t(e.getMonth()-n.getMonth()))&&(r=t(e.getDate()-n.getDate())),r}function a(e){switch(e.getDay()){case 0:return new Date(e.getFullYear()-1,11,29);case 1:return e;case 2:return new Date(e.getFullYear(),0,3);case 3:return new Date(e.getFullYear(),0,2);case 4:return new Date(e.getFullYear(),0,1);case 5:return new Date(e.getFullYear()-1,11,31);case 6:return new Date(e.getFullYear()-1,11,30)}}function s(e){e=fe(new Date(e.J+1900,0,1),e.P);var n=new Date(e.getFullYear()+1,0,4),t=a(new Date(e.getFullYear(),0,4));return n=a(n),0>=i(t,e)?0>=i(n,e)?e.getFullYear()+1:e.getFullYear():e.getFullYear()-1}var f=C[r+40>>2];for(var c in r={V:C[r>>2],U:C[r+4>>2],N:C[r+8>>2],M:C[r+12>>2],L:C[r+16>>2],J:C[r+20>>2],O:C[r+24>>2],P:C[r+28>>2],ba:C[r+32>>2],T:C[r+36>>2],W:f?x(f):""},t=x(t),f={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})t=t.replace(new RegExp(c,"g"),f[c]);var l="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),p="January February March April May June July August September October November December".split(" ");for(c in f={"%a":function(e){return l[e.O].substring(0,3)},"%A":function(e){return l[e.O]},"%b":function(e){return p[e.L].substring(0,3)},"%B":function(e){return p[e.L]},"%C":function(e){return u((e.J+1900)/100|0,2)},"%d":function(e){return u(e.M,2)},"%e":function(e){return o(e.M,2," ")},"%g":function(e){return s(e).toString().substring(2)},"%G":function(e){return s(e)},"%H":function(e){return u(e.N,2)},"%I":function(e){return 0==(e=e.N)?e=12:12<e&&(e-=12),u(e,2)},"%j":function(e){return u(e.M+ie(ue(e.J+1900)?ae:se,e.L-1),3)},"%m":function(e){return u(e.L+1,2)},"%M":function(e){return u(e.U,2)},"%n":function(){return"\n"},"%p":function(e){return 0<=e.N&&12>e.N?"AM":"PM"},"%S":function(e){return u(e.V,2)},"%t":function(){return"\t"},"%u":function(e){return e.O||7},"%U":function(e){var n=new Date(e.J+1900,0,1),t=0===n.getDay()?n:fe(n,7-n.getDay());return 0>i(t,e=new Date(e.J+1900,e.L,e.M))?u(Math.ceil((31-t.getDate()+(ie(ue(e.getFullYear())?ae:se,e.getMonth()-1)-31)+e.getDate())/7),2):0===i(t,n)?"01":"00"},"%V":function(e){var n=new Date(e.J+1901,0,4),t=a(new Date(e.J+1900,0,4));n=a(n);var r=fe(new Date(e.J+1900,0,1),e.P);return 0>i(r,t)?"53":0>=i(n,r)?"01":u(Math.ceil((t.getFullYear()<e.J+1900?e.P+32-t.getDate():e.P+1-t.getDate())/7),2)},"%w":function(e){return e.O},"%W":function(e){var n=new Date(e.J,0,1),t=1===n.getDay()?n:fe(n,0===n.getDay()?1:7-n.getDay()+1);return 0>i(t,e=new Date(e.J+1900,e.L,e.M))?u(Math.ceil((31-t.getDate()+(ie(ue(e.getFullYear())?ae:se,e.getMonth()-1)-31)+e.getDate())/7),2):0===i(t,n)?"01":"00"},"%y":function(e){return(e.J+1900).toString().substring(2)},"%Y":function(e){return e.J+1900},"%z":function(e){var n=0<=(e=e.T);return e=Math.abs(e)/60,(n?"+":"-")+String("0000"+(e/60*100+e%60)).slice(-4)},"%Z":function(e){return e.W},"%%":function(){return"%"}})0<=t.indexOf(c)&&(t=t.replace(new RegExp(c,"g"),f[c](r)));return(c=function(e){var n=Array(F(e)+1);return R(e,n,0,n.length),n}(t)).length>n?0:(P.set(c,e),c.length-1)}var le={s:function e(n){if(e.K)var t=C[n>>2],r=C[t>>2];else e.K=!0,ee.USER="web_user",ee.LOGNAME="web_user",ee.PATH="/",ee.PWD="/",ee.HOME="/home/web_user",ee.LANG=("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",ee._=p||"./this.program",r=J?me(1024):b(1024),t=J?me(256):b(256),C[t>>2]=r,C[n>>2]=t;n=[];var o,u=0;for(o in ee)if("string"==typeof ee[o]){var i=o+"="+ee[o];n.push(i),u+=i.length}if(1024<u)throw Error("Environment size exceeded TOTAL_ENV_SIZE!");for(o=0;o<n.length;o++){u=i=n[o];for(var a=r,s=0;s<u.length;++s)P[a++>>0]=u.charCodeAt(s);P[a>>0]=0,C[t+4*o>>2]=r,r+=i.length+1}C[t+4*n.length>>2]=0},o:function(){return C[pe()>>2]=63,-1},n:function(e,n){if(-1==(0|e)||0===n)e=-28;else{var t=ne[e];t&&n===t.$&&(ne[e]=null,t.X&&de(t.aa)),e=0}return e},m:function(){return 0},l:function(e,n,t,r){return e=re.Z(e),n=re.Y(e,n,t),C[r>>2]=n,0},p:function(){},k:function(e,n,t,r){for(var o=0,u=0;u<t;u++){for(var i=C[n+8*u>>2],a=C[n+(8*u+4)>>2],s=0;s<a;s++){var f=I[i+s],c=te[e];0===f||10===f?((1===e?h:v)(O(c,0)),c.length=0):c.push(f)}o+=a}return C[r>>2]=o,0},__memory_base:1024,__table_base:0,a:function(){G()},e:function(){return I.length},j:function(e,n,t){I.copyWithin(e,n,n+t)},f:function(){G("OOM")},h:function e(n){if(0===n)return 0;if(n=x(n),!ee.hasOwnProperty(n))return 0;e.K&&de(e.K);var t=F(n=ee[n])+1,r=me(t);return r&&R(n,P,r,t),e.K=r},i:function(e){return Math.pow(2,e)},g:function(e){return Math.log(e)/Math.LN10},b:function(e){var n=oe.K[e];oe.K.splice(e,1),_e(n)},c:oe,r:function(){G("trap!")},q:function(e,n,t,r){return ce(e,n,t,r)},d:G,memory:E,table:S};n.asm({},le,j);var pe=n.___errno_location=function(){return(pe=n.___errno_location=n.asm.t).apply(null,arguments)},de=n._free=function(){return(de=n._free=n.asm.u).apply(null,arguments)},me=n._malloc=function(){return(me=n._malloc=n.asm.v).apply(null,arguments)};n._opus_decode_float=function(){return(n._opus_decode_float=n.asm.w).apply(null,arguments)},n._opus_decoder_create=function(){return(n._opus_decoder_create=n.asm.x).apply(null,arguments)},n._opus_decoder_destroy=function(){return(n._opus_decoder_destroy=n.asm.y).apply(null,arguments)},n._opus_encode_float=function(){return(n._opus_encode_float=n.asm.z).apply(null,arguments)},n._opus_encoder_create=function(){return(n._opus_encoder_create=n.asm.A).apply(null,arguments)},n._opus_encoder_ctl=function(){return(n._opus_encoder_ctl=n.asm.B).apply(null,arguments)},n._speex_resampler_destroy=function(){return(n._speex_resampler_destroy=n.asm.C).apply(null,arguments)},n._speex_resampler_init=function(){return(n._speex_resampler_init=n.asm.D).apply(null,arguments)},n._speex_resampler_process_interleaved_float=function(){return(n._speex_resampler_process_interleaved_float=n.asm.E).apply(null,arguments)};var ye,ge=n.globalCtors=function(){return(ge=n.globalCtors=n.asm.G).apply(null,arguments)},_e=n.stackRestore=function(){return(_e=n.stackRestore=n.asm.H).apply(null,arguments)},he=n.stackSave=function(){return(he=n.stackSave=n.asm.I).apply(null,arguments)};function ve(){function e(){if(!ye&&(ye=!0,n.calledRun=!0,!M)){if(J=!0,W(L),W(U),u(n),n.onRuntimeInitialized&&n.onRuntimeInitialized(),n.postRun)for("function"==typeof n.postRun&&(n.postRun=[n.postRun]);n.postRun.length;){var e=n.postRun.shift();k.unshift(e)}W(k)}}if(!(0<B)){if(n.preRun)for("function"==typeof n.preRun&&(n.preRun=[n.preRun]);n.preRun.length;)K();W(H),0<B||(n.setStatus?(n.setStatus("Running..."),setTimeout((function(){setTimeout((function(){n.setStatus("")}),1),e()}),1)):e())}}if(n.dynCall_vi=function(){return(n.dynCall_vi=n.asm.F).apply(null,arguments)},n.__ZZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwPKvE5__fmt=59826,n.__ZZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwmE5__fmt=59837,X=function e(){ye||ve(),ye||(X=e)},n.run=ve,n.preInit)for("function"==typeof n.preInit&&(n.preInit=[n.preInit]);0<n.preInit.length;)n.preInit.pop()();return ve(),e.ready});e.exports=u}).call(this,"/index.js","/")},function(e,n){e.exports=__WEBPACK_EXTERNAL_MODULE__3__},function(module,exports){module.exports=function(wasmObject,asmjsFilename){return function(options){if(options=options||{},"object"==typeof WebAssembly&&"asm.js"!==options.method)return wasmObject(options);{const readAsync=function(e,n,t){var r=new XMLHttpRequest;r.open("GET",e,!0),r.responseType="text",r.onload=function(){200==r.status||0==r.status&&r.response?n(r.response):t()},r.onerror=t,r.send(null)};return"locateFile"in options&&(asmjsFilename=options.locateFile(asmjsFilename)),new Promise((function(resolve,reject){readAsync(asmjsFilename,(function(script){const exports={};var module=eval(script);module(options).then((function(e){e.then=void 0,resolve(e)}))}))}))}}}}])}));