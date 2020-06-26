package com.fd.fhtmid.controller.platform;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.mapper.BContractInfoMapper;
import com.fd.fhtmid.mapper.BInvoiceInfoMapper;
import com.fd.fhtmid.mapper.BProjectInfoMapper;
import com.fd.fhtmid.mapper.BProviderInfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/p/risk")
public class RiskController {
    @Autowired
    private BContractInfoMapper contractInfoMapper;

    @Autowired
    private BInvoiceInfoMapper invoiceInfoMapper;

    @Autowired
    private BProviderInfoMapper providerInfoMapper;

    @Autowired
    private BProjectInfoMapper projectInfoMapper;

    /**
     * 风控中心查询所有合同.
     * @return 合同列表.
     */
    @RequestMapping(value = "/findAllContract", method = RequestMethod.POST)
    public ApiResult findAllContract() {
        List contract = contractInfoMapper.findAllContract();
        return new ApiResult(0, "成功", contract);
    }

    /**
     * 风控中心查询所有票据.
     * @return 票据列表.
     */
    @RequestMapping(value = "/findAllInvoice", method = RequestMethod.POST)
    public ApiResult findAllInvoice(){
        List invoice = invoiceInfoMapper.findAllInvoice();
        return new ApiResult(0, "成功", invoice);
    }

    /**
     * 风控中心查询所有供应商.
     * @return 供应商列表.
     */
    @RequestMapping(value = "/findAllProvider", method = RequestMethod.POST)
    public ApiResult findAllProvider(){
        List provider = providerInfoMapper.findAllProvider();
        return new ApiResult(0, "成功", provider);
    }

    /**
     * 风控中心查询所有项目.
     * @return 项目列表.
     */
    @RequestMapping(value = "/findAllProject", method = RequestMethod.POST)
    public ApiResult findAllProject(){
        List project = projectInfoMapper.findAllProject();
        return new ApiResult(0, "成功", project);
    }
}