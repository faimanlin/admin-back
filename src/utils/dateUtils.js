/*
包含n个日期时间处理的工具函数模块
*/

/*
  格式化日期
*/
export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate()
    + '日 ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}

export function formateDate1(time) {
  if (!time) return ''
  let date = new Date(time)
  var o = {
    "M+": date.getMonth() + 1,                 //月份 
    "d+": date.getDate(),                    //日 
    "h+": date.getHours(),                   //小时 
    "m+": date.getMinutes(),                 //分 
    "s+": date.getSeconds(),                 //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds()             //毫秒 
  };
  let fmt = 'yyyy-MM-dd hh:mm:ss'

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
