import APIFunction from '../APIFunction';

const api = {
    // 查询全部发票 
    queryBillList: 'POST /p/invoice/invoiceTotalList',
    // 查询发票详情
    queryBillDetails: 'POST /p/invoice/getInvoiceByNo',
    // 新增发票时查找.
    addInvoice: 'POST /p/invoice/insertInvoice',
    // 新增时关联合同的下拉选项.
    queryAddContract: 'POST /p/invoice/findAllContract',
    // 新增时关联合同.
    addConnectContract: 'POST /p/invoice/insertConnectContract',
    // 新增时创建合同关联.
    addCreateConnectContract: 'POST /p/invoice/insertCreateConnectContract',
    // 发票变更关联时下拉框的合同列表.
    findAllContractList:'POST /p/invoice/findAllContractList',
    // 发票变更关联.
    updateInvoiceContract:'POST /p/invoice/updateInvoiceContract',
    // 合同详情页面添加发票时直接关联该合同.
    updateInvoiceNowContract:'POST /p/invoice/insertConnectContract',
}

const API = APIFunction(api);

export default API;
