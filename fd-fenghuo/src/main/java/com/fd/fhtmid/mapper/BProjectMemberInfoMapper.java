package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BProjectMemberInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BProjectMemberInfoMapper extends CrudMapper<BProjectMemberInfo, String> {
    // 查询对应项目的项目成员.
    List projectMemberList(Map map);
    // 获取指定信息.
    Map getProjectMember(Map map);
    // 新增项目成员.
    int insertProjectMember(Map map);
    // 删除项目成员.
    int deleteProjectMember(Map map);
}
