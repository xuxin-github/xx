package com.fd.fhtmid.service;

import java.text.ParseException;
import java.util.Map;

public interface SystemService {
    // 税务合规风险.
    Double taxScore(Map map);
    // 市场监管风险
    Double marketScore(Map map);
    // 内部合规风险.
    Double internalScore(Map map);
    // 供应商风险.
    Double providerScore(Map map) throws ParseException;

    // 合同计算明细.
    int computeVersion(Map map);
}
