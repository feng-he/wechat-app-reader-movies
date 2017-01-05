const postsData = require('../../data/postsData.js')

Page({
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      postList: postsData.postList
    })
  },
  onPostTap: function (event) {
    let postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    });
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})