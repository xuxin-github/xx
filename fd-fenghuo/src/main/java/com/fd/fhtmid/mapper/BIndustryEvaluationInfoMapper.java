package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BIndustryEvaluationInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BIndustryEvaluationInfoMapper extends CrudMapper<BIndustryEvaluationInfo, String> {
    // 查询对应的行业评估内容.
    Map findContent(Map map);
    // 新增内容.
    int insertContent(Map map);
    // 修改内容.
    int updateContent(Map map);
}
