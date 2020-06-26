// component/loading/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: { // 属性名
      type: Number,
      value: 1
    },
    warms: { // 属性名
      type: Array,
      value: ["我是有底线的", "上拉/点击加载更多", "正在加载中"]
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
    onTip: function() {

      if (this.data.status == 0) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
        return false;
      } else if (this.data.status == 2) {
        wx.showToast({
          title: '正在加载',
          icon: 'none'
        })
        return false;
      }

      this.triggerEvent('onTip', {
        msg: "loading"
      });
    }
  }
})