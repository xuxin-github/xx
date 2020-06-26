/**
 * 
 */
package com.fd.fhtmid.service.impl;

import java.util.Date;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fd.fhtmid.common.constant.FileServiceConstant;
import com.fd.fhtmid.common.constant.MediumTypeEnum;
import com.fd.fhtmid.common.constant.StatusEnum;
import com.fd.fhtmid.common.exception.FileException;
import com.fd.fhtmid.domain.MFlFile;
import com.fd.fhtmid.service.FileService;
import com.fd.fhtmid.service.LocalService;
import com.fd.fhtmid.service.OssService;
import com.fd.fhtmid.mapper.MFlFileMapper;

/**
 * @author jack
 *
 */
@Service
@Transactional
public class FileServiceImpl implements FileService {

    private static final Logger logger = LoggerFactory.getLogger(FileServiceImpl.class);
    
//    private static final String THUMBNAIL_PATH = "thumbnail";
//    
//    private static final String[] THUMBNAIL_ABLE_MIMETYPES = {
//        "image/jpeg", "image/jpg", "image/bmp", "image/png", "image/x-png", 
//    };
//    
//    private static final int THUMBNAIL_WIDTH = 720;
//    
////    private static final int THUMBNAIL_HEIGHT = 200;
//    
//    private static final String TEMP_PATH = "temp";
//    
//    private static final long OSS_URL_VALIDATION_LENGTH = 3600 * 1000;
//    
//
//    @Value("${local.file.path}")
//    private String localFilePath;
//    
////    @Value("${oss.file.path}")
////    private String ossFilePath;
//    
//    @Value("${oss.endPoint}")
//    private String ossEndPoint;
//    
//    @Value("${oss.accessKeyId}")
//    private String ossAccessKeyId;
//    
//    @Value("${oss.accessKeySecret}")
//    private String ossAccessKeySecret;
//    
//    @Value("${oss.bucketName}")
//    private String ossBucketName;// = "bcis";
    
//    @Autowired
//    private FileMapper fileMapper;
    
    @Autowired
    private MFlFileMapper fileMapper;

    @Autowired
    private LocalService localService;

    @Autowired
    private OssService ossService;
    
    private MFlFile addFileBean(String name, int mediumType, String mimeType, String category, int size, String content, int status) throws Exception {
//        String id = UUID.randomUUID().toString();
//        File fileBean = new File();
        
        MFlFile fileBean = new MFlFile();
//        fileBean.setId(id);
        fileBean.setName(name);
        fileBean.setMediumType(mediumType);
        fileBean.setMimeType(mimeType);
        fileBean.setCategory(category);
        fileBean.setSize(size);
        fileBean.setContent(content);
        fileBean.setDeleted("0");
        
        StatusEnum stEn = StatusEnum.fetchByCode(status);
        fileBean.setStatus(stEn != null ? stEn.getCode() : stEn.TEMPORARY.getCode());
        
        Date date = new Date();
        fileBean.setCreateTime(date);
        fileBean.setUpdateTime(date);
        
        this.fileMapper.save(fileBean);
        
        return fileBean;
    }
    
    @Override
    public MFlFile writeBase64(int mediumType, String name, String category, String base64Data, int status) throws Exception {
        // TODO Auto-generated method stub
        if (StringUtils.isEmpty(base64Data)) {
            throw FileException.NULL_DATA_ERROR;
        }
        
        Map result;
        switch (mediumType) {
            case 1:
                result = this.localService.writeBase64(name, category, base64Data);
                break;
            case 2:
                result = this.ossService.writeBase64(name, category, base64Data);
                break;
            default:
                FileException ex = FileException.MEDIUM_TYPE_ERROR;
                ex.fillIn(mediumType + "");
                throw ex;
        }
        

        MFlFile mff;
        try {
            mff = this.addFileBean(name, mediumType, (String) result.get("mimeType"), category, (int) result.get("size"), (String) result.get("filePath"), status);
        } catch (Exception e) {
            // TODO Auto-generated catch block
//            e.printStackTrace();
            
            logger.error(e.getMessage(), e);
//            
//            FileException ex = FileException.DB_ERROR;
//            ex.fillIn(e);
//            
//            throw ex;
            
            throw e;
        }
        
        return mff;
        
//        return null;
    }

