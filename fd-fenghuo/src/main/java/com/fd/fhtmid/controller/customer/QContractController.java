
package com.fd.fhtmid.controller.customer;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.domain.BContractInfo;
import com.fd.fhtmid.mapper.BContractInfoMapper;
import com.fd.fhtmid.service.ContractService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * @author 徐鑫.
 *  ContractController.
 */

@Controller
@RequestMapping("/c/contract")
public class QContractController extends BaseController {

    private final Logger logger = LoggerFactory.getLogger(QContractController.class);

    @Autowired
    private BContractInfoMapper contractInfoMapper;

    @Autowired
    private ContractService contractService;

    /**
     * 获取所有合同信息
     * @param map 参数
     * @return  合同列表
     */
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
        public ApiResult list(@RequestBody Map map) {

            System.out.println("****************************请求参数****************************");
            System.out.println(map);
            System.out.println("****************************请求参数****************************");
            // 得到页面的参数，名称与前端传过来要一致
            Map<String, Object> map1 = new HashMap<String, Object>();
            map1.put("risk_level", ((Map) map.get("queryParams")).get("risk_level"));
            map1.put("contract_params", ((Map) map.get("queryParams")).get("contract_params"));
            map1.put("company_id", map.get("company_id"));
            map1.put("create_by", map.get("user_id"));
            System.out.println("****************************传递给接口的参数****************************");
            System.out.println(map1);
            System.out.println("****************************传递给接口的参数****************************");
            // 分页处理
            startPage((int) map.get("page"), (int) map.get("pageSize"));
            // 得到数据库内容, 封装后, 返回页面.
            List<BContractInfo> contractInfoList = contractInfoMapper.selectListAll(map1);
            System.out.println(contractInfoList);
            Map<String, Object> tableDataInfo = getDataTable(contractInfoList);
            ApiResult apiResult = new ApiResult(0, "成功", tableDataInfo);
            return apiResult;
        }

