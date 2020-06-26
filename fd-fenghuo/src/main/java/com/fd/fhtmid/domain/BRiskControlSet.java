package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.math.BigDecimal;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_risk_control_set
 * 备注：风控设置
 *
 * @author ${param.author}
 */
@Table(name = "b_risk_control_set")
@SuppressWarnings("serial")
public class BRiskControlSet {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 公司编码, 数据库字段：company_no */
    private String company_no;

    /** 整体预警分值, 数据库字段：p1 */
    private BigDecimal p1;

    /** 税务合规风险, 数据库字段：p2_1 */
    private BigDecimal p2_1;

    /** 市场监管风险, 数据库字段：p2_2 */
    private BigDecimal p2_2;

    /** 内部风控风险, 数据库字段：p2_3 */
    private BigDecimal p2_3;

    /** 供应商评分, 数据库字段：p2_4 */
    private BigDecimal p2_4;

    /** 列支凭证存疑问, 数据库字段：p3_1_1 */
    private BigDecimal p3_1_1;

    /** 交易流水不一致, 数据库字段：p3_1_2 */
    private BigDecimal p3_1_2;

    /** 经营活动不真实, 数据库字段：p3_1_3 */
    private BigDecimal p3_1_3;

    /** 关联交易不独立, 数据库字段：p3_1_4 */
    private BigDecimal p3_1_4;

    /** 项目列支违规, 数据库字段：p3_1_5 */
    private BigDecimal p3_1_5;

    /** 管理发票类, 数据库字段：p3_2_1 */
    private BigDecimal p3_2_1;

    /** 咨询发票类, 数据库字段：p3_2_2 */
    private BigDecimal p3_2_2;

    /** 会议发票类, 数据库字段：p3_2_3 */
    private BigDecimal p3_2_3;

    /** 培训发票类, 数据库字段：p3_2_4 */
    private BigDecimal p3_2_4;

    /** 容旅游费用类, 数据库字段：p3_2_5 */
    private BigDecimal p3_2_5;

    /** 手续费类, 数据库字段：p3_2_6 */
    private BigDecimal p3_2_6;

    /** 软件开发发票类, 数据库字段：p3_2_7 */
    private BigDecimal p3_2_7;

    /** 合同文件未上传, 数据库字段：p3_3_1 */
    private BigDecimal p3_3_1;

    /** 对方企业名称未填写, 数据库字段：p3_3_2 */
    private BigDecimal p3_3_2;

    /** 合同标的未填写, 数据库字段：p3_3_3 */
    private BigDecimal p3_3_3;

    /** 合同金额未填写, 数据库字段：p3_3_4 */
    private BigDecimal p3_3_4;

    /** 签约时间未填写, 数据库字段：p3_3_5 */
    private BigDecimal p3_3_5;

    /** 争议解决方式未填写, 数据库字段：p3_3_6 */
    private BigDecimal p3_3_6;

    /** 业务主办人未填写, 数据库字段：p3_3_7 */
    private BigDecimal p3_3_7;

    /** 业务主管未填写, 数据库字段：p3_3_8 */
    private BigDecimal p3_3_8;

    /** 财务核审人未填写, 数据库字段：p3_3_9 */
    private BigDecimal p3_3_9;

    /** 业务审核人未填写, 数据库字段：p3_3_10 */
    private BigDecimal p3_3_10;

    /** 业务发起无邮件、短信或其他信息, 数据库字段：p3_3_11 */
    private BigDecimal p3_3_11;

    /** 业务发起无发起文档, 数据库字段：p3_3_12 */
    private BigDecimal p3_3_12;

    /** 业务完成无邮件、短信或其他信息, 数据库字段：p3_3_13 */
    private BigDecimal p3_3_13;

    /** 业务完成无完成文档, 数据库字段：p3_3_14 */
    private BigDecimal p3_3_14;

    /** 真实交易无记账凭证记录, 数据库字段：p3_3_15 */
    private BigDecimal p3_3_15;

    /** 真实交易无银行流水记录, 数据库字段：p3_3_16 */
    private BigDecimal p3_3_16;

    /** 真实交易无交易账册记录, 数据库字段：p3_3_17 */
    private BigDecimal p3_3_17;

    /** 交付信息无完成时间, 数据库字段：p3_3_18 */
    private BigDecimal p3_3_18;

    /** 交付是否顺利未填写, 数据库字段：p3_3_19 */
    private BigDecimal p3_3_19;

