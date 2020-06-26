import axios from "axios";
//引入解析token的方法
import jwt_decode from 'jwt-decode'
import router from 'umi/router';

/**
 * 通用工具类
 */
const authutil = {
    setAuthToken(token) {
        //存token
        localStorage.setItem('jwToken', token);
        //挂载token到axios
        authutil.setAxiosToken(token);
    },
    refreshAuthToken() {
        let token = localStorage.jwToken;
        // console.log("window.location.pathname==", window.location.pathname);
        if (token) {
            this.setAuthToken(token);
            // 解析token
            const decoded = jwt_decode(token.replace("fdkey ", ""));
            // 检测token过期
            // 获取当前时间
            const currentTime = Date.now() / 1000;//由毫秒转成秒
            // 判断当前时间是否大于token中的exp时间;如果大于是为过期
            if (decoded.exp < currentTime) {
                // 退出后再跳转页面
                console.log("Auth已过期");
                router.push("/fht/auth/login");
            } else {
                //如果当前页面为登录页面，自动跳转到首页
                let pathname = window.location.pathname;
                if (pathname.indexOf("/fht/auth/login") > -1 || pathname == "/fht") {
                    //平台端
                    router.push("/fht/risk/risk_list");
                }
            }
        } else {
            console.log("Auth不存在");
            //通过url判断用户身份
            if (window.location.pathname.indexOf("/fht") > -1) {
                //表示平台
                if (!window.location.pathname.indexOf("/fht/auth/login") > -1) {
                    router.push("/fht/auth/login");
                }
            }
        }
    },
    setAxiosToken(token) {
        if (token) {
            // token存在设置header,因为后续每个请求都需要
            axios.defaults.headers.common['token'] = token;
        } else {
            // 没有token就移除
            delete axios.defaults.headers.common['token'];
        }
    },
    logout() {
        //退出
        authutil.delToken();
    },
    delToken() {
        delete axios.defaults.headers.common['token'];
        localStorage.removeItem("jwToken");
        localStorage.removeItem('USER_P');
        localStorage.removeItem('ROLE');
        //通过url判断用户身份
        if (window.location.pathname.indexOf("/fht/") > -1) {
            //表示平台
            if (!window.location.pathname.indexOf("/fht/auth/login") > -1) {
                router.push("/fht/auth/login");
            }
        }
    }
}

export default authutil;