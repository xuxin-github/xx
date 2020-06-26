package com.fd.fhtmid.controller.platform;

import com.alibaba.fastjson.JSONArray;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.*;
import com.fd.fhtmid.service.ContractService;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * @author 秦朗.
 * description 项目controller.
 */

@RestController
@RequestMapping(value = "/p/project")
public class ProjectController extends BaseController {
    @Autowired
    private BProjectInfoMapper projectInfoMapper;

    @Autowired
    private ContractService contractService;

    @Autowired
    private BUserInfoMapper userInfoMapper;

    @Autowired
    private BReimburseInfoMapper reimburseInfoMapper;

    @Autowired
    private BInvoiceInfoMapper invoiceInfoMapper;

    /**
     * 项目列表.
     * @param map 前端传过来的参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/projectList", method = RequestMethod.POST)
    public ApiResult projectList(@RequestBody Map map){
        // 得到页面传过来的参数, 名称与页面设定一致.
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("project_name", ((Map) map.get("queryParams")).get("project_name"));
        // 接收用户权限和用户账号名称.
        map1.put("role_code", map.get("role_code"));
        map1.put("username", map.get("username"));
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        // 得到数据库内容, 封装后, 返回页面.
        List projectInfoList = projectInfoMapper.findProject(map1);
        Map<String, Object> tableDataInfo = getDataTable(projectInfoList);
        tableDataInfo.put("project_name", ((Map) map.get("queryParams")).get("project_name"));
        ApiResult apiResult = new ApiResult(0, "成功", tableDataInfo);
        return apiResult;
    }

    /**
     * 获取指定项目.
     * @param map 项目编号(project_code), 项目名称(project_name).
     * @return 响应数据.
     */
    @RequestMapping(value = "/getProjectByName", method = RequestMethod.GET)
    public ApiResult getProjectByName(@RequestParam Map map){
        // 得到页面传过来的参数, 名称与页面设定一致.
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("project_code", map.get("project_code"));
        map1.put("project_name", map.get("project_name"));
        // 响应页面请求.
        Map<String, Object> projectD = new HashMap<String, Object>();
        // 获取项目的基本信息.
        Map project = projectInfoMapper.getProjectByCode(map1);
        // 把项目标签转为数组格式.
        String tag = project.get("project_tag") == null ? "" : project.get("project_tag").toString();
        JSONArray project_tag = JSONArray.parseArray(tag);
        project.put("project_tag", project_tag);
        projectD.put("project", project);
        // 获取项目的合同信息.
        List contract = projectInfoMapper.getProjectContract(map1);
        projectD.put("contract", contract);
        // 获取通过的发票数量和金额.
        Map<String, String> invoice_count_money = projectInfoMapper.getInvoiceByProjectCode(map1);
        projectD.put("invoice_count_money", invoice_count_money);
        // 获取公司id.
        String company_id = this.getColonCompanyId();
        map1.put("company_id", company_id);
        // 获取项目中的合同信息中的得分预警值.
        Map score = projectInfoMapper.getCompanyScore(map1);
        String p3_1_1 = score.get("p3_1_1").toString();
        String p3_1_2 = score.get("p3_1_2").toString();
        String p3_1_3 = score.get("p3_1_3").toString();
        String p3_1_4 = score.get("p3_1_4").toString();
        String p3_1_5 = score.get("p3_1_5").toString();
        String p3_2_1 = score.get("p3_2_1").toString();
        String p3_2_2 = score.get("p3_2_2").toString();
        String p3_2_3 = score.get("p3_2_3").toString();
        String p3_2_4 = score.get("p3_2_4").toString();
        String p3_2_5 = score.get("p3_2_5").toString();
        String p3_2_6 = score.get("p3_2_6").toString();
        String p3_3_1 = score.get("p3_3_1").toString();
        String p3_3_2 = score.get("p3_3_2").toString();
        String p3_3_3 = score.get("p3_3_3").toString();
        String p3_3_4 = score.get("p3_3_4").toString();
        String p3_3_5 = score.get("p3_3_5").toString();
        String p3_3_6 = score.get("p3_3_6").toString();
        String p3_3_7 = score.get("p3_3_7").toString();
        String p3_3_8 = score.get("p3_3_8").toString();
        String p3_3_9 = score.get("p3_3_9").toString();
        String p3_3_10 = score.get("p3_3_10").toString();
        String p3_3_11 = score.get("p3_3_11").toString();
        String p3_3_12 = score.get("p3_3_12").toString();
        String p3_3_13 = score.get("p3_3_13").toString();
        String p3_3_14 = score.get("p3_3_14").toString();
        String p3_3_15 = score.get("p3_3_15").toString();
        String p3_3_16 = score.get("p3_3_16").toString();
        String p3_3_17 = score.get("p3_3_17").toString();
        String p3_3_18 = score.get("p3_3_18").toString();
        String p3_3_19 = score.get("p3_3_19").toString();
        String p3_3_20 = score.get("p3_3_20").toString();
        String p3_3_21 = score.get("p3_3_21").toString();
        String p3_4_1 = score.get("p3_4_1").toString();
        String p3_4_2 = score.get("p3_4_2").toString();
        String p3_4_3 = score.get("p3_4_3").toString();
        String p3_4_4 = score.get("p3_4_4").toString();
        String p3_4_5 = score.get("p3_4_5").toString();
        String p3_4_6 = score.get("p3_4_6").toString();
        // 税务合规总分.
        Double tax = Double.parseDouble(p3_1_1) + Double.parseDouble(p3_1_2) + Double.parseDouble(p3_1_3) + Double.parseDouble(p3_1_4) + Double.parseDouble(p3_1_5);
        // 市场监管总分.
        Double market = Double.parseDouble(p3_2_1) + Double.parseDouble(p3_2_2) + Double.parseDouble(p3_2_3) + Double.parseDouble(p3_2_4) + Double.parseDouble(p3_2_5)
                      + Double.parseDouble(p3_2_6);
        // 内部合规总分.
        Double internal = Double.parseDouble(p3_3_1) + Double.parseDouble(p3_3_2) + Double.parseDouble(p3_3_3) + Double.parseDouble(p3_3_4) + Double.parseDouble(p3_3_5)
                        + Double.parseDouble(p3_3_6) + Double.parseDouble(p3_3_7) + Double.parseDouble(p3_3_8) + Double.parseDouble(p3_3_9) + Double.parseDouble(p3_3_10)
                        + Double.parseDouble(p3_3_11) + Double.parseDouble(p3_3_12) + Double.parseDouble(p3_3_13) + Double.parseDouble(p3_3_14) + Double.parseDouble(p3_3_15)
                        + Double.parseDouble(p3_3_16) + Double.parseDouble(p3_3_17) + Double.parseDouble(p3_3_18) + Double.parseDouble(p3_3_19) + Double.parseDouble(p3_3_20)
                        + Double.parseDouble(p3_3_21);
        // 供应商总分.
        Double supplier = Double.parseDouble(p3_4_1) + Double.parseDouble(p3_4_2) + Double.parseDouble(p3_4_3) + Double.parseDouble(p3_4_4) + Double.parseDouble(p3_4_5)
                        + Double.parseDouble(p3_4_6);
        score.put("tax", tax);
        score.put("market", market);
        score.put("internal", internal);
        score.put("supplier", supplier);
        projectD.put("score", score);
        // 获取项目中的发票信息.
        List invoice = projectInfoMapper.getProjectInvoice(map1);
        projectD.put("invoice", invoice);
        // 获取项目中的报销信息.
        List reimburse = projectInfoMapper.getProjectReimburse(map1);
        projectD.put("reimburse", reimburse);
        // 获取通过的报销数量和报销金额.
        Map<String, String> reimburse_count_money = projectInfoMapper.getReimburseByProjectCode(map1);
        projectD.put("reimburse_count_money", reimburse_count_money);
        // 获取已通过的报销记录中的发票.
        List passReimburse = projectInfoMapper.getProjectPassReimburse(map1);
        projectD.put("passReimburse", passReimburse);
        ApiResult apiResult = new ApiResult(0, "成功", projectD);
        return apiResult;
    }

