//yhcmsApp.rem().windowSize().slidebar().tab();
import tmp from './index.na';
import request from '../../utils/request';
import yhcms from '../../js/common.js';
export default {
    name: 'productDetail',
    data:{
        id:'',
        item:''
    },
    render() {
        return tmp
    },
    onCreated(query) {
        let that = this;

        that.data.id = query.id;

        request.send('getcon', {
            type: 'product',
            fn: 'nocallback',
            id: that.data.id
        }, function (res) {
            that.data.item = res.data
        });
    },
    goback() {

       this.router.goback();
    }
}
