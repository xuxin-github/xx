// 引入接口.
import personnelApi from '../../../api/systemManagement/personnelApi';
import util from '../../../utils/notification';

export default {
    namespace: 'personnel_model',
    state: {
        // 人员列表.
        personnelData: {},
        // 角色列表.
        roleData: [],
        // 组织部门列表.
        deptData: [],
        // 参数列表.
        queryParams: {},
        // 每页显示的数量.
        pageSize: 10,
        // 当前页.
        page: 1,
        // 账户名称.
        username: '',
        // 修改人员时, 显示对话框.
        updateVisible: false,
    },
    effects: {
        /**
         * 查询列表.
         */
        * personnelList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.personnel_model);
            let personnel = yield call(personnelApi.query, { pageSize, page, queryParams });
            if (personnel.code === 0 || personnel.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { personnelData: personnel.data },
                });
            }
        },
        /**
         * 获取指定用户信息.
         */
        * get({ payload, callback }, { call }) {
            let personnel = yield call(personnelApi.get, { id: payload.id });
            if (personnel.code === 0 || personnel.code === '0') {
                callback(personnel.data);
            }
        },
        /**
         * 根据用户名查询.
         */
        * getPersonnel({ payload, callback }, { call }) {
            let personnel = yield call(personnelApi.getPersonnel, { username: payload.username });
            if (personnel.code === 0 || personnel.code === '0') {
                callback(personnel.data);
            }
        },
        /**
         * 查询所有角色.
         */
        * roleList({ payload }, { call, put }) {
            let role = yield call(personnelApi.roleList);
            if (role.code === 0 || role.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { roleData: role.data },
                });
            }
        },
        /**
         * 查询所有组织部门.
         */
        * deptList({ payload }, { call, put }) {
            let dept = yield call(personnelApi.deptList);
            if (dept.code === 0 || dept.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { deptData: dept.data },
                });
            }
        },
        /**
         * 新增.
         */
        * add({ payload, callback }, { call, put }) {
            let personnel = yield call(personnelApi.add, { ...payload.formdata });
            if (personnel.code === 0 || personnel.code === '0') {
                yield put({
                    type: 'personnelList',
                });
                util.success(personnel.msg);
            } else {
                util.error(personnel.msg);
            }
            callback(personnel.code);
        },
        /**
         * 修改.
         */
        * update({ payload, callback }, { call, put }) {
            let personnel = yield call(personnelApi.update, { ...payload.formdata, id: payload.id });
            if (personnel.code === 0 || personnel.code === '0') {
                yield put({
                    type: 'personnelList',
                });
                util.success(personnel.msg);
            } else {
                util.error(personnel.msg);
            }
            callback(personnel.code);
        },
        /**
         * 改变禁启用状态.
         */
        * change({ payload }, { call, put }) {
            let rs = yield call(personnelApi.changeStatus, { id: payload.id, is_disable: payload.disable });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'personnelList',
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 根据部门编号查询出人员信息.
         */
        * personnelByDept({ payload, callback }, { call, put }) {
            let rs = yield call(personnelApi.personnel, { dept_code: payload.dept_code });
            if (rs.code === 0 || rs.code === '0') {
                callback(rs.data);
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
                type: 'personnelList',
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