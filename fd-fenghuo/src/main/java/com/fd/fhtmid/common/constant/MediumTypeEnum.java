/**
 * 
 */
package com.fd.fhtmid.common.constant;

/**
 * @author Administrator
 *
 */
public enum MediumTypeEnum {
    
    LOCAL(1, "本地"),
    
    OSS(2, "OSS"),
    
    ;
    
    private int code;

    private String name;

    MediumTypeEnum(int code, String name) {
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
    
    public static MediumTypeEnum fetchByCode(int code) {
        switch (code) {
            case 1:
                return LOCAL;
            case 2:
                return OSS;
        }
        
        return null;
    }
    
}
