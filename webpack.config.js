var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
	//项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
	entry: {
		"index" : [SRC_PATH+'/index.js'],
	},
	//输出的文件名 随机命名js文件
	output: {
		path: BUILD_PATH,
		filename: 'Native.js'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style!css!less'
			},{
				test: /\.js$/, //js 加载器
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015'] //转换 es6编码为 es5
				}
			}
		]
	}
};