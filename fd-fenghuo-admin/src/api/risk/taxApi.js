import APIFunction from '../APIFunction';

const api = {
    // 税收违法案例检索.
    taxList: 'POST /p/tax/findTax',
    // 获取指定税收违法案例.
    getTax: '/p/tax/getTaxById',
    // 新增税收违法案例.
    addTax: 'POST /p/tax/insertTax',
    // 修改税收违法案例.
    updateTax: 'POST /p/tax/updateTax',
    // 修改税收违法案例发布状态.
    updateStatus: 'POST /p/tax/updateStatus',

    // 发布的税收违法案例检索.
    taxReleaseList: 'POST /p/tax/findReleaseTax',
}

const API = APIFunction(api);

export default API;
