package com.fd.fhtmid.service.impl;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.mapper.BContractInfoMapper;
import com.fd.fhtmid.mapper.BProjectInfoMapper;
import com.fd.fhtmid.mapper.BRiskControlSetMapper;
import com.fd.fhtmid.service.ContractService;
import com.fd.fhtmid.service.SystemService;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ContractServiceImpl implements ContractService {

    @Autowired
    private BContractInfoMapper contractInfoMapper;

    @Autowired
    private BProjectInfoMapper providerInfoMapper;

    @Autowired
    private BRiskControlSetMapper riskControlSetMapper;

    @Autowired
    private SystemService systemService;

    @Override
    public ApiResult insert(Map map1) {
        // 判断传入的合同是否已存在.
        List contract = contractInfoMapper.findByNameOrCode(map1);
        // 存在, 则提醒合同名已存在; 不存在, 则新增.
        System.out.println("xxx"+map1);
        if (contract.size() == 0) {
            map1.put("status", "01");
            map1.put("risk_level", "02");
            map1.put("is_delete", "0");
            map1.put("b_link_info", "[]");
            map1.put("t_link_info", "[]");
            // 获取公司评分.
            map1.put("company_no", map1.get("company_id"));
            Map risk = riskControlSetMapper.query(map1);
            // 税务合规评分项得分.
            map1.put("p3_1_1", 4);
            map1.put("p3_1_2", 4);
            map1.put("p3_1_3", 4);
            map1.put("p3_1_4", 4);
            map1.put("p3_1_5", 3);
            map1.put("p3_1_6", 3);
            map1.put("p3_1_7", 3);
            // 市场监管评分项得分.
            map1.put("p3_2_1", risk.get("p3_2_1"));
            map1.put("p3_2_2", risk.get("p3_2_2"));
            map1.put("p3_2_3", risk.get("p3_2_3"));
            map1.put("p3_2_4", risk.get("p3_2_4"));
            map1.put("p3_2_5", risk.get("p3_2_5"));
            map1.put("p3_2_6", risk.get("p3_2_6"));
            // 内部合规评分项得分.
            map1.put("p3_3_1", 0);
            map1.put("p3_3_2", 0);
            map1.put("p3_3_3", 0);
            map1.put("p3_3_4", 0);
            map1.put("p3_3_5", 0);
            map1.put("p3_3_6", 0);
            map1.put("p3_3_7", 0);
            map1.put("p3_3_8", 0);
            map1.put("p3_3_9", 0);
            map1.put("p3_3_10", 0);
            map1.put("p3_3_11", 0);
            map1.put("p3_3_12", 0);
            map1.put("p3_3_13", 0);
            map1.put("p3_3_14", 0);
            map1.put("p3_3_15", 0);
            map1.put("p3_3_16", 0);
            map1.put("p3_3_17", 0);
            map1.put("p3_3_18", 0);
            map1.put("p3_3_19", 0);
            map1.put("p3_3_20", 0);
            map1.put("p3_3_21", 0);
            // 供应商评分项得分.
            map1.put("p3_4_1", 0);
            map1.put("p3_4_2", 0);
            map1.put("p3_4_3", 0);
            map1.put("p3_4_4", 0);
            map1.put("p3_4_5", 0);
            map1.put("p3_4_6", 0);
            // 传入uuid.
            map1.put("contract_id", UUIDUtils.getUUID());
            // 添加创建时间.
            map1.put("create_time", new Date());
            // 得到数据库内容, 封装后, 返回页面.
            Integer result = null;
            if (map1.get("project_id") != null) {
                result = providerInfoMapper.insertProjectContract(map1);
            } else {
                result = contractInfoMapper.insertContract(map1);
            }
            // 判断新增是否成功.
            if (result == 1) {
                // 计算内部合规评分.
                Map map = new HashMap();
                map.put("contract_name", map1.get("contract_name"));
                map.put("contract_code", map1.get("contract_code"));
                map.put("company_no", map1.get("company_id"));
                Double internalScore = systemService.internalScore(map);
                map.put("internalScore", internalScore);
                contractInfoMapper.updateContractInternalScore(map);
                // 计算市场监管评分.
                map.put("flag", "1");
                Double marketScore = systemService.marketScore(map);
                map.put("marketScore", marketScore);
                contractInfoMapper.updateContractMarketScore(map);
                // 计算合同中的税务合规评分.
                Double taxScore = systemService.taxScore(map);
                map.put("taxScore", taxScore);
                contractInfoMapper.updateContractTaxScore(map);
                // 默认供应商评分为0.
                contractInfoMapper.updateContractProviderScoreNull(map);
                // 修改合同的风险等级.
                updateLevel(map);
                return new ApiResult(0, "新增成功", result);
            } else {
                return new ApiResult(1, "新增失败", result);
            }
        } else {
            return new ApiResult(2, "合同编号或合同名称已存在！", "");
        }
    }

    @Override
    public int updateLevel(Map map) {
        // 传入公司id查询风控数值.
        Map score = riskControlSetMapper.query(map);
        Double p1 = Double.parseDouble(score.get("p1").toString());
        Double p2_1 = Double.parseDouble(score.get("p2_1").toString());
        Double p2_2 = Double.parseDouble(score.get("p2_2").toString());
        Double p2_3 = Double.parseDouble(score.get("p2_3").toString());
        Double p2_4 = Double.parseDouble(score.get("p2_4").toString());
        // 传入合同名称查询合同.
        Map contract = contractInfoMapper.findByName(map);
        Double providerScore = contract.get("p2_4") == null ? 0 : Double.parseDouble(contract.get("p2_4").toString());
        Double internalScore = Double.parseDouble(contract.get("p2_3")== null ? "0" :contract.get("p2_3").toString());
        Double marketScore = Double.parseDouble(contract.get("p2_2")== null ? "0" :contract.get("p2_2").toString());
        Double taxScore = Double.parseDouble(contract.get("p2_1")== null ? "0" :contract.get("p2_1").toString());
        // 获取合同名称对应的供应商.
        Map contract_provider_score = contractInfoMapper.findContractNameAndProviderScore(map);
        String is_legal = contract_provider_score.get("is_legal") == null ? "" : contract_provider_score.get("is_legal").toString();
        Double total = providerScore + internalScore + marketScore + taxScore;
        if (!is_legal.equals("")) {
            if (total <= p1 || taxScore <= p2_1 || marketScore <= p2_2 || internalScore <= p2_3 || providerScore <= p2_4 || is_legal.equals("1")) {
                // 修改合同为高风险.
                map.put("risk_level", "02");
                return contractInfoMapper.updateContractLevel(map);
            } else {
                // 修改合同为正常.
                map.put("risk_level", "01");
                return contractInfoMapper.updateContractLevel(map);
            }
        }else{
            if (total <= p1 || taxScore <= p2_1 || marketScore <= p2_2 || internalScore <= p2_3 || providerScore <= p2_4) {
                // 修改合同为高风险.
                map.put("risk_level", "02");
                return contractInfoMapper.updateContractLevel(map);
            } else {
                // 修改合同为正常.
                map.put("risk_level", "01");
                return contractInfoMapper.updateContractLevel(map);
            }
        }
    }
}
