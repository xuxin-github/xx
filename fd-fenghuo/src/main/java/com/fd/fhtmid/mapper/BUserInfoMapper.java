package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BUserInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BUserInfoMapper extends CrudMapper<BUserInfo, String> {
    // 查询所有人员.
    List personnelList();
    // 获取指定人员.
    Map getPersonnelByUsername(Map map);
    // 新增人员.
    int insertPersonnel(Map map);
    // 修改人员.
    int updatePersonnel(Map map);

    // 根据 id 查询.
    Map getPersonnelById(Map map);
    // 改变人员禁启用状态.
    int updatePersonnelStatus(Map map);

    // 修改人员信息中的部门为null.
    int updatePersonnelByNull(@Param("personnels") List personnels);

    // 根据部门编号查询出人员信息.
    List PersonnelByDeptList(Map map);

    // 查询用户权限
    Map getRoleCode(Map map);
}
