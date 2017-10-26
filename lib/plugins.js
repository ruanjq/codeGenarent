(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});

    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = devicePixelRatio;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        // if (width / dpr > 540) {
        //     width = 540 * dpr;
        // }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }


    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));



/*!
 *  julyui.drag - jQuery JulyUI
 *  Author:     july
 *  version:    0.0.5;
 */
(function(e) {
    var b = null,
        g = eventMove = eventStop = "",
        a = "selectstart.drag",
        d = {};

    function f(l) {
        var i = y = 0;
        var k = false;
        if (b) {
            var j = l.originalEvent.targetTouches;
            if (j) { i = j[0]["pageX"];
                y = j[0]["pageY"];
                k = true } }
        if (!k) { i = l.pageX;
            y = l.pageY }
        return { x: i, y: y } }

    function h(i) {
        var k = parseInt(i.css("left")) || 0;
        var j = parseInt(i.css("top")) || 0;
        return { left: k, top: j } }
    var c = { initConfig: function() {
            if (b == null) { b = "ontouchend" in document }
            if (b) { g = "touchstart.drag", eventMove = "touchmove.drag", eventStop = "touchend.drag" } else { g = "mousedown.drag", eventMove = "mousemove.drag", eventStop = "mouseup.drag" } }, init: function(j) {
            var i = { x: j.x, y: j.y, position: j.position, isLimit: j.isLimit, maxLeft: 0, maxTop: 0, axis: j.axis, self: e(this) };
            if (i.isLimit) {
                if (j.position == "relative" || j.position == "fixed") { i.parent = e(window) } else { i.parent = e(this).parent() }
                i.width = e(this).outerWidth();
                i.height = e(this).outerHeight();
                i.maxLeft = i.parent.outerWidth() - i.width;
                i.maxTop = i.parent.outerHeight() - i.height }
            if (typeof j.handler == "undefined" || j.handler == null) { i.handler = i.self } else { i.handler = (typeof j.handler == "string" ? e(j.handler, this) : j.handler) }
            if (e.isFunction(j.onStart)) { i.onStart = j.onStart }
            if (e.isFunction(j.onDrag)) { i.onDrag = j.onDrag }
            if (e.isFunction(j.onStop)) { i.onStop = j.onStop }
            if (j.position != "") { i.self.css({ position: j.position }) }
            if (!i.isLimit) { i.self.css({ left: i.x, top: i.y }) }
            if (j.disabled) { i.handler.css({ cursor: "default" }).unbind(g) } else { i.handler.css({ cursor: j.cursor }).bind(g, i, c.doStart) } }, doStart: function(j) { d = j.data;
            var i = f(j),
                k = h(d.self);
            d.initLeft = k.left;
            d.initTop = k.top;
            d.left = k.left;
            d.top = k.top;
            d.x = i.x;
            d.y = i.y;
            e(document).bind(a, function() {
                return false });
            e(document).bind(eventMove, d, c.doMove);
            e(document).bind(eventStop, c.doStop);
            if (d.onStart) { d.onStart.call(d.self, d) }
            return false }, doMove: function(l) {
            var k = f(l);
            d = l.data;
            var j = d.initLeft + k.x - d.x;
            var i = d.initTop + k.y - d.y;
            if (d.isLimit) {
                if (j < 0) { j = 0 } else {
                    if (j > d.maxLeft) { j = d.maxLeft } }
                if (i < 0) { i = 0 } else {
                    if (i > d.maxTop) { i = d.maxTop } } }
            d.left = j;
            d.top = i;
            if (d.axis == "x") { d.self.css({ left: j }) } else {
                if (d.axis == "y") { d.self.css({ top: i }) } else { d.self.css({ left: j, top: i }) } }
            if (d.onDrag) { d.onDrag.call(d.self, d) }
            return false }, doStop: function() { e(document).unbind(a).unbind(eventMove).unbind(eventStop);
            if (d.onStop) { d.onStop.call(d.self, d) }
            return false } };
    e.fn.julyuiDrag = function(i) { c.initConfig();
        if (typeof i == "string") {
            if (i == "enable") {
                return this.each(function() { e(this).julyuiDrag({ disabled: false }) }) } else {
                if (i == "disable") {
                    return this.each(function() { e(this).julyuiDrag({ disabled: true }) }) } } }
        return this.each(function() {
            var k = e(this);
            var j = e.extend(true, {}, e.fn.julyuiDrag.defaults, i);
            c.init.call(this, j);
            return this }) };
    e.fn.julyuiDrag.defaults = { x: 0, y: 0, handler: null, position: "relative", isLimit: false, cursor: "move", disabled: false, axis: "", onStart: null, onDrag: null, onStop: null } }(jQuery));


