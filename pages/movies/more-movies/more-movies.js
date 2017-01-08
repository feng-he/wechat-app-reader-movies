// pages/movies/more-movies/more-movies.js
const app = getApp();
const movieDataUrl = app.globalData.douban.movieDataUrl;
const util = require('../../../utils/util');

Page({
  data: {
    movies: [],
    dataUrl: '',
    isEmpty: true
  },
  onLoad: function (options) {
    let title = options.title;
    wx.setNavigationBarTitle({
      title: title,
    });
    let url = '';
    switch (title) {
      case '正在上映的电影-北京':
        url = movieDataUrl.in_theaters;
        break;
      case '即将上映的电影':
        url = movieDataUrl.coming_soon;
        break;
      case '豆瓣电影Top250':
        url = movieDataUrl.top250;
        break;
    }
    this.setData({
      dataUrl: url
    });
    util.http(url, this.processMovieData);
  },

  processMovieData: function (data) {
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
    let totalMovies = [];
    if (this.data.isEmpty) {
      totalMovies = movies;
    } else {
      totalMovies = this.data.movies.concat(movies);
    }
    this.setData({
      movies: totalMovies,
      isEmpty: false
    });
    wx.hideNavigationBarLoading();
    // 停止当前页面下拉刷新
    wx.stopPullDownRefresh();
  },

  // 滚至底部加载更多事件处理函数
  onScrollLower: function () {
    let mvCount = this.data.movies.length;
    let reqMoreUrl = `${this.data.dataUrl}?start=${mvCount}&count=20`;
    util.http(reqMoreUrl, this.processMovieData);
  },

  // 监听该页面用户下拉刷新事件
  onPullDownRefresh: function () {
    console.log('11');
    this.setData({
      movies: [],
      isEmpty: true
    });
    util.http(this.data.dataUrl, this.processMovieData);
  },

  onMovieTap: function (event) {
    let id = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id
    });
  }
})