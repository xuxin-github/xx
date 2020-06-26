package com.fd.fhtmid.mapper;

import com.fd.fhtmid.domain.BReimburseInfo;

import com.gitee.fastmybatis.core.mapper.CrudMapper;

import java.util.List;
import java.util.Map;


/**
 * @author ${param.author}
 */
public interface BReimburseInfoMapper extends CrudMapper<BReimburseInfo, String> {


    // 获取所有报销信息
    List selectAllList(Map map);
    // 获取报销详情
    Map selectDetails(Map map);
    // 获取报销下的发票信息
    List selectBxInvoice(Map map);

    // 获得移动端我要报销中的项目信息
    List getExpendProject(Map map);
    // 获得移动端我要报销中的报销类别信息
    List getExpendType(Map map);

    // 获取普通/主管权限下的报销信息
    List selectAllList1(Map map);
    // 获取所有的报销信息
    List selectAllList2(Map map);




























    // 修改报销记录的审核状态.
    int updateReimburseStatus(Map map);
    // 根据报销编号查询发票.
    List getInvoiceByReimburse(Map map);
    // 取消关联.
    int cancelConnectReimburse(Map map);

    // 获取指定报销记录.
    Map getReimburseByCode(Map map);
    // 根据报销编号查询发票(报销).
    List getInvoiceByReimburseCode(Map map);
    // 获取最新插入的数据.
    Map getLatestReimburse();
    // 新增报销.
    int insertReimburse(Map map);

}
