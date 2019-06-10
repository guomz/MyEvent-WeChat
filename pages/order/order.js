// pages/order/order.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderEventUrl:'/calendar/orderevent',
    updateEventUrl:'/calendar/changeevent',
    cancleEventUrl: '/calendar/cancleevent',
    eventName:'',
    eventDetail:'',
    eventDate:'',
    groupName:'',
    eventId:null,
    roomId:null,
    //用于标识更新或插入
    isOrder:null,
    eventTime:null,
    //按钮禁用，默认false为可用，当进行提交或删除操作后禁用
    canClick:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.isOrder==0||options.isOrder==2)
    {
      //console.log('is update')
      this.setData({
        eventName: options.eventName,
        eventDetail: options.eventDetail,
        groupName:options.groupName,
        eventId:options.eventId
      });
    }
    this.setData({
      eventDate:options.eventDate,
      isOrder:options.isOrder,
      roomId:options.roomId,
      eventTime:options.eventTime
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
 * 提交操作，通过isOrder来改变url进行提交或修改
 */
  onSubmit:function(e){
    //console.log(e.detail.value.eventName)
    //首先进行判空操作
    if(!e.detail.value.eventName)
    {
      wx.showToast({
        title: '请填写事件名',
        icon:'none'
      });
      return;
    }
    if(!e.detail.value.eventDetail)
    {
      wx.showToast({
        title: '请填写事件简介',
        icon:'none'
      });
      return;
    }
    var baseUrl=app.globalData.baseUrl;
    var currentUrl='';
    if(this.data.isOrder==1)
    {
      currentUrl=this.data.orderEventUrl;
    }
    else if(this.data.isOrder==0)
    {
      currentUrl=this.data.updateEventUrl;
    }
    var that=this;
    wx.showModal({
      title: '提示',
      content: '请在使用会议室之后及时取消预约以便他人预定',
      showCancel:false,
      success:function(res){
        if(res.confirm)
        {
          wx.request({
            url: baseUrl+currentUrl,
            data:{
              roomId:that.data.roomId,
              eventId:that.data.eventId,
              eventName: e.detail.value.eventName,
              eventDetail: e.detail.value.eventDetail,
              groupName:e.detail.value.groupName,
              eventDate: that.data.eventDate,
              userId:app.globalData.userId,
              eventTime:that.data.eventTime
            },
            success:function(res){
              if(res.data.success)
              {
                wx.showToast({
                  title: '操作成功',
                });
                that.setData({
                  canClick:true
                });
              }
              else
              {
                wx.showToast({
                  title: res.data.errMsg,
                });
                that.setData({
                  canClick: true
                });
              }
            }
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            });
          }, 3000);
        }
      }
    });
    
  },

/**
 * 点击删除按钮触发事件
 */
  onDelete:function(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认删除该预约吗？',
      success(res) {
        if (res.confirm) {
          //console.log('用户点击确定')
          wx.request({
            url: app.globalData.baseUrl+that.data.cancleEventUrl,
            data:{
              eventId:that.data.eventId
            },
            success:function(res){
              if(res.data.success){
                wx.showToast({
                  title: '删除成功',
                  success:function(){
                    
                  }
                });
                that.setData({
                  canClick: true
                });
              }
            }
          });
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            });
          },3000);
          // wx.navigateBack({
          //   delta: 1
          // });
        } else if (res.cancel) {
          //console.log('用户点击取消')
          //点击取消不做处理
        }
      }
    });
    
  }
})