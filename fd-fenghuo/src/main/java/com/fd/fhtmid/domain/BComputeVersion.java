package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_compute_version
 * 备注：
 *
 * @author ${param.author}
 */
@Table(name = "b_compute_version")
@SuppressWarnings("serial")
public class BComputeVersion {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id 版本号, 数据库字段：id */
    private String id;

    /** json, 数据库字段：detail */
    private String detail;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /**  数据库字段：contract_id */
    private String contract_id;

    /** 设置id 版本号, 数据库字段：b_compute_version.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id 版本号, 数据库字段：b_compute_version.id */
    public String getId() {
        return this.id;
    }

    /** 设置json, 数据库字段：b_compute_version.detail */
    public void setDetail(String detail) {
        this.detail = detail;
    }

    /** 获取json, 数据库字段：b_compute_version.detail */
    public String getDetail() {
        return this.detail;
    }

    /** 设置创建时间, 数据库字段：b_compute_version.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_compute_version.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /**  数据库字段：b_compute_version.contract_id */
    public void setContract_id(String contract_id) {
        this.contract_id = contract_id;
    }

    /**  数据库字段：b_compute_version.contract_id */
    public String getContract_id() {
        return this.contract_id;
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

        BComputeVersion other = (BComputeVersion) obj;

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
        sb.append("BComputeVersion [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("detail=").append(detail);
        sb.append(", ");
        sb.append("create_time=").append(create_time);
        sb.append(", ");
        sb.append("contract_id=").append(contract_id);
        sb.append("]");

        return sb.toString();
    }
}
