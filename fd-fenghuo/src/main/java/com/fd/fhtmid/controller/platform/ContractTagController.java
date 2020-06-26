package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BContractTagInfoMapper;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/p/contractTag")
public class ContractTagController extends BaseController {
    @Autowired
    private BContractTagInfoMapper contractTagInfoMapper;

    /**
     * 查询所有合同标签.
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/contractTagList", method = RequestMethod.POST)
    public ApiResult contractTagList(@RequestBody Map map){
        System.out.println("***" + map);
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        List contractTag = contractTagInfoMapper.contractTagList();
        Map<String, Object> tableDataInfo = getDataTable(contractTag);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**
     * 查询所有合同标签(不分页).
     * @return 响应数据.
     */
    @RequestMapping(value = "/tagList", method = RequestMethod.POST)
    public ApiResult tagList(){
        List tagList = contractTagInfoMapper.contractTagList();
        List list = new ArrayList();
        for (int i = 0; i < tagList.size(); i++) {
            list.add(((Map)tagList.get(i)).get("tag_name"));
        }
        return new ApiResult(0, "成功", list);
    }

    /**
     * 获取指定合同标签.
     * @param map 标签名称(tag_name).
     * @return 响应数据.
     */
    @RequestMapping(value = "/getContractTagById", method = RequestMethod.POST)
    public ApiResult getContractTag(@RequestBody Map map){
        Map contractTag = contractTagInfoMapper.getContractTagByName(map);
        return new ApiResult(0, "成功", contractTag);
    }

    /**
     * 新增合同标签.
     * @param map 标签名称(tag_name).
     * @return 响应数据.
     */
    @RequestMapping(value = "/insertContractTag", method = RequestMethod.POST)
    public ApiResult insertContractTag(@RequestBody Map map){
        Map contractTag = contractTagInfoMapper.getContractTagByName(map);
        if (contractTag == null) {
            // 添加id.
            map.put("id", UUIDUtils.getUUID());
            // 添加公司id.
            String company_id = this.getColonCompanyId();
            map.put("company_id", company_id);
            // 添加项目标签编号.
            map.put("tag_code", map.get("id"));
            // 添加人.
            String user_id = this.getColonyUserId();
            map.put("create_by", user_id);
            // 添加时间.
            map.put("create_time", new Date());
            // 是否删除.
            map.put("is_delete", 0);
            int result = contractTagInfoMapper.insertContractTag(map);
            if (result == 1) {
                return new ApiResult(0, "新增成功", result);
            } else {
                return new ApiResult(1, "新增失败", result);
            }
        } else {
            return new ApiResult(2, "此标签已存在！", "");
        }
    }

    /**
     * 修改项目标签.
     * @param map 标签名称(tag_name), 标签编号(tag_code).
     * @return 响应数据.
     */
    @RequestMapping(value = "/updateContractTag", method = RequestMethod.POST)
    public ApiResult updateContractTag(@RequestBody Map map){
        Map contractTag = contractTagInfoMapper.getContractTagByName(map);
        if (contractTag == null) {
            // 修改人.
            String user_id = this.getColonyUserId();
            map.put("update_by", user_id);
            // 修改时间.
            map.put("update_time", new Date());
            int result = contractTagInfoMapper.updateContractTag(map);
            if (result == 1) {
                return new ApiResult(0, "修改成功", result);
            } else {
                return new ApiResult(1, "修改失败", result);
            }
        } else {
            return new ApiResult(2, "合同标签已存在！", "");
        }
    }
}
