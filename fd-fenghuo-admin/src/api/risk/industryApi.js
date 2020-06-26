import APIFunction from '../APIFunction';

const api = {
    // 查询对应的行业评估内容.
    query: 'POST /p/industryEvaluation/findContent',
    // 保存内容.
    save: 'POST /p/industryEvaluation/saveContent',
}

const API = APIFunction(api);

export default API;
