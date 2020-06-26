import APIFunction from '../APIFunction';

const api = {
    // 查询
    queryContractTag: 'POST /p/contractTag/contractTagList',
    // 新增
    addContractTag: 'POST /p/contractTag/insertContractTag',
    // 修改合同
    update: 'POST /p/contractTag/updateContractTag',
    // 获取指定用户信息.
    get: 'POST /p/contractTag/getContractTagById',
    // 查询(不分页).
    contractTagList: 'POST /p/contractTag/tagList',
}

const API = APIFunction(api);

export default API;