/*!
*   julyui.drag - jQuery JulyUI
*   julyui.dragResize - jQuery JulyUI
*   Author:     july
*   version:    0.0.1;
*/
(function(e){var b=null,g=eventMove=eventStop="",a="selectstart.drag",d={};function f(l){var i=y=0;var k=false;if(b){var j=l.originalEvent.targetTouches;if(j){i=j[0]["pageX"];y=j[0]["pageY"];k=true}}if(!k){i=l.pageX;y=l.pageY}return{x:i,y:y}}function h(i){var k=parseInt(i.css("left"))||0;var j=parseInt(i.css("top"))||0;return{left:k,top:j}}var c={initConfig:function(){if(b==null){b="ontouchend" in document}if(b){g="touchstart.drag",eventMove="touchmove.drag",eventStop="touchend.drag"}else{g="mousedown.drag",eventMove="mousemove.drag",eventStop="mouseup.drag"}},init:function(k){var j=e(this);var i={left:0,top:0,x:0,y:0,axis:k.axis,self:e(this)};if(typeof k.handler=="undefined"||k.handler==null){alert("handler not defined");return false}else{i.handler=(typeof k.handler=="string"?e(k.handler,this):handler)}i.width=j.width();i.height=j.height();i.initWidth=i.width;i.initHeight=i.height;i.maxWidth=k.maxWidth;i.maxHeight=k.maxHeight;i.minWidth=k.minWidth;if(i.minWidth<=0){i.minWidth=i.handler.outerWidth()}i.minHeight=k.minHeight;if(i.minHeight<=0){i.minHeight=i.handler.outerHeight()}if(e.isFunction(k.onStart)){i.onStart=k.onStart}if(e.isFunction(k.onDrag)){i.onDrag=k.onDrag}if(e.isFunction(k.onStop)){i.onStop=k.onStop}if(k.disabled){i.handler.css({cursor:"default"}).unbind(g)}else{i.handler.css({cursor:k.cursor}).bind(g,i,c.doStart)}},doStart:function(j){d=j.data;var i=f(j),k=h(d.self);d.left=k.left;d.top=k.top;d.x=i.x;d.y=i.y;d.initWidth=d.self.width();d.initHeight=d.self.height();e(document).bind(a,function(){return false});e(document).bind(eventMove,d,c.doMove);e(document).bind(eventStop,c.doStop);if(d.onStart){d.onStart.call(d.self,d)}return false},doMove:function(j){var i=f(j);d=j.data;d.width=Math.max(i.x-d.x+d.initWidth,0);d.height=Math.max(i.y-d.y+d.initHeight,0);if(d.minWidth>0&&d.width<d.minWidth){d.width=d.minWidth}if(d.minHeight>0&&d.height<d.minHeight){d.height=d.minHeight}if(d.maxWidth>0&&d.width>d.maxWidth){d.width=d.maxWidth}if(d.maxHeight>0&&d.height>d.maxHeight){d.height=d.maxHeight}if(d.axis=="x"){d.self.css({width:d.width})}else{if(d.axis=="y"){d.self.css({height:d.height})}else{d.self.css({width:d.width,height:d.height})}}if(d.onDrag){d.onDrag.call(d.self,d)}return false},doStop:function(){e(document).unbind(a).unbind(eventMove).unbind(eventStop);if(d.onStop){d.onStop.call(d.self,d)}return false}};e.fn.julyuiDragResize=function(i){c.initConfig();if(typeof i=="string"){if(i=="enable"){return this.each(function(){e(this).julyuiDragResize({disabled:false})})}else{if(i=="disable"){return this.each(function(){e(this).julyuiDragResize({disabled:true})})}}}return this.each(function(){var k=e(this);var j=e.extend(true,{},e.fn.julyuiDragResize.defaults,i);if(j.axis=="x"){j.cursor="w-resize"}else{if(j.axis=="y"){j.cursor="s-resize"}else{j.cursor="se-resize"}}c.init.call(this,j);return this})};e.fn.julyuiDragResize.defaults={handler:".dragresize",maxWidth:0,maxHeight:0,minWidth:0,minHeight:0,disabled:false,axis:"",onStart:null,onDrag:null,onStop:null}}(jQuery));


