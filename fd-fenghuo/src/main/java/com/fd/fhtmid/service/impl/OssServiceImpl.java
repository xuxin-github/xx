/**
 * 
 */
package com.fd.fhtmid.service.impl;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
//import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.net.URL;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.activation.MimetypesFileTypeMap;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.aliyun.oss.ClientException;
import com.aliyun.oss.HttpMethod;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.GeneratePresignedUrlRequest;
import com.aliyun.oss.model.GetObjectRequest;
import com.aliyun.oss.model.OSSObject;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectResult;
import com.fd.fhtmid.common.constant.FileServiceConstant;
import com.fd.fhtmid.common.exception.FileException;
import com.fd.fhtmid.utils.Base64Utils;

import com.fd.fhtmid.domain.MFlFile;
import com.fd.fhtmid.service.LocalService;
import com.fd.fhtmid.service.OssService;

/**
 * @author jack
 *
 */
@Service
@Transactional
public class OssServiceImpl implements OssService {

    private static final Logger logger = LoggerFactory.getLogger(OssServiceImpl.class);

    @Value("${local.file.path}")
    private String localFilePath;
    
//    @Value("${oss.file.path}")
//    private String ossFilePath;
    
    @Value("${oss.endPoint}")
    private String ossEndPoint;
    
    @Value("${oss.accessKeyId}")
    private String ossAccessKeyId;
    
    @Value("${oss.accessKeySecret}")
    private String ossAccessKeySecret;
    
    @Value("${oss.bucketName}")
    private String ossBucketName;// = "bcis";
    
//    @Autowired
//    private FileMapper fileMapper;

    @Autowired
    private LocalService localFileService;
    
    /*private String addFileBean(String name, int mediumType, String mimeType, String category, int size, String content, int status) throws Exception {
        String id = UUID.randomUUID().toString();
        MFlFile fileBean = new File();
        fileBean.setId(id);
        fileBean.setName(name);
        fileBean.setMediumType(mediumType);
        fileBean.setMimeType(mimeType);
        fileBean.setCategory(category);
        fileBean.setSize(size);
        fileBean.setContent(content);
        
        StatusEnum stEn = StatusEnum.fetchByCode(status);
        fileBean.setStatus(stEn != null ? stEn.getCode() : stEn.TEMPORARY.getCode());
        
        Date date = new Date();
        fileBean.setCreateTime(date);
        fileBean.setUpdateTime(date);
        
        this.fileMapper.add(fileBean);
        
        return id;
    }*/
    
    private Map getImageInfoFromOss(String filePath, OSS ossClient) {

        GetObjectRequest request = new GetObjectRequest(ossBucketName, filePath);
        request.setProcess("image/info");
        OSSObject ossObject = ossClient.getObject(request);
        LineNumberReader lnr = null;
        try {
            lnr = new LineNumberReader(
                new InputStreamReader(
                    new DataInputStream(ossObject.getObjectContent()),"utf-8"));
            String line = "";
            String json = "";
            while ((line = lnr.readLine()) != null) {
                json += line;
            }
//            System.out.println(json);
            
            JSONObject obj = (JSONObject) JSON.parse(json);
//            System.out.println(obj);
//            System.out.println(((JSONObject) obj.get("ImageWidth")).get("value"));
            
            return obj;
            
        } catch (IOException e) {
            // TODO Auto-generated catch block
//            e.printStackTrace();
            logger.error(e.getMessage(), e);
            return null;
        } finally {
            if (lnr != null) {
                try {
                    lnr.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
//                    e.printStackTrace();
                    logger.error(e.getMessage(), e);
                }
            }
        }
    }

