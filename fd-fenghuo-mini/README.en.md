# wxProject

#### 介绍

在公司进行小程序开发，遇到许多关于小程序的一些问题，在解决问题的同时进行记录、总结，逐渐形成该微信小程序开发模板。

#### 功能说明

###### 1. 独立配置文件
###### 2. 基础组件
###### 3. 对request进行Promise封装，对Api进行统一管理
###### 4. 引入async/await,简化页面代码


#### 安装教程

1. git clone https://gitee.com/jiuwusan/wxProject  
2. 将project.config.json配置文件的appid替换为自己小程序的appid，导入小程序

#### 使用说明

1. 配置文件  
    **路径：** 根目录下 config/config.js  
    **说明：** 主要配置小程序当前环境、服务器地址、文件上传地址等信息  

2. 基础组件  
    **路径：** 根目录下 jwsanui/components/*  
    **说明：** 小程序默认使用flex布局，在app.wxss引入通用样式文件  
   ```
    /* 引入通用样式 */
    @import "./jwsanui/jws-common.wxss";
    /* 引入微动画 */
    @import "./jwsanui/jws-animation.wxss";
   ```
   使用：在页面配置文件 .json 引入组件  
   ```
    "usingComponents": {
    "jws-upload-img": "/jwsanui/components/jws-upload-img/jws-upload-img"
    }
   ```

3. 对request进行Promise封装，对Api进行统一管理  
    **路径：** 根目录下 api/*  
    **说明：** 所有接口方法经过APIFunction.js处理后，生成统一Api  
    **使用：**   
   目录下新建authApi.js，放入如下代码：  
   ```
    const APIFunction = require('./APIFunction.js');
    const api = {
      genJwtToken: '/auth/genJwtToken',//get请求
      valiLogin: 'POST /api/auth/login',//post请求
      queryUserInfo: '/api/auth/queryUserInfo'//get请求
    }
    const API = APIFunction(api);
    module.exports = API;
    ```
   Api调用方式：  
    ```
     const authApi = require('../../api/authApi.js');
     let uid = "qwer1234";
     let params = { "uid": uid};
     authApi.genJwtToken(params).then(res => {
     //接口调用成功
     }).catch(err => {
     //接口调用失败
     })
     ```

4. 引入async/await,简化页面代码  
     **页面引入文件**
     ```
     const regeneratorRuntime = require('../../module/runtime.js')
     ```
     
     **方式（一）：不改变周期函数，新定义方法** 
     ```
     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
       //调用方法    
       this.getToken();
     }
     ```

     ```
     /**
      * 定义方法
      */
     async getToken(){
       let rs = await authApi.genJwtToken();
       console.log("请求结果", rs);
      }
     ```
     **方式（二）：改变周期函数，增加 async** 

     ```
     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: async function (options) {
       let rs = await authApi.genJwtToken();
       console.log("请求结果", rs);
     }
     ```

     **注：推荐使用方式一，尽量不改变页面生命周期函数，避免发生不可预知的错误 ！！！**





#### 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request