    /** 交付争议信息未填写, 数据库字段：p3_3_20 */
    private BigDecimal p3_3_20;

    /** 交付信息无对方联系方式, 数据库字段：p3_3_21 */
    private BigDecimal p3_3_21;

    /** 企业注册少于2年, 数据库字段：p3_4_1 */
    private BigDecimal p3_4_1;

    /** 企业注册资本少于100万, 数据库字段：p3_4_2 */
    private BigDecimal p3_4_2;

    /** 一个法律诉讼, 数据库字段：p3_4_3 */
    private BigDecimal p3_4_3;

    /** 两个及以上法律诉讼, 数据库字段：p3_4_4 */
    private BigDecimal p3_4_4;

    /** 一条税务处罚, 数据库字段：p3_4_5 */
    private BigDecimal p3_4_5;

    /** 两条及以上税务处罚, 数据库字段：p3_4_6 */
    private BigDecimal p3_4_6;

    /** 一处行政处罚, 数据库字段：p3_4_7 */
    private BigDecimal p3_4_7;

    /** 两条及以上行政处罚, 数据库字段：p3_4_8 */
    private BigDecimal p3_4_8;

    /** 一条其他违法记录, 数据库字段：p3_4_9 */
    private BigDecimal p3_4_9;

    /** 两个及以上其他违法记录, 数据库字段：p3_4_10 */
    private BigDecimal p3_4_10;

    /** 创建人, 数据库字段：create_by */
    private String create_by;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 更新人, 数据库字段：update_by */
    private String update_by;

    /** 更新时间, 数据库字段：update_time */
    private Date update_time;

    /** 设置id, 数据库字段：b_risk_control_set.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_risk_control_set.id */
    public String getId() {
        return this.id;
    }

    /** 设置公司编码, 数据库字段：b_risk_control_set.company_no */
    public void setCompany_no(String company_no) {
        this.company_no = company_no;
    }

    /** 获取公司编码, 数据库字段：b_risk_control_set.company_no */
    public String getCompany_no() {
        return this.company_no;
    }

    /** 设置整体预警分值, 数据库字段：b_risk_control_set.p1 */
    public void setP1(BigDecimal p1) {
        this.p1 = p1;
    }

    /** 获取整体预警分值, 数据库字段：b_risk_control_set.p1 */
    public BigDecimal getP1() {
        return this.p1;
    }

    /** 设置税务合规风险, 数据库字段：b_risk_control_set.p2_1 */
    public void setP2_1(BigDecimal p2_1) {
        this.p2_1 = p2_1;
    }

    /** 获取税务合规风险, 数据库字段：b_risk_control_set.p2_1 */
    public BigDecimal getP2_1() {
        return this.p2_1;
    }

    /** 设置市场监管风险, 数据库字段：b_risk_control_set.p2_2 */
    public void setP2_2(BigDecimal p2_2) {
        this.p2_2 = p2_2;
    }

    /** 获取市场监管风险, 数据库字段：b_risk_control_set.p2_2 */
    public BigDecimal getP2_2() {
        return this.p2_2;
    }

    /** 设置内部风控风险, 数据库字段：b_risk_control_set.p2_3 */
    public void setP2_3(BigDecimal p2_3) {
        this.p2_3 = p2_3;
    }

    /** 获取内部风控风险, 数据库字段：b_risk_control_set.p2_3 */
    public BigDecimal getP2_3() {
        return this.p2_3;
    }

    /** 设置供应商评分, 数据库字段：b_risk_control_set.p2_4 */
    public void setP2_4(BigDecimal p2_4) {
        this.p2_4 = p2_4;
    }

    /** 获取供应商评分, 数据库字段：b_risk_control_set.p2_4 */
    public BigDecimal getP2_4() {
        return this.p2_4;
    }

    /** 设置列支凭证存疑问, 数据库字段：b_risk_control_set.p3_1_1 */
    public void setP3_1_1(BigDecimal p3_1_1) {
        this.p3_1_1 = p3_1_1;
    }

    /** 获取列支凭证存疑问, 数据库字段：b_risk_control_set.p3_1_1 */
    public BigDecimal getP3_1_1() {
        return this.p3_1_1;
    }

    /** 设置交易流水不一致, 数据库字段：b_risk_control_set.p3_1_2 */
    public void setP3_1_2(BigDecimal p3_1_2) {
        this.p3_1_2 = p3_1_2;
    }