    /**
     * 新增项目.
     * @param map 页面参数.
     * @return  响应数据.
     */
    @Transactional
    @RequestMapping(value = "/insertProject", method = RequestMethod.POST)
    public ApiResult insertProject(@RequestBody Map map){
        // 判断传入的项目名是否已存在.
        Map get = projectInfoMapper.getProjectByBasicName(map);
        // 存在, 则提醒项目名已存在; 不存在, 则新增.
        if(get == null){
            // 得到页面传过来的参数, 名称与页面设定一致.
            Map<String, Object> map1 = new HashMap<String, Object>();
            map1.put("project_name", map.get("project_name"));
            // 添加项目预算.
            map1.put("project_budget", map.get("project_budget"));
            // 添加项目标签.
            String project_tag = JSONArray.toJSONString(map.get("project_tag"));
            map1.put("project_tag", project_tag);
            // 添加当前时间.
            map1.put("create_time", new Date());
            // 添加UUID。
            map1.put("id", UUIDUtils.getUUID());
            // 设置project_code与id值相同.
            map1.put("project_code", map1.get("id"));
            // 添加是否删除.
            map1.put("is_delete", 0);
            // 添加用户id.
            String user_id = this.getColonyUserId();
            map1.put("create_by", user_id);
            // 添加发起人.
            Map map2 = new HashMap();
            map2.put("id", user_id);
            Map user = userInfoMapper.getPersonnelById(map2);
            map1.put("initiator", user.get("name"));
            // 添加发起部门.
            map1.put("dept_id", user.get("dept_id"));
            // 添加审核状态.
            map1.put("status", 0);
            // 新增, 返回1, 成功; 0, 失败.
            int result = projectInfoMapper.insertProject(map1);
            // 判断新增是否成功.
            if(result == 1){
                ApiResult apiResult = new ApiResult(0, "新增成功", result);
                return apiResult;
            }else{
                return new ApiResult(1, "新增失败", result);
            }
        }else{
            return new ApiResult(2, "项目名称已存在！", "");
        }
    }

