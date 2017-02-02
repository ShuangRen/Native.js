import common from './common.js';

export default {

    init(hash, callback) {

        let data = common.components[hash].data;
        let that = this;

        for(let item in data) {

            if(data.hasOwnProperty(item)) {

                if(Object.prototype.toString.apply(data[item]) == '[object Object]') {

                    that.init(data[item]);
                    continue;
                };

                let value = data[item];

                Object.defineProperty(data, item, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                    
                        return value;
                    },
                    set: function (args) {
                        if( args === value) return;

                            value = args;
                            data[item] = args;

                            //触发订阅
                            callback && callback();
                            //render.notify(components);
                    }
                });

            }
            
        }
    }
}