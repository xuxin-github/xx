package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BRoleInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;


/**
 * @author ${param.author}
 */
public interface BRoleInfoMapper extends CrudMapper<BRoleInfo, String> {
    // 查询所有角色.
    List roleList();
}
