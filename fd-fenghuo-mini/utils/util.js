const MD5 = require('../module/md5.js');


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
 * 格式化数字
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 检查 value 是否为空
 * 如果是null，直接返回true；如果是类数组，判断数据长度；如果是Object对象，判断是否具有属性；如果是其他数据，直接返回false(也可改为返回true)
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value)) {
    return !value.length;
  } else if (isPlainObject(value)) {
    for (let key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false;
      }
    }
  }
  return false;
}

/**
 * 生产uuid
 */
const uuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

/**
 * 获取token
 * key:token键值，默认为userToken
 */
const getToken = (key) => {
  try {
    //获取userToken
    let userToken = wx.getStorageSync(key || 'userToken');
    //如果不存在，自动生成一个
    if (isEmpty(userToken)) {
      let dateTime = new Date().getTime();
      let uuidStr = uuid();
      userToken = MD5.hexMD5(dateTime + uuidStr);
      wx.setStorageSync(key || 'userToken', userToken)
    }
    return userToken;
  } catch (e) {
    console.info("读取token失败");
  }
}

/**
 * 存入token
 * token:值
 * key:键,非必填
 */
const setToken = (token, firstTokenTime, nowTokenTime, username, userpsd, quanxian,key) => {
  try { 
    wx.setStorageSync(key || 'userToken', token);
    wx.setStorageSync(key || 'userpsd', userpsd);
    wx.setStorageSync(key || 'firstTokenTime', firstTokenTime);
    wx.setStorageSync(key || 'nowTokenTime', nowTokenTime);
    wx.setStorageSync(key || 'username', username);
    wx.setStorageSync(key || 'quanxian', quanxian);
  } catch (e) {
    console.info("缓存token失败");
  }
}



/**
 * 页面栈，修改数据
 * @param
 * preIdx 页面位置 1～n 1:当前页面 2:上一页 ，依次递增
 * funcName 原页面函数名
 * preData 数据项 JSON
 */
const upDateByCurPage = (preIdx, funcName, preData) => {
  //获取页面栈
  var pages = getCurrentPages();
  var _page = pages[pages.length - 1]; //当前页
  if (pages.length > 1) { //说明有上一页存在
    //上一个页面实例对象
    var prePage = pages[pages.length - preIdx];
    console.log("页面栈修改页面", {
      "route": prePage.route,
      "preData": preData
    });
    //关键在这里，调用上一个页面的函数
    prePage[funcName](preData);
  }
}

/**
 * 根据url获取参数
 */
const getUriParams = (uri) => { //获取多个参数数组
  var vars = [];
  if (uri.indexOf('?') > -1) {
    var hashes = uri.slice(uri.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      let hash = hashes[i].split('=');
      vars.push({
        "key": hash[0],
        "value": hash[1]
      });
    }
  }

  let rs = {
    "uri": uri.split("?")[0],
    "params": vars
  }
  return rs;
}



/**
 * 检测数据是不是除了symbol外的原始数据
 */
function isStatic(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    value === null
  )
}

/**
 * 检测数据是不是原始数据
 */
function isPrimitive(value) {
  return isStatic(value) || typeof value === 'symbol'
}

/**
 * 判断数据是不是引用类型的数据
 *  (例如： arrays, functions, objects, regexes, new Number(0),以及 new String(''))
 */
function isObject(value) {
  let type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * 检查 value 是否是 类对象。 如果一个值是类对象，那么它不应该是 null，而且 typeof 后的结果是 "object"
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * 获取数据类型，返回结果为 Number、String、Object、Array等
 */
function getRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * 判断数据是不是Object类型的数据
 */
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 判断数据是不是数组类型的数据
 */
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

/**
 * 判断数据是不是正则对象
 */
function isRegExp(value) {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}

/**
 * isDate
 */
function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]'
}

/**
 * 判断 value 是不是浏览器内置函数
 * 内置函数toString后的主体代码块为 [native code] ，而非内置函数则为相关代码，所以非内置函数可以进行拷贝(toString后掐头去尾再由Function转)
 */
function isNative(value) {
  return typeof value === 'function' && /native code/.test(value.toString())
}

/**
 * 检查 value 是不是函数
 */
function isFunction(value) {
  return Object.prototype.toString.call(value) === '[object Function]'
}

/**
 * 检查 value 是否为有效的类数组长度
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= Number.MAX_SAFE_INTEGER;
}

/**
 * 检查 value 是否是类数组
 * 如果一个值被认为是类数组，那么它不是一个函数，并且value.length是个整数，大于等于 0，小于或等于 Number.MAX_SAFE_INTEGER。这里字符串也将被当作类数组。
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * 记忆函数：缓存函数的运算结果
 */
