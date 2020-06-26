import APIFunction from '../APIFunction';

const api = {
    // 查询.
    queryProjectList: 'POST /p/project/projectList',
    // 获取指定项目名的数据.
    getProject: '/p/project/getProjectByName',
    // 新增项目.
    addProject: 'POST /p/project/insertProject',
    // 修改审核状态.
    updateStatus: 'POST /p/project/updateStatus',
    // 修改项目基本信息.
    updateBasicProject: 'POST /p/project/updateBasicProject',
    // 取消关联.
    updateRelevance: 'POST /p/project/updateProject',
    // 添加合同.
    addProjectContract: "POST /p/project/insertProjectContract",
    // 修改发票审核状态.
    updateInvoiceStatus: 'POST /p/project/updateInvoiceStatus',
    // 删除发票(取消关联).
    cancelConnectInvoice: 'POST /p/project/cancelConnectInvoice',
    // 修改报销记录和发票的审核状态.
    updateReimburseInvoiceStatus: 'POST /p/project/updateReimburseInvoiceStatus',
    // 删除报销记录(与项目取消关联).
    cancelConnectReimburseInvoice: 'POST /p/project/cancelConnectReimburseInvoice',
}

const API = APIFunction(api);

export default API;
