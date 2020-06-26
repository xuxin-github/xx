Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: { //值
      type: String,
      value: ''
    },
    type: { //input 的类型
      type: String,
      value: 'text'
    },
    placeholder: { //输入框为空时占位符
      type: String,
      value: '请输入'
    },
    maxlength:{
      type: String,
      value: '99'
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
    /**
     * 监听数组变化
     */
    changeInput: function(e) {
      let that = this;
      //写入值
      that.setData({
        value: e.detail.value
      });
      that.achieve(e.detail.value);
    },
    //删除值
    del: function() {
      let that = this;
      that.setData({
        value: ""
      });
      that.achieve("");
    },
    //传值给父组件
    achieve: function (value) {
      var rsData = {
        "value": value
      };
      this.triggerEvent('input', rsData);
    }
  }
})