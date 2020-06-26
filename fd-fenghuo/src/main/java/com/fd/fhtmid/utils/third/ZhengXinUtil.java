package com.fd.fhtmid.utils.third;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.fd.fhtmid.domain.TZhengxinHis;
import com.fd.fhtmid.mapper.TZhengxinHisMapper;

@Component
@Transactional(propagation=Propagation.NOT_SUPPORTED)
public class ZhengXinUtil {
	
	@Value("${zhengxin.SERVER_URL}")
	public  String SERVER_URL;	
	
	@Value("${zhengxin.ACCOUNT_ID}")
	public  String ACCOUNT_ID;
	
	@Value("${zhengxin.HEX_AES_128_PASSWORD}")
	public  String HEX_AES_128_PASSWORD;
	
	
	@Value("${zhengxin.mode}")
	public  String mode;
	
	@Autowired
	TZhengxinHisMapper  tzhMapper;
	

	/**P_B_B606发票核验
	 * @param invoice_type 发票类型 
	 * @param invoice_no   发票号码	
	 * @param invoice_code 发票代码
	 * @param check_code_last6   校验码后六位，专票可为空
	 * @param total 发票金额（不含税）普票可为空
	 * @param create_date 开票日期	
	 * {"response_sn":"20191022140546333GCOZ","retdata":{"machine_no":"661817540333","note":" ","amount":"131","buyer_address":"上海市崇明区长兴镇潘园公路1800号3号楼51820室（上海泰和经济发展区）","seller_bank_info":"招商银行股份有限公司上海联洋支行121922825510701","detail_list":[{"unit":" ","amount":"127.18","name":"*餐饮服务*餐费","count":"1","tax":"3.82","type":" ","unit_price":"127.18446601941747","tax_rate":"3"}],"invoice_no":"18376829","buyer_bank_info":" ","buyer_name":"上海羽山数据科技中心（有限合伙）","total_tax":"3.82","verify_date":"2019-10-22 14:05:47","seller_address":"上海市浦东新区芳甸路185号2楼201室B单元 021-68517066","productO_oil_flag":"N","invoice_code":"031001800304","total":"127.18","seller_name":"上海够劲餐饮管理有限公司","buyer_tax_no":"91310230MA1K2JK072","seller_tax_no":"91310115MA1K3GA78N","check_code":"59960616931608494726","verify_count":"8","create_date":"20190615","cancel_flag":"N"},"version":"1.0","request_sn":"74fd3b34251a4e96a657f723d8b07890","retmsg":"交易成功","retdate":1571724348180,"retcode":"000000"}
	 * @return 
	 */
	public Map P_B_B606(String invoice_type,String invoice_no,String invoice_code,String check_code_last6,String total,String create_date) {
		Map rtnMap = new HashMap();
		String req_sn1 = UUID.randomUUID().toString().replace("-", "");
		System.out.println("请求交易号为:"+req_sn1);
		Map<String, Object> productDetailParam = new HashMap<>();
			
		//产品入参
		
		productDetailParam.put("invoice_type", invoice_type);
		productDetailParam.put("invoice_no", invoice_no);
		productDetailParam.put("invoice_code", invoice_code);
		productDetailParam.put("check_code_last6", check_code_last6);
		productDetailParam.put("total", total);
		productDetailParam.put("create_date", create_date);
		
		ProductDto productDto = new ProductDto();
		productDto.setAcct_id(ACCOUNT_ID);
		//产品编号
		productDto.setInf_id("P_B_B606");
		productDto.setProd_id("P_B_B606");
		productDto.setReq_time(System.currentTimeMillis());
		productDto.setRequest_sn(req_sn1); //请保证这个id唯一
		productDto.setReq_data(productDetailParam);
		GladAES gladAES;
		try {
			gladAES = new GladAES(Hex.decodeHex(HEX_AES_128_PASSWORD.toCharArray()));
			String jsonString = JSON.toJSONString(productDto);
			System.out.println("请求字符串:"+jsonString);
			byte[] encryptBytes = gladAES.encrypt(jsonString);
	        //2.2 BASE64
	        String base64String = Base64.encodeBase64String(encryptBytes);
	        System.out.println("加密字符串:"+base64String);
	        String response = null;
	        if(mode.equals("1")) {
	        	
	        	response = "{\"response_sn\":\"20191022140546333GCOZ\",\"retdata\":{\"machine_no\":\"661817540333\",\"note\":\" \",\"amount\":\"131\",\"buyer_address\":\"上海市崇明区长兴镇潘园公路1800号3号楼51820室（上海泰和经济发展区）\",\"seller_bank_info\":\"招商银行股份有限公司上海联洋支行121922825510701\",\"detail_list\":[{\"unit\":\" \",\"amount\":\"127.18\",\"name\":\"*餐饮服务*餐费\",\"count\":\"1\",\"tax\":\"3.82\",\"type\":\" \",\"unit_price\":\"127.18446601941747\",\"tax_rate\":\"3\"}],\"invoice_no\":\"18376829\",\"buyer_bank_info\":\" \",\"buyer_name\":\"上海羽山数据科技中心（有限合伙）\",\"total_tax\":\"3.82\",\"verify_date\":\"2019-10-22 14:05:47\",\"seller_address\":\"上海市浦东新区芳甸路185号2楼201室B单元 021-68517066\",\"productO_oil_flag\":\"N\",\"invoice_code\":\"031001800304\",\"total\":\"127.18\",\"seller_name\":\"上海够劲餐饮管理有限公司\",\"buyer_tax_no\":\"91310230MA1K2JK072\",\"seller_tax_no\":\"91310115MA1K3GA78N\",\"check_code\":\"59960616931608494726\",\"verify_count\":\"8\",\"create_date\":\"20190615\",\"cancel_flag\":\"N\"},\"version\":\"1.0\",\"request_sn\":\"74fd3b34251a4e96a657f723d8b07890\",\"retmsg\":\"交易成功\",\"retdate\":1571724348180,\"retcode\":\"000000\"}";
	        	rtnMap = JSON.parseObject(response);  
	        	
	        }else if(mode.equals("2")) {
	        	response = HttpUtils.HttpSend(base64String,SERVER_URL,gladAES,ACCOUNT_ID);
	        	rtnMap = JSON.parseObject(response);  
	        	
	        	
	        	String retcode = rtnMap.get("retcode")==null?"":rtnMap.get("retcode").toString();			
				String request_sn = rtnMap.get("request_sn")==null?"":rtnMap.get("request_sn").toString();
				String response_sn = rtnMap.get("response_sn")==null?"":rtnMap.get("response_sn").toString();
				
				
				TZhengxinHis yzh  = new TZhengxinHis();
				yzh.setId(req_sn1);
				yzh.setRequest_sn(request_sn);
				yzh.setResponse_sn(response_sn);
				yzh.setCreate_time(new Date());
				yzh.setRtn_code(retcode);
				yzh.setJson_txt(rtnMap.toString());
				yzh.setFun_code("P_B_B606");
				tzhMapper.save(yzh);
	        	
	        }else {
	        	
	        }
			
			//
			
			
			System.out.println("调用发票核验产品返回结果值map:\n"+rtnMap);
			
			
			
		} catch (Exception e) {
			
			e.printStackTrace();

			rtnMap = new HashMap();
			rtnMap.put("retcode", "-999999");
			rtnMap.put("retmsg", "-999999");


			
		}
		
		return rtnMap;
	}
	
	
	
