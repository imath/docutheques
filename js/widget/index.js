parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"R0az":[function(require,module,exports) {
function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}var r=lodash,o=r.filter,a=r.concat,i=r.template,s=function(){function t(n){var r=n.restRoot,o=n.restNonce,a=n.hierarchy;e(this,t),this.dossiers=JSON.parse(a),this.root=r,this.nonce=o,this.itemsContainer=document.querySelector(".docutheque-elements")}return n(t,[{key:"getTemplate",value:function(e){return i(document.querySelector("#tmpl-"+e).innerHTML,{evaluate:/<#([\s\S]+?)#>/g,interpolate:/\{\{\{([\s\S]+?)\}\}\}/g,escape:/\{\{([^\}]+?)\}\}(?!\})/g,variable:"data"})}},{key:"openDossier",value:function(e){var t=this,n=parseInt(e.getAttribute("href").replace("#dossier-",""),10),r=o(this.dossiers,{parent:n});fetch(this.root+"wp/v2/media?dossiers[]="+n+"&per_page=20&docutheques_widget=1&context=view",{method:"GET",headers:{"X-WP-Nonce":this.nonce}}).then(function(e){return e.json()}).then(function(e){var n=a(r,e),o=t.getTemplate("docutheque-element");t.itemsContainer.innerHTML="",n.forEach(function(e){t.itemsContainer.innerHTML+=o(e)})})}},{key:"start",value:function(){var e=this;this.itemsContainer.addEventListener("click",function(t){var n=t.target;"A"!==n.nodeName&&"A"===n.parentNode.nodeName&&(n=n.parentNode),n.classList.contains("ouvre-dossier")&&(t.preventDefault(),e.openDossier(n))})}}]),t}(),c=new s(DocuTheques.settings);"loading"===document.readyState?document.addEventListener("DOMContentLoaded",c.start()):c.start();
},{}]},{},["R0az"], null)