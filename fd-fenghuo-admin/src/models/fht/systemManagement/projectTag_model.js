// 引入接口.
import projectTagApi from '../../../api/systemManagement/projectTagApi';
import util from '../../../utils/notification';

export default {
    namespace: 'projectTag_model',
    state: {
        // 项目标签列表.
        projectTagData: {},
        // 参数列表.
        queryParams: {},
        // 每页显示的数量.
        pageSize: 10,
        // 当前页.
        page: 1,
        // 标签名称.
        tag_name: '',
        // 修改标签时, 显示对话框.
        updateVisible: false,
    },
    effects: {
        /**
         * 查询列表.
         */
        * tagList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.projectTag_model);
            let projectTag = yield call(projectTagApi.query, { pageSize, page, queryParams });
            if (projectTag.code === 0 || projectTag.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { projectTagData: projectTag.data },
                });
            }
        },
        /**
         * 查询列表(不分页).
         */
        * tag({ callback }, { call }) {
            let projectTag = yield call(projectTagApi.tagList);
            if (projectTag.code === 0 || projectTag.code === '0') {
                callback(projectTag.data);
            }
        },
        /**
         * 获取指定项目标签.
         */
        * get({ payload, callback }, { call }) {
            let tag = yield call(projectTagApi.get, { tag_name: payload.tag_name });
            if (tag.code === 0 || tag.code === '0') {
                callback(tag.data);
            }
        },
        /**
         * 新增.
         */
        * add({ payload, callback }, { call, put }) {
            let tag = yield call(projectTagApi.add, { ...payload.formdata });
            if (tag.code === 0 || tag.code === '0') {
                yield put({
                    type: 'tagList',
                });
                util.success(tag.msg);
            } else {
                util.error(tag.msg);
            }
            callback(tag.code);
        },
        /**
         * 修改.
         */
        * update({ payload, callback }, { call, put }) {
            let tag = yield call(projectTagApi.update, { ...payload.formdata, tag_code: payload.tag_code });
            if (tag.code === 0 || tag.code === '0') {
                yield put({
                    type: 'tagList',
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
                type: 'tagList',
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