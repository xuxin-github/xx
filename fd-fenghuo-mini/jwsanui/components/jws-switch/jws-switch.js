Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true //导入全局样式
  },
  /**
   * 组件的属性列表
   */
  properties: {
    checked: { // 属性名
      type: Boolean,
      value: false
    },
    range: { // 属性名
      type: Array,
      value: [true, false]
    },
    color: { // 属性名
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    background: "background: var(--green)"
  },
  /**
   * 监听颜色变化
   */
  observers: {
    //监听配置文件
    'color': function (color) {
      this.setData({
        background: getColor(color)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeChecked: function() {
      let that = this;
      let index = 1;
      let checked = !that.data.checked;
      that.setData({
        "checked": checked
      })
      //传值
      if (checked) {
        index = 0;
      }
      var rsData = {
        value: that.data.range[index]
      }
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