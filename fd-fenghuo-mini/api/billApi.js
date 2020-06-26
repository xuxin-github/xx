const APIFunction = require('./APIFunction.js');
const api = {
  // 发票列表
  invoiceList: 'POST /c/invoice/list',
  // 发票详情(已关联)
  invoiceDetail: 'POST /c/invoice/getInvoiceByNo',
  // 发票详情(未关联关联)
  invoiceFirstDetail: 'POST /c/invoice/getFirstInvoiceByNo',
  // 新增发票
  addInvoice: 'POST /c/invoice/insertInvoice',
  // 查询此发票数据库是否存在
  findOneInvoiceList: 'POST /c/invoice/findOneInvoice',
  // 查询可关联的合同
  findAllContractList: 'POST /c/invoice/findAllContractList',
  // 关联已有合同
  insertConnectContract: 'POST /c/invoice/insertConnectContract',


}
const API = APIFunction(api);

module.exports = API;