    /** 获取交易流水不一致, 数据库字段：b_risk_control_set.p3_1_2 */
    public BigDecimal getP3_1_2() {
        return this.p3_1_2;
    }

    /** 设置经营活动不真实, 数据库字段：b_risk_control_set.p3_1_3 */
    public void setP3_1_3(BigDecimal p3_1_3) {
        this.p3_1_3 = p3_1_3;
    }

    /** 获取经营活动不真实, 数据库字段：b_risk_control_set.p3_1_3 */
    public BigDecimal getP3_1_3() {
        return this.p3_1_3;
    }

    /** 设置关联交易不独立, 数据库字段：b_risk_control_set.p3_1_4 */
    public void setP3_1_4(BigDecimal p3_1_4) {
        this.p3_1_4 = p3_1_4;
    }

    /** 获取关联交易不独立, 数据库字段：b_risk_control_set.p3_1_4 */
    public BigDecimal getP3_1_4() {
        return this.p3_1_4;
    }

    /** 设置项目列支违规, 数据库字段：b_risk_control_set.p3_1_5 */
    public void setP3_1_5(BigDecimal p3_1_5) {
        this.p3_1_5 = p3_1_5;
    }

    /** 获取项目列支违规, 数据库字段：b_risk_control_set.p3_1_5 */
    public BigDecimal getP3_1_5() {
        return this.p3_1_5;
    }

    /** 设置管理发票类, 数据库字段：b_risk_control_set.p3_2_1 */
    public void setP3_2_1(BigDecimal p3_2_1) {
        this.p3_2_1 = p3_2_1;
    }

    /** 获取管理发票类, 数据库字段：b_risk_control_set.p3_2_1 */
    public BigDecimal getP3_2_1() {
        return this.p3_2_1;
    }

    /** 设置咨询发票类, 数据库字段：b_risk_control_set.p3_2_2 */
    public void setP3_2_2(BigDecimal p3_2_2) {
        this.p3_2_2 = p3_2_2;
    }

    /** 获取咨询发票类, 数据库字段：b_risk_control_set.p3_2_2 */
    public BigDecimal getP3_2_2() {
        return this.p3_2_2;
    }

    /** 设置会议发票类, 数据库字段：b_risk_control_set.p3_2_3 */
    public void setP3_2_3(BigDecimal p3_2_3) {
        this.p3_2_3 = p3_2_3;
    }

    /** 获取会议发票类, 数据库字段：b_risk_control_set.p3_2_3 */
    public BigDecimal getP3_2_3() {
        return this.p3_2_3;
    }

    /** 设置培训发票类, 数据库字段：b_risk_control_set.p3_2_4 */
    public void setP3_2_4(BigDecimal p3_2_4) {
        this.p3_2_4 = p3_2_4;
    }

    /** 获取培训发票类, 数据库字段：b_risk_control_set.p3_2_4 */
    public BigDecimal getP3_2_4() {
        return this.p3_2_4;
    }

    /** 设置容旅游费用类, 数据库字段：b_risk_control_set.p3_2_5 */
    public void setP3_2_5(BigDecimal p3_2_5) {
        this.p3_2_5 = p3_2_5;
    }

    /** 获取容旅游费用类, 数据库字段：b_risk_control_set.p3_2_5 */
    public BigDecimal getP3_2_5() {
        return this.p3_2_5;
    }

    /** 设置手续费类, 数据库字段：b_risk_control_set.p3_2_6 */
    public void setP3_2_6(BigDecimal p3_2_6) {
        this.p3_2_6 = p3_2_6;
    }

    /** 获取手续费类, 数据库字段：b_risk_control_set.p3_2_6 */
    public BigDecimal getP3_2_6() {
        return this.p3_2_6;
    }

    /** 设置软件开发发票类, 数据库字段：b_risk_control_set.p3_2_7 */
    public void setP3_2_7(BigDecimal p3_2_7) {
        this.p3_2_7 = p3_2_7;
    }

    /** 获取软件开发发票类, 数据库字段：b_risk_control_set.p3_2_7 */
    public BigDecimal getP3_2_7() {
        return this.p3_2_7;
    }

    /** 设置合同文件未上传, 数据库字段：b_risk_control_set.p3_3_1 */
    public void setP3_3_1(BigDecimal p3_3_1) {
        this.p3_3_1 = p3_3_1;
    }

