const app=getApp();
Page({
  data: {
    getEventListUrl:'/calendar/geteventlist',
    cancleEventUril:'/calendar/cancleevent',
    userId:null,
    roomId:null,
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    //模拟日程安排
    eventList:[
      
    ],
    //是否显示事件安排
    eventShow:false,
    //当前事件，用于底部显示
    nowEvent:{}
  },
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      userId:app.globalData.userId,
      roomId:options.roomId
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
    //准备与模拟数据比对，将预约事件进行绑定
    var eventList=this.data.eventList;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        //安排对象
        obj = {
          isToday: '' + year +'-'+ (month + 1) +'-'+ num,
          dateNum: num,
          weight: 5,
          //是否有安排
          hasEvent:false,
          //存放event对象
          event:'',
          //是否被点击
          isTap:false
        }
       //遍历事件数组
        for (var j = 0; j < eventList.length;j++)
        {
          if (obj.isToday == eventList[j].eventDate)
          {
            obj.hasEvent=true;
            obj.event = eventList[j];
          }
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })

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
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
/**
 * 当从编辑页面返回时会触发onshow，在onshow中调用onload即可刷新页面
 */
  onShow:function(options){
   // console.log('onShow')
    var that = this;
    var baseUrl = app.globalData.baseUrl;
    wx.request({
      url: baseUrl + this.data.getEventListUrl,
      data: {
        roomId: this.data.roomId
      },
      success: function (res) {
        if (res.data.success) {
          //console.log(res.data.eventList)
          that.setData({
            eventList: res.data.eventList
          });
          let now = new Date();
          let year = now.getFullYear();
          let month = now.getMonth() + 1;
          that.dateInit();
          that.setData({
            year: year,
            month: month,
            isToday: '' + year + '-' + month + '-' + now.getDate()
          });

          //将今天的日期是否有事件，若有则变蓝色并显示事件，无则为灰色
          var dateArr = that.data.dateArr;
          for (var i = 0; i < dateArr.length; i++) {
            if (that.data.isToday == dateArr[i].isToday) {
              if (dateArr[i].hasEvent) {
                that.setData({
                  eventShow: true,
                  nowEvent: dateArr[i].event
                });
              }
              else {
                dateArr[i].isTap = true;
                that.setData({
                  eventShow:false,
                  nowEvent: {
                    eventDate: dateArr[i].isToday
                  }
                });
                break;
              }
            }
          }
          that.setData({
            dateArr: dateArr
          });
        }
       
      }
    });
    
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

/**
 * 用户点击某个日期事件
 */
  onTap:function(e){
    //当用户选中某个日期时颜色变为灰色
    var dateArr=this.data.dateArr;
    //先消除其它的灰色效果
    for (var i = 0; i<dateArr.length; i++) {
      dateArr[i].isTap=false;
    }
    //刷新页面数据
    this.setData({
      dateArr:dateArr
    });
    //重新找到选中日期
    for(var i=0;i<dateArr.length;i++)
    {
      if(dateArr[i].isToday==e.currentTarget.dataset.date)
      {
        dateArr[i].isTap=true;
        break;
      }
    }
    //刷新
    this.setData({
      dateArr:dateArr
    })

    //显示事件栏的判断，若有时间则绑定事件对象，无则绑定时间
    if(e.currentTarget.dataset.hasevent)
    {
      this.setData({
        eventShow:true,
        nowEvent:e.currentTarget.dataset.event
      });
    }
    else
    {
      this.setData({
        eventShow:false,
        nowEvent:{
          eventDate: e.currentTarget.dataset.date
        }
      });
    }
  }

})