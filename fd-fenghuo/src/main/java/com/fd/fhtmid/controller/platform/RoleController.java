package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BRoleInfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/p/role")
public class RoleController extends BaseController {
    @Autowired
    private BRoleInfoMapper roleInfoMapper;
    /**
     * 查询所有角色.
     * @param map 页码.
     * @return 响应数据.
     */
    @RequestMapping(value = "/roleList", method = RequestMethod.POST)
    public ApiResult roleList(@RequestBody Map map){
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        List role = roleInfoMapper.roleList();
        Map<String, Object> tableDataInfo = getDataTable(role);
        return new ApiResult(0, "成功", tableDataInfo);
    }
}