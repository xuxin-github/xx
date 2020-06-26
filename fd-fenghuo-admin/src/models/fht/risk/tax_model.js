// 引入接口.
import taxApi from '../../../api/risk/taxApi';
import util from '../../../utils/notification';

export default {
    namespace: 'tax_model',
    state: {
        // 税收违法案例列表.
        taxData: {},
        // 获取指定税收违法案例.
        taxDetail: {},
        // 发布的税收违法案例列表.
        taxReleaseData: {},
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
        * taxList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.tax_model);
            let tax = yield call(taxApi.taxList, { pageSize, page, queryParams });
            if (tax.code === 0 || tax.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { taxData: tax.data },
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
                type: 'taxList',
            });
        },
        /**
         * 获取指定税收违法案例.
         */
        * taxDetail({ payload }, { call, put }) {
            let taxDetail = yield call(taxApi.getTax, { tax_name: payload.tax_name });
            if (taxDetail.code === 0 || taxDetail.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { taxDetail: taxDetail.data },
                });
            }
        },
        /**
         * 新增税收违法案例.
         */
        * addTax({ payload, callback }, { call, put }) {
            let tax = yield call(taxApi.addTax, { ...payload.values, is_release: payload.is_release });
            if (tax.code === 0 || tax.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'taxList',
                });
                util.success(tax.msg);
            } else {
                util.error(tax.msg);
            }
            callback(tax.code);
        },
        /**
         * 修改税收违法案例.
         */
        * updateTax({ payload, callback }, { call, put }) {
            let tax = yield call(taxApi.updateTax, { ...payload.values, id: payload.id, is_release: payload.is_release });
            if (tax.code === 0 || tax.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'taxList',
                });
                util.success(tax.msg);
            } else {
                util.error(tax.msg);
            }
            callback(tax.code);
        },
        /**
         * 修改税收违法案例发布状态.
         */
        * updateStatus({ payload }, { call, put }) {
            let tax = yield call(taxApi.updateStatus, { tax_name: payload.name, is_release: payload.is_release });
            if (tax.code === 0 || tax.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'taxList',
                });
                util.success(tax.msg);
            } else {
                util.error(tax.msg);
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
                type: 'taxList',
            });
        },
        /**
         * 查询列表.
         */
        * taxReleaseList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.tax_model);
            let tax = yield call(taxApi.taxReleaseList, { pageSize, page, queryParams });
            if (tax.code === 0 || tax.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { taxReleaseData: tax.data },
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
                type: 'taxReleaseList',
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
                type: 'taxReleaseList',
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