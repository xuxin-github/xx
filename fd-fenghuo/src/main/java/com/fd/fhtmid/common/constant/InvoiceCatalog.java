package com.fd.fhtmid.common.constant;

import java.util.HashMap;
import java.util.Map;

public class InvoiceCatalog {

    /**
     * 得到对应的分类.
     * @param name 名称.
     * @return 分类名.
     */
    public static String getInvoiceCatalog(String name){
        Map<String, String> map = new HashMap<String, String>();
        map.put("研发和技术服务", "管理费类");
        map.put("合同能源管理服务", "管理费类");
        map.put("信息技术服务", "管理费类");
        map.put("信息系统服务", "管理费类");
        map.put("业务流程管理服务", "管理费类");
        map.put("信息系统增值服务", "管理费类");
        map.put("设计服务", "管理费类");
        map.put("鉴证咨询服务", "管理费类");
        map.put("认证服务", "管理费类");
        map.put("鉴证服务", "管理费类");
        map.put("咨询服务", "管理费类");
        map.put("商务辅助服务", "管理费类");
        map.put("企业管理服务", "管理费类");
        map.put("物业管理服务", "管理费类");
        map.put("其他企业管理服务", "管理费类");
        map.put("直接收费金融服务", "管理费类");
        map.put("文化服务", "管理费类");

        map.put("研发和技术服务", "咨询费类");
        map.put("软件咨询服务", "咨询费类");
        map.put("鉴证咨询服务", "咨询费类");
        map.put("其他鉴证服务", "咨询费类");
        map.put("会计咨询", "咨询费类");
        map.put("法律咨询", "咨询费类");
        map.put("其他现代服务", "咨询费类");

        map.put("文化创意服务", "会议费类");
        map.put("会议展览服务", "会议费类");
        map.put("会议服务", "会议费类");

        map.put("技术咨询服务", "培训费类");
        map.put("非学历教育服务", "培训费类");

        map.put("生活服务", "旅游费类");
        map.put("旅游娱乐服务", "旅游费类");
        map.put("旅游服务", "旅游费类");

        map.put("货物运输代理服务", "手续费类");
        map.put("代理报关服务", "手续费类");
        map.put("货物运输代理服务", "手续费类");
        map.put("代理报关服务", "手续费类");

        String catalog = "";
        for (Map.Entry<String, String> entry : map.entrySet()) {
            if(entry.getKey().equals(name)){
                catalog = entry.getValue();
            }
        }
        return catalog;
    }

    /**
     * 得到分类对应的数据库存储值.
     * @param name 分类名.
     * @return 数据库存储值.
     */
    public static String getCatalog(String name){
        Map<String, String> map = new HashMap<String, String>();
        map.put("管理费类", "01");
        map.put("咨询费类", "02");
        map.put("会议费类", "03");
        map.put("培训费类", "04");
        map.put("旅游费类", "05");
        map.put("手续费类", "06");

        String catalog = "";
        for (Map.Entry<String, String> entry : map.entrySet()) {
            if(entry.getKey().equals(name)){
                catalog = entry.getValue();
            }
        }
        return catalog;
    }
}
