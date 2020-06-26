package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BContractInfo;
import com.gitee.fastmybatis.core.mapper.CrudMapper;
import java.util.Map;
import java.util.List;


/**
 * @author ${param.author}
 */
public interface BContractInfoMapper extends CrudMapper<BContractInfo, String> {

    // 获取所有的合同数据
    List selectListAll(Map map);
    // 获取某一合同数据
    Map getContractByName(Map map);
    // 获取对方联系数据
    String getContact(Map map);
    // 获取合同文件信息
    String getContractFiles(Map map);
    // 获取合同标签
    List getContractTag(Map map);
    // 获取业务发起相关信息及文档---邮件、短信或其他信息1
    String getContractLinkInfo(Map map);
    // 获取业务发起相关信息及文档---发起文档等材料
    String getContractDocs(Map map);
    // 获取业务完成信息及文档---邮件、短信或其他信息2
    String getContractBLinkInfo(Map map);
    // 获取业务完成信息及文档---完成文档等材料
    String getContractFDocs(Map map);
    // 真实交易记录材料---记账凭证记录
    String getContractFRecord(Map map);
    // 真实交易记录材料---银行流水记录
    String getContractBRecord(Map map);
    // 真实交易记录材料---交易账册记录
    String getContractSRecord(Map map);
    // 添加合同
    Integer  insertContract(Map map);
    // 合同变更
    Integer  changeContract(Map map);
    // 获取发票信息
    List queryInvoice(Map map);
    // 取消发票关联的合同
    Integer updateInvoice(Map map);
    // 合同编辑
    Integer updateContract(Map map);
    // 根据合同名称或编号查重.
    List findByNameOrCode(Map map);
    // 获取合同数据.
    Map findByName(Map map);
    // 获取合同名称和状态..
    List findAllContractName();
    // 获取合同名称对应的供应商评分.
    Map findContractNameAndProviderScore(Map map);
    // 修改合同中的评分.
    int updateContractTaxScore(Map map);
    int updateContractMarketScore(Map map);
    int updateContractInternalScore(Map map);
    int updateContractProviderScore(Map map);
    // 当合同下没有发票时, 修改供应商的评分未null.
    int updateContractProviderScoreNull(Map map);
    // 查询当前合同, 按发票分类进行分组.
    List findCatalogCount(Map map);
    // 根据合同代码查询.
    Map findContractByCode(Map map);

    // 修改合同分风险等级.
    int updateContractLevel(Map map);

    // 修改合同中的税务合规评分小项.
    int updateContractTax(Map map);
    // 修改合同中市场监管的评分小项.
    int updateContractMarket(Map map);
    // 修改合同中内部合规的评分小项.
    int updateContractInternal(Map map);

    // 修改合同中的扣分明细id.
    int updateComputeId(Map map);
    // 查询所有合同及对应的供应商名称.
    List findAllContract();
}
