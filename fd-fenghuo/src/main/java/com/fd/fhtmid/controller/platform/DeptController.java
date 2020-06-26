package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BDeptInfoMapper;
import com.fd.fhtmid.mapper.BDeptUserInfoMapper;
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
@RequestMapping(value = "/p/dept")
public class DeptController extends BaseController {

    @Autowired
    private BDeptInfoMapper deptInfoMapper;
    @Autowired
    private BDeptUserInfoMapper deptUserInfoMapper;
    @Autowired
    private BUserInfoMapper userInfoMapper;

    /**
     * 查找所有一级组织部门.
     * @return 响应数据.
     */
    @RequestMapping(value = "/departmentList", method = RequestMethod.POST)
    public ApiResult departmentList(@RequestBody Map map) {
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        List dept = deptInfoMapper.departmentList();
        Map<String, Object> tableDataInfo = getDataTable(dept);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**
     * 获取指定名称的组织部门.
     * @param map 部门名称(dept_name).
     * @return 响应数据.
     */
    @RequestMapping(value = "/getDepartment", method = RequestMethod.POST)
    public ApiResult getDepartment(@RequestBody Map map) {
        Map dept = deptInfoMapper.getDepartment(map);
        return new ApiResult(0, "成功", dept);
    }

    /**
     * 新增一级组织部门.
     * @param map 部门名称(dept_name).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/insertDepartment", method = RequestMethod.POST)
    public ApiResult insertDepartment(@RequestBody Map map) {
        // 查重.
        Map dept = deptInfoMapper.getDepartment(map);
        if (dept == null) {
            // 添加id.
            map.put("id", UUIDUtils.getUUID());
            // 添加公司id.
            String company_id = this.getColonCompanyId();
            map.put("company_id", company_id);
            // 添加部门编号(与id号一致).
            map.put("dept_code", map.get("id"));
            // 添加部门索引.
            map.put("dept_index", map.get("dept_code"));
            // 添加权重(带有"总"的为2, 其余的为1).
            String name = map.get("dept_name").toString();
            if (name.contains("总")) {
                map.put("weight", 2);
            } else {
                map.put("weight", 1);
            }
            // 是否删除.
            map.put("is_delete", 0);
            // 添加人.
            String user_id = this.getColonyUserId();
            map.put("create_by", user_id);
            // 添加时间.
            map.put("create_time", new Date());
            int result = deptInfoMapper.insertDepartment(map);
            if (result == 1) {
                return new ApiResult(0, "新增成功", result);
            } else {
                return new ApiResult(1, "新增失败", result);
            }
        } else {
            return new ApiResult(2, "该部门已存在", "");
        }
    }

    /**
     * 修改组织部门.
     * @param map 部门名称(dept_name), 部门编号(dept_code).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/updateDepartment", method = RequestMethod.POST)
    public ApiResult updateDepartment(@RequestBody Map map) {
        // 判断是否修改.
        Map dept = deptInfoMapper.getDepartment(map);
        if (dept == null) {
            // 修改权重(带有"总"的为2, 其余的为1).
            String name = map.get("dept_name").toString();
            if (name.contains("总")) {
                map.put("weight", 2);
            } else {
                map.put("weight", 1);
            }
            // 修改人.
            String user_id = this.getColonyUserId();
            map.put("update_by", user_id);
            // 修改时间.
            map.put("update_time", new Date());
            int result = deptInfoMapper.updateDepartment(map);
            if (result == 1) {
                return new ApiResult(0, "修改成功", result);
            } else {
                return new ApiResult(1, "修改失败", result);
            }
        } else {
            return new ApiResult(2, "已存在部门名称", "");
        }
    }

    /**
     * 删除组织部门.
     * @param map 部门编号(dept_code).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/deleteDepartment", method = RequestMethod.POST)
    public ApiResult deleteDepartment(@RequestBody Map map){
        // 根据部门索引查询出组织部门的名称(父部门及子部门).
        List names = deptInfoMapper.departmentLikeList(map);
        List depts = new ArrayList();
        for (int i = 0; i < names.size(); i++){
            depts.add(((Map)names.get(i)).get("name"));
        }
        // 先获取部门id, 再查询出部门人员中的人员id.
        List ids = new ArrayList();
        for (int i = 0; i < names.size(); i++){
            ids.add(((Map)names.get(i)).get("dept_code"));
        }
        List users = deptUserInfoMapper.deptPersonnelList(ids);
        // 获取人员id.
        List personnels = new ArrayList();
        for (int i = 0; i < users.size(); i++){
            personnels.add(((Map)users.get(i)).get("user_id"));
        }
        // 修改人员信息中的部门为null.
        userInfoMapper.updatePersonnelByNull(personnels);
        // 修改部门人员中的部门为null.
        deptUserInfoMapper.updateDeptPersonnelByNull(personnels);
        int result = deptInfoMapper.deleteDepartment(depts);
        if (result >= 1) {
            return new ApiResult(0, "删除成功", result);
        } else {
            return new ApiResult(1, "删除失败", result);
        }
//        return new ApiResult(0, "", "");
    }

    /**
     * 查询有父部门的组织部门.
     * @param map 父部门编号(p_dept_no).
     * @return 响应数据.
     */
    @RequestMapping(value = "/childDepartmentList", method = RequestMethod.POST)
    public ApiResult childDepartmentList(@RequestBody Map map){
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        List dept = deptInfoMapper.childDepartmentList(map);
        Map<String, Object> tableDataInfo = getDataTable(dept);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**
     * 新增有父部门的组织部门.
     * @param map 部门名称(dept_name), 父部门名称(dept_name_p), 父部门编号(p_dept_no).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/insertChildDepartment", method = RequestMethod.POST)
    public ApiResult insertChildDepartment(@RequestBody Map map){
        System.out.println(map);
        // 查重.
        Map dept = deptInfoMapper.getDepartment(map);
        if (dept == null) {
            // 添加id.
            map.put("id", UUIDUtils.getUUID());
            // 添加公司id.
            String company_id = this.getColonCompanyId();
            map.put("company_id", company_id);
            // 添加部门编号(与id号一致).
            map.put("dept_code", map.get("id"));
            // 添加权重(带有"总"的为2, 其余的为1).
            String name = map.get("dept_name").toString();
            if (name.contains("总")) {
                map.put("weight", 2);
            } else {
                map.put("weight", 1);
            }
            // 添加部门索引.
            Map map1 = new HashMap();
            map1.put("dept_name", map.get("dept_name_p"));
            Map dept_p = deptInfoMapper.getDepartment(map1);
            StringBuffer dept_index = new StringBuffer();
            dept_index.append(dept_p.get("dept_index")).append("-").append(map.get("dept_code"));
            map.put("dept_index", dept_index.toString());
            // 是否删除.
            map.put("is_delete", 0);
            // 添加人.
            String user_id = this.getColonyUserId();
            map.put("create_by", user_id);
            // 添加时间.
            map.put("create_time", new Date());
            int result = deptInfoMapper.insertChildDepartment(map);
            if (result == 1) {
                return new ApiResult(0, "新增成功", result);
            } else {
                return new ApiResult(1, "新增失败", result);
            }
        } else {
            return new ApiResult(2, "该部门已存在", "");
        }
    }
}