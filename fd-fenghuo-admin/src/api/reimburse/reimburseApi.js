import APIFunction from '../APIFunction';

const api = {
    // 获取指定报销记录.
    getReimburse: 'POST /p/reimburse/getReimburseByCode',
    // 取消关联.
    cancelConnectInvoice: 'POST /p/reimburse/cancelConnectInvoice',
    // 新增报销记录.
    insertReimburse: 'POST /p/reimburse/insertReimburse',
}

const API = APIFunction(api);

export default API;
