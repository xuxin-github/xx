/**
 * 
 */
package com.fd.fhtmid.common.constant;

/**
 * @author Administrator
 *
 */
public class FileServiceConstant {

    public static final String THUMBNAIL_PATH = "thumbnail";
    
    public static final String[] THUMBNAIL_ABLE_MIMETYPES = {
        "image/jpeg", "image/jpg", "image/bmp", "image/png", "image/x-png", 
    };
    
    public static final int THUMBNAIL_WIDTH = 720;
    
//    public static final int THUMBNAIL_HEIGHT = 200;
    
    public static final String TEMP_PATH = "temp";
    
    public static final long OSS_URL_VALIDATION_LENGTH = 3600 * 1000;
    
    public static final int SERVICE_ERROR = 99;
    
    /**
     * 
     */
    protected FileServiceConstant() {
        // TODO Auto-generated constructor stub
    }

}
