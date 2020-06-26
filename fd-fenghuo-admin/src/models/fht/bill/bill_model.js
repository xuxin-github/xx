
import billApi from '../../../api/bill/billApi';
import util from '../../../utils/notification';

export default {
    namespace: 'bill_model',
    state: {
        // 新增窗口
        addModelShow: false,
        // 数据      
        invoiceData: {},
        // 接收参数                             
        queryParams: {},
        queryParams1: {},
        // 发票详情数据
        bill_details: {},
        // 当前发票代码
        invoice_code: {},
        // 当前发票号码
        invoice_no_short: {},
        // 每页显示数量
        pageSize: 10,
        // 当前页
        page: 1,
        // 新增时发票的合同信息.
        invoice_contract: {},
    },
    effects: {
        /**
         * 查询所有发票列表
         */
        * queryDataList({ payload }, { select, call, put }) {
            // 获取搜索条件.
            const { queryParams, pageSize, page } = yield select(_ => _.bill_model); // 获取到了当前state中的数据.
            //  页面向model中请求数据, model向api中调用接口, 从后台获取数据.
            let rs = yield call(billApi.queryBillList, { pageSize, page, queryParams, username: payload.username, role_code: payload.role_code });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { invoiceData: rs.data },
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
            yield put({
                type: 'queryDataList',
                payload: { username: payload.username, role_code: payload.role_code },
            });
        },
        /**
         * 查询单个发票详细信息.
         */
        * queryDataOneList({ payload }, { select, call, put }) {
            let rs = yield call(billApi.queryBillDetails, { invoice_no_short: payload.invoice_no_short, invoice_code: payload.invoice_code });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { bill_details: rs.data, invoice_code: payload.invoice_code, invoice_no_short: payload.invoice_no_short },
                });
            }
        },
        /**
         * 增加
         */
        * add({ payload }, { put, select }) {
            //数据提交成功，隐藏表单 
            const { tabledata } = yield select(_ => _.bill_model);
            yield put({
                type: 'updateState',
                payload: { "addShow": false }
            });
            yield put({
                type: 'queryDataList',
                payload: { "queryParams": [...tabledata.datalist, payload.queryParams] }
            });
        },
        /**
         * 新增发票时查找.
         */
        * querySubmit({ payload, callback }, { call }) {
            let rs = yield call(billApi.addInvoice, payload.values);
            if (rs.code === 0 || rs.code === '0' || rs.code === 4 || rs.code === '4') {
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
            callback(rs);
        },
        /**
         * 下拉关联时的选项.
         */
        * queryConnectContract({ payload, callback }, { call }) {
            let rs = yield call(billApi.queryAddContract, { seller_name: payload.seller_name, username: payload.username, role_code: payload.role_code });
            if (rs.code === 0 || rs.code === '0') {
                callback(rs.data);
            }
        },
        /**
         * 发票变更关联时下拉框的合同列表.
         */
        * findAllContractList({ payload, callback }, { call }) {
            //数据提交成功，隐藏表单 
            let rs = yield call(billApi.findAllContractList, { seller_name: payload.seller_name, contract_code: payload.contract_code });
            if (rs.code === 0 || rs.code === '0') {
                callback(rs.data);
            }
        },
        /**
         * 发票变更关联.
         */
        * updateInvoiceContract({ payload }, { call, put }) {
            let rs = yield call(billApi.updateInvoiceContract, { ...payload.value, invoice_code: payload.invoice_code, 
                contract_before_code: payload.contract_before_code, seller_name: payload.s_name, invoice_no_short: payload.invoice_no_short });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'queryDataOneList',
                    payload: { invoice_code: payload.invoice_code, invoice_no_short: payload.invoice_no_short }
                });
                yield put({
                    type: 'updateState',
                    payload: { "auditModelShow": false }
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 添加发票时直接关联该合同.
         */
        * updateInvoiceNowContract({ payload }, { call, put }) {
            let rs = yield call(billApi.updateInvoiceNowContract, { ...payload.value, invoice_code: payload.invoice_code, 
                invoice_no_short: payload.invoice_no_short, contract_code: payload.contract_code, seller_name: payload.s_name });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { "auditModelShow": false }
                });
                yield put({
                    type: 'queryDataOneList',
                    payload: { invoice_code: payload.invoice_code, invoice_no_short: payload.invoice_no_short }
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },

        /**
         * 关联至合同.
         */
        * addSupplier({ payload }, { call, put }) {
            let rs = yield call(billApi.addConnectContract, { contract_code: payload.connect_contract, 
                invoice_code: payload.invoice_code, seller_name: payload.s_name, 
                invoice_no_short: payload.invoice_no_short });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { "auditModelShow": false }
                });
                yield put({
                    type: 'queryDataList',
                    payload: { username: payload.username, role_code: payload.role_code },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 新建并关联至合同.
         */
        * createAddSupplier({ payload }, { call, put }) {
            let rs = yield call(billApi.addCreateConnectContract, { contract_name: payload.contract_name, 
                contract_code: payload.contract_code, invoice_code: payload.invoice_code, 
                invoice_no_short: payload.invoice_no_short, contract_tag: payload.contract_tag });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { "auditModelShow": false }
                });
                yield put({
                    type: 'queryDataList',
                    payload: { username: payload.username, role_code: payload.role_code },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 删除
         */
        * delete({ payload }, { put, select, call }) {
            const { tabledata } = yield select(_ => _.bill_model);
            console.log("model里data数据：", tabledata.datalist);
            console.log("得到页面所传的数据：", payload.key);
        },

        /**
         * 页面大小发生改变
         */
        * pageSizeChange({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload: { page: payload.page, pageSize: payload.pageSize, }
            });
            yield put({
                type: 'queryDataList',
                payload: { username: payload.username, role_code: payload.role_code },
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