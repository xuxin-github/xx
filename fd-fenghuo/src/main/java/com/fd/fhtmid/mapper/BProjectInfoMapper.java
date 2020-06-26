package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BProjectInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BProjectInfoMapper extends CrudMapper<BProjectInfo, String> {
    // 获取所有项目.
    List findProject(Map map);
    // 获取指定项目基本信息.
    Map getProjectByCode(Map map);
    // 获取指定项目中的合同信息.
    List getProjectContract(Map map);
    // 获取指定项目中的发票信息.
    List getProjectInvoice(Map map);
    // 获取项目中的报销信息.
    List getProjectReimburse(Map map);
    // 获取已通过的报销记录中的发票.
    List getProjectPassReimburse(Map map);

    // 获取项目中的合同信息中的得分预警值.
    Map getCompanyScore(Map map);

    // 新增项目.
    int insertProject(Map map);
    // 添加合同.
    int insertProjectContract(Map map);
    // 取消关联.
    int updateProject(Map map);

    // 获取所有项目.
    List findAllProject();

    // 修改项目状态.
    int updateStatus(Map map);
    // 判断数据库中是否已存在相同项目名的项目.
    Map getProjectByBasicName(Map map);
    // 修改项目基本信息.
    int updateBasicProject(Map map);
    // 修改发票审核状态.
    int updateInvoiceStatus(Map map);

    // 获取通过的报销数量和报销金额.
    Map<String, String> getReimburseByProjectCode(Map map);

    // 获取通过的发票数量和金额.
    Map<String, String> getInvoiceByProjectCode(Map map);
}