	/**P_B_B010企业信息核查
	 * @param seller 销售方公司全称
	 * @return {"response_sn":"20191022163855491ZNIO","retdata":{"end_date":"-","reg_no":"-","city":"3303","quoted_type":[],"found":"1","province":"ZJ","check_date":"2019-07-04","contact":{"address":"浙江省温州市永嘉县东瓯街道","telephone":"","email":""},"scope":"制造、加工、销售：服饰、服装、皮具、箱包、文具用品、金属工艺品、手表、眼镜（不含隐形眼镜）；货物进出口、技术进出口（依法须经批准的项目，经相关部门批准后方可开展经营活动）","belong_org":"永嘉县市场监督管理局","term_end":"9999-09-09","id":"10d4b026-1ee1-4e31-b153-9ab46395134f","abnormal_items":[],"org_no":"MA2CQWJJ7","econ_kind":"有限责任公司(自然人独资)","econ_kind_code":"1151","start_date":"2018-08-08","changerecords":[{"change_date":"2019-07-04","tag":"非历史信息","before_content":"原联络员姓名:章文龙;原联络员固定电话:;原联络员移动电话:*********** ;原联络员电子邮箱:;原联络员身份证件类型:中华人民共和国居民身份证;原联络人员证件号码:******************;原财务负责人姓名:章文龙;原财务负责人固定电话:;原财务负责人移动电话:***********;原财务负责人电子邮箱:;原财务负责人证件名称:中华人民共和国居民身份证;原财务负责人身份证件号码:******************","after_content":"现联络员姓名:叶建素;现联络员固定电话:;现联络员移动电话:*********** ;现联络员电子邮箱:;现联络员身份证件类型:中华人民共和国居民身份证;现联络人员证件号码:******************;现财务负责人姓名:叶建素;现财务负责人固定电话:;现财务负责人移动电话:***********;现财务负责人电子邮箱:;现财务负责人证件名称:中华人民共和国居民身份证;现财务负责人身份证件号码:******************","change_item":"其他"},{"change_date":"2019-07-04","tag":"非历史信息","before_content":"章文龙","after_content":"叶建素","change_item":"法定代表人"},{"change_date":"2019-07-04","tag":"非历史信息","before_content":"姓名: 叶建素; 证件号码: ******************; 职位: 监事;姓名: 章文龙; 证件号码: ******************; 职位: 执行董事;姓名: 章文龙; 证件号码: ******************; 职位: 经理;","after_content":"姓名: 叶建素; 证件号码: ******************; 职位: 执行董事;姓名: 叶建素; 证件号码: ******************; 职位: 经理;姓名: 章文龙; 证件号码: ******************; 职位: 经理;","change_item":"高管"},{"change_date":"2019-07-04","tag":"非历史信息","before_content":"姓名: 章文龙; 出资额: ***万; 百分比: ***%;","after_content":"姓名: 叶建素; 出资额: ***万; 百分比: ***%;","change_item":"股东情况"}],"address":"浙江省温州市永嘉县瓯北街道东瓯工业区双塔路3002号（浙江力德利服饰有限公司内一层）","oper_name":"叶建素","domains":["纺织服装、服饰业"],"history_names":[],"branches":[],"credit_no":"91330324MA2CQWJJ7D","term_start":"2018-08-08","partners":[{"identify_no":"-","stock_type":"自然人股东","real_capi_items":[],"name":"叶建素","identify_type":"非公示项","should_capi_items":[{"should_capi_date":"2028-12-31","invest_type":"货币","shoud_capi":"100 万人民币"}],"total_real_capi":"-","total_should_capi":"100 万人民币"}],"name":"温州夏力服饰有限公司","websites":[],"employees":[{"name":"章文龙","job_title":"经理"},{"name":"叶建素","job_title":"经理"},{"name":"叶建素","job_title":"执行董事"}],"is_quoted":"0","regist_capi":"100 万元人民币","status":"存续"},"version":"1.0","request_sn":"8751a50614854f9c9435fcc4771b5e1e","retmsg":"交易成功","retdate":1571733535887,"retcode":"000000"}
	 */
	public Map P_B_B010(String seller) {
		Map rtnMap = new HashMap();
		String req_sn1 = UUID.randomUUID().toString().replace("-", "");
		System.out.println("请求交易号为:"+req_sn1);
		Map<String, Object> productDetailParam = new HashMap<>();
			
		//产品入参
		
		productDetailParam.put("keyWord", seller);
		productDetailParam.put("keyType", "2");
		
		ProductDto productDto = new ProductDto();
		productDto.setAcct_id(ACCOUNT_ID);
		//产品编号
		productDto.setInf_id("P_B_B010");
		productDto.setProd_id("P_B_B010");
		
		productDto.setReq_time(System.currentTimeMillis());
		productDto.setRequest_sn(req_sn1); //请保证这个id唯一
		productDto.setReq_data(productDetailParam);
		GladAES gladAES;
		try {
			gladAES = new GladAES(Hex.decodeHex(HEX_AES_128_PASSWORD.toCharArray()));
			String jsonString = JSON.toJSONString(productDto);
			System.out.println("请求字符串:"+jsonString);
			byte[] encryptBytes = gladAES.encrypt(jsonString);
	        //2.2 BASE64
	        String base64String = Base64.encodeBase64String(encryptBytes);
	        System.out.println("加密字符串:"+base64String);
			
	        String response = "";
	        if(mode.equals("1")) {
	        	
	        	response = "{\"response_sn\":\"20191022163855491ZNIO\",\"retdata\":{\"end_date\":\"-\",\"reg_no\":\"-\",\"city\":\"3303\",\"quoted_type\":[],\"found\":\"1\",\"province\":\"ZJ\",\"check_date\":\"2019-07-04\",\"contact\":{\"address\":\"浙江省温州市永嘉县东瓯街道\",\"telephone\":\"\",\"email\":\"\"},\"scope\":\"制造、加工、销售：服饰、服装、皮具、箱包、文具用品、金属工艺品、手表、眼镜（不含隐形眼镜）；货物进出口、技术进出口（依法须经批准的项目，经相关部门批准后方可开展经营活动）\",\"belong_org\":\"永嘉县市场监督管理局\",\"term_end\":\"9999-09-09\",\"id\":\"10d4b026-1ee1-4e31-b153-9ab46395134f\",\"abnormal_items\":[],\"org_no\":\"MA2CQWJJ7\",\"econ_kind\":\"有限责任公司(自然人独资)\",\"econ_kind_code\":\"1151\",\"start_date\":\"2018-08-08\",\"changerecords\":[{\"change_date\":\"2019-07-04\",\"tag\":\"非历史信息\",\"before_content\":\"原联络员姓名:章文龙;原联络员固定电话:;原联络员移动电话:*********** ;原联络员电子邮箱:;原联络员身份证件类型:中华人民共和国居民身份证;原联络人员证件号码:******************;原财务负责人姓名:章文龙;原财务负责人固定电话:;原财务负责人移动电话:***********;原财务负责人电子邮箱:;原财务负责人证件名称:中华人民共和国居民身份证;原财务负责人身份证件号码:******************\",\"after_content\":\"现联络员姓名:叶建素;现联络员固定电话:;现联络员移动电话:*********** ;现联络员电子邮箱:;现联络员身份证件类型:中华人民共和国居民身份证;现联络人员证件号码:******************;现财务负责人姓名:叶建素;现财务负责人固定电话:;现财务负责人移动电话:***********;现财务负责人电子邮箱:;现财务负责人证件名称:中华人民共和国居民身份证;现财务负责人身份证件号码:******************\",\"change_item\":\"其他\"},{\"change_date\":\"2019-07-04\",\"tag\":\"非历史信息\",\"before_content\":\"章文龙\",\"after_content\":\"叶建素\",\"change_item\":\"法定代表人\"},{\"change_date\":\"2019-07-04\",\"tag\":\"非历史信息\",\"before_content\":\"姓名: 叶建素; 证件号码: ******************; 职位: 监事;姓名: 章文龙; 证件号码: ******************; 职位: 执行董事;姓名: 章文龙; 证件号码: ******************; 职位: 经理;\",\"after_content\":\"姓名: 叶建素; 证件号码: ******************; 职位: 执行董事;姓名: 叶建素; 证件号码: ******************; 职位: 经理;姓名: 章文龙; 证件号码: ******************; 职位: 经理;\",\"change_item\":\"高管\"},{\"change_date\":\"2019-07-04\",\"tag\":\"非历史信息\",\"before_content\":\"姓名: 章文龙; 出资额: ***万; 百分比: ***%;\",\"after_content\":\"姓名: 叶建素; 出资额: ***万; 百分比: ***%;\",\"change_item\":\"股东情况\"}],\"address\":\"浙江省温州市永嘉县瓯北街道东瓯工业区双塔路3002号（浙江力德利服饰有限公司内一层）\",\"oper_name\":\"叶建素\",\"domains\":[\"纺织服装、服饰业\"],\"history_names\":[],\"branches\":[],\"credit_no\":\"91330324MA2CQWJJ7D\",\"term_start\":\"2018-08-08\",\"partners\":[{\"identify_no\":\"-\",\"stock_type\":\"自然人股东\",\"real_capi_items\":[],\"name\":\"叶建素\",\"identify_type\":\"非公示项\",\"should_capi_items\":[{\"should_capi_date\":\"2028-12-31\",\"invest_type\":\"货币\",\"shoud_capi\":\"100 万人民币\"}],\"total_real_capi\":\"-\",\"total_should_capi\":\"100 万人民币\"}],\"name\":\"温州夏力服饰有限公司\",\"websites\":[],\"employees\":[{\"name\":\"章文龙\",\"job_title\":\"经理\"},{\"name\":\"叶建素\",\"job_title\":\"经理\"},{\"name\":\"叶建素\",\"job_title\":\"执行董事\"}],\"is_quoted\":\"0\",\"regist_capi\":\"100 万元人民币\",\"status\":\"存续\"},\"version\":\"1.0\",\"request_sn\":\"8751a50614854f9c9435fcc4771b5e1e\",\"retmsg\":\"交易成功\",\"retdate\":1571733535887,\"retcode\":\"000000\"}";
	        	rtnMap = JSON.parseObject(response);  
	              	
	        }else if(mode.equals("2")) {
	        	
	        	response = HttpUtils.HttpSend(base64String,SERVER_URL,gladAES,ACCOUNT_ID);
	        	rtnMap = JSON.parseObject(response);  
	        	
	        	String retcode = rtnMap.get("retcode")==null?"":rtnMap.get("retcode").toString();			
				String request_sn = rtnMap.get("request_sn")==null?"":rtnMap.get("request_sn").toString();
				String response_sn = rtnMap.get("response_sn")==null?"":rtnMap.get("response_sn").toString();
				
				TZhengxinHis yzh  = new TZhengxinHis();
				yzh.setId(req_sn1);
				yzh.setRequest_sn(request_sn);
				yzh.setResponse_sn(response_sn);
				yzh.setCreate_time(new Date());
				yzh.setRtn_code(retcode);
				yzh.setJson_txt(rtnMap.toString());
				yzh.setFun_code("P_B_B010");
				
				tzhMapper.save(yzh);
	        	
	        }else {
	        	
	        }
	       
			
			
			System.out.println("调用企业信息核查返回结果值map:\n"+rtnMap);
			
			
			
		} catch (Exception e) {


			rtnMap = new HashMap();
			rtnMap.put("retcode", "-999999");
			rtnMap.put("retmsg", "-999999");
			
		}
		
		return rtnMap;
	}
	
	
	/**P_B_B019企业基本信息
	 * @param seller 销售方公司全称
	 * @return {"response_sn":"20191022163855491ZNIO","retdata":{"end_date":"-","reg_no":"-","city":"3303","quoted_type":[],"found":"1","province":"ZJ","check_date":"2019-07-04","contact":{"address":"浙江省温州市永嘉县东瓯街道","telephone":"","email":""},"scope":"制造、加工、销售：服饰、服装、皮具、箱包、文具用品、金属工艺品、手表、眼镜（不含隐形眼镜）；货物进出口、技术进出口（依法须经批准的项目，经相关部门批准后方可开展经营活动）","belong_org":"永嘉县市场监督管理局","term_end":"9999-09-09","id":"10d4b026-1ee1-4e31-b153-9ab46395134f","abnormal_items":[],"org_no":"MA2CQWJJ7","econ_kind":"有限责任公司(自然人独资)","econ_kind_code":"1151","start_date":"2018-08-08","changerecords":[{"change_date":"2019-07-04","tag":"非历史信息","before_content":"原联络员姓名:章文龙;原联络员固定电话:;原联络员移动电话:*********** ;原联络员电子邮箱:;原联络员身份证件类型:中华人民共和国居民身份证;原联络人员证件号码:******************;原财务负责人姓名:章文龙;原财务负责人固定电话:;原财务负责人移动电话:***********;原财务负责人电子邮箱:;原财务负责人证件名称:中华人民共和国居民身份证;原财务负责人身份证件号码:******************","after_content":"现联络员姓名:叶建素;现联络员固定电话:;现联络员移动电话:*********** ;现联络员电子邮箱:;现联络员身份证件类型:中华人民共和国居民身份证;现联络人员证件号码:******************;现财务负责人姓名:叶建素;现财务负责人固定电话:;现财务负责人移动电话:***********;现财务负责人电子邮箱:;现财务负责人证件名称:中华人民共和国居民身份证;现财务负责人身份证件号码:******************","change_item":"其他"},{"change_date":"2019-07-04","tag":"非历史信息","before_content":"章文龙","after_content":"叶建素","change_item":"法定代表人"},{"change_date":"2019-07-04","tag":"非历史信息","before_content":"姓名: 叶建素; 证件号码: ******************; 职位: 监事;姓名: 章文龙; 证件号码: ******************; 职位: 执行董事;姓名: 章文龙; 证件号码: ******************; 职位: 经理;","after_content":"姓名: 叶建素; 证件号码: ******************; 职位: 执行董事;姓名: 叶建素; 证件号码: ******************; 职位: 经理;姓名: 章文龙; 证件号码: ******************; 职位: 经理;","change_item":"高管"},{"change_date":"2019-07-04","tag":"非历史信息","before_content":"姓名: 章文龙; 出资额: ***万; 百分比: ***%;","after_content":"姓名: 叶建素; 出资额: ***万; 百分比: ***%;","change_item":"股东情况"}],"address":"浙江省温州市永嘉县瓯北街道东瓯工业区双塔路3002号（浙江力德利服饰有限公司内一层）","oper_name":"叶建素","domains":["纺织服装、服饰业"],"history_names":[],"branches":[],"credit_no":"91330324MA2CQWJJ7D","term_start":"2018-08-08","partners":[{"identify_no":"-","stock_type":"自然人股东","real_capi_items":[],"name":"叶建素","identify_type":"非公示项","should_capi_items":[{"should_capi_date":"2028-12-31","invest_type":"货币","shoud_capi":"100 万人民币"}],"total_real_capi":"-","total_should_capi":"100 万人民币"}],"name":"温州夏力服饰有限公司","websites":[],"employees":[{"name":"章文龙","job_title":"经理"},{"name":"叶建素","job_title":"经理"},{"name":"叶建素","job_title":"执行董事"}],"is_quoted":"0","regist_capi":"100 万元人民币","status":"存续"},"version":"1.0","request_sn":"8751a50614854f9c9435fcc4771b5e1e","retmsg":"交易成功","retdate":1571733535887,"retcode":"000000"}
	 */
	public Map P_B_B019(String seller) {
		Map rtnMap = new HashMap();
		String req_sn1 = UUID.randomUUID().toString().replace("-", "");
		System.out.println("请求交易号为:"+req_sn1);
		Map<String, Object> productDetailParam = new HashMap<>();
			
		//产品入参
		
		productDetailParam.put("entname", seller);
		
		ProductDto productDto = new ProductDto();
		productDto.setAcct_id(ACCOUNT_ID);
		//产品编号
		productDto.setInf_id("P_B_B019");
		productDto.setProd_id("P_B_B019");
		productDto.setReq_time(System.currentTimeMillis());
		productDto.setRequest_sn(req_sn1); //请保证这个id唯一
		productDto.setReq_data(productDetailParam);
		GladAES gladAES;
		try {
			gladAES = new GladAES(Hex.decodeHex(HEX_AES_128_PASSWORD.toCharArray()));
			String jsonString = JSON.toJSONString(productDto);
			System.out.println("请求字符串:"+jsonString);
			byte[] encryptBytes = gladAES.encrypt(jsonString);
	        //2.2 BASE64
	        String base64String = Base64.encodeBase64String(encryptBytes);
	        System.out.println("加密字符串:"+base64String);
			
	        String response = "";
	        if(mode.equals("1")) {
	        	
	        	response = "{\"response_sn\":\"20191022175726281WOXK\",\"retdata\":{\"ALTER\":[{\"ALTITEM\":\"高级管理人员备案\",\"ALTBE\":\"姓名: 叶建素; 证件号码: ******************; 职位: 监事;姓名: 章文龙; 证件号码: ******************; 职位: 执行董事;姓名: 章文龙; 证件号码: ******************; 职位: 经理;\",\"ALTAF\":\"姓名: 叶建素; 证件号码: ******************; 职位: 执行董事;姓名: 叶建素; 证件号码: ******************; 职位: 经理;姓名: 章文龙; 证件号码: ******************; 职位: 经理;\",\"ALTDATE\":\"2019-07-04\"},{\"ALTITEM\":\"企业联络人员、财务人员\",\"ALTBE\":\"原联络员姓名:章文龙;原联络员固定电话:;原联络员移动电话:*********** ;原联络员电子邮箱:;原联络员身份证件类型:中华人民共和国居民身份证;原联络人员证件号码:******************;原财务负责人姓名:章文龙;原财务负责人固定电话:;原财务负责人移动电话:***********;原财务负责人电子邮箱:;原财务负责人证件名称:中华人民共和国居民身份证;原财务负责人身份证件号码:******************\",\"ALTAF\":\"现联络员姓名:叶建素;现联络员固定电话:;现联络员移动电话:*********** ;现联络员电子邮箱:;现联络员身份证件类型:中华人民共和国居民身份证;现联络人员证件号码:******************;现财务负责人姓名:叶建素;现财务负责人固定电话:;现财务负责人移动电话:***********;现财务负责人电子邮箱:;现财务负责人证件名称:中华人民共和国居民身份证;现财务负责人身份证件号码:******************\",\"ALTDATE\":\"2019-07-04\"},{\"ALTITEM\":\"投资人(股权)备案\",\"ALTBE\":\"姓名: 章文龙; 出资额: ***万; 百分比: ***%;\",\"ALTAF\":\"姓名: 叶建素; 出资额: ***万; 百分比: ***%;\",\"ALTDATE\":\"2019-07-04\"},{\"ALTITEM\":\"法定代表人变更\",\"ALTBE\":\"章文龙\",\"ALTAF\":\"叶建素\",\"ALTDATE\":\"2019-07-04\"}],\"MORTGAGECAN\":[],\"FRINV\":[],\"FILIATION\":[],\"STOCKPAWN\":[],\"MORTGAGEREG\":[],\"FRPOSITION\":[],\"BASIC\":{\"ENTNAME\":\"温州夏力服饰有限公司\",\"ID\":\"330000\\u0001734C844A714D748DE0531ECDA8C0F6AC\\u00012018081407222801083087\",\"ENTNAME_OLD\":\"\",\"ORGCODES\":\"MA2CQWJJ7\",\"CREDITCODE\":\"91330324MA2CQWJJ7D\",\"REGNO\":\"330324000246092\",\"ORIREGNO\":\"\",\"FRNAME\":\"叶建素\",\"REGCAP\":\"100.000000\",\"REGCAPCURCODE\":\"156\",\"REGCAPCUR\":\"人民币元\",\"ESDATE\":\"2018-08-08\",\"OPFROM\":\"2018-08-08\",\"OPTO\":\"长期\",\"ENTITYTYPE\":\"1\",\"ENTTYPE\":\"有限责任公司(自然人独资)\",\"ENTSTATUS\":\"在营（开业）\",\"ENTSTATUSCODE\":\"1\",\"ABUITEM\":\"\",\"ZSOPSCOPE\":\"制造、加工、销售：服饰、服装、皮具、箱包、文具用品、金属工艺品、手表、眼镜（不含隐形眼镜）；货物进出口、技术进出口（依法须经批准的项目，经相关部门批准后方可开展经营活动）\",\"REGORG\":\"永嘉县市场监督管理局\",\"ANCHEYEAR\":\"2018\",\"CANDATE\":\"\",\"REVDATE\":\"\",\"RECCAP\":\"\",\"APPRDATE\":\"2019-07-04\",\"ENTTYPECODE\":\"1151\",\"INDUSTRYCOCODE\":\"183\",\"INDUSTRYCONAME\":\"服饰制造\",\"DOM\":\"浙江省温州市永嘉县瓯北街道东瓯工业区双塔路3002号(浙江力德利服饰有限公司内一层）\",\"REGORGCODE\":\"330324\",\"DOMDISTRICT\":\"\",\"REGORGPROVINCE\":\"浙江省\",\"REGORGCITY\":\"浙江省温州市\",\"REGCITY\":\"330300\",\"REGORGDISTRICT\":\"浙江省温州市永嘉县\",\"EMAIL\":\"\",\"POSTALCODE\":\"325000\",\"S_EXT_NODENUM\":\"330000\",\"COUNTRYCODE\":\"\",\"COUNTRY\":\"\",\"QRCODE_IMAGE_BASE64\":\"iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQAAAABRBrPYAAAC/0lEQVR42u2aPY6kUAyE3eqAkCNwE7hYSyBxMfomHIHwBS28VWVmRzATbLbPEgSom/4IPP4p22/M/+Xa7MZu7MZu7Mb+D1YMl7/905W+9bVZ2qkrg88rHj+TYIP7WqwlZi8rj+3V4bdxxW9zEqy35+p7O3vz9smaRYYDw6uZsLBvsRFf9cL2zIbxS9fs7WT2QOQx1DJhirfBkSgPBBhsfnqD57+GZaUYs54uWi+3X4pDpdhXhaV9uJVhQ+oPYaTnwApjy+gnJbxZ647b1CFvxhwYrqmLvFlQgG3Y4DtD/hvUJAlG+5p35PpIBfwYUuajApwDg5HWhVXUEGTLZJH6+ymzasbwiAqoyIOG8JORpZLnwBBlsg8uonzAbShcqsIMuhQYHvmqNC/MFqWMEh4veA7MdxhEIyHi/MRsMQqiSlgKLOJtYXrwVqR7cODa7FkwXWEfTaPHOoVf6bNgbPqioTWMFR1qr1MLX5yW5hxYXGjCcWOUKf/1dW+zYNF9sOwu7MkH+k7deW9jGuypxjzMZX/baaIo54a2Zkx6gTaWtVfz0LeGeA5MA6nU7ujJMWfzBb9kfcWYK7Yk2O9NPTmVg9c53irG1A1yx6EuilPpZBr4JIgpMOU68uYVooE+ZGRz+ImJOwUWyqGBVIliFL8HF0/nP0jVmCvNqXttjHmcKFSK5yRYL8fEuik+cTLCmHcJy4ox9uQuI7X5Y+qzEnSX2lsxJsLkIu7J2I4ffYinwbgp5q6GKzL0gIwytbbNeT6tGNP6XpbK5pDBXvJx6cmrxbhhjR2+aWU5YMBoNHY/LhuzejHNdbt2TlxZQrrhO2a9n1WmXkw9IOUj9JtbAg7bclYSzI/qNX9vzDptYksaLHb47MnpnVXZ4joMGi5L5nqx4e+pya4ZSTunrzOVHFgcycHI5ujJY4fPky3PhMVZxKbxyKjfOuodM2FaMtG+cmwJfs6nFWM6VaQCck2jmsV+6nWoYgrsyPqRezIMRe9oco9NbArs/r+aG7uxG7uxxNgftSTTCR6Z/s0AAAAASUVORK5CYII=\",\"LOGOIMGNAME\":\"7B7fJnTMhk2s9bnxEgGUWaZYNjQYAfC2J9JZ4KbJkTNieocaGZqGT68\"},\"SHARESFROST\":[],\"ENTINV\":[],\"RELATEDPUNISHED\":[],\"MORTGAGEDEBT\":[],\"MORTGAGEPAWN\":[],\"SHAREHOLDER\":[{\"INVTYPE\":\"自然人股东\",\"COUNTRY\":\"\",\"SUBCONAM\":\"100.000000\",\"ACCONAM\":\"\",\"CONFORM\":\"\",\"CONDATE\":\"\",\"SHANAME\":\"叶建素\",\"FUNDEDRATIO\":\"100.00%\",\"INVTYPECODE\":\"20\",\"CONFORMCODE\":\"\",\"COUNTRYCODE\":\"\",\"REGCAPCUR\":\"\",\"CURRENCYCODE\":\"\",\"CREDITCODE\":\"\",\"REGNO\":\"\"}],\"PUNISHBREAK\":[],\"ENTCASEBASEINFO\":[],\"PUNISHED\":[],\"PERSON\":[{\"POSITION\":\"执行董事\",\"PERNAME\":\"叶建素\",\"POSITIONCODE\":\"432K\",\"ENTNAME\":\"温州夏力服饰有限公司\",\"PERSONAMOUNT\":\"3\"},{\"POSITION\":\"经理\",\"PERNAME\":\"叶建素\",\"POSITIONCODE\":\"436A\",\"ENTNAME\":\"温州夏力服饰有限公司\",\"PERSONAMOUNT\":\"3\"},{\"POSITION\":\"经理\",\"PERNAME\":\"章文龙\",\"POSITIONCODE\":\"436A\",\"ENTNAME\":\"温州夏力服饰有限公司\",\"PERSONAMOUNT\":\"3\"}],\"MORTGAGEBASIC\":[],\"MORTGAGEPER\":[],\"STOCKPAWNALT\":[],\"BASICLIST\":null,\"RELATEDPUNISHBREAK\":[],\"MORTGAGEALT\":[],\"STOCKPAWNREV\":[]},\"version\":\"1.0\",\"request_sn\":\"91f371e93f0c4a318740011844d71c73\",\"retmsg\":\"交易成功\",\"retdate\":1571738246596,\"retcode\":\"000000\"}";
	        	rtnMap = JSON.parseObject(response);  	              	
	        }else if(mode.equals("2")) {
	        	
	        	response = HttpUtils.HttpSend(base64String,SERVER_URL,gladAES,ACCOUNT_ID);
	        	rtnMap = JSON.parseObject(response);  
	        	String retcode = rtnMap.get("retcode")==null?"":rtnMap.get("retcode").toString();			
				String request_sn = rtnMap.get("request_sn")==null?"":rtnMap.get("request_sn").toString();
				String response_sn = rtnMap.get("response_sn")==null?"":rtnMap.get("response_sn").toString();
				
				System.out.println(retcode+request_sn+response_sn);
				TZhengxinHis yzh  = new TZhengxinHis();
				yzh.setId(req_sn1);
				yzh.setRequest_sn(request_sn);
				yzh.setResponse_sn(response_sn);
				yzh.setCreate_time(new Date());
				yzh.setRtn_code(retcode);
				yzh.setJson_txt(rtnMap.toString());
				yzh.setFun_code("P_B_B019");
				
				tzhMapper.save(yzh);
	        }else {
	        	
	        }
	       
			
			
			System.out.println("调用企业基本信息返回结果值map:\n"+rtnMap);
			
			
			
		} catch (Exception e) {


			rtnMap = new HashMap();
			rtnMap.put("retcode", "-999999");
			rtnMap.put("retmsg", "系统处理异常");
			
		}
		
		return rtnMap;
	}
	
	
	
