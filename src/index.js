import common from './common';
import router from './router';
require('./init.css');
class Native {

    constructor(){
        //this.router = common.api.router;
    }

    //应用运行
    run(config) {
        document.body.innerHTML = '<div class="native-init-box"></div>';
        common.routerConfig = config;
        router.init();
        common.appBox = document.querySelector('.native-init-box');
    }
}

export default Native;