    /**
     * 获取合同详情
     * @param map 参数
     * @return  具体某个合同信息
     */
    @RequestMapping(value = "/getContractByName", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult getContractByName(@RequestBody Map map) {

        System.out.println("****************************请求参数****************************");
        System.out.println(map);
        System.out.println("****************************请求参数****************************");
        // 得到页面的参数
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("contract_code",map.get("code"));
        map1.put("contract_name",map.get("name"));
        map1.put("company_id",map.get("company_id"));
        System.out.println("****************************传递给接口的参数****************************");
        System.out.println(map1);
        System.out.println("****************************传递给接口的参数****************************");
        // 获取合同内容
        Map contract = contractInfoMapper.getContractByName(map1);
        Map<String, Object> contractDetail = new HashMap<String, Object>();
        contractDetail.put("contract", contract);
        // 获取合同文件
        String s1 = contractInfoMapper.getContractFiles(map1);
        JSONArray contact_files = JSONArray.parseArray(s1);
        contractDetail.put("files", contact_files);
        // 获取业务发起相关信息及文档---邮件、短信或其他信息1
        String s2 = contractInfoMapper.getContractLinkInfo(map1);
        JSONArray link_info = JSONArray.parseArray(s2);
        contractDetail.put("link_info", link_info);
        // 获取业务发起相关信息及文档---发起文档等材料
        String s3 = contractInfoMapper.getContractDocs(map1);
        JSONArray docs = JSONArray.parseArray(s3);
        contractDetail.put("docs", docs);
        // 获取业务完成信息及文档---邮件、短信或其他信息2
        String s4 = contractInfoMapper.getContractBLinkInfo(map1);
        JSONArray b_link_info = JSONArray.parseArray(s4);
        contractDetail.put("b_link_info", b_link_info);
        // 获取业务完成信息及文档---完成文档等材料
        String s5 = contractInfoMapper.getContractFDocs(map1);
        JSONArray f_docs = JSONArray.parseArray(s5);
        contractDetail.put("f_docs", f_docs);
        // 真实交易记录材料---记账凭证记录
        String s6 = contractInfoMapper.getContractFRecord(map1);
        JSONArray f_record = JSONArray.parseArray(s6);
        contractDetail.put("f_record", f_record);
        // 真实交易记录材料---银行流水记录
        String s7 = contractInfoMapper.getContractBRecord(map1);
        JSONArray b_record = JSONArray.parseArray(s7);
        contractDetail.put("b_record", b_record);
        // 真实交易记录材料---交易账册记录
        String s8 = contractInfoMapper.getContractSRecord(map1);
        JSONArray s_record = JSONArray.parseArray(s8);
        contractDetail.put("s_record", s_record);
        // 获取对方联系方式
        String s9 = contractInfoMapper.getContact(map1);
        JSONArray t_link_info = JSONArray.parseArray(s9);
        contractDetail.put("t_link_info", t_link_info);
        System.out.println("详情数据"+ contractDetail);
        ApiResult apiResult = new ApiResult(0, "成功", contractDetail);
        return apiResult;
    }

    /**
     * 添加合同
     * @param map 参数
     * @return  合同列表
     */
    @RequestMapping(value = "/addContract", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult addContract(@RequestBody Map map) {
        Map<String, Object> map1 = new HashMap<String, Object>();
        String user_id = this.getColonyUserId();
        map1.put("create_by", user_id);
        map1.put("contract_code", map.get("contract_code"));
        map1.put("contract_name", map.get("contract_name"));
        return contractService.insert(map1);
    }

    /**
     * 编辑合同状态
     * @param map 参数
     * @return  合同列表
     */
    @RequestMapping(value = "/updateContractStauts", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult updateContractStauts(@RequestBody Map map) {

        // 得到页面的参数
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("contract_name",map.get("name"));
        map1.put("status","02");
        // 得到数据库内容, 封装后, 返回页面.
        Integer data = contractInfoMapper.changeContract(map1);
        ApiResult apiResult = new ApiResult(0, "成功", data);
        return apiResult;
    }


    /**
     * 合同变更关联
     * @param map 参数
     * @return  具体变更的合同详情页面
     */
    @RequestMapping(value = "/updateContractProject", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult updateContractProject(@RequestBody Map map) {

        // 得到页面的参数，直接拿参数
        System.out.println("页面所传参数"+map);
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("project_code",map.get("project_code"));
        map1.put("contract_name",map.get("name"));
        // 得到数据库内容, 封装后, 返回页面.
        System.out.println("传递给接口的参数"+map1);
        Integer data = contractInfoMapper.changeContract(map1);
        if (data == 1){
            return new ApiResult(0, "变更关联成功", data);
        }else{
            return new ApiResult(1, "变更关联失败", data);
        }
    }

    /**
     * 获取发票信息列表
     * @param map 参数
     * @return  具合同详情页面
     */
    @RequestMapping(value = "/contractInvoice", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult contractInvoice(@RequestBody Map map) {

        // 得到页面的参数，直接拿参数
        Map<String, Object> map1 = new HashMap<String, Object>();
        // 自定义参数名contract_name+所传参数名name
        map1.put("contract_name",map.get("name"));
        // 得到数据库内容, 封装后, 返回页面.
        List data = contractInfoMapper.queryInvoice(map1);
        ApiResult apiResult = new ApiResult(0, "成功", data);
        return apiResult;
    }

    /**
     * 取消发票关联的合同
     * @param map 参数
     * @return  具合同详情页面
     */
    @RequestMapping(value = "/updateInvoice", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult updateInvoice(@RequestBody Map map) {

        // 得到页面的参数，直接拿参数
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("invoice_no_short",map.get("invoice_no_short"));
        // 得到数据库内容, 封装后, 返回页面.
        Integer data = contractInfoMapper.updateInvoice(map1);
        if (data == 1){
            return new ApiResult(0, "取消关联成功", data);
        }else{
            return new ApiResult(1, "取消关联失败", data);
        }
    }


    /**
     * 编辑合同的内容
     * @param map 参数
     * @return  具合同详情页面
     */
    @RequestMapping(value = "/updateContract", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult updateContract(@RequestBody Map map) throws ParseException {

        // 得到页面的参数，直接拿参数
        Map<String, Object> map1 = new HashMap<String, Object>();
        Map<String, Object> map2 = new HashMap<String, Object>();
        System.out.println("所传参数:"+map);
        // 合同名称
        map2.put("contract_name", map.get("name"));
        // 合同相关数据
        // 合同文件
        map1.put("files",map.get("contract_files"));
        // 转换成josn格式存入数据库
        String str1 = (String) map1.get("files");
        List<String> result1 = Arrays.asList(str1.split(","));
        List contract_files = new ArrayList();
        if (str1 != "") {
            for (String s : result1) {
                String str_1 = s.substring(0, s.indexOf("="));
                String str_2 = s.substring(str_1.length() + 1, s.length());
                contract_files.add(str_2);
            }
        }
        map2.put("files", JSON.toJSONString(contract_files));
        // 销售方企业名称
        map2.put("supplier_name", map.get("supplier_name"));
        //货物或应税劳务
        map2.put("service_name", map.get("invoice_classification"));
        // 合同金额
        map2.put("contract_money", map.get("contract_money"));
        // 签约时间.
        map1.put("sign_date", map.get("contract_date"));
        String time1 = (String) map1.get("sign_date");
        if (time1 != null){
            SimpleDateFormat formatter1 = new SimpleDateFormat("yyyy-MM-dd");
            Date date1 = formatter1.parse(time1);
            SimpleDateFormat sdf1=new SimpleDateFormat("yyyy-MM-dd");
            map2.put("sign_date", sdf1.format(date1));
        }
        map2.put("solve_type", map.get("solve_way"));
        // 内部审核
        // 业务主办人
        map2.put("sponsor", map.get("business_sponsor"));
        // 业务主管
        map2.put("leader", map.get("business_director"));
        // 财务审核
        map2.put("f_auditor", map.get("financial_audit"));
        // 业务审核人
        map2.put("b_auditor", map.get("business_audit"));
        // 业务沟通
        // 业务发起相关信息及文档----邮件、短信或其他信息
        map1.put("link_info", map.get("contract_business1"));
        String str2 = (String) map1.get("link_info");
        List<String> result2 = Arrays.asList(str2.split(","));
        List link_info = new ArrayList();
        if (str2 != "") {
            for (String s : result2) {
                String str11 = s.substring(0, s.indexOf("="));
                String str22 = s.substring(str11.length() + 1, s.length());
                link_info.add(str22);
            }
        }
        map2.put("link_info", JSON.toJSONString(link_info));
        // 业务发起相关信息及文档-----发起文档等材料
        map1.put("docs", map.get("contract_business2"));
        String str3 = (String) map1.get("docs");
        List<String> result3 = Arrays.asList(str3.split(","));
        List docs = new ArrayList();
        if (str3 != "") {
            for (String s : result3) {
                String str11 = s.substring(0, s.indexOf("="));
                String str22 = s.substring(str11.length() + 1, s.length());
                docs.add(str22);
            }
        }
        map2.put("docs", JSON.toJSONString(docs));
        // 业务完成信息及文档---邮件、短信或其他信息
        map1.put("b_link_info", map.get("contract_finish1"));
        String str4 = (String) map1.get("b_link_info");
        List<String> result4 = Arrays.asList(str4.split(","));
        List b_link_info = new ArrayList();
        if (str4 != "") {
            for (String s : result4) {
                String str11 = s.substring(0, s.indexOf("="));
                String str22 = s.substring(str11.length() + 1, s.length());
                b_link_info.add(str22);
            }
        }
        map2.put("b_link_info", JSON.toJSONString(b_link_info));
        // 业务完成信息及文档---完成文档等材料
        map1.put("f_docs", map.get("contract_finish2"));
        String str5 = (String) map1.get("f_docs");
        List<String> result5 = Arrays.asList(str5.split(","));
        List f_docs = new ArrayList();
        if (str5 != "") {
            for (String s : result5) {
                String str11 = s.substring(0, s.indexOf("="));
                String str22 = s.substring(str11.length() + 1, s.length());
                f_docs.add(str22);
            }
        }
        map2.put("f_docs", JSON.toJSONString(f_docs));
        // 真实交易记录材料----记账凭证记录
        map1.put("f_record", map.get("contract_record1"));
        String str6 = (String) map1.get("f_record");
        List<String> result6 = Arrays.asList(str6.split(","));
        List f_record = new ArrayList();
        if (str6 != "") {
            for (String s : result6) {
                String str11 = s.substring(0, s.indexOf("="));
                String str22 = s.substring(str11.length() + 1, s.length());
                f_record.add(str22);
            }
        }
        map2.put("f_record", JSON.toJSONString(f_record));
        // 真实交易记录材料----银行流水记录
        map1.put("b_record", map.get("contract_record2"));
        String str7 = (String) map1.get("b_record");
        List<String> result7 = Arrays.asList(str7.split(","));
        List b_record = new ArrayList();
        if (str7 != "") {
            for (String s : result7) {
                String str11 = s.substring(0, s.indexOf("="));
                String str22 = s.substring(str11.length() + 1, s.length());
                b_record.add(str22);
            }
        }
        map2.put("b_record", JSON.toJSONString(b_record));
        // 真实交易记录材料----交易账册记录
        map1.put("s_record", map.get("contract_record3"));
        String str8 = (String) map1.get("s_record");
        List<String> result8 = Arrays.asList(str8.split(","));
        List s_record = new ArrayList();
        if (str8 != "") {
            for (String s : result8) {
                String str11 = s.substring(0, s.indexOf("="));
                String str22 = s.substring(str11.length() + 1, s.length());
                s_record.add(str22);
            }
        }
        map2.put("s_record", JSON.toJSONString(s_record));
        // 交付信息
        // 完成时间.
        map1.put("f_time", map.get("delivery_date"));
        String time2 = (String) map1.get("f_time");
        if (time2 != null){
            SimpleDateFormat formatter2 = new SimpleDateFormat("yyyy-MM-dd");
            Date date2 = formatter2.parse(time2);
            SimpleDateFormat sdf2=new SimpleDateFormat("yyyy-MM-dd");
            map2.put("f_time", sdf2.format(date2));
        }
        // 收款方及银行流水
        map2.put("receive_b_record", map.get("bank_water"));
        // 争议事项
        map2.put("dispute_item", map.get("controversial_issues"));
        // 对方联系方式
        List t_link_info_list = (List) map.get("t_link_info");
        map2.put("t_link_info",JSON.toJSONString(t_link_info_list));
        System.out.println("接口所传参数map2:"+map2);
        // 得到数据库内容, 封装后, 返回页面.
        Integer data = contractInfoMapper.updateContract(map2);
        if (true) {
            return new ApiResult(0, "保存成功", map2);
        } else {
            return new ApiResult(1, "编辑失败", map2);
        }
    }

}

