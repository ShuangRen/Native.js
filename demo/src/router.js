export default {
    'index':(res)=>{
        require(['./pages/index/index.js'],res);
    },
    'productList':(res)=>{
        require(['./pages/productList/index.js'],res);
    },
    'productDetail':(res)=>{
        require(['./pages/productDetail/index.js'],res);
    },
    'articleList':(res)=>{
        require(['./pages/articleList/index.js'],res);
    },
    'articleDetail':(res)=>{
        require(['./pages/articleDetail/index.js'],res);
    },
    'default':'index'
}