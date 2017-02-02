//yhcmsApp.rem().windowSize().slidebar().cateBar();
import tmp from './index.na';
import request from '../../utils/request';
import yhcms from '../../js/common.js';
export default {
    name:'articleList',
    data:{
        articleList:[],
        page:1
    },
    render(){
        return tmp;
    },
    onCreated(){
        let that = this;
        request.send('getlist', {
            type: 'article',
            fn: 'nocallback',
            page: that.data.page,
            count: 10
        }, function (res) {
            that.data.articleList = res.data
        });
    },
    getmore(){
        let that = this;

        that.data.page ++ ;

        request.send('getlist', {
            type: 'article',
            fn: 'nocallback',
            page: that.data.page,
            count: 10
        }, function (res) {
            if(res.count != 0) {
                that.data.articleList = that.data.productList.concat(res.data);
            }
        });
    },
    goback() {
        this.router.goback();
    }
}