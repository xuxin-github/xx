import APIFunction from '../APIFunction';

const api = {
    // 查询.
    querySystemList: 'POST /p/system/queryRiskControlSet',
    // 更新.
    updateSystem: 'POST /p/system/updateRiskControlSet',
}

const API = APIFunction(api);

export default API;
