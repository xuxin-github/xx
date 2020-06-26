package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_dept_info
 * 备注：部门信息
 *
 * @author ${param.author}
 */
@Table(name = "b_dept_info")
@SuppressWarnings("serial")
public class BDeptInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 公司id, 数据库字段：company_id */
    private String company_id;

    /** 部门名称, 数据库字段：name */
    private String name;

    /** 部门编号, 数据库字段：dept_code */
    private String dept_code;

    /** 简介, 数据库字段：intro */
    private String intro;

    /** 父分类编号, 数据库字段：p_dept_no */
    private String p_dept_no;

    /** 权重, 数据库字段：weight */
    private Integer weight;

    /** 附加信息, 数据库字段：addition_info */
    private String addition_info;

    /** 部门索引 存储该部门的所有父部门, 数据库字段：dept_index */
    private String dept_index;

    /** 是否删除 1删除0正常, 数据库字段：is_delete */
    private String is_delete;

    /** 创建人, 数据库字段：create_by */
    private String create_by;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 更新人, 数据库字段：update_by */
    private String update_by;

    /** 更新时间, 数据库字段：update_time */
    private Date update_time;

    /** 设置id, 数据库字段：b_dept_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_dept_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置公司id, 数据库字段：b_dept_info.company_id */
    public void setCompany_id(String company_id) {
        this.company_id = company_id;
    }

    /** 获取公司id, 数据库字段：b_dept_info.company_id */
    public String getCompany_id() {
        return this.company_id;
    }

    /** 设置部门名称, 数据库字段：b_dept_info.name */
    public void setName(String name) {
        this.name = name;
    }

    /** 获取部门名称, 数据库字段：b_dept_info.name */
    public String getName() {
        return this.name;
    }

    /** 设置部门编号, 数据库字段：b_dept_info.dept_code */
    public void setDept_code(String dept_code) {
        this.dept_code = dept_code;
    }

    /** 获取部门编号, 数据库字段：b_dept_info.dept_code */
    public String getDept_code() {
        return this.dept_code;
    }

    /** 设置简介, 数据库字段：b_dept_info.intro */
    public void setIntro(String intro) {
        this.intro = intro;
    }

    /** 获取简介, 数据库字段：b_dept_info.intro */
    public String getIntro() {
        return this.intro;
    }

    /** 设置父分类编号, 数据库字段：b_dept_info.p_dept_no */
    public void setP_dept_no(String p_dept_no) {
        this.p_dept_no = p_dept_no;
    }

    /** 获取父分类编号, 数据库字段：b_dept_info.p_dept_no */
    public String getP_dept_no() {
        return this.p_dept_no;
    }

    /** 设置权重, 数据库字段：b_dept_info.weight */
    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    /** 获取权重, 数据库字段：b_dept_info.weight */
    public Integer getWeight() {
        return this.weight;
    }

    /** 设置附加信息, 数据库字段：b_dept_info.addition_info */
    public void setAddition_info(String addition_info) {
        this.addition_info = addition_info;
    }

    /** 获取附加信息, 数据库字段：b_dept_info.addition_info */
    public String getAddition_info() {
        return this.addition_info;
    }

    /** 设置部门索引 存储该部门的所有父部门, 数据库字段：b_dept_info.dept_index */
    public void setDept_index(String dept_index) {
        this.dept_index = dept_index;
    }

    /** 获取部门索引 存储该部门的所有父部门, 数据库字段：b_dept_info.dept_index */
    public String getDept_index() {
        return this.dept_index;
    }

    /** 设置是否删除 1删除0正常, 数据库字段：b_dept_info.is_delete */
    public void setIs_delete(String is_delete) {
        this.is_delete = is_delete;
    }

    /** 获取是否删除 1删除0正常, 数据库字段：b_dept_info.is_delete */
    public String getIs_delete() {
        return this.is_delete;
    }

    /** 设置创建人, 数据库字段：b_dept_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_dept_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_dept_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_dept_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_dept_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_dept_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_dept_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_dept_info.update_time */
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

        BDeptInfo other = (BDeptInfo) obj;

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
        sb.append("BDeptInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("company_id=").append(company_id);
        sb.append(", ");
        sb.append("name=").append(name);
        sb.append(", ");
        sb.append("dept_code=").append(dept_code);
        sb.append(", ");
        sb.append("intro=").append(intro);
        sb.append(", ");
        sb.append("p_dept_no=").append(p_dept_no);
        sb.append(", ");
        sb.append("weight=").append(weight);
        sb.append(", ");
        sb.append("addition_info=").append(addition_info);
        sb.append(", ");
        sb.append("dept_index=").append(dept_index);
        sb.append(", ");
        sb.append("is_delete=").append(is_delete);
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