    /**
     * 修改审核状态.
     * @param map 项目名称(project_name).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
    public ApiResult updateStatus(@RequestBody Map map){
        // 修改人.
        String user_id = this.getColonyUserId();
        map.put("update_by", user_id);
        // 修改时间.
        map.put("update_time", new Date());
        int result = projectInfoMapper.updateStatus(map);
        if (result == 1) {
            return new ApiResult(0, "修改成功", result);
        } else {
            return new ApiResult(1, "修改失败", result);
        }
    }

    /**
     * 修改项目基本信息.
     * @param map 基本信息, 项目编号(project_code).
     * @return 响应信息.
     */
    @Transactional
    @RequestMapping(value = "/updateBasicProject", method = RequestMethod.POST)
    public ApiResult updateBasicProject(@RequestBody Map map){
        // 提取修改信息.
        Map map1 = new HashMap();
        map1.put("project_name", map.get("project_name"));
        map1.put("project_budget", map.get("project_budget"));
        String project_tag = JSONArray.toJSONString(map.get("project_tag"));
        map1.put("project_tag", project_tag);
        map1.put("project_code", map.get("project_code"));
        // 修改人.
        String user_id = this.getColonyUserId();
        map1.put("update_by", user_id);
        // 修改时间.
        map1.put("update_time", new Date());
        int result = projectInfoMapper.updateBasicProject(map1);
        if (result == 1) {
            return new ApiResult(0, "修改成功", result);
        } else {
            return new ApiResult(1, "修改失败", result);
        }
    }

    /**
     * 添加合同.
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/insertProjectContract", method = RequestMethod.POST)
    public ApiResult insertProjectContract(@RequestBody Map map){
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("contract_code", map.get("contract_code"));
        map1.put("contract_name", map.get("contract_name"));
        map1.put("project_id", map.get("project_code"));
        String company_id = this.getColonCompanyId();
        map1.put("company_id", company_id);
        String user_id = this.getColonyUserId();
        map1.put("create_by", user_id);
        // 添加合同标签.
        String contract_tag = JSONArray.toJSONString(map.get("contract_tag"));
        map1.put("contract_tag", contract_tag);
        return contractService.insert(map1);
    }

    /**
     * 取消关联.
     * @param map 页面参数.
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/updateProject", method = RequestMethod.POST)
    public ApiResult updateRelevance(@RequestBody Map map){
        // 得到页面传过来的参数, 名称与页面设定一致.
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("contract_code", map.get("contract_code"));
        // 修改时间.
        map1.put("update_time", new Date());
        // 修改人.
        String user_id = this.getColonyUserId();
        map1.put("update_by", user_id);
        // 得到数据库内容, 封装后, 返回页面.
        int result = projectInfoMapper.updateProject(map1);
        // 判断取消关联是否成功.
        if(result == 1){
            return new ApiResult(0, "取消关联成功", result);
        }else{
            return new ApiResult(1, "取消关联失败", result);
        }
    }

    /**
     * 修改发票审核状态.
     * @param map 发票号码(invoice_no), 发票代码(invoice_code), 状态(status).
     * @return 响应信息.
     */
    @Transactional
    @RequestMapping(value = "/updateInvoiceStatus", method = RequestMethod.POST)
    public ApiResult updateInvoiceStatus(@RequestBody Map map){
        // 修改人.
        String user_id = this.getColonyUserId();
        map.put("update_by", user_id);
        // 修改时间.
        map.put("update_time", new Date());
        int result = projectInfoMapper.updateInvoiceStatus(map);
        if (result == 1) {
            return new ApiResult(0, "审核成功", result);
        } else {
            return new ApiResult(1, "审核失败", result);
        }
    }

