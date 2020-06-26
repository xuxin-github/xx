package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BContractInfoMapper;
import com.fd.fhtmid.mapper.BProviderInfoMapper;
import com.fd.fhtmid.mapper.BRiskControlSetMapper;
import com.fd.fhtmid.service.ContractService;
import com.fd.fhtmid.service.SystemService;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/p/system")
public class SystemController extends BaseController {
    @Autowired
    private BRiskControlSetMapper riskControlSetMapper;

    @Autowired
    private BProviderInfoMapper providerInfoMapper;

    @Autowired
    private BContractInfoMapper contractInfoMapper;

    @Autowired
    private SystemService systemService;

    @Autowired
    private ContractService contractService;

    /**
     * 查询风控设置.
     *
     * @return 响应数据.
     */
    @RequestMapping(value = "/queryRiskControlSet", method = RequestMethod.POST)
    public ApiResult queryRiskControlSet(@RequestBody Map map) {
        Map query = riskControlSetMapper.query(map);
        if(query == null){
            return new ApiResult(1, "无内容", "");
        }else {
            return new ApiResult(0, "成功", query);
        }
    }

    /**
     * 更新.
     *
     * @param map 页面传来的参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/updateRiskControlSet", method = RequestMethod.POST)
    public ApiResult updateRiskControlSet(@RequestBody Map map) throws ParseException {
        Map<String, Object> map1 = new HashMap<String, Object>();
        // 获取公司id.
        String company_id = this.getColonCompanyId();
        // 获取用户id.
        String user_id = this.getColonyUserId();
        map1.put("company_no", company_id);
        map1.put("p1", map.get("p1"));
        map1.put("p2_1", map.get("p2_1"));
        map1.put("p2_2", map.get("p2_2"));
        map1.put("p2_3", map.get("p2_3"));
        map1.put("p2_4", map.get("p2_4"));
        map1.put("p3_1_1", 5);
        map1.put("p3_1_2", 5);
        map1.put("p3_1_3", 5);
        map1.put("p3_1_4", 5);
        map1.put("p3_1_5", 5);
        map1.put("p3_2_1", map.get("p3_2_1"));
        map1.put("p3_2_2", map.get("p3_2_2"));
        map1.put("p3_2_3", map.get("p3_2_3"));
        map1.put("p3_2_4", map.get("p3_2_4"));
        map1.put("p3_2_5", map.get("p3_2_5"));
        map1.put("p3_2_6", map.get("p3_2_6"));
        map1.put("p3_3_1", map.get("p3_3_1"));
        map1.put("p3_3_2", map.get("p3_3_2"));
        map1.put("p3_3_3", map.get("p3_3_3"));
        map1.put("p3_3_4", map.get("p3_3_4"));
        map1.put("p3_3_5", map.get("p3_3_5"));
        map1.put("p3_3_6", map.get("p3_3_6"));
        map1.put("p3_3_7", map.get("p3_3_7"));
        map1.put("p3_3_8", map.get("p3_3_8"));
        map1.put("p3_3_9", map.get("p3_3_9"));
        map1.put("p3_3_10", map.get("p3_3_10"));
        map1.put("p3_3_11", map.get("p3_3_11"));
        map1.put("p3_3_12", map.get("p3_3_12"));
        map1.put("p3_3_13", map.get("p3_3_13"));
        map1.put("p3_3_14", map.get("p3_3_14"));
        map1.put("p3_3_15", map.get("p3_3_15"));
        map1.put("p3_3_16", map.get("p3_3_16"));
        map1.put("p3_3_17", map.get("p3_3_17"));
        map1.put("p3_3_18", map.get("p3_3_18"));
        map1.put("p3_3_19", map.get("p3_3_19"));
        map1.put("p3_3_20", map.get("p3_3_20"));
        map1.put("p3_3_21", map.get("p3_3_21"));
        map1.put("p3_4_1", map.get("p3_4_1"));
        map1.put("p3_4_2", map.get("p3_4_2"));
        map1.put("p3_4_3", map.get("p3_4_3"));
        map1.put("p3_4_4", map.get("p3_4_4"));
        map1.put("p3_4_5", map.get("p3_4_5"));
        map1.put("p3_4_6", map.get("p3_4_6"));
        // 判断是否已存在数据.
        Map query = riskControlSetMapper.query(map1);
        int result = 0;
        if(query == null){
            map1.put("id", "1");
            map1.put("create_by", user_id);
            map1.put("create_time", new Date());
            result = riskControlSetMapper.insertRiskControlSet(map1);
        }else{
            map1.put("update_by", user_id);
            map1.put("update_time", new Date());
            result = riskControlSetMapper.updateRiskControlSet(map1);
        }
        if (result == 1) {
            // 更新供应商中的供应商评分, 需要传入供应商分值和供应商名称.
            List provider = providerInfoMapper.findAllProviderName();
            for (int i = 0; i < provider.size(); i++) {
                Map map3 = new HashMap();
                map3.put("company_name", ((Map) provider.get(i)).get("name"));
                map3.put("company_no", "1");
                // 得到对应的供应商评分.
                Double score = systemService.providerScore(map3);
                // 修改对应的供应商评分.
                map3.put("score", score);
                providerInfoMapper.updateProviderScore(map3);
                // 修改对应的企业信息更新时间.
                map3.put("ent_update_time", new Date());
                providerInfoMapper.updateCompanyTime(map3);
            }
            // 更新合同中的评分.
            // 获取合同名称和状态.
            List contract = contractInfoMapper.findAllContractName();
            for (int i = 0; i < contract.size(); i++) {
                String status = ((Map) contract.get(i)).get("status").toString();
                if (status.equals("01")) {
                    // 更新合同中的供应商评分, 需要传入供应商分值和合同名称, 并且要判断合同是否已经结束.
                    Map map2 = new HashMap();
                    map2.put("contract_name", ((Map) contract.get(i)).get("name"));
                    map2.put("contract_code", ((Map) contract.get(i)).get("contract_code"));
                    map2.put("company_no", "1");
                    // 获取合同名称对应的供应商.
                    Map contract_provider_score = contractInfoMapper.findContractNameAndProviderScore(map2);
                    String provider_name = contract_provider_score.get("provider_name") == null ? "" : contract_provider_score.get("provider_name").toString();
                    if(!provider_name.equals("")){
                        map2.put("company_name", provider_name);
                        // 得到对应的供应商评分.
                        Double providerScore = systemService.providerScore(map2);
                        // 修改对应的供应商评分.
                        map2.put("providerScore", providerScore);
                        map2.put("p3_4_1", contract_provider_score.get("p3_4_1"));
                        map2.put("p3_4_2", contract_provider_score.get("p3_4_2"));
                        map2.put("p3_4_3", contract_provider_score.get("p3_4_3"));
                        map2.put("p3_4_4", contract_provider_score.get("p3_4_4"));
                        map2.put("p3_4_5", contract_provider_score.get("p3_4_5"));
                        map2.put("p3_4_6", contract_provider_score.get("p3_4_6"));
                        contractInfoMapper.updateContractProviderScore(map2);
                    }else{
                        contractInfoMapper.updateContractProviderScoreNull(map2);
                    }

                    // 更新合同中的内部合规评分.
                    Double internalScore = systemService.internalScore(map2);
                    map2.put("internalScore", internalScore);
                    contractInfoMapper.updateContractInternalScore(map2);

                    // 更新合同中的市场监管评分.
                    map2.put("flag", "2");
                    Double marketScore = systemService.marketScore(map2);
                    map2.put("marketScore", marketScore);
                    contractInfoMapper.updateContractMarketScore(map2);

                    // 更新合同中的税务合规评分.
                    // 获取合同的税务合规评分.
                    Double taxScore = systemService.taxScore(map2);
                    map2.put("taxScore", taxScore);
//                    contractInfoMapper.updateContractTaxScore(map2);

                    // 更新合同的风险状态.
                    contractService.updateLevel(map2);
                }
            }
            return new ApiResult(0, "更新成功", result);
        } else {
            return new ApiResult(1, "更新失败", result);
        }
    }
}
