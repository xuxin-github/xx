import APIFunction from '../APIFunction';

const api = {
    // 进项票据统计
    InvoiceCountAll1:'POST /p/report/enterInvoiceCount',
    // 已/待处理票据统计
    InvoiceCountAll2:'POST /p/report/invoiceHandleCount',
    // 高风险发票增长趋势数据
    highInvoiceChartList:'POST /p/report/highInvoiceChart',
    // 高风险发票来源列表
    tableDataList:'POST /p/report/highRiskInvoiceList',
    // 高风险发票增长趋势.
    highRiskList: 'POST /p/report/highCatInvoiceChart',
    // 消息提醒中心数据.
    messageList: 'POST /p/report/xiaoxitixingzhongxinAll',
    
    

}

const API = APIFunction(api);

export default API;
