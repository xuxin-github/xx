package com.fd.fhtmid.filter;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fd.fhtmid.security.GrantedAuthorityImpl;
import com.fd.fhtmid.utils.AuthUtil;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JWTLoginFilter extends UsernamePasswordAuthenticationFilter {

	private static final Logger logger = LoggerFactory.getLogger(JWTLoginFilter.class);
	
    private AuthenticationManager authenticationManager;

    public JWTLoginFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }


    /**
     * 接收并解析用户登陆信息  /login,
     *为已验证的用户返回一个已填充的身份验证令牌，表示成功的身份验证
     *返回null，表明身份验证过程仍在进行中。在返回之前，实现应该执行完成该过程所需的任何额外工作。
     *如果身份验证过程失败，就抛出一个AuthenticationException
     *
     *
     * @param request  从中提取参数并执行身份验证
     * @param response 如果实现必须作为多级身份验证过程的一部分(比如OpenID)进行重定向，则可能需要响应
     * @return 身份验证的用户令牌，如果身份验证不完整，则为null。
     * @throws AuthenticationException
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

    	logger.debug("attemptAuthentication...");
        //得到用户登陆信息,并封装到 Authentication 中,供自定义用户组件使用.
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String company = request.getParameter("company")==null?"":request.getParameter("company");
        logger.debug("company auth: "+company);

        String corp = request.getParameter("corp") == null ? "" : request.getParameter("corp");


        if (username == null) {
            username = "";
        }
        username = username.trim();
        if (password == null) {
            password = "";
        }
        
       
        ArrayList<GrantedAuthorityImpl> authorities = new ArrayList<>();
             	
    	if(!company.isEmpty()) {
        	
    		username = username+"|"+company + "-" + corp;
        	
        }else {
        	
        	username = username+"|"+"-99";
        	
        }
        	    
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password, authorities);
        logger.debug(authenticationToken.toString());
        
        //authenticate()接受一个token参数,返回一个完全经过身份验证的对象，包括证书.
        // 这里并没有对用户名密码进行验证,而是使用 AuthenticationProvider 提供的 authenticate 方法返回一个完全经过身份验证的对象，包括证书.
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        
        logger.debug(authenticate.toString());
//UsernamePasswordAuthenticationToken 是 Authentication 的实现类
        return authenticate;
    }


    /**
     * 登陆成功后,此方法会被调用,因此我们可以在次方法中生成token,并返回给客户端
     *
     * @param request
     * @param response
     * @param chain
     * @param authResult
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) {
    	logger.debug("successfulAuthentication...");
    	logger.debug(authResult.getName());
    	
    	Map<String,Object> claims = new HashMap<String,Object>();
    	claims.put("auth",authResult.getAuthorities());

        String token = Jwts.builder()
        		.setClaims(claims)
                .setSubject(authResult.getName())
                //有效期24小时
                .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 24 * 1000))
                //采用什么算法是可以自己选择的，不一定非要采用HS512
                .signWith(SignatureAlgorithm.HS512, AuthUtil.SIGN_KEY)
                .compact();

        response.addHeader("token", "fdkey " + token);

    }
}
