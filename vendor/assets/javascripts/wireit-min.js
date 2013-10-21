var WireIt={defaultWireClass:"WireIt.BezierWire",wireClassFromXtype:function(a){return this.classFromXtype(a,this.defaultWireClass)},defaultTerminalClass:"WireIt.Terminal",terminalClassFromXtype:function(a){return this.classFromXtype(a,this.defaultTerminalClass)},defaultContainerClass:"WireIt.Container",containerClassFromXtype:function(a){return this.classFromXtype(a,this.defaultContainerClass)},classFromXtype:function(e,c){var d=(e||c).split(".");var a=window;for(var b=0;b<d.length;b++){a=a[d[b]]}if(!YAHOO.lang.isFunction(a)){throw new Error("WireIt unable to find klass from xtype: '"+e+"'")}return a},getIntStyle:function(b,a){var c=YAHOO.util.Dom.getStyle(b,a);return parseInt(c.substr(0,c.length-2),10)},sn:function(d,c,a){if(!d){return}var b;if(c){for(b in c){if(c.hasOwnProperty(b)){var e=c[b];if(typeof(e)=="function"){continue}if(b=="className"){b="class";d.className=e}if(e!==d.getAttribute(b)){if(e===false){d.removeAttribute(b)}else{d.setAttribute(b,e)}}}}}if(a){for(b in a){if(a.hasOwnProperty(b)){if(typeof(a[b])=="function"){continue}if(b==="float"){b="cssFloat"}if(d.style[b]!=a[b]){d.style[b]=a[b]}}}}},cn:function(a,c,b,e){var d=document.createElement(a);this.sn(d,c,b);if(e){d.innerHTML=e}return d},indexOf:YAHOO.lang.isFunction(Array.prototype.indexOf)?function(b,a){return a.indexOf(b)}:function(c,a){for(var b=0;b<a.length;b++){if(a[b]==c){return b}}return -1},compact:YAHOO.lang.isFunction(Array.prototype.compact)?function(a){return a.compact()}:function(a){var c=[];for(var b=0;b<a.length;b++){if(a[b]){c.push(a[b])}}return c}};WireIt.util={};(function(){var a=YAHOO.util.Event,b=YAHOO.env.ua;WireIt.CanvasElement=function(c){this.element=document.createElement("canvas");c.appendChild(this.element);if(typeof(G_vmlCanvasManager)!="undefined"){this.element=G_vmlCanvasManager.initElement(this.element)}};WireIt.CanvasElement.prototype={getContext:function(c){return this.element.getContext(c||"2d")},destroy:function(){var c=this.element;if(YAHOO.util.Dom.inDocument(c)){c.parentNode.removeChild(c)}a.purgeElement(c,true)},SetCanvasRegion:b.ie?function(g,f,e,c){var d=this.element;WireIt.sn(d,null,{left:g+"px",top:f+"px",width:e+"px",height:c+"px"});d.getContext("2d").clearRect(0,0,e,c);this.element=d}:((b.webkit||b.opera)?function(f,j,c,k){var d=this.element;var h=WireIt.cn("canvas",{className:d.className||d.getAttribute("class"),width:c,height:k},{left:f+"px",top:j+"px"});var i=a.getListeners(d);for(var e in i){if(i.hasOwnProperty(e)){var g=i[e];a.addListener(h,g.type,g.fn,g.obj,g.adjust)}}a.purgeElement(d);d.parentNode.replaceChild(h,d);this.element=h}:function(f,e,d,c){WireIt.sn(this.element,{width:d,height:c},{left:f+"px",top:e+"px"})})}})();WireIt.Wire=function(d,c,b,a){this.parentEl=b;this.terminal1=d;this.terminal2=c;this.eventMouseClick=new YAHOO.util.CustomEvent("eventMouseClick");this.eventMouseIn=new YAHOO.util.CustomEvent("eventMouseIn");this.eventMouseOut=new YAHOO.util.CustomEvent("eventMouseOut");this.eventMouseMove=new YAHOO.util.CustomEvent("eventMouseMove");this.setOptions(a||{});WireIt.Wire.superclass.constructor.call(this,this.parentEl);YAHOO.util.Dom.addClass(this.element,this.className);if(this.label){this.renderLabel()}this.terminal1.addWire(this);this.terminal2.addWire(this)};YAHOO.lang.extend(WireIt.Wire,WireIt.CanvasElement,{xtype:"WireIt.Wire",className:"WireIt-Wire",cap:"round",bordercap:"round",width:3,borderwidth:1,color:"rgb(173, 216, 230)",bordercolor:"#0000ff",label:null,labelStyle:null,labelEditor:null,setOptions:function(b){for(var a in b){if(b.hasOwnProperty(a)){this[a]=b[a]}}},remove:function(){this.parentEl.removeChild(this.element);if(this.terminal1&&this.terminal1.removeWire){this.terminal1.removeWire(this)}if(this.terminal2&&this.terminal2.removeWire){this.terminal2.removeWire(this)}this.terminal1=null;this.terminal2=null;if(this.labelEl){if(this.labelField){this.labelField.destroy()}this.labelEl.innerHTML=""}},getOtherTerminal:function(a){return(a==this.terminal1)?this.terminal2:this.terminal1},draw:function(){var e=[4,4];var h=this.terminal1.getXY();var g=this.terminal2.getXY();var d=[Math.min(h[0],g[0])-e[0],Math.min(h[1],g[1])-e[1]];var b=[Math.max(h[0],g[0])+e[0],Math.max(h[1],g[1])+e[1]];this.min=d;this.max=b;var f=Math.abs(b[0]-d[0]);var c=Math.abs(b[1]-d[1]);h[0]=h[0]-d[0];h[1]=h[1]-d[1];g[0]=g[0]-d[0];g[1]=g[1]-d[1];this.SetCanvasRegion(d[0],d[1],f,c);var a=this.getContext();a.lineCap=this.bordercap;a.strokeStyle=this.bordercolor;a.lineWidth=this.width+this.borderwidth*2;a.beginPath();a.moveTo(h[0],h[1]);a.lineTo(g[0],g[1]);a.stroke();a.lineCap=this.cap;a.strokeStyle=this.color;a.lineWidth=this.width;a.beginPath();a.moveTo(h[0],h[1]);a.lineTo(g[0],g[1]);a.stroke()},redraw:function(){this.draw();if(this.label){this.positionLabel()}},renderLabel:function(){this.labelEl=WireIt.cn("div",{className:"WireIt-Wire-Label"},this.labelStyle);if(this.labelEditor){this.labelField=new inputEx.InPlaceEdit({parentEl:this.labelEl,editorField:this.labelEditor,animColors:{from:"#FFFF99",to:"#DDDDFF"}});this.labelField.setValue(this.label)}else{this.labelEl.innerHTML=this.label}this.element.parentNode.appendChild(this.labelEl)},setLabel:function(a){if(this.labelEditor){this.labelField.setValue(a)}else{this.labelEl.innerHTML=a}},positionLabel:function(){YAHOO.util.Dom.setStyle(this.labelEl,"left",(this.min[0]+this.max[0]-this.labelEl.clientWidth)/2+"px");YAHOO.util.Dom.setStyle(this.labelEl,"top",(this.min[1]+this.max[1]-this.labelEl.clientHeight)/2+"px")},wireDrawnAt:function(b,e){var a=this.getContext();var d=a.getImageData(b,e,1,1);var c=d.data;return !(c[0]===0&&c[1]===0&&c[2]===0&&c[3]===0)},onMouseMove:function(a,b){if(this.mouseInState===undefined){this.mouseInState=false}if(this.wireDrawnAt(a,b)){if(!this.mouseInState){this.mouseInState=true;this.onWireIn(a,b)}this.onWireMove(a,b)}else{if(this.mouseInState){this.mouseInState=false;this.onWireOut(a,b)}}},onWireMove:function(a,b){this.eventMouseMove.fire(this,[a,b])},onWireIn:function(a,b){this.eventMouseIn.fire(this,[a,b])},onWireOut:function(a,b){this.eventMouseOut.fire(this,[a,b])},onClick:function(a,b){if(this.wireDrawnAt(a,b)){this.onWireClick(a,b)}},onWireClick:function(a,b){this.eventMouseClick.fire(this,[a,b])},getConfig:function(){var a={xtype:this.xtype};if(this.labelEditor){a.label=this.labelField.getValue()}return a}});WireIt.StepWire=function(d,c,b,a){WireIt.StepWire.superclass.constructor.call(this,d,c,b,a)};YAHOO.lang.extend(WireIt.StepWire,WireIt.Wire,{xtype:"WireIt.StepWire",draw:function(){var b=[4,4];var h=this.terminal1.getXY();var g=this.terminal2.getXY();var c=[Math.min(h[0],g[0])-b[0],Math.min(h[1],g[1])-b[1]];var e=[Math.max(h[0],g[0])+b[0],Math.max(h[1],g[1])+b[1]];var a=Math.abs(e[0]-c[0]);var i=Math.abs(e[1]-c[1]);h[0]=h[0]-c[0];h[1]=h[1]-c[1];g[0]=g[0]-c[0];g[1]=g[1]-c[1];var f=[g[0],g[1]];g[1]=h[1];this.SetCanvasRegion(c[0],c[1],a,i);var d=this.getContext();d.lineCap=this.bordercap;d.strokeStyle=this.bordercolor;d.lineWidth=this.width+this.borderwidth*2;d.beginPath();d.moveTo(h[0],h[1]);d.lineTo(g[0],g[1]);d.lineTo(f[0],f[1]);d.stroke();d.lineCap=this.cap;d.strokeStyle=this.color;d.lineWidth=this.width;d.beginPath();d.moveTo(h[0],h[1]);d.lineTo(g[0],g[1]);d.lineTo(f[0],f[1]);d.stroke()}});WireIt.ArrowWire=function(d,c,b,a){WireIt.ArrowWire.superclass.constructor.call(this,d,c,b,a)};YAHOO.lang.extend(WireIt.ArrowWire,WireIt.Wire,{xtype:"WireIt.ArrowWire",draw:function(){var L=7;var g=L+3;var D=[4+g,4+g];var e=this.terminal1.getXY();var c=this.terminal2.getXY();var j=Math.sqrt(Math.pow(e[0]-c[0],2)+Math.pow(e[1]-c[1],2));var H=[Math.min(e[0],c[0])-D[0],Math.min(e[1],c[1])-D[1]];var I=[Math.max(e[0],c[0])+D[0],Math.max(e[1],c[1])+D[1]];this.min=H;this.max=I;var k=Math.abs(I[0]-H[0])+g;var x=Math.abs(I[1]-H[1])+g;e[0]=e[0]-H[0];e[1]=e[1]-H[1];c[0]=c[0]-H[0];c[1]=c[1]-H[1];this.SetCanvasRegion(H[0],H[1],k,x);var n=this.getContext();n.lineCap=this.bordercap;n.strokeStyle=this.bordercolor;n.lineWidth=this.width+this.borderwidth*2;n.beginPath();n.moveTo(e[0],e[1]);n.lineTo(c[0],c[1]);n.stroke();n.lineCap=this.cap;n.strokeStyle=this.color;n.lineWidth=this.width;n.beginPath();n.moveTo(e[0],e[1]);n.lineTo(c[0],c[1]);n.stroke();var s=e;var r=c;var q=[0,0];var m=20;var v=(j===0)?0:1-(m/j);q[0]=Math.abs(s[0]+v*(r[0]-s[0]));q[1]=Math.abs(s[1]+v*(r[1]-s[1]));var O,N;var i=s[0]-r[0];var w=s[1]-r[1];var u=s[0]*r[1]-s[1]*r[0];if(i!==0){O=w/i;N=u/i}else{O=0}var l,p;if(O===0){l=0}else{l=-1/O}p=q[1]-l*q[0];var F=1+Math.pow(l,2);var E=2*l*p-2*q[0]-2*q[1]*l;var y=-2*q[1]*p+Math.pow(q[0],2)+Math.pow(q[1],2)-Math.pow(L,2)+Math.pow(p,2);var M=Math.pow(E,2)-4*F*y;if(M<0){return}var K=(-E+Math.sqrt(M))/(2*F);var J=(-E-Math.sqrt(M))/(2*F);var h=l*K+p;var f=l*J+p;if(s[1]==r[1]){var G=(s[0]>r[0])?1:-1;K=r[0]+G*m;J=K;h-=L;f+=L}n.fillStyle=this.color;n.beginPath();n.moveTo(r[0],r[1]);n.lineTo(K,h);n.lineTo(J,f);n.fill();n.strokeStyle=this.bordercolor;n.lineWidth=this.borderwidth;n.beginPath();n.moveTo(r[0],r[1]);n.lineTo(K,h);n.lineTo(J,f);n.lineTo(r[0],r[1]);n.stroke()}});WireIt.BezierWire=function(d,c,b,a){WireIt.BezierWire.superclass.constructor.call(this,d,c,b,a)};YAHOO.lang.extend(WireIt.BezierWire,WireIt.Wire,{xtype:"WireIt.BezierWire",coeffMulDirection:100,draw:function(){var q=this.terminal1.getXY();var n=this.terminal2.getXY();var f=this.coeffMulDirection;var b=Math.sqrt(Math.pow(q[0]-n[0],2)+Math.pow(q[1]-n[1],2));if(b<f){f=b/2}var c=[this.terminal1.direction[0]*f,this.terminal1.direction[1]*f];var a=[this.terminal2.direction[0]*f,this.terminal2.direction[1]*f];var m=[];m[0]=q;m[1]=[q[0]+c[0],q[1]+c[1]];m[2]=[n[0]+a[0],n[1]+a[1]];m[3]=n;var h=[q[0],q[1]];var l=[q[0],q[1]];for(var j=1;j<m.length;j++){var d=m[j];if(d[0]<h[0]){h[0]=d[0]}if(d[1]<h[1]){h[1]=d[1]}if(d[0]>l[0]){l[0]=d[0]}if(d[1]>l[1]){l[1]=d[1]}}var g=[4,4];h[0]=h[0]-g[0];h[1]=h[1]-g[1];l[0]=l[0]+g[0];l[1]=l[1]+g[1];var e=Math.abs(l[0]-h[0]);var o=Math.abs(l[1]-h[1]);this.min=h;this.max=l;this.SetCanvasRegion(h[0],h[1],e,o);var k=this.getContext();for(j=0;j<m.length;j++){m[j][0]=m[j][0]-h[0];m[j][1]=m[j][1]-h[1]}k.lineCap=this.bordercap;k.strokeStyle=this.bordercolor;k.lineWidth=this.width+this.borderwidth*2;k.beginPath();k.moveTo(m[0][0],m[0][1]);k.bezierCurveTo(m[1][0],m[1][1],m[2][0],m[2][1],m[3][0],m[3][1]);k.stroke();k.lineCap=this.cap;k.strokeStyle=this.color;k.lineWidth=this.width;k.beginPath();k.moveTo(m[0][0],m[0][1]);k.bezierCurveTo(m[1][0],m[1][1],m[2][0],m[2][1],m[3][0],m[3][1]);k.stroke()}});WireIt.BezierArrowWire=function(d,c,b,a){WireIt.BezierArrowWire.superclass.constructor.call(this,d,c,b,a)};YAHOO.lang.extend(WireIt.BezierArrowWire,WireIt.BezierWire,{xtype:"WireIt.BezierArrowWire",draw:function(){var e=Math.round(this.width*1.5+20);var u=Math.round(this.width*1.2+20);var S=e/2;var g=S+3;var f=[4+g,4+g];var R=this.terminal1.getXY();var Q=this.terminal2.getXY();var X=this.coeffMulDirection;var s=Math.sqrt(Math.pow(R[0]-Q[0],2)+Math.pow(R[1]-Q[1],2));if(s<X){X=s/2}var N=[this.terminal1.direction[0]*X,this.terminal1.direction[1]*X];var M=[this.terminal2.direction[0]*X,this.terminal2.direction[1]*X];var r=[];r[0]=R;r[1]=[R[0]+N[0],R[1]+N[1]];r[2]=[Q[0]+M[0],Q[1]+M[1]];r[3]=Q;var T=[R[0],R[1]];var v=[R[0],R[1]];for(var P=1;P<r.length;P++){var J=r[P];if(J[0]<T[0]){T[0]=J[0]}if(J[1]<T[1]){T[1]=J[1]}if(J[0]>v[0]){v[0]=J[0]}if(J[1]>v[1]){v[1]=J[1]}}T[0]=T[0]-f[0];T[1]=T[1]-f[1];v[0]=v[0]+f[0];v[1]=v[1]+f[1];var w=Math.abs(v[0]-T[0]);var F=Math.abs(v[1]-T[1]);this.min=T;this.max=v;this.SetCanvasRegion(T[0],T[1],w,F);var L=this.getContext();for(P=0;P<r.length;P++){r[P][0]=r[P][0]-T[0];r[P][1]=r[P][1]-T[1]}L.lineCap=this.bordercap;L.strokeStyle=this.bordercolor;L.lineWidth=this.width+this.borderwidth*2;L.beginPath();L.moveTo(r[0][0],r[0][1]);L.bezierCurveTo(r[1][0],r[1][1],r[2][0],r[2][1],r[3][0],r[3][1]+u/2*this.terminal2.direction[1]);L.stroke();L.lineCap=this.cap;L.strokeStyle=this.color;L.lineWidth=this.width;L.beginPath();L.moveTo(r[0][0],r[0][1]);L.bezierCurveTo(r[1][0],r[1][1],r[2][0],r[2][1],r[3][0],r[3][1]+u/2*this.terminal2.direction[1]);L.stroke();var E=r[2],D=Q;var H=[0,0];var h=u;var I=1-(h/s);H[0]=Math.abs(E[0]+I*(D[0]-E[0]));H[1]=Math.abs(E[1]+I*(D[1]-E[1]));var V,U;var c=E[0]-D[0];var y=E[1]-D[1];var x=E[0]*D[1]-E[1]*D[0];if(c!==0){V=y/c;U=x/c}else{V=0}var q,O;if(V===0){q=0}else{q=-1/V}O=H[1]-q*H[0];var m=1+Math.pow(q,2),k=2*q*O-2*H[0]-2*H[1]*q,j=-2*H[1]*O+Math.pow(H[0],2)+Math.pow(H[1],2)-Math.pow(S,2)+Math.pow(O,2),G=Math.pow(k,2)-4*m*j;if(G<0){return false}var n=(-k+Math.sqrt(G))/(2*m),l=(-k-Math.sqrt(G))/(2*m),Z=q*n+O,Y=q*l+O;if(E[1]==D[1]){var K=(E[0]>D[0])?1:-1;n=D[0]+K*h;l=n;Z-=S;Y+=S}L.fillStyle=this.color;L.beginPath();L.moveTo(D[0],D[1]);L.lineTo(n,Z);L.lineTo(l,Y);L.fill();L.strokeStyle=this.bordercolor;L.lineWidth=this.borderwidth;L.beginPath();L.moveTo(D[0],D[1]);L.lineTo(n,Z);L.lineTo(l,Y);L.lineTo(D[0],D[1]);L.stroke();return[R,Q,E,D]}});(function(){var a=YAHOO.util;var c=YAHOO.lang,b="WireIt-";WireIt.TerminalProxy=function(e,d){this.terminal=e;this.termConfig=d||{};this.terminalProxySize=d.terminalProxySize||10;this.fakeTerminal=null;WireIt.TerminalProxy.superclass.constructor.call(this,this.terminal.el,undefined,{dragElId:"WireIt-TerminalProxy",resizeFrame:false,centerFrame:true})};a.DDM.mode=a.DDM.INTERSECT;c.extend(WireIt.TerminalProxy,YAHOO.util.DDProxy,{createFrame:function(){var e=this,d=document.body;if(!d||!d.firstChild){window.setTimeout(function(){e.createFrame()},50);return}var h=this.getDragEl(),g=YAHOO.util.Dom;if(!h){h=WireIt.cn("div",{id:this.dragElId},{position:"absolute",visibility:"hidden",cursor:"move",border:"2px solid #aaa",zIndex:999,height:this.terminalProxySize+"px",width:this.terminalProxySize+"px"});var f=WireIt.cn("div",{},{height:"100%",width:"100%",backgroundColor:"#ccc",opacity:"0"});h.appendChild(f);d.insertBefore(h,d.firstChild)}},startDrag:function(){if(this.terminal.nMaxWires==1&&this.terminal.wires.length==1){this.terminal.wires[0].remove()}else{if(this.terminal.wires.length>=this.terminal.nMaxWires){return}}var e=this.terminalProxySize/2;this.fakeTerminal={direction:this.terminal.fakeDirection,pos:[200,200],addWire:function(){},removeWire:function(){},getXY:function(){var g=YAHOO.util.Dom.getElementsByClassName("WireIt-Layer");if(g.length>0){var h=YAHOO.util.Dom.getXY(g[0]);return[this.pos[0]-h[0]+e,this.pos[1]-h[1]+e]}return this.pos}};var f=this.terminal.parentEl.parentNode;if(this.terminal.container){f=this.terminal.container.layer.el}var d=WireIt.wireClassFromXtype(this.terminal.editingWireConfig.xtype);this.editingWire=new d(this.terminal,this.fakeTerminal,f,this.terminal.editingWireConfig);YAHOO.util.Dom.addClass(this.editingWire.element,b+"Wire-editing")},onDrag:function(g){if(!this.editingWire){return}if(this.terminal.container){var f=this.terminal.container.layer.el;var h=0;var d=0;if(f.offsetParent){do{h+=f.scrollLeft;d+=f.scrollTop;f=f.offsetParent}while(f)}this.fakeTerminal.pos=[g.clientX+h,g.clientY+d]}else{this.fakeTerminal.pos=(YAHOO.env.ua.ie)?[g.clientX,g.clientY]:[g.clientX+window.pageXOffset,g.clientY+window.pageYOffset]}this.editingWire.redraw()},endDrag:function(d){if(this.editingWire){this.editingWire.remove();this.editingWire=null}},onDragEnter:function(g,d){if(!this.editingWire){return}for(var f=0;f<d.length;f++){if(this.isValidWireTerminal(d[f])){d[f].terminal.setDropInvitation(true)}}},onDragOut:function(g,d){if(!this.editingWire){return}for(var f=0;f<d.length;f++){if(this.isValidWireTerminal(d[f])){d[f].terminal.setDropInvitation(false)}}},onDragDrop:function(n,l){var j;if(!this.editingWire){return}this.onDragOut(n,l);var p=null;for(j=0;j<l.length;j++){if(this.isValidWireTerminal(l[j])){p=l[j];break}}if(!p){return}this.editingWire.remove();this.editingWire=null;var h=false;for(j=0;j<this.terminal.wires.length;j++){if(this.terminal.wires[j].terminal1==this.terminal){if(this.terminal.wires[j].terminal2==p.terminal){h=true;break}}else{if(this.terminal.wires[j].terminal2==this.terminal){if(this.terminal.wires[j].terminal1==p.terminal){h=true;break}}}}if(h){return}var k=this.terminal.parentEl.parentNode;if(this.terminal.container){k=this.terminal.container.layer.el}var g=this.terminal;var f=p.terminal;if(f.alwaysSrc){g=p.terminal;f=this.terminal}var m=WireIt.wireClassFromXtype(g.wireConfig.xtype);var d=p.terminal,o;if(d.nMaxWires==1){if(d.wires.length>0){d.wires[0].remove()}o=new m(g,f,k,g.wireConfig);o.redraw()}else{if(d.wires.length<d.nMaxWires){o=new m(g,f,k,g.wireConfig);o.redraw()}}},isWireItTerminal:true,isValidWireTerminal:function(d){if(!d.isWireItTerminal){return false}if(this.termConfig.type){if(this.termConfig.allowedTypes){if(WireIt.indexOf(d.termConfig.type,this.termConfig.allowedTypes)==-1){return false}}else{if(this.termConfig.type!=d.termConfig.type){return false}}}else{if(d.termConfig.type){if(d.termConfig.allowedTypes){if(WireIt.indexOf(this.termConfig.type,d.termConfig.allowedTypes)==-1){return false}}else{if(this.termConfig.type!=d.termConfig.type){return false}}}}if(this.terminal.container){if(this.terminal.container.preventSelfWiring){if(d.terminal.container==this.terminal.container){return false}}}return true}})})();(function(){var b=YAHOO.util;var a=b.Event,d=YAHOO.lang,c="WireIt-";WireIt.Scissors=function(e,f){WireIt.Scissors.superclass.constructor.call(this,document.createElement("div"),f);this._terminal=e;this.initScissors()};WireIt.Scissors.visibleInstance=null;d.extend(WireIt.Scissors,YAHOO.util.Element,{initScissors:function(){this.hideNow();this.addClass(c+"Wire-scissors");this.appendTo(this._terminal.container?this._terminal.container.layer.el:this._terminal.el.parentNode.parentNode);this.on("mouseover",this.show,this,true);this.on("mouseout",this.hide,this,true);this.on("click",this.scissorClick,this,true);a.addListener(this._terminal.el,"mouseover",this.mouseOver,this,true);a.addListener(this._terminal.el,"mouseout",this.hide,this,true)},setPosition:function(){var e=this._terminal.getXY();this.setStyle("left",(e[0]+this._terminal.direction[0]*30-8)+"px");this.setStyle("top",(e[1]+this._terminal.direction[1]*30-8)+"px")},mouseOver:function(){if(this._terminal.wires.length>0){this.show()}},scissorClick:function(){this._terminal.removeAllWires();if(this.terminalTimeout){this.terminalTimeout.cancel()}this.hideNow()},show:function(){this.setPosition();this.setStyle("display","");if(WireIt.Scissors.visibleInstance&&WireIt.Scissors.visibleInstance!=this){if(WireIt.Scissors.visibleInstance.terminalTimeout){WireIt.Scissors.visibleInstance.terminalTimeout.cancel()}WireIt.Scissors.visibleInstance.hideNow()}WireIt.Scissors.visibleInstance=this;if(this.terminalTimeout){this.terminalTimeout.cancel()}},hide:function(){this.terminalTimeout=YAHOO.lang.later(700,this,this.hideNow)},hideNow:function(){WireIt.Scissors.visibleInstance=null;this.setStyle("display","none")}})})();(function(){var b=YAHOO.util;var a=b.Event,e=YAHOO.lang,c=b.Dom,d="WireIt-";WireIt.Terminal=function(h,g,f){this.name=null;this.parentEl=h;this.container=f;this.wires=[];this.setOptions(g);this.eventAddWire=new b.CustomEvent("eventAddWire");this.eventRemoveWire=new b.CustomEvent("eventRemoveWire");this.el=null;this.render();if(this.editable){this.dd=new WireIt.TerminalProxy(this,this.ddConfig);this.scissors=new WireIt.Scissors(this)}};WireIt.Terminal.prototype={xtype:"WireIt.Terminal",direction:[0,1],fakeDirection:[0,-1],editable:true,nMaxWires:Infinity,wireConfig:{},editingWireConfig:{},className:"WireIt-Terminal",connectedClassName:"WireIt-Terminal-connected",dropinviteClassName:"WireIt-Terminal-dropinvite",offsetPosition:null,alwaysSrc:false,ddConfig:false,setOptions:function(g){for(var f in g){if(g.hasOwnProperty(f)){this[f]=g[f]}}if(g.direction&&!g.fakeDirection){this.fakeDirection=[-g.direction[0],-g.direction[1]]}if(g.wireConfig&&!g.editingWireConfig){this.editingWireConfig=this.wireConfig}},setDropInvitation:function(f){if(f){c.addClass(this.el,this.dropinviteClassName)}else{c.removeClass(this.el,this.dropinviteClassName)}},render:function(){this.el=WireIt.cn("div",{className:this.className});if(this.name){this.el.title=this.name}this.setPosition(this.offsetPosition);this.parentEl.appendChild(this.el)},setPosition:function(g){if(g){this.el.style.left="";this.el.style.top="";this.el.style.right="";this.el.style.bottom="";if(e.isArray(g)){this.el.style.left=g[0]+"px";this.el.style.top=g[1]+"px"}else{if(e.isObject(g)){for(var f in g){if(g.hasOwnProperty(f)&&g[f]!==""){this.el.style[f]=g[f]+"px"}}}}}},addWire:function(f){this.wires.push(f);c.addClass(this.el,this.connectedClassName);this.eventAddWire.fire(f)},removeWire:function(g){var f=WireIt.indexOf(g,this.wires);if(f!=-1){this.wires[f].destroy();this.wires[f]=null;this.wires=WireIt.compact(this.wires);if(this.wires.length===0){c.removeClass(this.el,this.connectedClassName)}this.eventRemoveWire.fire(g)}},getXY:function(){var g=this.container&&this.container.layer?this.container.layer.el:document.body;var h=this.el;var i=0,f=0;if(h.offsetParent){do{i+=h.offsetLeft;f+=h.offsetTop;h=h.offsetParent}while(!!h&&h!=g&&!YAHOO.util.Dom.hasClass(h,"WireIt-Layer"))}return[i+15,f+15]},remove:function(){while(this.wires.length>0){this.wires[0].remove()}this.parentEl.removeChild(this.el);a.purgeElement(this.el);if(this.scissors){a.purgeElement(this.scissors.get("element"))}},getConnectedTerminals:function(){var f=[];if(this.wires){for(var g=0;g<this.wires.length;g++){f.push(this.wires[g].getOtherTerminal(this))}}return f},redrawAllWires:function(){if(this.wires){for(var f=0;f<this.wires.length;f++){this.wires[f].redraw()}}},removeAllWires:function(){while(this.wires.length>0){this.wires[0].remove()}}}})();WireIt.util.TerminalInput=function(c,b,a){WireIt.util.TerminalInput.superclass.constructor.call(this,c,b,a)};YAHOO.lang.extend(WireIt.util.TerminalInput,WireIt.Terminal,{xtype:"WireIt.TerminalInput",direction:[0,-1],fakeDirection:[0,1],nMaxWires:1,ddConfig:{type:"input",allowedTypes:["output"]}});WireIt.util.TerminalOutput=function(c,b,a){WireIt.util.TerminalOutput.superclass.constructor.call(this,c,b,a)};YAHOO.lang.extend(WireIt.util.TerminalOutput,WireIt.Terminal,{xtype:"WireIt.TerminalOutput",direction:[0,1],fakeDirection:[0,-1],ddConfig:{type:"output",allowedTypes:["input"]},alwaysSrc:true});WireIt.util.DD=function(d,c,a,b){if(!d){throw new Error("WireIt.util.DD needs at least terminals and id")}this._WireItTerminals=d;WireIt.util.DD.superclass.constructor.call(this,c,a,b)};YAHOO.extend(WireIt.util.DD,YAHOO.util.DD,{onDrag:function(c){var a=YAHOO.lang.isArray(this._WireItTerminals)?this._WireItTerminals:(this._WireItTerminals.isWireItTerminal?[this._WireItTerminals]:[]);for(var b=0;b<a.length;b++){a[b].redrawAllWires()}},setTerminals:function(a){this._WireItTerminals=a}});WireIt.util.DDResize=function(a,b){this.myConf=b||{};this.myConf.container=a;this.myConf.minWidth=this.myConf.minWidth||50;this.myConf.minHeight=this.myConf.minHeight||50;WireIt.util.DDResize.superclass.constructor.apply(this,[a.el,a.ddResizeHandle]);this.setHandleElId(a.ddResizeHandle);this.eventResize=new YAHOO.util.CustomEvent("eventResize")};YAHOO.extend(WireIt.util.DDResize,YAHOO.util.DragDrop,{onMouseDown:function(b){var a=this.getEl();this.startWidth=a.offsetWidth;this.startHeight=a.offsetHeight;this.startPos=[YAHOO.util.Event.getPageX(b),YAHOO.util.Event.getPageY(b)]},onDrag:function(g){var d=[YAHOO.util.Event.getPageX(g),YAHOO.util.Event.getPageY(g)];var a=d[0]-this.startPos[0];var h=d[1]-this.startPos[1];var f=Math.max(this.startWidth+a,this.myConf.minWidth);var c=Math.max(this.startHeight+h,this.myConf.minHeight);var b=this.getEl();b.style.width=f+"px";b.style.height=c+"px";this.myConf.container.redrawAllWires();this.eventResize.fire([f,c])}});(function(){var b=YAHOO.util;var c=b.Dom,a=b.Event,d="WireIt-";WireIt.Container=function(e,f){this.setOptions(e);this.layer=f;this.terminals=[];this.wires=[];this.el=null;this.bodyEl=null;this.eventAddWire=new b.CustomEvent("eventAddWire");this.eventRemoveWire=new b.CustomEvent("eventRemoveWire");this.eventFocus=new b.CustomEvent("eventFocus");this.eventBlur=new b.CustomEvent("eventBlur");this.render();if(e.terminals){this.initTerminals(e.terminals)}if(this.resizable){this.makeResizable()}if(this.draggable){this.makeDraggable()}};WireIt.Container.prototype={xtype:"WireIt.Container",draggable:true,position:[100,100],className:d+"Container",ddHandle:true,ddHandleClassName:d+"Container-ddhandle",resizable:true,resizeHandleClassName:d+"Container-resizehandle",close:true,closeButtonClassName:d+"Container-closebutton",groupable:true,preventSelfWiring:true,title:null,icon:null,width:null,height:null,setOptions:function(f){for(var e in f){if(f.hasOwnProperty(e)){this[e]=f[e]}}},makeResizable:function(){this.ddResize=new WireIt.util.DDResize(this);this.ddResize.eventResize.subscribe(this.onResize,this,true)},setXYContraints:function(){if(this.layer){var e=c.getXY(this.layer.el);var f=c.getXY(this.el);this.dd.setXConstraint(f[0]-e[0]);this.dd.setYConstraint(f[1]-e[1])}},makeDraggable:function(){this.dd=new WireIt.util.DD(this.terminals,this.el);YAHOO.util.Event.on(window,"resize",this.setXYContraints,this,true);this.setXYContraints();this.dd.setXConstraint(this.position[0]);this.dd.setYConstraint(this.position[1]);if(this.ddHandle){this.dd.setHandleElId(this.ddHandle)}if(this.resizable){this.dd.addInvalidHandleId(this.ddResizeHandle);this.ddResize.addInvalidHandleId(this.ddHandle)}},onResize:function(g,e){var f=e[0];WireIt.sn(this.bodyEl,null,{width:(f[0]-14)+"px",height:(f[1]-(this.ddHandle?44:14))+"px"})},render:function(){this.el=WireIt.cn("div",{className:this.className});if(this.width){this.el.style.width=this.width+"px"}if(this.height){this.el.style.height=this.height+"px"}a.addListener(this.el,"mousedown",this.onMouseDown,this,true);if(this.ddHandle){this.ddHandle=WireIt.cn("div",{className:this.ddHandleClassName});this.el.appendChild(this.ddHandle);if(this.icon){var e=WireIt.cn("img",{src:this.icon,className:"WireIt-Container-icon"});this.ddHandle.appendChild(e)}if(this.title){this.ddHandle.appendChild(WireIt.cn("span",{className:"floatleft"},null,this.title))}}this.bodyEl=WireIt.cn("div",{className:"body"});this.el.appendChild(this.bodyEl);if(this.resizable){this.ddResizeHandle=WireIt.cn("div",{className:this.resizeHandleClassName});this.el.appendChild(this.ddResizeHandle)}if(this.close){this.closeButton=WireIt.cn("div",{className:this.closeButtonClassName});if(this.ddHandle){this.ddHandle.appendChild(this.closeButton)}else{this.el.appendChild(this.closeButton)}a.addListener(this.closeButton,"click",this.onCloseButton,this,true)}if(this.groupable&&this.ddHandle){this.groupButton=WireIt.cn("div",{className:"WireIt-Container-groupbutton"});this.ddHandle.appendChild(this.groupButton);a.addListener(this.groupButton,"click",this.onGroupButton,this,true)}this.layer.el.appendChild(this.el);this.el.style.left=this.position[0]+"px";this.el.style.top=this.position[1]+"px"},setBody:function(e){if(typeof e=="string"){this.bodyEl.innerHTML=e}else{this.bodyEl.innerHTML="";this.bodyEl.appendChild(e)}},onMouseDown:function(e){if(this.layer){if(this.layer.focusedContainer&&this.layer.focusedContainer!=this){this.layer.focusedContainer.removeFocus()}this.setFocus();this.layer.focusedContainer=this}},setFocus:function(){c.addClass(this.el,d+"Container-focused");this.eventFocus.fire(this)},removeFocus:function(){c.removeClass(this.el,d+"Container-focused");this.eventBlur.fire(this)},onCloseButton:function(g,f){a.stopEvent(g);this.layer.removeContainer(this)},highlight:function(){this.el.style.border="2px solid blue"},dehighlight:function(){this.el.style.border=""},superHighlight:function(){this.el.style.border="4px outset blue"},remove:function(){this.removeAllTerminals();this.layer.el.removeChild(this.el);a.purgeElement(this.el)},initTerminals:function(f){for(var e=0;e<f.length;e++){this.addTerminal(f[e])}},addTerminal:function(g){var e=WireIt.terminalClassFromXtype(g.xtype);var f=new e(this.el,g,this);this.terminals.push(f);f.eventAddWire.subscribe(this.onAddWire,this,true);f.eventRemoveWire.subscribe(this.onRemoveWire,this,true);return f},onAddWire:function(f,e){var g=e[0];if(WireIt.indexOf(g,this.wires)==-1){this.wires.push(g);this.eventAddWire.fire(g)}},onRemoveWire:function(g,f){var h=f[0];var e=WireIt.indexOf(h,this.wires);if(e!=-1){this.eventRemoveWire.fire(h);this.wires[e]=null}this.wires=WireIt.compact(this.wires)},removeAllTerminals:function(){for(var e=0;e<this.terminals.length;e++){this.terminals[e].remove()}this.terminals=[]},redrawAllWires:function(){for(var e=0;e<this.terminals.length;e++){this.terminals[e].redrawAllWires()}},getXY:function(){var f=c.getXY(this.el);if(this.layer){var e=c.getXY(this.layer.el);f[0]-=e[0];f[1]-=e[1];f[0]+=this.layer.el.scrollLeft;f[1]+=this.layer.el.scrollTop}return f},getConfig:function(){return{position:this.getXY(),xtype:this.xtype}},getValue:function(){return{}},setValue:function(e){},getTerminal:function(e){var g;for(var f=0;f<this.terminals.length;f++){g=this.terminals[f];if(g.name==e){return g}}return null}}})();WireIt.Layer=function(b){this.setOptions(b);this.containers=[];this.wires=[];this.groups=[];this.el=null;this.eventChanged=new YAHOO.util.CustomEvent("eventChanged");this.eventAddWire=new YAHOO.util.CustomEvent("eventAddWire");this.eventRemoveWire=new YAHOO.util.CustomEvent("eventRemoveWire");this.eventAddContainer=new YAHOO.util.CustomEvent("eventAddContainer");this.eventRemoveContainer=new YAHOO.util.CustomEvent("eventRemoveContainer");this.eventContainerDragged=new YAHOO.util.CustomEvent("eventContainerDragged");this.eventContainerResized=new YAHOO.util.CustomEvent("eventContainerResized");this.render();if(b.containers){this.initContainers(b.containers)}if(b.wires){this.initWires(b.wires)}if(this.layerMap){this.layermap=new WireIt.LayerMap(this,this.layerMapOptions)}if(WireIt.Grouper){this.grouper=new WireIt.Grouper(this,this.grouper.baseConfigFunction);var c=this.grouper.rubberband;this.el.onmousedown=function(d){return c.layerMouseDown.call(c,d)};var a=this.grouper;this.el.addEventListener("mouseup",function(d){c.finish();a.rubberbandSelect.call(a)},false)}};WireIt.Layer.prototype={className:"WireIt-Layer",parentEl:null,layerMap:false,layerMapOptions:null,enableMouseEvents:true,grouper:null,setOptions:function(b){for(var a in b){if(b.hasOwnProperty(a)){this[a]=b[a]}}if(!this.parentEl){this.parentEl=document.body}},render:function(){this.el=WireIt.cn("div",{className:this.className});this.parentEl.appendChild(this.el)},initContainers:function(b){for(var a=0;a<b.length;a++){this.addContainer(b[a])}},initWires:function(b){for(var a=0;a<b.length;a++){this.addWire(b[a])}},setSuperHighlighted:function(b){this.unsetSuperHighlighted();for(var a in b){if(b.hasOwnProperty(a)){b[a].superHighlight()}}this.superHighlighted=b},unsetSuperHighlighted:function(){if(YAHOO.lang.isValue(this.superHighlighted)){for(var a in this.superHighlighted){if(this.superHighlighted.hasOwnProperty(a)){this.superHighlighted[a].highlight()}}}this.superHighlighted=null},addWire:function(b){var a=WireIt.wireClassFromXtype(b.xtype);var e=b.src;var g=b.tgt;var f=this.containers[e.moduleId].getTerminal(e.terminal);var d=this.containers[g.moduleId].getTerminal(g.terminal);var c=new a(f,d,this.el,b);c.redraw();return c},addContainer:function(c){var a=WireIt.containerClassFromXtype(c.xtype);var b=new a(c,this);return this.addContainerDirect(b)},addContainerDirect:function(a){this.containers.push(a);a.eventAddWire.subscribe(this.onAddWire,this,true);a.eventRemoveWire.subscribe(this.onRemoveWire,this,true);if(a.ddResize){a.ddResize.on("endDragEvent",function(){this.eventContainerResized.fire(a);this.eventChanged.fire(this)},this,true)}if(a.dd){a.dd.on("endDragEvent",function(){this.eventContainerDragged.fire(a);this.eventChanged.fire(this)},this,true)}this.eventAddContainer.fire(a);this.eventChanged.fire(this);return a},removeContainer:function(a){var b=WireIt.indexOf(a,this.containers);if(b!=-1){a.remove();this.containers[b]=null;this.containers=WireIt.compact(this.containers);this.eventRemoveContainer.fire(a);this.eventChanged.fire(this)}},removeGroup:function(f,c){var a=this.groups.indexOf(f),b;if(a!=-1){this.groups.splice(a,1)}if(c){if(YAHOO.lang.isValue(f.groupContainer)){this.removeContainer(f.groupContainer)}else{for(b in f.containers){if(f.containers.hasOwnProperty(b)){var e=f.containers[b].container;this.removeContainer(e)}}for(b in f.groups){if(f.containers.hasOwnProperty(b)){var d=f.groups[b].group;this.removeGroup(d)}}}}},onAddWire:function(b,a){var c=a[0];if(WireIt.indexOf(c,this.wires)==-1){this.wires.push(c);if(this.enableMouseEvents){YAHOO.util.Event.addListener(c.element,"mousemove",this.onWireMouseMove,this,true);YAHOO.util.Event.addListener(c.element,"click",this.onWireClick,this,true)}this.eventAddWire.fire(c);this.eventChanged.fire(this)}},onRemoveWire:function(c,b){var d=b[0];var a=WireIt.indexOf(d,this.wires);if(a!=-1){this.wires[a]=null;this.wires=WireIt.compact(this.wires);this.eventRemoveWire.fire(d);this.eventChanged.fire(this)}},clear:function(){while(this.containers.length>0){this.removeContainer(this.containers[0])}},removeAllContainers:function(){this.clear()},getWiring:function(){var b;var c={containers:[],wires:[]};for(b=0;b<this.containers.length;b++){c.containers.push(this.containers[b].getConfig())}for(b=0;b<this.wires.length;b++){var d=this.wires[b];var a=d.getConfig();a.src={moduleId:WireIt.indexOf(d.terminal1.container,this.containers),terminal:d.terminal1.name};a.tgt={moduleId:WireIt.indexOf(d.terminal2.container,this.containers),terminal:d.terminal2.name};c.wires.push(a)}return c},setWiring:function(b){this.clear();var a;if(YAHOO.lang.isArray(b.containers)){for(a=0;a<b.containers.length;a++){this.addContainer(b.containers[a])}}if(YAHOO.lang.isArray(b.wires)){for(a=0;a<b.wires.length;a++){this.addWire(b.wires[a])}}},_getMouseEvtPos:function(b){var c=YAHOO.util.Event.getTarget(b);var a=[c.offsetLeft,c.offsetTop];return[a[0]+b.layerX,a[1]+b.layerY]},onWireClick:function(l){var d=this._getMouseEvtPos(l);var j=d[0],g=d[1],h=this.wires.length,m;for(var k=0;k<h;k++){m=this.wires[k];var f=m.element.offsetLeft,c=m.element.offsetTop;if(j>=f&&j<f+m.element.width&&g>=c&&g<c+m.element.height){var b=j-f,a=g-c;m.onClick(b,a)}}},onWireMouseMove:function(l){var d=this._getMouseEvtPos(l);var j=d[0],g=d[1],h=this.wires.length,m;for(var k=0;k<h;k++){m=this.wires[k];var f=m.element.offsetLeft,c=m.element.offsetTop;if(j>=f&&j<f+m.element.width&&g>=c&&g<c+m.element.height){var b=j-f,a=g-c;m.onMouseMove(b,a)}}}};(function(){var b=YAHOO.util.Dom,a=YAHOO.util.Event;WireIt.LayerMap=function(d,c){this.layer=d;this.setOptions(c);if(typeof c.parentEl=="string"){this.parentEl=YAHOO.util.Dom.get(c.parentEl)}else{if(this.layer&&!this.parentEl){this.parentEl=this.layer.el}}WireIt.LayerMap.superclass.constructor.call(this,this.parentEl);this.element.className=this.className;this.initEvents();this.draw()};YAHOO.lang.extend(WireIt.LayerMap,WireIt.CanvasElement,{className:"WireIt-LayerMap",style:"rgba(0, 0, 200, 0.5)",parentEl:null,lineWidth:2,setOptions:function(d){for(var c in d){if(d.hasOwnProperty(c)){this[c]=d[c]}}},initEvents:function(){var c=this.layer;a.addListener(this.element,"mousedown",this.onMouseDown,this,true);a.addListener(this.element,"mouseup",this.onMouseUp,this,true);a.addListener(this.element,"mousemove",this.onMouseMove,this,true);a.addListener(this.element,"mouseout",this.onMouseUp,this,true);c.eventAddWire.subscribe(this.draw,this,true);c.eventRemoveWire.subscribe(this.draw,this,true);c.eventAddContainer.subscribe(this.draw,this,true);c.eventRemoveContainer.subscribe(this.draw,this,true);c.eventContainerDragged.subscribe(this.draw,this,true);c.eventContainerResized.subscribe(this.draw,this,true);a.addListener(this.layer.el,"scroll",this.onLayerScroll,this,true)},onMouseMove:function(d,c){a.stopEvent(d);if(this.isMouseDown){this.scrollLayer(d.clientX,d.clientY)}},onMouseUp:function(d,c){a.stopEvent(d);this.isMouseDown=false},onMouseDown:function(d,c){a.stopEvent(d);this.scrollLayer(d.clientX,d.clientY);this.isMouseDown=true},scrollLayer:function(e,d){var p=b.getXY(this.element);var r=[e-p[0],d-p[1]];var h=b.getRegion(this.element);var g=h.right-h.left-4;var k=h.bottom-h.top-4;var f=this.layer.el.scrollWidth;var n=this.layer.el.scrollHeight;var i=Math.floor(100*g/f)/100;var o=Math.floor(100*k/n)/100;var c=[r[0]/i,r[1]/o];var q=b.getRegion(this.layer.el);var m=q.right-q.left;var j=q.bottom-q.top;var l=[Math.max(Math.floor(c[0]-m/2),0),Math.max(Math.floor(c[1]-j/2),0)];if(l[0]+m>f){l[0]=f-m}if(l[1]+j>n){l[1]=n-j}this.layer.el.scrollLeft=l[0];this.layer.el.scrollTop=l[1]},onLayerScroll:function(){if(this.scrollTimer){window.clearTimeout(this.scrollTimer)}var c=this;this.scrollTimer=window.setTimeout(function(){c.draw()},50)},draw:function(){var n=this.getContext();var e=b.getRegion(this.element);var d=e.right-e.left-4;var j=e.bottom-e.top-4;n.clearRect(0,0,d,j);var c=this.layer.el.scrollWidth;var l=this.layer.el.scrollHeight;var f=Math.floor(100*d/c)/100;var m=Math.floor(100*j/l)/100;var o=b.getRegion(this.layer.el);var k=o.right-o.left;var i=o.bottom-o.top;var h=this.layer.el.scrollLeft;var g=this.layer.el.scrollTop;n.strokeStyle="rgb(200, 50, 50)";n.lineWidth=1;n.strokeRect(h*f,g*m,k*f,i*m);n.fillStyle=this.style;n.strokeStyle=this.style;n.lineWidth=this.lineWidth;this.drawContainers(n,f,m);this.drawWires(n,f,m)},drawContainers:function(c,j,f){var h=this.layer.containers;var k=h.length,e,d=WireIt.getIntStyle,g;for(e=0;e<k;e++){g=h[e].el;c.fillRect(d(g,"left")*j,d(g,"top")*f,d(g,"width")*j,d(g,"height")*f)}},drawWires:function(g,d,f){var l=this.layer.wires;var c=l.length,e,j;for(e=0;e<c;e++){j=l[e];var k=j.terminal1.getXY(),h=j.terminal2.getXY();g.beginPath();g.moveTo(k[0]*d,k[1]*f);g.lineTo(h[0]*d,h[1]*f);g.closePath();g.stroke()}}})})();WireIt.ImageContainer=function(a,b){WireIt.ImageContainer.superclass.constructor.call(this,a,b)};YAHOO.lang.extend(WireIt.ImageContainer,WireIt.Container,{xtype:"WireIt.ImageContainer",resizable:false,ddHandle:false,className:"WireIt-Container WireIt-ImageContainer",image:null,render:function(){WireIt.ImageContainer.superclass.render.call(this);YAHOO.util.Dom.setStyle(this.bodyEl,"background-image","url("+this.image+")")}});WireIt.InOutContainer=function(a,b){WireIt.InOutContainer.superclass.constructor.call(this,a,b)};YAHOO.lang.extend(WireIt.InOutContainer,WireIt.Container,{xtype:"WireIt.InOutContainer",resizable:false,className:"WireIt-Container WireIt-InOutContainer",inputs:[],outputs:[],render:function(){WireIt.InOutContainer.superclass.render.call(this);for(var c=0;c<this.inputs.length;c++){var b=this.inputs[c];this.addTerminal({name:b,direction:[-1,0],offsetPosition:{left:-14,top:3+30*(c+1)},ddConfig:{type:"input",allowedTypes:["output"]}});this.bodyEl.appendChild(WireIt.cn("div",null,{lineHeight:"30px"},b))}for(c=0;c<this.outputs.length;c++){var a=this.outputs[c];this.addTerminal({name:a,direction:[1,0],offsetPosition:{right:-14,top:3+30*(c+1+this.inputs.length)},ddConfig:{type:"output",allowedTypes:["input"]},alwaysSrc:true});this.bodyEl.appendChild(WireIt.cn("div",null,{lineHeight:"30px",textAlign:"right"},a))}}});