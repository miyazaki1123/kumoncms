/* NicEdit - Micro Inline WYSIWYG
 * Copyright 2007-2016 Brian Kirchoff
 *
 * NicEdit is distributed under the terms of the MIT license
 * For more information visit http://nicedit.com/
 * Do not remove this copyright message
 *
 * Japanese Version
 * Translated and Customized by CMONOS (http://cmonos.jp)
 * Last-Modified: 2016-11-28
 */
var bkExtend = function(){
	var args = arguments;
	if (args.length == 1) args = [this, args[0]];
	for (var prop in args[1]) args[0][prop] = args[1][prop];
	return args[0];
};
function bkClass() { }
bkClass.prototype.construct = function() {};
bkClass.extend = function(def) {
  var classDef = function() {
      if (arguments[0] !== bkClass) { return this.construct.apply(this, arguments); }
  };
  var proto = new this(bkClass);
  bkExtend(proto,def);
  classDef.prototype = proto;
  classDef.extend = this.extend;      
  return classDef;
};

var bkElement = bkClass.extend({
	construct : function(elm,d) {
		if(typeof(elm) == "string") {
			elm = (d || document).createElement(elm);
		}
		elm = $BK(elm);
		return elm;
	},
	
	appendTo : function(elm) {
		elm.appendChild(this);	
		return this;
	},
	
	appendBefore : function(elm) {
		elm.parentNode.insertBefore(this,elm);	
		return this;
	},
	
	addEvent : function(type, fn) {
		bkLib.addEvent(this,type,fn);
		return this;	
	},
	
	setContent : function(c) {
		this.innerHTML = c;
		return this;
	},
	
	pos : function() {
		var curleft = curtop = 0;
		var o = obj = this;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		var b = (!window.opera) ? parseInt(this.getStyle('border-width') || this.style.border) || 0 : 0;
		return [curleft+b,curtop+b+this.offsetHeight];
	},
	
	noSelect : function() {
		bkLib.noSelect(this);
		return this;
	},
	
	parentTag : function(t) {
		var elm = this;
		 do {
			if(elm && elm.nodeName && elm.nodeName.toUpperCase() == t) {
				return elm;
			}
			elm = elm.parentNode;
		} while(elm);
		return false;
	},
	
	hasClass : function(cls) {
		return this.className.match(new RegExp('(\\s|^)nicEdit-'+cls+'(\\s|$)'));
	},
	
	addClass : function(cls) {
		if (!this.hasClass(cls)) { this.className += " nicEdit-"+cls };
		return this;
	},
	
	removeClass : function(cls) {
		if (this.hasClass(cls)) {
			this.className = this.className.replace(new RegExp('(\\s|^)nicEdit-'+cls+'(\\s|$)'),' ');
		}
		return this;
	},

	setStyle : function(st) {
		if (st['rawStyle'] != null) this.setAttribute('style',st['rawStyle']);
		var elmStyle = this.style;
		for(var itm in st) {
			switch(itm) {
				case 'float':
					elmStyle['cssFloat'] = elmStyle['styleFloat'] = st[itm];
					break;
				case 'opacity':
					elmStyle.opacity = st[itm];
					elmStyle.filter = "alpha(opacity=" + Math.round(st[itm]*100) + ")"; 
					break;
				case 'className':
					this.className = st[itm];
					break;
				case 'rawStyle':
					break;
				default:
					if (document.compatMode || itm != "cursor") { // Nasty Workaround for IE 5.5
						elmStyle[itm] = st[itm];
					}
			}
		}
		return this;
	},
	
	getStyle : function( cssRule, d ) {
		var doc = (!d) ? document.defaultView : d; 
		if(this.nodeType == 1)
		return (doc && doc.getComputedStyle) ? doc.getComputedStyle( this, null ).getPropertyValue(cssRule) : this.currentStyle[ bkLib.camelize(cssRule) ];
	},
	
	remove : function() {
		this.parentNode.removeChild(this);
		return this;	
	},
	
	setAttributes : function(at) {
		for(var itm in at) {
			this[itm] = at[itm];
		}
		return this;
	}
});

var bkLib = {
	isMSIE : (navigator.appVersion.indexOf("MSIE") != -1),
	supportTouch : ((!window.navigator.msPointerEnabled && !window.navigator.pointerEnabled && ('createTouch' in document || 'ontouchstart' in document)) ? true : false),
	
	addEvent : function(obj, type, fn) {
		if (obj.addEventListener) {
			type = (type == 'mousewheel' && typeof document.onmousewheel == 'undefined') ? 'DOMMouseScroll' : 
				(bkLib.supportTouch) ? (
					(navigator.userAgent.search(/iphone|ipad|android/i) != -1) ? (
						(type == 'mousemove') ? 'touchmove' : 
						(type == 'mouseup') ? 'touchend' : 
						(type == 'mouseout') ? 'touchend' : 
						(type == 'mouseover') ? 'touchstart' : 
						(type == 'keypress') ? 'touchend' : 
						(type == 'keydown') ? 'touchstart' : 
						(type == 'keyup') ? 'touchend' : 
						(type == 'click') ? 'touchend' : type) : 
					(type == 'click') ? 'mouseup' : type) : 
				(window.navigator.pointerEnabled) ? (
					(type == 'mousedown') ? 'pointerdown' : 
					(type == 'mouseup') ? 'pointerup' : 
					(type == 'mouseout') ? 'pointerout' : 
					(type == 'mouseover') ? 'pointerover' : 
					(type == 'mousemove') ? 'pointermove' : type) : 
				(window.navigator.msPointerEnabled) ? (
					(type == 'mousedown') ? 'MSPointerDown' : 
					(type == 'mouseup') ? 'MSPointerUp' : 
					(type == 'mouseout') ? 'MSPointerOut' : 
					(type == 'mouseover') ? 'MSPointerOver' : 
					(type == 'mousemove') ? 'MSPointerMove' : type) : 
				type;
			obj.addEventListener( type, fn, false );
			if (type.search(/pointer/i) != -1) {
				obj.style.msTouchAction = 'none';
				obj.style.touchAction = 'none';
			}
		} else {
			obj.attachEvent("on"+type, fn);	
		}
	},
	
	toArray : function(iterable) {
		var length = iterable.length, results = new Array(length);
    	while (length--) { results[length] = iterable[length] };
    	return results;	
	},
	
	noSelect : function(element) {
		if(element.setAttribute && element.nodeName.toLowerCase() != 'input' && element.nodeName.toLowerCase() != 'textarea') {
			element.setAttribute('unselectable','on');
		}
		for(var i=0;i<element.childNodes.length;i++) {
			bkLib.noSelect(element.childNodes[i]);
		}
	},
	camelize : function(s) {
		return s.replace(/\-(.)/g, function(m, l){return l.toUpperCase()});
	},
	inArray : function(arr,item) {
	    return (bkLib.search(arr,item) != null);
	},
	search : function(arr,itm) {
		for(var i=0; i < arr.length; i++) {
			if(arr[i] == itm)
				return i;
		}
		return null;	
	},
	cancelEvent : function(e) {
		e = e || window.event;
		if (bkLib.supportTouch && e.touches) e = e.touches[0];
		if(e.preventDefault && e.stopPropagation) {
			e.preventDefault();
			e.stopPropagation();
			if (bkLib.keypressEvent) {
				bkLib.keypressEvent.preventDefault();
				bkLib.keypressEvent.stopPropagation();
				bkLib.keypressEvent = null;
			}
		}
		return false;
	},
	domLoad : [],
	domLoaded : function() {
		if (arguments.callee.done) return;
		arguments.callee.done = true;
		for (i = 0;i < bkLib.domLoad.length;i++) bkLib.domLoad[i]();
	},
	onDomLoaded : function(fireThis) {
		this.domLoad.push(fireThis);
		if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", bkLib.domLoaded, null);
		} else if(bkLib.isMSIE) {
			document.write("<style>.nicEdit-main p { margin: 0; }</style><scr"+"ipt id=__ie_onload defer " + ((location.protocol == "https:") ? "src='javascript:void(0)'" : "src=//0") + "><\/scr"+"ipt>");
			$BK("__ie_onload").onreadystatechange = function() {
			    if (this.readyState == "complete"){bkLib.domLoaded();}
			};
		}
	    window.onload = bkLib.domLoaded;
	}
};

function $BK(elm) {
	if(typeof(elm) == "string") {
		elm = document.getElementById(elm);
	}
	return (elm && !elm.appendTo) ? bkExtend(elm,bkElement.prototype) : elm;
}

var bkEvent = {
	addEvent : function(evType, evFunc) {
		if(evFunc) {
			this.eventList = this.eventList || {};
			this.eventList[evType] = this.eventList[evType] || [];
			this.eventList[evType].push(evFunc);
		}
		return this;
	},
	fireEvent : function() {
		var args = bkLib.toArray(arguments), evType = args.shift();
		if(this.eventList && this.eventList[evType]) {
			for(var i=0;i<this.eventList[evType].length;i++) {
				this.eventList[evType][i].apply(this,args);
			}
		}
	}	
};

Function.prototype.closure = function() {
  var __method = this, args = bkLib.toArray(arguments), obj = args.shift();
  return function() { if(typeof(bkLib) != 'undefined') { return __method.apply(obj,args.concat(bkLib.toArray(arguments))); } };
}
	
