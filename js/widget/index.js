parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"R0az":[function(require,module,exports) {
function e(e){return a(e)||r(e)||n(e)||t()}function t(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(e,t){if(e){if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(e,t):void 0}}function r(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function a(e){if(Array.isArray(e))return o(e)}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t,n){return t&&s(e.prototype,t),n&&s(e,n),e}var c=lodash,h=c.filter,d=c.find,l=c.reject,p=c.eachRight,f=c.concat,m=c.template,g=c.omit,v=function(){function t(e){var n=e.restRoot,r=e.restNonce,a=e.hierarchy,o=e.documentsTotal,s=e.currentParentId,u=e.dossierHasNoItems;i(this,t),this.dossiers=JSON.parse(a),this.root=n,this.nonce=r,this.current=s,this.docuThequeId=s,this.noItems=u,this.itemsContainer=document.querySelector(".docutheque-elements"),this.docuTheque=document.querySelector(".docutheque"),this.breadCrumbs=document.querySelector("#fil-ariane-docutheque-"+this.docuThequeId);var c=JSON.parse(o);this.pagination=[{parent:s,displayedPages:1,totalItems:c["X-WP-Total"],totalPages:c["X-WP-TotalPages"]}]}return u(t,[{key:"getTemplate",value:function(e){return m(document.querySelector("#tmpl-"+e).innerHTML,{evaluate:/<#([\s\S]+?)#>/g,interpolate:/\{\{\{([\s\S]+?)\}\}\}/g,escape:/\{\{([^\}]+?)\}\}(?!\})/g,variable:"data"})}},{key:"getAllParents",value:function(t){var n=this,r=this.dossiers,a=d(r,["id",t]),o=h(r,{id:a.parent});return o.forEach(function(t){if(0!==t.parent){var r=n.getAllParents(t.id);o=[].concat(e(o),e(r))}}),l(o,["id",this.docuThequeId])}},{key:"updatePagination",value:function(t,n,r,a){this.pagination=[].concat(e(l(this.paginaiton,["parent",t])),[{parent:t,displayedPages:n,totalItems:r,totalPages:a}])}},{key:"openDossier",value:function(e){var t=parseInt(e.getAttribute("href").replace("#dossier-",""),10),n=d(this.pagination,{parent:t});return n&&n.parent&&this.updatePagination(n.parent,1,n.totalItems,n.totalPages),this.fetchItems(t)}},{key:"openDocutheque",value:function(e){var t=parseInt(e.getAttribute("href").replace("#docutheque-",""),10),n=d(this.pagination,{parent:t});return n&&n.parent&&this.updatePagination(n.parent,1,n.totalItems,n.totalPages),this.fetchItems(t)}},{key:"fetchItems",value:function(t){var n=this,r=h(this.dossiers,{parent:t});this.current=t;var a=[];if(this.breadCrumbs.innerHTML="",this.current!==this.docuThequeId){var o=this.getAllParents(t),i=d(this.dossiers,["id",t]),s=this.getTemplate("docutheque-breadcrumbs");p(o,function(t){t.link="#dossier-"+t.id,a=[].concat(e(a),[t])}),(a=[].concat(e(a),[g(i,["link"])])).forEach(function(e,t){0===t?n.breadCrumbs.innerHTML=s(e):document.querySelector("#sous-dossier-"+a[t-1].id).innerHTML=s(e)})}fetch(this.root+"wp/v2/media?dossiers[]="+t+"&per_page=20&docutheques_widget=1&context=view",{method:"GET",headers:{"X-WP-Nonce":this.nonce}}).then(function(t){return d(n.pagination,{parent:n.current})||(n.pagination=[{parent:n.current,displayedPages:1,totalItems:parseInt(t.headers.get("X-WP-Total"),10),totalPages:parseInt(t.headers.get("X-WP-TotalPages"),10)}].concat(e(n.pagination))),t}).then(function(e){return e.json()}).then(function(e){var t=f(r,e),a=n.getTemplate("docutheque-element");n.itemsContainer.innerHTML="",t.length?t.forEach(function(e){n.itemsContainer.innerHTML+=a(e)}):n.itemsContainer.innerHTML=a({noItems:n.noItems})})}},{key:"fetchMoreItems",value:function(e,t,n,r){var a=this;this.updatePagination(e,t,n,r),fetch(this.root+"wp/v2/media?dossiers[]="+e+"&per_page=20&page="+t+"&docutheques_widget=1&context=view",{method:"GET",headers:{"X-WP-Nonce":this.nonce}}).then(function(e){return e.json()}).then(function(e){var t=a.getTemplate("docutheque-element");e.length&&e.forEach(function(e){a.itemsContainer.innerHTML+=t(e)})})}},{key:"start",value:function(){var e=this;this.docuTheque.addEventListener("click",function(t){var n=t.target;"A"!==n.nodeName&&"A"===n.parentNode.nodeName&&(n=n.parentNode),n.classList.contains("ouvre-dossier")?(t.preventDefault(),e.openDossier(n)):n.classList.contains("racine-docutheque")&&(t.preventDefault(),e.openDocutheque(n))}),this.itemsContainer.addEventListener("scroll",function(t){var n=t.target,r=n.querySelectorAll(".docutheque-document");if(n.scrollHeight-n.scrollTop===n.clientHeight){var a=d(e.pagination,{parent:e.current}),o=a.parent,i=a.displayedPages,s=a.totalItems,u=a.totalPages;o&&r.length!==s&&e.fetchMoreItems(o,i+1,s,u)}})}}]),t}(),y=new v(DocuTheques.settings);"loading"===document.readyState?document.addEventListener("DOMContentLoaded",y.start()):y.start();
},{}]},{},["R0az"], null)