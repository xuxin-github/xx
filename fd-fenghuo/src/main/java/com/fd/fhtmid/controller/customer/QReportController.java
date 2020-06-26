package com.fd.fhtmid.controller.customer;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.controller.platform.PersonnelController;
import com.fd.fhtmid.domain.BRiskControlSet;
import com.fd.fhtmid.mapper.BInvoiceInfoMapper;
import com.fd.fhtmid.mapper.BRiskControlSetMapper;
import com.fd.fhtmid.mapper.BUserInfoMapper;
import com.fd.fhtmid.mapper.ChartMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

/**
 * @author 徐鑫.
 * description 报表controller.
 */

@RestController
@RequestMapping(value = "/c/report")
public class QReportController extends BaseController {

    @Autowired
    private BInvoiceInfoMapper invoiceInfoMapper;
    
    @Autowired
    private BRiskControlSetMapper riskControlSetMapper;

    @Autowired
    ChartMapper chartMapper;

    @Autowired
    BUserInfoMapper userInfoMapper;
    
    private String [] strMonths = {"01","02","03","04","05","06","07","08","09","10","11","12"};
    
    private String [] strInvoices = {"01","02","03","04","05","06","07"};
    
    
    /**
     * 控制中心.
     * @param map 页面参数.
     * @return 响应数据.
     */
    @RequestMapping(value = "/enterInvoiceCount", method = RequestMethod.POST)
    public ApiResult enterInvoiceCount(@RequestBody Map map) {
        // 获取控制中心的所有内容.
        Map control_center = new HashMap();

        // 进项票据统计.
        // 统计本月新增发票数量、当年累计新增的发票数量.
        // 需要传入当前登录账号的公司名称, 作为购方名称查询所有票据.
        // 然后按照时间查询.
        Map addInvoice = invoiceInfoMapper.findAddInvoiceCount(map) == null ? new HashMap() : invoiceInfoMapper.findAddInvoiceCount(map);
        control_center.put("addInvoice", addInvoice);
        System.out.println("sss"+addInvoice);
        return new ApiResult(0, "成功", control_center);
    }
    
    
    /**
     * 控制中心.高风险发票来源列表.
     * @param map 
     * @return 响应数据.
     */
    @RequestMapping(value = "/highRiskInvoiceList", method = RequestMethod.POST)
    public ApiResult highRiskInvoiceList(@RequestBody Map map) {
        // 获取控制中心的所有内容.
        Map control_center = new HashMap();

        // 已处理风险票据统计.


        // 高风险发票来源.
        // 需要传入当前登录账号的公司名称, 作为购方名称查询所有票据.
        // 按照供应商进行分组, 得到该供应商下的发票总量.
        // 在上面的条件下, 添加6大类的条件, 得到该供应商下的高风险发票.
        List highRiskInvoice = invoiceInfoMapper.findHighRiskInvoice(map);
        
        
        control_center.put("highRiskInvoice", highRiskInvoice);
        return new ApiResult(0, "成功", control_center);
    }
    
    
    /**
     * 控制中心已处理风险票据统计.
     * @param map 
     * @return 响应数据.
     */
    @RequestMapping(value = "/invoiceHandleCount", method = RequestMethod.POST)
    public ApiResult invoiceFinishCount(@RequestBody Map map) {
        // 获取控制中心的所有内容.
        Map control_center = new HashMap();
        
        //获取公司的
        BRiskControlSet bs = riskControlSetMapper.getById("1");
        Map bsmap = new HashMap();
        bsmap.put("p1", bs.getP1());
        bsmap.put("p2_1", bs.getP2_1());
        bsmap.put("p2_2", bs.getP2_2());
        bsmap.put("p2_3", bs.getP2_3());
        bsmap.put("p2_4", bs.getP2_4());  

        List<Map> invoiceFinishCount =  invoiceInfoMapper.invoiceFinishCount(bsmap);
        control_center.put("invoiceFinishCount", invoiceFinishCount);
        
        List<Map> invoiceUnFinishCount =  invoiceInfoMapper.invoiceUnFinishCount(bsmap);
        control_center.put("invoiceUnFinishCount", invoiceUnFinishCount);
        
        return new ApiResult(0, "成功", control_center);
    }
    
    
    @RequestMapping(value = "/highInvoiceChart", method = RequestMethod.POST)
    public ApiResult highInvoiceChart(@RequestBody Map map) {
        // 获取控制中心的所有内容.
        Map control_center = new HashMap();
        
        BRiskControlSet bs = riskControlSetMapper.getById("1");
        Map bsmap = new HashMap();
        bsmap.put("p1", bs.getP1());
        bsmap.put("p2_1", bs.getP2_1());
        bsmap.put("p2_2", bs.getP2_2());
        bsmap.put("p2_3", bs.getP2_3());
        bsmap.put("p2_4", bs.getP2_4());  
        bsmap.put("invoice_catalog_not", "07");
        
        List<Map> rs =chartMapper.invoiceChart(map);
        
        List<Map> rs_high =chartMapper.highInvoiceChart(bsmap);
        
        String year = String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
        
        System.out.println(rs);
        System.out.println(rs_high);
        
        List<Map> resultList= new ArrayList<Map>();
        for (int i = 0; i < strMonths.length; i++) {
			Map m = new HashMap();
        	String ym = strMonths[i];
        	
        	m.put("month",ym);
        	m.put("num",0);
        	m.put("num2",0);
        	resultList.add(m);
		}
        
        for (Map map2 : rs) {
			String str = map2.get("c_time").toString();
			Map mp =  resultList.get(Integer.valueOf(str)-1);
			mp.put("num", map2.get("num"));
			resultList.set(Integer.valueOf(str)-1, mp);
		}
        
        
        for (Map map2 : rs_high) {
			String str = map2.get("c_time").toString();
			Map mp =  resultList.get(Integer.valueOf(str)-1);
			mp.put("num2", map2.get("num"));
			resultList.set(Integer.valueOf(str)-1, mp);
		}
        
        control_center.put("rs", resultList);
        
        return new ApiResult(0, "成功", control_center);
    }
    
    
    @RequestMapping(value = "/highCatInvoiceChart", method = RequestMethod.POST)
    public ApiResult highCatInvoiceChart(@RequestBody Map map) {
        // 获取控制中心的所有内容.
    	String catalog = map.get("catalog").toString();
        Map control_center = new HashMap();
        
        BRiskControlSet bs = riskControlSetMapper.getById("1");
        Map bsmap = new HashMap();
        bsmap.put("p1", bs.getP1());
        bsmap.put("p2_1", bs.getP2_1());
        bsmap.put("p2_2", bs.getP2_2());
        bsmap.put("p2_3", bs.getP2_3());
        bsmap.put("p2_4", bs.getP2_4());  
        bsmap.put("invoice_catalog_eq", catalog);
        
        List<Map> rs =chartMapper.invoiceChart(bsmap);
        
        List<Map> rs_high =chartMapper.highInvoiceChart(bsmap);
        
        String year = String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
        
        System.out.println(rs);
        System.out.println(rs_high);
        
        List<Map> resultList= new ArrayList<Map>();
        for (int i = 0; i < strMonths.length; i++) {
			Map m = new HashMap();
        	String ym = strMonths[i];
        	
        	m.put("month",ym);
        	m.put("num",0);
        	m.put("num2",0);
        	resultList.add(m);
		}
        
        for (Map map2 : rs) {
			String str = map2.get("c_time").toString();
			Map mp =  resultList.get(Integer.valueOf(str)-1);
			mp.put("num", map2.get("num"));
			resultList.set(Integer.valueOf(str)-1, mp);
		}
        
        
        for (Map map2 : rs_high) {
			String str = map2.get("c_time").toString();
			Map mp =  resultList.get(Integer.valueOf(str)-1);
			mp.put("num2", map2.get("num"));
			resultList.set(Integer.valueOf(str)-1, mp);
		}
        
        control_center.put("rs", resultList);
        
        return new ApiResult(0, "成功", control_center);
    }
    
    
    
