package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BProjectTagInfoMapper;
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
@RequestMapping(value = "/p/projectTag")
public class ProjectTagController extends BaseController {
    @Autowired
    private BProjectTagInfoMapper projectTagInfoMapper;

    /**
     * 查询所有项目标签.
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/projectTagList", method = RequestMethod.POST)
    public ApiResult projectTagList(@RequestBody Map map){
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        List projectTag = projectTagInfoMapper.projectTagList();
        Map<String, Object> tableDataInfo = getDataTable(projectTag);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**
     * 查询所有项目标签(不分页).
     * @return 响应数据.
     */
    @RequestMapping(value = "/tagList", method = RequestMethod.POST)
    public ApiResult tagList(){
        List tagList = projectTagInfoMapper.projectTagList();
        List list = new ArrayList();
        for (int i = 0; i < tagList.size(); i++) {
            list.add(((Map)tagList.get(i)).get("tag_name"));
        }
        return new ApiResult(0, "成功", list);
    }

    /**
     * 获取指定项目标签.
     * @param map 标签名称(tag_name).
     * @return 响应数据.
     */
    @RequestMapping(value = "/getProjectTag", method = RequestMethod.POST)
    public ApiResult getProjectTag(@RequestBody Map map){
        Map projectTag = projectTagInfoMapper.getProjectTagByName(map);
        return new ApiResult(0, "成功", projectTag);
    }

    /**
     * 新增项目标签.
     * @param map 标签名称(tag_name).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/insertProjectTag", method = RequestMethod.POST)
    public ApiResult insertProjectTag(@RequestBody Map map){
        Map projectTag = projectTagInfoMapper.getProjectTagByName(map);
        if (projectTag == null) {
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
            int result = projectTagInfoMapper.insertProjectTag(map);
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
    @Transactional
    @RequestMapping(value = "/updateProjectTag", method = RequestMethod.POST)
    public ApiResult updateProjectTag(@RequestBody Map map){
        Map projectTag = projectTagInfoMapper.getProjectTagByName(map);
        if (projectTag == null) {
            // 修改人.
            String user_id = this.getColonyUserId();
            map.put("update_by", user_id);
            // 修改时间.
            map.put("update_time", new Date());
            int result = projectTagInfoMapper.updateProjectTag(map);
            if (result == 1) {
                return new ApiResult(0, "修改成功", result);
            } else {
                return new ApiResult(1, "修改失败", result);
            }
        } else {
            return new ApiResult(2, "项目标签已存在！", "");
        }
    }
}