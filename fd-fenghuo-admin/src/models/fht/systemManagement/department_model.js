// 引入接口.
import departmentAPI from '../../../api/systemManagement/departmentAPI';
import util from '../../../utils/notification';

export default {
    namespace: 'department_model',
    state: {
        // 组织部门列表.
        departmentData: {},
        // 参数列表.
        queryParams: {},
        // 每页显示的数量.
        pageSize: 10,
        // 当前页.
        page: 1,
        // 部门名称.
        dept_name: '',
        // 修改部门时, 显示对话框.
        updateVisible: false,
    },
    effects: {
        /**
         * 查询列表.
         */
        * departmentList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.department_model);
            let dept = yield call(departmentAPI.query, { pageSize, page, queryParams });
            if (dept.code === 0 || dept.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { departmentData: dept.data },
                });
            }
        },
        /**
         * 获取指定名称的组织部门.
         */
        * get({ payload, callback }, { call }) {
            let rs = yield call(departmentAPI.getDepartment, { dept_name: payload.dept_name });
            if (rs.code === 0 || rs.code === '0') {
                callback(rs.data);
            }
        },
        /**
         * 新增.
         */
        * add({ payload, callback }, { call, put }) {
            let rs = yield call(departmentAPI.addDepartment, payload.formdata);
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'departmentList',
                    payload: {},
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
            callback(rs.code)
        },
        /**
         * 更新.
         */
        * update({ payload, callback }, { call, put }) {
            let rs = yield call(departmentAPI.updateDepartment, { ...payload.formdata, dept_code: payload.dept_code });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'departmentList',
                    payload: {},
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
            callback(rs.code)
        },
        /**
         * 删除.
         */
        * delete({ payload }, { call, put }) {
            let rs = yield call(departmentAPI.deleteDepartment, { dept_code: payload.dept_code });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'departmentList',
                    payload: {},
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
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
                type: 'departmentList',
            });
        },
        /**
         * 查询有父部门的组织部门.
         */
        * childDepartmentList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.department_model);
            let dept = yield call(departmentAPI.childDepartmentList, { pageSize, page, queryParams, p_dept_no: payload.p_dept_no });
            if (dept.code === 0 || dept.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { departmentData: dept.data },
                });
            }
        },
        /**
         * 新增.
         */
        * childAddDepartment({ payload, callback }, { call, put }) {
            let rs = yield call(departmentAPI.childAddDepartment, { ...payload.formdata, dept_name_p: payload.dept_name, p_dept_no: payload.p_dept_no });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'childDepartmentList',
                    payload: { p_dept_no: payload.p_dept_no },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
            callback(rs.code)
        },
        /**
         * 更新.
         */
        * childUpdate({ payload, callback }, { call, put }) {
            let rs = yield call(departmentAPI.updateDepartment, { ...payload.formdata, dept_code: payload.dept_code });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'childDepartmentList',
                    payload: { p_dept_no: payload.p_dept_no },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
            callback(rs.code)
        },
        /**
         * 删除.
         */
        * childDelete({ payload }, { call, put }) {
            let rs = yield call(departmentAPI.deleteDepartment, { dept_code: payload.dept_code });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'childDepartmentList',
                    payload: { p_dept_no: payload.p_dept_no },
                });
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