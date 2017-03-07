var postsData = require('../../../data/posts-data.js')

Page({
    onLoad: function (options) {
        var postId = options.id;
        var postData = postsData.postList[postId];
        this.setData({postData,postId});

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
    },

    onColletionTap: function(event){
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.postId];
        postCollected = !postCollected;
        postsCollected[this.data.postId] = postCollected;
        // 更新文章是否缓存
        wx.setStorageSync('posts_collected',postsCollected);
        // 更新数据绑定变量，从而实现图片切换
        this.setData({collected:postCollected})

        console.log("lishi : " + this.data.postId)        
    }
    
})