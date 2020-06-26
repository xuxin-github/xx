import APIFunction from '../APIFunction';
const api = {
    valiLogin: 'POST /login',
    // 获取用户所属公司名称。
    getUserCompanyName:'POST /p/report/getUserCompanyName',
}
const API = APIFunction(api);

export default API;