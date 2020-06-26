package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BProviderInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BProviderInfoMapper extends CrudMapper<BProviderInfo, String> {
    // 获取所有供应商.
    List findProvider(Map map);
    // 获取指定供应商.
    Map getProviderByName(Map map);
    // 获取受惩黑名单.
    String getXzhmd(Map map);
    // 获取执行公告.
    String getZxgg(Map map);
    // 获取失信公告.
    String getShixin(Map map);
    // 获取曝光台.
    String getBgt(Map map);

    // 修改供应商状态.
    int updateProvider(Map map);
    // 新增供应商.
    int insertProvider(Map map);
    // 更新供应商评分.
    int updateProviderScore(Map map);
    // 获取所用供应商名称.
    List findAllProviderName();
    // 修改对应的企业信息更新时间.
    int updateCompanyTime(Map map);
    // 根据供应商名称查询合同.
    List findByCompanyTOContract(Map map);

    // 修改供应商中的供应商评分小项.
    int updateProviderSingleScore(Map map);

    // 查询所有供应商.
    List findAllProvider();
}
