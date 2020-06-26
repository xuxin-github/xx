import supplierApi from '../../../api/supplier/supplierApi';
import util from '../../../utils/notification';

export default {
    namespace: 'supplier_model',
    state: {
        addModelShow: false,
        auditModelShow: false,
        // 供应商列表.
        supplierList: {},
        // 详情.
        supplierDetail: {},
        queryParams: {},
        pageSize: 10,
        page: 1
    },
    effects: {
        /**
         * 查询所有列表.
         */
        * tableList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.supplier_model);
            let rs = yield call(supplierApi.querySupplierList, { pageSize, page, queryParams });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { supplierList: rs.data },
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
                type: 'tableList',
                payload: {},
            });
        },
        /**
         * 查看详情.
         */
        * detailDataList({ payload }, { call, put }) {
            let supplierDetail = yield call(supplierApi.getSupplierByName, { company_name: payload.company_name });
            if (supplierDetail.code === 0 || supplierDetail.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { supplierDetail: supplierDetail.data },
                });
            }
        },
        /**
         * 修改.
         */
        * edit({ payload }, { put, call }) {
            let supplier = yield call(supplierApi.updateCompanyStatus, { company_name: payload.company_name, company_status: payload.company_status });
            if (supplier.code === 0 || supplier.code === '0') {
                yield put({
                    type: 'tableList',
                    payload: {},
                });
                util.success(supplier.msg);
            }else{
                util.error(supplier.msg);
            }
        },
        /**
         * 增加.
         */
        * add({ payload, callback }, { call, put }) {
            let supplier = yield call(supplierApi.addSupplier, payload.values);
            if (supplier.code === 0 || supplier.code === '0') {
                yield put({
                    type: 'tableList',
                    payload: {},
                });
                yield put({
                    type: 'updateState',
                    payload: { "addModelShow": false }
                });
                util.success(supplier.msg);
            }else{
                util.error(supplier.msg);
            }
            callback(supplier.code);
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
                type: 'tableList',
                payload: {}
            });
        },
    },

    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    }
}