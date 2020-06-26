
package com.fd.fhtmid.controller.platform;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.common.constant.InvoiceCatalog;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BContractInfoMapper;
import com.fd.fhtmid.mapper.BInvoiceInfoMapper;
import com.fd.fhtmid.mapper.BProviderInfoMapper;
import com.fd.fhtmid.mapper.ChartMapper;
import com.fd.fhtmid.service.*;
import com.fd.fhtmid.utils.UUIDUtils;
import com.fd.fhtmid.utils.third.ZhengXinUtil;
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
 * ContractController.
 */

@Controller
@RequestMapping("/p/invoice")
public class InvoiceController extends BaseController {

    private final Logger logger = LoggerFactory.getLogger(InvoiceController.class);

    @Autowired
    private BInvoiceInfoMapper invoiceInfoMapper;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private ContractService contractService;

    @Autowired
    private SystemService systemService;

    @Autowired
    private BContractInfoMapper contractInfoMapper;

    @Autowired
    private MessageService messageService;

    /**
     * 获取发票详情
     *
     * @param map 参数
     * @return 具体某个发票信息
     */
    @RequestMapping(value = "/getInvoiceByNo", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult getInvoiceByNo(@RequestBody Map map) {

        System.out.println("****************************请求参数****************************");
        System.out.println(map);
        // 得到页面的参数
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("invoice_no_short", map.get("invoice_no_short"));
        map1.put("invoice_code", map.get("invoice_code"));
        System.out.println("****************************传递给接口的参数****************************");
        System.out.println(map1);
        // 获取发票内容
        Map invoice = invoiceInfoMapper.getInvoiceByNo(map1);
        Map<String, Object> invoiceDetail = new HashMap<String, Object>();
        invoiceDetail.put("invoice", invoice);
        // 获取货物或应税劳务、服务名称信息.
        String s = invoiceInfoMapper.getServices(map1);
        JSONArray services = JSONArray.parseArray(s);
        invoiceDetail.put("services", services);
        ApiResult apiResult = new ApiResult(0, "成功", invoiceDetail);
        return apiResult;
    }

    /**
     * 发票变更关联时下拉框的合同列表.
     *
     * @param map 供应商名称.
     * @return 响应数据.
     */
    @RequestMapping(value = "/findAllContractList", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult findAllContractList(@RequestBody Map map) {
        List allContract = invoiceInfoMapper.findAllContractName(map);
        if (allContract.isEmpty()) {
            return new ApiResult(0, "成功", new ArrayList<>());
        } else {
            return new ApiResult(0, "成功", allContract);
        }
    }

    /**
     * 发票变更关联.
     *
     * @param map 合同编号(之前的和现在的), 发票编号.
     * @return 响应数据.
     */
    @RequestMapping(value = "/updateInvoiceContract", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult updateInvoiceContract(@RequestBody Map map) {
        // 有可能contract_before_code为null, 则像新增时直接关联发票一致, 否则, 循环两次.
        if (map.get("contract_before_code") == null) {
            return insertConnectContract(map);
        } else {
            int result = invoiceInfoMapper.updateInvoiceContractId(map);
            if (result == 1) {
                // 两张合同都要修改所有评分.
                ArrayList arr = new ArrayList();
                arr.add(map.get("contract_code"));
                arr.add(map.get("contract_before_code"));
                Map map1 = new HashMap();
                for (int i = 0; i < arr.size(); i++) {
                    map1.put("contract_code", arr.get(i));
                    // 根据合同编号获取合同名称.
                    Map contract = contractInfoMapper.findContractByCode(map1);
                    map1.put("contract_name", contract.get("name"));
                    // 变更后, 如果合同下没有发票, 则把供应商评分改为0.
                    if (Integer.parseInt(invoiceInfoMapper.findInvoiceCount(map1).get("number").toString()) == 0) {
                        contractInfoMapper.updateContractProviderScoreNull(map1);
                    } else {
                        Map map2 = new HashMap();
                        Map score = invoiceInfoMapper.findContractCodeAndProviderScore(map1);
                        System.out.println("map1" + map1);
                        System.out.println("score" + score);
                        map2.put("contract_name", score.get("name"));
                        map2.put("providerScore", score.get("score"));
                        map2.put("p3_4_1", score.get("p3_4_1"));
                        map2.put("p3_4_2", score.get("p3_4_2"));
                        map2.put("p3_4_3", score.get("p3_4_3"));
                        map2.put("p3_4_4", score.get("p3_4_4"));
                        map2.put("p3_4_5", score.get("p3_4_5"));
                        map2.put("p3_4_6", score.get("p3_4_6"));
                        contractInfoMapper.updateContractProviderScore(map2);
                    }
                    String company_id = this.getColonCompanyId();
                    map1.put("company_no", company_id);
                    // 修改合同中的市场监管评分.
                    map1.put("flag", "1");
                    Double marketScore = systemService.marketScore(map1);
                    map1.put("marketScore", marketScore);
                    contractInfoMapper.updateContractMarketScore(map1);
                    // 修改合同中的税务合规评分.
                    Double taxScore = systemService.taxScore(map1);
                    map1.put("taxScore", taxScore);
                    contractInfoMapper.updateContractTaxScore(map1);
                    // 修改合同中的风险等级.
                    contractService.updateLevel(map1);

                }
                return new ApiResult(0, "关联成功", result);
            } else {
                return new ApiResult(1, "关联失败", result);
            }
        }
    }

    /**
     * 新增发票.
     *
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/insertInvoice", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult insertInvoice(@RequestBody Map map) throws ParseException {
        String user_id = this.getColonyUserId();
        map.put("create_by", user_id);
        Map reslut = invoiceService.insert(map);
        if (reslut.get("code").equals(3)) {
            return new ApiResult(Integer.parseInt(reslut.get("code").toString()), reslut.get("msg").toString(), reslut.get("data"));
        } else {
            // 修改发票的发票分类.
            Map detail_list = (Map) reslut.get("services");
            if (detail_list != null) {
                String catalog = null;
                if (detail_list.get("name") != null) {
                    catalog = detail_list.get("name").toString();
                } else if (detail_list.get("item") != null) {
                    catalog = detail_list.get("item").toString();
                }
                String str = null;
                if (catalog.contains("*")) {
                    str = catalog.substring(1, catalog.lastIndexOf("*"));
                } else {
                    str = catalog;
                }
                String invoice_catalog = InvoiceCatalog.getInvoiceCatalog(str);
                String catalogStr = InvoiceCatalog.getCatalog(invoice_catalog);
                Map map1 = new HashMap();
                if (catalogStr.equals("")) {
                    map1.put("invoice_catalog", "07");
                } else {
                    map1.put("invoice_catalog", catalogStr);
                }
                // 获取发票号码.
                String invoice_no = map.get("bill_number").toString();
                map1.put("invoice_no", invoice_no);
                // 获取发票代码.
                String invoice_code = map.get("bill_id").toString();
                map1.put("invoice_code", invoice_code);
                invoiceInfoMapper.updateInvoiceCatalog(map1);
            }
            return new ApiResult(Integer.parseInt(reslut.get("code").toString()), reslut.get("msg").toString(), reslut.get("data"));
        }
    }

    /**
     * 新增时关联合同的下拉选项.
     *
     * @param map 发票供应商(seller_name), 账户用户名(username), 账户权限(role_code).
     * @return 响应数据.
     */
    @RequestMapping(value = "/findAllContract", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult findAllContract(@RequestBody Map map) {
        List allContract = invoiceInfoMapper.invoiceAddContractList(map);
        if (allContract.isEmpty()) {
            return new ApiResult(0, "成功", new ArrayList<>());
        } else {
            return new ApiResult(0, "成功", allContract);
        }
    }

    /**
     * 新增时直接关联合同.
     *
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/insertConnectContract", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult insertConnectContract(@RequestBody Map map) {
        System.out.println(map);
        // 判断销方名称与该合同供应商是否一致.
        // 因为, 下拉列表中的值是供应商相同或为空的合同, 所以下面第一个if中的代码可以省略.
        String provider = invoiceInfoMapper.findByContractId(map) == null ? "" : invoiceInfoMapper.findByContractId(map).get("s_name").toString();
        if (provider.equals(map.get("seller_name")) || provider.equals("")) {
            int result = invoiceInfoMapper.updateInvoiceContractId(map);
            if (result == 1) {
                // 根据合同编号获取合同名称.
                Map contract = contractInfoMapper.findContractByCode(map);
                // 修改合同的供应商评分.
                Map score = invoiceInfoMapper.findContractCodeAndProviderScore(map);
                System.out.println("score" + score);
                Map map2 = new HashMap();
                map2.put("contract_name", score.get("name"));
                map2.put("providerScore", score.get("score"));
                map2.put("p3_4_1", score.get("p3_4_1"));
                map2.put("p3_4_2", score.get("p3_4_2"));
                map2.put("p3_4_3", score.get("p3_4_3"));
                map2.put("p3_4_4", score.get("p3_4_4"));
                map2.put("p3_4_5", score.get("p3_4_5"));
                map2.put("p3_4_6", score.get("p3_4_6"));
                contractInfoMapper.updateContractProviderScore(map2);
                // 修改合同中的市场监管评分.
                Map map1 = new HashMap();
                map1.put("flag", "1");
                map1.put("contract_code", map.get("contract_code"));
                map1.put("company_no", "1");
                map1.put("contract_name", contract.get("name"));
                Double marketScore = systemService.marketScore(map1);
                map1.put("marketScore", marketScore);
                contractInfoMapper.updateContractMarketScore(map1);
                // 修改合同中的税务合规评分.
                Double taxScore = systemService.taxScore(map1);
                map1.put("taxScore", taxScore);
                contractInfoMapper.updateContractTaxScore(map1);
                // 修改合同中的风险等级.
                contractService.updateLevel(map1);

                // 消息提醒中心
                // 得到发票金额和开票时间
                Map invoice = invoiceInfoMapper.getInvoiceByNo(map);
                String new_price = invoice.get("price_amount").toString();
                String time = invoice.get("invoice_time").toString();
                map.put("new_price", new_price);
                map.put("time", time);
                messageService.select(map);

                return new ApiResult(0, "关联成功,等待审核中...", result);
            } else {
                return new ApiResult(1, "关联失败", result);
            }
        } else {
            return new ApiResult(2, "发票的销方与合同供应商不一致", "");
        }
    }

    /**
     * 新增时创建合同关联.
     *
     * @param map 合同名称(contract_name), 合同编号(contract_code), 合同标签(contract_tag),
     *            发票号码(invoice_no_short), 发票代码(invoice_code).
     * @return 响应数据.
     */
    @RequestMapping(value = "/insertCreateConnectContract", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult insertCreateConnectContract(@RequestBody Map map) {
        // 添加公司
        String company_id = this.getColonCompanyId();
        map.put("company_id", company_id);
        // 添加人.
        String user_id = this.getColonyUserId();
        map.put("create_by", user_id);
        // 添加合同标签.
        String contract_tag = JSONArray.toJSONString(map.get("contract_tag"));
        map.put("contract_tag", contract_tag);
        // 新增合同.
        ApiResult add = contractService.insert(map);
        if (add.getCode() == 0) {
            // 如果新增成功, 则关联发票.
            if (add.getCode() == 0) {
                // 关联发票.
                int result = invoiceInfoMapper.updateInvoiceContractId(map);
                if (result == 1) {
                    // 添加供应商评分.
                    Map score = invoiceInfoMapper.findContractCodeAndProviderScore(map);
                    Map map2 = new HashMap();
                    map2.put("contract_name", score.get("name"));
                    map2.put("providerScore", score.get("score"));
                    map2.put("p3_4_1", score.get("p3_4_1"));
                    map2.put("p3_4_2", score.get("p3_4_2"));
                    map2.put("p3_4_3", score.get("p3_4_3"));
                    map2.put("p3_4_4", score.get("p3_4_4"));
                    map2.put("p3_4_5", score.get("p3_4_5"));
                    map2.put("p3_4_6", score.get("p3_4_6"));
                    contractInfoMapper.updateContractProviderScore(map2);
                    // 添加供应商名称.
                    invoiceInfoMapper.updateContractSeller(map);
                    Map map1 = new HashMap();
                    // 修改合同中的市场监管评分.
                    map1.put("flag", "1");
                    map1.put("contract_code", map.get("contract_code"));
                    map1.put("company_no", "1");
                    map1.put("contract_name", map.get("contract_name"));
                    Double marketScore = systemService.marketScore(map1);
                    map1.put("marketScore", marketScore);
                    contractInfoMapper.updateContractMarketScore(map1);
                    // 修改合同中的税务合规评分.
                    Double taxScore = systemService.taxScore(map1);
                    map1.put("taxScore", taxScore);
                    contractInfoMapper.updateContractTaxScore(map1);
                    // 修改合同中的风险等级.
                    contractService.updateLevel(map1);

                    // 消息提醒中心
                    // 得到发票金额和开票时间
                    Map invoice = invoiceInfoMapper.getInvoiceByNo(map);
                    String new_price = invoice.get("price_amount").toString();
                    String time = invoice.get("invoice_time").toString();
                    map.put("new_price", new_price);
                    map.put("time", time);
                    messageService.select(map);
                    return new ApiResult(0, "关联成功", result);
                } else {
                    return new ApiResult(1, "关联失败", result);
                }
            } else {
                return new ApiResult(2, add.getMsg(), "");
            }
        } else {
            return new ApiResult(3, "合同创建失败", "");
        }
    }

    /**
     * 查询所有发票.
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/invoiceTotalList", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult invoiceTotalList(@RequestBody Map map){
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("invoice_catalog", ((Map) map.get("queryParams")).get("invoice_catalog"));
        map1.put("invoice_params", ((Map) map.get("queryParams")).get("invoice_criteria"));
        // 接收用户权限和用户账号名称.
        map1.put("role_code", map.get("role_code"));
        map1.put("username", map.get("username"));
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        // 得到数据库内容, 封装后, 返回页面.
        List invoice = invoiceInfoMapper.invoiceTotalList(map1);
        Map<String, Object> tableDataInfo = getDataTable(invoice);
        return new ApiResult(0, "成功", tableDataInfo);
    }
}

