parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"fcMS":[function(require,module,exports) {
function n(n,o){if(!(n instanceof o))throw new TypeError("Cannot call a class as a function")}module.exports=n;
},{}],"P8NW":[function(require,module,exports) {
function e(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function r(r,n,t){return n&&e(r.prototype,n),t&&e(r,t),r}module.exports=r;
},{}],"E7HD":[function(require,module,exports) {
function e(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}module.exports=e;
},{}],"b9XL":[function(require,module,exports) {
function o(t){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?module.exports=o=function(o){return typeof o}:module.exports=o=function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},o(t)}module.exports=o;
},{}],"pxk2":[function(require,module,exports) {
var e=require("../helpers/typeof"),r=require("./assertThisInitialized");function t(t,i){return!i||"object"!==e(i)&&"function"!=typeof i?r(t):i}module.exports=t;
},{"../helpers/typeof":"b9XL","./assertThisInitialized":"E7HD"}],"UJE0":[function(require,module,exports) {
function t(e){return module.exports=t=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},t(e)}module.exports=t;
},{}],"AkAO":[function(require,module,exports) {
function t(o,e){return module.exports=t=Object.setPrototypeOf||function(t,o){return t.__proto__=o,t},t(o,e)}module.exports=t;
},{}],"d4H2":[function(require,module,exports) {
var e=require("./setPrototypeOf");function r(r,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");r.prototype=Object.create(t&&t.prototype,{constructor:{value:r,writable:!0,configurable:!0}}),t&&e(r,t)}module.exports=r;
},{"./setPrototypeOf":"AkAO"}],"jwEd":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=a(require("@babel/runtime/helpers/classCallCheck")),t=a(require("@babel/runtime/helpers/createClass")),r=a(require("@babel/runtime/helpers/assertThisInitialized")),s=a(require("@babel/runtime/helpers/possibleConstructorReturn")),o=a(require("@babel/runtime/helpers/getPrototypeOf")),n=a(require("@babel/runtime/helpers/inherits"));function a(e){return e&&e.__esModule?e:{default:e}}function i(e){return function(){var t,r=(0,o.default)(e);if(u()){var n=(0,o.default)(this).constructor;t=Reflect.construct(r,arguments,n)}else t=r.apply(this,arguments);return(0,s.default)(this,t)}}function u(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var l=wp.element,c=l.Component,p=l.Fragment,m=l.createElement,h=wp.components.Popover,d=wp,f=d.apiFetch,v=wp.i18n.__,b=function(s){(0,n.default)(a,s);var o=i(a);function a(){var t;return(0,e.default)(this,a),(t=o.apply(this,arguments)).state={search:"",dossiers:[],error:""},t.searchDossierName=t.searchDossierName.bind((0,r.default)(t)),t.selectDossierName=t.selectDossierName.bind((0,r.default)(t)),t}return(0,t.default)(a,[{key:"searchDossierName",value:function(e){var t=this,r=this.state.search;this.setState({search:e}),e.length<r.length&&this.setState({dossiers:[]});var s="/wp/v2/dossiers?parent=0";e&&(s+="&search="+encodeURIComponent(e)),f({path:s}).then(function(e){t.setState({dossiers:e})},function(e){t.setState({error:e.message})})}},{key:"selectDossierName",value:function(e,t){var r=this.props.onSelectDossier;return e.preventDefault(),this.setState({search:"",dossiers:[],error:""}),r({dossierID:t})}},{key:"render",value:function(){var e,t=this,r=this.state,s=r.search,o=r.dossiers,n=v("Nom du dossier","docutheques"),a=v("Entrer le nom du dossier ici…","docutheques");return o.length&&(e=o.map(function(e){return m("button",{type:"button",key:"editor-autocompleters__item-item-"+e.id,role:"option","aria-selected":"true",className:"components-button components-autocomplete__result editor-autocompleters__user",onClick:function(r){return t.selectDossierName(r,e.id)}},m("span",{key:"name",className:"editor-autocompleters__user-name"},e.name))})),m(p,null,m("input",{type:"text",value:s,className:"components-placeholder__input","aria-label":n,placeholder:a,onChange:function(e){return t.searchDossierName(e.target.value)}}),0!==o.length&&m(h,{className:"components-autocomplete__popover",focusOnMount:!1,position:"bottom left"},m("div",{className:"components-autocomplete__results"},e)))}}]),a}(c),_=b;exports.default=_;
},{"@babel/runtime/helpers/classCallCheck":"fcMS","@babel/runtime/helpers/createClass":"P8NW","@babel/runtime/helpers/assertThisInitialized":"E7HD","@babel/runtime/helpers/possibleConstructorReturn":"pxk2","@babel/runtime/helpers/getPrototypeOf":"UJE0","@babel/runtime/helpers/inherits":"d4H2"}],"sPO8":[function(require,module,exports) {
"use strict";var e=t(require("./components/autocompleter"));function t(e){return e&&e.__esModule?e:{default:e}}var o=wp.blocks.registerBlockType,u=wp.element,r=u.createElement,l=u.Fragment,s=wp.components,n=s.Placeholder,i=s.Disabled,a=s.Toolbar,c=s.ToolbarButton,d=s.PanelBody,p=s.SelectControl,h=wp.blockEditor,b=h.BlockControls,m=h.InspectorControls,q=wp.editor.ServerSideRender,f=wp.i18n.__,g=function(t){var o=t.attributes,u=t.setAttributes,s=o.orderBy;return o.dossierID?r(l,null,r(b,null,r(a,null,r(c,{icon:"edit",title:f("Choisir une autre DocuThèque","docutheques"),onClick:function(){u({dossierID:0})}}))),r(m,null,r(d,{title:f("Réglages","docutheques"),initialOpen:!0},r(p,{label:f("Classer les documents et dossiers selon leur :","reception"),value:s,onChange:function(e){u({orderBy:e})},options:[{label:f("date de modification (31 - 1)","docutheques"),value:"date"},{label:f("nom (A - Z)","docutheques"),value:"name"}]}))),r(i,null,r(q,{block:"docutheques/browser",attributes:o}))):r(n,{icon:"portfolio",label:f("DocuThèques","docutheques"),instructions:f("Commencer à saisir le nom de la DocuThèque que vous souhaitez intégrer dans cette publication.","docutheques")},r(e.default,{onSelectDossier:u}))};o("docutheques/browser",{supports:{className:!1,anchor:!1,multiple:!1,reusable:!1},title:f("DocuTheques","docutheques"),description:f("Explorateur de documents.","docutheques"),icon:"portfolio",category:"widgets",attributes:{dossierID:{type:"integer",default:0},orderBy:{type:"string",default:"date",enum:["date","name"]}},edit:g});
},{"./components/autocompleter":"jwEd"}]},{},["sPO8"], null)