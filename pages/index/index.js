//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    loginUrl: "/login/logincheck"
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  //获取用户信息按钮事件
  //获取信息成功并登陆后将userinfo、userId与openid存放入全局变量中
  getUserInfo: function (e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    var baseUrl = app.globalData.baseUrl;
    var loginUrl = this.data.loginUrl;
    var userInfo = this.data.userInfo;
    var that = this;
    //获取并传送code
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: baseUrl + loginUrl,
          data: {
            userInfoStr: JSON.stringify(userInfo),
            code: code
          },
          success: function (res) {
            if (res.data.success) {
              app.globalData.openid = res.data.openid;
              app.globalData.userId = res.data.userId;
              //跳转到有tab的页面
              wx.switchTab({
                url: '/pages/home/home',
              })
            }

          }
        });
      }
    });

  }
})
