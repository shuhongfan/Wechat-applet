import request from "../../utils/request";
Page({
    data: {
        // 导航便签数据
        videoGroupList: [],
        // 导航标识
        navID:'',
        // 视频列表数据
        videoList: [],
        // 视频id
        videoID: ''
    },
    onLoad: function (options) {
        // 获取导航数据
        this.getVideoGroupListData()
    },
    // 获取导航数据
    async getVideoGroupListData(){
        let videoGroupListData=await request('/video/group/list')
        this.setData({
            videoGroupList: videoGroupListData.data.slice(0,14),
            navID: videoGroupListData.data[0].id
        })
        // 获取视频数据
        this.getVideoList(this.data.navID)
    },
    // 获取视频数据
    async getVideoList(navid){
      let videoListData=await request('/video/group',{
          id: navid
      })
      // 关闭加载框
      wx.hideLoading()
      let index=0
      let videoList=videoListData.datas.map(item=>{
          item.id=index++
          return item
      })
      this.setData({
          videoList
      })
    },
    // 点击切换导航的回调
    changeNav(event){
        // 通过id向event传参的时候如果传的是number会自动转换成string
        let navid=event.currentTarget.id
        console.log(typeof navid)
        let navid1=event.currentTarget.dataset.id
        console.log(typeof navid1)
        this.setData({
            // navID:navid * 1
            // 将目标先转换成二进制 然后移动指定的位数
            // 右移0位会将非number强制转换为number
            navID:navid >>> 0,
            videoList: []
        })
        // 显示正在加载
        wx.showLoading({
            title: '正在加载'
        })
        // 动态获取当前导航对应的视频数据
        this.getVideoList(this.data.navID)
    },
    // 点击播放/继续播放的回调
    handlePlay (event){
        // 问题 多个视频同时播放的问题
        // 如何找到上一个视频的实例对象
        // 如何确定点击播放的视频和正在播放的视频不是同一个视频
        // 单例模式 需要创建多个对象的场景下 通过一个变量接收 始终保持只有一个对象
        let vid=event.currentTarget.id
        // 关闭上一个播放的视频
        this.vid !== vid && this.videoContext && this.videoContext.stop()
        this.vid=vid
        // 更新data中的videoID的状态数据
        this.setData({
            videoID:vid
        })
        // 创建控制video标签的实例对象
        this.videoContext = wx.createVideoContext(vid)
        this.videoContext.play()
    }
});
