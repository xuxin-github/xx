package com.fd.fhtmid.service;

import com.fd.fhtmid.bean.ApiResult;

import java.text.ParseException;
import java.util.Map;

public interface ProviderService {

    /**
     * 新增供应商.
     * @param map3 参数.
     * @return 响应数据.
     */
    Map insert(Map map3) throws ParseException;
}
