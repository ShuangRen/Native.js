import tmp from './index.na';
import request from '../../utils/request';
import yhcms from '../../js/common.js';
export default {
    name:'articleDetail',
    data:{
        id:'',
        item:''
    },
    render(){
        return tmp;
    },
    onCreated(query) {
        let that = this;

        that.data.id = query.id;

        request.send('getcon', {
            type: 'article',
            fn: 'nocallback',
            id: that.data.id
        }, function (res) {
            that.data.item = res.data
        });
    },
    goback() {
        this.router.goback();
        //window.history.go(-1);//需要一个系统的api 判断是否需要返回 等等 是否是第一页
    }
}