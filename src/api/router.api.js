import common from '../common';
export default {
    goback(n = 1){
        window.location.replace(`${window.location.href.replace(/#.+/, '')}#${common.pages[common.pages.length - (n+1)]}`);
        //window.location.hash = common.pages[common.pages.length - 2];
    },
    go(hash){
        window.location.replace(`${window.location.href.replace(/#.+/, '')}#${hash}`);
    }
}