package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_user_info
 * 备注：用户信息表
 *
 * @author ${param.author}
 */
@Table(name = "b_user_info")
@SuppressWarnings("serial")
public class BUserInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 用户名, 数据库字段：username */
    private String username;

    /** 密码, 数据库字段：pwd */
    private String pwd;

    /** 人员姓名, 数据库字段：name */
    private String name;

    /** 角色id, 数据库字段：role_id */
    private String role_id;

    /** 部门id, 数据库字段：dept_id */
    private String dept_id;

    /** 公司id, 数据库字段：company_id */
    private String company_id;

    /** 是否删除 1删除0正常, 数据库字段：is_delete */
    private String is_delete;

    /** 是否禁用 1禁用0启用, 数据库字段：is_disable */
    private String is_disable;

    /** 创建人, 数据库字段：create_by */
    private String create_by;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 更新人, 数据库字段：update_by */
    private String update_by;

    /** 更新时间, 数据库字段：update_time */
    private Date update_time;

    /** 设置id, 数据库字段：b_user_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_user_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置用户名, 数据库字段：b_user_info.username */
    public void setUsername(String username) {
        this.username = username;
    }

    /** 获取用户名, 数据库字段：b_user_info.username */
    public String getUsername() {
        return this.username;
    }

    /** 设置密码, 数据库字段：b_user_info.pwd */
    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    /** 获取密码, 数据库字段：b_user_info.pwd */
    public String getPwd() {
        return this.pwd;
    }

    /** 设置人员姓名, 数据库字段：b_user_info.name */
    public void setName(String name) {
        this.name = name;
    }

    /** 获取人员姓名, 数据库字段：b_user_info.name */
    public String getName() {
        return this.name;
    }

    /** 设置角色id, 数据库字段：b_user_info.role_id */
    public void setRole_id(String role_id) {
        this.role_id = role_id;
    }

    /** 获取角色id, 数据库字段：b_user_info.role_id */
    public String getRole_id() {
        return this.role_id;
    }

    /** 设置部门id, 数据库字段：b_user_info.dept_id */
    public void setDept_id(String dept_id) {
        this.dept_id = dept_id;
    }

    /** 获取部门id, 数据库字段：b_user_info.dept_id */
    public String getDept_id() {
        return this.dept_id;
    }

    /** 设置公司id, 数据库字段：b_user_info.company_id */
    public void setCompany_id(String company_id) {
        this.company_id = company_id;
    }

    /** 获取公司id, 数据库字段：b_user_info.company_id */
    public String getCompany_id() {
        return this.company_id;
    }

    /** 设置是否删除 1删除0正常, 数据库字段：b_user_info.is_delete */
    public void setIs_delete(String is_delete) {
        this.is_delete = is_delete;
    }

    /** 获取是否删除 1删除0正常, 数据库字段：b_user_info.is_delete */
    public String getIs_delete() {
        return this.is_delete;
    }

    /** 设置是否禁用 1禁用0启用, 数据库字段：b_user_info.is_disable */
    public void setIs_disable(String is_disable) {
        this.is_disable = is_disable;
    }

    /** 获取是否禁用 1禁用0启用, 数据库字段：b_user_info.is_disable */
    public String getIs_disable() {
        return this.is_disable;
    }

    /** 设置创建人, 数据库字段：b_user_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_user_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_user_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_user_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_user_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_user_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_user_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_user_info.update_time */
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

        BUserInfo other = (BUserInfo) obj;

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
        sb.append("BUserInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("username=").append(username);
        sb.append(", ");
        sb.append("pwd=").append(pwd);
        sb.append(", ");
        sb.append("name=").append(name);
        sb.append(", ");
        sb.append("role_id=").append(role_id);
        sb.append(", ");
        sb.append("dept_id=").append(dept_id);
        sb.append(", ");
        sb.append("company_id=").append(company_id);
        sb.append(", ");
        sb.append("is_delete=").append(is_delete);
        sb.append(", ");
        sb.append("is_disable=").append(is_disable);
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
