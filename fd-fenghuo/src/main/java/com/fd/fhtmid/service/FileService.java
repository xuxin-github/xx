/**
 * 
 */
package com.fd.fhtmid.service;

import com.fd.fhtmid.domain.MFlFile;

/**
 * @author jack
 *
 */
public interface FileService {

    
	public MFlFile writeBase64(int mediumType, String name, String category, String base64Data, int status) throws Exception;
	
//	public String writeBase64ToLocal(String name, String category, String base64Data, int status) throws FileException;
//	
//	public String writeBase64ToOss(String name, String category, String base64Data, int status) throws FileException;
	
	public MFlFile readAsBase64(String id) throws Exception;
	
	public MFlFile readAsUrl(String id) throws Exception;
	
	public MFlFile readAsPath(String id) throws Exception;
	
	public MFlFile thumbnailAsBase64(String id) throws Exception;
    
    public MFlFile thumbnailAsUrl(String id) throws Exception;

    public MFlFile thumbnailAsPath(String id) throws Exception;
    
    public int persistent(String id) throws Exception;
    
    public int delete(String id) throws Exception;
    
    
}
