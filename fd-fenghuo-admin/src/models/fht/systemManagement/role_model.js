// 引入接口.
import roleApi from '../../../api/systemManagement/roleApi';
import util from '../../../utils/notification';

export default {
    namespace: 'role_model',
    state: {
        // 角色列表.
        roleData: {},
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
        * roleList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.role_model);
            let role = yield call(roleApi.query, { pageSize, page, queryParams });
            if (role.code === 0 || role.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { roleData: role.data },
                });
            }
        },
        /**
         * 页面显示数据发生改变.
         */
        * changePageOrPageSize({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload: { page: payload.page, pageSize: payload.pageSize }
            });
            //重新获取一次数据
            yield put({
                type: 'roleList',
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