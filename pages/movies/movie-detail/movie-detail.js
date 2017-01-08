// pages/movies/movie-datail/movie-detail.js
const util = require('../../../utils/util');
const app = getApp();
const douban = app.globalData.douban;

Page({
  data: {
    movie: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let movieId = options.id;
    let url = douban.url + '/v2/movie/subject/' + movieId;
    util.http(url, this.processMovie);
  },

  // 解析请求到的电影详情数据
  processMovie: function (data) {
    if (!data) {
      console.log('Request movie detail failed.');
      return;
    }
    let director = {
      avatar: '',
      name: '',
      id: ''
    }
    if (data.directors[0]) {
      if (data.directors[0].avatar) {
        director.avatar = data.directors[0].avatar.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    let movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      // 电影名称
      title: data.title,
      // 电影英文名称
      originalTitle: data.original_title,
      // 想看的人数
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      // 电影类型
      generes: data.genres.join('/'),
      stars: util.countStar(data.rating.stars),
      score: data.rating.average,
      director: director,
      // 演员表
      casts: util.convertToCastString(data.casts),
      // 演员详情
      castsInfo: util.convertToCastInfos(data.casts),
      // 剧情概要
      summary: data.summary
    }
    this.setData({
      movie: movie
    });
    wx.hideNavigationBarLoading();
  }
})