import styles from './index.css';
import React, { PureComponent } from 'react';
import router from 'umi/router';
class index extends PureComponent {

    componentWillMount() {
        let pathname = window.location.pathname;
        let ROLE = localStorage.getItem("ROLE");
        let roledata = JSON.parse(ROLE);
        // console.log(roledata);
        // console.log("执行");
        if (pathname.indexOf("/fht") > -1 ) {
            if (this.checkRole(roledata, "ROLE_DIRECTOR")) {
                router.push("/fht/bill/bill_list");
            } else {
                router.push("/fht/risk/risk_list");
            }
        }else{
            let jwToken = localStorage.getItem("jwToken");
            // console.log("jwToken", jwToken);
            if(jwToken){
                if (this.checkRole(roledata, "ROLE_DIRECTOR")) {
                    router.push("/fht/bill/bill_list");
                } else {
                    router.push("/fht/risk/risk_list");
                }
            }else{
                router.push("/fht/auth/login");
            }
        }
    }

    // 验证权限菜单.checkRole(menuRoles, "ROLE_ADMIN")
    checkRole = (roleList, value) => {
        console.log("roleList",roleList);
        let retb = false;
        for (var i = 0; i < roleList.length; i++) {
            if (roleList[i].authority == value) {
                retb = true;
                break;
            }
        }
        return retb;
    }

    render() {
        return(
            <div></div>
        )
    }
}
  
export default index;
