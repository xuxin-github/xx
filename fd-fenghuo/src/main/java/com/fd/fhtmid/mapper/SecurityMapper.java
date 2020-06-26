package com.fd.fhtmid.mapper;

import java.util.Map;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

public interface SecurityMapper extends CrudMapper<Object, String>{

	
	
	Map getPUserByUser(Map map);
	
	
	
}
