/**
 * 
 */
package com.fd.fhtmid.common.constant;

/**
 * @author Administrator
 *
 */
public enum StatusEnum {
    
    TEMPORARY(0, "临时"),
    
    PERMANENT(1, "永久"),
    
    ;
    
    private int code;

    private String name;

    StatusEnum(int code, String name) {
        this.code = code;
        this.name = name;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public static StatusEnum fetchByCode(int code) {
        switch (code) {
            case 0:
                return TEMPORARY;
            case 1:
                return PERMANENT;
        }
        
        return null;
    }
    
}