Function.prototype.closureListener = function() {
  	var __method = this, args = bkLib.toArray(arguments), object = args.shift(); 
  	return function(e) { 
  	e = e || window.event;
	if (bkLib.supportTouch && e.touches) e = e.touches[0];
  	if(e.target) { var target = e.target; } else { var target =  e.srcElement };
	  	return __method.apply(object, [e,target].concat(args) ); 
	};
}		


/* START CONFIG */

var nicEditorConfig = bkClass.extend({
	buttons : {
		'bold' : {name : '強調(太字)', command : 'Bold', tags : ['B','STRONG'], css : {'font-weight' : 'bold'}, key : 'b'},
		'italic' : {name : '強調(イタリック)', command : 'Italic', tags : ['EM','I'], css : {'font-style' : 'italic'}, key : 'i'},
		'underline' : {name : '下線', command : 'Underline', tags : ['U'], css : {'text-decoration' : 'underline'}, key : 'u'},
		'left' : {name : '左寄せ', command : 'justifyleft', noActive : true},
		'center' : {name : '中央揃え', command : 'justifycenter', noActive : true},
		'right' : {name : '右寄せ', command : 'justifyright', noActive : true},
		'justify' : {name : '両端揃え', command : 'justifyfull', noActive : true},
		'ol' : {name : '番号リスト', command : 'insertorderedlist', tags : ['OL']},
		'ul' : 	{name : 'リスト', command : 'insertunorderedlist', tags : ['UL']},
		'subscript' : {name : '下付き文字', command : 'subscript', tags : ['SUB']},
		'superscript' : {name : '上付き文字', command : 'superscript', tags : ['SUP']},
		'strikethrough' : {name : '取り消し線', command : 'strikeThrough', css : {'text-decoration' : 'line-through'}},
		'removeformat' : {name : '全ての装飾を削除', command : 'removeformat', noActive : true},
		'indent' : {name : 'インデント', command : 'indent', noActive : true},
		'outdent' : {name : 'インデント解除', command : 'outdent', noActive : true},
		'hr' : {name : '区切り線', command : 'insertHorizontalRule', noActive : true},
		'undo' : {name : '取り消し', command : 'undo', noActive : true},
		'redo' : {name : 'やり直し', command : 'redo', noActive : true}
	},
	iconsPath : 'auto',
	convertToText : true,
	keepBrTags : true,
	buttonList : ['save','bold','italic','underline','left','center','right','ol','ul','fontSize','fontFamily','fontFormat','indent','outdent','image','upload','link','unlink','forecolor','bgcolor','undo','redo'],
	iconList : {"xhtml":1,"bgcolor":2,"forecolor":3,"bold":4,"center":5,"hr":6,"indent":7,"italic":8,"justify":9,"left":10,"ol":11,"outdent":12,"removeformat":13,"right":14,"save":25,"strikethrough":16,"subscript":17,"superscript":18,"ul":19,"underline":20,"image":21,"link":22,"unlink":23,"close":24,"arrow":26,"undo":27,"redo":28},
	externalCSS : ''
});
/* END CONFIG */

var nicEditors = {
	nicPlugins : [],
	editors : [],
	
	registerPlugin : function(plugin,options) {
		this.nicPlugins.push({p : plugin, o : options});
	},

	allTextAreas : function(nicOptions) {
		var textareas = document.getElementsByTagName("textarea");
		for(var i=0;i<textareas.length;i++) {
			nicEditors.editors.push(new nicEditor(nicOptions).panelInstance(textareas[i]));
		}
		return nicEditors.editors;
	},
	
	findEditor : function(e) {
		var editors = nicEditors.editors;
		for(var i=0;i<editors.length;i++) {
			if(editors[i].instanceById(e)) {
				return editors[i].instanceById(e);
			}
		}
	}
};