    /** 获取合同文件未上传, 数据库字段：b_risk_control_set.p3_3_1 */
    public BigDecimal getP3_3_1() {
        return this.p3_3_1;
    }

    /** 设置对方企业名称未填写, 数据库字段：b_risk_control_set.p3_3_2 */
    public void setP3_3_2(BigDecimal p3_3_2) {
        this.p3_3_2 = p3_3_2;
    }

    /** 获取对方企业名称未填写, 数据库字段：b_risk_control_set.p3_3_2 */
    public BigDecimal getP3_3_2() {
        return this.p3_3_2;
    }

    /** 设置合同标的未填写, 数据库字段：b_risk_control_set.p3_3_3 */
    public void setP3_3_3(BigDecimal p3_3_3) {
        this.p3_3_3 = p3_3_3;
    }

    /** 获取合同标的未填写, 数据库字段：b_risk_control_set.p3_3_3 */
    public BigDecimal getP3_3_3() {
        return this.p3_3_3;
    }

    /** 设置合同金额未填写, 数据库字段：b_risk_control_set.p3_3_4 */
    public void setP3_3_4(BigDecimal p3_3_4) {
        this.p3_3_4 = p3_3_4;
    }

    /** 获取合同金额未填写, 数据库字段：b_risk_control_set.p3_3_4 */
    public BigDecimal getP3_3_4() {
        return this.p3_3_4;
    }

    /** 设置签约时间未填写, 数据库字段：b_risk_control_set.p3_3_5 */
    public void setP3_3_5(BigDecimal p3_3_5) {
        this.p3_3_5 = p3_3_5;
    }

    /** 获取签约时间未填写, 数据库字段：b_risk_control_set.p3_3_5 */
    public BigDecimal getP3_3_5() {
        return this.p3_3_5;
    }

    /** 设置争议解决方式未填写, 数据库字段：b_risk_control_set.p3_3_6 */
    public void setP3_3_6(BigDecimal p3_3_6) {
        this.p3_3_6 = p3_3_6;
    }

    /** 获取争议解决方式未填写, 数据库字段：b_risk_control_set.p3_3_6 */
    public BigDecimal getP3_3_6() {
        return this.p3_3_6;
    }

    /** 设置业务主办人未填写, 数据库字段：b_risk_control_set.p3_3_7 */
    public void setP3_3_7(BigDecimal p3_3_7) {
        this.p3_3_7 = p3_3_7;
    }

    /** 获取业务主办人未填写, 数据库字段：b_risk_control_set.p3_3_7 */
    public BigDecimal getP3_3_7() {
        return this.p3_3_7;
    }

    /** 设置业务主管未填写, 数据库字段：b_risk_control_set.p3_3_8 */
    public void setP3_3_8(BigDecimal p3_3_8) {
        this.p3_3_8 = p3_3_8;
    }

    /** 获取业务主管未填写, 数据库字段：b_risk_control_set.p3_3_8 */
    public BigDecimal getP3_3_8() {
        return this.p3_3_8;
    }

    /** 设置财务核审人未填写, 数据库字段：b_risk_control_set.p3_3_9 */
    public void setP3_3_9(BigDecimal p3_3_9) {
        this.p3_3_9 = p3_3_9;
    }

    /** 获取财务核审人未填写, 数据库字段：b_risk_control_set.p3_3_9 */
    public BigDecimal getP3_3_9() {
        return this.p3_3_9;
    }

    /** 设置业务审核人未填写, 数据库字段：b_risk_control_set.p3_3_10 */
    public void setP3_3_10(BigDecimal p3_3_10) {
        this.p3_3_10 = p3_3_10;
    }

    /** 获取业务审核人未填写, 数据库字段：b_risk_control_set.p3_3_10 */
    public BigDecimal getP3_3_10() {
        return this.p3_3_10;
    }

    /** 设置业务发起无邮件、短信或其他信息, 数据库字段：b_risk_control_set.p3_3_11 */
    public void setP3_3_11(BigDecimal p3_3_11) {
        this.p3_3_11 = p3_3_11;
    }

    /** 获取业务发起无邮件、短信或其他信息, 数据库字段：b_risk_control_set.p3_3_11 */
    public BigDecimal getP3_3_11() {
        return this.p3_3_11;
    }

    /** 设置业务发起无发起文档, 数据库字段：b_risk_control_set.p3_3_12 */
    public void setP3_3_12(BigDecimal p3_3_12) {
        this.p3_3_12 = p3_3_12;
    }

