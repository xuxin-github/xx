//引入通用上传模块
const uploadApi = require('../../../api/uploadApi.js');

var monitorInterval;
var tempsLength = 0;
const defOption = { //默认配置项
  max: 8,
  addIcon: 2,
  url: "", //必填
  auto: true,
  source: 1,
  warming: {
    show: true,
    txt: "",
  },
  host: "",
  miniType: ""
};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    option: { //配置文件
      type: Object,
      value: defOption
    },
    imgs: { //图片路径
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    temps: [], //临时存放地址
    config: {}, //正式配置文件
    iconsrc: ""
  },
  created: function() {
    //初始化数据
    tempsLength = 0;
  },
  attached: function() {
    // 在组件实例进入页面节点树时执行
  },
  observers: {
    //监听配置文件
    'option': function(option) {
      // 重构配置参数
      if (option == null) {
        option = defOption;
      }
      console.log(verifyOption(option));
      this.setData({
        config: verifyOption(option)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    chooseImage: function() {
      let that = this;
      //计算可选张数
      let count = that.data.config.max;
      count = count - that.data.imgs.length - that.data.temps.length;
      let sourceType = ['album', 'camera'];
      if (that.data.config.source == 2) {
        sourceType = ['album'];
      } else if (that.data.config.source == 3) {
        sourceType = ['camera'];
      }
      wx.chooseImage({
        count: count,
        sizeType: ['original', 'compressed'],
        sourceType: sourceType,
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          console.log("rrres",res);
          const tempFilePaths = res.tempFilePaths;
          //如果auto为true,自动开始上传图片
          if (that.data.config.auto === true || that.data.config.auto === 'true') {
            that.uploadFiles(tempFilePaths);
          } else {
            let temps = that.data.temps;
            temps = temps.concat(tempFilePaths);
            that.setData({
              temps: temps
            })
            //向父组件传值
            setTimeout(function() {
              that.achieve();
            }, 200)
          }

        }
      })
    },
    /**
     * 删除图片
     */
    delImg: function(e) {
      let that = this;
      let type = e.currentTarget.dataset.type;
      let index = e.currentTarget.dataset.index;
      let array = that.data[type];
      //移除元素
      array.splice(index, 1);
      that.setData({
        [type]: array
      })
      //向父组件传值
      that.achieve();
    },
    /**
     * 监听数组变化
     */
    achieve: function() {
      let that = this;
      var myEventDetail = {}; // detail对象，提供给事件监听函数
      var myEventOption = {}; // 触发事件的选项
      var rsData = {
        value: {
          temps: that.data.temps,
          imgs: that.data.imgs
        }
      }
      this.triggerEvent('achieve', rsData);
    },
    previewImage: function(e) {
      let that = this;
      let host = that.data.config.host;
      let miniType = that.data.config.miniType;
      let current = format(host, e.currentTarget.dataset.cur, miniType);
      let array = [];
      array = array.concat(formatArr(host, that.data.imgs, miniType)).concat(formatArr(host, that.data.temps, miniType));
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: array // 需要预览的图片http链接列表
      })
    },
    uploadFiles: function(array) {
      let that = this;
      //初始化图片长度
      tempsLength = array.length;
      let imgs = that.data.imgs;
      let temps = that.data.temps;
      //获取上传接口路径
      let upUrl = format(that.data.config.host, that.data.config.url, that.data.config.miniType);
      wx.showLoading({
        title: '上传中',
        mask: true
      })
      //启动监听器
      that.initInterval();
      for (var i = 0; i < array.length; i++) {
        uploadApi.uploadPic(array[i], upUrl).then(res => {
          //图片上传成功
          console.log("----------res",res);
          if (res.code == 0) {
            imgs.push(res.path);
            that.setData({
              "imgs": imgs
            })
          }
          tempsLength--;
        }).catch(err => {
          console.log("图片上传失败");
          tempsLength--;
        })
      }
    },
    /**
     * 初始化文件上传监听
     */
    initInterval() {
      let that = this;
      monitorInterval = setInterval(function() {
        if (tempsLength * 1 <= 0) {
          clearInterval(monitorInterval);
          wx.hideLoading();
          that.achieve();
        }
      }, 200)
    }
  }
})

//格式化配置文件
function verifyOption(option) {
  console.log("验证配置文件", option);
  for (var key in defOption) { //遍历json对象的每个key/value对,p为key
    option[key] = isEmpty(option[key]) ? defOption[key] : option[key];
  }
  return option;
}

function format(host, url, miniType) {
   if (url.indexOf("http") === -1) {
    if (host != "") {
      url = host + url;
    }

    if (miniType != "") {
      url = url + miniType;
    }
  }
  return url;
}

function formatArr(host, arr, miniType) {

  for (var i = 0; i < arr.length; i++) {
    arr[i] = format(host, arr[i], miniType);
  }

  return arr;
}

/**
 * 判断是否为空，0为非空
 */
function isEmpty(obj) {
  if ((obj == undefined || obj == 'undefined' || obj == 'null' || obj == 'NULL' || obj == null || obj == "" || obj.length <=
      0) && (obj != 0 || obj != "0")) {
    return true;
  } else {
    return false;
  }
}