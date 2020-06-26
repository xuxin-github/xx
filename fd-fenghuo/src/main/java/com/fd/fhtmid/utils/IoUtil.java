package com.fd.fhtmid.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class IoUtil {
	/**
     * 写出
     * @param file
     * @param out
     */
    public static void writeFile(File file, OutputStream out) {
        FileInputStream fs = null;
        try{
            fs = new FileInputStream(file);
            //循环写入输出流
            byte[] b = new byte[1024*8];
            int len;
            while ((len = fs.read(b)) > 0) {
                out.write(b, 0, len);
            }
        }catch (Exception e){
            throw new RuntimeException("流写出错误");
        }finally {
            close(fs,out);
        }
    }

    /**
     * 关流
     */
    public static void close(InputStream is){
        if(is!=null){
            try{
                is.close();
                is = null;
            }catch (Exception e2){
                throw new RuntimeException("关闭流失败");
            }
        }
    }

    /**
     * 关流
     */
    public static void close(OutputStream os){
        if(os!=null){
            try{
                os.close();
                os = null;
            }catch (Exception e2){
                throw new RuntimeException("关闭流失败");
            }
        }
    }

    /**
     * 关流
     */
    public static void close(InputStream is , OutputStream os){
        if(is!=null){
            try{
                is.close();
                is = null;
            }catch (Exception e2){
                throw new RuntimeException("关闭流失败");
            }
        }
        if(os!=null){
            try{
                os.close();
                os = null;
            }catch (Exception e2){
                throw new RuntimeException("关闭流失败");
            }
        }
    }

}
