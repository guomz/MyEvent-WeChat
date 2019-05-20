// pages/room-calendar/room-calendar.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getRoomListUrl:'/calendar/getroombydate',
    userId: null,
    roomId: null,
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    //模拟日程安排
    roomList: [
      {
        roomId:1,
        roomName:'111'
      },
      {
        roomId:2,
        roomName:'222'
      },
      {
        roomId:3,
        roomName:'333'
      }
    ],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userId
    });
  },

  /**
    * 日历初始化一个月的显示
    */
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];                        //需要遍历的日历数组数据
    let arrLen = 0;                            //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                    //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();                            //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();                //获取目标月有多少天
    let obj = {};
    let num = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        //安排对象
        obj = {
          isToday: '' + year + '-' + (month + 1) + '-' + num,
          dateNum: num,
          weight: 5,
          isTap: false
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    });

    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      });
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    //that.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + '-' + month + '-' + now.getDate()
    });
    var that=this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl+this.data.getRoomListUrl,
      data:{
        eventDate:this.data.isToday
      },
      success:function(res){
        if(res.data.success)
        {
          wx.hideLoading();
          that.dateInit();
          that.setData({
            roomList:res.data.roomList
          });
          //将今日置为选中状态
          var dateArr=that.data.dateArr;
          for(var i=0;i<dateArr.length;i++)
          {
            if(dateArr[i].isToday==that.data.isToday)
            {
              dateArr[i].isTap=true;
              break;
            }
          }
          that.setData({
            dateArr:dateArr
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
  * 点击上一个月按钮
  */
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /**
   * 点击下一个月按钮
   */
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },

  onTap:function(e){
    var dateArr = this.data.dateArr;
    //先消除其它的灰色效果
    for (var i = 0; i < dateArr.length; i++) {
      dateArr[i].isTap = false;
    }
    //刷新页面数据
    this.setData({
      dateArr: dateArr
    });
    for (var i = 0; i < dateArr.length; i++) {
      if (dateArr[i].isToday == e.currentTarget.dataset.date) {
        dateArr[i].isTap = true;
        break;
      }
    }
    this.setData({
      dateArr: dateArr,
      isToday: e.currentTarget.dataset.date
    });
    var that=this;
    //请求选中日期的可用会议室列表
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl+this.data.getRoomListUrl,
      data:{
        eventDate: e.currentTarget.dataset.date
      },
      success:function(res){
        if(res.data.success)
        {
          wx.hideLoading();
          that.setData({
            roomList:res.data.roomList
          });
        }
      }
    });
  }
})