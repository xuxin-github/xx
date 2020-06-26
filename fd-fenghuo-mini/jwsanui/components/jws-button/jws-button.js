// jwsanui/components/jws-button/jws-button.js
Component({
  /**
   * 组件的一些选项
   */
  options: {
    //使用全局样式
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isFill: { //值
      type: Boolean,
      value: false
    },
    color: { //背景颜色，优先级最高
      type: String,
      value: ""
    },
    mleft: { //左边距
      type: Number,
      value: 0
    },
    mtop: { //上边距
      type: Number,
      value: 0
    },
    size: { //上边距
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fclass: "",
    bgColor: "",
    magleft:"",
    magtop: "",
    sizeClass:{
      box:"",
      btn:""
    }
  },
  observers: {
    //是否铺满屏幕
    'isFill': function(isFill) {
      if (isFill == true) {
        this.setData({
          fclass: "jws-btn-fill"
        })
      } else {
        this.setData({
          fclass: ""
        })
      }
    },
    //背景颜色是否发生改变
    'color': function(color) {
      this.setData({
        bgColor: getColor(color)
      })
    }, // 左边距
    'mleft': function (mleft) {
      this.setData({
        magleft: " margin-left: " + mleft+"rpx;"
      })
    }, // 上边距
    'mtop': function (mtop) {
      this.setData({
        magtop: " margin-top: " + mtop + "rpx;"
      })
    }, // 大小
    'size': function (size) {
      this.setData({
        sizeClass: {
          box: " .jws-btn-box-" + size,
          btn: " .jws-btn-" + size
        } 

      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})

function getColor(color) {
  let bgColor = "";
  let borderColor = "border:none;";
  let txtColor = "color:rgba(255,255,255,1);";
  if (color.indexOf("#") > -1) {
    bgColor = "background:" + color + ";"
  } else if (color.indexOf("rgba") > -1) {
    bgColor = "background:" + color + ";"
  } else {
    bgColor = "background:var(--" + color + ");"
  }

  return bgColor + borderColor + txtColor;
}