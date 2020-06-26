package com.fd.fhtmid.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fd.fhtmid.mapper.BUserInfoMapper;
import com.fd.fhtmid.service.UserService;
import com.fd.fhtmid.utils.SpringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.fd.fhtmid.security.GrantedAuthorityImpl;
import com.fd.fhtmid.utils.AuthUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * token校验
 *
 **/
public class JWTAuthenticationFilter extends BasicAuthenticationFilter {
    // Filter不能注入
    private UserService userService = SpringUtils.getBean("userServiceImpl");

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }


    /**
     * 在此方法中检验客户端请求头中的token,
     * 如果存在并合法,就把token中的信息封装到 Authentication 类型的对象中,
     * 最后使用  SecurityContextHolder.getContext().setAuthentication(authentication); 改变或删除当前已经验证的 pricipal
     *
     * @param request
     * @param response
     * @param chain
     * @throws IOException
     * @throws ServletException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
    	System.out.println("doFilterInternal...");
        String token = request.getHeader("token");

        //判断是否有token
        if (token == null || !token.startsWith("fdkey ")) {
        	System.out.println("startsWith fdkey...");
        	
        	ArrayList<GrantedAuthority> authorities = new ArrayList<>();
			authorities.add(new GrantedAuthorityImpl(AuthUtil.ROLE_EMPTY));
			SecurityContextHolder.getContext()
					.setAuthentication(new UsernamePasswordAuthenticationToken("", null, authorities));

			Map<String, Object> claims = new HashMap<String, Object>();
			claims.put("auth", authorities); 
        	//暂时默认
//        	ArrayList<GrantedAuthority> authorities = new ArrayList<>();
//            authorities.add(new GrantedAuthorityImpl(AuthUtil.ROLE_EMPTY));
//            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("1|1", true, authorities));
//        	
//        	
//            Map<String,Object> claims = new HashMap<String,Object>();
//        	claims.put("auth",authorities);
        	
            String tk = Jwts.builder()
            		.setClaims(claims)
                    .setSubject("")
                    //有效期两小时
                    .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 24 * 1000))
                    //采用什么算法是可以自己选择的，不一定非要采用HS512
                    .signWith(SignatureAlgorithm.HS512, "MyJwtSecretMyJwtSecretMyJwtSecretMyJwtSecretMyJwtSecretMyJwtSecretMyJwtSecretMyJwtSecretMyJwtSecretMyJwtSecret")
                    .compact();
            response.addHeader("token", "fdkey " + token);
            
            chain.doFilter(request, response);
            return;
        }

        try {
            UsernamePasswordAuthenticationToken authenticationToken = getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }catch (Exception e){
            response.setStatus(401);
        }

        // 判断用户是否被禁用.
        String str = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        String[] tag = str.split("\\|");
        String userId = tag[0];
        String com = tag[1];
        String[] cpStr = com.split("-");
        Map map = new HashMap();
        map.put("id", userId);
        Map user = userService.getPersonnelById(map);
        if (user.get("is_disable").equals("1")) {
            response.setStatus(777);
        }
        // PC端普通用户不能登录.
        if (user.get("role_code").equals("COMMON") && cpStr[1].equals("p")) {
            response.setStatus(778);
        }

        //放行
        chain.doFilter(request, response);


    }

    /**
     * 解析token中的信息,并判断是否过期
     */
    private UsernamePasswordAuthenticationToken getAuthentication(String token) {

    	System.out.println("getAuthentication...");
        Claims claims = Jwts.parser().setSigningKey(AuthUtil.SIGN_KEY)
                .parseClaimsJws(token.replace("fdkey ", ""))
                .getBody();
        
        System.out.println("claims..."+claims);
        //得到用户名
        String username = claims.getSubject();

        //得到过期时间
        Date expiration = claims.getExpiration();

        //判断是否过期
        Date now = new Date();

        if (now.getTime() > expiration.getTime()) {

            throw new RuntimeException("该账号已过期,请重新登陆");
        }


        if (username == null) {
        	
        	ArrayList<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new GrantedAuthorityImpl(AuthUtil.ROLE_EMPTY));
            return new UsernamePasswordAuthenticationToken("", true, authorities);
        	
        }else {
        	
        	List<GrantedAuthority> authorities = new ArrayList<>();
        	List<Map> lm = (List<Map>)claims.get("auth");
        	
        	for (Map authMap : lm) {
        		   	
        		authorities.add(new GrantedAuthorityImpl(authMap.get("authority").toString())); 

			}
        	System.out.println("getAuthentication...authorities " + authorities);
        	return new UsernamePasswordAuthenticationToken(username, true, authorities);
        }
        
    }

}
