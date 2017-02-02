const tmp = require('./tmp.js');
module.exports = function(source) {

    return "Object.defineProperty(exports, '__esModule', {value: true});exports.default = function (data) {" + tmp.tmp(source) + '}';
};