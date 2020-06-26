package com.fd.fhtmid.controller.platform;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BProviderInfoMapper;
import com.fd.fhtmid.service.ContractService;
import com.fd.fhtmid.service.ProviderService;
import com.fd.fhtmid.utils.UUIDUtils;
import com.fd.fhtmid.utils.third.ZhengXinUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author 秦朗.
 * description 供应商controller.
 */

@RestController
@RequestMapping(value = "/p/provider")
public class ProviderController extends BaseController {
    @Autowired
    private BProviderInfoMapper providerInfoMapper;

    @Autowired
    private ProviderService providerService;

    @Autowired
    private ContractService contractService;

    /**
     * 供应商列表.
     *
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/ProviderList", method = RequestMethod.POST)
    public ApiResult ProviderList(@RequestBody Map map) {
        // 得到页面传过来的参数, 名称与页面设定一致.
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("supplier_status", ((Map) map.get("queryParams")).get("supplier_status"));
        map1.put("supplier_id", ((Map) map.get("queryParams")).get("supplier_id"));
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        // 得到数据库内容, 封装后, 返回页面.
        List providerList = providerInfoMapper.findProvider(map1);
        Map<String, Object> tableDataInfo = getDataTable(providerList);
        ApiResult apiResult = new ApiResult(0, "成功", tableDataInfo);
        return apiResult;
    }

    /**
     * 获取指定供应商名称的供应商内容.
     *
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/getProvider", method = RequestMethod.GET)
    public ApiResult getProvider(@RequestParam Map map) {
        // 得到页面传过来的参数, 名称与页面设定一致.
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("company_name", map.get("company_name"));
        // 获取供应商内容.
        Map provider = providerInfoMapper.getProviderByName(map1);
        Map<String, Object> providerDetail = new HashMap<String, Object>();
        providerDetail.put("provider", provider);
        // 获取受惩黑名单.
        String xzhmdStr = providerInfoMapper.getXzhmd(map1);
        JSONObject xzhmd = JSON.parseObject(xzhmdStr);
        providerDetail.put("xzhmd", xzhmd);
        // 获取执行公告.
        String zxggStr = providerInfoMapper.getZxgg(map1);
        JSONObject zxgg = JSON.parseObject(zxggStr);
        providerDetail.put("zxgg", zxgg);
        // 获取失信公告.
        String shixinStr = providerInfoMapper.getShixin(map1);
        JSONObject shixin = JSON.parseObject(shixinStr);
        providerDetail.put("shixin", shixin);
        // 获取曝光台.
        String bgtStr = providerInfoMapper.getBgt(map1);
        JSONObject bgt = JSON.parseObject(bgtStr);
        providerDetail.put("bgt", bgt);
        ApiResult apiResult = new ApiResult(0, "成功", providerDetail);
        return apiResult;
    }

    /**
     * 更新供应商状态.
     *
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
    public ApiResult updateProvider(@RequestBody Map map) {
        // 得到页面传过来的参数, 名称与页面设定一致.
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("company_name", map.get("company_name"));
        map1.put("company_status", map.get("company_status"));
        String user_id = this.getColonyUserId();
        map1.put("update_by", user_id);
        map1.put("update_time", new Date());
        // 得到受影响条数.
        int result = providerInfoMapper.updateProvider(map1);
        // 判断是否更新成功.
        if (result == 1) {
            map1.put("company_no", "1");
            // 根据供应商名称查询合同.
            List contract = providerInfoMapper.findByCompanyTOContract(map1);
            for(int i = 0; i < contract.size(); i++){
                map1.put("contract_name", ((Map)(contract.get(i))).get("contract_name"));
                // 更新合同的风险状态.
                contractService.updateLevel(map1);
            }
            ApiResult apiResult = new ApiResult(0, "修改成功", result);
            return apiResult;
        } else {
            ApiResult apiResult = new ApiResult(1, "修改失败", result);
            return apiResult;
        }
    }

    /**
     * 新增供应商.
     *
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/insertProvider", method = RequestMethod.POST)
    public ApiResult insertProvider(@RequestBody Map map) throws ParseException {
        String user_id = this.getColonyUserId();
        map.put("create_by", user_id);
        Map provider = providerService.insert(map);
        if(provider.get("code").equals(0)){
            return new ApiResult(0, provider.get("msg").toString(), "");
        }else if(provider.get("code").equals(1)){
            return new ApiResult(1, provider.get("msg").toString(), "");
        }else if(provider.get("code").equals(2)){
            return new ApiResult(2, provider.get("msg").toString(), "");
        }else if(provider.get("code").equals(3)){
            return new ApiResult(3, provider.get("msg").toString(), "");
        }else if(provider.get("code").equals(4)){
            return new ApiResult(4, provider.get("msg").toString(), "");
        }else {
            return new ApiResult(5, "服务出错, 请重试！", "");
        }
    }
}