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
 * 表名：b_project_info
 * 备注：项目信息
 *
 * @author ${param.author}
 */
@Table(name = "b_project_info")
@SuppressWarnings("serial")
public class BProjectInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 项目编号, 数据库字段：project_code */
    private String project_code;

    /** 项目名称, 数据库字段：name */
    private String name;

    /** 项目预算, 数据库字段：project_budget */
    private BigDecimal project_budget;

    /** 发起人, 数据库字段：initiator */
    private String initiator;

    /** 部门id, 数据库字段：dept_id */
    private String dept_id;

    /** 项目标签, 数据库字段：project_tag */
    private String project_tag;

    /** 审核状态 null未初始化，0待审核，1通过，2驳回, 数据库字段：status */
    private String status;

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

    /** 设置id, 数据库字段：b_project_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_project_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置项目编号, 数据库字段：b_project_info.project_code */
    public void setProject_code(String project_code) {
        this.project_code = project_code;
    }

    /** 获取项目编号, 数据库字段：b_project_info.project_code */
    public String getProject_code() {
        return this.project_code;
    }

    /** 设置项目名称, 数据库字段：b_project_info.name */
    public void setName(String name) {
        this.name = name;
    }

    /** 获取项目名称, 数据库字段：b_project_info.name */
    public String getName() {
        return this.name;
    }

    /** 设置项目预算, 数据库字段：b_project_info.project_budget */
    public void setProject_budget(BigDecimal project_budget) {
        this.project_budget = project_budget;
    }

    /** 获取项目预算, 数据库字段：b_project_info.project_budget */
    public BigDecimal getProject_budget() {
        return this.project_budget;
    }

    /** 设置发起人, 数据库字段：b_project_info.initiator */
    public void setInitiator(String initiator) {
        this.initiator = initiator;
    }

    /** 获取发起人, 数据库字段：b_project_info.initiator */
    public String getInitiator() {
        return this.initiator;
    }

    /** 设置部门id, 数据库字段：b_project_info.dept_id */
    public void setDept_id(String dept_id) {
        this.dept_id = dept_id;
    }

    /** 获取部门id, 数据库字段：b_project_info.dept_id */
    public String getDept_id() {
        return this.dept_id;
    }

    /** 设置项目标签, 数据库字段：b_project_info.project_tag */
    public void setProject_tag(String project_tag) {
        this.project_tag = project_tag;
    }

    /** 获取项目标签, 数据库字段：b_project_info.project_tag */
    public String getProject_tag() {
        return this.project_tag;
    }

    /** 设置审核状态 null未初始化，0待审核，1通过，2驳回, 数据库字段：b_project_info.status */
    public void setStatus(String status) {
        this.status = status;
    }

    /** 获取审核状态 null未初始化，0待审核，1通过，2驳回, 数据库字段：b_project_info.status */
    public String getStatus() {
        return this.status;
    }

    /** 设置创建人, 数据库字段：b_project_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_project_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_project_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_project_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_project_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_project_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_project_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_project_info.update_time */
    public Date getUpdate_time() {
        return this.update_time;
    }

    /** 设置是否删除 1删除0正常, 数据库字段：b_project_info.is_delete */
    public void setIs_delete(String is_delete) {
        this.is_delete = is_delete;
    }

    /** 获取是否删除 1删除0正常, 数据库字段：b_project_info.is_delete */
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

        BProjectInfo other = (BProjectInfo) obj;

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
        sb.append("BProjectInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("project_code=").append(project_code);
        sb.append(", ");
        sb.append("name=").append(name);
        sb.append(", ");
        sb.append("project_budget=").append(project_budget);
        sb.append(", ");
        sb.append("initiator=").append(initiator);
        sb.append(", ");
        sb.append("dept_id=").append(dept_id);
        sb.append(", ");
        sb.append("project_tag=").append(project_tag);
        sb.append(", ");
        sb.append("status=").append(status);
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
