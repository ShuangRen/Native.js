/**
 * 函数库 提供多种常用函数
 * 2016-10-31 by yinhuang
 */
export default {
    name:'func',

    //合并对象
    use(obj1, obj2) {
       return Object.assign(obj1, obj2);
    },

    // 判断是否是函数 return bool
    isFunction(str) {
        return typeof str === 'function';
    },

    //判断是否是object
    isObject(str) {
        return typeof str === 'object';
    },

    //判断是否是数组
    isArray(str) {
        return  str instanceof Array;
    },

    //判断是否是字符串
    isString(str) {
        return  typeof str === 'string';
    },

    //判断是否是JSON
    isJson(str) {
        let info = false;
        try {
            //在此运行代码
            JSON.parse(JSON.stringify(str));
            info = true;
        } catch(err) {
            info = false;
        }

        return info;
    },

    //判断是否为空
    isEmpty(str) {
        if(this.isArray(str)) return str.length == 0;
        if(this.isJson(str)) return Object.keys(str).length == 0;
        if(this.isString(str)) return str == '';
        if(this.isFunction(str) || this.isObject(str)) return false;
    },

    //判断是否在微信环境中
    isWeixin(str) {
        return window.navigator.userAgent.search(/MicroMessenger/i) !== -1;
    },
     //判断是否在是IOS环境
    isIos(str) {
        return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    },
    isIdCard(num) {
        if (!num) return false;
        num = num.toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (!((/(^\d{15}$)|(^\d{17}([0-9]|X)$)/).test(num))) {
                //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
                return false;
        }
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        //下面分别分析出生日期和校验位
        var len, re;
        len = num.length;
        if (len == 15) {
                re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                var arrSplit = num.match(re);

                //检查生日日期是否正确
                var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                var bGoodDay;
                bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                        //alert('输入的身份证号里出生日期不对！');
                        return false;
                }
                else {
                        //将15位身份证转成18位
                        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                        var nTemp = 0, i;
                        num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                        for (i = 0; i < 17; i++) {
                                nTemp += num.substr(i, 1) * arrInt[i];
                        }
                        num += arrCh[nTemp % 11];
                        return true;
                }
        }
        if (len == 18) {
                re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                var arrSplit = num.match(re);

                //检查生日日期是否正确
                var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                var bGoodDay;
                bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                        //alert(dtmBirth.getYear());
                        //alert(arrSplit[2]);
                        //alert('输入的身份证号里出生日期不对！');
                        return false;
                }
                else {
                        //检验18位身份证的校验码是否正确。
                        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                        var valnum;
                        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                        var nTemp = 0, i;
                        for (i = 0; i < 17; i++) {
                                nTemp += num.substr(i, 1) * arrInt[i];
                        }
                        valnum = arrCh[nTemp % 11];
                        if (valnum != num.substr(17, 1)) {
                                //alert('18位身份证的校验码不正确！应该为：' + valnum);
                                return false;
                        }
                        return true;
                }
        }
        return false;
    },
    //是否是中文
    isChinese: function (temp) {
        var re = /[\u4e00-\u9fa5]/;
        return re.test(temp)
    },
    //获取请求参数值
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    },
    getQueryArr(name) { //获取请求参数值
        let group = name && name.split('&') || [];

        let json = {};

        group.forEach((v,i,a)=>{
            let queryStr = v.split('=');
            json[queryStr[0]] = queryStr[1];
        });
        return json;
    }
}