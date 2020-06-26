// jwsanui/components/jws-form/jws-form.js
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
    title: {//标题
      type: String,
      value: ''
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
    //颜色变化
    'color': function (color) {
      this.setData({
        showColor: getColor(color)
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
  if (color.indexOf("#") > -1) {
    return "background:" + color + ";"
  } else if (color.indexOf("rgba") > -1) {
    return "background:" + color + ";"
  } else {
    return "background:var(--" + color + ");"
  }
}