package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BContractTagInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BContractTagInfoMapper extends CrudMapper<BContractTagInfo, String> {
    // 查询所有合同标签.
    List contractTagList();
    // 获取指定合同标签.
    Map getContractTagByName(Map map);
    // 根据编号查询.
    Map getContractTagByCode(Map map);
    // 新增合同标签.
    int insertContractTag(Map map);
    // 修改合同标签.
    int updateContractTag(Map map);
}
