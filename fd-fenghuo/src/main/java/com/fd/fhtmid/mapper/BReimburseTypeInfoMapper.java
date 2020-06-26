package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BReimburseTypeInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BReimburseTypeInfoMapper extends CrudMapper<BReimburseTypeInfo, String> {
    // 查询所有报销类别.
    List reimburseTypeList();
    // 获取指定报销类别.
    Map getReimburseTypeByName(Map map);
    // 根据编号查询.
    Map getReimburseTypeByCode(Map map);
    // 新增报销类别.
    int insertReimburseType(Map map);
    // 修改报销类别.
    int updateReimburseType(Map map);
}
