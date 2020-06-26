package com.fd.fhtmid.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fd.fhtmid.mapper.BContractInfoMapper;
import com.fd.fhtmid.mapper.BProviderInfoMapper;
import com.fd.fhtmid.mapper.BRiskControlSetMapper;
import com.fd.fhtmid.service.SystemService;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Transactional
public class SystemServiceImpl implements SystemService {
    @Autowired
    private BRiskControlSetMapper riskControlSetMapper;

    @Autowired
    private BProviderInfoMapper providerInfoMapper;

    @Autowired
    private BContractInfoMapper contractInfoMapper;

    @Override
    public Double taxScore(Map map) {
        // 在发票变更, 合同编辑时调用.
        // 传入公司id查询风控数值(company_no).
        Map score = riskControlSetMapper.query(map);
        // 税务合规评分.
        Double total = Double.parseDouble(score.get("p3_1_1").toString()) + Double.parseDouble(score.get("p3_1_2").toString()) + Double.parseDouble(score.get("p3_1_3").toString())
                + Double.parseDouble(score.get("p3_1_4").toString()) + Double.parseDouble(score.get("p3_1_5").toString());
        // 扣分细则.
        StringBuilder stringBuilder = new StringBuilder();
        // 修改合同中税务合规评分小项.
        Map contract_tax = new HashMap();

        // 将股东的名单与内部风控风险-内部审核中的业务主办人、业务主管、财务审核和业务审核人比对, 如果出现至少一个相同, 则扣分.
        // 发票新增和合同内部风控保存时扣分.
        // 传入合同名称(contract_name).
        Map stockholder = riskControlSetMapper.findStockholder(map);
        String sponsor = stockholder.get("sponsor") == null ? "" : stockholder.get("sponsor").toString();
        String leader = stockholder.get("leader") == null ? "" : stockholder.get("leader").toString();
        String f_auditor = stockholder.get("f_auditor") == null ? "" : stockholder.get("f_auditor").toString();
        String b_auditor = stockholder.get("b_auditor") == null ? "" : stockholder.get("b_auditor").toString();
        String stockholderStr = stockholder.get("stockholder") == null ? "" : stockholder.get("stockholder").toString();
        JSONArray stockholderArr = JSONArray.parseArray(stockholderStr);
        contract_tax.put("p3_1_1", 4);
        if (stockholderArr != null) {
            for (int i = 0; i < stockholderArr.size(); i++) {
                String shaname = ((Map) stockholderArr.get(i)).get("SHANAME").toString();
                if (shaname.equals(sponsor) || shaname.equals(leader) || shaname.equals(f_auditor) || shaname.equals(b_auditor)) {
                    total -= 4D;
                    contract_tax.put("p3_1_1", 0);
                    stringBuilder.append("股东的名单与合同中的业务主办人、业务主管、财务审核和业务审核人至少一个相同");
                }
            }
        }

        // 比对当前账号对应的企业名称与合同中发票(多张)的购方名称是否一致, 如果至少有一张不一致则进行扣分, 如果一致, 则无需扣分.
        // 每次新增发票和变更发票时, 把购买方的名称与当前账号的企业名称进行比较, 不同则扣分, 且只扣一次.
        // 在每张合同下, 以发票的购方名称进行分组, 数组=1不扣分(判断与账号的企业名称是否一致, 一致则不扣分, 反之扣分), 数组>1则扣分.
        // 传入合同名称.
        List buyerCount = riskControlSetMapper.findArrCount(map);
        Map company = riskControlSetMapper.getCompanyName(map);
        if (buyerCount.size() > 1) {
            total -= 4D;
            contract_tax.put("p3_1_2", 0);
            stringBuilder.append("，");
            stringBuilder.append("合同中发票(多张)的购方名称不一致");
        } else if (buyerCount.size() == 1 && !company.get("name").equals(((Map) (buyerCount.get(0))).get("b_name"))) {
            String contract_id = ((Map) (buyerCount.get(0))).get("contract_id") == null ? "" : ((Map) (buyerCount.get(0))).get("contract_id").toString();
            if (!contract_id.equals("")) {
                total -= 4D;
                contract_tax.put("p3_1_2", 0);
                stringBuilder.append("，");
                stringBuilder.append("当前账号对应的企业名称与合同中发票的购方名称不一致");
            } else {
                contract_tax.put("p3_1_2", 4);
            }
        } else {
            contract_tax.put("p3_1_2", 4);
        }

        // 比对合同中内部风控风险-合同相关的供应商企业名称与合同中发票(多张)的销方名称是否一致, 如果至少有一张不一致则进行扣分, 如果一致, 则无需扣分.
        // 因为一个合同对应一个供应商, 所以, 一个合同中的发票的销方名称是一致的.
        // 因此, 判断合同中内部风控风险-合同相关的供应商企业名称为空(手动输入), 或者与发票中的销方名称不一致, 则扣分.
        // 新增发票、变更发票以及合同内部风控保存时调用.
        // 传入合同名称.
        Map seller = riskControlSetMapper.findSeller(map);
        String sell_name = seller.get("sell_name") == null ? "" : seller.get("sell_name").toString();
        String s_name = seller.get("s_name") == null ? "" : seller.get("s_name").toString();
        String contract_id = seller.get("contract_id") == null ? "" : seller.get("contract_id").toString();
        if (!contract_id.equals("") && !s_name.equals("") && !sell_name.equals(s_name)) {
            total -= 4D;
            contract_tax.put("p3_1_3", 0);
            stringBuilder.append("，");
            stringBuilder.append("合同中发票(多张)的销方名称与合同相关的供应商企业名称不一致");
        } else {
            contract_tax.put("p3_1_3", 4);
        }

        // 比对合同每一张发票的开票金额是否小于合同中内部风控风险-合同相关的合同金额, 如果小于, 则不扣分, 如果大于等于, 则进行扣分.
        // 新增发票、变更发票以及合同内部风控保存时调用.
        // 传入合同名称.
        List money = riskControlSetMapper.findMoney(map);
        for (int i = 0; i < money.size(); i++) {
            Double total_amount = ((Map) (money.get(i))).get("total_amount") == null ? 0D : Double.parseDouble(((Map) (money.get(i))).get("total_amount").toString());
            Double price_amount = ((Map) (money.get(i))).get("price_amount") == null ? 0D : Double.parseDouble(((Map) (money.get(i))).get("price_amount").toString());
            String money_id = ((Map) (money.get(i))).get("contract_id") == null ? "" : ((Map) (money.get(i))).get("contract_id").toString();
            if (!money_id.equals("") && total_amount <= price_amount) {
                total -= 4D;
                contract_tax.put("p3_1_4", 0);
                stringBuilder.append("，");
                stringBuilder.append("发票的开票金额大于等于合同中的合同金额");
                break;
            } else {
                contract_tax.put("p3_1_4", 4);
                break;
            }
        }

        // 比对整个合同的开票总金额是否小于合同中内部风控风险-合同相关的合同金额, 如果小于, 则不扣分, 如果大于等于, 则进行扣分.
        // 新增发票、变更发票以及合同内部风控保存时调用.
        // 传入合同名称.
        Map totalMoney = riskControlSetMapper.findTotalMoney(map);
        Double total_amount = totalMoney.get("total_amount") == null ? 0D : Double.parseDouble(totalMoney.get("total_amount").toString());
        Double total_invoice = totalMoney.get("total") == null ? 0D : Double.parseDouble(totalMoney.get("total").toString());
        String total_id = totalMoney.get("contract_id") == null ? "" : totalMoney.get("contract_id").toString();
        if (!total_id.equals("") && total_amount <= total_invoice) {
            total -= 3D;
            contract_tax.put("p3_1_5", 0);
            stringBuilder.append("，");
            stringBuilder.append("发票的开票总金额大于等于合同中的合同金额");
        } else {
            contract_tax.put("p3_1_5", 3);
        }

        // 比对合同关联发票的发票类别, 如果其中至少一张与内部风控风险-合同相关的货物或应税劳务、服务名称选中的类别不一致, 则进行扣分, 如果一致, 则不进行扣分.
        // 新增发票、变更发票以及合同内部风控保存时调用.
        // 传入合同名称.
        List catalog = riskControlSetMapper.findCatalog(map);
        for (int i = 0; i < catalog.size(); i++) {
            String service = ((Map) (catalog.get(i))).get("service_name") == null ? "" : ((Map) (catalog.get(i))).get("service_name").toString();
            String invoiceCtalog = ((Map) (catalog.get(i))).get("invoice_catalog") == null ? "" : ((Map) (catalog.get(i))).get("invoice_catalog").toString();
            String id = ((Map) (catalog.get(i))).get("contract_id") == null ? "" : ((Map) (catalog.get(i))).get("contract_id").toString();
            if (!id.equals("") && !service.equals(invoiceCtalog)) {
                total -= 3D;
                contract_tax.put("p3_1_6", 0);
                stringBuilder.append("，");
                stringBuilder.append("合同中的货物或应税劳务、服务名称选中的值与发票分类不一致");
                break;
            } else {
                contract_tax.put("p3_1_6", 3);
                break;
            }
        }

        // 查询合同中发票类别是否有居民日常服务和娱乐服务两种类别的发票, 如果有, 则进行扣分, 如果没有, 则不进行扣分.
        // 查找合同下的发票, 如果services中的两个*号之间的服务名称与上面两种一致, 则扣分.
        // 传入合同名称.
        List services = riskControlSetMapper.findServices(map);
        for(int i = 0; i < services.size(); i++){
            String serviceStr = ((Map)services.get(i)).get("services") == null ? "" : ((Map)services.get(i)).get("services").toString();
            JSONArray service = JSONArray.parseArray(serviceStr);
            if (service != null) {
                String name = ((Map) service.get(0)).get("name").toString();
                String str = name.substring(1, name.lastIndexOf("*"));
                if ("居民日常服务".equals(str) || "娱乐服务".equals(str)) {
                    total -= 3D;
                    contract_tax.put("p3_1_7", 0);
                    stringBuilder.append("，");
                    stringBuilder.append("存在居民日常服务和娱乐服务两种类别的发票");
                    stringBuilder.append("。");
                    break;
                } else {
                    contract_tax.put("p3_1_7", 3);
                }
            } else {
                contract_tax.put("p3_1_7", 3);
            }
        }
        // 修改合同中的税务合规评分小项.
        contract_tax.put("contract_name", map.get("contract_name"));
        contractInfoMapper.updateContractTax(contract_tax);
        Map map1 = new HashMap();
        map1.put("taxDetail", stringBuilder.toString());
        String contract_code = map.get("contract_code") == null ? "" : map.get("contract_code").toString();
        if(!contract_code.equals("")){
            map1.put("contract_code", map.get("contract_code"));
            computeVersion(map1);
        }
        return total;
    }

