package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BReimburseTypeInfoMapper;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/p/reimburseType")
public class ReimburseTypeController extends BaseController {
    @Autowired
    private BReimburseTypeInfoMapper reimburseTypeInfoMapper;

    /**
     * 查询所有报销类别.
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/reimburseTypeList", method = RequestMethod.POST)
    public ApiResult reimburseTypeList(@RequestBody Map map){
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        List reimburseType = reimburseTypeInfoMapper.reimburseTypeList();
        Map<String, Object> tableDataInfo = getDataTable(reimburseType);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**
     * 查询所有报销类别(不分页).
     * @return 响应数据.
     */
    @RequestMapping(value = "/typeList", method = RequestMethod.POST)
    public ApiResult typeList(){
        List typeList = reimburseTypeInfoMapper.reimburseTypeList();
        return new ApiResult(0, "成功", typeList);
    }

    /**
     * 获取指定报销类别.
     * @param map 类别名称(type_name).
     * @return 响应数据.
     */
    @RequestMapping(value = "/getReimburseTypeById", method = RequestMethod.POST)
    public ApiResult getReimburseType(@RequestBody Map map){
        Map reimburseType = reimburseTypeInfoMapper.getReimburseTypeByName(map);
        return new ApiResult(0, "成功", reimburseType);
    }

    /**
     * 新增报销类别.
     * @param map 类别名称(type_name).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/insertReimburseType", method = RequestMethod.POST)
    public ApiResult insertReimburseType(@RequestBody Map map){
        Map reimburseType = reimburseTypeInfoMapper.getReimburseTypeByName(map);
        if (reimburseType == null) {
            // 添加id.
            map.put("id", UUIDUtils.getUUID());
            // 添加公司id.
            String company_id = this.getColonCompanyId();
            map.put("company_id", company_id);
            // 添加项目标签编号.
            map.put("type_code", map.get("id"));
            // 添加人.
            String user_id = this.getColonyUserId();
            map.put("create_by", user_id);
            // 添加时间.
            map.put("create_time", new Date());
            // 是否删除.
            map.put("is_delete", 0);
            int result = reimburseTypeInfoMapper.insertReimburseType(map);
            if (result == 1) {
                return new ApiResult(0, "新增成功", result);
            } else {
                return new ApiResult(1, "新增失败", result);
            }
        } else {
            return new ApiResult(2, "此类别已存在！", "");
        }
    }

    /**
     * 修改报销类别.
     * @param map 类别名称(type_name), 类别编号(type_code).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/updateReimburseType", method = RequestMethod.POST)
    public ApiResult updateReimburseType(@RequestBody Map map){
        Map reimburseType = reimburseTypeInfoMapper.getReimburseTypeByName(map);
        if (reimburseType == null) {
            // 修改人.
            String user_id = this.getColonyUserId();
            map.put("update_by", user_id);
            // 修改时间.
            map.put("update_time", new Date());
            int result = reimburseTypeInfoMapper.updateReimburseType(map);
            if (result == 1) {
                return new ApiResult(0, "修改成功", result);
            } else {
                return new ApiResult(1, "修改失败", result);
            }
        } else {
            return new ApiResult(2, "报销类别已存在！", "");
        }
    }
}