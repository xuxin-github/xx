import APIFunction from '../APIFunction';

const api = {
    // 总体经营风险.
    totalRisk: 'POST /p/report/overallBusinessRisk',
    // 总体经营风险中的税务合规风险.
    totalTaxRisk: 'POST /p/report/shuiwuheguifengxiantongji',
    // 市场监管风险.
    marketRisk: 'POST /p/report/shichangjianguanRisk',
    // 风险发票金额统计.
    invoiceMoneyRisk: 'POST /p/report/fengxianfapiaotongji',
    // 内部风控风险.
    internalRisk: 'POST /p/report/neibufengkongfengxiantongji',
    // 供应商风险.
    supplierRisk: 'POST /p/report/gongyingshangfenxiantongji',
    // 风控指标趋势图(月度).
    indicatorsRisk: 'POST /p/report/fengkongzhibiaoqushitu',

    // 风控中心查询所有合同.
    allContract: 'POST /p/risk/findAllContract',
    // 风控中心查询所有票据.
    allInvoice: 'POST /p/risk/findAllInvoice',
    // 风控中心查询所有供应商.
    allProvider: 'POST /p/risk/findAllProvider',
    // 风控中心查询所有项目.
    allProject: 'POST /p/risk/findAllProject',
}

const API = APIFunction(api);

export default API;
