package com.fd.fhtmid.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsUtils;

import com.fd.fhtmid.filter.JWTAuthenticationFilter;
import com.fd.fhtmid.filter.JWTLoginFilter;
import com.fd.fhtmid.security.CustomAuthenticationProvider;
import com.fd.fhtmid.security.UserDetailsServiceImpl;
import com.fd.fhtmid.utils.AuthUtil;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
	
    @Override
    protected void configure(HttpSecurity http) throws Exception {
    	System.out.println("WebSecurityConfig...");
    	http.cors().and().csrf().disable()
            .authorizeRequests()
            	.requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
	            .antMatchers( "/c/**").hasRole(AuthUtil.ROLE_P.replace("ROLE_", ""))
	            .antMatchers( "/p/**").hasRole(AuthUtil.ROLE_P.replace("ROLE_", ""))
            	
            	
                .antMatchers("/**").permitAll()
                
                
                .anyRequest().authenticated()              
                .and()
//                .formLogin()
//                
//                .permitAll()
//                .and()
                .addFilter(new JWTLoginFilter(authenticationManager()))
                //验证token
                .addFilter(new JWTAuthenticationFilter(authenticationManager()));
    }
    
    

    protected void configure(AuthenticationManagerBuilder auth) {
        
    	auth.authenticationProvider(new CustomAuthenticationProvider(userDetailsService,new BCryptPasswordEncoder())); 
    	//JWT TOKEN认证Provider
    }
}