    /** 获取业务发起无发起文档, 数据库字段：b_risk_control_set.p3_3_12 */
    public BigDecimal getP3_3_12() {
        return this.p3_3_12;
    }

    /** 设置业务完成无邮件、短信或其他信息, 数据库字段：b_risk_control_set.p3_3_13 */
    public void setP3_3_13(BigDecimal p3_3_13) {
        this.p3_3_13 = p3_3_13;
    }

    /** 获取业务完成无邮件、短信或其他信息, 数据库字段：b_risk_control_set.p3_3_13 */
    public BigDecimal getP3_3_13() {
        return this.p3_3_13;
    }

    /** 设置业务完成无完成文档, 数据库字段：b_risk_control_set.p3_3_14 */
    public void setP3_3_14(BigDecimal p3_3_14) {
        this.p3_3_14 = p3_3_14;
    }

    /** 获取业务完成无完成文档, 数据库字段：b_risk_control_set.p3_3_14 */
    public BigDecimal getP3_3_14() {
        return this.p3_3_14;
    }

    /** 设置真实交易无记账凭证记录, 数据库字段：b_risk_control_set.p3_3_15 */
    public void setP3_3_15(BigDecimal p3_3_15) {
        this.p3_3_15 = p3_3_15;
    }

    /** 获取真实交易无记账凭证记录, 数据库字段：b_risk_control_set.p3_3_15 */
    public BigDecimal getP3_3_15() {
        return this.p3_3_15;
    }

    /** 设置真实交易无银行流水记录, 数据库字段：b_risk_control_set.p3_3_16 */
    public void setP3_3_16(BigDecimal p3_3_16) {
        this.p3_3_16 = p3_3_16;
    }

    /** 获取真实交易无银行流水记录, 数据库字段：b_risk_control_set.p3_3_16 */
    public BigDecimal getP3_3_16() {
        return this.p3_3_16;
    }

    /** 设置真实交易无交易账册记录, 数据库字段：b_risk_control_set.p3_3_17 */
    public void setP3_3_17(BigDecimal p3_3_17) {
        this.p3_3_17 = p3_3_17;
    }

    /** 获取真实交易无交易账册记录, 数据库字段：b_risk_control_set.p3_3_17 */
    public BigDecimal getP3_3_17() {
        return this.p3_3_17;
    }

    /** 设置交付信息无完成时间, 数据库字段：b_risk_control_set.p3_3_18 */
    public void setP3_3_18(BigDecimal p3_3_18) {
        this.p3_3_18 = p3_3_18;
    }

    /** 获取交付信息无完成时间, 数据库字段：b_risk_control_set.p3_3_18 */
    public BigDecimal getP3_3_18() {
        return this.p3_3_18;
    }

    /** 设置交付是否顺利未填写, 数据库字段：b_risk_control_set.p3_3_19 */
    public void setP3_3_19(BigDecimal p3_3_19) {
        this.p3_3_19 = p3_3_19;
    }

    /** 获取交付是否顺利未填写, 数据库字段：b_risk_control_set.p3_3_19 */
    public BigDecimal getP3_3_19() {
        return this.p3_3_19;
    }

    /** 设置交付争议信息未填写, 数据库字段：b_risk_control_set.p3_3_20 */
    public void setP3_3_20(BigDecimal p3_3_20) {
        this.p3_3_20 = p3_3_20;
    }

    /** 获取交付争议信息未填写, 数据库字段：b_risk_control_set.p3_3_20 */
    public BigDecimal getP3_3_20() {
        return this.p3_3_20;
    }

    /** 设置交付信息无对方联系方式, 数据库字段：b_risk_control_set.p3_3_21 */
    public void setP3_3_21(BigDecimal p3_3_21) {
        this.p3_3_21 = p3_3_21;
    }

    /** 获取交付信息无对方联系方式, 数据库字段：b_risk_control_set.p3_3_21 */
    public BigDecimal getP3_3_21() {
        return this.p3_3_21;
    }

    /** 设置企业注册少于2年, 数据库字段：b_risk_control_set.p3_4_1 */
    public void setP3_4_1(BigDecimal p3_4_1) {
        this.p3_4_1 = p3_4_1;
    }

    /** 获取企业注册少于2年, 数据库字段：b_risk_control_set.p3_4_1 */
    public BigDecimal getP3_4_1() {
        return this.p3_4_1;
    }

