export default{
//获取年月日
 getymd(dateStr) {
   let date = this.convertDate(dateStr);

    if(date != ''){
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '年' + m + '月' + d + '日';
    }else{
        return '';
    }

} ,
  getmdw(date) {
    let weeks = [
      '日曜日',
      '月曜日',
      '火曜日',
      '水曜日',
      '木曜日',
      '金曜日',
      '土曜日'
    ]
    if(date != ''){
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var w = date.getDay();
      console.log("Weeks is " + w);
      return m + '月' + d + '日(' + weeks[w] + ')';
    }else{
      return '';
    }

  } ,
  gethm(date) {

    if(date != ''){
      var h = date.getHours();
      h=h < 10 ? ('0' + h) : h;
      var m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      return h + '時' + m + '分';
    }else{
      return '';
    }

  } ,

  getmdwhs(dateStr) {
   let date = this.convertDate(dateStr);
   return this.getmdw(date) + ' ' + this.gethm(date);
  },

  convertDate(dateStr) {
    if(dateStr != '') {
      let date = new Date(Date.parse(dateStr));
      return date;
    }
    return new Date();
  },
//获取年月日时分秒
 getymdhis(date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h=h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                minute = minute < 10 ? ('0' + minute) : minute;
                var second=date.getSeconds();
                second=second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
            } ,
//时间戳转日期
 totime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        // var h = date.getHours() + ':';
        // var m = date.getMinutes() + ':';
        // var s = date.getSeconds();
        return Y+M+D;
    },

//获取特定时间
getTime(n) {
        var now = new Date();
        now.setTime(now.getTime()+24*60*60*1000*n);
        return now;
    }
}
