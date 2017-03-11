Page({
    onTap: function (event) {
        // wx.navigateTo({
        //   url: '../posts/post',
        //   success: function(res){
        //     // success
        //   },
        //   fail: function() {
        //     // fail
        //   },
        //   complete: function() {
        //     // complete
        //   }
        // })    

        wx.switchTab({
          url: '../posts/post'
        })
    }
})