/*!
 * clipboard.js v1.5.12
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.Clipboard=t()}}(function(){var t,e,n;return function t(e,n,o){function i(a,c){if(!n[a]){if(!e[a]){var s="function"==typeof require&&require;if(!c&&s)return s(a,!0);if(r)return r(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(t){var n=e[a][1][t];return i(n?n:t)},u,u.exports,t,e,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(t,e,n){var o=t("matches-selector");e.exports=function(t,e,n){for(var i=n?t:t.parentNode;i&&i!==document;){if(o(i,e))return i;i=i.parentNode}}},{"matches-selector":5}],2:[function(t,e,n){function o(t,e,n,o,r){var a=i.apply(this,arguments);return t.addEventListener(n,a,r),{destroy:function(){t.removeEventListener(n,a,r)}}}function i(t,e,n,o){return function(n){n.delegateTarget=r(n.target,e,!0),n.delegateTarget&&o.call(t,n)}}var r=t("closest");e.exports=o},{closest:1}],3:[function(t,e,n){n.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},n.nodeList=function(t){var e=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===e||"[object HTMLCollection]"===e)&&"length"in t&&(0===t.length||n.node(t[0]))},n.string=function(t){return"string"==typeof t||t instanceof String},n.fn=function(t){var e=Object.prototype.toString.call(t);return"[object Function]"===e}},{}],4:[function(t,e,n){function o(t,e,n){if(!t&&!e&&!n)throw new Error("Missing required arguments");if(!c.string(e))throw new TypeError("Second argument must be a String");if(!c.fn(n))throw new TypeError("Third argument must be a Function");if(c.node(t))return i(t,e,n);if(c.nodeList(t))return r(t,e,n);if(c.string(t))return a(t,e,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function i(t,e,n){return t.addEventListener(e,n),{destroy:function(){t.removeEventListener(e,n)}}}function r(t,e,n){return Array.prototype.forEach.call(t,function(t){t.addEventListener(e,n)}),{destroy:function(){Array.prototype.forEach.call(t,function(t){t.removeEventListener(e,n)})}}}function a(t,e,n){return s(document.body,t,e,n)}var c=t("./is"),s=t("delegate");e.exports=o},{"./is":3,delegate:2}],5:[function(t,e,n){function o(t,e){if(r)return r.call(t,e);for(var n=t.parentNode.querySelectorAll(e),o=0;o<n.length;++o)if(n[o]==t)return!0;return!1}var i=Element.prototype,r=i.matchesSelector||i.webkitMatchesSelector||i.mozMatchesSelector||i.msMatchesSelector||i.oMatchesSelector;e.exports=o},{}],6:[function(t,e,n){function o(t){var e;if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName)t.focus(),t.setSelectionRange(0,t.value.length),e=t.value;else{t.hasAttribute("contenteditable")&&t.focus();var n=window.getSelection(),o=document.createRange();o.selectNodeContents(t),n.removeAllRanges(),n.addRange(o),e=n.toString()}return e}e.exports=o},{}],7:[function(t,e,n){function o(){}o.prototype={on:function(t,e,n){var o=this.e||(this.e={});return(o[t]||(o[t]=[])).push({fn:e,ctx:n}),this},once:function(t,e,n){function o(){i.off(t,o),e.apply(n,arguments)}var i=this;return o._=e,this.on(t,o,n)},emit:function(t){var e=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),o=0,i=n.length;for(o;i>o;o++)n[o].fn.apply(n[o].ctx,e);return this},off:function(t,e){var n=this.e||(this.e={}),o=n[t],i=[];if(o&&e)for(var r=0,a=o.length;a>r;r++)o[r].fn!==e&&o[r].fn._!==e&&i.push(o[r]);return i.length?n[t]=i:delete n[t],this}},e.exports=o},{}],8:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","select"],r);else if("undefined"!=typeof o)r(n,e("select"));else{var a={exports:{}};r(a,i.select),i.clipboardAction=a.exports}}(this,function(t,e){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=n(e),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},a=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),c=function(){function t(e){o(this,t),this.resolveOptions(e),this.initSelection()}return t.prototype.resolveOptions=function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action=e.action,this.emitter=e.emitter,this.target=e.target,this.text=e.text,this.trigger=e.trigger,this.selectedText=""},t.prototype.initSelection=function t(){this.text?this.selectFake():this.target&&this.selectTarget()},t.prototype.selectFake=function t(){var e=this,n="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return e.removeFake()},this.fakeHandler=document.body.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[n?"right":"left"]="-9999px",this.fakeElem.style.top=(window.pageYOffset||document.documentElement.scrollTop)+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,document.body.appendChild(this.fakeElem),this.selectedText=(0,i.default)(this.fakeElem),this.copyText()},t.prototype.removeFake=function t(){this.fakeHandler&&(document.body.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(document.body.removeChild(this.fakeElem),this.fakeElem=null)},t.prototype.selectTarget=function t(){this.selectedText=(0,i.default)(this.target),this.copyText()},t.prototype.copyText=function t(){var e=void 0;try{e=document.execCommand(this.action)}catch(n){e=!1}this.handleResult(e)},t.prototype.handleResult=function t(e){e?this.emitter.emit("success",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)}):this.emitter.emit("error",{action:this.action,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})},t.prototype.clearSelection=function t(){this.target&&this.target.blur(),window.getSelection().removeAllRanges()},t.prototype.destroy=function t(){this.removeFake()},a(t,[{key:"action",set:function t(){var e=arguments.length<=0||void 0===arguments[0]?"copy":arguments[0];if(this._action=e,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function t(){return this._action}},{key:"target",set:function t(e){if(void 0!==e){if(!e||"object"!==("undefined"==typeof e?"undefined":r(e))||1!==e.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&e.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(e.hasAttribute("readonly")||e.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=e}},get:function t(){return this._target}}]),t}();t.exports=c})},{select:6}],9:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","./clipboard-action","tiny-emitter","good-listener"],r);else if("undefined"!=typeof o)r(n,e("./clipboard-action"),e("tiny-emitter"),e("good-listener"));else{var a={exports:{}};r(a,i.clipboardAction,i.tinyEmitter,i.goodListener),i.clipboard=a.exports}}(this,function(t,e,n,o){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function s(t,e){var n="data-clipboard-"+t;if(e.hasAttribute(n))return e.getAttribute(n)}var l=i(e),u=i(n),f=i(o),d=function(t){function e(n,o){r(this,e);var i=a(this,t.call(this));return i.resolveOptions(o),i.listenClick(n),i}return c(e,t),e.prototype.resolveOptions=function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.action="function"==typeof e.action?e.action:this.defaultAction,this.target="function"==typeof e.target?e.target:this.defaultTarget,this.text="function"==typeof e.text?e.text:this.defaultText},e.prototype.listenClick=function t(e){var n=this;this.listener=(0,f.default)(e,"click",function(t){return n.onClick(t)})},e.prototype.onClick=function t(e){var n=e.delegateTarget||e.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new l.default({action:this.action(n),target:this.target(n),text:this.text(n),trigger:n,emitter:this})},e.prototype.defaultAction=function t(e){return s("action",e)},e.prototype.defaultTarget=function t(e){var n=s("target",e);return n?document.querySelector(n):void 0},e.prototype.defaultText=function t(e){return s("text",e)},e.prototype.destroy=function t(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)},e}(u.default);t.exports=d})},{"./clipboard-action":8,"good-listener":4,"tiny-emitter":7}]},{},[9])(9)});