var nicEditor = bkClass.extend({
	construct : function(o) {
		if (typeof o == 'undefined') {
			o = {fullPanel : true, xhtml : true};
		} else {
			if (typeof o.xhtml == 'undefined') o.xhtml = true;
			if (o.panelType != null) {
				if (o.panelType == 'full') {
					o.fullPanel = true;
				} else if (o.panelType == 'nostyle') {
					o.xhtml = true;
					o.buttonList = ['bold','italic','ol','ul','fontFormat','link','unlink','subscript','superscript','strikethrough','removeformat','hr','undo','redo'];
				} else if (o.panelType == 'noimage') {
					o.buttonList = ['bold','italic','underline','left','center','right','ol','ul','fontSize','fontFamily','fontFormat','indent','outdent','link','unlink','forecolor','bgcolor','subscript','superscript','strikethrough','removeformat','hr','undo','redo'];
				} else if (o.panelType == 'mini') {
					o.buttonList = ['bold','italic','left','center','right','ol','ul','link','unlink','removeformat','hr','undo','redo'];
				} else if (o.panelType == 'nostylemini') {
					o.xhtml = true;
					o.buttonList = ['bold','italic','ol','ul','link','unlink','removeformat','hr','undo','redo'];
				}
			}
			if (typeof o.buttonList == 'undefined' && !o.fullPanel) o.fullPanel = true;
		}
		this.options = new nicEditorConfig();
		bkExtend(this.options,o);
		this.nicInstances = new Array();
		this.loadedPlugins = new Array();
		
		var plugins = nicEditors.nicPlugins;
		for(var i=0;i<plugins.length;i++) {
			this.loadedPlugins.push(new plugins[i].p(this,plugins[i].o));
		}
		nicEditors.editors.push(this);
		bkLib.addEvent(document.body,'mousedown', this.selectCheck.closureListener(this) );
	},
	
	panelInstance : function(e,o) {
		e = this.checkReplace($BK(e));
		var panelElm = new bkElement('DIV').setStyle({width : (parseInt(e.getStyle('width')) || e.clientWidth)+'px'}).appendBefore(e);
		this.setPanel(panelElm);
		return this.addInstance(e,o);	
	},

	checkReplace : function(e) {
		var r = nicEditors.findEditor(e);
		if(r) {
			r.removeInstance(e);
			r.removePanel();
		}
		return e;
	},

	addInstance : function(e,o) {
		e = this.checkReplace($BK(e));
		if( e.contentEditable || !!window.opera ) {
//		if(( e.contentEditable || !!window.opera ) && navigator.userAgent.search(/Firefox\/[1-3]/i) == -1) {	// avoid error [0x80004005 (NS_ERROR_FAILURE)] for firefox
			var newInstance = new nicEditorInstance(e,o,this);
		} else {
			var newInstance = new nicEditorIFrameInstance(e,o,this);
		}
		this.nicInstances.push(newInstance);
		return this;
	},
	
	removeInstance : function(e) {
		e = $BK(e);
		var instances = this.nicInstances;
		for(var i=0;i<instances.length;i++) {	
			if(instances[i].e == e) {
				instances[i].remove();
				this.nicInstances.splice(i,1);
			}
		}
	},

	removePanel : function(e) {
		if(this.nicPanel) {
			this.nicPanel.remove();
			this.nicPanel = null;
		}	
	},

	updateInstance : function(e) {
		e = $BK(e);
		var instances = this.nicInstances;
		for(var i=0;i<instances.length;i++) {	
			if(instances[i].e == e) {
				instances[i].update();
			}
		}
	},

	instanceById : function(e) {
		e = $BK(e);
		var instances = this.nicInstances;
		for(var i=0;i<instances.length;i++) {
			if(instances[i].e == e) {
				return instances[i];
			}
		}	
	},

	setPanel : function(e) {
		this.nicPanel = new nicEditorPanel($BK(e),this.options,this);
		this.fireEvent('panel',this.nicPanel);
		return this;
	},
	
	nicCommand : function(cmd,args) {	
		if(this.selectedInstance) {
			this.selectedInstance.nicCommand(cmd,args);
		}
	},
	
	getIcon : function(iconName,options) {
		var icon = this.options.iconList[iconName];
		var file = (options.iconFiles) ? options.iconFiles[iconName] : '';
		if (this.options.iconsPath != null && this.options.iconsPath == 'auto') {
			this.options.iconsPath = 'nicEditorIcons.gif';
			var scripts = document.getElementsByTagName('script');
			for (var i=0; i<scripts.length; i++) {
				if (scripts[i].src != null && scripts[i].src.search(/nicEdit\.js$/) != -1) {
					this.options.iconsPath = scripts[i].src.replace('nicEdit.js','nicEditorIcons.gif');
					break;
				}
			}
		}
		return {backgroundImage : "url('"+((icon) ? this.options.iconsPath : file)+"')", backgroundPosition : ((icon) ? ((icon-1)*-18) : 0)+'px 0px'};	
	},
		
	selectCheck : function(e,t) {
		var found = false;
		do{
			if(t.className && t.className.indexOf('nicEdit') != -1) {
				return false;
			}
		} while(t = t.parentNode);
		this.fireEvent('blur',this.selectedInstance,t);
		this.lastSelectedInstance = this.selectedInstance;
		this.selectedInstance = null;
		return false;
	}
	
});
nicEditor = nicEditor.extend(bkEvent);

 
var nicEditorInstance = bkClass.extend({
	isSelected : false,
	
	construct : function(e,options,nicEditor) {
		this.ne = nicEditor;
		this.elm = this.e = e;
		this.options = options || {};
		
		newX = parseInt(e.getStyle('width')) || e.clientWidth;
		newY = parseInt(e.getStyle('height')) || e.clientHeight;
		this.initialHeight = newY-8;
		
		var isTextarea = (e.nodeName.toLowerCase() == "textarea");
		if(isTextarea || this.options.hasPanel) {
			var ie7s = (bkLib.isMSIE && !((typeof document.body.style.maxHeight != "undefined") && document.compatMode == "CSS1Compat"))
			var s = {width: newX+'px', border : '1px solid #ccc', borderTop : 0, overflowY : 'auto', overflowX: 'hidden' };
			s[(ie7s) ? 'height' : 'maxHeight'] = (this.ne.options.maxHeight) ? this.ne.options.maxHeight+'px' : null;
			this.editorContain = new bkElement('DIV').setStyle(s).appendBefore(e);
			var editorElm = new bkElement('DIV').setStyle({width : (newX-8)+'px', margin: '4px', minHeight : newY+'px'}).addClass('main').appendTo(this.editorContain);

			e.setStyle({display : 'none'});
				
			editorElm.innerHTML = e.innerHTML;
			if(isTextarea) {
				editorElm.setContent(this.textToHtml(e.value));
				this.copyElm = e;
				var f = e.parentTag('FORM');
				if(f) { bkLib.addEvent( f, 'submit', this.saveContent.closure(this)); }
				var area = this;
				bkLib.addEvent(e, 'change', function() { area.update(); })
			}
			editorElm.setStyle((ie7s) ? {height : newY+'px'} : {overflow: 'hidden'});
			this.elm = editorElm;	
		}
		this.ne.addEvent('blur',this.blur.closure(this));

		this.init();
		this.blur();
	},
	
	init : function() {
		this.elm.setAttribute('contentEditable','true');
		if(this.getContent() == "") {
			this.setContent('<br />');
		}
		this.instanceDoc = document.defaultView;
		this.elm.addEvent('mousedown',this.selected.closureListener(this)).addEvent('keypress',this.keyDown.closureListener(this)).addEvent('focus',this.selected.closure(this)).addEvent('blur',this.blur.closure(this)).addEvent('keyup',this.selected.closure(this));
		this.ne.fireEvent('add',this);
	},
	
	remove : function() {
		this.saveContent();
		if(this.copyElm || this.options.hasPanel) {
			this.editorContain.remove();
			this.e.setStyle({'display' : 'block'});
			this.ne.removePanel();
		}
		this.disable();
		this.ne.fireEvent('remove',this);
	},
	
	disable : function() {
		this.elm.setAttribute('contentEditable','false');
	},
	
	getSel : function() {
		return (window.getSelection) ? window.getSelection() : document.selection;
	},
	
	getRng : function() {
		var s = this.getSel();
		if(!s) { return null; }
		return (s.rangeCount > 0) ? s.getRangeAt(0) : s.createRange();
	},
	
	selRng : function(rng,s) {
		if(window.getSelection) {
			s.removeAllRanges();
			s.addRange(rng);
		} else {
			rng.select();
		}
	},
	
	selElm : function() {
		var r = this.getRng();
		if(r.startContainer) {
			var contain = r.startContainer;
			if(r.cloneContents().childNodes.length == 1) {
				for(var i=0;i<contain.childNodes.length;i++) {
					var rng = contain.childNodes[i].ownerDocument.createRange();
					rng.selectNode(contain.childNodes[i]);
					if(r.compareBoundaryPoints(Range.START_TO_START,rng) != 1 && 
						r.compareBoundaryPoints(Range.END_TO_END,rng) != -1) {
						return $BK(contain.childNodes[i]);
					}
				}
			}
			return $BK(contain);
		} else {
			return $BK((this.getSel().type == "Control") ? r.item(0) : r.parentElement());
		}
	},
	
	saveRng : function() {
		this.savedRange = this.getRng();
		this.savedSel = this.getSel();
	},
	
	restoreRng : function() {
		if(this.savedRange) {
			this.selRng(this.savedRange,this.savedSel);
		}
	},
	
	keyDown : function(e,t) {
		if(e.ctrlKey) {
			this.ne.fireEvent('key',this,e);
		}
	},
	
	selected : function(e,t) {
		if(!t && !(t = this.selElm)) {t = this.selElm()}
		if(!e.ctrlKey) {
			var selInstance = this.ne.selectedInstance;
			if(selInstance != this) {
				if(selInstance) {
					this.ne.fireEvent('blur',selInstance,t);
				}
				this.ne.selectedInstance = this;
				this.ne.fireEvent('focus',selInstance,t);
			}
			this.ne.fireEvent('selected',selInstance,t);
			if (!this.isFocused) {
				this.isFocused = true;
				this.elm.addClass('selected');
			}
		}
		return false;
	},
	
	blur : function() {
		if (this.isFocused) {
			this.saveContent();
			this.isFocused = false;
			this.elm.removeClass('selected');
		}
	},
	
	update : function () {
		if (this.elm) {
			this.elm.innerHTML = (this.copyElm) ? this.textToHtml(this.copyElm.value) : this.e.innerHTML;
		}
	},
	
	saveContent : function() {
		if(this.copyElm || this.options.hasPanel) {
			this.ne.fireEvent('save',this);
			(this.copyElm) ? this.copyElm.value = this.htmlToText(this.getContent()) : this.e.innerHTML = this.getContent();
		}	
	},
	
	getElm : function() {
		return this.elm;
	},
	
	getContent : function() {
		this.content = this.getElm().innerHTML;
		this.ne.fireEvent('get',this);
		return this.content;
	},
	
	setContent : function(e) {
		this.content = e;
		this.ne.fireEvent('set',this);
		this.elm.innerHTML = this.content;	
	},
	
	nicCommand : function(cmd,args) {
		document.execCommand(cmd,false,args);
	},
	
	textToHtml : function(thisText) {
		if (this.ne.options.convertToText) {
			if (this.ne.options.keepBrTags) {
				//thisText = thisText.replace(/(?:\r\n\r\n|\n\n|\r\r)/g,"</p><p>").replace(/<p><\/p>/ig,"<br /><br />");
			} else {
				thisText = thisText.replace(/^[\n\r]+/,"").replace(/[\n\r]+$/,"").replace(/(?:\r\n\r\n|\n\n|\r\r)[\n\r]*/g,"</p><p>");
			}
			thisText = thisText.replace(/<p>(?=<(?:table|caption|thead|tbody|tfoot|tr|th|td|ol|ul|li|dl|dt|dd|div|p|address|h\d|blockquote|fieldset|form|pre|hr)(?!\w)[^>]*>)/gi,'').replace(/(<\/(?:table|caption|thead|tbody|tfoot|tr|th|td|ol|ul|li|dl|dt|dd|div|p|address|h\d|blockquote|fieldset|form|pre|hr)>)<\/p>/gi,"$1").replace(((this.ne.options.keepBrTags) ? /(<\/?(?:table|caption|thead|tbody|tfoot|tr|th|td|ol|ul|li|dl|dt|dd|address|h\d|blockquote|fieldset|form|pre|hr)>)[\n\r]*/gi : /(<\/?(?:table|caption|thead|tbody|tfoot|tr|th|td|ol|ul|li|dl|dt|dd|div|p|address|h\d|blockquote|fieldset|form|pre|hr)>)[\n\r]*/gi),"$1").replace(/(?:\r\n|\n|\r)/g,"<br />").replace(/^(.*<\/p><p>)/,"<p>$1").replace(/(<\/p><p>.*)$/,"$1</p>");
		}
		return thisText;
	},
	
	htmlToText : function(thisHtml) {
		if (this.ne.options.convertToText) {
			thisHtml = thisHtml.replace(/(?:\r\n|\n|\r)+/g,"").replace(/^((?:(?!(?:<div(?!\w)[^>]*>)).)+?)(<div(?!\w)[^>]*>)/gi,"$1\n$2").replace(/^((?:(?!(?:<p(?!\w)[^>]*>)).)+?)(<p(?!\w)[^>]*>)/gi,"$1\n\n$2").replace(/<div>(?!<br(?!\w)[^>]*>)((?:(?!(?:<div(?!\w)[^>]*>)).)*?)<\/div>((?:<(?:p|div)(?!\w)[^>]*>\s*<br(?!\w)[^>]*>\s*<\/(?:p|div)>|<br(?!\w)[^>]*>)*)$/i,"$1$2").replace(/<p>(?!<br(?!\w)[^>]*>)((?:(?!(?:<p(?!\w)[^>]*>)).)*?)<\/p>((?:<(?:p|div)(?!\w)[^>]*>\s*<br(?!\w)[^>]*>\s*<\/(?:p|div)>|<br(?!\w)[^>]*>)+)$/i,"$1\n$2").replace(/<p>((?:(?!(?:<p(?!\w)[^>]*>)).)*?)<\/p>$/i,"$1").replace(/<div(?!\w)[^>]*>\s*<br(?!\w)[^>]*>\s*<\/div>/ig,"\n").replace(/<p(?!\w)[^>]*>\s*<br(?!\w)[^>]*>\s*<\/p>/ig,"\n\n").replace(/<div>((?:(?!(?:<div(?!\w)[^>]*>)).)*?)<\/div>/ig,"$1\n").replace(/<p>((?:(?!(?:<p(?!\w)[^>]*>)).)*?)<\/p>/ig,"$1\n\n").replace(/<br(?!\w)[^>]*>/gi,"\n").replace(/(?:\r\n|\n|\r)?(<(?:table|caption|thead|tbody|tfoot|tr|th|td|ol|ul|li|dl|dt|dd|div|address|h\d|blockquote|fieldset|form|pre|hr)(?!\w)[^>]*>)(?:\r\n|\n|\r)?/gi,"\n$1").replace(/(?:\r\n|\n|\r)?(<\/(?:table|caption|thead|tbody|tfoot|tr|th|td|ol|ul|li|dl|dt|dd|div|address|h\d|blockquote|fieldset|form|pre|hr)>)(?:\r\n|\n|\r)?/gi,"$1\n");
			if (!this.ne.options.keepBrTags) thisHtml = thisHtml.replace(/(\r\n\r\n|\n\n|\r\r)[\n\r]*/g,"$1").replace(/^\n+/,"").replace(/\n+$/,"");
		}
		return thisHtml;
	}		
});

