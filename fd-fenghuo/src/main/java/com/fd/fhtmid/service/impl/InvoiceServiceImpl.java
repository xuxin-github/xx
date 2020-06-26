package com.fd.fhtmid.service.impl;

import com.alibaba.fastjson.JSON;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.common.constant.InvoiceCatalog;
import com.fd.fhtmid.mapper.BInvoiceInfoMapper;
import com.fd.fhtmid.service.InvoiceService;
import com.fd.fhtmid.service.ProviderService;
import com.fd.fhtmid.utils.UUIDUtils;
import com.fd.fhtmid.utils.third.ZhengXinUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {
    @Autowired
    private BInvoiceInfoMapper invoiceInfoMapper;

    @Autowired
    private ZhengXinUtil zhengXinUtil;

    @Autowired
    private ProviderService providerService;

    @Override
    public Map insert(Map map) throws ParseException {
        // 获取发票类型.
        String invoice_type = map.get("bill_type").toString();
        // 获取发票号码.
        String invoice_no = map.get("bill_number").toString();
        // 获取发票代码.
        String invoice_code = map.get("bill_id").toString();
        // 获取发票校验码后六位.
        String check_code_last6 = null;
        if (map.get("bill_xy_id") == null) {
            check_code_last6 = "";
        } else {
            check_code_last6 = map.get("bill_xy_id").toString();
        }
        // 获取发票金额(不含税).
        String total = null;
        if (map.get("bill_money") == null) {
            total = "";
        } else {
            total = map.get("bill_money").toString();
        }
        // 获取发票开票日期.
        String create_date = getDate(map.get("bill_time").toString());
        // 添加参数到map1.
        Map<String, Object> map1 = new HashMap<String, Object>();
        // 获取用户id.
        map1.put("create_by", map.get("create_by"));
        // 添加id.
        map1.put("id", UUIDUtils.getUUID());
        // 添加创建时间.
        map1.put("create_time", new Date());
        map1.put("invoice_no", invoice_no);
        map1.put("invoice_code", invoice_code);
        map1.put("invoice_type", invoice_type);
        // 判断数据库中是否有此发票.
        Map invoice = invoiceInfoMapper.findByNoAndCode(map1);
        if (invoice == null) {
            // 获取查询信息.
            Map invoice_query = zhengXinUtil.P_B_B606(invoice_type, invoice_no, invoice_code, check_code_last6, total, create_date);
            System.out.println("iii````````"+invoice_query);
            if ("000000".equals(invoice_query.get("retcode"))) {
                // 获取发票代码.
                String invoice_code_query = ((Map) invoice_query.get("retdata")).get("invoice_code") == null ? "" : ((Map) invoice_query.get("retdata")).get("invoice_code").toString();
                map1.put("invoice_code", invoice_code_query);
                // 获取发票号码.
                String invoice_no_query = ((Map) invoice_query.get("retdata")).get("invoice_no") == null ? "" : ((Map) invoice_query.get("retdata")).get("invoice_no").toString();
                map1.put("invoice_no", invoice_no_query);
                // 获取开票日期.
                String create_date_time = ((Map) invoice_query.get("retdata")).get("create_date") == null ? "" : ((Map) invoice_query.get("retdata")).get("create_date").toString();
                map1.put("create_date", create_date_time);
                // 获取销方名称.
                String seller_name = ((Map) invoice_query.get("retdata")).get("seller_name") == null ? "" : ((Map) invoice_query.get("retdata")).get("seller_name").toString();
                map1.put("seller_name", seller_name);
                // 获取销方纳税人识别号.
                String seller_tax_no = ((Map) invoice_query.get("retdata")).get("seller_tax_no") == null ? "" : ((Map) invoice_query.get("retdata")).get("seller_tax_no").toString();
                map1.put("seller_tax_no", seller_tax_no);
                // 获取购方名称.
                String buyer_name = ((Map) invoice_query.get("retdata")).get("buyer_name") == null ? "" : ((Map) invoice_query.get("retdata")).get("buyer_name").toString();
                map1.put("buyer_name", buyer_name);
                // 获取购方纳税人识别号.
                String buyer_tax_no = ((Map) invoice_query.get("retdata")).get("buyer_tax_no") == null ? "" : ((Map) invoice_query.get("retdata")).get("buyer_tax_no").toString();
                map1.put("buyer_tax_no", buyer_tax_no);
                // 获取机器编号.
                String machine_no = ((Map) invoice_query.get("retdata")).get("machine_no") == null ? "" : ((Map) invoice_query.get("retdata")).get("machine_no").toString();
                map1.put("machine_no", machine_no);
                // 获取合计税额.
                String total_tax = ((Map) invoice_query.get("retdata")).get("total_tax") == null ? "" : ((Map) invoice_query.get("retdata")).get("total_tax").toString();
                map1.put("total_tax", total_tax);
                // 获取价税合计.
                String amount = ((Map) invoice_query.get("retdata")).get("amount") == null ? "" : ((Map) invoice_query.get("retdata")).get("amount").toString();
                map1.put("amount", amount);
                // 获取备注.
                String note = ((Map) invoice_query.get("retdata")).get("note") == null ? "" : ((Map) invoice_query.get("retdata")).get("note").toString();
                map1.put("note", note);
                // 获取校验码.
                String check_code = ((Map) invoice_query.get("retdata")).get("check_code") == null ? "" : ((Map) invoice_query.get("retdata")).get("check_code").toString();
                map1.put("check_code", check_code);
                // 获取合计金额.
                String total_query = ((Map) invoice_query.get("retdata")).get("total") == null ? "" : ((Map) invoice_query.get("retdata")).get("total").toString();
                map1.put("total", total_query);
                // 获取货物或应税劳务名称.
                List services = (List) ((Map) invoice_query.get("retdata")).get("detail_list");
                String servicesStr = JSON.toJSONString(services);
                map1.put("services", servicesStr);
                if (invoice_type.equals("11")) {
                    // 获取收款员.
                    String receiver = ((Map) invoice_query.get("retdata")).get("receiver") == null ? "" : ((Map) invoice_query.get("retdata")).get("receiver").toString();
                    map1.put("receiver", receiver);
                } else {
                    // 获取销方开户行及账号.
                    String seller_bank_info = ((Map) invoice_query.get("retdata")).get("seller_bank_info") == null ? "" : ((Map) invoice_query.get("retdata")).get("seller_bank_info").toString();
                    map1.put("seller_bank_info", seller_bank_info);
                    // 获取购方开户行及账号.
                    String buyer_bank_info = ((Map) invoice_query.get("retdata")).get("buyer_bank_info") == null ? "" : ((Map) invoice_query.get("retdata")).get("buyer_bank_info").toString();
                    map1.put("buyer_bank_info", buyer_bank_info);
                    // 获取购方地址电话.
                    String buyer_address = ((Map) invoice_query.get("retdata")).get("buyer_address") == null ? "" : ((Map) invoice_query.get("retdata")).get("buyer_address").toString();
                    map1.put("buyer_address", buyer_address);
                    // 获取销方地址电话.
                    String seller_address = ((Map) invoice_query.get("retdata")).get("seller_address") == null ? "" : ((Map) invoice_query.get("retdata")).get("seller_address").toString();
                    map1.put("seller_address", seller_address);
                }
                // 新增(发票只要数据库中没有, 就新增).
                Map map4 = new HashMap();
                map4.put("create_by", map.get("create_by"));
                map4.put("company_name", seller_name);
                int result = invoiceInfoMapper.insertInvoice(map1);
                // 判断有无此供应商(存在则不新增, 不存在则新增).
                Map provider = providerService.insert(map4);
                Map map3 = new HashMap();
                if (provider.get("code").equals(0) || provider.get("code").equals(3)) {
                    map3.put("msg", "新增成功");
                } else {
                    map3.put("msg", "发票新增成功, 但供应商为新增失败");
                }
                // 回调结果.
                Map<String, Object> map5 = new HashMap<String, Object>();
                map5.put("invoice_code", invoice_code_query);
                map5.put("invoice_no", invoice_no_query);
                Map invoice_add = invoiceInfoMapper.findByNoAndCode(map5);
                if (result == 1) {
                    Map map2 = new HashMap();
                    map2.put("code", 0);
                    map2.put("msg", map3.get("msg"));
                    if (services.size() > 0) {
                        Map service = ((Map) ((List) ((Map) invoice_query.get("retdata")).get("detail_list")).get(0));
                        map2.put("services", service);
                    } else {
                        map2.put("services", "");
                    }
                    map2.put("data", invoice_add);
                    return map2;
                } else {
                    Map map2 = new HashMap();
                    map2.put("code", 1);
                    map2.put("msg", "新增失败");
                    map2.put("data", result);
                    return map2;
                }
            } else {
                Map map2 = new HashMap();
                map2.put("code", 2);
                map2.put("msg", invoice_query.get("retmsg"));
                map2.put("data", "");
                return map2;
            }
        } else {

            // 判断此发票是否已关联.
            if (invoice.get("contract_id") == null) {
                Map map2 = new HashMap();
                map2.put("code", 4);
                map2.put("msg", "查询成功");
                map2.put("data", invoice);
                return map2;
            } else {
                Map map2 = new HashMap();
                map2.put("code", 3);
                map2.put("msg", "已存在发票号码与代码相同的发票, 且已经关联！");
                map2.put("data", invoice);
                return map2;
            }
        }
    }

    /**
     * 格式化时间.
     *
     * @param time 时间.
     * @return 时间.
     * @throws ParseException 异常.
     */
    public String getDate(String time) throws ParseException {
        if (time != null) {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            Date date1 = formatter.parse(time);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String date = sdf.format(date1).replace("-", "");
            return date;
        }
        return "";
    }
}