    /** 设置企业注册资本少于100万, 数据库字段：b_risk_control_set.p3_4_2 */
    public void setP3_4_2(BigDecimal p3_4_2) {
        this.p3_4_2 = p3_4_2;
    }

    /** 获取企业注册资本少于100万, 数据库字段：b_risk_control_set.p3_4_2 */
    public BigDecimal getP3_4_2() {
        return this.p3_4_2;
    }

    /** 设置一个法律诉讼, 数据库字段：b_risk_control_set.p3_4_3 */
    public void setP3_4_3(BigDecimal p3_4_3) {
        this.p3_4_3 = p3_4_3;
    }

    /** 获取一个法律诉讼, 数据库字段：b_risk_control_set.p3_4_3 */
    public BigDecimal getP3_4_3() {
        return this.p3_4_3;
    }

    /** 设置两个及以上法律诉讼, 数据库字段：b_risk_control_set.p3_4_4 */
    public void setP3_4_4(BigDecimal p3_4_4) {
        this.p3_4_4 = p3_4_4;
    }

    /** 获取两个及以上法律诉讼, 数据库字段：b_risk_control_set.p3_4_4 */
    public BigDecimal getP3_4_4() {
        return this.p3_4_4;
    }

    /** 设置一条税务处罚, 数据库字段：b_risk_control_set.p3_4_5 */
    public void setP3_4_5(BigDecimal p3_4_5) {
        this.p3_4_5 = p3_4_5;
    }

    /** 获取一条税务处罚, 数据库字段：b_risk_control_set.p3_4_5 */
    public BigDecimal getP3_4_5() {
        return this.p3_4_5;
    }

    /** 设置两条及以上税务处罚, 数据库字段：b_risk_control_set.p3_4_6 */
    public void setP3_4_6(BigDecimal p3_4_6) {
        this.p3_4_6 = p3_4_6;
    }

    /** 获取两条及以上税务处罚, 数据库字段：b_risk_control_set.p3_4_6 */
    public BigDecimal getP3_4_6() {
        return this.p3_4_6;
    }

    /** 设置一处行政处罚, 数据库字段：b_risk_control_set.p3_4_7 */
    public void setP3_4_7(BigDecimal p3_4_7) {
        this.p3_4_7 = p3_4_7;
    }

    /** 获取一处行政处罚, 数据库字段：b_risk_control_set.p3_4_7 */
    public BigDecimal getP3_4_7() {
        return this.p3_4_7;
    }

    /** 设置两条及以上行政处罚, 数据库字段：b_risk_control_set.p3_4_8 */
    public void setP3_4_8(BigDecimal p3_4_8) {
        this.p3_4_8 = p3_4_8;
    }

    /** 获取两条及以上行政处罚, 数据库字段：b_risk_control_set.p3_4_8 */
    public BigDecimal getP3_4_8() {
        return this.p3_4_8;
    }

    /** 设置一条其他违法记录, 数据库字段：b_risk_control_set.p3_4_9 */
    public void setP3_4_9(BigDecimal p3_4_9) {
        this.p3_4_9 = p3_4_9;
    }

    /** 获取一条其他违法记录, 数据库字段：b_risk_control_set.p3_4_9 */
    public BigDecimal getP3_4_9() {
        return this.p3_4_9;
    }

    /** 设置两个及以上其他违法记录, 数据库字段：b_risk_control_set.p3_4_10 */
    public void setP3_4_10(BigDecimal p3_4_10) {
        this.p3_4_10 = p3_4_10;
    }

    /** 获取两个及以上其他违法记录, 数据库字段：b_risk_control_set.p3_4_10 */
    public BigDecimal getP3_4_10() {
        return this.p3_4_10;
    }

