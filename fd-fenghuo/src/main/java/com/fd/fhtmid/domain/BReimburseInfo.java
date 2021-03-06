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
 * 表名：b_reimburse_info
 * 备注：
 *
 * @author ${param.author}
 */
@Table(name = "b_reimburse_info")
@SuppressWarnings("serial")
public class BReimburseInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 报销编号, 数据库字段：code */
    private String code;

    /** 人员id, 数据库字段：user_id */
    private String user_id;

    /** 报销类别, 数据库字段：type */
    private String type;

    /** 报销金额, 数据库字段：money */
    private BigDecimal money;

    /** 备注说明, 数据库字段：note */
    private String note;

    /** 附件文件, 数据库字段：files */
    private String files;

    /** 审核状态 null未初始化，0待审核，1通过，2驳回, 数据库字段：status */
    private String status;

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

    /** 设置id, 数据库字段：b_reimburse_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_reimburse_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置报销编号, 数据库字段：b_reimburse_info.code */
    public void setCode(String code) {
        this.code = code;
    }

    /** 获取报销编号, 数据库字段：b_reimburse_info.code */
    public String getCode() {
        return this.code;
    }

    /** 设置人员id, 数据库字段：b_reimburse_info.user_id */
    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    /** 获取人员id, 数据库字段：b_reimburse_info.user_id */
    public String getUser_id() {
        return this.user_id;
    }

    /** 设置报销类别, 数据库字段：b_reimburse_info.type */
    public void setType(String type) {
        this.type = type;
    }

    /** 获取报销类别, 数据库字段：b_reimburse_info.type */
    public String getType() {
        return this.type;
    }

    /** 设置报销金额, 数据库字段：b_reimburse_info.money */
    public void setMoney(BigDecimal money) {
        this.money = money;
    }

    /** 获取报销金额, 数据库字段：b_reimburse_info.money */
    public BigDecimal getMoney() {
        return this.money;
    }

    /** 设置备注说明, 数据库字段：b_reimburse_info.note */
    public void setNote(String note) {
        this.note = note;
    }

    /** 获取备注说明, 数据库字段：b_reimburse_info.note */
    public String getNote() {
        return this.note;
    }

    /** 设置附件文件, 数据库字段：b_reimburse_info.files */
    public void setFiles(String files) {
        this.files = files;
    }

    /** 获取附件文件, 数据库字段：b_reimburse_info.files */
    public String getFiles() {
        return this.files;
    }

    /** 设置审核状态 null未初始化，0待审核，1通过，2驳回, 数据库字段：b_reimburse_info.status */
    public void setStatus(String status) {
        this.status = status;
    }

    /** 获取审核状态 null未初始化，0待审核，1通过，2驳回, 数据库字段：b_reimburse_info.status */
    public String getStatus() {
        return this.status;
    }

    /** 设置是否删除 1删除0正常, 数据库字段：b_reimburse_info.is_delete */
    public void setIs_delete(String is_delete) {
        this.is_delete = is_delete;
    }

    /** 获取是否删除 1删除0正常, 数据库字段：b_reimburse_info.is_delete */
    public String getIs_delete() {
        return this.is_delete;
    }

    /** 设置创建人, 数据库字段：b_reimburse_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_reimburse_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_reimburse_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_reimburse_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_reimburse_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_reimburse_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_reimburse_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_reimburse_info.update_time */
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

        BReimburseInfo other = (BReimburseInfo) obj;

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
        sb.append("BReimburseInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("code=").append(code);
        sb.append(", ");
        sb.append("user_id=").append(user_id);
        sb.append(", ");
        sb.append("type=").append(type);
        sb.append(", ");
        sb.append("money=").append(money);
        sb.append(", ");
        sb.append("note=").append(note);
        sb.append(", ");
        sb.append("files=").append(files);
        sb.append(", ");
        sb.append("status=").append(status);
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
