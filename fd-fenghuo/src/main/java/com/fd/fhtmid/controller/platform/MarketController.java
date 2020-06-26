package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BMarketInfoMapper;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/p/market")
public class MarketController extends BaseController {
    @Autowired
    private BMarketInfoMapper marketMapper;

    /**
     * 查询市场监管违法案例列表.
     * @param map 搜索条件(risk_market_name).
     * @return 列表.
     */
    @RequestMapping(value = "/findMarket", method = RequestMethod.POST)
    public ApiResult findMarket(@RequestBody Map map) {
        // 得到页面传过来的参数, 名称与页面设定一致.
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("risk_market_name", ((Map) map.get("queryParams")).get("risk_market_name"));
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        // 得到数据库内容, 封装后, 返回页面.
        List market = marketMapper.findAllMarket(map1);
        Map<String, Object> tableDataInfo = getDataTable(market);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**
     * 获取指定市场监管违法案例.
     * @param map 处罚文书文号(name).
     * @return 市场监管违法案例.
     */
    @RequestMapping(value = "/getMarketById", method = RequestMethod.GET)
    public ApiResult getMarket(@RequestParam Map map) {
        Map market = marketMapper.findMarketByName(map);
        return new ApiResult(0, "成功", market);
    }

    /**
     * 新增市场监管违法案例.
     * @param map (name, type, party, result, date, type_subsection, specific_type, is_release).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/insertMarket", method = RequestMethod.POST)
    public ApiResult insertMarket(@RequestBody Map map) throws ParseException {
        // 当点击保存时, is_release为02; 点击保存并发布时, is_release为01.
        // 判断新增的数据, 在数据库中是否已存在.
        Map map1 = new HashMap();
        map1.put("market_name", map.get("name"));
        Map market = marketMapper.findMarketByName(map1);
        if (market == null) {
            // 添加id.
            map.put("id", UUIDUtils.getUUID());
            map.put("is_delete", 0);
            String user_id = this.getColonyUserId();
            map.put("create_by", user_id);
            map.put("create_time", new Date());
            // 格式化处罚日期.
            String punishDate = getDate(map.get("date").toString());
            map.put("punishDate", punishDate);
            int result = marketMapper.insertMarket(map);
            if (result == 1) {
                return new ApiResult(0, "新增成功", result);
            } else {
                return new ApiResult(1, "新增失败", result);
            }
        } else {
            return new ApiResult(1, "数据已存在！", "");
        }
    }

    /**
     * 修改市场监管违法案例.
     * @param map 页面参数.
     * @return 响应数据.
     * @throws ParseException 异常.
     */
    @Transactional
    @RequestMapping(value = "/updateMarket", method = RequestMethod.POST)
    public ApiResult updateMarket(@RequestBody Map map) throws ParseException {
        // 当点击保存时, is_release为原值; 点击保存并发布时, is_release为01.
        // 格式化处罚日期.
        String punishDate = getDate(map.get("date").toString());
        map.put("punishDate", punishDate);
        String user_id = this.getColonyUserId();
        map.put("update_by", user_id);
        map.put("update_time", new Date());
        int result = marketMapper.updateMarket(map);
        if (result == 1) {
            return new ApiResult(0, "更新成功", result);
        } else {
            return new ApiResult(1, "更新失败", result);
        }
    }

    /**
     * 修改发布状态.
     * @param map (market_name, is_release).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/updateStatus", method = RequestMethod.POST)
    public ApiResult updateStatus(@RequestBody Map map){
        String user_id = this.getColonyUserId();
        map.put("update_by", user_id);
        map.put("update_time", new Date());
        int result = marketMapper.updateStatus(map);
        if (result == 1) {
            return new ApiResult(0, "更新成功", result);
        } else {
            return new ApiResult(1, "更新失败", result);
        }
    }

    /**
     * 查询发布的市场监管违法案例列表.
     * @param map 搜索条件(risk_market_name).
     * @return 列表.
     */
    @RequestMapping(value = "/findReleaseMarket", method = RequestMethod.POST)
    public ApiResult findReleaseMarket(@RequestBody Map map) {
        // 得到页面传过来的参数, 名称与页面设定一致.
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("risk_market_name", ((Map) map.get("queryParams")).get("risk_market_name"));
        // 分页.
        startPage((int) map.get("page"), (int) map.get("pageSize"));
        // 得到数据库内容, 封装后, 返回页面.
        List market = marketMapper.findAllReleaseMarket(map1);
        Map<String, Object> tableDataInfo = getDataTable(market);
        return new ApiResult(0, "成功", tableDataInfo);
    }

    /**
     * 格式化时间.
     * @param time 时间.
     * @return 时间.
     * @throws ParseException 异常.
     */
    public String getDate(String time) throws ParseException {
        if (time != null) {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            Date date1 = formatter.parse(time);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String date = sdf.format(date1);
            return date;
        }
        return "";
    }
}
