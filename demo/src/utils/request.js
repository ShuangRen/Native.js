import http from './http.js';

export default {
    send(apiurl, data, Fn, errFn) {
        let that = this;
        let url;
        if(apiurl == 'getlist') {
            url = 'http://demo.yhcms.cn/index.php/Api/' + apiurl;
        }else {
            url = 'http://jvma.webzeal.cn/index.php/Api/' + apiurl;
        }

        http.ajax('GET', url, data).then((error, res)=>{
            if(error) {
                errFn&&errFn(error);
            }else {
                if(that.isJson(res)) {
                    Fn&&Fn(JSON.parse(res));
                }else {
                    Fn&&Fn(res);
                }
            }
        });
    },
    isJson : function(res){
        let info = true;
        try {
            //在此运行代码
            JSON.parse(res);
            info = true;
        } catch(err) {
            info = false;
        }

        return info;
    }
}