package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.controller.BaseController;
import com.fd.fhtmid.mapper.BIndustryEvaluationInfoMapper;
import com.fd.fhtmid.utils.UUIDUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/p/industryEvaluation")
public class IndustryEvaluationController extends BaseController {
    @Autowired
    private BIndustryEvaluationInfoMapper industryEvaluationInfoMapper;

    /**
     * 查询对应的行业评估内容.
     * @return 响应数据.
     */
    @RequestMapping(value = "/findContent", method = RequestMethod.POST)
    public ApiResult findContent(){
        String company_id = this.getColonCompanyId();
        Map map = new HashMap();
        map.put("company_id", company_id);
        Map industryEvaluation = industryEvaluationInfoMapper.findContent(map);
        return new ApiResult(0, "", industryEvaluation);
    }

    /**
     * 保存内容.
     * @param map (content).
     * @return 响应数据.
     */
    @Transactional
    @RequestMapping(value = "/saveContent", method = RequestMethod.POST)
    public ApiResult saveContent(@RequestBody Map map){
        // 保存时, 先判断是否存在该公司的行业评估内容.
        // 若有, 则修改; 若无, 则新增.
        String company_id = this.getColonCompanyId();
        String user_id = this.getColonyUserId();
        map.put("company_id", company_id);
        Map industryEvaluation = industryEvaluationInfoMapper.findContent(map);
        if(industryEvaluation == null){
            map.put("id", UUIDUtils.getUUID());
            map.put("create_by", user_id);
            map.put("create_time", new Date());
            int result = industryEvaluationInfoMapper.insertContent(map);
            if(result == 1){
                return new ApiResult(0, "新增成功", result);
            }else{
                return new ApiResult(1, "新增失败", result);
            }
        }else{
            // 查询content有无更改.
            String oldContent = industryEvaluation.get("content").toString();
            if (oldContent.equals(map.get("content"))) {
                return new ApiResult(0, "", "");
            } else {
                map.put("update_by", user_id);
                map.put("update_time", new Date());
                int result = industryEvaluationInfoMapper.updateContent(map);
                if(result == 1){
                    return new ApiResult(0, "更新成功", result);
                }else{
                    return new ApiResult(1, "更新失败", result);
                }
            }
        }
    }
}