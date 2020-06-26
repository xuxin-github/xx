module.exports = {
    //不要提交了这个文件

    // serverUrl : "http://wiki.fudengtech.com:8181",
      serverUrl: "http://localhost:8181",

    qsclude: ["/login"],//POST需要以application/x-www-form-urlencoded方式提交的接口列表
    filePrefix: "http://wiki.fudengtech.com:8181/common/file/readimg?img=",//文件显示前缀nginx
}