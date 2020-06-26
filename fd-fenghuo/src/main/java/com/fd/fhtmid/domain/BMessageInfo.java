package com.fd.fhtmid.domain;

import java.io.Serializable;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_message_info
 * 备注：
 *
 * @author ${param.author}
 */
@Table(name = "b_message_info")
@SuppressWarnings("serial")
public class BMessageInfo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /** id, 数据库字段：id */
    private String id;

    /** 消息内容, 数据库字段：content */
    private String content;

    /** 创建时间, 数据库字段：create_time */
    private Date create_time;

    /** 设置id, 数据库字段：b_message_info.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：b_message_info.id */
    public String getId() {
        return this.id;
    }

    /** 设置消息内容, 数据库字段：b_message_info.content */
    public void setContent(String content) {
        this.content = content;
    }

    /** 获取消息内容, 数据库字段：b_message_info.content */
    public String getContent() {
        return this.content;
    }

    /** 设置创建时间, 数据库字段：b_message_info.create_time */
    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    /** 获取创建时间, 数据库字段：b_message_info.create_time */
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

        BMessageInfo other = (BMessageInfo) obj;

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
        sb.append("BMessageInfo [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("content=").append(content);
        sb.append(", ");
        sb.append("create_time=").append(create_time);
        sb.append("]");

        return sb.toString();
    }
}