var nicEditorIFrameInstance = nicEditorInstance.extend({
	savedStyles : [],
	
	init : function() {	
		var c = this.elm.innerHTML.replace(/^\s+|\s+$/g, '');
		this.elm.innerHTML = '';
		(!c) ? c = "<br />" : c;
		this.initialContent = this.textToHtml(c);
		
		this.elmFrame = new bkElement('iframe').setAttributes({'src' : 'javascript:;', 'frameBorder' : 0, 'allowTransparency' : 'true', 'scrolling' : 'no'}).setStyle({height: '100px', width: '100%'}).addClass('frame').appendTo(this.elm);

		if(this.copyElm) { this.elmFrame.setStyle({width : (this.elm.offsetWidth-4)+'px'}); }
		
		var styleList = ['font-size','font-family','font-weight','color'];
		for(itm in styleList) {
			this.savedStyles[bkLib.camelize(itm)] = this.elm.getStyle(itm);
		}

		setTimeout(this.initFrame.closure(this),50);
	},
	
	disable : function() {
		this.elm.innerHTML = this.getContent();
	},
	
	initFrame : function() {
		var initialContent;
		initialContent = this.initialContent;

		var fd = $BK(this.elmFrame.contentWindow.document);
		fd.designMode = "on";		
		fd.open();
		var css = this.ne.options.externalCSS;
		fd.write('<html><head>'+((css) ? '<link href="'+css+'" rel="stylesheet" type="text/css" />' : '')+'</head><body id="nicEditContent" style="margin: 0 !important; background-color: transparent !important;">'+initialContent+'</body></html>');
		fd.close();
		this.frameDoc = fd;

		this.frameWin = $BK(this.elmFrame.contentWindow);
		this.frameContent = $BK(this.frameWin.document.body).setStyle(this.savedStyles);
		this.instanceDoc = this.frameWin.document.defaultView;
		
		this.heightUpdate();
		this.frameDoc.addEvent('mousedown', this.selected.closureListener(this)).addEvent('keyup',this.heightUpdate.closureListener(this)).addEvent('keydown',this.keyDown.closureListener(this)).addEvent('keyup',this.selected.closure(this));
		this.ne.fireEvent('add',this);
	},
	
	getElm : function() {
		return this.frameContent;
	},
	
	setContent : function(c) {
		if (this.frameContent) {
			this.content = c;
			this.ne.fireEvent('set',this);
			this.frameContent.innerHTML = this.content;	
			this.heightUpdate();
		} else {
			this.initialContent = c;
		}
	},
	
	getSel : function() {
		return (this.frameWin) ? this.frameWin.getSelection() : this.frameDoc.selection;
	},
	
	heightUpdate : function() {	
		this.elmFrame.style.height = Math.max(this.frameContent.offsetHeight,this.initialHeight)+'px';
	},
    
	nicCommand : function(cmd,args) {
		this.frameDoc.execCommand(cmd,false,args);
		setTimeout(this.heightUpdate.closure(this),100);
	}

	
});
var nicEditorPanel = bkClass.extend({
	construct : function(e,options,nicEditor) {
		this.elm = e;
		this.options = options;
		this.ne = nicEditor;
		this.panelButtons = new Array();
		this.buttonList = bkExtend([],this.ne.options.buttonList);
		
		this.panelContain = new bkElement('DIV').setStyle({overflow : 'hidden', width : '100%', border : '1px solid #cccccc', backgroundColor : '#efefef'}).addClass('panelContain');
		this.panelElm = new bkElement('DIV').setStyle({margin : '2px', marginTop : '0px', zoom : 1, overflow : 'hidden'}).addClass('panel').appendTo(this.panelContain);
		this.panelContain.appendTo(e);

		var opt = this.ne.options;
		var buttons = opt.buttons;
		for(button in buttons) {
				this.addButton(button,opt,true);
		}
		this.reorder();
		e.noSelect();
	},
	
	addButton : function(buttonName,options,noOrder) {
		var button = options.buttons[buttonName];
		var type = (button['type']) ? eval('(typeof('+button['type']+') == "undefined") ? null : '+button['type']+';') : nicEditorButton;
		var hasButton = bkLib.inArray(this.buttonList,buttonName);
		if(type && (hasButton || (this.ne.options.fullPanel && buttonName != 'justify'))) {
			this.panelButtons.push(new type(this.panelElm,buttonName,options,this.ne));
			if(!hasButton) {	
				this.buttonList.push(buttonName);
			}
		}
	},
	
	findButton : function(itm) {
		for(var i=0;i<this.panelButtons.length;i++) {
			if(this.panelButtons[i].name == itm)
				return this.panelButtons[i];
		}	
	},
	
	reorder : function() {
		var bl = this.buttonList;
		for(var i=0;i<bl.length;i++) {
			var button = this.findButton(bl[i]);
			if(button) {
				this.panelElm.appendChild(button.margin);
			}
		}	
	},
	
	remove : function() {
		this.elm.remove();
	}
});
var nicEditorButton = bkClass.extend({
	
	construct : function(e,buttonName,options,nicEditor) {
		this.options = options.buttons[buttonName];
		this.name = buttonName;
		this.ne = nicEditor;
		this.elm = e;

		this.margin = new bkElement('DIV').setStyle({'float' : 'left', marginTop : '2px'}).appendTo(e);
		this.contain = new bkElement('DIV').setStyle({width : '20px', height : '20px'}).addClass('buttonContain').appendTo(this.margin);
		this.border = new bkElement('DIV').setStyle({backgroundColor : '#efefef', border : '1px solid #efefef'}).appendTo(this.contain);
		this.button = new bkElement('DIV').setStyle({width : '18px', height : '18px', overflow : 'hidden', zoom : 1, cursor : 'pointer'}).addClass('button').setStyle(this.ne.getIcon(buttonName,options)).appendTo(this.border);
		this.button.addEvent('mouseover', this.hoverOn.closure(this)).addEvent('mouseout',this.hoverOff.closure(this)).addEvent('mousedown',this.mouseClick.closure(this)).noSelect();
		
		if(!window.opera) {
			this.button.addEvent('mousedown', bkLib.cancelEvent).addEvent('click', bkLib.cancelEvent);
		}
		
		nicEditor.addEvent('selected', this.enable.closure(this)).addEvent('blur', this.disable.closure(this)).addEvent('key',this.key.closure(this));
		
		this.disable();
		this.init();
	},
	
	init : function() {  },
	
	hide : function() {
		this.contain.setStyle({display : 'none'});
	},
	
	updateState : function() {
		if(this.isDisabled) { this.setBg(); }
		else if(this.isHover) { this.setBg('hover'); }
		else if(this.isActive) { this.setBg('active'); }
		else { this.setBg(); }
	},
	
	setBg : function(state) {
		switch(state) {
			case 'hover':
				var stateStyle = {border : '1px solid #666', backgroundColor : '#ddd'};
				break;
			case 'active':
				var stateStyle = {border : '1px solid #666', backgroundColor : '#ccc'};
				break;
			default:
				var stateStyle = {border : '1px solid #efefef', backgroundColor : '#efefef'};	
		}
		this.border.setStyle(stateStyle).addClass('button-'+state);
	},
	
	checkNodes : function(e) {
		var elm = e;	
		do {
			if(this.options.tags && bkLib.inArray(this.options.tags,elm.nodeName)) {
				this.activate();
				return true;
			}
		} while(elm = elm.parentNode && elm.className != "nicEdit");
		elm = $BK(e);
		while(elm.nodeType == 3) {
			elm = $BK(elm.parentNode);
		}
		if(this.options.css) {
			for(itm in this.options.css) {
				if(elm.getStyle(itm,this.ne.selectedInstance.instanceDoc) == this.options.css[itm]) {
					this.activate();
					return true;
				}
			}
		}
		this.deactivate();
		return false;
	},
	
	activate : function() {
		if(!this.isDisabled) {
			this.isActive = true;
			this.updateState();	
			this.ne.fireEvent('buttonActivate',this);
		}
	},
	
	deactivate : function() {
		this.isActive = false;
		this.updateState();	
		if(!this.isDisabled) {
			this.ne.fireEvent('buttonDeactivate',this);
		}
	},
	
	enable : function(ins,t) {
		this.isDisabled = false;
		this.contain.setStyle({'opacity' : 1}).addClass('buttonEnabled');
		this.updateState();
		this.checkNodes(t);
	},
	
	disable : function(ins,t) {		
		this.isDisabled = true;
		this.contain.setStyle({'opacity' : 0.6}).removeClass('buttonEnabled');
		this.updateState();	
	},
	
	toggleActive : function() {
		(this.isActive) ? this.deactivate() : this.activate();	
	},
	
	hoverOn : function() {
		if(!this.isDisabled) {
			this.isHover = true;
			this.updateState();
			this.ne.fireEvent("buttonOver",this);
		}
	}, 
	
	hoverOff : function() {
		this.isHover = false;
		this.updateState();
		this.ne.fireEvent("buttonOut",this);
	},
	
	mouseClick : function() {
		if(this.options.command) {
			this.ne.nicCommand(this.options.command,this.options.commandArgs);
			if(!this.options.noActive) {
				this.toggleActive();
			}
		}
		this.ne.fireEvent("buttonClick",this);
	},
	
	key : function(nicInstance,e) {
		if(this.options.key && e.ctrlKey && String.fromCharCode(e.keyCode || e.charCode).toLowerCase() == this.options.key) {
			this.mouseClick();
			if(e.preventDefault) e.preventDefault();
		}
	}
	
});

 
var nicPlugin = bkClass.extend({
	
	construct : function(nicEditor,options) {
		this.options = options;
		this.ne = nicEditor;
		this.ne.addEvent('panel',this.loadPanel.closure(this));
		
		this.init();
	},

	loadPanel : function(np) {
		var buttons = this.options.buttons;
		for(var button in buttons) {
			np.addButton(button,this.options);
		}
		np.reorder();
	},

	init : function() {  }
});



 
 /* START CONFIG */
