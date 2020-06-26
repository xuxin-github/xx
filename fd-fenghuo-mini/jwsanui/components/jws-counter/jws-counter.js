// jwsanui/components/jws-counter/jws-counter.js
var point = 0;
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    value: { //值
      type: Number,
      value: 0
    },
    grain: { //值
      type: Number,
      value: 1
    },
    color: { //值
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showColor: "" //渲染颜色
  },
  observers: {
    //监听配置文件
    'grain': function(grain) {
      grain = grain.toString();
      if (grain.indexOf("\.") > -1) {
        point = grain.split(".")[1].length
      } else {
        point = 0
      }
    },
    'color': function(color) {
      this.setData({
        showColor: getColor(color)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    //加法
    plus: function() {
      let that = this;
      let value = that.data.value;
      value = value + that.data.grain;
      //同步小数点位数
      value = value.toFixed(point);
      that.achieve(value);
    },
    //减法
    minus: function() {
      let that = this;
      let value = that.data.value;
      value = value - that.data.grain;
      //同步小数点位数
      value = value.toFixed(point);
      that.achieve(value);
    },
    //传值给父组件
    achieve: function(value) {
      this.setData({
        "value": value
      })
      var rsData = {
        "value": value
      };
      this.triggerEvent('change', rsData);
    }
  }
})

function getColor(color) {
  if (color.indexOf("#") > -1) {
    return "background:" + color + ";"
  } else if (color.indexOf("rgba") > -1) {
    return "background:" + color + ";"
  } else {
    return "background:var(--" + color + ");"
  }
}