import APIFunction from '../APIFunction';

const api = {
    // 查询.
    query: 'POST /p/dept/departmentList',
    // 获取指定名称的组织部门.
    getDepartment: 'POST /p/dept/getDepartment',
    // 新增.
    addDepartment: 'POST /p/dept/insertDepartment',
    // 更新.
    updateDepartment: 'POST /p/dept/updateDepartment',
    // 删除.
    deleteDepartment: 'POST /p/dept/deleteDepartment',

    // 查询有父部门的组织部门.
    childDepartmentList: 'POST /p/dept/childDepartmentList',
    // 新增有父部门的组织部门.
    childAddDepartment: 'POST /p/dept/insertChildDepartment',
}

const API = APIFunction(api);

export default API;
