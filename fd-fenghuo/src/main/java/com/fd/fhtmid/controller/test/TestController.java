package com.fd.fhtmid.controller.test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.management.RuntimeErrorException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.TestMapper;
import com.fd.fhtmid.service.InvoiceService;
import com.fd.fhtmid.service.impl.TestService;
import com.fd.fhtmid.utils.third.ZhengXinUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@Controller
@RequestMapping("/test")
public class TestController extends BaseController{
	
	private final Logger logger = LoggerFactory.getLogger(TestController.class);
	
	@Autowired
	TestMapper tm;
	
	@Autowired
	ZhengXinUtil zxUtil;
	
	@Autowired
	InvoiceService invoiceService;
	
	@Autowired
	TestService ts;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
    public String list(HttpServletRequest request) {
		logger.info("csccsc");
		System.out.println(request.getParameter("csc"));
		System.out.println(request.getHeader("Authorization"));
		startPage();
		
		List<Map>  rs= tm.selectByName();
		System.out.println(rs);
		
		Map data = new HashMap();
		data.put("name", "csc");
		ApiResult ar = new ApiResult(0, "", data);
		String rt =  JSON.toJSONString(ar);
		
        return rt;
    }
	
	@RequestMapping(value = "/list2")
	@ResponseBody
	@Transactional
    public String list2(HttpServletRequest request) {
		logger.info(SecurityContextHolder.getContext().getAuthentication().toString());
//		System.out.println(SecurityContextHolder.getContext().getAuthentication());
		System.out.println("111111");
		ts.test();
		System.out.println("222222");
		
		Map rtnMap = zxUtil.P_B_B606("04","64204361","3200191130","","17.93","20191031");
		if(1==1) {
			throw new RuntimeErrorException(null, "csc");
		}
		

//		Map rtnMap = zxUtil.sh006("连云港凯达国际物流有限公司","cpws");
//		
//		
//		
//		
//		String retcode = rtnMap.get("retcode").toString();			
//		String request_sn = rtnMap.get("request_sn").toString();
//		String response_sn = rtnMap.get("response_sn").toString();
//		
//		System.out.println(rtnMap);
//		

//		invoiceService.create();
		
		
//		List<Map> detail_list = (List<Map>)((Map)rtnMap.get("retdata")).get("detail_list");
//		for (Map map : detail_list) {
//			System.out.println("detail_list "+map);
//		}
		
		
//		System.out.println(SecurityContextHolder.getContext().getAuthentication());
//		System.out.println(request.getParameter("csc"));
//		System.out.println(request.getHeader("token"));
		
		
//		System.out.println(ordApi.list(mb));
		Map data = new HashMap();
		data.put("name", "csc1111");
		ApiResult ar = new ApiResult(200, "", data);
		String rt =  JSON.toJSONString(ar);
		
        return rt;
    }
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	@ResponseBody
    public String login(HttpServletRequest request,HttpServletResponse response) {
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		System.out.println(auth);
//		System.out.println(ordApi.list(mb));
		Map data = new HashMap();
		data.put("csc", "111");
		ApiResult ar = new ApiResult(200, "", data);
		String rt =  JSON.toJSONString(ar);
		
        return rt;
    }
	
	@RequestMapping(value = "/logout")
	@ResponseBody
    public String logout(HttpServletRequest request,HttpServletResponse response) {
		System.out.println(request.getParameter("logout do"));
		System.out.println(request.getHeader("Authorization out"));
		
		 Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	     if (auth != null) {//清除认证
	       new SecurityContextLogoutHandler().logout(request, response, auth);
	     }
		
		
//		System.out.println(ordApi.list(mb));
		Map data = new HashMap();
		data.put("name", "csc");
		ApiResult ar = new ApiResult(200, "", data);
		String rt =  JSON.toJSONString(ar);
		
        return rt;
    }
	



    

}

