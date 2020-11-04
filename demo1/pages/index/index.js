// pages/index/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'初始化测试数据',
    userinfo: ''
  },
  handleParent(){
    console.log('parent');
  },
  handleChild(){
    console.log('child');
  },
  // 跳转到logs
  toLogs(){
    wx.reLaunch({
      url: '/pages/logs/logs',
    })
  },
  // 获取用户信息的回调
  handleGetUserInfo(res){
    console.log(res);
    if(res.detail.userInfo){
      this.setData({
        userinfo: res.detail.userInfo
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad监听页面加载');
    // console.log(this);
    // console.log(this.data.msg);
    // setTimeout(()=>{
    //   this.setData({
    //     msg:"修改之后的数据"
    //   })
    //   console.log(this.data.msg);
    // },2000)
    wx.getUserInfo({
      success:(res)=>{
        console.log(res)
        this.setData({
          userinfo:res.userInfo,
          msg:res.nickName
        })
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload');
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