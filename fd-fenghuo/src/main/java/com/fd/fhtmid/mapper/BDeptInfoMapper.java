package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BDeptInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BDeptInfoMapper extends CrudMapper<BDeptInfo, String> {
    // 查找所有一级组织部门.
    List departmentList();
    // 获取指定部门名称的组织部门.
    Map getDepartment(Map map);
    // 新增一级组织部门.
    int insertDepartment(Map map);
    // 修改组织部门.
    int updateDepartment(Map map);

    // 模糊查询.
    List departmentLikeList(Map map);
    // 删除组织部门.
    int deleteDepartment(@Param("depts") List depts);

    // 查询有父部门的组织部门.
    List childDepartmentList(Map map);
    // 新增有父部门的组织部门.
    int insertChildDepartment(Map map);

    // 根据 code 查询部门.
    Map getDeptByCode(Map map);
}
