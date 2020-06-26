import util from '../../../utils/notification';
import reimburseTypeAPI from '../../../api/systemManagement/reimburseTypeAPI';
export default {
    namespace: 'reimburseType_model',
    state: {
        // 合同列表.
        reimburseTypeData: {},
        pageSize: 10,
        page: 1,
        // 参数列表.
        queryParams: {},
        //类别名称
        type_name: '',
        // 修改类别时, 显示对话框.
        updateVisible: false,

    },
    effects: {
        //查询列表
        * reimburseTypeList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.reimburseType_model);
            let reimburse = yield call(reimburseTypeAPI.queryreimburseType, { pageSize, page, queryParams });
            if (reimburse.code === 0 || reimburse.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { reimburseTypeData: reimburse.data },
                });
            }
        },
        /**
         *  查询(不分页).
         */
        * reimburse({ callback }, { call }) {
            let reimburse = yield call(reimburseTypeAPI.reimburseList);
            if (reimburse.code === 0 || reimburse.code === '0') {
                callback(reimburse.data);
            }
        },

        // 新增列表
        * add({ payload, callback }, { call, put }) {
            let rs = yield call(reimburseTypeAPI.addreimburseType, { ...payload.formdata });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'reimburseTypeList',
                    payload: {},
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
            callback(rs.code);
        },
        //获取指定名称的合同类别
        * get({ payload, callback }, { call }) {
            let tag = yield call(reimburseTypeAPI.get, { type_name: payload.type_name });
            if (tag.code === 0 || tag.code === '0') {
                callback(tag.data);
            }
        },
        * update({ payload, callback }, { call, put }) {
            let tag = yield call(reimburseTypeAPI.update, { ...payload.formdata, type_code: payload.type_code });
            if (tag.code === 0 || tag.code === '0') {
                yield put({
                    type: 'reimburseTypeList',
                });
                util.success(tag.msg);
            } else {
                util.error(tag.msg);
            }
            callback(tag.code);
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
                type: 'reimburseTypeList',
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