import request from "../../utils/request";
Page({
    data: {
        // 天
        day:'',
        // 日
        month:'',
        // 推荐列表数据
        recommendList:[]
    },
    onLoad: function (options) {
        // 判断用户是否登录
        let userInfo=wx.getStorageSync('userInfo')
        if (!userInfo){
            wx.showToast({
                title:'请先登录',
                icon:"none",
                success:()=>{
                    // 跳转到登录页
                    wx.reLaunch({
                        url:'/pages/login/login'
                    })
                }
            })
        }
        // 更新日期的状态数据
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth()+1
        })
        // 获取每日推荐数据
        this.getRecommendList()
    },
    // 获取每日推荐数据
   async getRecommendList(){
        let recommendListData=await request('/recommend/songs')
       this.setData({
           recommendList: recommendListData.recommend
       })
   }
});
