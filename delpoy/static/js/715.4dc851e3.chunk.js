"use strict";(self.webpackChunkaccounts_frontend=self.webpackChunkaccounts_frontend||[]).push([[715],{715:function(t,e,i){i.d(e,{v:function(){return y}});var n=i(2791),s=i(5854),r=i(9025),o=i(3574);function u(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function l(t,e){return l=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},l(t,e)}function h(t){return h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},h(t)}function p(t,e){if(e&&("object"===h(e)||"function"===typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return a(t)}function f(t){return f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},f(t)}function c(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function d(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function v(t){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,n=f(t);if(e){var s=f(this).constructor;i=Reflect.construct(n,arguments,s)}else i=n.apply(this,arguments);return p(this,i)}}var y=function(t){!function(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&l(t,e)}(f,t);var e,i,h,p=v(f);function f(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,f),(e=p.call(this,t)).onFocus=e.onFocus.bind(a(e)),e.onBlur=e.onBlur.bind(a(e)),e.onKeyDown=e.onKeyDown.bind(a(e)),e.onKeyPress=e.onKeyPress.bind(a(e)),e.onInput=e.onInput.bind(a(e)),e.handleInputChange=e.handleInputChange.bind(a(e)),e.inputRef=(0,n.createRef)(e.props.inputRef),e}return e=f,i=[{key:"caret",value:function(t,e){var i,n,s,r=this.inputRef&&this.inputRef.current;if(r&&r.offsetParent&&r===document.activeElement)return"number"!==typeof t?(r.setSelectionRange?(n=r.selectionStart,s=r.selectionEnd):document.selection&&document.selection.createRange&&(s=(n=0-(i=document.selection.createRange()).duplicate().moveStart("character",-1e5))+i.text.length),{begin:n,end:s}):(n=t,s="number"===typeof e?e:n,void(r.setSelectionRange?r.setSelectionRange(n,s):r.createTextRange&&((i=r.createTextRange()).collapse(!0),i.moveEnd("character",s),i.moveStart("character",n),i.select())))}},{key:"isCompleted",value:function(){for(var t=this.firstNonMaskPos;t<=this.lastRequiredNonMaskPos;t++)if(this.tests[t]&&this.buffer[t]===this.getPlaceholder(t))return!1;return!0}},{key:"getPlaceholder",value:function(t){return t<this.props.slotChar.length?this.props.slotChar.charAt(t):this.props.slotChar.charAt(0)}},{key:"getValue",value:function(){return this.props.unmask?this.getUnmaskedValue():this.inputRef&&this.inputRef.current&&this.inputRef.current.value}},{key:"seekNext",value:function(t){for(;++t<this.len&&!this.tests[t];);return t}},{key:"seekPrev",value:function(t){for(;--t>=0&&!this.tests[t];);return t}},{key:"shiftL",value:function(t,e){var i,n;if(!(t<0)){for(i=t,n=this.seekNext(e);i<this.len;i++)if(this.tests[i]){if(!(n<this.len&&this.tests[i].test(this.buffer[n])))break;this.buffer[i]=this.buffer[n],this.buffer[n]=this.getPlaceholder(n),n=this.seekNext(n)}this.writeBuffer(),this.caret(Math.max(this.firstNonMaskPos,t))}}},{key:"shiftR",value:function(t){var e,i,n,s;for(e=t,i=this.getPlaceholder(t);e<this.len;e++)if(this.tests[e]){if(n=this.seekNext(e),s=this.buffer[e],this.buffer[e]=i,!(n<this.len&&this.tests[n].test(s)))break;i=s}}},{key:"handleAndroidInput",value:function(t){var e=this.inputRef.current.value,i=this.caret();if(this.oldVal&&this.oldVal.length&&this.oldVal.length>e.length){for(this.checkVal(!0);i.begin>0&&!this.tests[i.begin-1];)i.begin--;if(0===i.begin)for(;i.begin<this.firstNonMaskPos&&!this.tests[i.begin];)i.begin++;this.caret(i.begin,i.begin)}else{for(this.checkVal(!0);i.begin<this.len&&!this.tests[i.begin];)i.begin++;this.caret(i.begin,i.begin)}this.props.onComplete&&this.isCompleted()&&this.props.onComplete({originalEvent:t,value:this.getValue()})}},{key:"onBlur",value:function(t){if(this.focus=!1,this.checkVal(),this.updateModel(t),this.updateFilledState(),this.props.onBlur&&this.props.onBlur(t),this.inputRef.current.value!==this.focusText){var e=document.createEvent("HTMLEvents");e.initEvent("change",!0,!1),this.inputRef.current.dispatchEvent(e)}}},{key:"onKeyDown",value:function(t){if(!this.props.readOnly){var e,i,n,r=t.which||t.keyCode,o=/iphone/i.test(s.p7.getUserAgent());this.oldVal=this.inputRef.current.value,8===r||46===r||o&&127===r?(i=(e=this.caret()).begin,(n=e.end)-i===0&&(i=46!==r?this.seekPrev(i):n=this.seekNext(i-1),n=46===r?this.seekNext(n):n),this.clearBuffer(i,n),this.shiftL(i,n-1),this.updateModel(t),t.preventDefault()):13===r?(this.onBlur(t),this.updateModel(t)):27===r&&(this.inputRef.current.value=this.focusText,this.caret(0,this.checkVal()),this.updateModel(t),t.preventDefault())}}},{key:"onKeyPress",value:function(t){var e=this;if(!this.props.readOnly){var i,n,r,o,u=t.which||t.keyCode,a=this.caret();t.ctrlKey||t.altKey||t.metaKey||u<32||(u&&13!==u&&(a.end-a.begin!==0&&(this.clearBuffer(a.begin,a.end),this.shiftL(a.begin,a.end-1)),(i=this.seekNext(a.begin-1))<this.len&&(n=String.fromCharCode(u),this.tests[i].test(n))&&(this.shiftR(i),this.buffer[i]=n,this.writeBuffer(),r=this.seekNext(i),/android/i.test(s.p7.getUserAgent())?setTimeout((function(){e.caret(r)}),0):this.caret(r),a.begin<=this.lastRequiredNonMaskPos&&(o=this.isCompleted())),t.preventDefault()),this.updateModel(t),this.props.onComplete&&o&&this.props.onComplete({originalEvent:t,value:this.getValue()}))}}},{key:"clearBuffer",value:function(t,e){var i;for(i=t;i<e&&i<this.len;i++)this.tests[i]&&(this.buffer[i]=this.getPlaceholder(i))}},{key:"writeBuffer",value:function(){this.inputRef.current.value=this.buffer.join("")}},{key:"checkVal",value:function(t){this.isValueChecked=!0;var e,i,n,s=this.inputRef.current.value,r=-1;for(e=0,n=0;e<this.len;e++)if(this.tests[e]){for(this.buffer[e]=this.getPlaceholder(e);n++<s.length;)if(i=s.charAt(n-1),this.tests[e].test(i)){this.buffer[e]=i,r=e;break}if(n>s.length){this.clearBuffer(e+1,this.len);break}}else this.buffer[e]===s.charAt(n)&&n++,e<this.partialPosition&&(r=e);return t?this.writeBuffer():r+1<this.partialPosition?this.props.autoClear||this.buffer.join("")===this.defaultBuffer?(this.inputRef.current.value&&(this.inputRef.current.value=""),this.clearBuffer(0,this.len)):this.writeBuffer():(this.writeBuffer(),this.inputRef.current.value=this.inputRef.current.value.substring(0,r+1)),this.partialPosition?e:this.firstNonMaskPos}},{key:"onFocus",value:function(t){var e,i=this;this.props.readOnly||(this.focus=!0,clearTimeout(this.caretTimeoutId),this.focusText=this.inputRef.current.value,e=this.checkVal(),this.caretTimeoutId=setTimeout((function(){i.inputRef.current===document.activeElement&&(i.writeBuffer(),e===i.props.mask.replace("?","").length?i.caret(0,e):i.caret(e),i.updateFilledState())}),10),this.props.onFocus&&this.props.onFocus(t))}},{key:"onInput",value:function(t){this.androidChrome?this.handleAndroidInput(t):this.handleInputChange(t)}},{key:"handleInputChange",value:function(t){if(!this.props.readOnly){var e=this.checkVal(!0);this.caret(e),this.updateModel(t),this.props.onComplete&&this.isCompleted()&&this.props.onComplete({originalEvent:t,value:this.getValue()})}}},{key:"getUnmaskedValue",value:function(){for(var t=[],e=0;e<this.buffer.length;e++){var i=this.buffer[e];this.tests[e]&&i!==this.getPlaceholder(e)&&t.push(i)}return t.join("")}},{key:"updateModel",value:function(t){if(this.props.onChange){var e=this.props.unmask?this.getUnmaskedValue():t&&t.target.value;this.props.onChange({originalEvent:t,value:this.defaultBuffer!==e?e:"",stopPropagation:function(){},preventDefault:function(){},target:{name:this.props.name,id:this.props.id,value:this.defaultBuffer!==e?e:""}})}}},{key:"updateFilledState",value:function(){this.inputRef&&this.inputRef.current&&this.inputRef.current.value&&this.inputRef.current.value.length>0?s.p7.addClass(this.inputRef.current,"p-filled"):s.p7.removeClass(this.inputRef.current,"p-filled")}},{key:"updateValue",value:function(t){var e,i=this;return this.inputRef&&this.inputRef.current&&(null==this.props.value?this.inputRef.current.value="":(this.inputRef.current.value=this.props.value,e=this.checkVal(t),setTimeout((function(){if(i.inputRef&&i.inputRef.current)return i.writeBuffer(),i.checkVal(t)}),10)),this.focusText=this.inputRef.current.value),this.updateFilledState(),e}},{key:"isValueUpdated",value:function(){return this.props.unmask?this.props.value!==this.getUnmaskedValue():this.defaultBuffer!==this.inputRef.current.value&&this.inputRef.current.value!==this.props.value}},{key:"init",value:function(){if(this.props.mask){this.tests=[],this.partialPosition=this.props.mask.length,this.len=this.props.mask.length,this.firstNonMaskPos=null,this.defs={9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"};var t=s.p7.getUserAgent();this.androidChrome=/chrome/i.test(t)&&/android/i.test(t);for(var e=this.props.mask.split(""),i=0;i<e.length;i++){var n=e[i];"?"===n?(this.len--,this.partialPosition=i):this.defs[n]?(this.tests.push(new RegExp(this.defs[n])),null===this.firstNonMaskPos&&(this.firstNonMaskPos=this.tests.length-1),i<this.partialPosition&&(this.lastRequiredNonMaskPos=this.tests.length-1)):this.tests.push(null)}this.buffer=[];for(var r=0;r<e.length;r++){var o=e[r];"?"!==o&&(this.defs[o]?this.buffer.push(this.getPlaceholder(r)):this.buffer.push(o))}this.defaultBuffer=this.buffer.join("")}}},{key:"updateInputRef",value:function(){var t=this.props.inputRef;t&&("function"===typeof t?t(this.inputRef.current):t.current=this.inputRef.current)}},{key:"componentDidMount",value:function(){this.updateInputRef(),this.init(),this.updateValue(),this.props.tooltip&&this.renderTooltip()}},{key:"componentDidUpdate",value:function(t){t.tooltip===this.props.tooltip&&t.tooltipOptions===this.props.tooltipOptions||(this.tooltip?this.tooltip.update(function(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?d(Object(i),!0).forEach((function(e){c(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):d(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}({content:this.props.tooltip},this.props.tooltipOptions||{})):this.renderTooltip()),this.isValueUpdated()&&this.updateValue(),t.mask!==this.props.mask&&(this.init(),this.caret(this.updateValue(!0)),this.updateModel())}},{key:"componentWillUnmount",value:function(){this.tooltip&&(this.tooltip.destroy(),this.tooltip=null)}},{key:"renderTooltip",value:function(){this.tooltip=(0,o.I)({target:this.inputRef.current,content:this.props.tooltip,options:this.props.tooltipOptions})}},{key:"render",value:function(){var t=(0,s.AK)("p-inputmask",this.props.className);return n.createElement(r.o,{id:this.props.id,ref:this.inputRef,type:this.props.type,name:this.props.name,style:this.props.style,className:t,placeholder:this.props.placeholder,size:this.props.size,maxLength:this.props.maxLength,tabIndex:this.props.tabIndex,disabled:this.props.disabled,readOnly:this.props.readOnly,onFocus:this.onFocus,onBlur:this.onBlur,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress,onInput:this.onInput,onPaste:this.handleInputChange,required:this.props.required,"aria-labelledby":this.props.ariaLabelledBy})}}],i&&u(e.prototype,i),h&&u(e,h),Object.defineProperty(e,"prototype",{writable:!1}),f}(n.Component);c(y,"defaultProps",{id:null,inputRef:null,value:null,type:"text",mask:null,slotChar:"_",autoClear:!0,unmask:!1,style:null,className:null,placeholder:null,size:null,maxLength:null,tabIndex:null,disabled:!1,readOnly:!1,name:null,required:!1,tooltip:null,tooltipOptions:null,ariaLabelledBy:null,onComplete:null,onChange:null,onFocus:null,onBlur:null})}}]);
//# sourceMappingURL=715.4dc851e3.chunk.js.map