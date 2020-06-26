// 引入接口.
import industryApi from '../../../api/risk/industryApi';
import util from '../../../utils/notification';
import { callbackify } from 'util';

export default {
    namespace: 'industry_model',
    state: {},
    effects: {
        /**
         * 查询对应的行业评估内容.
         */
        * query({ payload, callback }, { call, put }) {
            let rs = yield call(industryApi.query);
            if (rs.code === 0 || rs.code === '0') {
                callback(rs.data);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 保存内容.
         */
        * saveContent({ payload }, { call }) {
            let rs = yield call(industryApi.save, payload.values);
            if (rs.code === 0 || rs.code === '0') {
                util.success(rs.msg);
            } else {
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