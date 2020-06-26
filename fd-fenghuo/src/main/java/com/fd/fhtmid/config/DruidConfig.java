package com.fd.fhtmid.config;

import javax.sql.DataSource;
import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**druid的springboot配置
 * @author changsichong
 *
 */
@Configuration
public class DruidConfig {
 
	@ConfigurationProperties(prefix = "spring.datasource")
	@Bean
	public DataSource druid() {
		return new DruidDataSource();
	}
 
	
}
