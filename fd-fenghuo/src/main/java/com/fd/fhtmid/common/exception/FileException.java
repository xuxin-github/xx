/**
 * 
 */
package com.fd.fhtmid.common.exception;



/**
 * @author Administrator
 *
 */
public class FileException extends BizException {
    
    /**
     * 
     */
    private static final long serialVersionUID = -5942907549929320729L;

    public static final FileException NULL_DATA_ERROR = new FileException(10050001, "文件服务错误: 文件数据空", "");

    public static final FileException BASE64_DATA_ERROR = new FileException(10050002, "文件服务错误: BASE64文件数据错误", "");
    
    public static final FileException MEDIUM_TYPE_ERROR = new FileException(10050003, "文件服务错误: 不支持存储介质类型", "");
    
    public static final FileException FILEBEAN_STATUS_ERROR = new FileException(10050004, "文件服务错误: 文件记录不存在或状态错误", "");
    
    public static final FileException LOCAL_WRITE_ERROR = new FileException(10050011, "文件服务错误: 保存本地文件失败", "");
    
    public static final FileException LOCAL_READ_ERROR = new FileException(10050012, "文件服务错误: 读取本地文件失败", "");
    
    public static final FileException LOCAL_OTHER_ERROR = new FileException(10050012, "文件服务错误: 本地文件操作错误", "");
    
    public static final FileException OSS_WRITE_ERROR = new FileException(10050021, "文件服务错误: 上传OSS文件失败", "");
    
    public static final FileException OSS_READ_ERROR = new FileException(10050022, "文件服务错误: 下载OSS文件失败", "");
    
    public static final FileException OSS_OTHER_ERROR = new FileException(10050029, "文件服务错误: OSS文件操作错误", "");
    
    public static final FileException DB_ERROR = new FileException(10055000, "文件服务错误: 数据库操作错误", "");
    
    public static final FileException OTHER_ERROR = new FileException(10059999, "文件服务执行错误", "");
    
    private String msgFormat;
    
    /**
     * @param code
     * @param msgFormat
     * @param args
     */
    public FileException(int code, String msgFormat, Object... args) {
        super(code, msgFormat, args);
        // TODO Auto-generated constructor stub
        
        this.msgFormat = msgFormat;
    }

    /**
     * 
     */
    public FileException() {
        // TODO Auto-generated constructor stub
    }

    /**
     * @param message
     * @param cause
     */
    public FileException(String message, Throwable cause) {
        super(message, cause);
        // TODO Auto-generated constructor stub
    }

    /**
     * @param cause
     */
    public FileException(Throwable cause) {
        super(cause);
        // TODO Auto-generated constructor stub
    }

    /**
     * @param message
     */
    public FileException(String message) {
        super(message);
        // TODO Auto-generated constructor stub
    }

    public void fillIn(Exception ex) {
        this.msg = String.format(this.msgFormat, ex.getMessage() != null ? ex.getMessage() : ex.getCause().getMessage());
    }

    public void fillIn(String msg) {
        this.msg = String.format(this.msgFormat, msg);
    }

    public String toJsonString() {
        return ("{\"code\":" + this.code + ",\"msg\":\"" + this.msg + "\"}");
    }
    
}