    @Override
    public MFlFile readAsBase64(String id) throws Exception {
        // TODO Auto-generated method stub
        
        try {
            MFlFile fileBean = this.fileMapper.getById(id);
            if (fileBean != null && "0".equals(fileBean.getDeleted())) {
                switch (MediumTypeEnum.fetchByCode(fileBean.getMediumType())) {
                    case LOCAL:
                        fileBean.setBase64Data(this.localService.readAsBase64(fileBean));
                        return fileBean;
                    case OSS:
                        fileBean.setBase64Data(this.ossService.readAsBase64(fileBean));
                        return fileBean;
                    default:
                        FileException ex = FileException.MEDIUM_TYPE_ERROR;
                        ex.fillIn(fileBean.getMediumType() + "");
                        throw ex;

                }
            } else {
                throw FileException.FILEBEAN_STATUS_ERROR;
            }
        } catch (FileException e) {
            throw e;
        } catch (Exception e) {
            // TODO Auto-generated catch block
//          e.printStackTrace();
          
            logger.error(e.getMessage(), e);
//            FileException ex = FileException.DB_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        
        
//        return null;
    }

    @Override
    public MFlFile readAsUrl(String id) throws Exception {
        // TODO Auto-generated method stub

        try {
            MFlFile fileBean = this.fileMapper.getById(id);
            if (fileBean != null && "0".equals(fileBean.getDeleted())) {
                switch (MediumTypeEnum.fetchByCode(fileBean.getMediumType())) {
                    case OSS:
                        fileBean.setUrl(this.ossService.readAsUrl(fileBean));
                        return fileBean;
                    case LOCAL:
                        
                    default:
                        FileException ex = FileException.MEDIUM_TYPE_ERROR;
                        ex.fillIn(fileBean.getMediumType() + "");
                        throw ex;
//                        return null;
                }
            } else {
                throw FileException.FILEBEAN_STATUS_ERROR;
            }
        } catch (FileException e) {
            throw e;
        } catch (Exception e) {
            // TODO Auto-generated catch block
//          e.printStackTrace();
          
            logger.error(e.getMessage(), e);
//            FileException ex = FileException.DB_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        
//        return null;
    }

    @Override
    public MFlFile readAsPath(String id) throws Exception {
        // TODO Auto-generated method stub
        
        try {
            MFlFile fileBean = this.fileMapper.getById(id);
            if (fileBean != null && "0".equals(fileBean.getDeleted())) {
                switch (MediumTypeEnum.fetchByCode(fileBean.getMediumType())) {
                    case OSS:
                        fileBean.setContent(this.ossService.readAsUrl(fileBean));
                        return fileBean;
                    case LOCAL:
                        return fileBean;
                    default:
                        FileException ex = FileException.MEDIUM_TYPE_ERROR;
                        ex.fillIn(fileBean.getMediumType() + "");
                        throw ex;
//                        return null;
                }
            } else {
                throw FileException.FILEBEAN_STATUS_ERROR;
            }
        } catch (FileException e) {
            throw e;
        } catch (Exception e) {
            // TODO Auto-generated catch block
//          e.printStackTrace();
          
            logger.error(e.getMessage(), e);
//            FileException ex = FileException.DB_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        
//        return null;
    }

    @Override
    public MFlFile thumbnailAsBase64(String id) throws Exception {
        // TODO Auto-generated method stub
        
        try {
            MFlFile fileBean = this.fileMapper.getById(id);
            if (fileBean != null && "0".equals(fileBean.getDeleted())) {
                switch (MediumTypeEnum.fetchByCode(fileBean.getMediumType())) {
                    case LOCAL:
                        fileBean.setBase64Data(this.localService.thumbnailAsBase64(fileBean));
                        return fileBean;
                    case OSS:
                        fileBean.setBase64Data(this.ossService.thumbnailAsBase64(fileBean));
                        return fileBean;
                }
            } else {
                throw FileException.FILEBEAN_STATUS_ERROR;
            }
        } catch (FileException e) {
            throw e;
        } catch (Exception e) {
            // TODO Auto-generated catch block
//          e.printStackTrace();
          
            logger.error(e.getMessage(), e);
//            FileException ex = FileException.DB_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        
        
        return null;
    }

    @Override
    public MFlFile thumbnailAsUrl(String id) throws Exception {
        // TODO Auto-generated method stub

        try {
            MFlFile fileBean = this.fileMapper.getById(id);
            if (fileBean != null && "0".equals(fileBean.getDeleted())) {
                switch (MediumTypeEnum.fetchByCode(fileBean.getMediumType())) {
                    case OSS:
                        fileBean.setUrl(this.ossService.thumbnailAsUrl(fileBean));
                        return fileBean;
                    case LOCAL:
                        
                    default:
                        FileException ex = FileException.MEDIUM_TYPE_ERROR;
                        ex.fillIn(fileBean.getMediumType() + "");
                        throw ex;
//                        return null;
                }
            } else {
                throw FileException.FILEBEAN_STATUS_ERROR;
            }
        } catch (FileException e) {
            throw e;
        } catch (Exception e) {
            // TODO Auto-generated catch block
//          e.printStackTrace();
          
            logger.error(e.getMessage(), e);
//            FileException ex = FileException.OTHER_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        

//        return null;
    }

    @Override
    public MFlFile thumbnailAsPath(String id) throws Exception {
        // TODO Auto-generated method stub
        
        try {
            MFlFile fileBean = this.fileMapper.getById(id);
            if (fileBean != null && "0".equals(fileBean.getDeleted())) {
                switch (MediumTypeEnum.fetchByCode(fileBean.getMediumType())) {
                    case OSS:
                        fileBean.setContent(this.ossService.thumbnailAsUrl(fileBean));
                        return fileBean;
                    case LOCAL:
                        fileBean.setContent(this.localService.thumbnailAsPath(fileBean));
                        return fileBean;
                    default:
                        FileException ex = FileException.MEDIUM_TYPE_ERROR;
                        ex.fillIn(fileBean.getMediumType() + "");
                        throw ex;
//                        return null;
                }
            } else {
                throw FileException.FILEBEAN_STATUS_ERROR;
            }
        } catch (FileException e) {
            throw e;
        } catch (Exception e) {
            // TODO Auto-generated catch block
//          e.printStackTrace();
          
            logger.error(e.getMessage(), e);
//            FileException ex = FileException.OTHER_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        
//        return null;
    }

    @Override
    public int persistent(String id) throws Exception {
        // TODO Auto-generated method stub
        
        try {
            MFlFile fileBean = this.fileMapper.getById(id);
            if (fileBean != null && "0".equals(fileBean.getDeleted())) {
                fileBean.setStatus(StatusEnum.PERMANENT.getCode());
                this.fileMapper.save(fileBean);
                return 0;
            } else {
                throw FileException.FILEBEAN_STATUS_ERROR;
            }
        } catch (FileException e) {
            throw e;
        } catch (Exception e) {
            // TODO Auto-generated catch block
//          e.printStackTrace();
          
            logger.error(e.getMessage(), e);
//            FileException ex = FileException.OTHER_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        
        
//        return -1;
    }

    @Override
    public int delete(String id) throws Exception {
        // TODO Auto-generated method stub
        
        try {
            MFlFile fileBean = this.fileMapper.getById(id);
            if (fileBean != null && "0".equals(fileBean.getDeleted())) {
                
                switch (StatusEnum.fetchByCode(fileBean.getStatus())) {
                    case TEMPORARY:
                        String srcFilePath = fileBean.getContent();
                        switch (MediumTypeEnum.fetchByCode(fileBean.getMediumType())) {
                            case LOCAL:
                                this.localService.deleteByPath(srcFilePath);
                                
//                                String thumbnailFilePath = srcFilePath;
//                                if (ArrayUtils.contains(THUMBNAIL_ABLE_MIMETYPES, fileBean.getMimeType())) {
//                                    thumbnailFilePath = srcFilePath.substring(0, srcFilePath.lastIndexOf(java.io.File.separator) + 1) + THUMBNAIL_PATH + srcFilePath.substring(srcFilePath.lastIndexOf(java.io.File.separator));
//                                    this.localService.deleteFile(thumbnailFilePath);
//                                }
                                String thumbnailFilePath = srcFilePath.substring(0, srcFilePath.lastIndexOf(java.io.File.separator) + 1) + FileServiceConstant.THUMBNAIL_PATH + srcFilePath.substring(srcFilePath.lastIndexOf(java.io.File.separator));
                                this.localService.deleteByPath(thumbnailFilePath);
                                
                                break;
                                
                            case OSS:
                                this.ossService.deleteByPath(srcFilePath);
                                
                                break;
                        }
                        
                        //TODO 物理删除？!
                        this.fileMapper.deleteById(id); 
                        
                        return 0;
                        
                    case PERMANENT:
                        
                    default:

                        this.fileMapper.deleteById(id);
                        
                        return 0;
                }
            } else {
                throw FileException.FILEBEAN_STATUS_ERROR;
            }
        } catch (FileException e) {
            throw e;
        } catch (Exception e) {
            // TODO Auto-generated catch block
//          e.printStackTrace();
          
            logger.error(e.getMessage(), e);
//            FileException ex = FileException.OTHER_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        
        
//        return -1;
    }


}