    @Override
    public Double marketScore(Map map) {
        // 只有添加该合同第一次出现的发票分类的发票才会扣分(数量=1).
        // 变更发票关联时, 也需要调用新增时的方法(未做).
        // 直接关联发票和创建合同关联发票(因为要新增合同, 所以不用在此方法中调用)都需要调用新增时的方法.
        // 新增合同时, 也需要调用新增时的方法.
        // 更新时, 所有存在的发票类型都要更新(数量>=1).
        // 传入一个判断变量.

        // 传入合同编号, 查询当前合同, 按发票分类进行分组, 如果数量=1, 则扣分, 否则不扣分.
        List contract = contractInfoMapper.findCatalogCount(map);
        // 传入公司id查询风控数值.
        Map score = riskControlSetMapper.query(map);
        // 市场监管评分.
        Double total = Double.parseDouble(score.get("p3_2_1").toString()) + Double.parseDouble(score.get("p3_2_2").toString()) + Double.parseDouble(score.get("p3_2_3").toString())
                + Double.parseDouble(score.get("p3_2_4").toString()) + Double.parseDouble(score.get("p3_2_5").toString()) + Double.parseDouble(score.get("p3_2_6").toString());
        // 扣分细则.
        StringBuilder stringBuilder = new StringBuilder();
        // 获取市场监管评分的每一个得分项.
        Map contract_market = new HashMap();
        // 如果合同下面没有发票, 则为满分.
        if(contract.size() == 0){
            contract_market.put("p3_2_1", score.get("p3_2_1"));
            contract_market.put("p3_2_2", score.get("p3_2_2"));
            contract_market.put("p3_2_3", score.get("p3_2_3"));
            contract_market.put("p3_2_4", score.get("p3_2_4"));
            contract_market.put("p3_2_5", score.get("p3_2_5"));
            contract_market.put("p3_2_6", score.get("p3_2_6"));
        }else {
            for (int i = 0; i < contract.size(); i++) {
                // 新增时.
                if (map.get("flag").equals("1")) {
                    // 管理发票类.
                    if (((Map) contract.get(i)).get("invoice_catalog").toString().equals("01") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) == 1) {
                        total -= Double.parseDouble(score.get("p3_2_1").toString());
                        contract_market.put("p3_2_1", 0);
                        stringBuilder.append("存在管理发票类");
                    } else {
                        contract_market.put("p3_2_1", score.get("p3_2_1"));
                    }
                    // 咨询发票类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("02") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) == 1) {
                        total -= Double.parseDouble(score.get("p3_2_2").toString());
                        contract_market.put("p3_2_2", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在咨询发票类");
                    } else {
                        contract_market.put("p3_2_2", score.get("p3_2_2"));
                    }
                    // 会议发票类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("03") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) == 1) {
                        total -= Double.parseDouble(score.get("p3_2_3").toString());
                        contract_market.put("p3_2_3", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在会议发票类");
                    } else {
                        contract_market.put("p3_2_3", score.get("p3_2_3"));
                    }
                    // 培训发票类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("04") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) == 1) {
                        total -= Double.parseDouble(score.get("p3_2_4").toString());
                        contract_market.put("p3_2_4", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在培训发票类");
                    } else {
                        contract_market.put("p3_2_4", score.get("p3_2_4"));
                    }
                    // 旅游费用类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("05") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) == 1) {
                        total -= Double.parseDouble(score.get("p3_2_5").toString());
                        contract_market.put("p3_2_5", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在旅游费用类");
                        System.out.println("存在旅游费用类");
                    } else {
                        contract_market.put("p3_2_5", score.get("p3_2_5"));
                    }
                    // 手续费类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("06") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) == 1) {
                        total -= Double.parseDouble(score.get("p3_2_6").toString());
                        contract_market.put("p3_2_6", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在手续费类");
                        stringBuilder.append("。");
                    } else {
                        contract_market.put("p3_2_6", score.get("p3_2_6"));
                    }
                } else if (map.get("flag").equals("2")) {
                    // 管理发票类.
                    if (((Map) contract.get(i)).get("invoice_catalog").toString().equals("01") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) >= 1) {
                        total -= Double.parseDouble(score.get("p3_2_1").toString());
                        contract_market.put("p3_2_1", 0);
                        stringBuilder.append("存在管理发票类");
                    } else {
                        contract_market.put("p3_2_1", score.get("p3_2_1"));
                    }
                    // 咨询发票类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("02") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) >= 1) {
                        total -= Double.parseDouble(score.get("p3_2_2").toString());
                        contract_market.put("p3_2_2", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在咨询发票类");
                    } else {
                        contract_market.put("p3_2_2", score.get("p3_2_2"));
                    }
                    // 会议发票类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("03") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) >= 1) {
                        total -= Double.parseDouble(score.get("p3_2_3").toString());
                        contract_market.put("p3_2_3", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在会议发票类");
                    } else {
                        contract_market.put("p3_2_3", score.get("p3_2_3"));
                    }
                    // 培训发票类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("04") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) >= 1) {
                        total -= Double.parseDouble(score.get("p3_2_4").toString());
                        contract_market.put("p3_2_4", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在培训发票类");
                    } else {
                        contract_market.put("p3_2_4", score.get("p3_2_4"));
                    }
                    // 旅游费用类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("05") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) >= 1) {
                        total -= Double.parseDouble(score.get("p3_2_5").toString());
                        contract_market.put("p3_2_5", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在旅游费用类");
                    } else {
                        contract_market.put("p3_2_5", score.get("p3_2_5"));
                    }
                    // 手续费类.
                    if (((Map) contract.get(i)).get("invoice_catalog").equals("06") && Integer.parseInt(((Map) contract.get(i)).get("count").toString()) >= 1) {
                        total -= Double.parseDouble(score.get("p3_2_6").toString());
                        contract_market.put("p3_2_6", 0);
                        stringBuilder.append("，");
                        stringBuilder.append("存在手续费类");
                        stringBuilder.append("。");
                    } else {
                        contract_market.put("p3_2_6", score.get("p3_2_6"));
                    }
                }
            }
        }
        // 修改合同中的市场监管评分小项.
        contract_market.put("contract_code", map.get("contract_code"));
        contractInfoMapper.updateContractMarket(contract_market);
        Map map1 = new HashMap();
        map1.put("marketDetail", stringBuilder.toString());
        String contract_code = map.get("contract_code") == null ? "" : map.get("contract_code").toString();
        if(!contract_code.equals("")){
            map1.put("contract_code", contract_code);
            computeVersion(map1);
        }
        return total;
    }

    @Override
    public Double internalScore(Map map) {
        // 生成合同时, 以下字段全部默认为空, 并且调用此方法.
        // 在合同编辑保存后, 会重新计算.
        // 风控数值更新时, 判断合同是否已经结束, 再重新计算.

        // 如果合同中这些字段为空, 则判定为扣分.
        // 需要传入合同名称, 查询合同信息.
        Map contract = contractInfoMapper.findByName(map);
        // 还需传入当前登录公司的id, 以便查询风控数值.
        Map score = riskControlSetMapper.query(map);
        // 内部合规评分.
        Double total = 0D;
        // 扣分细则.
        StringBuilder stringBuilder = new StringBuilder();
        // 获取内部合规评分的每一个得分项.
        Map contract_internal = new HashMap();
        // 合同未上传.
        String contract_1_1 = contract.get("files") == null ? "" : contract.get("files").toString();
        if (!contract_1_1.equals("")) {
            JSONArray arr = JSONObject.parseArray(contract_1_1);
            if (!arr.isEmpty()) {
                total += Double.parseDouble(score.get("p3_3_1").toString());
                contract_internal.put("p3_3_1", score.get("p3_3_1"));
            } else {
                contract_internal.put("p3_3_1", 0);
            }
        } else {
            contract_internal.put("p3_3_1", 0);
            stringBuilder.append("合同未上传");
        }
        // 对方企业名称未填写.
        String contract_1_2 = contract.get("sell_name") == null ? "" : contract.get("sell_name").toString();
        if (!contract_1_2.equals("")) {
            total += Double.parseDouble(score.get("p3_3_2").toString());
            contract_internal.put("p3_3_2", score.get("p3_3_2"));
        } else {
            contract_internal.put("p3_3_2", 0);
            stringBuilder.append("，");
            stringBuilder.append("对方企业名称未填写");
        }
        // 合同标的未填写.
        String contract_1_3 = contract.get("service_name") == null ? "" : contract.get("service_name").toString();
        if (!contract_1_3.equals("")) {
            total += Double.parseDouble(score.get("p3_3_3").toString());
            contract_internal.put("p3_3_3", score.get("p3_3_3"));
        } else {
            contract_internal.put("p3_3_3", 0);
            stringBuilder.append("，");
            stringBuilder.append("合同标的未填写");
        }
        // 合同金额未填写.
        String contract_1_4 = contract.get("total_amount") == null ? "" : contract.get("total_amount").toString();
        if (!contract_1_4.equals("")) {
            total += Double.parseDouble(score.get("p3_3_4").toString());
            contract_internal.put("p3_3_4", score.get("p3_3_4"));
        } else {
            contract_internal.put("p3_3_4", 0);
            stringBuilder.append("，");
            stringBuilder.append("合同金额未填写");
        }
        // 签约时间未填写.
        String contract_1_5 = contract.get("sign_date") == null ? "" : contract.get("sign_date").toString();
        if (!contract_1_5.equals("")) {
            total += Double.parseDouble(score.get("p3_3_5").toString());
            contract_internal.put("p3_3_5", score.get("p3_3_5"));
        } else {
            contract_internal.put("p3_3_5", 0);
            stringBuilder.append("，");
            stringBuilder.append("签约时间未填写");
        }
        // 争议解决方式未填写.
        String contract_1_6 = contract.get("solve_type") == null ? "" : contract.get("solve_type").toString();
        if (!contract_1_6.equals("")) {
            total += Double.parseDouble(score.get("p3_3_6").toString());
            contract_internal.put("p3_3_6", score.get("p3_3_6"));
        } else {
            contract_internal.put("p3_3_6", 0);
            stringBuilder.append("，");
            stringBuilder.append("争议解决方式未填写");
        }

        // 业务主办人未填写.
        String contract_2_1 = contract.get("sponsor") == null ? "" : contract.get("sponsor").toString();
        if (!contract_2_1.equals("")) {
            total += Double.parseDouble(score.get("p3_3_7").toString());
            contract_internal.put("p3_3_7", score.get("p3_3_7"));
        } else {
            contract_internal.put("p3_3_7", 0);
            stringBuilder.append("，");
            stringBuilder.append("业务主办人未填写");
        }
        // 业务主管未填写.
        String contract_2_2 = contract.get("leader") == null ? "" : contract.get("leader").toString();
        if (!contract_2_2.equals("")) {
            total += Double.parseDouble(score.get("p3_3_8").toString());
            contract_internal.put("p3_3_8", score.get("p3_3_8"));
        } else {
            contract_internal.put("p3_3_8", 0);
            stringBuilder.append("，");
            stringBuilder.append("业务主管未填写");
        }
        // 财务核审人未填写.
        String contract_2_3 = contract.get("f_auditor") == null ? "" : contract.get("f_auditor").toString();
        if (!contract_2_3.equals("")) {
            total += Double.parseDouble(score.get("p3_3_9").toString());
            contract_internal.put("p3_3_9", score.get("p3_3_9"));
        } else {
            contract_internal.put("p3_3_9", 0);
            stringBuilder.append("，");
            stringBuilder.append("财务核审人未填写");
        }
        // 业务审核人未填写.
        String contract_2_4 = contract.get("b_auditor") == null ? "" : contract.get("b_auditor").toString();
        if (!contract_2_4.equals("")) {
            total += Double.parseDouble(score.get("p3_3_10").toString());
            contract_internal.put("p3_3_10", score.get("p3_3_10"));
        } else {
            contract_internal.put("p3_3_10", 0);
            stringBuilder.append("，");
            stringBuilder.append("业务审核人未填写");
        }

        // 业务发起无邮件、短信或其他信息.
        String contract_3_1 = contract.get("link_info") == null ? "" : contract.get("link_info").toString();
        if (!contract_3_1.equals("")) {
            JSONArray arr = JSONObject.parseArray(contract_3_1);
            if (!arr.isEmpty()) {
                total += Double.parseDouble(score.get("p3_3_11").toString());
                contract_internal.put("p3_3_11", score.get("p3_3_11"));
            } else {
                contract_internal.put("p3_3_11", 0);
            }
        } else {
            contract_internal.put("p3_3_11", 0);
            stringBuilder.append("，");
            stringBuilder.append("业务发起无邮件、短信或其他信息");
        }
        // 业务发起无发起文档.
        String contract_3_2 = contract.get("docs") == null ? "" : contract.get("docs").toString();
        if (!contract_3_2.equals("")) {
            JSONArray arr = JSONObject.parseArray(contract_3_2);
            if (!arr.isEmpty()) {
                total += Double.parseDouble(score.get("p3_3_12").toString());
                contract_internal.put("p3_3_12", score.get("p3_3_12"));
            } else {
                contract_internal.put("p3_3_12", 0);
            }
        } else {
            contract_internal.put("p3_3_12", 0);
            stringBuilder.append("，");
            stringBuilder.append("业务发起无发起文档");
        }
        // 业务完成无邮件、短信或其他信息.
        String contract_3_3 = contract.get("b_link_info") == null ? "" : contract.get("b_link_info").toString();
        if (!contract_3_3.equals("")) {
            JSONArray arr = JSONObject.parseArray(contract_3_3);
            if (!arr.isEmpty()) {
                total += Double.parseDouble(score.get("p3_3_13").toString());
                contract_internal.put("p3_3_13", score.get("p3_3_13"));
            } else {
                contract_internal.put("p3_3_13", 0);
            }
        } else {
            contract_internal.put("p3_3_13", 0);
            stringBuilder.append("，");
            stringBuilder.append("业务完成无邮件、短信或其他信息");
        }
        // 业务完成无完成文档.
        String contract_3_4 = contract.get("f_docs") == null ? "" : contract.get("f_docs").toString();
        if (!contract_3_4.equals("")) {
            JSONArray arr = JSONObject.parseArray(contract_3_4);
            if (!arr.isEmpty()) {
                total += Double.parseDouble(score.get("p3_3_14").toString());
                contract_internal.put("p3_3_14", score.get("p3_3_14"));
            } else {
                contract_internal.put("p3_3_14", 0);
            }
        } else {
            contract_internal.put("p3_3_14", 0);
            stringBuilder.append("，");
            stringBuilder.append("业务完成无完成文档");
        }
        // 真实交易无记账凭证记录.
        String contract_3_5 = contract.get("f_record") == null ? "" : contract.get("f_record").toString();
        if (!contract_3_5.equals("")) {
            JSONArray arr = JSONObject.parseArray(contract_3_5);
            if (!arr.isEmpty()) {
                total += Double.parseDouble(score.get("p3_3_15").toString());
                contract_internal.put("p3_3_15", score.get("p3_3_15"));
            } else {
                contract_internal.put("p3_3_15", 0);
            }
        } else {
            contract_internal.put("p3_3_15", 0);
            stringBuilder.append("，");
            stringBuilder.append("真实交易无记账凭证记录");
        }
        // 真实交易无银行流水记录.
        String contract_3_6 = contract.get("b_record") == null ? "" : contract.get("b_record").toString();
        if (!contract_3_6.equals("")) {
            JSONArray arr = JSONObject.parseArray(contract_3_6);
            if (!arr.isEmpty()) {
                total += Double.parseDouble(score.get("p3_3_16").toString());
                contract_internal.put("p3_3_16", score.get("p3_3_16"));
            } else {
                contract_internal.put("p3_3_16", 0);
            }
        } else {
            contract_internal.put("p3_3_16", 0);
            stringBuilder.append("，");
            stringBuilder.append("真实交易无银行流水记录");
        }
        // 真实交易无交易账册记录.
        String contract_3_7 = contract.get("s_record") == null ? "" : contract.get("s_record").toString();
        if (!contract_3_7.equals("")) {
            JSONArray arr = JSONObject.parseArray(contract_3_7);
            if (!arr.isEmpty()) {
                total += Double.parseDouble(score.get("p3_3_17").toString());
                contract_internal.put("p3_3_17", score.get("p3_3_17"));
            } else {
                contract_internal.put("p3_3_17", 0);
            }
        } else {
            contract_internal.put("p3_3_17", 0);
            stringBuilder.append("，");
            stringBuilder.append("真实交易无交易账册记录");
        }

        // 交付信息无完成时间.
        String contract_4_1 = contract.get("f_time") == null ? "" : contract.get("f_time").toString();
        if (!contract_4_1.equals("")) {
            total += Double.parseDouble(score.get("p3_3_18").toString());
            contract_internal.put("p3_3_18", score.get("p3_3_18"));
        } else {
            contract_internal.put("p3_3_18", 0);
            stringBuilder.append("，");
            stringBuilder.append("交付信息无完成时间");
        }
        // 交付是否顺利未填写.
        String contract_4_2 = contract.get("receive_b_record") == null ? "" : contract.get("receive_b_record").toString();
        if (!contract_4_2.equals("")) {
            total += Double.parseDouble(score.get("p3_3_19").toString());
            contract_internal.put("p3_3_19", score.get("p3_3_19"));
        } else {
            contract_internal.put("p3_3_19", 0);
            stringBuilder.append("，");
            stringBuilder.append("交付是否顺利未填写");
        }
        // 交付争议信息未填写.
        String contract_4_3 = contract.get("dispute_item") == null ? "" : contract.get("dispute_item").toString();
        if (!contract_4_3.equals("")) {
            total += Double.parseDouble(score.get("p3_3_20").toString());
            contract_internal.put("p3_3_20", score.get("p3_3_20"));
        } else {
            contract_internal.put("p3_3_20", 0);
            stringBuilder.append("，");
            stringBuilder.append("交付争议信息未填写");
        }
        // 交付信息无对方联系方式.
        String contract_4_4 = contract.get("t_link_info") == null ? "" : contract.get("t_link_info").toString();
        if (!contract_4_4.equals("")) {
            JSONArray arr = JSONObject.parseArray(contract_4_4);
            if (!arr.isEmpty() && arr != null) {
                total += Double.parseDouble(score.get("p3_3_21").toString());
                contract_internal.put("p3_3_21", score.get("p3_3_21"));
            } else {
                contract_internal.put("p3_3_21", 0);
            }
        } else {
            contract_internal.put("p3_3_21", 0);
            stringBuilder.append("，");
            stringBuilder.append("交付信息无对方联系方式");
        }
        stringBuilder.append("。");
        // 修改合同中的内部合规评分小项.
        contract_internal.put("contract_name", map.get("contract_name"));
        contractInfoMapper.updateContractInternal(contract_internal);
        Map map1 = new HashMap();
        map1.put("internalDetail", stringBuilder.toString());
        String contract_code =  map.get("contract_code") == null ? "" :  map.get("contract_code").toString();
        if(!contract_code.equals("")){
            map1.put("contract_code", contract_code);
            computeVersion(map1);
        }
        return total;
    }

    @Override
    public Double providerScore(Map map) throws ParseException {
        // 在新增供应商时, 添加到供应商信息中, 合同中的供应商评分与供应商中的一致.
        // 但是, 合同在结束后, 不在更新, 而, 供应商中继续更新.
        // 更新扣分数值时, 需要判断.

        // 需要传入供应商名称, 查询供应商信息.
        Map provider = providerInfoMapper.getProviderByName(map);
        // 还需传入当前登录公司的id, 以便查询风控数值.
        Map score = riskControlSetMapper.query(map);
        // 供应商评分.
        Double total = 0D;
        // 扣分明细.
        StringBuilder stringBuilder = new StringBuilder();
        // 修改合同中的供应商评分小项.
        Map contract_provider = new HashMap();
        // 注册年限少于2年.
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String reg_date_str = provider.get("reg_date").toString();
        Date reg_date = sdf.parse(reg_date_str);
        Long date = System.currentTimeMillis() - reg_date.getTime();
        if (date >= 60278400000L) {
            total += Double.parseDouble(score.get("p3_4_1").toString());
            contract_provider.put("p3_4_1", score.get("p3_4_1"));
        } else {
            contract_provider.put("p3_4_1", 0);
            stringBuilder.append("注册年限少于2年");
        }
        // 注册资本少于100万.
        String reg_capital = provider.get("reg_capital") == null ? "" : provider.get("reg_capital").toString();
        if (!reg_capital.equals("") && Double.parseDouble(reg_capital) >= 100) {
            total += Double.parseDouble(score.get("p3_4_2").toString());
            contract_provider.put("p3_4_2", score.get("p3_4_2"));
        } else {
            contract_provider.put("p3_4_2", 0);
            stringBuilder.append("，");
            stringBuilder.append("注册资本少于100万");
        }
        // 受惩黑名单.
        String xzhmdStr = provider.get("xzhmd") == null ? "" : provider.get("xzhmd").toString();
        JSONObject xzhmd = JSONObject.parseObject(xzhmdStr);
        if (xzhmd == null || Integer.parseInt(xzhmd.get("count").toString()) <= 0) {
            total += Double.parseDouble(score.get("p3_4_3").toString());
            contract_provider.put("p3_4_3", score.get("p3_4_3"));
        } else {
            contract_provider.put("p3_4_3", 0);
            stringBuilder.append("，");
            stringBuilder.append("存在受惩黑名单数据");
        }
        // 执行公告.
        String zxggStr = provider.get("zxgg") == null ? "" : provider.get("zxgg").toString();
        JSONObject zxgg = JSONObject.parseObject(zxggStr);
        if (zxgg == null || Integer.parseInt(zxgg.get("count").toString()) <= 0) {
            total += Double.parseDouble(score.get("p3_4_4").toString());
            contract_provider.put("p3_4_4", score.get("p3_4_4"));
        } else {
            contract_provider.put("p3_4_4", 0);
            stringBuilder.append("，");
            stringBuilder.append("存在执行公告数据");
        }
        // 失信公告.
        String shixinStr = provider.get("shixin") == null ? "" : provider.get("shixin").toString();
        JSONObject shixin = JSONObject.parseObject(shixinStr);
        if (shixin == null || Integer.parseInt(shixin.get("count").toString()) <= 0) {
            total += Double.parseDouble(score.get("p3_4_5").toString());
            contract_provider.put("p3_4_5", score.get("p3_4_5"));
        } else {
            contract_provider.put("p3_4_5", 0);
            stringBuilder.append("，");
            stringBuilder.append("存在失信公告数据");
        }
        // 曝光台.
        String bgtStr = provider.get("bgt") == null ? "" : provider.get("bgt").toString();
        JSONObject bgt = JSONObject.parseObject(bgtStr);
        if (bgt == null || Integer.parseInt(bgt.get("count").toString()) <= 0) {
            total += Double.parseDouble(score.get("p3_4_6").toString());
            contract_provider.put("p3_4_6", score.get("p3_4_6"));
        } else {
            contract_provider.put("p3_4_6", 0);
            stringBuilder.append("，");
            stringBuilder.append("存在曝光台数据");
        }
        stringBuilder.append("。");
        // 修改供应商中的供应商评分小项.
        contract_provider.put("company_name", map.get("company_name"));
        providerInfoMapper.updateProviderSingleScore(contract_provider);
        // 供应商扣分明细.
        Map map1 = new HashMap();
        map1.put("providerDetail", stringBuilder.toString());
        // 如果没有传入合同编号, 则是在供应商新增的时候调用.
        String contract_code = map.get("contract_code") == null ? "" : map.get("contract_code").toString();
        if (!contract_code.equals("")) {
            map1.put("contract_code", contract_code);
            computeVersion(map1);
        }
        return total;
    }

    @Override
    public int computeVersion(Map map) {
        Map map1 = new HashMap();
        map1.put("contract_code", map.get("contract_code"));
        map1.put("id", UUIDUtils.getUUID());
        map1.put("create_time", new Date());
        String provider = map.get("providerDetail") == null ? "" : map.get("providerDetail").toString();
        String internal = map.get("internalDetail") == null ? "" : map.get("internalDetail").toString();
        String market = map.get("marketDetail") == null ? "" : map.get("marketDetail").toString();
        String tax = map.get("taxDetail") == null ? "" : map.get("taxDetail").toString();
        // 封装detail.
        Map<String, String> map2 = new HashMap<String, String>();
        map2.put("税务合规", tax);
        Map<String, String> map3 = new HashMap<String, String>();
        map3.put("市场监管", market);
        Map<String, String> map4 = new HashMap<String, String>();
        map4.put("内部合规", internal);
        Map<String, String> map5 = new HashMap<String, String>();
        map5.put("供应商", provider);
        // 先判断数据库中, 是否存在这张合同的扣分明细(contract_code).
        Map contract = riskControlSetMapper.findComputeByContractCode(map1);
        if(contract == null){
            // 如果没有, 就生成一个新的数组, 存储在数据库中.
            List detail = new ArrayList();
            detail.add(0, map2);
            detail.add(1, map3);
            detail.add(2, map4);
            detail.add(3, map5);
            map1.put("detail", JSONArray.toJSONString(detail));
            // 修改合同中的扣分明细id.
            contractInfoMapper.updateComputeId(map1);
            return riskControlSetMapper.insertCompute(map1);
        }else{
            // 如果有, 就先查出来, 修改detail.
            JSONArray detail = JSONArray.parseArray(contract.get("detail").toString());
            if(!tax.equals("")){
                detail.set(0, map2);
            }
            if(!market.equals("")){
                detail.set(1, map3);
            }
            if(!internal.equals("")){
                detail.set(2, map4);
            }
            if(!provider.equals("")){
                detail.set(3, map5);
            }
            map1.put("detail", JSONArray.toJSONString(detail));
            return riskControlSetMapper.updateCompute(map1);
        }
    }
}
