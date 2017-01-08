function countStar(stars) {
  let one_count = Math.floor(stars / 10),
    half_count = stars % 10 === 5 ? 1 : 0,
    none_count = half_count ? 5 - one_count - 1 : 5 - one_count;
  let starCount = [];
  for (let i = 0; i < one_count; i++) {
    starCount.push(1);
  }
  if (half_count) {
    starCount.push(0.5);
  }
  for (let i = 0; i < none_count; i++) {
    starCount.push(0);
  }
  return starCount;
}

function http(url, callback, dataKey) {
  wx.showNavigationBarLoading();
  wx.request({
    url: url,
    method: 'GET',
    // 设置请求的 header
    header: {
      'Content-Type': 'json'
    },
    success: function (res) {
      console.log(res.data)
      callback(res.data, dataKey);
    },
    fail: function () {
      console.log('Request Failed')
    }
  })
}

function convertToCastString(casts) {
  let castList = [];
  for (let i in casts) {
    castList.push(casts[i].name);
  }
  let castString = castList.join('/');
  return castString;
}

function convertToCastInfos(casts) {
  var castsArray = [];
  for (var i in casts) {
    var cast = {
      img: casts[i].avatars ? casts[i].avatars.large : "",
      name: casts[i].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}
// function formatTime(date) {
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate()

//   var hour = date.getHours()
//   var minute = date.getMinutes()
//   var second = date.getSeconds()


//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// function formatNumber(n) {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

module.exports = {
  // formatTime: formatTime
  countStar: countStar,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos

}
