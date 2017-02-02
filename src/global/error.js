import errorCode from './error_code';

export default (code) => {
    console.log(`%c [Native Warn]: ${errorCode[code]}`, 'color:#f00;background:#fee;padding:0 10px;');
    return;
}