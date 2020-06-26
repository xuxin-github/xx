import authApi from '../../../api/auth/authApi';
import router from 'umi/router';
import authutil from '../../../utils/authutil';
import util from '../../../utils/util';
import notification from '../../../utils/notification';
//引入解析token的方法
import jwt_decode from 'jwt-decode';
const { valiLogin } = authApi;

export default {
    namespace: 'auth_model',
    state: {
        username: ''
    },

    effects: {
        /**
         * 登录
         */
        * login({ payload }, { call, put, select }) {
            //提交验证码key
            // console.log("payload", payload);
            let rs = yield call(valiLogin, {
                username: payload.username,
                password: payload.password,
                company: "1",
                corp: 'p',
            });
            yield put({
                type: 'updateState',
                payload: { username: payload.username },
            });
            // console.log("登录结果", rs);
            if (!util.isEmpty(rs.headers.token)) {
                //验证token以fdkey 开头
                if (rs.headers.token.indexOf("fdkey ") == 0) {
                    //解析验证
                    const decoded = jwt_decode(rs.headers.token.replace("fdkey ", ""));
                    // console.log("解析后", decoded);
                    if (checkAuth(decoded.auth, "-1")) {
                        notification.error("用户不存在！！！", "温馨提示");
                    } else if (checkAuth(decoded.auth, "-2")) {
                        notification.error("密码错误！！！", "温馨提示");
                    } else if (checkAuth(decoded.auth, "-3")) {
                        notification.error("账号已被禁用，请联系管理员！！！", "温馨提示");
                    } else if (checkAuth(decoded.auth, "-4")) {
                        notification.error("账号权限不够，请联系管理员！！！", "温馨提示");
                    } else {
                        //登录成功,存token
                        authutil.setAuthToken(rs.headers.token);
                        // 添加权限到common_model.
                        yield put({ type: 'common_model/updateState', payload: { menuRoles: decoded.auth } });
                        localStorage.setItem('ROLE', JSON.stringify(decoded.auth));
                        localStorage.setItem('SUB', JSON.stringify(decoded.sub));
                        //如果选择了记住我，写入缓存
                        if (payload.remember) {
                            localStorage.setItem('USER_P', JSON.stringify({
                                username: payload.username,
                                // password: payload.password
                            }));
                        } else {
                            // localStorage.removeItem('USER_P');
                            localStorage.setItem('USER_P', JSON.stringify({
                                username: payload.username,
                            }));
                        }
                        if (checkAuth(decoded.auth, "ROLE_DIRECTOR")) {
                            //跳转平台首页
                            router.push("/fht/bill/bill_list");
                        } else {
                            //跳转平台首页
                            router.push("/fht/risk/risk_list");
                        }
                    }
                }
            }
        },

        /**
         * 获取用户所属的公司名称
         */
        * getUserCompanyName({ payload }, { call, put }) {
            let rs = yield call(authApi.getUserCompanyName, { username: payload.username });
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { user_company_name: rs.data.company_name },
                });
            }
        },
    },

    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    }
}


function checkAuth(authList, value) {
    let retb = false;
    for (var i = 0; i < authList.length; i++) {
        if (authList[i].authority == value) {
            retb = true;
            break;
        }
    }
    return retb;
}