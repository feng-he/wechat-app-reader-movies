const postsData = require('../../../data/postsData.js');
const app = getApp();

Page({
    data: {
        isPlaying: false
    },
    onLoad: function (e) {
        // 生命周期函数--监听页面加载
        let postId = e.id;
        let postItem = postsData.postList[postId];
        this.setData({
            postId: postId,
            postItem: postItem
        });
        let postsCollected = wx.getStorageSync('posts_collected');
        let collected = postsCollected[postId]
        if (postsCollected) {
            collected = collected ? collected : false;
            this.setData({
                collected: collected
            });
            postsCollected[postId] = collected;
            wx.setStorageSync('posts_collected', postsCollected);
        } else {
            postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }
        this.setMusicMonitor();
    },

    setMusicMonitor: function () {
        let _page = this;
        wx.onBackgroundAudioPlay(function () {
            _page.setData({
                isPlaying: true
            });
        })
        wx.onBackgroundAudioPause(function () {
            _page.setData({
                isPlaying: false
            });
        })
    },
    onCollectionTap: function () {
        let postsCollected = wx.getStorageSync('posts_collected');
        let collected = postsCollected[this.data.postId];
        collected = !collected;
        postsCollected[this.data.postId] = collected;
        this.setData({
            collected: collected
        });
        this.showToast(collected);
        wx.setStorageSync('posts_collected', postsCollected);
    },

    showToast(collected) {
        wx.showToast({
            title: collected ? '收藏成功' : '取消收藏',
            icon: 'success',
            duration: 1000
        });
    },

    onShareTap: function () {
        let itemList = ['分享到微信', '分享到微信朋友圈', '分享到新浪微博', '分享到QQ', '分享到Facebook', '分享到Twitter'];
        let item = ['微信', '微信朋友圈', '新浪微博', 'QQ', 'FaceFacebook', 'Twiiter'];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: '#333',
            success: function (res) {
                console.log(res.tapIndex)
                if (res.tapIndex || res.tapIndex === 0) {
                    wx.showModal({
                        title: '分享',
                        content: `跳转至${item[res.tapIndex]}`,
                        showCancel: true,
                        cancelText: '取消分享',
                        cancelColor: '#666',
                        confirmText: '分享不了',
                        confirmColor: '#666'
                    })
                }
            }
        })
    },

    onMusicTap: function () {
        let isPlaying = this.data.isPlaying;
        let music = this.data.postItem.music
        if (isPlaying) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlaying: false
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl: music.url,
                title: music.title,
                coverImgUrl: music.coverImg
            })
            this.setData({
                isPlaying: true
            });
        }
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