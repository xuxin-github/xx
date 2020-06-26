// 引入接口.
import projectMemberApi from '../../../api/project/projectMemberApi';
import util from '../../../utils/notification';

export default {
    namespace: 'project_member_model',
    state: {},
    effects: {
        /**
         * 查询列表.
         */
        * memberList({ payload, callback }, { call }) {
            let member = yield call(projectMemberApi.memberList, { project_code: payload.project_code, username: payload.username, role_code: payload.role_code });
            if (member.code === 0 || member.code === '0') {
                callback(member.data);
            }
        },
        /**
         * 新增.
         * 使用callback回调函数.
         */
        * add({ payload, callback }, { call }) {
            let rs = yield call(projectMemberApi.add, { user_id: payload.personnel_id, project_code: payload.project_code });
            if (rs.code === 0 || rs.code === '0') {
                callback(rs.data);
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 删除.
         */
        * delete({ payload, callback }, { call }) {
            let rs = yield call(projectMemberApi.delete, { user_id: payload.id, project_code: payload.project_code });
            if (rs.code === 0 || rs.code === '0') {
                callback(rs.data);
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