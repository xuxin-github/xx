package com.fd.fhtmid.service;

import com.fd.fhtmid.bean.ApiResult;

import java.util.Map;

public interface ContractService {
    /**
     * 新增合同.
     * @param map1 页面参数.
     * @return 响应数据.
     */
    ApiResult insert(Map map1);

    /**
     * 修改合同风险等级.
     * @param map 页面参数.
     * @return 响应数据.
     */
    int updateLevel(Map map);
}