var nicPaneOptions = { };
/* END CONFIG */

var nicEditorPane = bkClass.extend({
	construct : function(elm,nicEditor,options,openButton) {
		this.ne = nicEditor;
		this.elm = elm;
		this.pos = elm.pos();
		
		this.contain = new bkElement('div').setStyle({zIndex : '99999', overflow : 'hidden', position : 'absolute', left : this.pos[0]+'px', top : this.pos[1]+'px'})
		this.pane = new bkElement('div').setStyle({fontSize : '12px', border : '1px solid #ccc', 'overflow': 'hidden', padding : '4px', textAlign: 'left', backgroundColor : '#ffffc9'}).addClass('pane').setStyle(options).appendTo(this.contain);
		
		if(openButton && !openButton.options.noClose) {
			this.close = new bkElement('div').setStyle({height: '16px', width : '16px', margin : ((navigator.appVersion.indexOf("Mac")!= -1 || (!document.documentMode || document.documentMode < 8)) ? '0' : '0 0 0 auto'), cursor : 'pointer'}).setStyle(this.ne.getIcon('close',nicPaneOptions)).addEvent('mousedown',openButton.removePane.closure(this)).appendTo(this.pane);
		}
		
		this.contain.noSelect().appendTo(document.body);
		
		this.position();
		this.init();	
	},
	
	init : function() { },
	
	position : function() {
		if(this.ne.nicPanel) {
			var panelElm = this.ne.nicPanel.elm;	
			var panelPos = panelElm.pos();
			var newLeft = panelPos[0]+parseInt(panelElm.getStyle('width'))-(parseInt(this.pane.getStyle('width'))+8);
			if (newLeft < 0) newLeft = 0;
			if(newLeft < this.pos[0]) {
				this.contain.setStyle({left : newLeft+'px'});
			}
		}
	},
	
	toggle : function() {
		this.isVisible = !this.isVisible;
		this.contain.setStyle({display : ((this.isVisible) ? 'block' : 'none')});
	},
	
	remove : function() {
		if(this.contain) {
			this.contain.remove();
			this.contain = null;
		}
	},
	
	append : function(c) {
		c.appendTo(this.pane);
	},
	
	setContent : function(c) {
		this.pane.setContent(c);
	}
	
});


 
var nicEditorAdvancedButton = nicEditorButton.extend({
	
	init : function() {
		this.ne.addEvent('selected',this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));	
	},
	
	mouseClick : function() {
		if(!this.isDisabled) {
			if(this.pane && this.pane.pane) {
				this.removePane();
			} else {
				this.pane = new nicEditorPane(
					this.contain,
					this.ne,
					((this.options.noClose) ? 
						{
							padding : 0,
							width : (this.width || '270px'),
							border : '1px solid #000'
						} : {
							'float' : 'left',
							padding : '4px',
							textAlign : ((navigator.appVersion.indexOf("Mac")!= -1) ? 'left' : 'right'),
							className : 'nicEditorPane',
							border : '1px solid #666',
							opacity : 0.8,
							backgroundColor : '#000',
							fontSize : '12px',
							color : '#FFF',
							rawStyle : 'border-radius: 8px; -moz-border-radius: 8px; -webkit-border-radius: 8px; -o-border-radius: 8px; -ms-border-radius: 8px;'
						} 
					),
					this
				);
				this.addPane();
				this.ne.selectedInstance.saveRng();
			}
		}
	},
	
	addForm : function(f,elm) {
		this.form = new bkElement('form').setStyle({padding : 0, margin : 0}).addEvent('submit',this.submit.closureListener(this)).addEvent('keypress',function(e) { if (e.keyCode && e.keyCode == 13 && e.preventDefault) { bkLib.keypressEvent = e ; } });
		this.pane.append(this.form);
		this.inputs = {};
		var formTitle = 'OK';
		var fieldTable = new bkElement('tbody').appendTo(new bkElement('table').setStyle({border : 'none',fontSize : '12px', color : '#FFF', background : 'transparent none', padding : 0, margin : 0}).appendTo(this.form));
		for(itm in f) {
			var field = f[itm];
			var val = '';
			if(elm) {
				val = elm.getAttribute(itm);
			}
			if(!val) {
				val = field['value'] || '';
			}
			var type = f[itm].type;
			if(type == 'title') {
				formTitle = field.txt;
			} else {
				var fieldTr = new bkElement('tr').appendTo(fieldTable);
				if(field.txt) {
					new bkElement('label').setAttributes({'for' : itm}).setContent(field.txt).appendTo(new bkElement('th').setStyle({textAlign : 'right', fontWeight : 'normal', whiteSpace : 'nowrap', border : 'none', fontSize : '12px', color : '#FFF', background : 'transparent none', padding : '1px', margin : 0}).appendTo(fieldTr));
				}
				var fieldTd = new bkElement('td').setStyle({textAlign : 'left', border : 'none', fontSize : '12px', color : '#FFF', background : 'transparent none', padding : '1px', margin : 0}).appendTo(fieldTr);
				switch(type) {
					case 'text':
						this.inputs[itm] = new bkElement('input').setAttributes({id : itm, 'value' : val, 'type' : 'text'}).setStyle({fontSize : '12px'}).setStyle(field.style).appendTo(fieldTd);
						break;
					case 'select':
						this.inputs[itm] = new bkElement('select').setAttributes({id : itm}).setStyle({fontSize : '12px'}).appendTo(fieldTd);
						for(opt in field.options) {
							var o = new bkElement('option').setAttributes({value : opt, selected : (opt == val) ? 'selected' : ''}).setContent(field.options[opt]).appendTo(this.inputs[itm]);
						}
						break;
					case 'content':
						this.inputs[itm] = new bkElement('textarea').setAttributes({id : itm}).setStyle({fontSize : '12px'}).setStyle(field.style).appendTo(fieldTd);
						this.inputs[itm].value = val;
				}	
			}
		}
		new bkElement('input').setAttributes({'type' : 'submit', value : formTitle}).appendTo(new bkElement('div').setStyle({'textAlign' : 'right'}).appendTo(this.form));
		this.form.addEvent('submit', bkLib.cancelEvent);
		this.pane.position();
	},
	
	submit : function() { },
	
	findElm : function(tag,attr,val) {
		var list = this.ne.selectedInstance.getElm().getElementsByTagName(tag);
		for(var i=0;i<list.length;i++) {
			if(list[i].getAttribute(attr) == val) {
				return $BK(list[i]);
			}
		}
	},
	
	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
		}	
	}	
});


var nicButtonTips = bkClass.extend({
	construct : function(nicEditor) {
		this.ne = nicEditor;
		nicEditor.addEvent('buttonOver',this.show.closure(this)).addEvent('buttonOut',this.hide.closure(this));

	},
	
	show : function(button) {
		this.timer = setTimeout(this.create.closure(this,button),400);
	},
	
	create : function(button) {
		this.timer = null;
		if(!this.pane) {
			this.pane = new nicEditorPane(button.button,this.ne,{fontSize : '12px', marginTop : '5px'});
			this.pane.setContent(button.options.name);
			if (parseInt(this.pane.pane.getStyle('width')) == 0) this.pane.pane.setStyle({'float':'left'}); //Safariでツールチップがつぶれるのを防ぐ
		}		
	},
	
	hide : function(button) {
		if(this.timer) {
			clearTimeout(this.timer);
		}
		if(this.pane) {
			this.pane = this.pane.remove();
		}
	}
});
nicEditors.registerPlugin(nicButtonTips);


 
 /* START CONFIG */
