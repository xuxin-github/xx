/**
 * 
 */
package com.fd.fhtmid.service.impl;

import java.awt.image.BufferedImage;
import java.io.FileInputStream;
import java.io.FileOutputStream;
//import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.activation.MimetypesFileTypeMap;
import javax.imageio.ImageIO;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fd.fhtmid.common.constant.FileServiceConstant;
import com.fd.fhtmid.common.exception.FileException;
import com.fd.fhtmid.domain.MFlFile;
import com.fd.fhtmid.service.LocalService;
import com.fd.fhtmid.utils.Base64Utils;

import net.coobird.thumbnailator.Thumbnails;

/**
 * @author jack
 *
 */
@Service
@Transactional
public class LocalServiceImpl implements LocalService {

    private static final Logger logger = LoggerFactory.getLogger(LocalServiceImpl.class);
    
    @Value("${local.file.path}")
    private String localFilePath;
    
//    @Autowired
//    private FileMapper fileMapper;

//    private String addFileBean(String name, int mediumType, String mimeType, String category, int size, String content, int status) throws Exception {
//        String id = UUID.randomUUID().toString();
//        File fileBean = new File();
//        fileBean.setId(id);
//        fileBean.setName(name);
//        fileBean.setMediumType(mediumType);
//        fileBean.setMimeType(mimeType);
//        fileBean.setCategory(category);
//        fileBean.setSize(size);
//        fileBean.setContent(content);
//        
//        StatusEnum stEn = StatusEnum.fetchByCode(status);
//        fileBean.setStatus(stEn != null ? stEn.getCode() : stEn.TEMPORARY.getCode());
//        
//        Date date = new Date();
//        fileBean.setCreateTime(date);
//        fileBean.setUpdateTime(date);
//        
//        this.fileMapper.add(fileBean);
//        
//        return id;
//    }

