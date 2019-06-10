// pages/room-order/room-order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getEventTimeUrl: '/calendar/geteventtime',
    orderEventUrl: '/calendar/orderevent',
    timeList: [],
    timeNameList: [],
    timeIndex: 0,
    roomId:null,
    eventDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      roomId:options.roomId,
      eventDate:options.eventDate
    });
    wx.request({
      url: app.globalData.baseUrl + this.data.getEventTimeUrl,
      data: {
        eventDate: options.eventDate,
        roomId: options.roomId
      },
      //请求可用时段
      success: function(res) {
        if (res.data.success) {
          that.setData({
            timeList: res.data.timeList
          });
          //初始化时段名称
          var timeList = res.data.timeList;
          var timeNameList = new Array(timeList.length)
          for (let i = 0; i < timeNameList.length; i++) {
            if (timeList[i] == 0) {
              timeNameList[i] = '上午';
            } else if (timeList[i] == 1) {
              timeNameList[i] = '下午';
            } else {
              timeNameList[i] = '晚上';
            }
          }
          that.setData({
            timeNameList: timeNameList
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindTimeChange: function(e) {
    this.setData({
      timeIndex: e.detail.value
    });
  },

  onSubmit: function(e) {
    //首先进行判空操作
    if (!e.detail.value.eventName) {
      wx.showToast({
        title: '请填写事件名',
        icon: 'none'
      });
      return;
    }
    if (!e.detail.value.eventDetail) {
      wx.showToast({
        title: '请填写事件简介',
        icon: 'none'
      });
      return;
    }
    var baseUrl = app.globalData.baseUrl;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '请在使用会议室之后及时取消预约以便他人预定',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: baseUrl + that.data.orderEventUrl,
            data: {
              roomId: that.data.roomId,
              eventId: that.data.eventId,
              eventName: e.detail.value.eventName,
              eventDetail: e.detail.value.eventDetail,
              groupName: e.detail.value.groupName,
              eventDate: that.data.eventDate,
              userId: app.globalData.userId,
              eventTime: that.data.timeList[that.data.timeIndex]
            },
            success: function (res) {
              if (res.data.success) {
                wx.showToast({
                  title: '操作成功',
                });

              }
              else {
                wx.showToast({
                  title: res.data.errMsg,
                });

              }
            }
          })
          wx.navigateBack({
            delta: 1
          });
        }
      }
    });
  }
})