    /**总体经营风险
     * @param map 年月 ym 20190102
     * @return
     */
    @RequestMapping(value = "/overallBusinessRisk", method = RequestMethod.POST)
    public ApiResult overallBusinessRisk(@RequestBody Map map) {
        
    	String ym = map.get("ym").toString();
    	
        Map control_center = new HashMap();
        
        BRiskControlSet bs = riskControlSetMapper.getById("1");
        
        BigDecimal BP2_1 = new BigDecimal(25d);
        
        BigDecimal BP2_2 = bs.getP3_2_1().add(bs.getP3_2_2()).add(bs.getP3_2_3()).add(bs.getP3_2_4()).add(bs.getP3_2_5()).add(bs.getP3_2_6());
        
        BigDecimal BP2_3 = bs.getP3_3_1().add(bs.getP3_3_2()).add(bs.getP3_3_3()).add(bs.getP3_3_4()).add(bs.getP3_3_5())
        		.add(bs.getP3_3_6()).add(bs.getP3_3_7()).add(bs.getP3_3_8()).add(bs.getP3_3_9()).add(bs.getP3_3_10())
        		.add(bs.getP3_3_11()).add(bs.getP3_3_12()).add(bs.getP3_3_13()).add(bs.getP3_3_14()).add(bs.getP3_3_15())
        		.add(bs.getP3_3_16()).add(bs.getP3_3_17()).add(bs.getP3_3_18()).add(bs.getP3_3_19()).add(bs.getP3_3_20())
        		.add(bs.getP3_3_21());
        
        BigDecimal BP2_4 = bs.getP3_4_1().add(bs.getP3_4_2()).add(bs.getP3_4_3()).add(bs.getP3_4_4()).add(bs.getP3_4_5())
        		.add(bs.getP3_4_6());
        
        Map bsmap = new HashMap();
        bsmap.put("ym", ym);  
        
        BigDecimal fP2_1 = new BigDecimal(0d);
        BigDecimal fP2_2 = new BigDecimal(0d);
        BigDecimal fP2_3 = new BigDecimal(0d);
        BigDecimal fP2_4 = new BigDecimal(0d);
        
        Map mp =chartMapper.overallBusinessRisk(bsmap);
        if(mp!=null) {
        	fP2_1 = (BigDecimal)mp.get("p2_1");
        	fP2_2 = (BigDecimal)mp.get("p2_2");
        	fP2_3 = (BigDecimal)mp.get("p2_3");
        	fP2_4 = (BigDecimal)mp.get("p2_4");
        }
        
        List<Map> rtnRs = new ArrayList<Map>();
        Map hm = new HashMap();
        hm.put("type", "");
        hm.put("name", "");
        hm.put("value", BP2_1.add(BP2_2).add(BP2_3).add(BP2_4).subtract(fP2_1.add(fP2_2).add(fP2_3).add(fP2_4)));
        
        Map hm1 = new HashMap();
        hm1.put("type", "综合评分");
        hm1.put("name", "税务合规风险");
        hm1.put("value", fP2_1);
        
        Map hm2 = new HashMap();
        hm2.put("type", "综合评分");
        hm2.put("name", "市场监管风险");
        hm2.put("value", fP2_2);
        
        Map hm3 = new HashMap();
        hm3.put("type", "综合评分");
        hm3.put("name", "内部风控风险");
        hm3.put("value", fP2_3);
        
        Map hm4 = new HashMap();
        hm4.put("type", "综合评分");
        hm4.put("name", "供应商风险");
        hm4.put("value", fP2_4);
        
        rtnRs.add(hm);
        rtnRs.add(hm1);
        rtnRs.add(hm2);
        rtnRs.add(hm3);
        rtnRs.add(hm4);
        
//        List<Map> overallBusinessRisk_shichang_rs =  chartMapper.overallBusinessRisk_shichang(bsmap);
               
        control_center.put("overallBusinessRisk", rtnRs);
//        control_center.put("overallBusinessRisk_shichang", overallBusinessRisk_shichang_rs);
        
        return new ApiResult(0, "成功", control_center);
    }
    
    
    /**市场监管风险
     * @param map 年月 ym 20190102
     * @return
     */
    @RequestMapping(value = "/shichangjianguanRisk", method = RequestMethod.POST)
    public ApiResult shichangjianguanRisk(@RequestBody Map map) {
    	
    	String ym = map.get("ym").toString();
    	
        Map control_center = new HashMap();
        
        Map bsmap = new HashMap();
        bsmap.put("ym", ym);  
        
        List<Map> overallBusinessRisk_shichang_rs =  chartMapper.overallBusinessRisk_shichang(bsmap);
        
        List<Map> resultList= new ArrayList<Map>();
        for (int i = 0; i < strInvoices.length; i++) {
			Map m = new HashMap();
        	String sym = strMonths[i];
        	
        	m.put("month",sym);
        	m.put("num",0);
        	resultList.add(m);
		}
        
        for (Map map2 : overallBusinessRisk_shichang_rs) {
			String str = map2.get("invoice_catalog").toString();
			Map mp =  resultList.get(Integer.valueOf(str)-1);
			mp.put("num", map2.get("num"));
			resultList.set(Integer.valueOf(str)-1, mp);
		}
        
        control_center.put("overallBusinessRisk", resultList);
    	
    	return new ApiResult(0, "成功", control_center);
    
    }
    
    
    /**风险发票金额统计
     * @param map
     * @return
     */
    @RequestMapping(value = "/fengxianfapiaotongji", method = RequestMethod.POST)
    public ApiResult fengxianfapiaotongji(@RequestBody Map map) {
    	
    	String ym = map.get("ym").toString();
    	
        Map control_center = new HashMap();
        
        Map bsmap = new HashMap();
        bsmap.put("ym", ym);  
        
        List<Map> fengxianfapiaotongji =  chartMapper.fengxianfapiaotongji(bsmap);
        Map rmap = new HashMap();
        for (Map fmap : fengxianfapiaotongji) {
        	rmap.put(fmap.get("r"), (long)fmap.get("num"));
		}
        
        List rtnRs = new ArrayList();
        
        Map hm = new HashMap();
        hm.put("type", "");
        hm.put("name", "");      
        hm.put("value", rmap.containsKey("l10")?(long)rmap.get("l10"):0);
        
        Map hm1 = new HashMap();
        hm1.put("type", "10万以上");
        hm1.put("name", "10-30万元");
        hm1.put("value", rmap.containsKey("l30")?(long)rmap.get("l30"):0);
        
        Map hm2 = new HashMap();
        hm2.put("type", "10万以上");
        hm2.put("name", "30-50万元");
        hm2.put("value", rmap.containsKey("l50")?(long)rmap.get("l50"):0);
            
        Map hm3 = new HashMap();
        hm3.put("type", "10万以上");
        hm3.put("name", "50万元以上");
        hm3.put("value", rmap.containsKey("g50")?(long)rmap.get("g50"):0);
        
        rtnRs.add(hm);
        rtnRs.add(hm1);
        rtnRs.add(hm2);
        rtnRs.add(hm3);
        
        control_center.put("fengxianfapiaotongji", rtnRs);
    	
    	return new ApiResult(0, "成功", control_center);
    
    }
    
