package com.fd.fhtmid.mapper;


import java.util.List;
import java.util.Map;

import com.gitee.fastmybatis.core.mapper.CrudMapper;


public interface ChartMapper extends CrudMapper<Object, String> {
	
	List<Map> invoiceChart(Map map);
	
	List<Map> highInvoiceChart(Map map);
	
	Map overallBusinessRisk(Map map);
	
	List<Map> overallBusinessRisk_shichang(Map map);
	
	List<Map> fengxianfapiaotongji(Map map);
	
	List<Map> fengkongzhibiaoqushitu(Map map);
	
	Map gongyingshangfenxiantongji(Map map);
	
	Map	neibufengkongfengxiantongji(Map map);
	
	Map shuiwuheguifengxiantongji(Map map);

	// 消息提醒中心
	Map xiaoxitixinzhongxin1(Map map);
	Map xiaoxitixinzhongxin2(Map map);
	Map xiaoxitixinzhongxin3(Map map);
	Map xiaoxitixinzhongxin4(Map map);
	Map xiaoxitixinzhongxin5(Map map);

	Integer insertMessage(Map map);

	List xiaoxitixingzhongxinAll(Map map);

	Map xiaoxitixingzhongxinContent(Map map);

	Integer updateMessage(Map map);

	Map getUserCompanyName(Map map);

	Map getInvoice(Map map);

}
