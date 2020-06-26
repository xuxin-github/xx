package com.fd.fhtmid.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 表名：b_test
 *
 * @author ${param.author}
 */
@Table(name = "b_test")
@SuppressWarnings("serial")
public class BTest {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    /**  数据库字段：id */
    private String id;

    /**  数据库字段：name */
    private String name;

    /**  数据库字段：address */
    private String address;

    /**  数据库字段：b_test.id */
    public void setId(String id) {
        this.id = id;
    }

    /**  数据库字段：b_test.id */
    public String getId() {
        return this.id;
    }

    /**  数据库字段：b_test.name */
    public void setName(String name) {
        this.name = name;
    }

    /**  数据库字段：b_test.name */
    public String getName() {
        return this.name;
    }

    /**  数据库字段：b_test.address */
    public void setAddress(String address) {
        this.address = address;
    }

    /**  数据库字段：b_test.address */
    public String getAddress() {
        return this.address;
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

        BTest other = (BTest) obj;

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
        sb.append("BTest [");
        sb.append("id=").append(id);
        sb.append(", ");
        sb.append("name=").append(name);
        sb.append(", ");
        sb.append("address=").append(address);
        sb.append("]");

        return sb.toString();
    }
}