    /** 设置创建人, 数据库字段：b_risk_control_set.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_risk_control_set.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_risk_control_set.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_risk_control_set.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_risk_control_set.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_risk_control_set.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_risk_control_set.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_risk_control_set.update_time */
    public Date getUpdate_time() {
        return this.update_time;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = (prime * result) + ((id == null) ? 0 : id.hashCode());

        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (obj == null) {
            return false;
        }

        if (getClass() != obj.getClass()) {
            return false;
        }

        BRiskControlSet other = (BRiskControlSet) obj;

        if (id == null) {
            if (other.id != null) {
                return false;
            }
        } else if (!id.equals(other.id)) {
            return false;
        }

        return true;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("BRiskControlSet [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("company_no=").append(company_no);
        sb.append(", ");
        sb.append("p1=").append(p1);
        sb.append(", ");
        sb.append("p2_1=").append(p2_1);
        sb.append(", ");
        sb.append("p2_2=").append(p2_2);
        sb.append(", ");
        sb.append("p2_3=").append(p2_3);
        sb.append(", ");
        sb.append("p2_4=").append(p2_4);
        sb.append(", ");
        sb.append("p3_1_1=").append(p3_1_1);
        sb.append(", ");
        sb.append("p3_1_2=").append(p3_1_2);
        sb.append(", ");
        sb.append("p3_1_3=").append(p3_1_3);
        sb.append(", ");
        sb.append("p3_1_4=").append(p3_1_4);
        sb.append(", ");
        sb.append("p3_1_5=").append(p3_1_5);
        sb.append(", ");
        sb.append("p3_2_1=").append(p3_2_1);
        sb.append(", ");
        sb.append("p3_2_2=").append(p3_2_2);
        sb.append(", ");
        sb.append("p3_2_3=").append(p3_2_3);
        sb.append(", ");
        sb.append("p3_2_4=").append(p3_2_4);
        sb.append(", ");
        sb.append("p3_2_5=").append(p3_2_5);
        sb.append(", ");
        sb.append("p3_2_6=").append(p3_2_6);
        sb.append(", ");
        sb.append("p3_2_7=").append(p3_2_7);
        sb.append(", ");
        sb.append("p3_3_1=").append(p3_3_1);
        sb.append(", ");
        sb.append("p3_3_2=").append(p3_3_2);
        sb.append(", ");
        sb.append("p3_3_3=").append(p3_3_3);
        sb.append(", ");
        sb.append("p3_3_4=").append(p3_3_4);
        sb.append(", ");
        sb.append("p3_3_5=").append(p3_3_5);
        sb.append(", ");
        sb.append("p3_3_6=").append(p3_3_6);
        sb.append(", ");
        sb.append("p3_3_7=").append(p3_3_7);
        sb.append(", ");
        sb.append("p3_3_8=").append(p3_3_8);
        sb.append(", ");
        sb.append("p3_3_9=").append(p3_3_9);
        sb.append(", ");
        sb.append("p3_3_10=").append(p3_3_10);
        sb.append(", ");
        sb.append("p3_3_11=").append(p3_3_11);
        sb.append(", ");
        sb.append("p3_3_12=").append(p3_3_12);
        sb.append(", ");
        sb.append("p3_3_13=").append(p3_3_13);
        sb.append(", ");
        sb.append("p3_3_14=").append(p3_3_14);
        sb.append(", ");
        sb.append("p3_3_15=").append(p3_3_15);
        sb.append(", ");
        sb.append("p3_3_16=").append(p3_3_16);
        sb.append(", ");
        sb.append("p3_3_17=").append(p3_3_17);
        sb.append(", ");
        sb.append("p3_3_18=").append(p3_3_18);
        sb.append(", ");
        sb.append("p3_3_19=").append(p3_3_19);
        sb.append(", ");
        sb.append("p3_3_20=").append(p3_3_20);
        sb.append(", ");
        sb.append("p3_3_21=").append(p3_3_21);
        sb.append(", ");
        sb.append("p3_4_1=").append(p3_4_1);
        sb.append(", ");
        sb.append("p3_4_2=").append(p3_4_2);
        sb.append(", ");
        sb.append("p3_4_3=").append(p3_4_3);
        sb.append(", ");
        sb.append("p3_4_4=").append(p3_4_4);
        sb.append(", ");
        sb.append("p3_4_5=").append(p3_4_5);
        sb.append(", ");
        sb.append("p3_4_6=").append(p3_4_6);
        sb.append(", ");
        sb.append("p3_4_7=").append(p3_4_7);
        sb.append(", ");
        sb.append("p3_4_8=").append(p3_4_8);
        sb.append(", ");
        sb.append("p3_4_9=").append(p3_4_9);
        sb.append(", ");
        sb.append("p3_4_10=").append(p3_4_10);
        sb.append(", ");
        sb.append("create_by=").append(create_by);
        sb.append(", ");
        sb.append("create_time=").append(create_time);
        sb.append(", ");
        sb.append("update_by=").append(update_by);
        sb.append(", ");
        sb.append("update_time=").append(update_time);
        sb.append("]");

        return sb.toString();
    }
}
