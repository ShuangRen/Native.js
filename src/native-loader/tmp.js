/*!
 * tmp.js v0.1.1
 * github https://github.com/basejs/tmp
 *
 * Copyright zhuqiang
 * Date: 2016/04/07
 */
;(function(exports) {
	var tmp = function(tmphtml,data) {
		//去掉注释 以及 /r/n
		tmphtml = tmphtml.replace(/<!--[\s\S]*?-->/g,'').replace(/\n/g, '').replace(/\r/g, '').replace(/\>\s+/g, '>').replace(/\s+\</g, '<');
		tmp.tmphtml = tmphtml;

		//console.log(tmphtml)

		// if(Object.prototype.toString.call(data) === '[object Object]'){
		// 	return tmp.render();
		// }

		return tmp.render();
		//return tmp;
	};

	tmp.render = function(){
		var newstr = 'var tmpstr ="<div class=\'native-container\'>"; (function(){';
		//newstr+='console.log(data.item);';
		// for(var name in data){
		// 	newstr += 'var '+ name +'=' + JSON.stringify(data[name])+';';
		// }
		newstr += tmp.tmphtml.match(/((?:{)?[^{}]+(?:})?)/g).map(function(item){
			//需要单独处理的选项
			switch(true){

				case /^{\$\$if[^{}]*}$/.test(item):
					return '}';

				case /^{\$\$each[^{}]*}$/.test(item):
					return '}})();';

				case /^{\$\^else\s*}$/.test(item):
					return '}else{';

				case /^{\$\^each[^{}]*}$/.test(item):
					//each做数组或对象循环，尽量不要用xps做索引

					//数组处理
					if(item.indexOf(' as ') != -1){
						return item.replace(/{\$\^each\s+([^}]+)\s+as\s+(\w+)(?:,\s*(\w+)\s*)?}/,function($1,$2,$3,$4){
							//console.log($1+'-----'+$2+'-----'+$3+'-----'+$4);
							return '(function(){var xps=0, '+ $4 +', '+ $3 +';for(; xps<'+ $2 +'.length; xps++){'+ $3 +'=' + $2 +'[xps];'+ $4 +'=xps;';
						});
					}
					//对象处理
					else if(item.indexOf(' in ') != -1){
						return item.replace(/{\$\^each\s+([^}]+)\s+in\s+(\w+)(?:,\s*(\w+)\s*)?}/,function($1,$2,$3,$4){
							//console.log($1+'-----'+$2+'-----'+$3+'-----'+$4);
							return '(function(){var xps, '+ $4 +', '+ $3 +';for(xps in ' + $2 +'){'+ $3 +'=' + $2 +'[xps];'+ $4 +'=xps;';
						});
					}
					else{
						return item;
					}
					break;
				case /^{\$\^if[^{}]*}$/.test(item):
					//if直接返回条件
					return item.replace(/{\$\^if\s*\(?([^{}()]+)\)?\s*}/,'if($1){');

				case /^{\$\^else\s+if/.test(item):
					//else if
					return item.replace(/{\$\^else\s+if\s*\(?([^{}()]+)\)?\s*}/,'}else if($1){');

				case /^{[^{}]+}$/.test(item):
					//变量返回当前作用域或全局作用域
					item = item.replace(/{\s*([^{}]+)\s*}/g,'$1');
					//第一个字符为=时当做html渲染
					if(item.search(/^=/) !== -1){
						return 'tmpstr+=('+unescape(item).slice(1)+');';
					}
					return 'tmpstr+=('+item+');';
				default:
					return 'tmpstr+="' + item.replace(/\n\s*/g,'\\n').replace(/\"/g,'\\"') + '";';
			}
		}).join('');
		newstr += '})();tmpstr +="\<\/div\>"; return tmpstr;';
		// console.log(newstr);
		//return new Function(newstr)();
		return newstr;
	};

	if (typeof define === 'function' && define.amd) { /* AMD support */
		define('tmp', [], function() {
			return tmp;
		});
	} else {
		exports.tmp = tmp;
	}
})(this);
