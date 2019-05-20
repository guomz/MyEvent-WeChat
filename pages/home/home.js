// pages/home/home.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getRoomListUrl:'/home/getroomlist',
    roomList:[],
    userId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId:app.globalData.userId
    });
    var baseUrl=app.globalData.baseUrl;
    var getRoomListUrl=this.data.getRoomListUrl;
    var that=this;
    wx.request({
      url: baseUrl+getRoomListUrl,
      data:{
        pageIndex:0,
        pageSize:5
      },
      success:function(res){
        if(res.data.success)
        {
          that.setData({
            roomList:res.data.roomList
          });
        }
      }
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
 * 点击更多的事件
 */
  onTap:function(e){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})