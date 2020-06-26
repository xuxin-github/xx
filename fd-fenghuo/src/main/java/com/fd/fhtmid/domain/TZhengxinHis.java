package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：t_zhengxin_his
 * 备注：
 *
 * @author ${param.author}
 */
@Table(name = "t_zhengxin_his")
@SuppressWarnings("serial")
public class TZhengxinHis {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 报文, 数据库字段：json_txt */
    private String json_txt;

    /**  数据库字段：request_sn */
    private String request_sn;

    /**  数据库字段：response_sn */
    private String response_sn;

    /**  数据库字段：fun_code */
    private String fun_code;

    /**  数据库字段：rtn_code */
    private String rtn_code;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 设置id, 数据库字段：t_zhengxin_his.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：t_zhengxin_his.id */
    public String getId() {
        return this.id;
    }

    /** 设置报文, 数据库字段：t_zhengxin_his.json_txt */
    public void setJson_txt(String json_txt) {
        this.json_txt = json_txt;
    }

    /** 获取报文, 数据库字段：t_zhengxin_his.json_txt */
    public String getJson_txt() {
        return this.json_txt;
    }

    /**  数据库字段：t_zhengxin_his.request_sn */
    public void setRequest_sn(String request_sn) {
        this.request_sn = request_sn;
    }

    /**  数据库字段：t_zhengxin_his.request_sn */
    public String getRequest_sn() {
        return this.request_sn;
    }

    /**  数据库字段：t_zhengxin_his.response_sn */
    public void setResponse_sn(String response_sn) {
        this.response_sn = response_sn;
    }

    /**  数据库字段：t_zhengxin_his.response_sn */
    public String getResponse_sn() {
        return this.response_sn;
    }

    /**  数据库字段：t_zhengxin_his.fun_code */
    public void setFun_code(String fun_code) {
        this.fun_code = fun_code;
    }

    /**  数据库字段：t_zhengxin_his.fun_code */
    public String getFun_code() {
        return this.fun_code;
    }

    /**  数据库字段：t_zhengxin_his.rtn_code */
    public void setRtn_code(String rtn_code) {
        this.rtn_code = rtn_code;
    }

    /**  数据库字段：t_zhengxin_his.rtn_code */
    public String getRtn_code() {
        return this.rtn_code;
    }

    /** 设置创建时间, 数据库字段：t_zhengxin_his.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：t_zhengxin_his.create_time */
    public Date getCreate_time() {
        return this.create_time;
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

        TZhengxinHis other = (TZhengxinHis) obj;

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
        sb.append("TZhengxinHis [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("json_txt=").append(json_txt);
        sb.append(", ");
        sb.append("request_sn=").append(request_sn);
        sb.append(", ");
        sb.append("response_sn=").append(response_sn);
        sb.append(", ");
        sb.append("fun_code=").append(fun_code);
        sb.append(", ");
        sb.append("rtn_code=").append(rtn_code);
        sb.append(", ");
        sb.append("create_time=").append(create_time);
        sb.append("]");

        return sb.toString();
    }
}
