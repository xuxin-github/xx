// 引入接口.
import systemApi from '../../../api/system/systemApi';
import util from '../../../utils/notification';

export default {
    namespace: 'system_model',
    state: {},
    effects: {
        /**
         * 查询风控值.
         * 需要传入公司ID, 现在不设置.
         */
        * query({ payload, callback }, { call, put }){
            let system_query = yield call(systemApi.querySystemList, { company_no: "1" });
            if (system_query.code === 0 || system_query.code === '0') {
                callback(system_query.data);
            }
        },
        /**
         * 更新风控.
         */
        * update({ payload, callback }, { call, put }) {
            let rs = yield call(systemApi.updateSystem, payload.riskData);
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'query',
                    payload: {},
                });
                callback(rs.code);
                util.success(rs.msg);
            }else{
                util.error(rs.msg);
            }
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