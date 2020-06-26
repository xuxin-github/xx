// jwsanui/components/jws-form-item/jws-form-item.js
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
    lable: { //标题
      type: String,
      value: ''
    },
    required: { //是否必填标识
      type: Boolean,
      value: false
    },
    icon: { //图标
      type: String,
      value: ''
    },
    columnY:{ //Y轴排列
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})