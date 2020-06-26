package com.fd.fhtmid.controller.platform;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BInvoiceInfoMapper;
import com.fd.fhtmid.mapper.BReimburseInfoMapper;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping(value = "/p/reimburse")
public class ReimburseController extends BaseController {
    @Autowired
    private BReimburseInfoMapper reimburseInfoMapper;
    @Autowired
    private BInvoiceInfoMapper invoiceInfoMapper;

    /**
     * 获取指定报销记录.
     * @param map 报销编号(reimburse_code).
     * @return 响应数据.
     */
    @RequestMapping(value = "/getReimburseByCode", method = RequestMethod.POST)
    public ApiResult getReimburseByCode(@RequestBody Map map){
        Map reimburse = reimburseInfoMapper.getReimburseByCode(map);
        // 把文件转换为数组形式.
        String files = reimburse.get("files").toString();
        JSONArray reimburse_files = JSONArray.parseArray(files);
        reimburse.put("reimburse_files", reimburse_files);
        // 根据报销编号查询发票(报销).
        List invoice = reimburseInfoMapper.getInvoiceByReimburseCode(map);
        reimburse.put("invoice", invoice);
        return new ApiResult(0, "成功", reimburse);
    }

    /**
     * 取消关联, 设置发票中的关联id, 类型, 审核状态全部为null.
     * @param map 发票号码(invoice_no_short), 发票代码(invoice_code).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/cancelConnectInvoice", method = RequestMethod.POST)
    public ApiResult cancelConnectInvoice(@RequestBody Map map){
        // 修改人.
        String user_id = this.getColonyUserId();
        map.put("update_by", user_id);
        // 修改时间.
        map.put("update_time", new Date());
        // 修改传入参数, 对应mapper.
        map.put("invoice_no", map.get("invoice_no_short"));
        int result = invoiceInfoMapper.cancelConnectInvoice(map);
        if (result == 1) {
            return new ApiResult(0, "取消关联成功", result);
        } else {
            return new ApiResult(1, "取消关联失败", result);
        }
    }

    /**
     * 新增报销记录.
     * @param map 报销人_id(reimburse_name), 报销类别_id(reimburse_type), 报销金额(reimburse_money),
     *            备注信息(reimburse_note), 附件文件(reimburse_file), 项目编号(project_code), 发票列表(invoiceList).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/insertReimburse", method = RequestMethod.POST)
    public ApiResult insertReimburse(@RequestBody Map map) throws ParseException {
        Map map1 = new HashMap();
        // 添加id.
        map1.put("id", UUIDUtils.getUUID());
        // 添加报销编号(年月日+001往后编排).
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        String pre = sdf.format(date);
        // 获取数据库中最新的数据.
        Map latest = reimburseInfoMapper.getLatestReimburse();
        String latestCode = latest.get("code").toString();
        // 把时间和数字分开.
        String dataStr = latestCode.substring(0, 8);
        String numStr = latestCode.substring(8, latestCode.length());
        // 如果当前时间>数据库最新的dataStr, numStr从0开始.
        Date date1 = sdf.parse(dataStr);
        Date date2 = sdf.parse(pre);
        if (date2.getTime() - date1.getTime() > 0) {
            numStr = "0";
        }
        Integer suf = Integer.parseInt(numStr) + 1;
        StringBuffer sufStr = new StringBuffer();
        if (suf < 10) {
            sufStr.append("00").append(suf);
        } else if (suf < 100) {
            sufStr.append("0").append(suf);
        } else {
            sufStr.append(suf);
        }
        map1.put("code", pre + sufStr);
        // 添加人员id.
        map1.put("user_id", map.get("reimburse_name"));
        // 添加项目id.
        map1.put("project_id", map.get("project_code"));
        // 添加公司id.
        String company_id = this.getColonCompanyId();
        map1.put("company_id", company_id);
        // 添加报销类别.
        map1.put("type", map.get("reimburse_type"));
        // 添加报销金额.
        map1.put("money", map.get("reimburse_money"));
        // 添加备注说明.
        String note = map.get("reimburse_note") == null ? null : map.get("reimburse_note").toString();
        map1.put("note", note);
        // 添加附件文件.
        // 转换成JSON格式存入数据库
        String files = map.get("reimburse_file").toString();
        List<String> filesList = Arrays.asList(files.split(","));
        List reimburse_files = new ArrayList();
        if (files != "" ) {
            for (String s : filesList) {
                // 防止出现越界
                if(s.indexOf("=") != -1){
                    // 截取字符串
                    String str_1 = s.substring(0, s.indexOf("="));
                    String str_2 = s.substring(str_1.length() + 1, s.length());
                    reimburse_files.add(str_2);
                }else {
                    reimburse_files.add(s);
                }
            }
        }
        map1.put("files", JSON.toJSONString(reimburse_files));
        // 添加审核状态为未审核.
        map1.put("status", 0);
        // 添加是否删除为未删除.
        map1.put("is_delete", 0);
        // 添加人.
        String user_id = this.getColonyUserId();
        map1.put("create_by", user_id);
        // 添加时间.
        map1.put("create_time", new Date());
        int result = reimburseInfoMapper.insertReimburse(map1);
        if (result == 1) {
            // 修改发票的对应内容.
            List invoice = (List) map.get("invoiceList");
            for (int i = 0; i < invoice.size(); i++) {
                System.out.println(invoice.get(i));
                Map map2 = new HashMap();
                map2.put("connect_id", map1.get("code"));
                map2.put("status", 0);
                map2.put("type", 1);
                map2.put("update_by", user_id);
                map2.put("update_time", new Date());
                map2.put("invoice_no", ((Map)invoice.get(i)).get("invoice_no_short"));
                map2.put("invoice_code", ((Map)invoice.get(i)).get("invoice_code"));
                invoiceInfoMapper.updateInvoiceConnect(map2);
            }
            return new ApiResult(0, "添加成功", result);
        } else {
            return new ApiResult(1, "添加失败", result);
        }
    }
}