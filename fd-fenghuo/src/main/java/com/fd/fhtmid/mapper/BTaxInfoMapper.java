package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BTaxInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BTaxInfoMapper extends CrudMapper<BTaxInfo, String> {
    // 查询所有税收违法案例.
    List findAllTax(Map map);
    // 获取指定税收违法案例.
    Map findTaxByName(Map map);
    // 新增税收违法案例.
    int insertTax(Map map);
    // 修改税收违法案例.
    int updateTax(Map map);
    // 修改税收违法案例发布状态.
    int updateStatus(Map map);

    // 查询所有发布的税收违法案例.
    List findAllReleaseTax(Map map);
}
