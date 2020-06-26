// 引入接口.
import marketApi from '../../../api/risk/marketApi';
import util from '../../../utils/notification';

export default {
    namespace: 'market_model',
    state: {
        // 市场监管违法案例列表.
        marketData: {},
        // 获取指定市场监管违法案例.
        marketDetail: {},
        // 发布的市场监管违法案例列表.
        marketReleaseData: {},
        // 参数列表.
        queryParams: {},
        // 每页显示的数量.
        pageSize: 10,
        // 当前页.
        page: 1,
    },
    effects: {
        /**
         * 查询列表.
         */
        * marketList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.market_model);
            let market = yield call(marketApi.marketList, { pageSize, page, queryParams });
            if (market.code === 0 || market.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { marketData: market.data },
                });
            }
        },
        /**
         * 搜索.
         */
        * query({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload: { queryParams: payload.values, page: 1 }
            });
            // 重新获取数据.
            yield put({
                type: 'marketList',
            });
        },
        /**
         * 获取指定市场监管违法案例.
         */
        * marketDetail({ payload }, { call, put }) {
            let marketDetail = yield call(marketApi.getMarket, { market_name: payload.market_name });
            if (marketDetail.code === 0 || marketDetail.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { marketDetail: marketDetail.data },
                });
            }
        },
        /**
         * 新增市场监管违法案例.
         */
        * addMarket({ payload, callback }, { call, put }) {
            let market = yield call(marketApi.addMarket, { ...payload.values, is_release: payload.is_release });
            if (market.code === 0 || market.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'marketList',
                });
                util.success(market.msg);
            } else {
                util.error(market.msg);
            }
            callback(market.code);
        },
        /**
         * 修改市场监管违法案例.
         */
        * updateMarket({ payload, callback }, { call, put }) {
            let market = yield call(marketApi.updateMarket, { ...payload.values, id: payload.id, is_release: payload.is_release });
            if (market.code === 0 || market.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'marketList',
                });
                util.success(market.msg);
            } else {
                util.error(market.msg);
            }
            callback(market.code);
        },
        /**
         * 修改市场监管违法案例发布状态.
         */
        * updateStatus({ payload }, { call, put }) {
            let market = yield call(marketApi.updateStatus, { market_name: payload.name, is_release: payload.is_release });
            if (market.code === 0 || market.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'marketList',
                });
                util.success(market.msg);
            } else {
                util.error(market.msg);
            }
        },
        /**
         * 页面显示数据发生改变.
         */
        *changePageOrPageSize({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload: { page: payload.page, pageSize: payload.pageSize }
            });
            //重新获取一次数据
            yield put({
                type: 'marketList',
            });
        },
        /**
         * 发布的查询列表.
         */
        * marketReleaseList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.market_model);
            let market = yield call(marketApi.marketReleaseList, { pageSize, page, queryParams });
            if (market.code === 0 || market.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { marketReleaseData: market.data },
                });
            }
        },
        /**
         * 搜索.
         */
        * queryRelease({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload: { queryParams: payload.values, page: 1 }
            });
            // 重新获取数据.
            yield put({
                type: 'marketReleaseList',
            });
        },
        /**
         * 页面显示数据发生改变.
         */
        *changeReleasePageOrPageSize({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload: { page: payload.page, pageSize: payload.pageSize }
            });
            //重新获取一次数据
            yield put({
                type: 'marketReleaseList',
            });
        },
    },

    // 用来保存更新state值, 上面的put方法调用这里的方法.
    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    }
}