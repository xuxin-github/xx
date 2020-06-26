package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_market_info
 * 备注：
 *
 * @author ${param.author}
 */
@Table(name = "b_market_info")
@SuppressWarnings("serial")
public class BMarketInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 处罚文书书号, 数据库字段：name */
    private String name;

    /** 违法行为类型, 数据库字段：type */
    private String type;

    /** 案件当事人, 数据库字段：party */
    private String party;

    /** 处罚结果, 数据库字段：result */
    private String result;

    /** 处罚作出日期, 数据库字段：date */
    private Date date;

    /** 违法行为类型细分, 数据库字段：type_subsection */
    private String type_subsection;

    /** 违法行为具体类型, 数据库字段：specific_type */
    private String specific_type;

    /** 是否发布 01发布02未发布, 数据库字段：is_release */
    private String is_release;

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

    /** 设置id, 数据库字段：b_market_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_market_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置处罚文书书号, 数据库字段：b_market_info.name */
    public void setName(String name) {
        this.name = name;
    }

    /** 获取处罚文书书号, 数据库字段：b_market_info.name */
    public String getName() {
        return this.name;
    }

    /** 设置违法行为类型, 数据库字段：b_market_info.type */
    public void setType(String type) {
        this.type = type;
    }

    /** 获取违法行为类型, 数据库字段：b_market_info.type */
    public String getType() {
        return this.type;
    }

    /** 设置案件当事人, 数据库字段：b_market_info.party */
    public void setParty(String party) {
        this.party = party;
    }

    /** 获取案件当事人, 数据库字段：b_market_info.party */
    public String getParty() {
        return this.party;
    }

    /** 设置处罚结果, 数据库字段：b_market_info.result */
    public void setResult(String result) {
        this.result = result;
    }

    /** 获取处罚结果, 数据库字段：b_market_info.result */
    public String getResult() {
        return this.result;
    }

    /** 设置处罚作出日期, 数据库字段：b_market_info.date */
    public void setDate(Date date) {
        this.date = date;
    }

    /** 获取处罚作出日期, 数据库字段：b_market_info.date */
    public Date getDate() {
        return this.date;
    }

    /** 设置违法行为类型细分, 数据库字段：b_market_info.type_subsection */
    public void setType_subsection(String type_subsection) {
        this.type_subsection = type_subsection;
    }

    /** 获取违法行为类型细分, 数据库字段：b_market_info.type_subsection */
    public String getType_subsection() {
        return this.type_subsection;
    }

    /** 设置违法行为具体类型, 数据库字段：b_market_info.specific_type */
    public void setSpecific_type(String specific_type) {
        this.specific_type = specific_type;
    }

    /** 获取违法行为具体类型, 数据库字段：b_market_info.specific_type */
    public String getSpecific_type() {
        return this.specific_type;
    }

    /** 设置是否发布 01发布02未发布, 数据库字段：b_market_info.is_release */
    public void setIs_release(String is_release) {
        this.is_release = is_release;
    }

    /** 获取是否发布 01发布02未发布, 数据库字段：b_market_info.is_release */
    public String getIs_release() {
        return this.is_release;
    }

    /** 设置是否删除 1删除0正常, 数据库字段：b_market_info.is_delete */
    public void setIs_delete(String is_delete) {
        this.is_delete = is_delete;
    }

    /** 获取是否删除 1删除0正常, 数据库字段：b_market_info.is_delete */
    public String getIs_delete() {
        return this.is_delete;
    }

    /** 设置创建人, 数据库字段：b_market_info.create_by */
    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    /** 获取创建人, 数据库字段：b_market_info.create_by */
    public String getCreate_by() {
        return this.create_by;
    }

    /** 设置创建时间, 数据库字段：b_market_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_market_info.create_time */
    public Date getCreate_time() {
        return this.create_time;
    }

    /** 设置更新人, 数据库字段：b_market_info.update_by */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }

    /** 获取更新人, 数据库字段：b_market_info.update_by */
    public String getUpdate_by() {
        return this.update_by;
    }

    /** 设置更新时间, 数据库字段：b_market_info.update_time */
    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    /** 获取更新时间, 数据库字段：b_market_info.update_time */
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

        BMarketInfo other = (BMarketInfo) obj;

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
        sb.append("BMarketInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("name=").append(name);
        sb.append(", ");
        sb.append("type=").append(type);
        sb.append(", ");
        sb.append("party=").append(party);
        sb.append(", ");
        sb.append("result=").append(result);
        sb.append(", ");
        sb.append("date=").append(date);
        sb.append(", ");
        sb.append("type_subsection=").append(type_subsection);
        sb.append(", ");
        sb.append("specific_type=").append(specific_type);
        sb.append(", ");
        sb.append("is_release=").append(is_release);
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