	/**sh006调用企业法院信息查询
	 *
	 * 
	 */
	public Map sh006(String seller,String dataType) {
		Map rtnMap = new HashMap();
		String req_sn1 = UUID.randomUUID().toString().replace("-", "");
		System.out.println("请求交易号为:"+req_sn1);
		Map<String, Object> productDetailParam = new HashMap<>();
			
		//产品入参
		
		productDetailParam.put("name", seller);
		productDetailParam.put("dataType", dataType);
//		productDetailParam.put("crawtime", "20180101-20190101");
		productDetailParam.put("pageno", "1");
		productDetailParam.put("range", "10");
		ProductDto productDto = new ProductDto();
		productDto.setAcct_id(ACCOUNT_ID);
		//产品编号
		productDto.setInf_id("P_B_B183");
		productDto.setProd_id("sh_006");
		productDto.setReq_time(System.currentTimeMillis());
		productDto.setRequest_sn(req_sn1); //请保证这个id唯一
		productDto.setReq_data(productDetailParam);
		GladAES gladAES;
		try {
			gladAES = new GladAES(Hex.decodeHex(HEX_AES_128_PASSWORD.toCharArray()));
			String jsonString = JSON.toJSONString(productDto);
			System.out.println("请求字符串:"+jsonString);
			byte[] encryptBytes = gladAES.encrypt(jsonString);
	        //2.2 BASE64
	        String base64String = Base64.encodeBase64String(encryptBytes);
	        System.out.println("加密字符串:"+base64String);
			
	        String response = "";
	        if(mode.equals("1")) {
	        	
	        	response = "{\"response_sn\":\"20191022191946925VNKB\",\"retdata\":{\"cpwsList\":[{\"sortTimeString\":\"2017年11月20日\",\"sortTime\":1511107200000,\"dataType\":\"cpws\",\"body\":\"...3387号...原告：连云港凯达国际物流有限公司...\",\"partyId\":\"c2017320703minchu3387_t20171120@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"连云港凯达国际物流有限公司与连云港瑞鸿国际贸易有限公司、连云港龙顺塑料有限公司等买卖合同纠纷一审民事判决书\",\"entryId\":\"c2017320703minchu3387_t20171120@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"},{\"sortTimeString\":\"2016年10月12日\",\"sortTime\":1476201600000,\"dataType\":\"cpws\",\"body\":\"...务所律师。...被告：连云港凯达国际物流有限公司...\",\"partyId\":\"c20163207minchu52_t20161012@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"江苏省武德人和实业有限公司与连云港凯达国际物流有限公司、江苏连云港港物流控股有限公司租赁合同纠纷一审民事判决书\",\"entryId\":\"c20163207minchu52_t20161012@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"},{\"sortTimeString\":\"2016年09月14日\",\"sortTime\":1473782400000,\"dataType\":\"cpws\",\"body\":\"...初119号...原告：连云港凯达国际物流有限公司...\",\"partyId\":\"c20163207minchu119_t20160914@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"连云港凯达国际物流有限公司与上海盛伦国际物流有限公司连云港分公司、上海盛伦国际物流有限公司等货运代理合同纠纷一审民事裁定书\",\"entryId\":\"c20163207minchu119_t20160914@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"},{\"sortTimeString\":\"2016年06月29日\",\"sortTime\":1467129600000,\"dataType\":\"cpws\",\"body\":\"...8号...申请执行人：连云港凯达国际物流有限公司...\",\"partyId\":\"c2016320703zhi308_t20160629@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"（2016）苏0703执308号\",\"entryId\":\"c2016320703zhi308_t20160629@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"},{\"sortTimeString\":\"2016年06月23日\",\"sortTime\":1466611200000,\"dataType\":\"cpws\",\"body\":\"...上诉人（原审被告）连云港凯达国际物流有限公司...\",\"partyId\":\"c201632minxiazhong81_t20160623@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"江苏省武德人和实业有限公司与连云港凯达国际物流有限公司、江苏连云港港物流控股有限公司管辖裁定书\",\"entryId\":\"c201632minxiazhong81_t20160623@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"},{\"sortTimeString\":\"2016年06月01日\",\"sortTime\":1464710400000,\"dataType\":\"cpws\",\"body\":\"...上诉人（原审原告）连云港凯达国际物流有限公司...\",\"partyId\":\"c201632minzhong744_t20160601@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"连云港凯达国际物流有限公司与上海盛伦国际物流有限公司连云港分公司、上海盛伦国际物流有限公司等管辖裁定书\",\"entryId\":\"c201632minzhong744_t20160601@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"},{\"sortTimeString\":\"2015年12月18日\",\"sortTime\":1450368000000,\"dataType\":\"cpws\",\"body\":\"...第1080号...原告连云港凯达国际物流有限公司...\",\"partyId\":\"c2015gangshangchu1080_t20151218@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"（2015）港商初字第1080号\",\"entryId\":\"c2015gangshangchu1080_t20151218@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"},{\"sortTimeString\":\"2015年05月16日\",\"sortTime\":1431705600000,\"dataType\":\"cpws\",\"body\":\"...47-1号...原告连云港凯达国际物流有限公司...\",\"partyId\":\"c2015lianshangminchu147-1_t20150516@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"连云港凯达国际物流有限公司与上海盛伦国际物流有限公司连云港分公司、上海盛伦国际物流有限公司等货运代理合同纠纷一审民事裁定书\",\"entryId\":\"c2015lianshangminchu147-1_t20150516@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"},{\"sortTimeString\":\"2015年03月05日\",\"sortTime\":1425484800000,\"dataType\":\"cpws\",\"body\":\"...上诉人（原审被告）连云港凯达国际物流有限公司...\",\"partyId\":\"c2014lianshangzhong512_t20150305@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"连云港凯达国际物流有限公司、程平等执行异议之诉民事判决书\",\"entryId\":\"c2014lianshangzhong512_t20150305@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"},{\"sortTimeString\":\"2014年12月24日\",\"sortTime\":1419350400000,\"dataType\":\"cpws\",\"body\":\"原告连云港凯达国际物流有限公司，住所地江苏省连...\",\"partyId\":\"canhao2014huhaifashangchu742_t20141224@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\",\"title\":\"原告连云港凯达国际物流有限公司为与被告山西海鑫国际钢铁有限公司、被告上海海博鑫惠国际贸易有限公司海上货运代理合同纠纷一案\",\"entryId\":\"canhao2014huhaifashangchu742_t20141224@cG5hbWU66L%2Be5LqR5riv5Yev6L6%2B5Zu96ZmF54mp5rWB5pyJ6ZmQ5YWs5Y%2B4\"}],\"cpwsPageNum\":2,\"pageNo\":1,\"cpwsCount\":20,\"range\":10,\"totalCount\":20,\"totalPageNum\":2},\"version\":\"1.0\",\"request_sn\":\"a46535b73b9346d18a83a204a8d10d6e\",\"retmsg\":\"交易成功\",\"retdate\":1571743187199,\"retcode\":\"000000\"}";    	
	        	rtnMap = JSON.parseObject(response); 
	        }else if(mode.equals("2")) {
	        	
	        	response = HttpUtils.HttpSend(base64String,SERVER_URL,gladAES,ACCOUNT_ID);
	        	rtnMap = JSON.parseObject(response); 
	        	String retcode = rtnMap.get("retcode")==null?"":rtnMap.get("retcode").toString();			
				String request_sn = rtnMap.get("request_sn")==null?"":rtnMap.get("request_sn").toString();
				String response_sn = rtnMap.get("response_sn")==null?"":rtnMap.get("response_sn").toString();
				
				TZhengxinHis yzh  = new TZhengxinHis();
				yzh.setId(req_sn1);
				yzh.setRequest_sn(request_sn);
				yzh.setResponse_sn(response_sn);
				yzh.setCreate_time(new Date());
				yzh.setRtn_code(retcode);
				yzh.setJson_txt(rtnMap.toString());
				yzh.setFun_code("sh006");
				
				tzhMapper.save(yzh);
	        	
	        }else {
	        	
	        }
	       
			
			 
			System.out.println("调用企业法院信息查询产品返回结果值map:\n"+rtnMap);
			
			
			
			
			
		} catch (Exception e) {


			rtnMap = new HashMap();
			rtnMap.put("retcode", "-999999");
			rtnMap.put("retmsg", "-999999");
			
		}
		
		return rtnMap;
	}
	
	
	
	
	

}
