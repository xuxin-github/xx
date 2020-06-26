package com.fd.fhtmid.security;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.fd.fhtmid.mapper.SecurityMapper;
import com.fd.fhtmid.utils.AuthUtil;


@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private SecurityMapper securityMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("loadUserByUsername  " + username);
        int tagIndex = username.lastIndexOf("|");
        String u = username.substring(0, tagIndex);
        String companyStr = username.substring(tagIndex + 1);

        String[] arr = companyStr.split("-");
        String company = arr[0];
        String corp = arr[1];

        System.out.println(u + "  u company " + company);


        Map param = new HashedMap();
        param.put("username", u);
        param.put("company_id", company);

        List<GrantedAuthorityImpl> ls = new ArrayList<GrantedAuthorityImpl>();
        ls.add(new GrantedAuthorityImpl(AuthUtil.ROLE_EMPTY));
        UserDetails ud = new User(username, "", ls);


        Map ms = securityMapper.getPUserByUser(param);

		if(ms == null) {
			ls.add(new GrantedAuthorityImpl(AuthUtil.NAME_NULL));
			System.out.println(AuthUtil.NAME_NULL);
			ud = new User(username, "", ls);
		}else {
			ls = new ArrayList<GrantedAuthorityImpl>();
			ls.add(new GrantedAuthorityImpl(AuthUtil.ROLE_P));
			ls.add(new GrantedAuthorityImpl("ROLE_"+ms.get("role_code").toString()));

			// 禁用用户.
			if (ms.get("is_disable").equals("1")) {
				ls.add(new GrantedAuthorityImpl(AuthUtil.DISABLE));
			}
			// PC端普通用户不能登录.
            if (ms.get("role_code").equals("COMMON") && corp.equals("p")) {
                ls.add(new GrantedAuthorityImpl(AuthUtil.COMMON));
                ls.add(new GrantedAuthorityImpl(corp));
            }

			ud = new User(ms.get("id").toString()+"|"+company+"-"+corp, ms.get("pwd").toString(), ls);
		}

        System.out.println("ud ==============" + ud);

        return ud;


    }

}
