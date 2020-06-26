package com.fd.fhtmid.service.impl;

import com.alibaba.fastjson.JSON;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.mapper.BProviderInfoMapper;
import com.fd.fhtmid.mapper.ChartMapper;
import com.fd.fhtmid.service.MessageService;
import com.fd.fhtmid.utils.UUIDUtils;
import org.apache.commons.collections.map.HashedMap;
import org.apache.ibatis.annotations.Lang;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class MessageServiceImpl implements MessageService {

    @Autowired
    private ChartMapper chartMapper;

    @Autowired
    private BProviderInfoMapper providerInfoMapper;

    /**
     * 查询消息提醒中心数据
     * @param map
     * @return
     */
    @Async
    @Override
    public ApiResult select(Map map) {
        Map map1 = new HashedMap();
        map1.put("s_name",map.get("seller_name")); // 供应商名称
        map1.put("new_price",map.get("new_price")); // 新增这张发票的金额
        map1.put("time",map.get("time")); // 开票时间
        String price =  map.get("new_price").toString();
        double new_price = Double.parseDouble(price);

        // 得到供应商的注册资本
        Map map2 = new HashMap();
        map2.put("company_name",map.get("seller_name"));
        Map provider = providerInfoMapper.getProviderByName(map2);
        String reg_capital = provider.get("reg_capital").toString();

        Map rs1 =  chartMapper.xiaoxitixinzhongxin1(map1);
        Map rs2 =  chartMapper.xiaoxitixinzhongxin2(map1);
        Map rs3 =  chartMapper.xiaoxitixinzhongxin3(map1);
        if(rs1 != null){
            String s_name1 = rs1.get("s_name").toString();
            String price1 = rs1.get("price").toString();
            Double price11 = Double.parseDouble(price1);
            String content = s_name1 + "/提供的非增值税专用发票近12月累计/"+ price11/10000 +"/万";
            Map map3 = new HashMap();
            map3.put("id", UUIDUtils.getUUID());
            map3.put("content",content);
            map3.put("create_time",new Date());
            System.out.println("map3"+map3);
            // 判断数据库中是否已存在该提醒，存在则不在重复新增
            Map rs = chartMapper.xiaoxitixingzhongxinContent(map3);
            if(rs != null){
                String messageContent = rs.get("content").toString();
                // 不存在则新增到数据库中，存在则只需要更新时间
                if(!messageContent.equals(content)){
                    chartMapper.insertMessage(map3);
                }else{
                    chartMapper.updateMessage(map3);
                }
            }else{
                chartMapper.insertMessage(map3);
            }
        }
        if(rs2 != null){
            String s_name1 = rs2.get("s_name").toString();
            String price1 = rs2.get("price").toString();
            Double price11 = Double.parseDouble(price1);
            String content = s_name1 + "/提供的非增值税专用发票近30天累计/"+ price11/10000 +"/万";
            Map map3 = new HashMap();
            map3.put("id", UUIDUtils.getUUID());
            map3.put("content",content);
            map3.put("create_time",new Date());
            System.out.println("map3"+map3);
            // 判断数据库中是否已存在该提醒，存在则不在重复新增
            Map rs = chartMapper.xiaoxitixingzhongxinContent(map3);
            if(rs != null){
                String messageContent = rs.get("content").toString();
                if(!messageContent.equals(content)){
                    chartMapper.insertMessage(map3);
                }else{
                    chartMapper.updateMessage(map3);
                }
            }else{
                chartMapper.insertMessage(map3);
            }
        }

        if(rs3 != null){
            String s_name1 = rs3.get("s_name").toString();
            String content = s_name1 + "/从本月25日截止至当前日期的开票金额超过了本月总开票金额的20%";
            Map map3 = new HashMap();
            map3.put("id", UUIDUtils.getUUID());
            map3.put("content",content);
            map3.put("create_time",new Date());
            System.out.println("map3"+map3);
            // 判断数据库中是否已存在该提醒，存在则不在重复新增
            Map rs = chartMapper.xiaoxitixingzhongxinContent(map3);
            if(rs != null){
                String messageContent = rs.get("content").toString();
                if(!messageContent.equals(content)){
                    chartMapper.insertMessage(map3);
                }else{
                    chartMapper.updateMessage(map3);
                }
            }else{
                chartMapper.insertMessage(map3);
            }
        }
        // 防止传过来的注册资本为空
        if(reg_capital != ""){
            Map rs4 =  chartMapper.xiaoxitixinzhongxin4(map1);
            if(rs4 != null){
                String s_name1 = rs4.get("s_name").toString();
                String content = s_name1 + "/提供的发票超过该供应商的注册资本20倍。";
                Map map3 = new HashMap();
                map3.put("id", UUIDUtils.getUUID());
                map3.put("content",content);
                map3.put("create_time",new Date());
                System.out.println("map3"+map3);
                // 判断数据库中是否已存在该提醒，存在则不在重复新增
                Map rs = chartMapper.xiaoxitixingzhongxinContent(map3);
                if(rs != null){
                    String messageContent = rs.get("content").toString();
                    if(!messageContent.equals(content)){
                        chartMapper.insertMessage(map3);
                    }else{
                        chartMapper.updateMessage(map3);
                    }
                }else{
                    chartMapper.insertMessage(map3);
                }
            }
        }
        if(new_price == 9900|| new_price == 99000 || new_price == 990000){
            Map rs5 =  chartMapper.xiaoxitixinzhongxin5(map1);
            String sum = rs5.get("sum").toString();
            Double count = Double.parseDouble(sum);
            if(rs5 != null && count == 10){
                String s_name1 = rs5.get("s_name").toString();
                String content = s_name1 + "/提供的发票存在连续定格开票现象。";
                Map map3 = new HashMap();
                map3.put("id", UUIDUtils.getUUID());
                map3.put("content",content);
                map3.put("create_time",new Date());
                System.out.println("map3"+map3);
                // 判断数据库中是否已存在该提醒，存在则不在重复新增
                Map rs = chartMapper.xiaoxitixingzhongxinContent(map3);
                if(rs != null){
                    String messageContent = rs.get("content").toString();
                    if(!messageContent.equals(content)){
                        chartMapper.insertMessage(map3);
                    }else{
                        chartMapper.updateMessage(map3);
                    }
                }else{
                    chartMapper.insertMessage(map3);
                }
            }
        }
        return new ApiResult (0, "查询成功", "");
    }


}
