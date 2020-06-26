package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BProjectTagInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BProjectTagInfoMapper extends CrudMapper<BProjectTagInfo, String> {
    // 查询所有项目标签.
    List projectTagList();
    // 获取指定项目标签.
    Map getProjectTagByName(Map map);
    // 根据编号查询.
    Map getProjectTagByCode(Map map);
    // 新增项目标签.
    int insertProjectTag(Map map);
    // 修改项目标签.
    int updateProjectTag(Map map);
}
