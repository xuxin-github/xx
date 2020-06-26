package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BMarketInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BMarketInfoMapper extends CrudMapper<BMarketInfo, String> {
    // 查询所有市场监管税法案例.
    List findAllMarket(Map map);
    // 获取指定市场监管税法案例.
    Map findMarketByName(Map map);
    // 新增市场监管违法案例.
    int insertMarket(Map map);
    // 修改市场监管违法案例.
    int updateMarket(Map map);
    // 修改市场监管违法案例发布状态.
    int updateStatus(Map map);

    // 查询所有发布的税市场监管违法案例.
    List findAllReleaseMarket(Map map);
}