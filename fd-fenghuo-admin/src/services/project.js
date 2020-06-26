import request from '../utils/request';

export async function list() {
    return await request('/api/project/list');
}