const APIFunction = require('./APIFunction.js');
const api = {
  // 进项票据统计
  InvoiceCountAll1: 'POST /c/report/enterInvoiceCount',
  // 已处理或待处理票据
  InvoiceCountAll2: 'POST /c/report/invoiceHandleCount',
  // 根据用户名去获得用户的公司
  getUserCompanyName:'POST /c/report/getUserCompanyName',
  
  // 统计相应的发票数量
  getInvoice: 'POST /c/report/getInvoice',


}
const API = APIFunction(api);

module.exports = API;