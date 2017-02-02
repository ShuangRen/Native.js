//yhcmsApp.rem().windowSize().slidebar().searchBtn();
import tmp from './index.na';
import request from '../../utils/request';
import yhcms from '../../js/common.js';
export default {
    name: 'index',
    data: {
        productList:[],
        articleList:[]
    },
    render() {
        return tmp
    },
    onCreated() {
        let that = this;

        request.send('getlist', {
            type: 'product',
            fn: 'nocallback',
            page: 1,
            count: 4
        }, function (res) {
            that.data.productList = res.data
        });

        request.send('getlist', {
            type: 'article',
            fn: 'nocallback',
            page: 1,
            count: 4
        }, function (res) {
            that.data.articleList = res.data
        });
    },
    onReady() {
        yhcms.slidebar().searchBtn();
    }
    
}