    /**3.7.1.6 风控指标趋势图
     * @param map ym 2017 或者 201711
     * @return
     */
    @RequestMapping(value = "/fengkongzhibiaoqushitu", method = RequestMethod.POST)
	public ApiResult fengkongzhibiaoqushitu(@RequestBody Map map) {

		String ym = map.get("ym").toString();
		Map control_center = new HashMap();

		List<Map> resultList = new ArrayList<Map>();
		for (int i = 0; i < strMonths.length; i++) {
			Map m = new HashMap();
			String yms = strMonths[i];

			m.put("month", yms);
			m.put("p_total", 0);
			m.put("p2_1", 0);
			m.put("p2_2", 0);
			m.put("p2_3", 0);
			m.put("p2_4", 0);
			resultList.add(m);
		}

		List<Map> rs = chartMapper.fengkongzhibiaoqushitu(map);
		System.out.println(rs);
		for (Map map2 : rs) {
			String str = map2.get("c_time").toString();
			Map mp = resultList.get(Integer.valueOf(str) - 1);
			mp.put("p_total", map2.get("p_total"));
			mp.put("p2_1", map2.get("p2_1"));
			mp.put("p2_2", map2.get("p2_2"));
			mp.put("p2_3", map2.get("p2_3"));
			mp.put("p2_4", map2.get("p2_4"));

			resultList.set(Integer.valueOf(str) - 1, mp);
		}
		if(ym.length()==4) {
			control_center.put("fengkongzhibiaoqushitu", resultList);
		}else {
			control_center.put("fengkongzhibiaoqushitu", rs);
		}
		

		return new ApiResult(0, "成功", control_center);

	}
    
    
    /**供应商风险统计
     * @param map
     * @return
     */
    @RequestMapping(value = "/gongyingshangfenxiantongji", method = RequestMethod.POST)
	public ApiResult gongyingshangfenxiantongji(@RequestBody Map map) {

		String ym = map.get("ym").toString();
		Map control_center = new HashMap();

		
		Map rs = chartMapper.gongyingshangfenxiantongji(map);
		
		control_center.put("gongyingshangfenxiantongji", rs);

		return new ApiResult(0, "成功", control_center);

	}
    
