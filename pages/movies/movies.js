// pages/movies/movies.js
const app = getApp();
const douban = app.globalData.douban;
const doubanUrl = douban.url;
const movieDataUrl = douban.movieDataUrl;
const util = require('../../utils/util.js');

Page({
  data: {
    in_theaters: {},
    coming_soon: {},
    top250: {},
    searchShow: false,
    searchResult: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 正在热映
    let reqCount = '?start=0&count=3';
    let in_theaters = movieDataUrl.in_theaters + reqCount;
    // 即将上映
    let coming_soon = movieDataUrl.coming_soon + reqCount;
    // 北美票房榜
    // let us_box = movieDataUrl.us_box + reqCount;
    // Top 250
    let top250 = movieDataUrl.top250 + reqCount;
    util.http(in_theaters, this.processDoubanData, 'in_theaters');
    util.http(coming_soon, this.processDoubanData, 'coming_soon');
    util.http(top250, this.processDoubanData, 'top250');
  },

  processDoubanData: function (data, dataKey) {
    let movies = [];
    for (let i in data.subjects) {
      let subject = data.subjects[i];
      let name = subject.title;
      let movie = {
        name: name.length >= 6 ? name.substring(0, 6) + '...' : name,
        image: subject.images.large,
        stars: util.countStar(subject.rating.stars),
        score: subject.rating.average.toFixed(1),
        id: subject.id
      }
      movies.push(movie);
    }
    let title = data.title;
    // JS对象动态绑定
    let readyData = {};
    readyData[dataKey] = {
      title: title,
      movies: movies
    }
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },

  // 点击更多事件处理函数
  onMoreTap: function (event) {
    let title = event.currentTarget.dataset.title;
    console.log(event.currentTarget.dataset)
    wx.navigateTo({
      url: 'more-movies/more-movies?title=' + title
    })
  },

  // 搜索栏焦点获取处理函数
  onBindFocus: function () {
    this.setData({
      searchShow: true
    });
  },

  // 搜索栏失去焦点处理函数
  onBindBlur: function (event) {
    let text = event.detail.value;
    let searchUrl = `${doubanUrl}/v2/movie/search?q=${text}`;
    util.http(searchUrl, this.processDoubanData, 'searchResult')
  },

  onCancelTap: function () {
    this.setData({
      searchShow: false,
      searchResult: {}
    });
  },

  onMovieTap: function (event) {
    let id = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + id
    });
  }
})