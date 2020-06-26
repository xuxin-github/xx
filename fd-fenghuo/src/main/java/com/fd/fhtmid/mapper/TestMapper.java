package com.fd.fhtmid.mapper;

import java.util.List;
import java.util.Map;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

public interface TestMapper extends CrudMapper<Object, Integer> {
	
	
	List selectByName();
	
	
}
