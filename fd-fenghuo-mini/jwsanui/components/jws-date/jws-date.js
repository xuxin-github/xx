const {
  calendar
} = require('./calendar.js');
const month_olypic = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //闰年每个月份的天数
const month_normal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const dateitemlist = [1, 2, 3, 4, 5, 6, 7];
let touchDotX = 0; //X按下时坐标
let touchDotY = 0; //y按下时坐标
let interval; //计时器
let time = 0; //从按下到松开共多少时间*100
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
      type: String / Array,
      value: ""
    },
    placeholder: { //空白填充
      type: String,
      value: "请选择日期"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    datelist: [
      [],
      [],
      []
    ],
    weeks: ["日", "一", "二", "三", "四", "五", "六"],
    current: 1,
    showStatus: false,
    showClass: ["", ""],
    windowWidth: 0, //设备宽度
    scrollLeft: 0,
    year: 2019,
    month: 8
  },
  lifetimes: {
    created: function() {
      console.log("刚刚被创建");
    },
    attached: function() {
      console.log("进入页面节点树");
      let nowDate = new Date();
      let fullYear = nowDate.getFullYear();
      let month = nowDate.getMonth()+1;
      let ym2 = fttym(fullYear, month);
      let datelist = [getMonthDay(ym2.preYear, ym2.preMonth), getMonthDay(ym2.year, ym2.month), getMonthDay(ym2.nextYear, ym2.nextMonth)];
      console.log(datelist);
      let sysinfo = wx.getSystemInfoSync();
      console.log(sysinfo);
      this.setData({
        windowWidth: sysinfo.windowWidth,
        scrollLeft: sysinfo.windowWidth,
        datelist: datelist,
        year: fullYear,
        month: month
      })
      console.log("屏幕宽度" + this.data.windowWidth);
    },
    detached: function() {
      console.log("从页面节点树移除");
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    electChange: function(e) {
      let that = this;
      console.log("年月发生改变", e.detail);
    },
    /**
     * 改变月
     */
    clickMonth: function(e) {
      let that = this;
      let doType = e.currentTarget.dataset.dotype;
    },
    /**
     * 改变年
     */
    clickYear: function(e) {
      let that = this;
      let doType = e.currentTarget.dataset.dotype;

    },
    // 触摸开始事件
    touchStart: function(e) {
      console.log("滑动开始", e);
      touchDotX = e.touches[0].pageX; // 获取触摸时的原点
      touchDotY = e.touches[0].pageY;
      // 使用js计时器记录时间    
      interval = setInterval(function() {
        console.log("计时器");
        time++;
      }, 10);
    },
    // 触摸结束事件
    touchEnd: function(e) {
      console.log("滑动结束", e);
      let that = this;
      //清楚定时器
      clearInterval(interval);
      //设置位置
      setTimeout(function() {
        that.setData({
          scrollLeft: that.data.windowWidth + Math.random()
        })
      }, 200);
      //开始计算滑动方向
      let touchMoveX = e.changedTouches[0].pageX;
      let touchMoveY = e.changedTouches[0].pageY;
      let tmX = touchMoveX - touchDotX;
      let tmY = touchMoveY - touchDotY;

      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);

      //对手指按下时间进行判断
      if (time < 200) {
        //判断手指滑动距离，决定手指滑动方向
        if (absX > 2 * absY && absX >= 52) {
          //左右
          if (tmX < 0) {
            console.log("左滑=====" + tmX);
            that.refreshDays(2);
          } else {
            console.log("右滑=====" + tmX);
            that.refreshDays(1);
          }
        }
        if (absY > absX * 2 && absY >= 52) {
          //上下
          if (tmY < 0) {
            console.log("上滑=====" + tmY)
          } else {
            console.log("下滑=====" + tmY)
          }
        }
      }

      console.log("scrollLeft" + that.data.scrollLeft);

      time = 0;
    },
    clickDate: function(e) {
      console.log("选中某个值", e.detail.value);
    },
    refreshDays: function(type) {
      let that = this;
      let fullYear = that.data.year;
      let month = that.data.month;
      let datelist = [
        [],
        [],
        []
      ];
      let ym = fttym(fullYear, month);
      let ym2={};
      if (type == 1) {
        //上一个月
        ym2 = fttym(ym.preYear, ym.preMonth);
        datelist = [getMonthDay(ym2.preYear, ym2.preMonth), getMonthDay(ym2.year, ym2.month), getMonthDay(ym2.nextYear, ym2.nextMonth)];

      } else if (type == 2) {
        //下一个月
        ym2 = fttym(ym.nextYear, ym.nextMonth);
        datelist = [getMonthDay(ym2.preYear, ym2.preMonth), getMonthDay(ym2.year, ym2.month), getMonthDay(ym2.nextYear, ym2.nextMonth)];
      }
      console.log(datelist);
      that.setData({
        datelist: datelist,
        month: ym2.month,
        year: ym2.year
      })
    },
    showPicker() {
      let that = this;
      let showStatus = !that.data.showStatus;
      if (showStatus == true) {
        //显示
        that.setData({
          showStatus: showStatus,
          showClass: ["jws-show-box", "jws-show-picker"]
        })
      } else {
        //隐藏
        that.setData({
          showClass: ["jws-hide-box", "jws-hide-picker"]
        })
        setTimeout(function() {
          that.setData({
            showStatus: showStatus
          })
        }, 400);
      }
    },
  }
})

