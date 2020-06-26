/**
 * 环境配置
 */
const env = "dev";

/**
 * 服务器配置
 */
const serverConfig = {
  "dev": { //开发环境
    hostname: "http://192.168.1.102:8181", 
    hostfile: "http://192.168.1.102::8181/weixin",
    miniType: "?miniapptype=fengv1huo",
    springboot:"http://127.0.0.1:8181"    // 用于测试图片上传
  },
  "sit": { //系统整合测试（内测）
    hostname: "http://127.0.0.1:9531",
    miniType: "?servertype=jwsserver"
  },
  "uat": { //用户验收测试
    hostname: "https://wiki.fudengtech.com",
    miniType: "?miniapptype=fengv1huo",
    springboot: "http://wiki.fudengtech.com:8181"
  },
  "pet": { //性能评估测试（压测）
    hostname: "http://127.0.0.1:9531",
    miniType: "?servertype=jwsserver"
  },
  "sim": { //仿真
    hostname: "http://127.0.0.1:9531",
    miniType: "?servertype=jwsserver"
  },
  "prd": { //产品/正式/生产
    hostname: "https://jiuwusan.cn",
    miniType: "?servertype=jwsserver"
  }
}

const server = serverConfig[env];

//需要以application/x-www-form-urlencoded提交的接口uri
const qsclude = ["/login"];

//上传接口
const upload = {
  file: server.hostname + "/common/file/upload" + server.miniType,
  img: server.hostname + "/common/file/upload" + server.miniType
};

module.exports = {
  server: server,
  upload: upload,
  qsclude: qsclude
}