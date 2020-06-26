package com.fd.fhtmid.service.impl;

import com.fd.fhtmid.mapper.BUserInfoMapper;
import com.fd.fhtmid.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class UserServiceImpl implements UserService {
    @Autowired
    private BUserInfoMapper userInfoMapper;
    @Override
    public Map getPersonnelById(Map map) {
        return userInfoMapper.getPersonnelById(map);
    }
}
