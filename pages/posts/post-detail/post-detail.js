var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({

    data: {
        isPalyingMusic: false
    },

    onLoad: function (options) {
        var globalData = app.globalData;
        var postId = options.id;
        var postData = postsData.postList[postId];
        this.setData({ postData, postId });

        // var postsCollected = {
        //     1:"true",
        //     2:"false",
        //     3:"true"
        // }

        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({ collected: postCollected });
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        if (app.globalData.g_isPlayingMusic
        && app.globalData.g_currentMusicPostId == postId) {
            this.setData({
                isPalyingMusic : true
            })
        }
        this.setAudioMonitor();
    },

    setAudioMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            // callback
            that.setData({
                isPalyingMusic: true
            })
        });

        wx.onBackgroundAudioPause(function () {
            // callback
            that.setData({
                isPalyingMusic: false
            })
        })
    },

    onColletionTap: function (event) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.postId];
        postCollected = !postCollected;
        postsCollected[this.data.postId] = postCollected;

        this.showToast(postsCollected, postCollected);


    },

    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
            showCancle: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    // 更新文章是否缓存
                    wx.setStorageSync('posts_collected', postsCollected);
                    // 更新数据绑定变量，从而实现图片切换
                    that.setData({ collected: postCollected })
                }
            }
        })
    },

    showToast(postsCollected, postCollected) {
        // 更新文章是否缓存
        wx.setStorageSync('posts_collected', postsCollected);
        // 更新数据绑定变量，从而实现图片切换
        this.setData({ collected: postCollected })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消收藏",
            duration: 1000
        })
    },

    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户点击了取消
                // res.tapIndex 数组元素的序号，从0开始、
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能~"
                })
            }
        })
    },

    onMusicTap: function (event) {
        var currentPostId = this.data.postId;
        var postData = postsData.postList[currentPostId];
        var isPalyingMusic = this.data.isPalyingMusic;
        if (isPalyingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({ isPalyingMusic: false });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            });
            this.setData({ isPalyingMusic: true });
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = null;
        }

    }

})