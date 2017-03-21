import common from '../common.js';
export default {
    items:{},
    identReg:/className|id|href|target|src|placeholder|value|width|height/,
    push(vm) {
        let hashStr = common.hashString.split('?');
        this.items[hashStr[0]] = vm;

        return this.parser(common.components[hashStr[0]], vm);
    },
    parser(component={}, vm, idIndex = 0) {

        //console.log(component)
        //定义变量
        let node,
            that = this;

        //文本节点直接返回
        if(vm.type === 'VirtualText') {
             if(vm.text != 'undefined') {
                 return document.createTextNode(vm.text);
             }else {
                 return document.createTextNode('');
             }
        }
        //node节点
       // console.log(vm)
        node = document.createElement(vm.tagName.toLowerCase());

        //遍历properties
        for(let proper in vm.properties) {
            //如果是  identReg  所存在的 标记 则 赋值
            if(that.identReg.test(proper)) {
                if(proper && (proper == 'width'|| proper == 'height')) {
                    node['style'][proper] = vm.properties[proper];
                }else {
                    node[proper] = vm.properties[proper];
                }
            }

            //如果是 href  则 加上 时间戳
            // if(/href/.test(proper)) {
            //     let hashQuery = vm.properties[proper].split('?');
            //     node[proper] = `${hashQuery[0]}_${new Date().getTime()}?${hashQuery[1]}`;
            // }

            //如果是 style 则 遍历 这个对象并 赋值
            if(/style/.test(proper) && vm.properties[proper]) {
               
                for(let val in vm.properties[proper]) {

                    let val2 = val.replace(/\-(\w)/, ($0, $1) => {
                        return $1.toUpperCase();
                    })
                    // if(val2== 'fontFamily') {
                    //     console.log(val2)
                    //     console.log(vm.properties[proper][val])
                    // }
                    node.style[val2] = vm.properties[proper][val];
                }
            }

            //如果是 dataset 则 遍历 这个对象并 赋值
            if(/dataset/.test(proper) && vm.properties[proper]) {
               
                for(let val in vm.properties[proper]) {
           
                    node.dataset[val] = vm.properties[proper][val];
                }
            }

            //生成native-id
            node.dataset['native_id'] = idIndex;

            //如果是 n: 开头 表示 指令, 则 绑定事件(这里初版只做事件, if each show 等指令 以后处理)
            if(/n\:.+/.test(proper)) {

                if(component[vm.properties[proper]]) {
                    node.addEventListener(proper.replace(/n\:/, ''), component[vm.properties[proper]].bind(component), false);
                }
            };
        }
        //如果 有 子节点 存在 则 递归 当前方法 parser
        if(vm.children && vm.children.length > 0) {
            vm.children.forEach((item, i, arr)=>{

                node.appendChild(that.parser(component, item, `${idIndex}.${i}`));
            });

        }

        return node;
    },

    diff(component, vm, arr, oldVm =this.items[component.name], idIndex = 0, parentId) {
        //定义变量
        let that = this;

        //文本节点直接返回
        if(vm.type === 'VirtualText') {

            if(oldVm.type !== 'VirtualText') {

                // let text = '';
                // if(vm.text != 'undefined') {
                //     text = vm.text;
                // }
                arr.push({
                    id:parentId,
                    type:'innerHTML',
                    value:vm.tex
                });

            }else {

                if(vm.text !== oldVm.text) {
                    arr.push({
                        id:parentId,
                        type:'innerHTML',
                        value:vm.text
                    });
                }
            }
            return;
        }


        //node节点
        if(oldVm.type !== 'VirtualNode') {
            
            arr.push({
                id:parentId,
                type:'appendChild',
                value:that.parser(component, vm, idIndex)
            });

            return;
        }

        //遍历properties

        let obj = {
            id:idIndex,
            type:'proper',
            value:[]
        };
        for(let proper in vm.properties) {

            //如果是  identReg  所存在的 标记 则 赋值
            if(that.identReg.test(proper)) {
                if(!oldVm.properties[proper]) {
                     obj.value.push({
                        type:proper,
                        name:'',
                        value:vm.properties[proper]
                    });
                    continue;
                }

                if(vm.properties[proper] !== oldVm.properties[proper]) {
                    obj.value.push({
                        type:proper,
                        name:'',
                        value:vm.properties[proper]
                    });
                }
                
            }

            //如果是 href  则 加上 时间戳
            // if(/href/.test(proper)) {
            //     let hashQuery = vm.properties[proper].split('?');
            //     obj.value.push({
            //         type:proper,
            //         name:'',
            //         value:`${hashQuery[0]}_${new Date().getTime()}?${hashQuery[1]}`
            //     })
            // }

            //如果是 style 则 遍历 这个对象并 赋值
            if(/style/.test(proper) && vm.properties[proper]) {
  
                for(let val in vm.properties[proper]) {

                    let val2 = val.replace(/\-(\w)/, ($0, $1) => {
                            return $1.toUpperCase();
                        })
                    
                    if(!oldVm.properties[proper]) {
                        obj.value.push({
                            type:proper,
                            name:val,
                            value:vm.properties[proper][val]
                        });
                        continue;
                    }
                    if(vm.properties[proper][val2] !== oldVm.properties[proper][val2]) {
                        obj.value.push({
                            type:proper,
                            name:val,
                            value:vm.properties[proper][val]
                        });
                    }
                }
            }

            //如果是 dataset 则 遍历 这个对象并 赋值
            if(/dataset/.test(proper) && vm.properties[proper]) {
               
                for(let val in vm.properties[proper]) {
                    
                    if(!oldVm.properties[proper] || !oldVm.properties[proper][val]) {
                        obj.value.push({
                            type:proper,
                            name:val,
                            value:vm.properties[proper][val]
                        });
                        continue;
                    }

                    if(vm.properties[proper][val] !== oldVm.properties[proper][val]) {
                        obj.value.push({
                            type:proper,
                            name:val,
                            value:vm.properties[proper][val]
                        });
                    }
                }
            }

            //如果是 n: 开头 表示 指令, 则 绑定事件(这里初版只做事件, if each show 等指令 以后处理)
            if(/n\:.+/.test(proper)) {

                if(!oldVm.properties[proper]) {
                    obj.value.push({
                        type:'event',
                        name:proper.replace(/n\:/, ''),
                        value:component[vm.properties[proper]].bind(component),
                        old:component[oldVm.properties[proper]]
                    });
                    continue;
                }

                if(vm.properties[proper] !==  oldVm.properties[proper]) {

                    if(component[vm.properties[proper]]) {
                        obj.value.push({
                            type:'event',
                            name:proper.replace(/n\:/, ''),
                            value:component[vm.properties[proper]].bind(component),
                            old:component[oldVm.properties[proper]]
                        });
                    }else {
                       // error
                    }
                }

            };
        }

        if(obj.value.length > 0) {
            arr.push(obj);
        }
        
        //如果 有 子节点 存在 则 递归 当前方法 parse

        if(vm.children && vm.children.length == 0 && oldVm.children.length > 0) {
            arr.push({
                id:idIndex,
                type:'innerHTML',
                value:''   
            });
            return;
        }

        if(vm.children && vm.children.length > 0) {

            vm.children.forEach((item, i, array)=>{

                that.diff(component, item, arr, oldVm.children[i] ? oldVm.children[i] : [], `${idIndex}.${i}`, idIndex)
            });

        }

    } 
}