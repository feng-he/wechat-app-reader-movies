//app.js
App({
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    g_isPlaying: [],
    douban: {
      url: 'https://api.douban.com',
      movieDataUrl: {
        in_theaters: 'https://api.douban.com/v2/movie/in_theaters',
        coming_soon: 'https://api.douban.com/v2/movie/coming_soon',
        top250: 'https://api.douban.com/v2/movie/top250'
      }
    }
  }
})