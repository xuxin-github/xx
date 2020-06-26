import APIFunction from '../APIFunction';

const api = {
    // 查询.
    memberList: 'POST /p/projectMember/projectMemberList',
    // 新增.
    add: 'POST /p/projectMember/insertProjectMember',
    // 删除.
    delete: 'POST /p/projectMember/deleteProjectMember',
}

const API = APIFunction(api);

export default API;
