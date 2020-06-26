package com.fd.fhtmid.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：m_fl_file
 * 备注：文件微服务
 */
@Table(name = "m_fl_file")
public class MFlFile {
    @Id
    @Column(name = "id")
    @GeneratedValue(generator = "system-uuid")
    /** id, 数据库字段：id */
    private String id;

    /** 文件名, 数据库字段：name */
    private String name;

    /** 存储介质类型 1=本地，2=OSS, 数据库字段：medium_type */
    private Integer mediumType;

    /** 文件mimeType 文件mimeType, 数据库字段：mime_type */
    private String mimeType;

    /** 文件分类，将用作存储路径, 数据库字段：category */
    private String category;

    /** 文件大小, 数据库字段：size */
    private Integer size;

    /** 存储内容 （本地存储路径或OSS文件key）, 数据库字段：content */
    private String content;

    /** 状态 0=暂存temporary，1=持久permanent, 数据库字段：status */
    private Integer status;

    /** 是否删除 1=删除, 数据库字段：deleted */
    @com.gitee.fastmybatis.core.annotation.LogicDelete
    private String deleted;

    /** 创建人, 数据库字段：create_by */
    private String createBy;

    /** 创建时间, 数据库字段：create_time */
    private Date createTime;

    /** 更新人, 数据库字段：update_by */
    private String updateBy;

    /** 更新时间, 数据库字段：update_time */
    private Date updateTime;
    
    private transient String base64Data;
    
    private transient String url;
    

    /** 设置id, 数据库字段：m_fl_file.id */
    public void setId(String id) {
        this.id = id;
    }

    /** 获取id, 数据库字段：m_fl_file.id */
    public String getId() {
        return this.id;
    }

    /** 设置文件名, 数据库字段：m_fl_file.name */
    public void setName(String name) {
        this.name = name;
    }

    /** 获取文件名, 数据库字段：m_fl_file.name */
    public String getName() {
        return this.name;
    }

    /** 设置存储介质类型 1=本地，2=OSS, 数据库字段：m_fl_file.medium_type */
    public void setMediumType(Integer mediumType) {
        this.mediumType = mediumType;
    }

    /** 获取存储介质类型 1=本地，2=OSS, 数据库字段：m_fl_file.medium_type */
    public Integer getMediumType() {
        return this.mediumType;
    }

    /** 设置文件mimeType 文件mimeType, 数据库字段：m_fl_file.mime_type */
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    /** 获取文件mimeType 文件mimeType, 数据库字段：m_fl_file.mime_type */
    public String getMimeType() {
        return this.mimeType;
    }

    /** 设置文件分类，将用作存储路径, 数据库字段：m_fl_file.category */
    public void setCategory(String category) {
        this.category = category;
    }

    /** 获取文件分类，将用作存储路径, 数据库字段：m_fl_file.category */
    public String getCategory() {
        return this.category;
    }

    /** 设置文件大小, 数据库字段：m_fl_file.size */
    public void setSize(Integer size) {
        this.size = size;
    }

    /** 获取文件大小, 数据库字段：m_fl_file.size */
    public Integer getSize() {
        return this.size;
    }

    /** 设置存储内容 （本地存储路径或OSS文件key）, 数据库字段：m_fl_file.content */
    public void setContent(String content) {
        this.content = content;
    }

    /** 获取存储内容 （本地存储路径或OSS文件key）, 数据库字段：m_fl_file.content */
    public String getContent() {
        return this.content;
    }

    /** 设置状态 0=暂存temporary，1=持久permanent, 数据库字段：m_fl_file.status */
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 获取状态 0=暂存temporary，1=持久permanent, 数据库字段：m_fl_file.status */
    public Integer getStatus() {
        return this.status;
    }

    /** 设置是否删除 1=删除, 数据库字段：m_fl_file.deleted */
    public void setDeleted(String deleted) {
        this.deleted = deleted;
    }

    /** 获取是否删除 1=删除, 数据库字段：m_fl_file.deleted */
    public String getDeleted() {
        return this.deleted;
    }

    /** 设置创建人, 数据库字段：m_fl_file.create_by */
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /** 获取创建人, 数据库字段：m_fl_file.create_by */
    public String getCreateBy() {
        return this.createBy;
    }

    /** 设置创建时间, 数据库字段：m_fl_file.create_time */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /** 获取创建时间, 数据库字段：m_fl_file.create_time */
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 设置更新人, 数据库字段：m_fl_file.update_by */
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /** 获取更新人, 数据库字段：m_fl_file.update_by */
    public String getUpdateBy() {
        return this.updateBy;
    }

    /** 设置更新时间, 数据库字段：m_fl_file.update_time */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    /** 获取更新时间, 数据库字段：m_fl_file.update_time */
    public Date getUpdateTime() {
        return this.updateTime;
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

        MFlFile other = (MFlFile) obj;

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
        sb.append("MFlFile [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("name=").append(name);
        sb.append(", ");
        sb.append("mediumType=").append(mediumType);
        sb.append(", ");
        sb.append("mimeType=").append(mimeType);
        sb.append(", ");
        sb.append("category=").append(category);
        sb.append(", ");
        sb.append("size=").append(size);
        sb.append(", ");
        sb.append("content=").append(content);
        sb.append(", ");
        sb.append("status=").append(status);
        sb.append(", ");
        sb.append("deleted=").append(deleted);
        sb.append(", ");
        sb.append("createBy=").append(createBy);
        sb.append(", ");
        sb.append("createTime=").append(createTime);
        sb.append(", ");
        sb.append("updateBy=").append(updateBy);
        sb.append(", ");
        sb.append("updateTime=").append(updateTime);
        sb.append("]");

        return sb.toString();
    }

    public String getBase64Data() {
        return base64Data;
    }

    public void setBase64Data(String base64Data) {
        this.base64Data = base64Data;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