var nicSelectOptions = {
	buttons : {
		'fontSize' : {name : '文字サイズ', type : 'nicEditorFontSizeSelect', command : 'fontsize'},
		'fontFamily' : {name : 'フォント', type : 'nicEditorFontFamilySelect', command : 'fontname'},
		'fontFormat' : {name : 'ブロック', type : 'nicEditorFontFormatSelect', command : 'formatBlock'}
	}
};
/* END CONFIG */
var nicEditorSelect = bkClass.extend({
	
	construct : function(e,buttonName,options,nicEditor) {
		this.options = options.buttons[buttonName];
		this.elm = e;
		this.ne = nicEditor;
		this.name = buttonName;
		this.selOptions = new Array();
		
		this.margin = new bkElement('div').setStyle({'float' : 'left', margin : '2px 1px 0 1px'}).appendTo(this.elm);
		this.contain = new bkElement('div').setStyle({width: '90px', height : '20px', cursor : 'pointer', overflow: 'hidden'}).addClass('selectContain').addEvent('click',this.toggle.closure(this)).appendTo(this.margin);
		this.items = new bkElement('div').setStyle({overflow : 'hidden', zoom : 1, border: '1px solid #ccc', paddingLeft : '3px', backgroundColor : '#fff'}).appendTo(this.contain);
		this.control = new bkElement('div').setStyle({overflow : 'hidden', 'float' : 'right', height: '18px', width : '16px'}).addClass('selectControl').setStyle(this.ne.getIcon('arrow',options)).appendTo(this.items);
		this.txt = new bkElement('div').setStyle({overflow : 'hidden', 'float' : 'left', width : '66px', height : '14px', marginTop : '1px', fontFamily : 'sans-serif', textAlign : 'center', fontSize : '12px'}).addClass('selectTxt').appendTo(this.items);
		
		if(!window.opera) {
			this.contain.addEvent('mousedown', bkLib.cancelEvent);
			this.control.addEvent('mousedown', bkLib.cancelEvent);
			this.txt.addEvent('mousedown', bkLib.cancelEvent);
		}
		
		this.margin.noSelect();
		
		this.ne.addEvent('selected', this.enable.closure(this)).addEvent('blur', this.disable.closure(this));
		
		this.disable();
		this.init();
	},
	
	disable : function() {
		this.isDisabled = true;
		this.close();
		this.contain.setStyle({opacity : 0.6});
	},
	
	enable : function(t) {
		this.isDisabled = false;
		this.close();
		this.contain.setStyle({opacity : 1});
	},
	
	setDisplay : function(txt) {
		this.txt.setContent(txt);
	},
	
	toggle : function() {
		if(!this.isDisabled) {
			(this.pane) ? this.close() : this.open();
		}
	},
	
	open : function() {
		this.pane = new nicEditorPane(this.items,this.ne,{width : '88px', padding: '0px', borderTop : 0, borderLeft : '1px solid #ccc', borderRight : '1px solid #ccc', borderBottom : '0px', backgroundColor : '#fff'});
		
		for(var i=0;i<this.selOptions.length;i++) {
			var opt = this.selOptions[i];
			var itmContain = new bkElement('div').setStyle({overflow : 'hidden', borderBottom : '1px solid #ccc', width: '88px', textAlign : 'left', overflow : 'hidden', cursor : 'pointer'});
			var itm = new bkElement('div').setStyle({padding : '0px 4px'}).setContent(opt[1]).appendTo(itmContain).noSelect();
			itm.addEvent('click',this.update.closure(this,opt[0])).addEvent('mouseover',this.over.closure(this,itm)).addEvent('mouseout',this.out.closure(this,itm)).setAttributes('id',opt[0]);
			this.pane.append(itmContain);
			if(!window.opera) {
				itm.addEvent('mousedown', bkLib.cancelEvent);
			}
		}
	},
	
	close : function() {
		if(this.pane) {
			this.pane = this.pane.remove();
		}	
	},
	
	over : function(opt) {
		opt.setStyle({backgroundColor : '#ccc'});
	},
	
	out : function(opt) {
		opt.setStyle({backgroundColor : '#fff'});
	},
	
	
	add : function(k,v) {
		this.selOptions.push(new Array(k,v));	
	},
	
	update : function(elm) {
		this.ne.nicCommand(this.options.command,elm);
		this.close();	
	}
});

var nicEditorFontSizeSelect = nicEditorSelect.extend({
	sel : {1 : '小', 2 : '小さめ', 3 : '標準', 4 : '大きめ', 5 : '大', 6 : '極大'},
	init : function() {
		this.setDisplay('サイズ...');
		for(itm in this.sel) {
			this.add(itm,'<font size="'+itm+'">'+this.sel[itm]+'</font>');
		}		
	}
});

var nicEditorFontFamilySelect = nicEditorSelect.extend({
	sel : {
		"Avenir, 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, Verdana, Roboto, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', '游ゴシック', 'Yu Gothic', '游ゴシック体', 'YuGothic', 'Meiryo UI', 'メイリオ', Meiryo, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif" : 'ゴシック',
		"Garamond, 'Times New Roman', 'ヒラギノ明朝 Pro W3', 'Hiragino Mincho Pro', 'HiraMinProN-W3', '游明朝', 'Yu Mincho', '游明朝体', 'YuMincho', 'HGS明朝E', 'HG明朝E', 'ＭＳ Ｐ明朝', 'MS PMincho', serif" : '明朝',
		"'ＤＦＰ行書体', 'ＤＦ行書体', 'AGENDA人名行書体L1', 'HGP行書体', 'HGS行書体', 'HG行書体', Garamond, 'Times New Roman', 'ヒラギノ明朝 Pro W3', 'Hiragino Mincho Pro', 'HiraMinProN-W3', '游明朝', 'Yu Mincho', '游明朝体', 'YuMincho', 'HGS明朝E', 'HG明朝E', 'ＭＳ Ｐ明朝', 'MS PMincho', cursive" : '毛筆 cursive',
		'fantasy' : '装飾 fantasy','monospace' : '等幅','arial' : 'Arial','comic sans ms' : 'Comic Sans','courier new' : 'Courier New','georgia' : 'Georgia', 'helvetica' : 'Helvetica', 'impact' : 'Impact', 'times new roman' : 'Times', 'trebuchet ms' : 'Trebuchet', 'verdana' : 'Verdana'},
	init : function() {
		this.setDisplay('フォント...');
		for(itm in this.sel) {
			this.add(itm,'<font face="'+itm+'">'+this.sel[itm]+'</font>');
		}
	}
});

