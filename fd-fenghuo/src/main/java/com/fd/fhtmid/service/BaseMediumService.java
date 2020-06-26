/**
 * 
 */
package com.fd.fhtmid.service;

import java.util.Map;

import com.fd.fhtmid.domain.MFlFile;

/**
 * @author jack
 *
 */
public interface BaseMediumService {

	public Map writeBase64(String name, String category, String base64Data) throws Exception;
	
	public String readAsBase64(MFlFile fileBean) throws Exception;
	
	public String thumbnailAsBase64(MFlFile fileBean) throws Exception;
	
	public String thumbnailAsPath(MFlFile fileBean) throws Exception;
	
	public boolean deleteByPath(String filePath) throws Exception;
    
    
}
