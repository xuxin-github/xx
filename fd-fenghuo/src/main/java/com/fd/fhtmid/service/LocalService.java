/**
 * 
 */
package com.fd.fhtmid.service;

/**
 * @author jack
 *
 */
public interface LocalService extends BaseMediumService {

    public java.io.File writeFile(byte[] data, String filePath) throws Exception;
    
//    public boolean deleteFile(String filePath) throws Exception;
    
}
