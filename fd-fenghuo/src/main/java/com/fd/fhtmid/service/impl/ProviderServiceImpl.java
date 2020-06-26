package com.fd.fhtmid.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.mapper.BProviderInfoMapper;
import com.fd.fhtmid.service.ProviderService;
import com.fd.fhtmid.service.SystemService;
import com.fd.fhtmid.utils.UUIDUtils;
import com.fd.fhtmid.utils.third.ZhengXinUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ProviderServiceImpl implements ProviderService {
    @Autowired
    private BProviderInfoMapper providerInfoMapper;

    @Autowired
    private ZhengXinUtil zxUtil;

    @Autowired
    private SystemService systemService;

    @Override
    public Map insert(Map map3) throws ParseException {
        // 保存信息.
        String name = map3.get("company_name").toString();
        Map map1 = new HashMap();
        map1.put("create_by", map3.get("create_by"));
        map1.put("company_name", name);
        // 添加id.
        map1.put("id", UUIDUtils.getUUID());
        // 添加企业信息更新时间.
        map1.put("ent_update_time", new Date());
        // 添加是否合法企业, 默认都为合法企业.
        map1.put("is_legal", "0");
        // 添加创建时间.
        map1.put("create_time", new Date());
        // 查询数据库中, 是否有相同名称的企业.
        Map provider = providerInfoMapper.getProviderByName(map1);
        if (provider == null) {
            // 核查供应商是否存在.
            Map provider_verification = zxUtil.P_B_B010(name);
            if (((Map) provider_verification.get("retdata")).get("found").equals("1") && (provider_verification.get("retcode").equals("000000"))) {
                // 查询企业基本信息.
                Map provider_info = zxUtil.P_B_B019(name);
                if("000000".equals(provider_info.get("retcode"))){
                    // 企业注册日期.
                    String reg_date = ((Map) ((Map) provider_info.get("retdata")).get("BASIC")).get("ESDATE") == null ? "" : ((Map) ((Map) provider_info.get("retdata")).get("BASIC")).get("ESDATE").toString();
                    map1.put("reg_date", reg_date);
                    // 企业注册资本.
                    String reg_capital = ((Map) ((Map) provider_info.get("retdata")).get("BASIC")).get("REGCAP") == null ? "" : ((Map) ((Map) provider_info.get("retdata")).get("BASIC")).get("REGCAP").toString();
                    map1.put("reg_capital", reg_capital);
                    // 企业注册号.
                    String reg_code = ((Map) ((Map) provider_info.get("retdata")).get("BASIC")) == null ? "" : ((Map) ((Map) provider_info.get("retdata")).get("BASIC")).get("REGNO").toString();
                    map1.put("reg_code", reg_code);
                    // 股东名单.
                    List shareholders = (List) ((Map) provider_info.get("retdata")).get("SHAREHOLDER");
                    String shareholderStr = JSONArray.toJSONString(shareholders);
                    map1.put("shareholders", shareholderStr);
                    // 受惩黑名单.
                    Map blacklist = zxUtil.sh006(name, "xzhmd");
                    if (blacklist.get("retcode").equals("000000") && blacklist != null) {
                        // 取数组的前三行数据.
                        List xzhmdList = ((List) ((Map) blacklist.get("retdata")).get("xzhmdList"));
                        System.out.println("受惩黑名单数据：---------"+xzhmdList);
//                        if (xzhmdList.size() >= 3) {
//                            xzhmdList = xzhmdList.subList(0, 3);
//                        }

                        // 取出数据的总数.
                        String xzhmdCount = ((Map) blacklist.get("retdata")).get("xzhmdCount").toString();
                        // 组合为对象, 并string化.
                        Map xzhmd = new HashMap();
                        xzhmd.put("count", xzhmdCount);
                        xzhmd.put("list", xzhmdList);
                        String xzhmdStr = JSON.toJSONString(xzhmd);
                        map1.put("xzhmd", xzhmdStr);
                    }

                    // 执行公告.
                    Map perform = zxUtil.sh006(name, "zxgg");
                    if (perform.get("retcode").equals("000000") && perform != null) {
                        // 取数组的前三行数据.
                        List zxggList = ((List) ((Map) perform.get("retdata")).get("zxggList"));
                        System.out.println("执行公告数据：---------"+zxggList);
//                        if (zxggList.size() >= 3) {
//                            zxggList = zxggList.subList(0, 3);
//
//                        }
                        // 取出数据的总数.
                        String zxggCount = ((Map) perform.get("retdata")).get("zxggCount").toString();
                        // 组合为对象, 并string化.
                        Map zzgg = new HashMap();
                        zzgg.put("count", zxggCount);
                        zzgg.put("list", zxggList);
                        String zxggStr = JSON.toJSONString(zzgg);
                        map1.put("zxgg", zxggStr);
                    }

                    // 失信公告.
                    Map faithless = zxUtil.sh006(name, "shixin");
                    if (faithless.get("retcode").equals("000000") && faithless != null) {
                        // 取数组的前三行数据.
                        List shixinList = ((List) ((Map) faithless.get("retdata")).get("shixinList"));
                        System.out.println("失信公告数据：---------"+shixinList);
//                        if (shixinList.size() >= 3) {
//                            shixinList = shixinList.subList(0, 3);
//                        }
                        // 取出数据的总数.
                        String shixinCount = ((Map) faithless.get("retdata")).get("shixinCount").toString();
                        // 组合为对象, 并string化.
                        Map shixin = new HashMap();
                        shixin.put("count", shixinCount);
                        shixin.put("list", shixinList);
                        String shixinStr = JSON.toJSONString(shixin);
                        map1.put("shixin", shixinStr);
                    }

                    // 曝光台.
                    Map exposure = zxUtil.sh006(name, "bgt");
                    if (exposure != null && exposure.get("retcode").equals("000000")) {
                        // 取数组的前三行数据.
                        List bgtList = ((List) ((Map) exposure.get("retdata")).get("bgtList"));
                        System.out.println("曝光台数据：---------"+bgtList);
//                        if (bgtList.size() >= 3) {
//                            bgtList = bgtList.subList(0, 3);
//                        }
                        // 取出数据的总数.
                        String bgtCount = ((Map) exposure.get("retdata")).get("bgtCount").toString();
                        // 组合为对象, 并string化.
                        Map bgt = new HashMap();
                        bgt.put("count", bgtCount);
                        bgt.put("list", bgtList);
                        String bgtStr = JSON.toJSONString(bgt);
                        map1.put("bgt", bgtStr);
                    }
                    // 新增.
                    int result = providerInfoMapper.insertProvider(map1);
                    if (result == 1) {
                        // 计算供应商评分.
                        Map map = new HashMap();
                        map.put("company_name", name);
                        map.put("company_no", "1");
                        // 得到对应的供应商评分.
                        Double score = systemService.providerScore(map);
                        // 修改对应的供应商评分.
                        map.put("score", score);
                        providerInfoMapper.updateProviderScore(map);
                        Map map2 = new HashMap();
                        map2.put("code", 0);
                        map2.put("msg", "新增成功");
                        return map2;
                    } else {
                        Map map2 = new HashMap();
                        map2.put("code", 1);
                        map2.put("msg", "新增失败");
                        return map2;
                    }
                }else{
                    Map map2 = new HashMap();
                    map2.put("code", 4);
                    map2.put("msg", provider_info.get("retmsg").toString());
                    return map2;
                }
            } else {
                Map map2 = new HashMap();
                map2.put("code", 2);
                map2.put("msg", provider_verification.get("retmsg").toString());
                return map2;
            }
        } else {
            Map map2 = new HashMap();
            map2.put("code", 3);
            map2.put("msg", "供应商已存在");
            return map2;
        }
    }
}
