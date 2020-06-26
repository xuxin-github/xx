package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BRiskControlSet;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BRiskControlSetMapper extends CrudMapper<BRiskControlSet, String> {
    // 获取风控设置数据.
    Map query(Map map);
    // 新增风控设置数据.
    int insertRiskControlSet(Map map);
    // 更新风控设置数据.
    int updateRiskControlSet(Map map);

    // 合同计算明细.
    int insertCompute(Map map);
    // 获取企业名称.
    Map getCompanyName(Map map);
    // 在每张合同下, 以发票的购方名称进行分组.
    List findArrCount(Map map);
    // 获取每张合同的下的发票供应商, 以发票的销方名称进行分组.
    Map findSeller(Map map);
    // 获取合同金额和发票金额.
    List findMoney(Map map);
    // 获取合同金额和总的发票金额.
    Map findTotalMoney(Map map);
    // 获取货物或应税劳务、服务名称和发票分类.
    List findCatalog(Map map);
    // 获取股东和业务信息.
    Map findStockholder(Map map);
    // 获取合同下的发票services信息.
    List findServices(Map map);

    // 获取指定合同编号的扣分明细.
    Map findComputeByContractCode(Map map);
    // 修改扣分明细.
    int updateCompute(Map map);
}
