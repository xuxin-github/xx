const APIFunction = require('./APIFunction.js');
const api = {
  // 获取合同列表
  contractList: 'POST /c/contract/list',
  // 获取合同详情
  contractDetail:'POST /c/contract/getContractByName',
  // 获取合同下的发票信息
  contractInvoice:'POST /c/contract/contractInvoice',
}
const API = APIFunction(api);

module.exports = API;