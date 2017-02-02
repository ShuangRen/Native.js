import virtual from 'virtual-html';
import virtualDom from './virtualDom.js';
import observer from '../observer.js';
import common from '../common.js';

export default {
    init(hashStr, callback) {
    
        let path = hashStr.split('?')[1];

        let hash = hashStr.split('?')[0];

        //let componentid = hashStr.split('?')[0];

        let comp = common.components[hash];

        let self = this;

        //找不到hash 对应 组件
        if(!comp) {

            //找不到对应hash 的  路由 配置
            if(!common.routerConfig[hash]) {
                common.error(10002);
                return;
            }

            common.routerConfig[hash]((res)=>{
                common.components[hash] = res.default;

                common.components[hash].router = common.api.router;

                //common.components[hash].componentid = componentid;

                //执行生命周期函数
                common.components[hash]['onCreated'] && common.components[hash]['onCreated'](common.func.getQueryArr(path));

                //坚挺data
                observer.init(hash, () => {
                    self.notify();
                });

                //获取虚拟dom
                let vm = virtual(`<div class="native-container-wrap" data-component="${hash}">${common.components[hash].render()(common.components[hash].data)}</div>`);
      
                //渲染虚拟dom
                common.appBox.appendChild(virtualDom.push(vm));

                //执行生命周期函数
                common.components[hash]['onReady'] && common.components[hash]['onReady']();

                //执行回调函数
                callback && callback();

                let dom =document.querySelector(`[data-component=${hash}]`);
                 

                setTimeout(()=>{
                    //let dom =document.querySelector(`[data-component=${hash}]`); 
                    dom.style.transform = 'translateX(0)';
                    dom.style.zIndex = common.pages.length;
                },60);

                setTimeout(()=>{

                    //执行生命周期函数
                    common.components[hash]['onShow'] && common.components[hash]['onShow']();
                }, 400);

            });

            return;
        }


        //执行生命周期函数
        common.components[hash]['onCreated'] && common.components[hash]['onCreated'](common.func.getQueryArr(path));
        //获取虚拟dom
        let vm = virtual(`<div class="native-container-wrap" data-component="${hash}">${common.components[hash].render()(common.components[hash].data)}</div>`);


        //渲染虚拟dom
        common.appBox.appendChild(virtualDom.push(vm));

        //执行生命周期函数
        common.components[hash]['onReady'] && common.components[hash]['onReady']();

        let dom =document.querySelector(`[data-component=${hash}]`);
        setTimeout(()=>{
            //let dom =document.querySelector(`[data-component=${hash}]`); 
            dom.style.transform = 'translateX(0)';
            dom.style.zIndex = common.pages.length;
        },60);

        setTimeout(()=>{

            //执行生命周期函数
            common.components[hash]['onShow'] && common.components[hash]['onShow']();
        }, 400);

        //执行回调函数
        callback && callback();

    },
    notify() {
        let hash = common.hashString.split('?')[0];
        //let componentid = common.hashString.split('?')[0];
        let component = common.components[hash];

        let vm = virtual(`<div class="native-container-wrap" data-component="${hash}">${component.render()(component.data)}</div>`),
            that = this;
        let arr = [];    

        virtualDom.diff(component, vm, arr);
       // console.log(arr)
        virtualDom.items[hash] = vm;
        that.updateDom(hash, component,arr);
    },
    updateDom(hash, component,arr) {
    
        let comp = document.querySelector(`[data-component="${hash}"]`);

        arr.forEach((items, index, arr)=>{

            let el = comp.querySelector('[data-native_id="' + items.id + '"]');

            if(items.type == 'appendChild') {
                //if(el) {
                    el.appendChild(items.value);
                //}

            }
            if(items.type == 'proper') {

                items.value.forEach((v,i,a)=>{
                    if(v.type == 'dataset' || v.type == 'style') {

                        el[v.type][v.name] = v.value;
                    }else if(v.type == 'event') {

                        el.addEventListener(v.name, v.value, false);
                        el.removeEventListener(v.name, v.old, false);
                    }else {
                         if(v.type && (v.type == 'width'|| v.type == 'height')) {
                             el['style'][v.type] = v.value;
                         }else {
                             el[v.type] = v.value;
                         }
                    }

                });
            }


            if(items.type == 'innerHTML') {
                el[items.type] = items.value;
            }
        });

        component.onUpdata && component.onUpdata();
    }
}