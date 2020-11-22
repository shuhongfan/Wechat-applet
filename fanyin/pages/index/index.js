// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    bannerList: [],
    // 推荐歌单数据
    recommendList: [],
    // 排行榜数据
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 发送ajax获取数据
    // 获取轮播图banner
    let bannerData = await request('/banner',{
      type: 2
    })
    console.log('结果数据',bannerData);
    this.setData({
      bannerList: bannerData.banners
    })

    // 推荐歌单
    let recommendList = await request('/personalized',{
        limit: 10
    })
    console.log('结果数据',recommendList);
    this.setData({
      recommendList: recommendList.result
    })

    // 排行榜数据
    // 需要根据idx的值获取对应的数据
    // idx的取值范围是0-20 我们需要0-4
    let index=0
    let resultArr=[]
    while (index<5){
      let topListData = await request('/top/list',{
        idx: index++
      })
      let topListItem={
        name:topListData.playlist.name,
        tracks:topListData.playlist.tracks.slice(0,3)
      }
      console.log('结果数据',topListItem)
      resultArr.push(topListItem)
      // 更新toplist的状态值 会导致页面长时间白屏 用户体验差
      this.setData({
        topList: resultArr
      })
    }
  },
  // 跳转至recommendSong
  toRecommendSong () {
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
