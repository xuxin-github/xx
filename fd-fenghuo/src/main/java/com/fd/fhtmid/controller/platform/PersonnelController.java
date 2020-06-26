package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BDeptInfoMapper;
import com.fd.fhtmid.mapper.BDeptUserInfoMapper;
import com.fd.fhtmid.mapper.BRoleInfoMapper;
import com.fd.fhtmid.mapper.BUserInfoMapper;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping(value = "/p/personnel")
public class PersonnelController extends BaseController {
    @Autowired
    private BUserInfoMapper userInfoMapper;
    @Autowired
    private BDeptInfoMapper deptInfoMapper;
    @Autowired
    private BRoleInfoMapper roleInfoMapper;
    @Autowired
    private BDeptUserInfoMapper deptUserInfoMapper;

    /**
     * 查询所有人员.
     *
     * @param map 页码.
     * @return 相应数据.
     */
    @RequestMapping(value = "/personnelList", method = RequestMethod.POST)
    public ApiResult personnelList(@RequestBody Map map) {
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        List personnel = userInfoMapper.personnelList();
        // 显示部门名称.
        for (int i = 0; i < personnel.size(); i++) {
            if (((Map) personnel.get(i)).get("dept_index") != null) {
                StringBuffer dept_names = new StringBuffer();
                String[] str = ((Map) personnel.get(i)).get("dept_index").toString().split("-");
                for (int j = 0; j < str.length; j++) {
                    Map map1 = new HashMap();
                    map1.put("dept_code", str[j]);
                    Map dept_name = deptInfoMapper.getDeptByCode(map1);
                    if (j == str.length - 1) {
                        dept_names.append(dept_name.get("name"));
                    } else {
                        dept_names.append(dept_name.get("name")).append("/");
                    }
                }
                ((Map) personnel.get(i)).put("dept_names", dept_names);
            } else {
                continue;
            }
        }
        Map<String, Object> tableDataInfo = getDataTable(personnel);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**
     * 获取指定人员信息.
     *
     * @param map 用户id(id).
     * @return 响应数据.
     */
    @RequestMapping(value = "/getPersonnelById", method = RequestMethod.POST)
    public ApiResult getPersonnelById(@RequestBody Map map) {
        Map personnel = userInfoMapper.getPersonnelById(map);
        // 获取部门信息.
        String dept_id = personnel.get("dept_id") == null ? "" : personnel.get("dept_id").toString();
        if (!dept_id.equals("")) {
            Map map1 = new HashMap();
            map1.put("dept_code", dept_id);
            Map dept = deptInfoMapper.getDeptByCode(map1);
            // 获取部门索引, 并把部门索引转化为对应的部门名称.
//            String[] str = dept.get("dept_index").toString().split("-");
//            List dept_names = new ArrayList();
//            for (int j = 0; j < str.length; j++) {
//                Map map2 = new HashMap();
//                map2.put("dept_code", str[j]);
//                Map dept_name = deptInfoMapper.getDeptByCode(map2);
//                if (j == str.length - 1) {
//                    dept_names.add(dept_name.get("name"));
//                }
//            }
//            personnel.put("dept_names", dept_names);
            personnel.put("dept_names", dept.get("dept_index"));
        }
        return new ApiResult(0, "成功", personnel);
    }

    /**
     * 查询所有角色.
     *
     * @return 响应数据.
     */
    @RequestMapping(value = "/roleList", method = RequestMethod.POST)
    public ApiResult roleList() {
        List role = roleInfoMapper.roleList();
        return new ApiResult(0, "成功", role);
    }

    /**
     * 查询所有组织部门.
     *
     * @return 响应数据.
     */
    @RequestMapping(value = "/deptList", method = RequestMethod.POST)
    public ApiResult deptList() {
        List dept = new ArrayList();
        List dept_1 = deptInfoMapper.departmentList();
        for (int i = 0; i < dept_1.size(); i++) {
            // 一级.
            Map map1 = new HashMap();
            map1.put("title", ((Map) dept_1.get(i)).get("name"));
            map1.put("value", ((Map) dept_1.get(i)).get("dept_index"));
            map1.put("key", ((Map) dept_1.get(i)).get("dept_index"));
            // 二级.
            Map c_map_1 = new HashMap();
            c_map_1.put("p_dept_no", ((Map) dept_1.get(i)).get("dept_code"));
            List dept_2 = deptInfoMapper.childDepartmentList(c_map_1);
            List c_dept_1 = new ArrayList();
            for (int j = 0; j < dept_2.size(); j++) {
                Map map2 = new HashMap();
                map2.put("title", ((Map) dept_2.get(j)).get("name"));
                map2.put("value", ((Map) dept_2.get(j)).get("dept_index"));
                map2.put("key", ((Map) dept_2.get(j)).get("dept_index"));
                // 三级.
                Map c_map_2 = new HashMap();
                c_map_2.put("p_dept_no", ((Map) dept_2.get(j)).get("dept_code"));
                List dept_3 = deptInfoMapper.childDepartmentList(c_map_2);
                List c_dept_2 = new ArrayList();
                for (int x = 0; x < dept_3.size(); x++) {
                    Map map3 = new HashMap();
                    map3.put("title", ((Map) dept_3.get(x)).get("name"));
                    map3.put("value", ((Map) dept_3.get(x)).get("dept_index"));
                    map3.put("key", ((Map) dept_3.get(x)).get("dept_index"));
                    // 四级.
                    Map c_map_3 = new HashMap();
                    c_map_3.put("p_dept_no", ((Map) dept_3.get(x)).get("dept_code"));
                    List dept_4 = deptInfoMapper.childDepartmentList(c_map_3);
                    List c_dept_3 = new ArrayList();
                    for (int y = 0; y < dept_4.size(); y++) {
                        Map map4 = new HashMap();
                        map4.put("title", ((Map) dept_4.get(y)).get("name"));
                        map4.put("value", ((Map) dept_4.get(y)).get("dept_index"));
                        map4.put("key", ((Map) dept_4.get(y)).get("dept_index"));
                        // 五级.
                        Map c_map_4 = new HashMap();
                        c_map_4.put("p_dept_no", ((Map) dept_4.get(y)).get("dept_code"));
                        List dept_5 = deptInfoMapper.childDepartmentList(c_map_4);
                        List c_dept_4 = new ArrayList();
                        for (int z = 0; z < dept_5.size(); z++) {
                            Map map5 = new HashMap();
                            map5.put("title", ((Map) dept_5.get(z)).get("name"));
                            map5.put("value", ((Map) dept_5.get(z)).get("dept_index"));
                            map5.put("key", ((Map) dept_5.get(z)).get("dept_index"));
                            c_dept_4.add(map5);
                            map4.put("children", c_dept_4);
                        }
                        c_dept_3.add(map4);
                        map3.put("children", c_dept_3);
                    }
                    c_dept_2.add(map3);
                    map2.put("children", c_dept_2);
                }
                c_dept_1.add(map2);
                map1.put("children", c_dept_1);
            }
            dept.add(map1);
        }
        return new ApiResult(0, "成功", dept);
    }

    /**
     * 新增人员.
     *
     * @param map 页面数据.
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/insertPersonnel", method = RequestMethod.POST)
    public ApiResult insertPersonnel(@RequestBody Map map) {
        // 查重.
        Map personnel = userInfoMapper.getPersonnelByUsername(map);
        if (personnel == null) {
            // 添加id.
            map.put("id", UUIDUtils.getUUID());
            // 对密码加密(MD5).
            map.put("pwd", DigestUtils.md5DigestAsHex(map.get("password").toString().getBytes()));
            // 添加部门id.
            String dept = map.get("dept").toString();
            String[] split = dept.split("-");
            String dept_id = split[split.length - 1];
            map.put("dept_id", dept_id);
            // 添加公司id.
            String company_id = this.getColonCompanyId();
            map.put("company_id", company_id);
            // 是否删除.
            map.put("is_delete", 0);
            // 是否禁用.
            map.put("is_disable", 0);
            // 添加人.
            String user_id = this.getColonyUserId();
            map.put("create_by", user_id);
            // 添加时间.
            map.put("create_time", new Date());
            int result = userInfoMapper.insertPersonnel(map);
            // 新增部门人员关系.
            Map map2 = new HashMap();
            map2.put("id", UUIDUtils.getUUID());
            map2.put("user_id", map.get("id"));
            map2.put("dept_id", map.get("dept_id"));
            map2.put("create_by", user_id);
            map2.put("create_time", new Date());
            if (result == 1) {
                deptUserInfoMapper.insertDeptPersonnel(map2);
                return new ApiResult(0, "新增成功", result);
            } else {
                return new ApiResult(1, "新增失败", result);
            }
        } else {
            return new ApiResult(2, "该账号已存在", "");
        }
    }

    /**
     * 修改人员信息.
     *
     * @param map 页面参数.
     * @return 响应信息.
     */
    @Transactional
    @RequestMapping(value = "/updatePersonnel", method = RequestMethod.POST)
    public ApiResult updatePersonnel(@RequestBody Map map) {
        // 对密码加密(MD5).
        map.put("pwd", DigestUtils.md5DigestAsHex(map.get("password").toString().getBytes()));
        // 修改部门id.
        String dept = map.get("dept").toString();
        String[] split = dept.split("-");
        String dept_id = split[split.length - 1];
        map.put("dept_id", dept_id);
        // 修改人.
        String user_id = this.getColonyUserId();
        map.put("update_by", user_id);
        // 添加时间.
        map.put("update_time", new Date());
        int result = userInfoMapper.updatePersonnel(map);
        // 修改部门人员关系.
        Map map2 = new HashMap();
        map2.put("user_id", map.get("id"));
        map2.put("dept_id", map.get("dept_id"));
        map2.put("update_by", user_id);
        map2.put("update_time", new Date());
        if (result == 1) {
            deptUserInfoMapper.updateDeptPersonnel(map2);
            return new ApiResult(0, "修改成功", result);
        } else {
            return new ApiResult(1, "修改失败", result);
        }
    }

    /**
     * 改变人员禁启用状态.
     *
     * @param map 人员id(id), 人员状态(is_disable).
     * @return 响应信息.
     */
    @Transactional
    @RequestMapping(value = "/changePersonnelStatus", method = RequestMethod.POST)
    public ApiResult changePersonnelStatus(@RequestBody Map map) {
        String user_id = this.getColonyUserId();
        map.put("update_by", user_id);
        map.put("update_time", new Date());
        int result = userInfoMapper.updatePersonnelStatus(map);
        if (result == 1) {
            return new ApiResult(0, "修改成功", result);
        } else {
            return new ApiResult(1, "修改失败", result);
        }
    }

    /**
     * 根据用户名查询.
     * @param map 用户名(username).
     * @return 响应数据.
     */
    @RequestMapping(value = "/getPersonnelByName", method = RequestMethod.POST)
    public ApiResult getPersonnelByName(@RequestBody Map map){
        Map personnel = userInfoMapper.getPersonnelByUsername(map);
        return new ApiResult(0, "成功", personnel);
    }

    /**
     * 根据部门编号查询出人员信息.
     * @param map 部门编号(dept_code).
     * @return 响应信息.
     */
    @RequestMapping(value = "/PersonnelByDeptList", method = RequestMethod.POST)
    public ApiResult PersonnelByDeptList(@RequestBody Map map){
        // 根据部门编号查询出人员信息.
        List personnel = userInfoMapper.PersonnelByDeptList(map);
        return new ApiResult(0, "成功", personnel);
    }
}