    private String getcontentType(String FilenameExtension) {
        if (FilenameExtension.equalsIgnoreCase(".bmp")) {
            return "image/bmp";
        }
        if (FilenameExtension.equalsIgnoreCase(".gif")) {
            return "image/gif";
        }
        if (FilenameExtension.equalsIgnoreCase(".jpeg") || FilenameExtension.equalsIgnoreCase(".jpg") || FilenameExtension.equalsIgnoreCase(".png")) {
            return "image/jpeg";
        }
        if (FilenameExtension.equalsIgnoreCase(".html")) {
            return "text/html";
        }
        if (FilenameExtension.equalsIgnoreCase(".txt")) {
            return "text/plain";
        }
        if (FilenameExtension.equalsIgnoreCase(".vsd")) {
            return "application/vnd.visio";
        }
        if (FilenameExtension.equalsIgnoreCase(".pptx") || FilenameExtension.equalsIgnoreCase(".ppt")) {
            return "application/vnd.ms-powerpoint";
        }
        if (FilenameExtension.equalsIgnoreCase(".docx") || FilenameExtension.equalsIgnoreCase(".doc")) {
            return "application/msword";
        }
        if (FilenameExtension.equalsIgnoreCase(".xml")) {
            return "text/xml";
        }
        return "image/jpeg";
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
        
        OSS ossClient = new OSSClientBuilder().build(ossEndPoint, ossAccessKeyId, ossAccessKeySecret);
        
        String fileName = System.currentTimeMillis() + "." + name; //name.substring(name.lastIndexOf("."));
//        String filePath = (StringUtils.isEmpty(category) ? "" : category + java.io.File.separator) + dateStr + java.io.File.separator + fileName;
        String filePath = (StringUtils.isEmpty(category) ? "" : category + "/") + dateStr + "/" + fileName;
        
        String tempPath = this.localFilePath + FileServiceConstant.TEMP_PATH + java.io.File.separator + fileName;
        String mimeType = this.getcontentType(fileName.substring(fileName.lastIndexOf(".")));
        java.io.File tempFile;
        if ((tempFile = this.localFileService.writeFile(data, tempPath)) != null) {
//            java.io.File tempFile = new java.io.File(tempPath);
            try {
                mimeType = (new MimetypesFileTypeMap()).getContentType(tempFile).toLowerCase();
                tempFile.delete();
            } catch (Exception e) {
                // TODO Auto-generated catch block
//                e.printStackTrace();
            }
        }
        
        InputStream inputStream = null;
        try {
            inputStream = new ByteArrayInputStream(data);
            String ret = "";
            //创建上传Object的Metadata 
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentLength(inputStream.available());
            objectMetadata.setCacheControl("no-cache");
            objectMetadata.setHeader("Pragma", "no-cache");
            objectMetadata.setContentType(mimeType);
            objectMetadata.setContentDisposition("inline;filename=" + fileName);
            //上传文件
            PutObjectResult putResult = ossClient.putObject(ossBucketName, filePath, inputStream, objectMetadata);
            ret = putResult.getETag();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            logger.error(e.getMessage(), e);
            
            FileException ex = FileException.OSS_WRITE_ERROR;
            ex.fillIn(e);
            
            throw ex;
            
//            return null;
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
//                    e.printStackTrace();
                    logger.error(e.getMessage(), e);
                }
            }
            ossClient.shutdown();
        }
        
        result = new HashMap(3);
        result.put("mimeType", mimeType);
        result.put("size", data.length);
        result.put("filePath", filePath);
        
        return result;
    }
    
    @Override
    public String readAsBase64(MFlFile fileBean) throws Exception {
        // TODO Auto-generated method stub
        
        String base64Data = null;
        if (fileBean != null) {
            String filePath = fileBean.getContent();
            
            OSS ossClient = new OSSClientBuilder().build(ossEndPoint, ossAccessKeyId, ossAccessKeySecret);
            
            InputStream inputStream = null;
            try {

                OSSObject ossObject = ossClient.getObject(ossBucketName, filePath);
                
                inputStream = ossObject.getObjectContent();
//                byte[] data = new byte[fileBean.getSize()];
//                ossObject.getObjectContent().read(data);
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
//                e.printStackTrace();
                logger.error(e.getMessage(), e);

                FileException ex = FileException.OSS_READ_ERROR;
                ex.fillIn(e);
                
                throw ex;
                
//                return null;
            } catch (Exception e) {
                // TODO Auto-generated catch block
//              e.printStackTrace();
                logger.error(e.getMessage(), e);

//                FileException ex = FileException.OSS_OTHER_ERROR;
//                ex.fillIn(e);
//                throw ex;
                
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
                ossClient.shutdown();
            }
            
        }
        return base64Data;
        
    }

    @Override
    public String readAsUrl(MFlFile fileBean) throws Exception {
        // TODO Auto-generated method stub

        String urlStr = null;
        if (fileBean != null) {
            String filePath = fileBean.getContent();
            
            OSS ossClient = new OSSClientBuilder().build(ossEndPoint, ossAccessKeyId, ossAccessKeySecret);
            
            Date expiration = new Date(new Date().getTime() + FileServiceConstant.OSS_URL_VALIDATION_LENGTH);
            
            try {
                URL url = ossClient.generatePresignedUrl(ossBucketName, filePath, expiration);
                if (url != null) {
                    urlStr = url.toString();
                }
            } catch (ClientException e) {
                // TODO Auto-generated catch block
//                e.printStackTrace();
                
                logger.error(e.getMessage(), e);

                FileException ex = FileException.OSS_OTHER_ERROR;
                ex.fillIn(e);
                throw ex;
            }
            
            ossClient.shutdown();
            
        }
        return urlStr;
    }

    @Override
    public String thumbnailAsBase64(MFlFile fileBean) throws Exception {
        // TODO Auto-generated method stub
        
        String base64Data = null;
        if (fileBean != null) {
            
            if (ArrayUtils.contains(FileServiceConstant.THUMBNAIL_ABLE_MIMETYPES, fileBean.getMimeType())) {
                String filePath = fileBean.getContent();
                
                OSS ossClient = new OSSClientBuilder().build(ossEndPoint, ossAccessKeyId, ossAccessKeySecret);
                
                Map info = this.getImageInfoFromOss(filePath, ossClient);
                int width = 1;
                if (info != null) {
                    try {
                        width = Integer.parseInt((String) ((Map) info.get("ImageWidth")).get("value"));
                    } catch (Exception e1) {
                        // TODO Auto-generated catch block
//                        e1.printStackTrace();
                        
                    }
                }
                
                
                if (width > FileServiceConstant.THUMBNAIL_WIDTH) {
                    String style = "image/resize,w_" + FileServiceConstant.THUMBNAIL_WIDTH;
                    GetObjectRequest request = new GetObjectRequest(ossBucketName, filePath);
                    request.setProcess(style);
                    OSSObject ossObject = ossClient.getObject(request);
                    
                    InputStream inputStream = null;
                    try {
                        inputStream = ossObject.getObjectContent();
                        /*byte[] data = new byte[fileBean.getSize()];
                        ossObject.getObjectContent().read(data);
                        final Base64.Encoder encoder = Base64.getEncoder();
                        base64Data = encoder.encodeToString(data);*/
                        base64Data = Base64Utils.encodeFromInputStream(inputStream, fileBean.getSize());
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
//                        e.printStackTrace();
                        logger.error(e.getMessage(), e);

                        FileException ex = FileException.OSS_READ_ERROR;
                        ex.fillIn(e);
                        
                        throw ex;
                        
//                        return null;
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
//                      e.printStackTrace();
                        logger.error(e.getMessage(), e);

//                        FileException ex = FileException.OSS_READ_ERROR;
//                        ex.fillIn(e);

                        throw e;

//                      return null;
                    } finally {
                        if (inputStream != null) {
                            try {
                                inputStream.close();
                            } catch (IOException e) {
                                // TODO Auto-generated catch block
//                                e.printStackTrace();
                                logger.error(e.getMessage(), e);
                            }
                        }
                        
                    }
                } else {
                    base64Data = this.readAsBase64(fileBean);
                }
                
                ossClient.shutdown();
                
            } else {
                base64Data = this.readAsBase64(fileBean);
            }
        }
        return base64Data;
    }

    @Override
    public String thumbnailAsUrl(MFlFile fileBean) throws Exception {
        // TODO Auto-generated method stub

        String urlStr = null;
        if (fileBean != null) {
            if (ArrayUtils.contains(FileServiceConstant.THUMBNAIL_ABLE_MIMETYPES, fileBean.getMimeType())) {
                String filePath = fileBean.getContent();
                
                OSS ossClient = new OSSClientBuilder().build(ossEndPoint, ossAccessKeyId, ossAccessKeySecret);

                Map info = this.getImageInfoFromOss(filePath, ossClient);
                int width = 1;
                if (info != null) {
                    try {
                        width = Integer.parseInt((String) ((Map) info.get("ImageWidth")).get("value"));
                    } catch (Exception e1) {
                        // TODO Auto-generated catch block
//                        e1.printStackTrace();
                        
                    }
                }
                
                
                if (width > FileServiceConstant.THUMBNAIL_WIDTH) {
                    String style = "image/resize,w_" + FileServiceConstant.THUMBNAIL_WIDTH;
                    
                    Date expiration = new Date(new Date().getTime() + FileServiceConstant.OSS_URL_VALIDATION_LENGTH);
                    
                    GeneratePresignedUrlRequest req = new GeneratePresignedUrlRequest(ossBucketName, filePath, HttpMethod.GET);
                    req.setExpiration(expiration);
                    req.setProcess(style);
                    URL signedUrl = ossClient.generatePresignedUrl(req);
                    if (signedUrl != null) {
                        urlStr = signedUrl.toString();
                    }
                    
                } else {
                    urlStr = this.readAsUrl(fileBean);
                }
                
                ossClient.shutdown();
            } else {
                urlStr = this.readAsUrl(fileBean);
            }
        }
        return urlStr;
    }

    @Override
    public String thumbnailAsPath(MFlFile fileBean) throws Exception {
        // TODO Auto-generated method stub
        return this.thumbnailAsUrl(fileBean);
    }
    
    @Override
    public boolean deleteByPath(String filePath) throws Exception {
        try {
            OSS ossClient = new OSSClientBuilder().build(ossEndPoint, ossAccessKeyId, ossAccessKeySecret);
            
            ossClient.deleteObject(ossBucketName, filePath);
            
            ossClient.shutdown();
            
        } catch (Exception e) {
            // TODO Auto-generated catch block
//            e.printStackTrace();
            
            logger.error(e.getMessage(), e);
//          return false;
//            FileException ex = FileException.OSS_OTHER_ERROR;
//            ex.fillIn(e);
//            throw ex;
            
            throw e;
        }
        
        return false;
    }


}
