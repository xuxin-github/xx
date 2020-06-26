// 引入接口.
import projectApi from '../../../api/project/projectApi';
import contractApi from '../../../api/contract/contractApi';
import util from '../../../utils/notification';

export default {
    namespace: 'project_model',
    state: {
        // 项目列表.
        projectList: {},
        // 参数列表.
        queryParams: {},
        // 每页显示的数量.
        pageSize: 10,
        // 当前页.
        page: 1,
        // 项目详情的数据.
        projectDetail: {},
    },
    effects: {
        /**
         * 查询列表.
         */
        * tableList({ payload }, { select, call, put }) {
            const { queryParams, pageSize, page } = yield select(_ => _.project_model);
            let project_list = yield call(projectApi.queryProjectList, { pageSize, page, queryParams, username: payload.username, role_code: payload.role_code });
            if (project_list.code === 0 || project_list.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { projectList: project_list.data },
                });
            }
        },
        /**
         * 搜索.
         */
        * query({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload: { queryParams: payload.values, page: 1 }
            });
            // 重新获取数据.
            yield put({
                type: 'tableList',
                payload: { username: payload.username, role_code: payload.role_code },
            });
        },
        /**
         * 跳转到详情页面.
         * 根据传过来的项目名称, 查询到详情页面所需要的数据.
         */
        * showDetail({ payload }, { call, put }) {
            let projectDetail = yield call(projectApi.getProject, { project_name: payload.project_name, project_code: payload.project_code });
            if (projectDetail.code === 0 || projectDetail.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { projectDetail: projectDetail.data },
                });
            }
        },
        /**
         * 新增项目.
         * 获取表单数据, 传入后台, 得到响应后, 重新刷新页面.
         * 使用callback回调函数.
         */
        * add({ payload, callback }, { call, put }) {
            let rs = yield call(projectApi.addProject, { ...payload.formdata });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'tableList',
                    payload: { username: payload.username, role_code: payload.role_code },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
            callback(rs.code);
        },
        /**
         * 修改审核状态.
         */
        * updateStatus({ payload }, { call, put }) {
            let rs = yield call(projectApi.updateStatus, { project_name: payload.project_name, status: payload.status });
            if (rs.code === 0 || rs.code === '0') {
                // 重新获取数据.
                yield put({
                    type: 'tableList',
                    payload: { username: payload.username, role_code: payload.role_code },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 修改项目基本信息.
         */
        * updateBasicProject({ payload, callback }, { call, put }) {
            let rs = yield call(projectApi.updateBasicProject, { ...payload.values, project_code: payload.project_code });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'showDetail',
                    payload: { project_name: payload.project_name, project_code: payload.project_code },
                });
                callback(rs.code);
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 添加合同.
         * 获得合同编号, 合同名称, 项目编号, 传入后台.
         */
        * addContract({ payload, callback }, { call, put }) {
            let rs = yield call(projectApi.addProjectContract, { ...payload.value, project_code: payload.project_code });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'showDetail',
                    payload: { project_name: payload.project_name, project_code: payload.project_code },
                });
                callback(rs.code);
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 取消关联.
         * 获得合同编号, 传入后台, 修改关联的字段.
         */
        * update({ payload }, { call, put }) {
            let rs = yield call(projectApi.updateRelevance, { contract_code: payload.contract_code });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'showDetail',
                    payload: { project_name: payload.project_name, project_code: payload.project_code },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 结束合同.
         */
        * updateContractStatus({ payload }, { call, select, put }) {
            let contract_updateStatus = yield call(contractApi.updateContractStatus, { name: payload.contract_name });
            if (contract_updateStatus.code == 0 || contract_updateStatus.code == '0') {
                yield put({
                    type: 'showDetail',
                    payload: { project_name: payload.project_name, project_code: payload.project_code },
                });
                util.success("结束成功");
            } else {
                util.error("结束失败");
            }
        },
        /**
         * 修改发票审核状态.
         */
        * updateInvoiceStatus({ payload }, { call, put }) {
            let rs = yield call(projectApi.updateInvoiceStatus, { invoice_no: payload.invoice_no, invoice_code: payload.invoice_code, status: payload.status });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'showDetail',
                    payload: { project_name: payload.project_name, project_code: payload.project_code },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 删除发票(取消关联).
         */
        * cancelConnectInvoice({ payload }, { call, put }) {
            let rs = yield call(projectApi.cancelConnectInvoice, { invoice_no: payload.invoice_no, invoice_code: payload.invoice_code });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'showDetail',
                    payload: { project_name: payload.project_name, project_code: payload.project_code },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 修改报销记录和发票的审核状态.
         */
        * updateReimburseInvoiceStatus({ payload }, { call, put }) {
            let rs = yield call(projectApi.updateReimburseInvoiceStatus, { reimburse_code: payload.reimburse_code, status: payload.status });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'showDetail',
                    payload: { project_name: payload.project_name, project_code: payload.project_code },
                });
                util.success(rs.msg);
            } else {
                util.error(rs.msg);
            }
        },
        /**
         * 删除报销记录(与项目取消关联).
         */
        * cancelConnectReimburseInvoice({ payload }, { call, put }) {
            let rs = yield call(projectApi.cancelConnectReimburseInvoice, { reimburse_code: payload.reimburse_code });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'showDetail',
                    payload: { project_name: payload.project_name, project_code: payload.project_code },
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
                type: 'tableList',
                payload: { username: payload.username, role_code: payload.role_code },
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