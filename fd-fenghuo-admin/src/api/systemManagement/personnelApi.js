import APIFunction from '../APIFunction';

const api = {
    // 查询.
    query: 'POST /p/personnel/personnelList',
    // 获取指定用户信息.
    get: 'POST /p/personnel/getPersonnelById',
    // 根据用户名查询.
    getPersonnel: 'POST /P/personnel/getPersonnelByName',
    // 查询所有角色.
    roleList: 'POST /p/personnel/roleList',
    // 查询所有组织部门.
    deptList: 'POST /p/personnel/deptList',
    // 新增人员.
    add: 'POST /p/personnel/insertPersonnel',
    // 修改人员.
    update: 'POST /p/personnel/updatePersonnel',
    // 改变禁启用状态.
    changeStatus: 'POST /p/personnel/changePersonnelStatus',

    // 根据部门编号查询出人员信息.
    personnel: 'POST /p/personnel/PersonnelByDeptList',
}

const API = APIFunction(api);

export default API;