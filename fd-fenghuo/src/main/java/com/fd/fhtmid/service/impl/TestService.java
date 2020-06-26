package com.fd.fhtmid.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.apache.ibatis.javassist.expr.NewArray;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class TestService {
	
	
	@Async
    public void test(){
        System.out.println("####sendSms####   2");
        IntStream.range(0, 5).forEach(d -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        System.out.println("####sendSms####   3");
    }

    @Async
    public Map test1(){
	    Map map = new HashMap();
        List rs = new ArrayList();
        // 两种循环遍历取出数据
        for(int i=0;i< rs.size();i++){
            String s = ((Map)rs.get(i)).get("content").toString();
            System.out.println("ssss"+s);
        }
        for(Object i : rs){
            String s = ((Map)i).get("content").toString();
            System.out.println("ssss"+s);
        }
	    map.put("code",0);
	    map.put("mes","获取数据成功");
	    map.put("data",rs);
        System.out.println("map"+ map);

	    return map;
    }

}
