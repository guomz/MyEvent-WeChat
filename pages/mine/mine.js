// pages/mine/mine.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getEventListUrl:'/calendar/getmyeventlist',
    userInfo:{},
    eventList:{},
    userType:1,
    userId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo=app.globalData.userInfo;
    var userId=app.globalData.userId;
    this.setData({
      userInfo:userInfo,
      userId:userId,
      userType:app.globalData.userType
    });
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
    //console.log("onshow")
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    wx.request({
      url: baseUrl + this.data.getEventListUrl,
      data: {
        userId: this.data.userId
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            eventList: res.data.eventList
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
 * 邀请注册时跳转到二维码页面
 */
  register:function(){
    wx.navigateTo({
      url: '/pages/qrcode/qrcode',
     //url:'/pages/register/register'
    });
  }
})