function cached(fn) {
  let cache = Object.create(null);
  return function cachedFn(str) {
    let hit = cache[str];
    return hit || (cache[str] = fn(str))
  }
}

/**
 * 横线转驼峰命名
 */
function camelize(str) {
  let camelizeRE = /-(\w)/g;
  return str.replace(camelizeRE, function(_, c) {
    return c ? c.toUpperCase() : '';
  })
}

/**
 * 驼峰命名转横线命名：拆分字符串，使用 - 相连，并且转换为小写
 */
function hyphenate(str) {
  let hyphenateRE = /\B([A-Z])/g;
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}

/**
 * 字符串首位大写
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 将属性混合到目标对象中
 */
function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to
}
/**
 * 克隆数据，可深度克隆
 * 列出了原始类型，时间、正则、错误、数组、对象的克隆规则，其他的可自行补充
 */
function clone(value, deep) {
  if (isPrimitive(value)) {
    return value
  }

  if (isArrayLike(value)) { //是类数组
    value = Array.prototype.slice.call(value)
    return value.map(item => deep ? clone(item, deep) : item)
  } else if (isPlainObject(value)) { //是对象
    let target = {},
      key;
    for (key in value) {
      value.hasOwnProperty(key) && (target[key] = deep ? clone(value[key], deep) : value[key])
    }
  }

  let type = getRawType(value)

  switch (type) {
    case 'Date':
    case 'RegExp':
    case 'Error':
      value = new window[type](value);
      break;
  }
  return value
}

/**
 * 数组去重，返回一个新数组
 */
function unique(arr) {
  if (!isArrayLink(arr)) { //不是类数组对象
    return arr
  }
  let result = []
  let objarr = []
  let obj = Object.create(null)

  arr.forEach(item => {
    if (isStatic(item)) { //是除了symbol外的原始数据
      let key = item + '_' + getRawType(item);
      if (!obj[key]) {
        obj[key] = true
        result.push(item)
      }
    } else { //引用类型及symbol
      if (!objarr.includes(item)) {
        objarr.push(item)
        result.push(item)
      }
    }
  })

  return resulte
}

/**
 * 生成一个重复的字符串，有n个str组成，可修改为填充为数组等
 */
function repeat(str, n) {
  let res = '';
  while (n) {
    if (n % 2 === 1) {
      res += str;
    }
    if (n > 1) {
      str += str;
    }
    n >>= 1;
  }
  return res
}

/**
 * 格式化时间
 * dateFormater('YYYY-MM-DD HH:mm', t) ==> 2019-06-26 18:30
 */
function dateFormater(formater, t) {
  let date = t ? new Date(t) : new Date(),
    Y = date.getFullYear() + '',
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  return formater.replace(/YYYY|yyyy/g, Y)
    .replace(/YY|yy/g, Y.substr(2, 2))
    .replace(/MM/g, (M < 10 ? '0' : '') + M)
    .replace(/DD/g, (D < 10 ? '0' : '') + D)
    .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
    .replace(/mm/g, (m < 10 ? '0' : '') + m)
    .replace(/ss/g, (s < 10 ? '0' : '') + s)
}

/**
 * 将指定字符串由一种时间格式转化为另一种
 * dateStrForma('20190626', 'YYYYMMDD', 'YYYY年MM月DD日') ==> 2019年06月26日
 */
function dateStrForma(str, from, to) {
  //'20190626' 'YYYYMMDD' 'YYYY年MM月DD日'
  str += ''
  let Y = ''
  if (~(Y = from.indexOf('YYYY'))) {
    Y = str.substr(Y, 4)
    to = to.replace(/YYYY|yyyy/g, Y)
  } else if (~(Y = from.indexOf('YY'))) {
    Y = str.substr(Y, 2)
    to = to.replace(/YY|yy/g, Y)
  }

  let k, i=['M', 'D', 'H', 'h', 'm', 's'].forEach(s => {
    i = from.indexOf(s + s)
    k = ~i ? str.substr(i, 2) : ''
    to = to.replace(s + s, k)
  })
  return to
}


/**
 * 根据字符串路径获取对象属性 : 'obj[0].count'
 */
function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1'); //将[0]转化为.0
  path = path.replace(/^\./, ''); //去除开头的.

  let keyArr = path.split('.'); //根据.切割
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) { //开启严格模式，没找到对应key值，抛出错误
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj, //原始数据
    k: keyArr[i], //key值
    v: tempObj ? tempObj[keyArr[i]] : null // key值对应的值
  };
};
module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  formatNumber: formatNumber,
  uuid: uuid,
  getToken: getToken,
  setToken: setToken,
  upDateByCurPage: upDateByCurPage,
  getUriParams: getUriParams
}




