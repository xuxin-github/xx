import APIFunction from '../APIFunction';

const api = {
    // 供应商列表.
    querySupplierList: 'POST /p/provider/ProviderList',
    // 获取指定供应商信息.
    getSupplierByName: '/p/provider/getProvider',
    // 修改供应商状态.
    updateCompanyStatus: 'POST /p/provider/updateStatus',
    // 新增供应商.
    addSupplier: 'POST /p/provider/insertProvider',
}

const API = APIFunction(api);

export default API;
