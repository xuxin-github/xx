package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BDeptInfoMapper;
import com.fd.fhtmid.mapper.BProjectMemberInfoMapper;
import com.fd.fhtmid.mapper.BUserInfoMapper;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping(value = "/p/projectMember")
public class ProjectMemberController extends BaseController {
    @Autowired
    private BProjectMemberInfoMapper memberInfoMapper;
    @Autowired
    private BUserInfoMapper userInfoMapper;
    @Autowired
    private BDeptInfoMapper deptInfoMapper;

    /**
     * 查询对应项目的项目成员.
     *
     * @param map 项目编号(project_code), 权限(role_code), 用户账户名(username).
     * @return 响应数据.
     */
    @RequestMapping(value = "/projectMemberList", method = RequestMethod.POST)
    public ApiResult projectMemberList(@RequestBody Map map) {
        // 查询出该项目下的人员id.
        List member = memberInfoMapper.projectMemberList(map);
        // 获取对应人员id的信息, 并封装成为一个集合.
        List members = new ArrayList();
        if (member.size() > 0) {
            for (int i = 0; i < member.size(); i++) {
                Map map1 = new HashMap();
                map1.put("id", ((Map) member.get(i)).get("user_id"));
                Map personnel = getCompletePersonnel(map1);
                members.add(personnel);
            }
        }
        return new ApiResult(0, "", members);
    }

    /**
     * 新增项目成员.
     *
     * @param map 项目编号(project_code), 人员id(user_id).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/insertProjectMember", method = RequestMethod.POST)
    public ApiResult insertProjectMember(@RequestBody Map map) {
        // 查重.
        Map member = memberInfoMapper.getProjectMember(map);
        if (member == null) {
            // 添加id.
            map.put("id", UUIDUtils.getUUID());
            // 添加人.
            map.put("create_by", this.getColonyUserId());
            // 添加时间.
            map.put("create_time", new Date());
            int result = memberInfoMapper.insertProjectMember(map);
            if (result == 1) {
                List members = memberInfoMapper.projectMemberList(map);
                List personnels = new ArrayList();
                for (int i = 0; i < members.size(); i++) {
                    Map map1 = new HashMap();
                    map1.put("id", ((Map) members.get(i)).get("user_id"));
                    Map personnel = getCompletePersonnel(map1);
                    personnels.add(personnel);
                }
                return new ApiResult(0, "新增成功", personnels);
            } else {
                return new ApiResult(1, "新增失败", result);
            }
        } else {
            return new ApiResult(2, "成员已存在！", "");
        }
    }

    /**
     * 删除项目成员.
     *
     * @param map 项目编号(project_code), 人员id(user_id).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/deleteProjectMember", method = RequestMethod.POST)
    public ApiResult deleteProjectMember(@RequestBody Map map) {
        int result = memberInfoMapper.deleteProjectMember(map);
        if (result == 1) {
            List members = memberInfoMapper.projectMemberList(map);
            List personnels = new ArrayList();
            for (int i = 0; i < members.size(); i++) {
                Map map1 = new HashMap();
                map1.put("id", ((Map) members.get(i)).get("user_id"));
                Map personnel = getCompletePersonnel(map1);
                personnels.add(personnel);
            }
            return new ApiResult(0, "删除成功", personnels);
        } else {
            return new ApiResult(1, "删除失败", result);
        }
    }

    /**
     * 格式化部门名称.
     *
     * @param map 人员id.
     * @return 人员详细信息.
     */
    public Map getCompletePersonnel(Map map) {
        Map personnel = userInfoMapper.getPersonnelById(map);
        // 获取部门信息.
        String dept_id = personnel.get("dept_id") == null ? "" : personnel.get("dept_id").toString();
        if (!dept_id.equals("")) {
            Map map1 = new HashMap();
            map1.put("dept_code", dept_id);
            Map dept = deptInfoMapper.getDeptByCode(map1);
            // 获取部门索引, 并把部门索引转化为对应的部门名称.
            String[] str = dept.get("dept_index").toString().split("-");
            StringBuffer dept_names = new StringBuffer();
            for (int j = 0; j < str.length; j++) {
                Map map2 = new HashMap();
                map2.put("dept_code", str[j]);
                Map dept_name = deptInfoMapper.getDeptByCode(map2);
                if (j == str.length - 1) {
                    dept_names.append(dept_name.get("name"));
                } else {
                    dept_names.append(dept_name.get("name")).append("/");
                }
            }
            personnel.put("dept_names", dept_names);
        }
        return personnel;
    }
}