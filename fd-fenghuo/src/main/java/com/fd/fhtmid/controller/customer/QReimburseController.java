package com.fd.fhtmid.controller.customer;

import com.alibaba.fastjson.JSON;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.domain.BRiskControlSet;
import com.fd.fhtmid.mapper.BInvoiceInfoMapper;
import com.fd.fhtmid.mapper.BReimburseInfoMapper;
import com.fd.fhtmid.mapper.BRiskControlSetMapper;
import com.fd.fhtmid.mapper.ChartMapper;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * @author 徐鑫.
 * description 报销controller.
 */

@RestController
@RequestMapping(value = "/c/reimburse")
public class QReimburseController extends BaseController {

    @Autowired
    private BReimburseInfoMapper reimburseInfoMapper;
    @Autowired
    private BInvoiceInfoMapper invoiceInfoMapper;




    /**获得普通用户/主管权限下的报销列表
     * @param map  params:(项目名称or报销编号)、user_id(用户id)、page(页码) 、 pageSize（大小）
     * @return
     */
    @RequestMapping(value = "/selectAllList1", method = RequestMethod.POST)
    public ApiResult selectAllList1(@RequestBody Map map) {
        System.out.println("参数"+map);
        // 分页处理
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        List rs = reimburseInfoMapper.selectAllList1(map);
        System.out.println("报销列表1数据"+rs);
        Map<String, Object> tableDataInfo = getDataTable(rs);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**获得所有的报销列表
     * @param map  params:(项目名称or报销编号)、page(页码) 、 pageSize（大小）
     * @return
     */
    @RequestMapping(value = "/selectAllList2", method = RequestMethod.POST)
    public ApiResult selectAllList2(@RequestBody Map map) {
        System.out.println("参数"+map);
        // 分页处理
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        List rs = reimburseInfoMapper.selectAllList2(map);
        System.out.println("报销列表2数据"+rs);

        Map<String, Object> tableDataInfo = getDataTable(rs);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**获得报销详情信息
     * @param map  type_name:报销类型   bx_code:报销编号
     * @return
     */
    @RequestMapping(value = "/selectDetails", method = RequestMethod.POST)
    public ApiResult selectDetails(@RequestBody Map map) {
        System.out.println("参数"+map);
        Map bxDetails = new HashMap();
        // 报销信息
        Map rs1 = reimburseInfoMapper.selectDetails(map);
        bxDetails.put("baoxiao",rs1);
        // 报销下的发票信息
        List rs2 = reimburseInfoMapper.selectBxInvoice(map);
        bxDetails.put("bx_invoice",rs2);

        System.out.println("报销详情数据"+bxDetails);
        return new ApiResult(0, "成功", bxDetails);
    }

    /**获得我要报销中的报销项目信息
     * @param map  user_id(角色id)
     * @return
     */
    @RequestMapping(value = "/getExpendProject", method = RequestMethod.POST)
    public ApiResult getExpendProject(@RequestBody Map map) {
        System.out.println("参数"+map);
        List rs = reimburseInfoMapper.getExpendProject(map);
        System.out.println("报销详情数据"+rs);
        return new ApiResult(0, "成功", rs);
    }

    /**获得我要报销中的报销类别信息
     * @param map  user_id(角色id)
     * @return
             */
    @RequestMapping(value = "/getExpendType", method = RequestMethod.POST)
    public ApiResult getExpendType(@RequestBody Map map) {
        System.out.println("参数"+map);
        List rs = reimburseInfoMapper.getExpendType(map);
        System.out.println("报销详情数据"+rs);
        return new ApiResult(0, "成功", rs);
    }

    /**
     * 新增报销记录.
     * @param map 报销人_id(reimburse_name), 报销类别_id(reimburse_type), 报销金额(reimburse_money),
     *            备注信息(reimburse_note), 附件文件(reimburse_file), 项目编号(project_code), 发票列表(invoiceList).
     * @return 响应数据.
     */
    @RequestMapping(value = "/insertReimburse", method = RequestMethod.POST)
    public ApiResult insertReimburse(@RequestBody Map map) throws ParseException {
        System.out.println("*-**********" + map);
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
        map1.put("note", map.get("reimburse_note"));
        // 添加附件文件.
        // 转换成JSON格式存入数据库
        String filess = map.get("reimburse_file").toString();
        if( filess == "[]"){
            List a = new ArrayList();
            map1.put("files",JSON.toJSONString(a));
        }else {
        String files = filess.substring(filess.indexOf("[") + 1, filess.indexOf("]"));
        String newFiles = files.replaceAll(" ", "");
        List<String> filesList = Arrays.asList(newFiles.split(","));
        List reimburse_files = new ArrayList();
            if (newFiles != "") {
                for (String s : filesList) {
                    // 防止出现越界
                    if (s.indexOf("=") != -1) {
                        // 截取字符串
                        String str_1 = s.substring(0, s.indexOf("="));
                        String str_2 = s.substring(str_1.length() + 1, s.length());
                        reimburse_files.add(str_2);
                    } else {
                        reimburse_files.add(s);
                    }
                }
            }
            map1.put("files", JSON.toJSONString(reimburse_files));
            System.out.println("-----------files" + JSON.toJSONString(reimburse_files));
        }
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
                    map2.put("invoice_no", ((Map) invoice.get(i)).get("invoice_no_short"));
                    map2.put("invoice_code", ((Map) invoice.get(i)).get("invoice_code"));
                    invoiceInfoMapper.updateInvoiceConnect(map2);
                }
                Map map2 = new HashMap();
                map2.put("code",map1.get("code"));
                map2.put("result",result);
                return new ApiResult(0, "添加成功", map2);
            } else {
                return new ApiResult(1, "添加失败", result);
            }
        }



    
}
