import request from "../../utils/request";
// 获取全局实例
const appInstance = getApp()

Page({
    data: {
        // 音乐是否播放
        isPlay: false,
        // 歌曲详情对象
        song:{},
        // 音乐id
        musicId: ''
    },
    onLoad: function (options) {
        // options用来接收路由跳转的query参数
        // 原生小程序中路由传参，对参数的长度有限制
        // console.log(options)
        // console.log(JSON.parse(options.song))
        let musicId=options.musicId
        this.setData({
            musicId
        })
        this.getMusicInfo(musicId)

        // 判断当前页面音乐是否在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId===musicId){
            this.setData({
                isPlay:true
            })
        }

        // 如果用户操作系统的控制音乐播放、暂停按钮，页面不知道，导致页面显示的播放状态不一致
        // 通过控制音频的实例backgroundAudioManager 去监视音乐的播放、暂停
        // 创建控制音乐播放的实例
        this.backgroundAudioManager=wx.getBackgroundAudioManager()
        this.backgroundAudioManager.onPlay(()=>{
            console.log('Play')
            this.changePlayState(true)
            // 修改全局音乐播放的状态
            appInstance.globalData.musicId=musicId
        })
        this.backgroundAudioManager.onPause(()=>{
            console.log('Pause')
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onStop(()=>{
            console.log('Stop')
            this.changePlayState(false)
        })
    },
    // 点击播放暂停回调
    handleMusicPlay (){
        let isPlay=!this.data.isPlay
        // 修改是否播放状态
        // this.setData({
        //     isPlay
        // })
        let {musicId}=this.data
        this.musicControl(isPlay,musicId)
    },
    // 获取音乐详情功能函数
    async getMusicInfo(musicId){
        let songData=await request('/song/detail',{
            ids:musicId
        })
        this.setData({
            song:songData.songs[0]
        })
        // 动态修改标题
        wx.setNavigationBarTitle({
            title:this.data.song.name + ' - 凡音'
        })
    },
    // 控制音乐播放、暂停的功能函数
    async musicControl(isPlay,musicId){
        if (isPlay){ // 音乐播放
            // 获取音乐播放链接
            let musicLinkData=await request('/song/url',{
                id:musicId
            })
            let musicLink=musicLinkData.data[0].url


            this.backgroundAudioManager.src=musicLink
            this.backgroundAudioManager.title=this.data.song.name + ' - 凡音'
        } else { // 暂停
            this.backgroundAudioManager.pause()
        }
    },
    // 修改播放状态的功能函数
    changePlayState(isPlay){
        // 修改是否播放状态
        this.setData({
            isPlay
        })
        // 修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay=isPlay
    }
});
