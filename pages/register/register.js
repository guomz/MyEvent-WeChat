// pages/register/register.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    hasUserInfo:false,
    code:'',
    registerUrl:'/login/register',
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success:(res)=>{
        this.setData({
          code:res.code
        });
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        });
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

  onSubmit:function(e){
    if(!e.detail.value.userName||e.detail.value=='')
    {
      wx.showToast({
        title: '请填写用户名',
        icon:'none'
      });
      return ;
    }
    wx.request({
      url: app.globalData.baseUrl+this.data.registerUrl,
      data:{
        userInfoStr:JSON.stringify(this.data.userInfo),
        userName:e.detail.value.userName,
        code:this.data.code,
      },
      success:(res)=>{
        if(res.data.success)
        {
          wx.showToast({
            title: '认证成功',
          });
          app.globalData.openid = res.data.openid;
          app.globalData.userId = res.data.userId;
          app.globalData.userType = res.data.userType;
          //跳转到有tab的页面
          wx.switchTab({
            url: '/pages/home/home',
          });
        }
      }
    });
  },

//获取用户信息
  getUserInfo:function(e){
    app.globalData.userInfo = e.detail.userInfo;
    //获取code
    wx.login({
      success:res=>{
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true,
          code:res.code
        });
      }
    });

  }
})