    /**
     * 删除发票(取消关联).
     * @param map 发票号码(invoice_no), 发票代码(invoice_code).
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
        int result = invoiceInfoMapper.cancelConnectInvoice(map);
        if (result == 1) {
            return new ApiResult(0, "取消关联成功", result);
        } else {
            return new ApiResult(1, "取消关联失败", result);
        }
    }

    /**
     * 修改报销记录和发票的审核状态.
     * @param map 报销编号(reimburse_code), 状态(status).
     * @return 响应信息.
     */
    @Transactional
    @RequestMapping(value = "/updateReimburseInvoiceStatus", method = RequestMethod.POST)
    public ApiResult updateReimburseInvoiceStatus(@RequestBody Map map){
        // 修改人.
        String user_id = this.getColonyUserId();
        map.put("update_by", user_id);
        // 修改时间.
        map.put("update_time", new Date());
        // 先修改对应报销编号的报销记录的审核状态.
        int reimburse = reimburseInfoMapper.updateReimburseStatus(map);
        // 再根据报销编号查出该报销记录下所有的发票.
        List invoices = reimburseInfoMapper.getInvoiceByReimburse(map);
        // 批量修改发票的审核状态.
        Integer resluts = null;
        // 获取审核状态.
        String status = map.get("status").toString();
        // 通过, 修改发票审核状态为1; 驳回, 则把此报销下的所有发票取消关联.
        if (status.equals("1")) {
            if (invoices.size() > 0) {
                resluts = 0;
                for (int i = 0 ; i < invoices.size(); i++) {
                    ((Map)invoices.get(i)).put("invoice_no", ((Map)invoices.get(i)).get("invoice_no_short"));
                    ((Map)invoices.get(i)).put("update_by", user_id);
                    ((Map)invoices.get(i)).put("update_time", new Date());
                    ((Map)invoices.get(i)).put("status", map.get("status"));
                    int reslut = projectInfoMapper.updateInvoiceStatus(((Map)invoices.get(i)));
                    resluts+=reslut;
                }
            } else {
                resluts = 0;
            }
        } else {
            if (invoices.size() > 0) {
                resluts = 0;
                for (int i = 0 ; i < invoices.size(); i++) {
                    ((Map)invoices.get(i)).put("invoice_no", ((Map)invoices.get(i)).get("invoice_no_short"));
                    ((Map)invoices.get(i)).put("update_by", user_id);
                    ((Map)invoices.get(i)).put("update_time", new Date());
                    int reslut = invoiceInfoMapper.cancelConnectInvoice(((Map)invoices.get(i)));
                    resluts+=reslut;
                }
            } else {
                resluts = 0;
            }
        }
        if (reimburse == 1 && resluts == invoices.size()) {
            return new ApiResult(0, "审核成功", "");
        } else {
            return new ApiResult(1, "审核失败", "");
        }
    }

    /**
     * 删除报销记录(与项目取消关联).
     * @param map 报销编号(reimburse_code).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/cancelConnectReimburseInvoice", method = RequestMethod.POST)
    public ApiResult cancelConnectReimburseInvoice(@RequestBody Map map){
        // 修改人.
        String user_id = this.getColonyUserId();
        map.put("update_by", user_id);
        // 修改时间.
        map.put("update_time", new Date());
        // 先取消报销记录与项目的关联.
        int reimburse = reimburseInfoMapper.cancelConnectReimburse(map);
        // 再根据报销编号查出该报销记录下所有的发票.
        List invoices = reimburseInfoMapper.getInvoiceByReimburse(map);
        // 批量取消发票与报销记录的关联.
        Integer resluts = null;
        if (invoices.size() > 0) {
            resluts = 0;
            for (int i = 0 ; i < invoices.size(); i++) {
                ((Map)invoices.get(i)).put("invoice_no", ((Map)invoices.get(i)).get("invoice_no_short"));
                ((Map)invoices.get(i)).put("update_by", user_id);
                ((Map)invoices.get(i)).put("update_time", new Date());
                int reslut = invoiceInfoMapper.cancelConnectInvoice(((Map)invoices.get(i)));
                resluts+=reslut;
            }
        } else {
            resluts = 0;
        }
        if (reimburse == 1 && resluts == invoices.size()) {
            return new ApiResult(0, "取消关联成功", "");
        } else {
            return new ApiResult(1, "取消关联失败", "");
        }
    }
}