
import util from '../../../utils/notification';
import contractTagAPI from '../../../api/systemManagement/contractTagAPI';

export default {
    namespace: 'contractTag_model',
    state: {
        // 合同列表.
        contractTagData: {},
        pageSize: 10,
        page: 1,
        // 参数列表.
        queryParams: {},
        //合同类别名称
        tag_name: '',
        // 修改合同类别时, 显示对话框.
        updateVisible: false,
    },
    effects: {
        //查询列表
        * contractTagList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.contractTag_model);
            let contract = yield call(contractTagAPI.queryContractTag, { pageSize, page, queryParams });
            if (contract.code === 0 || contract.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { contractTagData: contract.data },
                });
            }
        },
        /**
         * 查询列表(不分页).
         */
        * tagList({ callback }, { call }) {
            let tag = yield call(contractTagAPI.contractTagList);
            if (tag.code === 0 || tag.code === '0') {
                callback(tag.data);
            }
        },
        // 新增列表
        * add({ payload, callback }, { call, put }) {
            console.log({ ...payload.formdata });
            let rs = yield call(contractTagAPI.addContractTag, { ...payload.formdata });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'contractTagList',
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
            let tag = yield call(contractTagAPI.get, { tag_name: payload.tag_name });
            if (tag.code === 0 || tag.code === '0') {
                callback(tag.data);
            }
        },
        * update({ payload, callback }, { call, put }) {
            let tag = yield call(contractTagAPI.update, { ...payload.formdata, tag_code: payload.tag_code });
            if (tag.code === 0 || tag.code === '0') {
                yield put({
                    type: 'contractTagList',
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
                type: 'contractTagList',
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