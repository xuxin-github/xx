package com.fd.fhtmid.service;

import com.fd.fhtmid.bean.ApiResult;

import java.text.ParseException;
import java.util.Map;

public interface InvoiceService {
	/**
	 * 新增发票
	 * @param map 页面参数.
	 * @return 响应数据.
	 */
	Map insert(Map map) throws ParseException;
}
