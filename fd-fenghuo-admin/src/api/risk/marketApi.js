import APIFunction from '../APIFunction';

const api = {
    // 市场监管违法案例列表.
    marketList: 'POST /p/market/findMarket',
    // 获取指定市场监管违法案例.
    getMarket: '/p/market/getMarketById',
    // 新增市场监管违法案例.
    addMarket: 'POST /p/market/insertMarket',
    // 修改市场监管违法案例.
    updateMarket: 'POST /p/market/updateMarket',
    // 修改市场监管违法案例发布状态.
    updateStatus: 'POST /p/market/updateStatus',

    // 发布的市场监管违法案例列表.
    marketReleaseList: 'POST /p/market/findReleaseMarket',
}

const API = APIFunction(api);

export default API;
