// 报销接口
const APIFunction = require('./APIFunction.js');
const api = {
// 获取普通用户/主管下的报销信息
selectAllList1:'POST /c/reimburse/selectAllList1',
// 获取所有的报销信息，即领导和财务权限
selectAllList2: 'POST /c/reimburse/selectAllList2',
// 获取报销详情
selectDetails:'POST /c/reimburse/selectDetails',
// 获取我要报销中的报销项目数据
  getExpendProject:'POST /c/reimburse/getExpendProject',
// 获取我要报销中的报销类别数据
  getExpendType: 'POST /c/reimburse/getExpendType',
// 提交审核报销
  addExpend:'post /c/reimburse/insertReimburse',

}
const API = APIFunction(api);

module.exports = API;