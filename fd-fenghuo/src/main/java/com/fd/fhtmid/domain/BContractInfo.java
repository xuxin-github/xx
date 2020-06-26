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
 * 表名：b_contract_info
 * 备注：合同信息
 *
 * @author ${param.author}
 */
@Table(name = "b_contract_info")
@SuppressWarnings("serial")
public class BContractInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 合同编号, 数据库字段：contract_code */
    private String contract_code;

    /** 税务合规风险分数, 数据库字段：p2_1 */
    private Integer p2_1;

    /** 市场监管风险分数, 数据库字段：p2_2 */
    private Integer p2_2;

    /** 内部风控风险分数, 数据库字段：p2_3 */
    private Integer p2_3;

    /** 供应商评分分数, 数据库字段：p2_4 */
    private Integer p2_4;

    /** 计算版本号, 数据库字段：compute_version */
    private String compute_version;

    /** 合同名称, 数据库字段：name */
    private String name;

    /** 合同介绍, 数据库字段：intro */
    private String intro;

    /** 合同文件, 数据库字段：files */
    private String files;

    /** 合同金额, 数据库字段：total_amount */
    private BigDecimal total_amount;

    /** 销售方企业名称, 数据库字段：sell_name */
    private String sell_name;

    /** 货物或应税劳务、服务名称, 数据库字段：service_name */
    private String service_name;

    /** 签约日期 年月日选择, 数据库字段：sign_date */
    private Date sign_date;

    /** 争议解决方式 01仲裁 02法院, 数据库字段：solve_type */
    private String solve_type;

    /** 业务主办人, 数据库字段：sponsor */
    private String sponsor;

    /** 业务主管, 数据库字段：leader */
    private String leader;

    /** 财务审核人, 数据库字段：f_auditor */
    private String f_auditor;

    /** 业务审核人, 数据库字段：b_auditor */
    private String b_auditor;

    /** 邮件、短信或其他信息, 数据库字段：link_info */
    private String link_info;

    /** 发起文档等材料, 数据库字段：docs */
    private String docs;

    /** 记账凭证记录, 数据库字段：f_record */
    private String f_record;

    /** 银行流水记录, 数据库字段：b_record */
    private String b_record;

    /** 交易账册记录, 数据库字段：s_record */
    private String s_record;

    /** 邮件、短信或其他信息2, 数据库字段：b_link_info */
    private String b_link_info;

    /** 完成文档等材料, 数据库字段：f_docs */
    private String f_docs;

    /** 完成时间, 数据库字段：f_time */
    private Date f_time;

    /** 收款方及银行流水, 数据库字段：receive_b_record */
    private String receive_b_record;

    /** 争议事项, 数据库字段：dispute_item */
    private String dispute_item;

    /** 对方联系方式 [{n,t,a}], 数据库字段：t_link_info */
    private String t_link_info;

    /** 项目id, 数据库字段：project_id */
    private String project_id;

    /** 公司id, 数据库字段：company_id */
    private String company_id;

    /** 创建人, 数据库字段：create_by */
    private String create_by;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 更新人, 数据库字段：update_by */
    private String update_by;

    /** 更新时间, 数据库字段：update_time */
    private Date update_time;

    /** 状态 01正常02结束, 数据库字段：status */
    private String status;

    /** 风险等级 01正常02高风险, 数据库字段：risk_level */
    private String risk_level;

    /** 是否删除 1删除0正常, 数据库字段：is_delete */
    private String is_delete;

    /** 设置id, 数据库字段：b_contract_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_contract_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置合同编号, 数据库字段：b_contract_info.contract_code */
    public void setContract_code(String contract_code) {
        this.contract_code = contract_code;
    }

    /** 获取合同编号, 数据库字段：b_contract_info.contract_code */
    public String getContract_code() {
        return this.contract_code;
    }

    /** 设置税务合规风险分数, 数据库字段：b_contract_info.p2_1 */
    public void setP2_1(Integer p2_1) {
        this.p2_1 = p2_1;
    }

    /** 获取税务合规风险分数, 数据库字段：b_contract_info.p2_1 */
    public Integer getP2_1() {
        return this.p2_1;
    }

    /** 设置市场监管风险分数, 数据库字段：b_contract_info.p2_2 */
    public void setP2_2(Integer p2_2) {
        this.p2_2 = p2_2;
    }

    /** 获取市场监管风险分数, 数据库字段：b_contract_info.p2_2 */
    public Integer getP2_2() {
        return this.p2_2;
    }

    /** 设置内部风控风险分数, 数据库字段：b_contract_info.p2_3 */
    public void setP2_3(Integer p2_3) {
        this.p2_3 = p2_3;
    }

    /** 获取内部风控风险分数, 数据库字段：b_contract_info.p2_3 */
    public Integer getP2_3() {
        return this.p2_3;
    }

    /** 设置供应商评分分数, 数据库字段：b_contract_info.p2_4 */
    public void setP2_4(Integer p2_4) {
        this.p2_4 = p2_4;
    }

    /** 获取供应商评分分数, 数据库字段：b_contract_info.p2_4 */
    public Integer getP2_4() {
        return this.p2_4;
    }

    /** 设置计算版本号, 数据库字段：b_contract_info.compute_version */
    public void setCompute_version(String compute_version) {
        this.compute_version = compute_version;
    }

    /** 获取计算版本号, 数据库字段：b_contract_info.compute_version */
    public String getCompute_version() {
        return this.compute_version;
    }

    /** 设置合同名称, 数据库字段：b_contract_info.name */
    public void setName(String name) {
        this.name = name;
    }

    /** 获取合同名称, 数据库字段：b_contract_info.name */
    public String getName() {
        return this.name;
    }

    /** 设置合同介绍, 数据库字段：b_contract_info.intro */
    public void setIntro(String intro) {
        this.intro = intro;
    }

    /** 获取合同介绍, 数据库字段：b_contract_info.intro */
    public String getIntro() {
        return this.intro;
    }

    /** 设置合同文件, 数据库字段：b_contract_info.files */
    public void setFiles(String files) {
        this.files = files;
    }

    /** 获取合同文件, 数据库字段：b_contract_info.files */
    public String getFiles() {
        return this.files;
    }

    /** 设置合同金额, 数据库字段：b_contract_info.total_amount */
    public void setTotal_amount(BigDecimal total_amount) {
        this.total_amount = total_amount;
    }

    /** 获取合同金额, 数据库字段：b_contract_info.total_amount */
    public BigDecimal getTotal_amount() {
        return this.total_amount;
    }

    /** 设置销售方企业名称, 数据库字段：b_contract_info.sell_name */
    public void setSell_name(String sell_name) {
        this.sell_name = sell_name;
    }

    /** 获取销售方企业名称, 数据库字段：b_contract_info.sell_name */
    public String getSell_name() {
        return this.sell_name;
    }

    /** 设置货物或应税劳务、服务名称, 数据库字段：b_contract_info.service_name */
    public void setService_name(String service_name) {
        this.service_name = service_name;
    }

    /** 获取货物或应税劳务、服务名称, 数据库字段：b_contract_info.service_name */
    public String getService_name() {
        return this.service_name;
    }

    /** 设置签约日期 年月日选择, 数据库字段：b_contract_info.sign_date */
    public void setSign_date(Date sign_date) {
        this.sign_date = sign_date;
    }

    /** 获取签约日期 年月日选择, 数据库字段：b_contract_info.sign_date */
    public Date getSign_date() {
        return this.sign_date;
    }

    /** 设置争议解决方式 01仲裁 02法院, 数据库字段：b_contract_info.solve_type */
    public void setSolve_type(String solve_type) {
        this.solve_type = solve_type;
    }

    /** 获取争议解决方式 01仲裁 02法院, 数据库字段：b_contract_info.solve_type */
    public String getSolve_type() {
        return this.solve_type;
    }

    /** 设置业务主办人, 数据库字段：b_contract_info.sponsor */
    public void setSponsor(String sponsor) {
        this.sponsor = sponsor;
    }

    /** 获取业务主办人, 数据库字段：b_contract_info.sponsor */
    public String getSponsor() {
        return this.sponsor;
    }

    /** 设置业务主管, 数据库字段：b_contract_info.leader */
    public void setLeader(String leader) {
        this.leader = leader;
    }

    /** 获取业务主管, 数据库字段：b_contract_info.leader */
    public String getLeader() {
        return this.leader;
    }

    /** 设置财务审核人, 数据库字段：b_contract_info.f_auditor */
    public void setF_auditor(String f_auditor) {
        this.f_auditor = f_auditor;
    }

    /** 获取财务审核人, 数据库字段：b_contract_info.f_auditor */
    public String getF_auditor() {
        return this.f_auditor;
    }

    /** 设置业务审核人, 数据库字段：b_contract_info.b_auditor */
    public void setB_auditor(String b_auditor) {
        this.b_auditor = b_auditor;
    }

    /** 获取业务审核人, 数据库字段：b_contract_info.b_auditor */
    public String getB_auditor() {
        return this.b_auditor;
    }

    /** 设置邮件、短信或其他信息, 数据库字段：b_contract_info.link_info */
    public void setLink_info(String link_info) {
        this.link_info = link_info;
    }

    /** 获取邮件、短信或其他信息, 数据库字段：b_contract_info.link_info */
    public String getLink_info() {
        return this.link_info;
    }

    /** 设置发起文档等材料, 数据库字段：b_contract_info.docs */
    public void setDocs(String docs) {
        this.docs = docs;
    }

    /** 获取发起文档等材料, 数据库字段：b_contract_info.docs */
    public String getDocs() {
        return this.docs;
    }

    /** 设置记账凭证记录, 数据库字段：b_contract_info.f_record */
    public void setF_record(String f_record) {
        this.f_record = f_record;
    }

    /** 获取记账凭证记录, 数据库字段：b_contract_info.f_record */
    public String getF_record() {
        return this.f_record;
    }

    /** 设置银行流水记录, 数据库字段：b_contract_info.b_record */
    public void setB_record(String b_record) {
        this.b_record = b_record;
    }

    /** 获取银行流水记录, 数据库字段：b_contract_info.b_record */
    public String getB_record() {
        return this.b_record;
    }

    /** 设置交易账册记录, 数据库字段：b_contract_info.s_record */
    public void setS_record(String s_record) {
        this.s_record = s_record;
    }

    /** 获取交易账册记录, 数据库字段：b_contract_info.s_record */
    public String getS_record() {
        return this.s_record;
    }

    /** 设置邮件、短信或其他信息2, 数据库字段：b_contract_info.b_link_info */
    public void setB_link_info(String b_link_info) {
        this.b_link_info = b_link_info;
    }

    /** 获取邮件、短信或其他信息2, 数据库字段：b_contract_info.b_link_info */
    public String getB_link_info() {
        return this.b_link_info;
    }

    /** 设置完成文档等材料, 数据库字段：b_contract_info.f_docs */
    public void setF_docs(String f_docs) {
        this.f_docs = f_docs;
    }

    /** 获取完成文档等材料, 数据库字段：b_contract_info.f_docs */
    public String getF_docs() {
        return this.f_docs;
    }

    /** 设置完成时间, 数据库字段：b_contract_info.f_time */
    public void setF_time(Date f_time) {
        this.f_time = f_time;
    }

    /** 获取完成时间, 数据库字段：b_contract_info.f_time */
    public Date getF_time() {
        return this.f_time;
    }

    /** 设置收款方及银行流水, 数据库字段：b_contract_info.receive_b_record */
    public void setReceive_b_record(String receive_b_record) {
        this.receive_b_record = receive_b_record;
    }

    /** 获取收款方及银行流水, 数据库字段：b_contract_info.receive_b_record */
    public String getReceive_b_record() {
        return this.receive_b_record;
    }

    /** 设置争议事项, 数据库字段：b_contract_info.dispute_item */
    public void setDispute_item(String dispute_item) {
        this.dispute_item = dispute_item;
    }

    /** 获取争议事项, 数据库字段：b_contract_info.dispute_item */
    public String getDispute_item() {
        return this.dispute_item;
    }

    /** 设置对方联系方式 [{n,t,a}], 数据库字段：b_contract_info.t_link_info */
    public void setT_link_info(String t_link_info) {
        this.t_link_info = t_link_info;
    }

    /** 获取对方联系方式 [{n,t,a}], 数据库字段：b_contract_info.t_link_info */
    public String getT_link_info() {
        return this.t_link_info;
    }

    /** 设置项目id, 数据库字段：b_contract_info.project_id */
    public void setProject_id(String project_id) {
        this.project_id = project_id;
    }

    /** 获取项目id, 数据库字段：b_contract_info.project_id */
    public String getProject_id() {
        return this.project_id;
    }

    /** 设置公司id, 数据库字段：b_contract_info.company_id */
    public void setCompany_id(String company_id) {
        this.company_id = company_id;
    }

    /** 获取公司id, 数据库字段：b_contract_info.company_id */
    public String getCompany_id() {
        return this.company_id;
    }

    /** 设置创建人, 数据库字段：b_contract_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_contract_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_contract_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_contract_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_contract_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_contract_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_contract_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_contract_info.update_time */
    public Date getUpdate_time() {
        return this.update_time;
    }

    /** 设置状态 01正常02结束, 数据库字段：b_contract_info.status */
    public void setStatus(String status) {
        this.status = status;
    }

    /** 获取状态 01正常02结束, 数据库字段：b_contract_info.status */
    public String getStatus() {
        return this.status;
    }

    /** 设置风险等级 01正常02高风险, 数据库字段：b_contract_info.risk_level */
    public void setRisk_level(String risk_level) {
        this.risk_level = risk_level;
    }

    /** 获取风险等级 01正常02高风险, 数据库字段：b_contract_info.risk_level */
    public String getRisk_level() {
        return this.risk_level;
    }

    /** 设置是否删除 1删除0正常, 数据库字段：b_contract_info.is_delete */
    public void setIs_delete(String is_delete) {
        this.is_delete = is_delete;
    }

    /** 获取是否删除 1删除0正常, 数据库字段：b_contract_info.is_delete */
    public String getIs_delete() {
        return this.is_delete;
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

        BContractInfo other = (BContractInfo) obj;

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
        sb.append("BContractInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("contract_code=").append(contract_code);
        sb.append(", ");
        sb.append("p2_1=").append(p2_1);
        sb.append(", ");
        sb.append("p2_2=").append(p2_2);
        sb.append(", ");
        sb.append("p2_3=").append(p2_3);
        sb.append(", ");
        sb.append("p2_4=").append(p2_4);
        sb.append(", ");
        sb.append("compute_version=").append(compute_version);
        sb.append(", ");
        sb.append("name=").append(name);
        sb.append(", ");
        sb.append("intro=").append(intro);
        sb.append(", ");
        sb.append("files=").append(files);
        sb.append(", ");
        sb.append("total_amount=").append(total_amount);
        sb.append(", ");
        sb.append("sell_name=").append(sell_name);
        sb.append(", ");
        sb.append("service_name=").append(service_name);
        sb.append(", ");
        sb.append("sign_date=").append(sign_date);
        sb.append(", ");
        sb.append("solve_type=").append(solve_type);
        sb.append(", ");
        sb.append("sponsor=").append(sponsor);
        sb.append(", ");
        sb.append("leader=").append(leader);
        sb.append(", ");
        sb.append("f_auditor=").append(f_auditor);
        sb.append(", ");
        sb.append("b_auditor=").append(b_auditor);
        sb.append(", ");
        sb.append("link_info=").append(link_info);
        sb.append(", ");
        sb.append("docs=").append(docs);
        sb.append(", ");
        sb.append("f_record=").append(f_record);
        sb.append(", ");
        sb.append("b_record=").append(b_record);
        sb.append(", ");
        sb.append("s_record=").append(s_record);
        sb.append(", ");
        sb.append("b_link_info=").append(b_link_info);
        sb.append(", ");
        sb.append("f_docs=").append(f_docs);
        sb.append(", ");
        sb.append("f_time=").append(f_time);
        sb.append(", ");
        sb.append("receive_b_record=").append(receive_b_record);
        sb.append(", ");
        sb.append("dispute_item=").append(dispute_item);
        sb.append(", ");
        sb.append("t_link_info=").append(t_link_info);
        sb.append(", ");
        sb.append("project_id=").append(project_id);
        sb.append(", ");
        sb.append("company_id=").append(company_id);
        sb.append(", ");
        sb.append("create_by=").append(create_by);
        sb.append(", ");
        sb.append("create_time=").append(create_time);
        sb.append(", ");
        sb.append("update_by=").append(update_by);
        sb.append(", ");
        sb.append("update_time=").append(update_time);
        sb.append(", ");
        sb.append("status=").append(status);
        sb.append(", ");
        sb.append("risk_level=").append(risk_level);
        sb.append(", ");
        sb.append("is_delete=").append(is_delete);
        sb.append("]");

        return sb.toString();
    }
}
