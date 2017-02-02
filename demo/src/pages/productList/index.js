//yhcmsApp.rem().windowSize().slidebar().cateBar();
import tmp from './index.na';
import request from '../../utils/request';
import yhcms from '../../js/common.js';
export default {
    name:'productList',
    data:{
        productList:[],
        page:1
    },
    render(){
        return tmp;
    },
    onCreated(){
        let that = this;
        request.send('getlist', {
            type: 'product',
            fn: 'nocallback',
            page: that.data.page,
            count: 10
        }, function (res) {
            that.data.productList = res.data
        });
    },
    getmore(){
        let that = this;

        that.data.page ++ ;

        request.send('getlist', {
            type: 'product',
            fn: 'nocallback',
            page: that.data.page,
            count: 10
        }, function (res) {
            if(res.count != 0) {
                that.data.productList = that.data.productList.concat(res.data);
            }
        });
    },
    goback() {
        this.router.goback();
    }
}