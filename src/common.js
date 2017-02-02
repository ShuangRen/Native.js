//暴露给实例用的api
import api from './api/index.js';
import error from './global/error.js';
import func from './global/func.js';

export default {
    //app容器
    appBox:'',
    
    //组件存放
    components:{},

    //暴露api给native实例；
    api:api.init(),

    //当前 hash 字符串
    hashString:'',

    //已开启的page列表
    pages:[],

    //报错
    error,

    //函数库
    func,

    //存放业务路由配置
    routerConfig:{},

};