    /**内部风控风险统计
     * @param map
     * @return
     */
    @RequestMapping(value = "/neibufengkongfengxiantongji", method = RequestMethod.POST)
	public ApiResult neibufengkongfengxiantongji(@RequestBody Map map) {

		String ym = map.get("ym").toString();
		Map control_center = new HashMap();
	
		Map rs = chartMapper.neibufengkongfengxiantongji(map);
		
		control_center.put("neibufengkongfengxiantongji", rs);

		return new ApiResult(0, "成功", control_center);

	}
    
    /**点击税务合规风险：列出参与虚开、违法受让、取得异常的合同数量
     * @param map
     * @return
     */
    @RequestMapping(value = "/shuiwuheguifengxiantongji", method = RequestMethod.POST)
	public ApiResult shuiwuheguifengxiantongji(@RequestBody Map map) {

		String ym = map.get("ym").toString();
		Map control_center = new HashMap();
	
		Map rs = chartMapper.shuiwuheguifengxiantongji(map);
		
		control_center.put("shuiwuheguifengxiantongji", rs);

		return new ApiResult(0, "成功", control_center);

	}

    /**或得用户的公司名称
     * @param map
     * @return
     */
    @RequestMapping(value = "/getUserCompanyName", method = RequestMethod.POST)
    public ApiResult getUserCompanyName(@RequestBody Map map) {
        Map map1 = new HashMap();
        map1.put("username",map.get("username"));
        Map rs = chartMapper.getUserCompanyName(map1);
        return new ApiResult(0, "成功", rs);
    }

    /**
     * 获取此人所有的发票数量（废弃），现在改为统计报销数量
     * @param map
     * @return
     */
    @RequestMapping(value = "getInvoice",method = RequestMethod.POST)
    public ApiResult getInvoice(@RequestBody Map map){
        Map map1 = new HashMap();
        map1.put("create_by",map.get("user_id"));
        map1.put("audit_status",map.get("audit_status"));
        Map rs = chartMapper.getInvoice(map1);
        return new ApiResult(0,"成功",rs);
    }

    /**
     * 获取用户的权限
     * @param map
     * @return
     */
    @RequestMapping(value = "getRoleCode",method = RequestMethod.POST)
    public ApiResult getRoleCoded(@RequestBody Map map){

        Map rs = userInfoMapper.getRoleCode(map);
        return new ApiResult(0,"成功",rs);
    }


    
    
}
