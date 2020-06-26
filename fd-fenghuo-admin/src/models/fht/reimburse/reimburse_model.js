// 引入接口.
import reimburseApi from '../../../api/reimburse/reimburseApi';
import util from '../../../utils/notification';

export default {
    namespace: 'reimburse_model',
    state: {
        // 报销详情.
        reimburseDetail: {},
        // 发票列表.
        invoiceList: [],
        // 报销人.
        reimburse_name: '',
        // 报销类别.
        reimburse_type: '',
        // 报销金额.
        reimburse_money: '',
        // 备注信息.
        reimburse_note: '',
        // 附件文件.
        arr_files: [],
    },
    effects: {
        /**
         * 获取指定报销记录.
         */
        * reimburseDetail({ payload }, { call, put }) {
            let reimburse = yield call(reimburseApi.getReimburse, { reimburse_code: payload.reimburse_code });
            if (reimburse.code === 0 || reimburse.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { reimburseDetail: reimburse.data },
                });
            }
        },
        /**
         * 取消关联.
         */
        * cancelConnectInvoice({ payload }, { call, put }) {
            let reimburse = yield call(reimburseApi.cancelConnectInvoice, { invoice_no_short: payload.invoice_no_short, invoice_code: payload.invoice_code });
            if (reimburse.code === 0 || reimburse.code === '0') {
                yield put({
                    type: 'reimburseDetail',
                    payload: { reimburse_code: payload.code },
                });
                util.success(reimburse.msg);
            } else {
                util.error(reimburse.msg);
            }
        },
        /**
         * 新增报销记录.
         */
        * addReimburse({ payload, callback }, { call, put }) {
            let x = (payload.arr_files).join(',');
            payload.values["reimburse_file"] = x;
            let reimburse = yield call(reimburseApi.insertReimburse, { ...payload.values, project_code: payload.project_code, invoiceList: payload.invoiceList });
            if (reimburse.code === 0 || reimburse.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { invoiceList: [], reimburse_name: '', reimburse_type: '', reimburse_money: '', reimburse_note: '', arr_files: [] },
                });
                util.success(reimburse.msg);
            } else {
                util.error(reimburse.msg);
            }
            callback(reimburse.code);
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