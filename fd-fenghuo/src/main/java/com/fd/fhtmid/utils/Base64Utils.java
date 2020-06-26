package com.fd.fhtmid.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Base64;

import org.apache.commons.lang3.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Administrator
 *
 */
public class Base64Utils {
    
    private static final Logger logger = LoggerFactory.getLogger(Base64Utils.class);

    /**
     * 
     */
    public Base64Utils() {
        // TODO Auto-generated constructor stub
    }
    
    /**
     * 从输入流编码
     * 
     * @param inputStream
     * @param size TODO
     * @return
     * @throws IOException
     */
    public static String encodeFromInputStream(InputStream inputStream, int size) throws IOException {
        String base64Data = null;
        if (inputStream != null) {
            try {
                byte[] data = new byte[0];
                byte[] temp = new byte[size];
                int len;
                while ((len = inputStream.read(temp)) >= 0) {
                    data = ArrayUtils.addAll(data, Arrays.copyOfRange(temp, 0, len));
                }
                final Base64.Encoder encoder = Base64.getEncoder();
                base64Data = encoder.encodeToString(data);
            } catch (IOException e) {
                throw e;
            } finally {
                if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException e) {
                        logger.error(e.getMessage(), e);
                    }
                }
            }
        }
        return base64Data;
    }
    
    /**
     * 解码
     * @param base64Data
     * @return
     * @throws IllegalArgumentException
     */
    public static byte[] decodeFromStr(String base64Data) throws IllegalArgumentException {
        final Base64.Decoder decoder = Base64.getDecoder();     
        byte[] data;
        try {
            data = decoder.decode(base64Data);
        } catch (IllegalArgumentException e) {
            throw e;
        }
        return data;
    }

}
