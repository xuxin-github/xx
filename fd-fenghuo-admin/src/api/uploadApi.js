import APIFunction from './APIFunction';
const api = {
    uploadFile: 'POST /common/file/upload',//文件上传
}
const API = APIFunction(api);

export default API;