/**
 * 获取标准年月
 */
function fttym(year, month) {
  let preYear = year;
  let preMonth = month - 1;
  if (preMonth == 0) {
    preMonth = 12;
    preYear--;
  }
  let nextYear = year;
  let nextMonth = month + 1;
  if (nextMonth == 13) {
    nextMonth = 1;
    nextYear++;
  }

  return {
    "preYear": preYear,
    "preMonth": preMonth,
    "nextYear": nextYear,
    "nextMonth": nextMonth,
    "year": year,
    "month": month
  }
}

/**
 * 格式化时间
 * fmt: yyyy-MM-dd hh:mm:ss
 */
const formatTime = (fmt, datetime) => {
  let date = new Date();
  if (datetime != null && datetime != undefined && datetime != "" && datetime != NaN) {
    date = new Date(datetime);
  }
  let o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}




/**
 * 根据年月获取当月第一天是周几
 */
function getDayStart(year, month) {
  month--;
  var tmpDate = new Date(year, month, 1);
  return (tmpDate.getDay());
}

/**
 * 根据年份判断某月有多少天
 */
function getDaysMonth(year, month) {
  month--;
  var tmp1 = year % 4;
  var tmp2 = year % 100;
  var tmp3 = year % 400;

  if ((tmp1 == 0 && tmp2 != 0) || (tmp3 == 0)) {
    return (month_olypic[month]); //闰年
  } else {
    return (month_normal[month]); //非闰年
  }
}

function getMonthDay(year, month) {
  console.log("年==" + year + "---month==" + month);
  let newDayArr = [];
  let ym2 = fttym(year, month);
  let dayStart = getDayStart(year, month);
  let preDaysMonth = getDaysMonth(ym2.preYear, ym2.preMonth);
  let daysMonth = getDaysMonth(year, month);
  newDayArr[0] = [];
  for (var i = 0; i < dayStart; i++) {
    newDayArr[0].push({
      "day": calendar.solar2lunar(ym2.preYear, ym2.preMonth, preDaysMonth - dayStart + i + 1),
      "sign": 1
    });
  }
  let j = 0;
  let day = 1;
  let day2 = 1;
  for (var i = dayStart; i < 42; i++) {
    if (day <= daysMonth) {
      newDayArr[j].push({
        "day": calendar.solar2lunar(year, month, day),
        "sign": 2
      });
      day++;
    } else {
      newDayArr[j].push({
        "day": calendar.solar2lunar(ym2.nextYear, ym2.nextMonth + 1, day2),
        "sign": 3
      });
      day2++;
    }
    if (newDayArr[j].length == 7 && j < 5) {
      j++;
      newDayArr[j] = [];
    }
  }
  return newDayArr;
}