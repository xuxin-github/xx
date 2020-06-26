package com.fd.fhtmid;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication()
@EnableAsync //开启异步调用
public class MainApplication {
	
	
	public static void main(String[] args) {
		
		
		
		SpringApplication.run(MainApplication.class, args);
		
	}
	
}
