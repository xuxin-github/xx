/**
 * 
 */
package com.fd.fhtmid.service;

import com.fd.fhtmid.domain.MFlFile;

/**
 * @author jack
 *
 */
public interface OssService extends BaseMediumService {

    
	public String readAsUrl(MFlFile fileBean) throws Exception;
	
    public String thumbnailAsUrl(MFlFile fileBean) throws Exception;
    
    
}