var nicEditorFontFormatSelect = nicEditorSelect.extend({
	sel : {'p' : '段落', 'blockquote' : '引用', 'code' : 'コード', 'pre' : '整形済み', 'h2' : '見出し2', 'h3' : '見出し3'},
	init : function() {
		this.setDisplay('ブロック...');
		for(itm in this.sel) {
			var tag = itm.toUpperCase();
			this.add('<'+tag+'>','<'+itm+' style="padding: 0px; margin: 0px;">'+this.sel[itm]+'</'+tag+'>');
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicSelectOptions);



/* START CONFIG */
var nicLinkOptions = {
	buttons : {
		'link' : {name : 'リンクを追加', type : 'nicLinkButton', tags : ['A']},
		'unlink' : {name : 'リンクを削除',  command : 'unlink', noActive : true}
	}
};
/* END CONFIG */

var nicLinkButton = nicEditorAdvancedButton.extend({	
	addPane : function() {
		this.ln = this.ne.selectedInstance.selElm().parentTag('A');
		this.addForm({
			'' : {type : 'title', txt : 'リンクを追加'},
			'href' : {type : 'text', txt : 'URL', value : 'http://', style : {width: '150px'}},
			'title' : {type : 'text', txt : 'タイトル', style : {width: '150px'}},
			'target' : {type : 'select', txt : 'ウィンドウ', options : {'' : '同じウィンドウで開く', '_blank' : '新しいウィンドウで開く'},style : {width : '150px'}}
		},this.ln);
	},
	
	submit : function(e) {
		var url = this.inputs['href'].value;
		if(url == "http://" || url == "") {
			alert("URLを入力して下さい。");
			return false;
		}
		this.removePane();
		
		if(!this.ln) {
			var tmp = (navigator.userAgent.search(/Firefox/i) != -1) ? 'LINK' : (this.inputs['title'].value || this.inputs['href'].value || 'LINK');
			this.ne.nicCommand("createlink",tmp);
			this.ln = this.findElm('A','href',tmp);
		}
		if(this.ln) {
			this.ln.setAttributes({
				href : this.inputs['href'].value,
				title : this.inputs['title'].value,
				target : this.inputs['target'].options[this.inputs['target'].selectedIndex].value
			});
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicLinkOptions);



/* START CONFIG */
var nicColorOptions = {
	buttons : {
		'forecolor' : {name : '文字色', type : 'nicEditorColorButton', noClose : true},
		'bgcolor' : {name : '文字背景色', type : 'nicEditorBgColorButton', noClose : true}
	}
};
/* END CONFIG */

var nicEditorColorButton = nicEditorAdvancedButton.extend({	
	addPane : function() {
			var colorList = {0 : '00',1 : '33',2 : '66',3 :'99',4 : 'CC',5 : 'FF'};
			var colorItems = new bkElement('DIV').setStyle({width: '270px'});
			
			for(var r in colorList) {
				for(var b in colorList) {
					for(var g in colorList) {
						var colorCode = '#'+colorList[r]+colorList[g]+colorList[b];
						
						var colorSquare = new bkElement('DIV').setStyle({'cursor' : 'pointer', 'height' : '15px', 'float' : 'left'}).appendTo(colorItems);
						var colorBorder = new bkElement('DIV').setStyle({border: '2px solid '+colorCode}).appendTo(colorSquare);
						var colorInner = new bkElement('DIV').setStyle({backgroundColor : colorCode, overflow : 'hidden', width : '11px', height : '11px'}).addEvent('click',this.colorSelect.closure(this,colorCode)).addEvent('mouseover',this.on.closure(this,colorBorder)).addEvent('mouseout',this.off.closure(this,colorBorder,colorCode)).appendTo(colorBorder);
						
						if(!window.opera) {
							colorSquare.addEvent('mousedown', bkLib.cancelEvent);
							colorInner.addEvent('mousedown', bkLib.cancelEvent);
						}

					}	
				}	
			}
			this.pane.append(colorItems.noSelect());	
	},
	
	colorSelect : function(c) {
		this.ne.nicCommand('foreColor',c);
		this.removePane();
	},
	
	on : function(colorBorder) {
		colorBorder.setStyle({border : '2px solid #000'});
	},
	
	off : function(colorBorder,colorCode) {
		colorBorder.setStyle({border : '2px solid '+colorCode});		
	}
});

var nicEditorBgColorButton = nicEditorColorButton.extend({
	colorSelect : function(c) {
		this.ne.nicCommand(((bkLib.isMSIE) ? 'backcolor' : 'hiliteColor'),c);
		this.removePane();
	}	
});

nicEditors.registerPlugin(nicPlugin,nicColorOptions);



/* START CONFIG */
var nicImageOptions = {
	buttons : {
		'image' : {name : '画像挿入', type : 'nicImageButton', tags : ['IMG']}
	}
	
};
/* END CONFIG */

var nicImageButton = nicEditorAdvancedButton.extend({	
	addPane : function() {
		this.im = this.ne.selectedInstance.selElm().parentTag('IMG');
		this.addForm({
			'' : {type : 'title', txt : '画像挿入'},
			'src' : {type : 'text', txt : 'URL', 'value' : 'http://', style : {width: '150px'}},
			'alt' : {type : 'text', txt : 'タイトル', style : {width: '150px'}},
			'align' : {type : 'select', txt : '位置', options : {'' : 'インライン','left' : '左', 'right' : '右'}}
		},this.im);
	},
	
	submit : function(e) {
		var src = this.inputs['src'].value;
		if(src == "" || src == "http://") {
			alert("画像URLを入力して下さい。");
			return false;
		}
		var attributes = {
			src : this.inputs['src'].value,
			alt : this.inputs['alt'].value,
			align : this.inputs['align'].options[this.inputs['align'].selectedIndex].value
		};
		this.removePane();
		if(!this.im) {
			var tmp = 'javascript:nicImTemp();';
			this.ne.nicCommand("insertImage",tmp);
			this.im = this.findElm('IMG','src',tmp);
		}
		if (this.im) this.im.setAttributes(attributes);
	}
});

nicEditors.registerPlugin(nicPlugin,nicImageOptions);




/* START CONFIG */
var nicSaveOptions = {
	buttons : {
		'save' : {name : '保存', type : 'nicEditorSaveButton'}
	}
};
/* END CONFIG */

var nicEditorSaveButton = nicEditorButton.extend({
	init : function() {
		if(!this.ne.options.onSave) {
			this.margin.setStyle({'display' : 'none'});
		}
	},
	mouseClick : function() {
		var onSave = this.ne.options.onSave;
		var selectedInstance = this.ne.selectedInstance;
		onSave(selectedInstance.getContent(), selectedInstance.elm.id, selectedInstance);
	}
});

nicEditors.registerPlugin(nicPlugin,nicSaveOptions);


var nicXHTML = bkClass.extend({
	stripAttributes : ['_moz_dirty','_moz_resizing','_extended','construct','appendto','appendbefore','addevent','setcontent','pos','noselect','parenttag','hasclass','addclass','removeclass','setstyle','getstyle','remove','setattributes'],
	noChild : ['br','hr','link','meta','base','textarea','input','option','img','object','embed','param','script','style','a','video','audio','source','iframe','td','th'],
	noShort : ['style','title','script','textarea','option','object','embed','param','a','video','audio','source','iframe','td','th'],
	objectAttributes : ['data','classid','codebase','codetype','name','width','height','border','standby','align','hspace','vspace','usemap','tabindex','class','rel'],
	cssReplace : {'font-weight:bold;' : 'strong', 'font-style:italic;' : 'em', 'text-decoration:line-through;' : 'del'},
	sizes : {1 : 'x-small', 2 : 'small', 3 : 'medium', 4 : 'large', 5 : 'x-large', 6 : 'xx-large'},
	legacySizes : {'x-small' : '1', 'small' : '2', 'medium' : '3', 'large' : '4', 'x-large' : '5', 'xx-large' : '6'},
	
	construct : function(nicEditor) {
		this.ne = nicEditor;
		if(this.ne.options.xhtml) {
			nicEditor.addEvent('get',this.cleanup.closure(this));
			nicEditor.addEvent('set',this.restore.closure(this));
			nicEditor.addEvent('add',this.outdated.closure(this));
		}
	},
	
	cleanup : function(ni) {
		var node = ni.getElm();
		var xhtml = this.toXHTML(node);
		ni.content = xhtml;
	},

	outdated : function(ni) {
		var node = ni.getElm();
		var html = this.toLegacyHTML(node);
		node.innerHTML = html;
	},

	restore : function(ni) {
		var node = document.createElement('DIV');
		node.innerHTML = ni.content;
		var html = this.toLegacyHTML(node);
		ni.content = html;
	},

	escapeHTML : function (str) {
		var div = document.createElement('div');
		var text = document.createTextNode(str);
		div.appendChild(text);
		return div.innerHTML;
	},
	
	toXHTML : function(n,r,d,o) {
		var txt = '';
		var attrTxt = '';
		var cssTxt = '';
		var parentTxt = '';
		var parentAttributes = '';
		var nType = n.nodeType;
		var nName = n.nodeName.toLowerCase();
		var nChild = n.hasChildNodes && n.hasChildNodes();
		var extraNodes = new Array();
		
		switch(nType) {
			case 1:
				if (!nChild && !bkLib.inArray(this.noChild,nName)) {
					if (nName == 'p') {
						nName = 'br';
					} else {
						r = false;
					}
				}
				var nAttributes = n.attributes;
				
				switch(nName) {
					case 'b':
						nName = 'strong';
						break;
					case 'i':
						nName = 'em';
						break;
					case 'font':
						nName = 'span';
						break;
					case 's':
						nName = 'del';
						break;
					case 'strike':
						nName = 'del';
						break;
					case 'u':
						nName = 'span';
						cssTxt += 'text-decoration:underline;';
						break;
				}
				
				if(r) {
					var alignFound = false;
					for(var i=0;i<nAttributes.length;i++) {
						var attr = nAttributes[i];
						var attributeName = attr.nodeName.toLowerCase();
						if (bkLib.inArray(this.stripAttributes,attributeName) || !attr.specified) continue;
						var attributeValue = (typeof attr.nodeValue == "string" || typeof attr.nodeValue == "number") ? this.escapeHTML(attr.nodeValue) : (attributeName == "style" && n.style.cssText != null) ? n.style.cssText.replace(/[\w\-]+:/g,function(s){return s.toLowerCase()}) : (attributeName == "class" && n.className != null) ? n.className : null;
						if (!attributeValue) attributeValue = attributeName;
						switch(attributeName) {
							case 'style':
								var css = attributeValue.replace(/\s*([,:;])\s*/g,"$1");
								for(itm in this.cssReplace) {
									if(css.indexOf(itm) != -1) {
										extraNodes.push(this.cssReplace[itm]);
										css = css.replace(itm,'');
									}
								}
								if (css.search(/:/) != -1 && css.search(/;\s*$/) == -1) css += ';';
								if (css.search(/text-align:(left|right|center)/i) != -1) {
									cssTxt = cssTxt.replace(/text-align:\s*[^;]+;?/ig,"");
								} else {
									alignFound = true;
								}
								cssTxt += css;
								attributeValue = "";
							break;
							case 'class':
								attributeValue = attributeValue.replace("Apple-style-span","");
							break;
							case 'size':
								cssTxt = cssTxt.replace(/font-size:\s*[^;]+;?/ig,"");
								if (!attributeValue || attributeValue > 6) attributeValue = parseInt(attributeValue/16);
								cssTxt += "font-size:"+this.sizes[attributeValue]+';';
								attributeValue = "";
							break;
							case 'face':
								cssTxt = cssTxt.replace(/font-family:\s*[^;]+;?/ig,"");
								cssTxt += "font-family:"+attributeValue+';';
								attributeValue = "";
							break;
							case 'color':
								cssTxt = cssTxt.replace(/(^|;|\s)color:\s*[^;]+;?/ig,"$1");
								cssTxt += "color:"+attributeValue+';';
								attributeValue = "";
							break;
							case 'bgcolor':
								cssTxt = cssTxt.replace(/background-color:\s*[^;]+;?/ig,"");
								cssTxt += "background-color:"+attributeValue+';';
								attributeValue = "";
							break;
							case 'align':
								if (nName == "img") {
									cssTxt = cssTxt.replace(/float:\s*[^;]+;?/ig,"");
									cssTxt += "float:"+attributeValue+';';
								} else if (!alignFound) {
									cssTxt += "text-align:"+attributeValue+';';
								}
								attributeValue = "";
							break;
						}
						
						if(attributeValue != null && attributeValue != "") {
							attrTxt += ' '+attributeName+'="'+attributeValue+'"';
							if (!o && nName == 'embed') {
								if (bkLib.inArray(this.objectAttributes,attributeName)) {
									parentAttributes += ' '+attributeName+'="'+attributeValue+'"';
								} else if (attributeName != 'type' && attributeName != 'id') {
									parentTxt += '<param name="'+attributeName+'" value="'+attributeValue+'"></param>';
								}
							}
						}
					}

					if(cssTxt) {
						attrTxt += ' style="'+cssTxt+'"';
					}
					if(r) {
						var extraNodesStart = '';
						for(var i=0;i<extraNodes.length;i++) {
							extraNodesStart = '<'+extraNodes[i]+'>' + extraNodesStart;
						}
						txt += extraNodesStart;
					}
				
					if(attrTxt == "" && nName == "span") {
						r = false;
					}
					if(r) {
						txt += '<'+nName;
						if(nName != 'br') {
							txt += attrTxt;
						}
					}
				}
				
				if(!nChild) {
					if(r) {
						if (bkLib.inArray(this.noShort,nName)) {
							if (!o && nName == 'embed') {
								txt = '<object'+parentAttributes+'>'+parentTxt+txt+'></embed></object>';
							} else {
								txt += '></'+nName+'>';
							}
						} else {
							txt += ' />';
						}
					}
				} else {
					if(r) {
						txt += '>';
					}
					var inobj = (o || nName == 'object') ? true : false;
					for(var i=0;i<n.childNodes.length;i++) {
						var results = this.toXHTML(n.childNodes[i],true,true,inobj);
						if(results) {
							txt += results;
						}
					}
					if (r && bkLib.isMSIE && nName == 'object') {
						var embed = n.innerHTML.match(/<embed.*?>.*?<\/embed>/i);
						if (embed != null) txt += embed;
					}
				}
					
				if(r && nChild) {
					if (!o && nName == 'embed') {
						txt = '<object'+parentAttributes+'>'+parentTxt+txt+'></embed></object>';
					} else {
						txt += '</'+nName+'>';
					}
				}
				
				for(var i=0;i<extraNodes.length;i++) {
					txt += '</'+extraNodes[i]+'>';
				}

				break;
			case 3:
				//if(n.nodeValue != '\n') {
					txt += this.escapeHTML(n.nodeValue);
				//}
				break;
		}
		return txt;
	},
	
	toLegacyHTML : function(n,r,d,o) {
		var txt = '';
		var attrTxt = '';
		var cssTxt = '';
		var parentTxt = '';
		var parentAttributes = '';
		var nType = n.nodeType;
		var nName = n.nodeName.toLowerCase();
		var nChild = n.hasChildNodes && n.hasChildNodes();
		
		switch(nType) {
			case 1:
				if (!nChild && !bkLib.inArray(this.noChild,nName)) {
					if (nName == 'p') {
						nName = 'br';
					} else {
						r = false;
					}
				}
				var nAttributes = n.attributes;
				
				switch(nName) {
					case 'strong':
						nName = 'b';
						break;
					case 'em':
						nName = 'i';
						break;
					case 'del':
						nName = 'span';
						cssTxt += 'text-decoration:line-through;';
						break;
				}
				
				if(r) {
					for(var i=0;i<nAttributes.length;i++) {
						var attr = nAttributes[i];
						
						var attributeName = attr.nodeName.toLowerCase();
						if (bkLib.inArray(this.stripAttributes,attributeName) || !attr.specified) continue;
						var attributeValue = (typeof attr.nodeValue == "string" || typeof attr.nodeValue == "number") ? this.escapeHTML(attr.nodeValue) : (attributeName == "style" && n.style.cssText != null) ? n.style.cssText.replace(/[\w\-]+:/g,function(s){return s.toLowerCase()}) : (attributeName == "class" && n.className != null) ? n.className : null;
						if (!attributeValue) attributeValue = attributeName;
						attributeValue = attributeValue.replace(/"/g,"'");
						if (attributeName == 'style') {
							if (attributeValue.search(/text-decoration:\s*underline/i) != -1) {
								nName = 'u';
								attributeValue = "";
							} else {
								var my = this;
								var css = attributeValue.replace(/([^:\s]+)\s*:\s*([^;]+)\s*;?/g,function(w,k,v) {
									k = k.toLowerCase();
									if (nName == 'span' || nName == 'font') {
										if (k == 'font-family') {
											nName = 'font';
											attrTxt += ' face="'+v+'"';
											return "";
										}
										v = v.toLowerCase();
										if (k == 'font-size') {
											nName = 'font';
											if (typeof my.legacySizes[v] != 'undefined') {
												attrTxt += ' size="'+my.legacySizes[v]+'"';
												return "";
											}
										} else if (k == 'color') {
											nName = 'font';
											if (v.search(/rgb/i) == -1) {
												attrTxt += ' color="'+v+'"';
												return "";
											}
										} else if (k == 'background-color') {
											nName = 'font';
										}
									} else if (nName == "img" && k == "float") {
										v = v.toLowerCase();
										if (v != "" && v !="none") attrTxt += ' align="'+v+'"';
										return "";
									} else if (k == "text-align") {
										v = v.toLowerCase();
										attrTxt += ' align="'+v+'"';
										return "";
									}
									return k+':'+v+';';
								});
								cssTxt += css;
								attributeValue = "";
							}
						}
						
						if (attributeValue != null && attributeValue != "") {
							attrTxt += ' '+attributeName+'="'+attributeValue+'"';
							if (!o && nName == 'embed') {
								if (bkLib.inArray(this.objectAttributes,attributeName)) {
									parentAttributes += ' '+attributeName+'="'+attributeValue+'"';
								} else if (attributeName != 'type' && attributeName != 'id') {
									parentTxt += '<param name="'+attributeName+'" value="'+attributeValue+'"></param>';
								}
							}
						}
					}

					if(cssTxt) {
						attrTxt += ' style="'+cssTxt+'"';
					}

					if(attrTxt == "" && nName == "span") {
						r = false;
					}
					if(r) {
						txt += '<'+nName;
						if(nName != 'br') {
							txt += attrTxt;
						}
					}
				}
				
				if(!nChild) {
					if(r) {
						if (bkLib.inArray(this.noShort,nName)) {
							if (!o && nName == 'embed') {
								txt = '<object'+parentAttributes+'>'+parentTxt+txt+'></embed></object>';
							} else {
								txt += '></'+nName+'>';
							}
						} else {
							txt += ' />';
						}
					}
				} else {
					if(r) {
						txt += '>';
					}
					var inobj = (o || nName == 'object') ? true : false;
					for(var i=0;i<n.childNodes.length;i++) {
						var results = this.toLegacyHTML(n.childNodes[i],true,true,inobj);
						if(results) {
							txt += results;
						}
					}
					if (r && bkLib.isMSIE && nName == 'object') {
						var embed = n.innerHTML.match(/<embed.*?>.*?<\/embed>/i);
						if (embed != null) txt += embed;
					}
				}
					
				if(r && nChild) {
					if (!o && nName == 'embed') {
						txt = '<object'+parentAttributes+'>'+parentTxt+txt+'></embed></object>';
					} else {
						txt += '</'+nName+'>';
					}
				}
				break;
			case 3:
				//if(n.nodeValue != '\n') {
					txt += this.escapeHTML(n.nodeValue);
				//}
				break;
		}
		
		return txt;
	}
});
nicEditors.registerPlugin(nicXHTML);




nicEditor = nicEditor.extend({
        floatingPanel : function() {
                this.floating = new bkElement('DIV').setStyle({position: 'absolute', top : '-1000px'}).appendTo(document.body);
                this.addEvent('focus', this.reposition.closure(this)).addEvent('blur', this.hide.closure(this));
                this.setPanel(this.floating);
        },
        
        reposition : function() {
                var e = this.selectedInstance.e;
                this.floating.setStyle({ width : (parseInt(e.getStyle('width')) || e.clientWidth)+'px' });
                var top = e.offsetTop-this.floating.offsetHeight;
                if(top < 0) {
                        top = e.offsetTop+e.offsetHeight;
                }
                
                this.floating.setStyle({ top : top+'px', left : e.offsetLeft+'px', display : 'block' });
        },
        
        hide : function() {
                this.floating.setStyle({ top : '-1000px'});
        }
});



/* START CONFIG */
var nicCodeOptions = {
	buttons : {
		'xhtml' : {name : 'HTMLソース編集', type : 'nicCodeButton'}
	}
	
};
/* END CONFIG */

var nicCodeButton = nicEditorAdvancedButton.extend({
	width : '350px',
		
	addPane : function() {
		this.addForm({
			'' : {type : 'title', txt : 'HTMLソース編集'},
			'code' : {type : 'content', 'value' : this.ne.selectedInstance.getContent(), style : {width: '340px', height : '200px'}}
		});
	},
	
	submit : function(e) {
		var code = this.inputs['code'].value;
		this.ne.selectedInstance.setContent(code);
		this.removePane();
	}

});

nicEditors.registerPlugin(nicPlugin,nicCodeOptions);


