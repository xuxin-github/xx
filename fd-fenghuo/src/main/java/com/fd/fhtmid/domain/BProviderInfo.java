package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_provider_info
 * 备注：供应商信息
 *
 * @author ${param.author}
 */
@Table(name = "b_provider_info")
@SuppressWarnings("serial")
public class BProviderInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 企业名称, 数据库字段：name */
    private String name;

    /** 股东, 数据库字段：stockholder */
    private String stockholder;

    /** 企业注册号, 数据库字段：reg_code */
    private String reg_code;

    /** 企业信息更新时间, 数据库字段：ent_update_time */
    private String ent_update_time;

    /** 供应商评分, 数据库字段：score */
    private Integer score;

    /** 是否合法企业, 数据库字段：is_legal */
    private String is_legal;

    /** 企业注册日期, 数据库字段：reg_date */
    private Date reg_date;

    /** 企业注册资本, 数据库字段：reg_capital */
    private String reg_capital;

    /** 受惩黑名单 {count:100,list:[{id,name,title,p_time}]}, 数据库字段：xzhmd */
    private String xzhmd;

    /** 执行公告 [{id,name,title,p_time}], 数据库字段：zxgg */
    private String zxgg;

    /** 失信公告 [{id,name,title,p_time}], 数据库字段：shixin */
    private String shixin;

    /** 曝光台 [{id,name,title,p_time}], 数据库字段：bgt */
    private String bgt;

    /** 创建人, 数据库字段：create_by */
    private String create_by;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 更新人, 数据库字段：update_by */
    private String update_by;

    /** 更新时间, 数据库字段：update_time */
    private Date update_time;

    /** 设置id, 数据库字段：b_provider_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_provider_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置企业名称, 数据库字段：b_provider_info.name */
    public void setName(String name) {
        this.name = name;
    }

    /** 获取企业名称, 数据库字段：b_provider_info.name */
    public String getName() {
        return this.name;
    }

    /** 设置股东, 数据库字段：b_provider_info.stockholder */
    public void setStockholder(String stockholder) {
        this.stockholder = stockholder;
    }

    /** 获取股东, 数据库字段：b_provider_info.stockholder */
    public String getStockholder() {
        return this.stockholder;
    }

    /** 设置企业注册号, 数据库字段：b_provider_info.reg_code */
    public void setReg_code(String reg_code) {
        this.reg_code = reg_code;
    }

    /** 获取企业注册号, 数据库字段：b_provider_info.reg_code */
    public String getReg_code() {
        return this.reg_code;
    }

    /** 设置企业信息更新时间, 数据库字段：b_provider_info.ent_update_time */
    public void setEnt_update_time(String ent_update_time) {
        this.ent_update_time = ent_update_time;
    }

    /** 获取企业信息更新时间, 数据库字段：b_provider_info.ent_update_time */
    public String getEnt_update_time() {
        return this.ent_update_time;
    }

    /** 设置供应商评分, 数据库字段：b_provider_info.score */
    public void setScore(Integer score) {
        this.score = score;
    }

    /** 获取供应商评分, 数据库字段：b_provider_info.score */
    public Integer getScore() {
        return this.score;
    }

    /** 设置是否合法企业, 数据库字段：b_provider_info.is_legal */
    public void setIs_legal(String is_legal) {
        this.is_legal = is_legal;
    }

    /** 获取是否合法企业, 数据库字段：b_provider_info.is_legal */
    public String getIs_legal() {
        return this.is_legal;
    }

    /** 设置企业注册日期, 数据库字段：b_provider_info.reg_date */
    public void setReg_date(Date reg_date) {
        this.reg_date = reg_date;
    }

    /** 获取企业注册日期, 数据库字段：b_provider_info.reg_date */
    public Date getReg_date() {
        return this.reg_date;
    }

    /** 设置企业注册资本, 数据库字段：b_provider_info.reg_capital */
    public void setReg_capital(String reg_capital) {
        this.reg_capital = reg_capital;
    }

    /** 获取企业注册资本, 数据库字段：b_provider_info.reg_capital */
    public String getReg_capital() {
        return this.reg_capital;
    }

    /** 设置受惩黑名单 {count:100,list:[{id,name,title,p_time}]}, 数据库字段：b_provider_info.xzhmd */
    public void setXzhmd(String xzhmd) {
        this.xzhmd = xzhmd;
    }

    /** 获取受惩黑名单 {count:100,list:[{id,name,title,p_time}]}, 数据库字段：b_provider_info.xzhmd */
    public String getXzhmd() {
        return this.xzhmd;
    }

    /** 设置执行公告 [{id,name,title,p_time}], 数据库字段：b_provider_info.zxgg */
    public void setZxgg(String zxgg) {
        this.zxgg = zxgg;
    }

    /** 获取执行公告 [{id,name,title,p_time}], 数据库字段：b_provider_info.zxgg */
    public String getZxgg() {
        return this.zxgg;
    }

    /** 设置失信公告 [{id,name,title,p_time}], 数据库字段：b_provider_info.shixin */
    public void setShixin(String shixin) {
        this.shixin = shixin;
    }

    /** 获取失信公告 [{id,name,title,p_time}], 数据库字段：b_provider_info.shixin */
    public String getShixin() {
        return this.shixin;
    }

    /** 设置曝光台 [{id,name,title,p_time}], 数据库字段：b_provider_info.bgt */
    public void setBgt(String bgt) {
        this.bgt = bgt;
    }

    /** 获取曝光台 [{id,name,title,p_time}], 数据库字段：b_provider_info.bgt */
    public String getBgt() {
        return this.bgt;
    }

    /** 设置创建人, 数据库字段：b_provider_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_provider_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_provider_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_provider_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_provider_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_provider_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_provider_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_provider_info.update_time */
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

        BProviderInfo other = (BProviderInfo) obj;

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
        sb.append("BProviderInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("name=").append(name);
        sb.append(", ");
        sb.append("stockholder=").append(stockholder);
        sb.append(", ");
        sb.append("reg_code=").append(reg_code);
        sb.append(", ");
        sb.append("ent_update_time=").append(ent_update_time);
        sb.append(", ");
        sb.append("score=").append(score);
        sb.append(", ");
        sb.append("is_legal=").append(is_legal);
        sb.append(", ");
        sb.append("reg_date=").append(reg_date);
        sb.append(", ");
        sb.append("reg_capital=").append(reg_capital);
        sb.append(", ");
        sb.append("xzhmd=").append(xzhmd);
        sb.append(", ");
        sb.append("zxgg=").append(zxgg);
        sb.append(", ");
        sb.append("shixin=").append(shixin);
        sb.append(", ");
        sb.append("bgt=").append(bgt);
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