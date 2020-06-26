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
 * 表名：b_invoice_info
 * 备注：票据信息
 *
 * @author ${param.author}
 */
@Table(name = "b_invoice_info")
@SuppressWarnings("serial")
public class BInvoiceInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 完整发票号码 完整, 数据库字段：invoice_no */
    private String invoice_no;

    /** 发票类型, 数据库字段：invoice_type */
    private String invoice_type;

    /** 发票分类, 数据库字段：invoice_catalog */
    private String invoice_catalog;

    /** 关联id, 数据库字段：contract_id */
    private String contract_id;

    /** 图形码, 数据库字段：img_code */
    private String img_code;

    /** 机器号码, 数据库字段：machine_no */
    private String machine_no;

    /** 发票代码, 数据库字段：invoice_code */
    private String invoice_code;

    /** 发票号码, 数据库字段：invoice_no_short */
    private String invoice_no_short;

    /** 开票日期, 数据库字段：invoice_time */
    private Date invoice_time;

    /** 校验码, 数据库字段：check_code */
    private String check_code;

    /** 购买方名称, 数据库字段：b_name */
    private String b_name;

    /** 购买方纳税人识别号, 数据库字段：b_tax_id */
    private String b_tax_id;

    /** 购买方地址、电话, 数据库字段：b_link_info */
    private String b_link_info;

    /** 购买方开户行及账号, 数据库字段：b_account */
    private String b_account;

    /** 密码区, 数据库字段：key_area */
    private String key_area;

    /** 货物或应税劳务、服务 json数组, 数据库字段：services */
    private String services;

    /** 合计金额, 数据库字段：price_amount */
    private BigDecimal price_amount;

    /** 合计税额, 数据库字段：tax_amount */
    private BigDecimal tax_amount;

    /** 价税合计, 数据库字段：amout */
    private BigDecimal amout;

    /** 销售方名称, 数据库字段：s_name */
    private String s_name;

    /** 销售方纳税人识别号, 数据库字段：s_tax_id */
    private String s_tax_id;

    /** 销售方纳税人地址、电话, 数据库字段：s_link_info */
    private String s_link_info;

    /** 销售方开户行及账号, 数据库字段：s_account */
    private String s_account;

    /** 备注, 数据库字段：remark */
    private String remark;

    /** 收款人, 数据库字段：payee */
    private String payee;

    /** 复核, 数据库字段：recheck */
    private String recheck;

    /** 开票人, 数据库字段：drawer */
    private String drawer;

    /** 销售方章, 数据库字段：s_stamp */
    private String s_stamp;

    /** 审核状态 null未初始化，0待审核，1通过，2驳回, 数据库字段：status */
    private String status;

    /** 关联类型, 数据库字段：type */
    private String type;

    /** 创建人, 数据库字段：create_by */
    private String create_by;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 更新人, 数据库字段：update_by */
    private String update_by;

    /** 更新时间, 数据库字段：update_time */
    private Date update_time;

    /** 设置id, 数据库字段：b_invoice_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_invoice_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置完整发票号码 完整, 数据库字段：b_invoice_info.invoice_no */
    public void setInvoice_no(String invoice_no) {
        this.invoice_no = invoice_no;
    }

    /** 获取完整发票号码 完整, 数据库字段：b_invoice_info.invoice_no */
    public String getInvoice_no() {
        return this.invoice_no;
    }

    /** 设置发票类型, 数据库字段：b_invoice_info.invoice_type */
    public void setInvoice_type(String invoice_type) {
        this.invoice_type = invoice_type;
    }

    /** 获取发票类型, 数据库字段：b_invoice_info.invoice_type */
    public String getInvoice_type() {
        return this.invoice_type;
    }

    /** 设置发票分类, 数据库字段：b_invoice_info.invoice_catalog */
    public void setInvoice_catalog(String invoice_catalog) {
        this.invoice_catalog = invoice_catalog;
    }

    /** 获取发票分类, 数据库字段：b_invoice_info.invoice_catalog */
    public String getInvoice_catalog() {
        return this.invoice_catalog;
    }

    /** 设置关联id, 数据库字段：b_invoice_info.contract_id */
    public void setContract_id(String contract_id) {
        this.contract_id = contract_id;
    }

    /** 获取关联id, 数据库字段：b_invoice_info.contract_id */
    public String getContract_id() {
        return this.contract_id;
    }

    /** 设置图形码, 数据库字段：b_invoice_info.img_code */
    public void setImg_code(String img_code) {
        this.img_code = img_code;
    }

    /** 获取图形码, 数据库字段：b_invoice_info.img_code */
    public String getImg_code() {
        return this.img_code;
    }

    /** 设置机器号码, 数据库字段：b_invoice_info.machine_no */
    public void setMachine_no(String machine_no) {
        this.machine_no = machine_no;
    }

    /** 获取机器号码, 数据库字段：b_invoice_info.machine_no */
    public String getMachine_no() {
        return this.machine_no;
    }

    /** 设置发票代码, 数据库字段：b_invoice_info.invoice_code */
    public void setInvoice_code(String invoice_code) {
        this.invoice_code = invoice_code;
    }

    /** 获取发票代码, 数据库字段：b_invoice_info.invoice_code */
    public String getInvoice_code() {
        return this.invoice_code;
    }

    /** 设置发票号码, 数据库字段：b_invoice_info.invoice_no_short */
    public void setInvoice_no_short(String invoice_no_short) {
        this.invoice_no_short = invoice_no_short;
    }

    /** 获取发票号码, 数据库字段：b_invoice_info.invoice_no_short */
    public String getInvoice_no_short() {
        return this.invoice_no_short;
    }

    /** 设置开票日期, 数据库字段：b_invoice_info.invoice_time */
    public void setInvoice_time(Date invoice_time) {
        this.invoice_time = invoice_time;
    }

    /** 获取开票日期, 数据库字段：b_invoice_info.invoice_time */
    public Date getInvoice_time() {
        return this.invoice_time;
    }

    /** 设置校验码, 数据库字段：b_invoice_info.check_code */
    public void setCheck_code(String check_code) {
        this.check_code = check_code;
    }

    /** 获取校验码, 数据库字段：b_invoice_info.check_code */
    public String getCheck_code() {
        return this.check_code;
    }

    /** 设置购买方名称, 数据库字段：b_invoice_info.b_name */
    public void setB_name(String b_name) {
        this.b_name = b_name;
    }

    /** 获取购买方名称, 数据库字段：b_invoice_info.b_name */
    public String getB_name() {
        return this.b_name;
    }

    /** 设置购买方纳税人识别号, 数据库字段：b_invoice_info.b_tax_id */
    public void setB_tax_id(String b_tax_id) {
        this.b_tax_id = b_tax_id;
    }

    /** 获取购买方纳税人识别号, 数据库字段：b_invoice_info.b_tax_id */
    public String getB_tax_id() {
        return this.b_tax_id;
    }

    /** 设置购买方地址、电话, 数据库字段：b_invoice_info.b_link_info */
    public void setB_link_info(String b_link_info) {
        this.b_link_info = b_link_info;
    }

    /** 获取购买方地址、电话, 数据库字段：b_invoice_info.b_link_info */
    public String getB_link_info() {
        return this.b_link_info;
    }

    /** 设置购买方开户行及账号, 数据库字段：b_invoice_info.b_account */
    public void setB_account(String b_account) {
        this.b_account = b_account;
    }

    /** 获取购买方开户行及账号, 数据库字段：b_invoice_info.b_account */
    public String getB_account() {
        return this.b_account;
    }

    /** 设置密码区, 数据库字段：b_invoice_info.key_area */
    public void setKey_area(String key_area) {
        this.key_area = key_area;
    }

    /** 获取密码区, 数据库字段：b_invoice_info.key_area */
    public String getKey_area() {
        return this.key_area;
    }

    /** 设置货物或应税劳务、服务 json数组, 数据库字段：b_invoice_info.services */
    public void setServices(String services) {
        this.services = services;
    }

    /** 获取货物或应税劳务、服务 json数组, 数据库字段：b_invoice_info.services */
    public String getServices() {
        return this.services;
    }

    /** 设置合计金额, 数据库字段：b_invoice_info.price_amount */
    public void setPrice_amount(BigDecimal price_amount) {
        this.price_amount = price_amount;
    }

    /** 获取合计金额, 数据库字段：b_invoice_info.price_amount */
    public BigDecimal getPrice_amount() {
        return this.price_amount;
    }

    /** 设置合计税额, 数据库字段：b_invoice_info.tax_amount */
    public void setTax_amount(BigDecimal tax_amount) {
        this.tax_amount = tax_amount;
    }

    /** 获取合计税额, 数据库字段：b_invoice_info.tax_amount */
    public BigDecimal getTax_amount() {
        return this.tax_amount;
    }

    /** 设置价税合计, 数据库字段：b_invoice_info.amout */
    public void setAmout(BigDecimal amout) {
        this.amout = amout;
    }

    /** 获取价税合计, 数据库字段：b_invoice_info.amout */
    public BigDecimal getAmout() {
        return this.amout;
    }

    /** 设置销售方名称, 数据库字段：b_invoice_info.s_name */
    public void setS_name(String s_name) {
        this.s_name = s_name;
    }

    /** 获取销售方名称, 数据库字段：b_invoice_info.s_name */
    public String getS_name() {
        return this.s_name;
    }

    /** 设置销售方纳税人识别号, 数据库字段：b_invoice_info.s_tax_id */
    public void setS_tax_id(String s_tax_id) {
        this.s_tax_id = s_tax_id;
    }

    /** 获取销售方纳税人识别号, 数据库字段：b_invoice_info.s_tax_id */
    public String getS_tax_id() {
        return this.s_tax_id;
    }

    /** 设置销售方纳税人地址、电话, 数据库字段：b_invoice_info.s_link_info */
    public void setS_link_info(String s_link_info) {
        this.s_link_info = s_link_info;
    }

    /** 获取销售方纳税人地址、电话, 数据库字段：b_invoice_info.s_link_info */
    public String getS_link_info() {
        return this.s_link_info;
    }

    /** 设置销售方开户行及账号, 数据库字段：b_invoice_info.s_account */
    public void setS_account(String s_account) {
        this.s_account = s_account;
    }

    /** 获取销售方开户行及账号, 数据库字段：b_invoice_info.s_account */
    public String getS_account() {
        return this.s_account;
    }

    /** 设置备注, 数据库字段：b_invoice_info.remark */
    public void setRemark(String remark) {
        this.remark = remark;
    }

    /** 获取备注, 数据库字段：b_invoice_info.remark */
    public String getRemark() {
        return this.remark;
    }

    /** 设置收款人, 数据库字段：b_invoice_info.payee */
    public void setPayee(String payee) {
        this.payee = payee;
    }

    /** 获取收款人, 数据库字段：b_invoice_info.payee */
    public String getPayee() {
        return this.payee;
    }

    /** 设置复核, 数据库字段：b_invoice_info.recheck */
    public void setRecheck(String recheck) {
        this.recheck = recheck;
    }

    /** 获取复核, 数据库字段：b_invoice_info.recheck */
    public String getRecheck() {
        return this.recheck;
    }

    /** 设置开票人, 数据库字段：b_invoice_info.drawer */
    public void setDrawer(String drawer) {
        this.drawer = drawer;
    }

    /** 获取开票人, 数据库字段：b_invoice_info.drawer */
    public String getDrawer() {
        return this.drawer;
    }

    /** 设置销售方章, 数据库字段：b_invoice_info.s_stamp */
    public void setS_stamp(String s_stamp) {
        this.s_stamp = s_stamp;
    }

    /** 获取销售方章, 数据库字段：b_invoice_info.s_stamp */
    public String getS_stamp() {
        return this.s_stamp;
    }

    /** 设置审核状态 null未初始化，0待审核，1通过，2驳回, 数据库字段：b_invoice_info.status */
    public void setStatus(String status) {
        this.status = status;
    }

    /** 获取审核状态 null未初始化，0待审核，1通过，2驳回, 数据库字段：b_invoice_info.status */
    public String getStatus() {
        return this.status;
    }

    /** 设置关联类型, 数据库字段：b_invoice_info.type */
    public void setType(String type) {
        this.type = type;
    }

    /** 获取关联类型, 数据库字段：b_invoice_info.type */
    public String getType() {
        return this.type;
    }

    /** 设置创建人, 数据库字段：b_invoice_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_invoice_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_invoice_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_invoice_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_invoice_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_invoice_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_invoice_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_invoice_info.update_time */
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

        BInvoiceInfo other = (BInvoiceInfo) obj;

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
        sb.append("BInvoiceInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("invoice_no=").append(invoice_no);
        sb.append(", ");
        sb.append("invoice_type=").append(invoice_type);
        sb.append(", ");
        sb.append("invoice_catalog=").append(invoice_catalog);
        sb.append(", ");
        sb.append("contract_id=").append(contract_id);
        sb.append(", ");
        sb.append("img_code=").append(img_code);
        sb.append(", ");
        sb.append("machine_no=").append(machine_no);
        sb.append(", ");
        sb.append("invoice_code=").append(invoice_code);
        sb.append(", ");
        sb.append("invoice_no_short=").append(invoice_no_short);
        sb.append(", ");
        sb.append("invoice_time=").append(invoice_time);
        sb.append(", ");
        sb.append("check_code=").append(check_code);
        sb.append(", ");
        sb.append("b_name=").append(b_name);
        sb.append(", ");
        sb.append("b_tax_id=").append(b_tax_id);
        sb.append(", ");
        sb.append("b_link_info=").append(b_link_info);
        sb.append(", ");
        sb.append("b_account=").append(b_account);
        sb.append(", ");
        sb.append("key_area=").append(key_area);
        sb.append(", ");
        sb.append("services=").append(services);
        sb.append(", ");
        sb.append("price_amount=").append(price_amount);
        sb.append(", ");
        sb.append("tax_amount=").append(tax_amount);
        sb.append(", ");
        sb.append("amout=").append(amout);
        sb.append(", ");
        sb.append("s_name=").append(s_name);
        sb.append(", ");
        sb.append("s_tax_id=").append(s_tax_id);
        sb.append(", ");
        sb.append("s_link_info=").append(s_link_info);
        sb.append(", ");
        sb.append("s_account=").append(s_account);
        sb.append(", ");
        sb.append("remark=").append(remark);
        sb.append(", ");
        sb.append("payee=").append(payee);
        sb.append(", ");
        sb.append("recheck=").append(recheck);
        sb.append(", ");
        sb.append("drawer=").append(drawer);
        sb.append(", ");
        sb.append("s_stamp=").append(s_stamp);
        sb.append(", ");
        sb.append("status=").append(status);
        sb.append(", ");
        sb.append("type=").append(type);
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