    @Override
    public java.io.File writeFile(byte[] data, String filePath) throws Exception {
        
        java.io.File destFile = null;
        OutputStream outputStream = null;
        try {
            destFile = new java.io.File(filePath);
            if (!destFile.getParentFile().exists()) {
                destFile.getParentFile().mkdirs();
            }
            
            outputStream = new FileOutputStream(filePath);
            outputStream.write(data);
            outputStream.flush();
            
        } catch (IOException e) {
            // TODO Auto-generated catch block
//            e.printStackTrace();
            logger.error(e.getMessage(), e);
//            return false;
            
            FileException ex = FileException.LOCAL_WRITE_ERROR;
            ex.fillIn(e);
            
            throw ex;
            
        } catch (Exception e) {
            // TODO Auto-generated catch block
//          e.printStackTrace();
            logger.error(e.getMessage(), e);
//          return false;
//            FileException ex = FileException.LOCAL_OTHER_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
            
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
//                    e.printStackTrace();
                    logger.error(e.getMessage(), e);
                }
            }
        }
        
        return destFile;
    }

    @Override
    public Map writeBase64(String name, String category, String base64Data) throws Exception {
        // TODO Auto-generated method stub
        String dateStr = DateFormatUtils.format(new Date(), "yyyyMMdd");
        
        byte[] data;
        try {
            data = Base64Utils.decodeFromStr(base64Data);
        } catch (IllegalArgumentException e1) {
            // TODO Auto-generated catch block
//            e1.printStackTrace();

            logger.error(e1.getMessage(), e1);
            FileException ex = FileException.BASE64_DATA_ERROR;
            ex.fillIn(e1);
            throw ex;
            
        }
        
        Map result;
        
        String fileName = System.currentTimeMillis() + "." + name; //name.substring(name.lastIndexOf("."));
//        File file = new File();
        String filePath = java.io.File.separator + (StringUtils.isEmpty(category) ? "" : category + java.io.File.separator) + dateStr + java.io.File.separator + fileName;
        String localPath = this.localFilePath + filePath;
        
        java.io.File file;
        try {
            if ((file = this.writeFile(data, localPath)) != null) {
//                String id = this.addFileBean(name, MediumTypeEnum.LOCAL.getCode(), (new MimetypesFileTypeMap()).getContentType(new java.io.File(filePath)).toLowerCase(), category, data.length, filePath, status);
                
                result = new HashMap(3);
                result.put("mimeType", (new MimetypesFileTypeMap()).getContentType(file).toLowerCase());
                result.put("size", data.length);
                result.put("filePath", filePath);
                
                return result;
            }
        } catch (FileException e) {
            // TODO Auto-generated catch block
//            e.printStackTrace();
//            logger.error(e.getMessage(), e);
            
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
        
        return null;
    }

    @Override
    public String readAsBase64(MFlFile fileBean) throws Exception {
        // TODO Auto-generated method stub
        
        String base64Data = null;
        if (fileBean != null) {
            String filePath = fileBean.getContent();
            String localPath = this.localFilePath + filePath;
            InputStream inputStream = null;
            try {
                inputStream = new java.io.FileInputStream(localPath);
//                byte[] data = new byte[fileBean.getSize()];
//                inputStream.read(data);
                /*byte[] data = new byte[0];
                byte[] temp = new byte[1024];
                int len;
                while ((len = inputStream.read(temp)) >= 0) {
                    data = ArrayUtils.addAll(data, Arrays.copyOfRange(temp, 0, len));
                }
                final Base64.Encoder encoder = Base64.getEncoder();
                base64Data = encoder.encodeToString(data);*/
                base64Data = Base64Utils.encodeFromInputStream(inputStream, fileBean.getSize());
            } catch (IOException e) {
                // TODO Auto-generated catch block
//              e.printStackTrace();
                logger.error(e.getMessage(), e);

                FileException ex = FileException.LOCAL_READ_ERROR;
                ex.fillIn(e);

                throw ex;

//              return null;
            } catch (Exception e) {
                // TODO Auto-generated catch block
//                e.printStackTrace();
                logger.error(e.getMessage(), e);

//                FileException ex = FileException.LOCAL_READ_ERROR;
//                ex.fillIn(e);
//                
//                throw ex;
                
                throw e;
                
//                return null;
            } finally {
                /*if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
//                        e.printStackTrace();
                        logger.error(e.getMessage(), e);
                    }
                }*/
            }
            
        }
        return base64Data;
    }

    @Override
    public String thumbnailAsBase64(MFlFile fileBean) throws Exception {
        // TODO Auto-generated method stub
        
        String base64Data = null;
        if (fileBean != null) {
            InputStream inputStream = null;
            try {
                inputStream = new FileInputStream(this.localFilePath + this.thumbnailAsPath(fileBean));
                /*byte[] data = new byte[fileBean.getSize()];
                inputStream.read(data);
                final Base64.Encoder encoder = Base64.getEncoder();
                base64Data = encoder.encodeToString(data);*/
                base64Data = Base64Utils.encodeFromInputStream(inputStream, fileBean.getSize());
            } catch (IOException e) {
                // TODO Auto-generated catch block
//                e.printStackTrace();
                logger.error(e.getMessage(), e);

                FileException ex = FileException.LOCAL_READ_ERROR;
                ex.fillIn(e);
                
                throw ex;
                
//                return null;
            } catch (Exception e) {
                // TODO Auto-generated catch block
//              e.printStackTrace();
                logger.error(e.getMessage(), e);

                throw e;

//              return null;
            } finally {
                /*if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
//                        e.printStackTrace();
                        logger.error(e.getMessage(), e);
                    }
                }*/
            }
        }
        
        return base64Data;
    }
    
    @Override
    public String thumbnailAsPath(MFlFile fileBean) throws Exception {
        // TODO Auto-generated method stub
        
        String thumbnailFilePath = null;
        if (fileBean != null) {
            String srcFilePath = fileBean.getContent();
            String srcLocalPath = this.localFilePath + srcFilePath;
            thumbnailFilePath = srcFilePath;
            if (ArrayUtils.contains(FileServiceConstant.THUMBNAIL_ABLE_MIMETYPES, fileBean.getMimeType())) {
                thumbnailFilePath = srcFilePath.substring(0, srcFilePath.lastIndexOf(java.io.File.separator) + 1) + FileServiceConstant.THUMBNAIL_PATH + srcFilePath.substring(srcFilePath.lastIndexOf(java.io.File.separator));
                String thumbnailLocalPath = this.localFilePath + thumbnailFilePath;
                java.io.File thubmnailFile = new java.io.File(thumbnailLocalPath);
                if (thubmnailFile != null) {
                    try {
                        if (!thubmnailFile.getParentFile().exists()) {
                            thubmnailFile.getParentFile().mkdirs();
                        }
                        
                        if (!thubmnailFile.exists()) {
                            java.io.File srcFile = new java.io.File(srcLocalPath);
                            BufferedImage src = ImageIO.read(srcFile);
                            
                            /*BufferedImage thubmnail = new BufferedImage(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, BufferedImage.TYPE_INT_RGB);
                            thubmnail.getGraphics().drawImage(src.getScaledInstance(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, Image.SCALE_SMOOTH), 0, 0, null);
                            thubmnail.getGraphics().dispose();
                            outputStream = ImageIO.createImageOutputStream(thubmnailFile);
//                            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(outputStream);
//                            encoder.encode(thubmnail);
                            Iterator<ImageWriter> it = ImageIO.getImageWritersByMIMEType(fileBean.getMimeType());
                            if (it != null && it.hasNext()) {
                                ImageWriter iw = it.next();
                                iw.setOutput(outputStream);
                                iw.write(thubmnail);
                            } else {
                                ImageIO.write(thubmnail, "JPG", outputStream);
                            }
                            
                            outputStream.flush();*/
                            
                            float scale = (float) FileServiceConstant.THUMBNAIL_WIDTH / src.getWidth();
                            if (scale > 1.0) {
                                scale = 1.0f;
                            }
                            Thumbnails.of(srcLocalPath).scale(scale).toFile(thumbnailLocalPath);
                        }
                    } catch (Exception e) {
                        
                        logger.error(e.getMessage(), e);
                        
                        thumbnailFilePath = srcLocalPath;
                    }
                    
                }
                
//                if (thubmnailFile == null || !thubmnailFile.exists()) {
////                    ImageOutputStream outputStream = null;
//                    try {
//                        java.io.File srcFile = new java.io.File(srcFilePath);
//                        BufferedImage src = ImageIO.read(srcFile);
//                        
//                        /*BufferedImage thubmnail = new BufferedImage(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, BufferedImage.TYPE_INT_RGB);
//                        thubmnail.getGraphics().drawImage(src.getScaledInstance(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, Image.SCALE_SMOOTH), 0, 0, null);
//                        thubmnail.getGraphics().dispose();
//                        outputStream = ImageIO.createImageOutputStream(thubmnailFile);
////                        JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(outputStream);
////                        encoder.encode(thubmnail);
//                        Iterator<ImageWriter> it = ImageIO.getImageWritersByMIMEType(fileBean.getMimeType());
//                        if (it != null && it.hasNext()) {
//                            ImageWriter iw = it.next();
//                            iw.setOutput(outputStream);
//                            iw.write(thubmnail);
//                        } else {
//                            ImageIO.write(thubmnail, "JPG", outputStream);
//                        }
//                        
//                        outputStream.flush();*/
//                        
//                        float scale = (float) THUMBNAIL_WIDTH / src.getWidth();
//                        if (scale > 1.0) {
//                            scale = 1.0f;
//                        }
//                        Thumbnails.of(srcFilePath).scale(scale).toFile(thumbnailFilePath);
//                        
//                    } catch (IOException e) {
//                        // TODO Auto-generated catch block
////                      e.printStackTrace();
//                        logger.error(e.getMessage(), e);
//                        
//                        thumbnailFilePath = srcFilePath;
//                        
//                    } finally {
//                        /*if (outputStream != null) {
//                            try {
//                                outputStream.close();
//                            } catch (IOException e) {
//                                // TODO Auto-generated catch block
////                                e.printStackTrace();
//                                logger.error(e.getMessage(), e);
//                            }
//                        }*/
//                    }
//                    
//                }
            }
            
            
            
        }
        return thumbnailFilePath;
    }

    @Override
    public boolean deleteByPath(String filePath) throws Exception {
        try {
            java.io.File destFile = new java.io.File(this.localFilePath + filePath);
            if (destFile != null && destFile.exists()) {
                return destFile.delete();
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
//            e.printStackTrace();
            
            logger.error(e.getMessage(), e);
//          return false;
//            FileException ex = FileException.LOCAL_OTHER_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        
        return false;
    }

}
