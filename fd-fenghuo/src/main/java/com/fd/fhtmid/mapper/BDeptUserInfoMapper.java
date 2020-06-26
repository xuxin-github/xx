package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BDeptUserInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BDeptUserInfoMapper extends CrudMapper<BDeptUserInfo, String> {
    // 新增部门人员关系.
    int insertDeptPersonnel(Map map);
    // 修改部门人员关系.
    int updateDeptPersonnel(Map map);
    // 根据部门名称查询出人员id.
    List deptPersonnelList(@Param("ids") List ids);
    // 修改部门人员中的部门为null.
    int updateDeptPersonnelByNull(@Param("personnels") List personnels);
}
