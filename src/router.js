import common from './common';
import render from './dom/render';

export default  {
    init() {
        //无路由配置
        if(common.func.isEmpty(common.routerConfig)) {
            common.error(10000);
            return;
        }

        //没有default 默认路由
        if(!common.routerConfig.default) {
            common.error(10001);
            return;
        }


        //注册 hash change 事件
        this.onHashChange();

        //如果当前又hash 存在
        if(window.location.hash) {
            //获取当前 hash 值
            common.hashString = window.location.hash.replace('#', '');

            common.pages.push(common.hashString.split('?')[0]);

            this.createPage();
            return;
        }

       // 页面没有hash 存在 则 replace 页面
        window.location.replace(`${window.location.href}#${common.routerConfig.default}`);
    },

    //hashchange 事件函数定义
    onHashChange() {
        let self = this;

        //注册winodw 的  hashchange 事件
        window.addEventListener('hashchange', ()=>{

            //获取当前 hash 值
            common.hashString = window.location.hash.replace('#', '');

            //之前开启过 所以表示 后退操作
            if(common.pages.indexOf(common.hashString.split('?')[0]) != -1) {
                self.goback(common.hashString.split('?')[0]);
                return;
            }

            self.createPage();

        }, false);
    },

    //创建页面相关
    createPage() {

        //如果默认路由不存在
        if(common.pages[0] != common.routerConfig.default) {

            //开启默认路由对应的pages
            common.hashString = common.routerConfig.default;
            common.pages = [];
            common.pages.push(common.hashString.split('?')[0]);
            render.init(common.routerConfig.default, () => {
                
                //首页开启完毕后，开启当前路由对应的页面
                common.hashString = window.location.hash.replace('#', '');
                common.pages.push(common.hashString.split('?')[0]);
                render.init(common.hashString);
            })

            return;
        }

        //hash是默认路由或者 默认路由存在 则直接开启
        if(common.hashString != common.routerConfig.default) {
            common.pages.push(common.hashString.split('?')[0]);
        }
       render.init(common.hashString);
    },

    goback(hash) {

        let index = common.pages.indexOf(hash);

        let wrap = document.querySelectorAll('.native-container-wrap');

        let number = common.pages.length - 1;

        let removeArr = []; //记录要被remove 的东西

        while(number > index) {
            wrap[number].style.transform = 'translateX(100%)';

            removeArr.push([number, common.pages[number].replace(/_.+/, '')]);
            number--;
            common.pages.pop();
        }

        setTimeout(()=>{
                removeArr.forEach((v,i,a)=>{
                    common.components[v[1]].onUnload && native.components[v[1]].onUnload();
                    wrap[v[0]].parentNode.removeChild(wrap[v[0]]);
                });
            },400);

        //let upDomHash = common.pages[index];

        common.components[hash.replace(/_.+/, '')].onReload && common.components[hash.replace(/_.+/, '')].onReload();
    }
    
}