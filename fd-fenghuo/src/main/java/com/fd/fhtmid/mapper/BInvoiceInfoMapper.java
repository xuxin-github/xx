package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BInvoiceInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BInvoiceInfoMapper extends CrudMapper<BInvoiceInfo, String> {
    // 获取所有的发票数据
    List selectListAll(Map map);
    // 获取某一发票数据
    Map getInvoiceByNo(Map map);
    // 获取货物或应税劳务、服务名称信息
    String getServices(Map map);

    // 添加
    Integer insertContract(Map map);
    // 合同变更
    Integer changeContract(Map map);
    // 获取发票信息
    List queryInvoice(Map map);
    // 取消发票关联的合同
    Integer updateInvoice(Map map);
    // 合同编辑
    Integer updateContract(Map map);

    // 判断销方名称与该合同供应商是否一致.
    Map findByContractId(Map map);
    // 新增时查重.
    Map findByNoAndCode(Map map);
    // 新增发票.
    int insertInvoice(Map map);
    // 新增时关联合同的下拉选项.
    List findAllContractName(Map map);
    // 新增时可关联合同的列表
    List findAllContract(Map map);
    // 新增时直接关联合同.
    int updateInvoiceContractId(Map map);
    // 根据所得参数查看数据库中是否存在
    List findOneInvoice(Map map);
    // 根据合同编号获取供应商.
    Map findContractCodeAndProviderScore(Map map);
    // 将发票的销方名称带入合同的供应方(销方)名称.
    int updateContractSeller(Map map);
    // 修改发票的发票分类.
    int updateInvoiceCatalog(Map map);

    // 获取合同下的发票数量.
    Map findInvoiceCount(Map map);

    // 获取高风险发票来源(lq).
    List findHighRiskInvoice(Map map);
    // 获取进项票据统计(lq).
    Map findAddInvoiceCount(Map map);
    
    List<Map> invoiceFinishCount(Map map);
    
    List<Map> invoiceUnFinishCount(Map map);
    
    // 查询所有票据及对应的合同名称.
    List findAllInvoice();

    // 根据code查找报销信息
    Map getBaoXiaoCode(Map map);


    // 删除发票(取消关联).
    int cancelConnectInvoice(Map map);
    // 关联(修改发票的contract_id, type, audit_status).
    int updateInvoiceConnect(Map map);

    // 查询所有发票.
    List invoiceTotalList(Map map);
    // 权限控制下的新增关联合同的下拉列表.
    List invoiceAddContractList(Map map);
}
