package com.fd.fhtmid.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fd.fhtmid.utils.AuthUtil;
import com.fd.fhtmid.utils.Convert;
import com.fd.fhtmid.utils.ServletUtils;
import com.fd.fhtmid.utils.StringUtils;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 通用数据接口
 * 
 * @author ZhouKaiDong
 *
 */
public class BaseController {

	/**
	 * 设置请求分页数据
	 */
	protected void startPage() {
		System.out.println("sss"+ServletUtils.getParameterToInt("page"));
		Integer pageNum = ServletUtils.getParameterToInt("page");
		if (StringUtils.isNull(pageNum)) {
			pageNum = 1;
		}
		Integer pageSize = ServletUtils.getParameterToInt("pageSize");
		if (StringUtils.isNull(pageSize)) {
			pageSize = 2;
		}
		String orderByColumn = ServletUtils.getParameter("orderByColumn");
		if (StringUtils.isEmpty(orderByColumn)) {
			orderByColumn = "";
		}
		startPage(pageNum, pageSize, orderByColumn);
	}

	/**
	 * 设置请求分页数据
	 */
	protected void startPage(String orderBy) {
		Integer pageNum = ServletUtils.getParameterToInt("page");
		if (StringUtils.isNull(pageNum)) {
			pageNum = 1;
		}
		Integer pageSize = ServletUtils.getParameterToInt("pageSize");
		if (StringUtils.isNull(pageSize)) {
			pageSize = 10;
		}
		startPage(pageNum, pageSize, orderBy);
	}

	/**
	 * 设置请求分页数据
	 */
	protected void startPage(int pageNum, int pageSize, String orderBy) {
		PageHelper.startPage(pageNum, pageSize, orderBy);
	}

	/**
	 * 设置请求分页数据
	 */
	protected void startPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
	}

	/**
	 * 得到数据列表信息
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected Map<String, Object> getDataTable(List<?> list) {
		Map<String, Object> rspData = new HashMap<String, Object>();
		PageInfo pageInfo = new PageInfo(list);
		rspData.put("totalSize", pageInfo.getTotal());
		rspData.put("page", pageInfo.getPageNum());
		rspData.put("datalist", list);
		return rspData;
	}

	/**
	 * 获取用户id.
	 * @return 用户id.
	 */
	protected String getColonyUserId() {
		String str = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		String[] tag = str.split("\\|");
		String userId = tag[0];
		return userId;
	}

	/**
	 * 获取公司id.
	 * @return 公司id.
	 */
	protected String getColonCompanyId(){
		String str = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		String[] tag = str.split("\\|");
		String com = tag[1];
		String[] cpStr = com.split("-");
		String companyId = cpStr[0];
		return companyId;
	}
}
