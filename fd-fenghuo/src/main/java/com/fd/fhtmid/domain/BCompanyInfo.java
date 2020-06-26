package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_company_info
 * 备注：公司信息表
 *
 * @author ${param.author}
 */
@Table(name = "b_company_info")
@SuppressWarnings("serial")
public class BCompanyInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 公司编号, 数据库字段：company_code */
    private String company_code;

    /** 公司名称, 数据库字段：name */
    private String name;

    /** 创建人, 数据库字段：create_by */
    private String create_by;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 更新人, 数据库字段：update_by */
    private String update_by;

    /** 更新时间, 数据库字段：update_time */
    private Date update_time;

    /** 是否删除 1删除0正常, 数据库字段：is_delete */
    private String is_delete;

    /** 设置id, 数据库字段：b_company_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_company_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置公司编号, 数据库字段：b_company_info.company_code */
    public void setCompany_code(String company_code) {
        this.company_code = company_code;
    }

    /** 获取公司编号, 数据库字段：b_company_info.company_code */
    public String getCompany_code() {
        return this.company_code;
    }

    /** 设置公司名称, 数据库字段：b_company_info.name */
    public void setName(String name) {
        this.name = name;
    }

    /** 获取公司名称, 数据库字段：b_company_info.name */
    public String getName() {
        return this.name;
    }

    /** 设置创建人, 数据库字段：b_company_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_company_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_company_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_company_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_company_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_company_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_company_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_company_info.update_time */
    public Date getUpdate_time() {
        return this.update_time;
    }

    /** 设置是否删除 1删除0正常, 数据库字段：b_company_info.is_delete */
    public void setIs_delete(String is_delete) {
        this.is_delete = is_delete;
    }

    /** 获取是否删除 1删除0正常, 数据库字段：b_company_info.is_delete */
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

        BCompanyInfo other = (BCompanyInfo) obj;

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
        sb.append("BCompanyInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("company_code=").append(company_code);
        sb.append(", ");
        sb.append("name=").append(name);
        sb.append(", ");
        sb.append("create_by=").append(create_by);
        sb.append(", ");
        sb.append("create_time=").append(create_time);
        sb.append(", ");
        sb.append("update_by=").append(update_by);
        sb.append(", ");
        sb.append("update_time=").append(update_time);
        sb.append(", ");
        sb.append("is_delete=").append(is_delete);
        sb.append("]");

        return sb.toString();
    }
}
