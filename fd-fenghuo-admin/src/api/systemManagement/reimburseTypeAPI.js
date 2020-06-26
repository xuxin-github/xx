import APIFunction from '../APIFunction';

const api={
    // 查询.
    queryreimburseType: 'POST /p/reimburseType/reimburseTypeList',
    // 新增.
    addreimburseType: 'POST /p/reimburseType/insertReimburseType',
    // 修改报销类别.
    update: 'POST /p/reimburseType/updateReimburseType',
    // 获取指定用户信息.
    get: 'POST /p/reimburseType/getReimburseTypeById',
    // 查询(不分页).
    reimburseList: 'POST /p/reimburseType/typeList',
   
}

const API = APIFunction(api);

export default API;