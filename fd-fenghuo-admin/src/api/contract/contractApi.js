import APIFunction from '../APIFunction';

const api = {

    // 查询全部数据和搜索
    queryContractList: 'POST /p/contract/list',
    // 查看详情
    queryContractByCodeList: 'POST /p/contract/getContractByName',
    // 添加合同
    addContractList: 'POST /p/contract/addContract',
    // 编辑合同状态
    updateContractStatus: 'POST /p/contract/updateContractStauts',
    // 合同变更关联项目
    updateContractProject: 'POST /p/contract/updateContractProject',
    // 获取合同下的发票信息
    queryinvoiceList: 'POST /p/contract/contractInvoice',
    // 取消关联合同
    updateInvoiceChange:'POST /p/contract/updateInvoice',
    // 编辑合同内容
    updateContract:'POST /p/contract/updateContract',
    
    
}

const API = APIFunction(api);

export default API;