package com.fd.fhtmid.service;

import com.fd.fhtmid.bean.ApiResult;

import java.util.List;
import java.util.Map;

/**
 * 消息提醒中心
 */
public interface MessageService {

    /**
     * 查询消息提醒中心数据
     * @param map
     * @return
     */
    ApiResult select(Map map);

}
