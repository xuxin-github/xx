package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_dept_user_info
 * 备注：
 *
 * @author ${param.author}
 */
@Table(name = "b_dept_user_info")
@SuppressWarnings("serial")
public class BDeptUserInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 人员id, 数据库字段：user_id */
    private String user_id;

    /** 部门id, 数据库字段：dept_id */
    private String dept_id;

    /** 创建人, 数据库字段：create_by */
    private String create_by;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 更新人, 数据库字段：update_by */
    private String update_by;

    /** 更新时间, 数据库字段：update_time */
    private Date update_time;

    /** 设置id, 数据库字段：b_dept_user_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_dept_user_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置人员id, 数据库字段：b_dept_user_info.user_id */
    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    /** 获取人员id, 数据库字段：b_dept_user_info.user_id */
    public String getUser_id() {
        return this.user_id;
    }

    /** 设置部门id, 数据库字段：b_dept_user_info.dept_id */
    public void setDept_id(String dept_id) {
        this.dept_id = dept_id;
    }

    /** 获取部门id, 数据库字段：b_dept_user_info.dept_id */
    public String getDept_id() {
        return this.dept_id;
    }

    /** 设置创建人, 数据库字段：b_dept_user_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_dept_user_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_dept_user_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_dept_user_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_dept_user_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_dept_user_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_dept_user_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_dept_user_info.update_time */
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

        BDeptUserInfo other = (BDeptUserInfo) obj;

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
        sb.append("BDeptUserInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("user_id=").append(user_id);
        sb.append(", ");
        sb.append("dept_id=").append(dept_id);
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
