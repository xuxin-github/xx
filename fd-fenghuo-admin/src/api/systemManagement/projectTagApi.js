import APIFunction from '../APIFunction';

const api = {
    // 查询.
    query: 'POST /p/projectTag/projectTagList',
    // 查询(不分页).
    tagList: 'POST /p/projectTag/tagList',
    // 获取指定项目标签.
    get: 'POST /p/projectTag/getProjectTag',
    // 新增.
    add: 'POST /p/projectTag/insertProjectTag',
    // 修改.
    update: 'POST /p/projectTag/updateProjectTag',
}

const API = APIFunction(api);

export default API;