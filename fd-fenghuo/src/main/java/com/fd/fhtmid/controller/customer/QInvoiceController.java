
package com.fd.fhtmid.controller.customer;

import com.alibaba.fastjson.JSONArray;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.common.constant.InvoiceCatalog;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BContractInfoMapper;
import com.fd.fhtmid.mapper.BInvoiceInfoMapper;
import com.fd.fhtmid.service.ContractService;
import com.fd.fhtmid.service.InvoiceService;
import com.fd.fhtmid.service.MessageService;
import com.fd.fhtmid.service.SystemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @author 徐鑫.
 * ContractController.
 */

@Controller
@RequestMapping("/c/invoice")
public class QInvoiceController extends BaseController {

    private final Logger logger = LoggerFactory.getLogger(QInvoiceController.class);

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
     * 获取所有发票信息
     *
     * @param map 参数
     * @return 发票列表
     */
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult list(@RequestBody Map map) {

        System.out.println("****************************请求参数****************************");
        System.out.println(map);
        // 得到页面的参数，名称与前端传过来要一致
        Map<String, Object> map1 = new HashMap<String, Object>();
        //   map1.put("invoice_type", ((Map) map.get("queryParams")).get("invoice_type"));
        map1.put("invoice_params", ((Map) map.get("queryParams")).get("invoice_criteria"));
        map1.put("create_by", map.get("user_id"));
        System.out.println("****************************传递给接口的参数****************************");
        System.out.println(map1);
        // 分页处理
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        // 得到数据库内容, 封装后, 返回页面.
        List invoiceInfoList = invoiceInfoMapper.selectListAll(map1);
        System.out.println("返回数据为：" + invoiceInfoList);
        Map<String, Object> tableDataInfo = getDataTable(invoiceInfoList);
        ApiResult apiResult = new ApiResult(0, "成功", tableDataInfo);
        return apiResult;
    }

    /**
     * 获取发票详情(已关联)
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
        // 获取报销信息
        Map map2 = new HashMap();
        String contract_id = invoice.get("contract_id").toString();
        map2.put("code",contract_id);
        Map baoxiao = invoiceInfoMapper.getBaoXiaoCode(map2);
        invoiceDetail.put("baoxiao", baoxiao);
        System.out.println("详情数据" + invoiceDetail);
        ApiResult apiResult = new ApiResult(0, "成功", invoiceDetail);
        return apiResult;
    }

    /**
     * 获取发票详情(初始化)
     *
     * @param map 参数
     * @return 具体某个发票信息
     */
    @RequestMapping(value = "/getFirstInvoiceByNo", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult getFirstInvoiceByNo(@RequestBody Map map) {
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
        System.out.println("详情数据" + invoiceDetail);
        ApiResult apiResult = new ApiResult(0, "成功", invoiceDetail);
        return apiResult;
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
     * 根据所得参数查看数据库中是否存在.
     *
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/findOneInvoice", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult findOneInvoice(@RequestBody Map map) {
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("invoice_no_short", map.get("invoice_no_short"));
        map1.put("invoice_code", map.get("invoice_code"));
        System.out.println("map1" + map1);
        List result = invoiceInfoMapper.findOneInvoice(map1);
        System.out.println("数据" + result);
        return new ApiResult(0, "成功", result);
    }


    /**
     * 新增时可关联的合同列表
     *
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/findAllContractList", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult findAllContractList(@RequestBody Map map) {
        System.out.println("------------"+map);
        List allContract = invoiceInfoMapper.findAllContract(map);
        System.out.println(allContract);
        return new ApiResult(0, "成功", allContract);
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

                return new ApiResult(0, "关联成功", result);
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
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/insertCreateConnectContract", method = RequestMethod.POST)
    @ResponseBody
    public ApiResult insertCreateConnectContract(@RequestBody Map map) {
        System.out.println(map);
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
                    map.put("new_price",new_price);
                    map.put("time",time);
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
}

