package com.fd.fhtmid.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebMvcConfigurer extends WebMvcConfigurerAdapter  {

    @Override  
    public void addCorsMappings(CorsRegistry registry) {  
        registry.addMapping("/**")
                .allowCredentials(true)  
                .allowedHeaders("*")
                .exposedHeaders("access-control-allow-headers",
                	"token",
                    "access-control-allow-methods",
                    "access-control-allow-origin",
                    "access-control-max-age",
                    "X-Frame-Options")
                .allowedOrigins("*")  
                .allowedMethods("*");  

    }  
}


