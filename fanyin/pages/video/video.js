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
        videoID: '',
        // video播放时长
        videoUpdateTime: [],
        // 表示下拉刷新是否被触发
        isTriggered: false
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
          videoList,
          // 关闭下拉刷新
          isTriggered:false
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
        // 判断当前的视频之前是否播放过，是否有播放记录，如果有跳转至指定的播放位置
        let {videoUpdateTime} = this.data
        let videoItem=videoUpdateTime.find(item=>item.vid===vid)
        if (videoItem){
            this.videoContext.seek(videoItem.currentTime)
        }
        this.videoContext.play()
    },
    // 监听视频播放进度的回调
    handleTimeUpdate(event){
        // console.log(event)
        let videoTimeObj={
            vid:event.currentTarget.id,
            currentTime:event.detail.currentTime
        }
        let { videoUpdateTime } = this.data
        // 判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放记录
        // 1.如果有，在原有的播放记录中修改播放时间为当前播放时间
        // 2.如果没有，需要在数组中添加当前视频的播放对象
        let videoItem = videoUpdateTime.find(item=>item.vid===videoTimeObj.vid)
        console.log(videoItem)
        if (videoItem){
            videoItem.currentTime=event.detail.currentTime
        } else {
            videoUpdateTime.push(videoTimeObj)
        }
        // 更新状态
        this.setData({
            videoTimeObj
        })
    },
    // 视频播放结束调用
    handleEnded (event){
        console.log('播放结束')
        // 移除记录播放时长数组中当前视频的对象
        let {videoUpdateTime}=this.data
        let id=videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id)
        videoUpdateTime.splice(id,1)
        this.setData({
            videoUpdateTime
        })
    },
    // 自定义下拉刷新回调
    handleReFresher () {
        console.log('scroll-view下拉刷新')
        // 再次发送请求 获取最新视频数据
        this.getVideoList(this.data.navID)
    },
    // 自定义上拉触底回调
    handleToLower (){
        console.log('scroll-view上拉刷新')
        // 模拟数据
        let newVideoList=[
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_54335D6264A5081FDE333FCC7967AFC7",
                    "coverUrl": "https://p2.music.126.net/iDGVkbY8GVSPpJ8Z2TiMMw==/109951164482072555.jpg",
                    "height": 360,
                    "width": 640,
                    "title": "我的天空。",
                    "description": null,
                    "commentCount": 710,
                    "shareCount": 1342,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 23195107
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 630000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/gsUvAbL9fMaqax1WlVcVbg==/109951164464343252.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 632700,
                        "birthday": 951897847918,
                        "userId": 1406891392,
                        "userType": 0,
                        "nickname": "诺尕_f5aK",
                        "signature": "别来打扰我的世界",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951164464343250,
                        "backgroundImgId": 109951165358333860,
                        "backgroundUrl": "http://p1.music.126.net/6bjy0kOCq24_JUmniL1PrA==/109951165358333861.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": null,
                        "djStatus": 0,
                        "vipType": 0,
                        "remarkName": null,
                        "avatarImgIdStr": "109951164464343252",
                        "backgroundImgIdStr": "109951165358333861",
                        "avatarImgId_str": "109951164464343252"
                    },
                    "urlInfo": {
                        "id": "54335D6264A5081FDE333FCC7967AFC7",
                        "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/KNL3H6rZ_2784184863_sd.mp4?ts=1605374694&rid=2EB5EC28FF14B2A0BAF85410CAF8780E&rl=3&rs=LzYKbAzdxQtvxPIhExvIOWZGXyMYEmvb&sign=d7180daa033be33ea468b22812ed8e56&ext=GwzkvwJmEEHbfVkuBbtC7GyEaNecNDNVjrxIU6JrlY6x5RSFfT%2FTY1rZ%2BkTQ1Xt3F%2FkGmhCcTXtpBAgUKsK13bvpCxtmmNmvqoBsJSFvBgIg9IX%2BcMwtrvYfAqcMf2CVfBRcNUdHmDCwNeEBuJGei1YpXMNXA4fShG0iSSTVaFtv%2FARRsoOC5Jtz7T7n2waews3yxWrnPAwpzjBDLdcRYLlZQxOh%2B4vawpfNdypMOSWrn41DjcgcXBenlhhjCyuK",
                        "size": 23195107,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 240
                    },
                    "videoGroup": [
                        {
                            "id": -8003,
                            "name": "#点赞榜#",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 3101,
                            "name": "综艺",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 4101,
                            "name": "娱乐",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": "groupTagRank"
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "54335D6264A5081FDE333FCC7967AFC7",
                    "durationms": 210084,
                    "playTime": 2326519,
                    "praisedCount": 13000,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_1494B79F36AA8023A7F0B6BCC08C6459",
                    "coverUrl": "https://p2.music.126.net/6DAVdrbFYHZIkeyhS2rr9w==/109951164003276159.jpg",
                    "height": 1080,
                    "width": 1392,
                    "title": "王杰30年前巅峰期唱的这首歌能把人唱哭，那时的嗓音非常有穿透力",
                    "description": null,
                    "commentCount": 404,
                    "shareCount": 376,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 21474455
                        },
                        {
                            "resolution": 480,
                            "size": 34050777
                        },
                        {
                            "resolution": 720,
                            "size": 48399516
                        },
                        {
                            "resolution": 1080,
                            "size": 77906365
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 110000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/-AM5QfYVSfsItPLTngJaEw==/109951163359806590.jpg",
                        "accountStatus": 0,
                        "gender": 0,
                        "city": 110101,
                        "birthday": -2209017600000,
                        "userId": 1471080915,
                        "userType": 0,
                        "nickname": "宇宙音乐榜",
                        "signature": "致力于打造全球最权威的音乐榜",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951163359806600,
                        "backgroundImgId": 109951162868126480,
                        "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "泛生活视频达人"
                        },
                        "djStatus": 0,
                        "vipType": 0,
                        "remarkName": null,
                        "avatarImgIdStr": "109951163359806590",
                        "backgroundImgIdStr": "109951162868126486",
                        "avatarImgId_str": "109951163359806590"
                    },
                    "urlInfo": {
                        "id": "1494B79F36AA8023A7F0B6BCC08C6459",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/LmZqHmde_2447803188_uhd.mp4?ts=1605374694&rid=2EB5EC28FF14B2A0BAF85410CAF8780E&rl=3&rs=YNbJmiKWieeAVpjJLycqcluoXzWdRfjl&sign=af65f3f6c9be4d5632adee507d9a7692&ext=GwzkvwJmEEHbfVkuBbtC7GyEaNecNDNVjrxIU6JrlY6x5RSFfT%2FTY1rZ%2BkTQ1Xt3F%2FkGmhCcTXtpBAgUKsK13bvpCxtmmNmvqoBsJSFvBgIg9IX%2BcMwtrvYfAqcMf2CVfBRcNUdHmDCwNeEBuJGei1YpXMNXA4fShG0iSSTVaFtv%2FARRsoOC5Jtz7T7n2waews3yxWrnPAwpzjBDLdcRYLlZQxOh%2B4vawpfNdypMOSUIMzgA2f47AQHFWVYNaPnU",
                        "size": 77906365,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 1080
                    },
                    "videoGroup": [
                        {
                            "id": -8013,
                            "name": "#人气飙升榜#",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 57105,
                            "name": "粤语现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 9102,
                            "name": "演唱会",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 57108,
                            "name": "流行现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": "groupTagRank"
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "1494B79F36AA8023A7F0B6BCC08C6459",
                    "durationms": 240606,
                    "playTime": 719059,
                    "praisedCount": 2588,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_DA1D736D707E4DF5658A626B78B94E21",
                    "coverUrl": "https://p2.music.126.net/XKq8VEA_WaQSjXxn4EulZA==/109951164703775180.jpg",
                    "height": 1080,
                    "width": 1920,
                    "title": "欧阳娜娜 - 突然好想你 & 拥抱",
                    "description": "",
                    "commentCount": 68,
                    "shareCount": 312,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 37439204
                        },
                        {
                            "resolution": 480,
                            "size": 65715400
                        },
                        {
                            "resolution": 720,
                            "size": 99748966
                        },
                        {
                            "resolution": 1080,
                            "size": 178333109
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 1000000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/9VFQB2a1GhhcRUdljExH6A==/109951164062450322.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 1001900,
                        "birthday": 576172800000,
                        "userId": 75064260,
                        "userType": 0,
                        "nickname": "摇滚仙人",
                        "signature": "一个痴迷布鲁斯，摇滚，爵士，放克的音乐宗教分子。",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951164062450320,
                        "backgroundImgId": 109951164062449780,
                        "backgroundUrl": "http://p1.music.126.net/-rYttwQxiNBS_4wsd0E4Jg==/109951164062449776.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "音乐视频达人"
                        },
                        "djStatus": 10,
                        "vipType": 11,
                        "remarkName": null,
                        "avatarImgIdStr": "109951164062450322",
                        "backgroundImgIdStr": "109951164062449776",
                        "avatarImgId_str": "109951164062450322"
                    },
                    "urlInfo": {
                        "id": "DA1D736D707E4DF5658A626B78B94E21",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/SmFUfHJr_2904907534_uhd.mp4?ts=1605374694&rid=2EB5EC28FF14B2A0BAF85410CAF8780E&rl=3&rs=ILNGpYrzJDgewjelCWovDiboaEDnQvUb&sign=ad33ce3c177ee806ac637c6a8e3a29e0&ext=GwzkvwJmEEHbfVkuBbtC7GyEaNecNDNVjrxIU6JrlY6x5RSFfT%2FTY1rZ%2BkTQ1Xt3F%2FkGmhCcTXtpBAgUKsK13bvpCxtmmNmvqoBsJSFvBgIg9IX%2BcMwtrvYfAqcMf2CVfBRcNUdHmDCwNeEBuJGei1YpXMNXA4fShG0iSSTVaFtv%2FARRsoOC5Jtz7T7n2waews3yxWrnPAwpzjBDLdcRYLlZQxOh%2B4vawpfNdypMOSUIMzgA2f47AQHFWVYNaPnU",
                        "size": 178333109,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 1080
                    },
                    "videoGroup": [
                        {
                            "id": -28413,
                            "name": "#【林宥嘉】#",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 198121,
                            "name": "欧阳娜娜",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 12100,
                            "name": "流行",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": "groupTagRank"
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "拥抱",
                            "id": 386542,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 13193,
                                    "name": "五月天",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": "600902000000534576",
                            "fee": 8,
                            "v": 48,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 38285,
                                "name": "我们是五月天",
                                "picUrl": "http://p4.music.126.net/v4V40sXKnaqsG0ACyY0aDg==/109951164912221924.jpg",
                                "tns": [],
                                "pic_str": "109951164912221924",
                                "pic": 109951164912221920
                            },
                            "dt": 252960,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 10120924,
                                "vd": -25000
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 6072572,
                                "vd": -22400
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 4048395,
                                "vd": -20700
                            },
                            "a": null,
                            "cd": "1",
                            "no": 4,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 0,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 684010,
                            "mv": 0,
                            "publishTime": 1049126400000,
                            "privilege": {
                                "id": 386542,
                                "fee": 8,
                                "payed": 0,
                                "st": 0,
                                "pl": 128000,
                                "dl": 0,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 999000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 68,
                                "preSell": false
                            }
                        },
                        {
                            "name": "突然好想你(Live)",
                            "id": 34614324,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 3685,
                                    "name": "林宥嘉",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": null,
                            "fee": 0,
                            "v": 694,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 3288038,
                                "name": " 热门华语281",
                                "picUrl": "http://p4.music.126.net/srjmIxgdjRlCXSjZtl2aaw==/109951163825045428.jpg",
                                "tns": [],
                                "pic_str": "109951163825045428",
                                "pic": 109951163825045420
                            },
                            "dt": 89991,
                            "h": null,
                            "m": null,
                            "l": {
                                "br": 96000,
                                "fid": 0,
                                "size": 1080573,
                                "vd": 100000
                            },
                            "a": null,
                            "cd": "01",
                            "no": 1,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 2,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 0,
                            "mv": 0,
                            "publishTime": 1388505600004,
                            "privilege": {
                                "id": 34614324,
                                "fee": 0,
                                "payed": 0,
                                "st": 0,
                                "pl": 96000,
                                "dl": 96000,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 96000,
                                "fl": 96000,
                                "toast": false,
                                "flag": 128,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "DA1D736D707E4DF5658A626B78B94E21",
                    "durationms": 331721,
                    "playTime": 373203,
                    "praisedCount": 2341,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_EB77249C86D6F6675578D06452924824",
                    "coverUrl": "https://p2.music.126.net/olBJTleRdq05SjkAbcytkQ==/109951164840957235.jpg",
                    "height": 720,
                    "width": 1280,
                    "title": "请回答1988 野菊花-你不要担心现场版",
                    "description": "因为请回答1988这部剧认识了野菊花乐队，流行于上世纪八九十年代的韩国殿堂级乐队，网上资料甚少，花甲之年带给我们震撼的现场体验。",
                    "commentCount": 146,
                    "shareCount": 1341,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 32815339
                        },
                        {
                            "resolution": 480,
                            "size": 57938479
                        },
                        {
                            "resolution": 720,
                            "size": 85812609
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 410000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/09CmKkf-kZM6VCvfX0Rycg==/1404076364723342.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 410100,
                        "birthday": 699457669922,
                        "userId": 338193176,
                        "userType": 0,
                        "nickname": "翔韵黯雅",
                        "signature": "",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 1404076364723342,
                        "backgroundImgId": 2002210674180203,
                        "backgroundUrl": "http://p1.music.126.net/bmA_ablsXpq3Tk9HlEg9sA==/2002210674180203.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": null,
                        "djStatus": 10,
                        "vipType": 0,
                        "remarkName": null,
                        "avatarImgIdStr": "1404076364723342",
                        "backgroundImgIdStr": "2002210674180203"
                    },
                    "urlInfo": {
                        "id": "EB77249C86D6F6675578D06452924824",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/avefvAQd_2922039030_shd.mp4?ts=1605374694&rid=2EB5EC28FF14B2A0BAF85410CAF8780E&rl=3&rs=aFZfsXGpZMnECHWTpBztbjKNwAEQiMWQ&sign=43a0c57f403100369ea140a05a21eef5&ext=GwzkvwJmEEHbfVkuBbtC7GyEaNecNDNVjrxIU6JrlY6x5RSFfT%2FTY1rZ%2BkTQ1Xt3F%2FkGmhCcTXtpBAgUKsK13bvpCxtmmNmvqoBsJSFvBgIg9IX%2BcMwtrvYfAqcMf2CVfBRcNUdHmDCwNeEBuJGei1YpXMNXA4fShG0iSSTVaFtv%2FARRsoOC5Jtz7T7n2waews3yxWrnPAwpzjBDLdcRYLlZQxOh%2B4vawpfNdypMOSWrn41DjcgcXBenlhhjCyuK",
                        "size": 85812609,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 720
                    },
                    "videoGroup": [
                        {
                            "id": -8006,
                            "name": "#分享榜#",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": "groupTagRank"
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "걱정말아요 그대",
                            "id": 28068737,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 128245,
                                    "name": "野菊花",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": "",
                            "fee": 8,
                            "v": 35,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 2720100,
                                "name": "들국화",
                                "picUrl": "http://p3.music.126.net/zPpMOPCZVuYDlLnD25o_UA==/109951163658947777.jpg",
                                "tns": [],
                                "pic_str": "109951163658947777",
                                "pic": 109951163658947780
                            },
                            "dt": 276163,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 11048795,
                                "vd": -28800
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 6629294,
                                "vd": -26199
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 4419544,
                                "vd": -24500
                            },
                            "a": null,
                            "cd": "2",
                            "no": 12,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 1,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 1410822,
                            "mv": 0,
                            "publishTime": 1386259200007,
                            "tns": [
                                "你不要担心"
                            ],
                            "privilege": {
                                "id": 28068737,
                                "fee": 8,
                                "payed": 0,
                                "st": 0,
                                "pl": 128000,
                                "dl": 0,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 999000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 68,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "EB77249C86D6F6675578D06452924824",
                    "durationms": 350792,
                    "playTime": 383295,
                    "praisedCount": 3131,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_4509B941D174FEE6F2D0697B750D3981",
                    "coverUrl": "https://p2.music.126.net/jOsq55eQU8U4tCdwb6LZQw==/109951163725487329.jpg",
                    "height": 1080,
                    "width": 1920,
                    "title": "没揭晓之前，你猜出来哪个是张宇了吗《都是月亮惹的祸》",
                    "description": "",
                    "commentCount": 1115,
                    "shareCount": 1154,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 30503867
                        },
                        {
                            "resolution": 480,
                            "size": 52610766
                        },
                        {
                            "resolution": 720,
                            "size": 78781447
                        },
                        {
                            "resolution": 1080,
                            "size": 122889933
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 230000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/YaziwMop753r1ZlCaYFdkw==/109951163710128957.jpg",
                        "accountStatus": 0,
                        "gender": 0,
                        "city": 230100,
                        "birthday": -2209017600000,
                        "userId": 1683743264,
                        "userType": 0,
                        "nickname": "好歌曲goodmusic",
                        "signature": "",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951163710128960,
                        "backgroundImgId": 109951162868126480,
                        "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "视频达人(华语、音乐现场)"
                        },
                        "djStatus": 0,
                        "vipType": 0,
                        "remarkName": null,
                        "avatarImgIdStr": "109951163710128957",
                        "backgroundImgIdStr": "109951162868126486",
                        "avatarImgId_str": "109951163710128957"
                    },
                    "urlInfo": {
                        "id": "4509B941D174FEE6F2D0697B750D3981",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/aqr2y8uJ_2186661097_uhd.mp4?ts=1605374694&rid=2EB5EC28FF14B2A0BAF85410CAF8780E&rl=3&rs=knveUvCTuCUdCgbIXEtjixUMMDjaQEcC&sign=96a701555f5a6333ca50083bcdb114dd&ext=GwzkvwJmEEHbfVkuBbtC7GyEaNecNDNVjrxIU6JrlY6x5RSFfT%2FTY1rZ%2BkTQ1Xt3F%2FkGmhCcTXtpBAgUKsK13bvpCxtmmNmvqoBsJSFvBgIg9IX%2BcMwtrvYfAqcMf2CVfBRcNUdHmDCwNeEBuJGei1YpXMNXA4fShG0iSSTVaFtv%2FARRsoOC5Jtz7T7n2waews3yxWrnPAwpzjBDLdcRYLlZQxOh%2B4vawpfNdypMOSUIMzgA2f47AQHFWVYNaPnU",
                        "size": 122889933,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 1080
                    },
                    "videoGroup": [
                        {
                            "id": -8013,
                            "name": "#人气飙升榜#",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 77102,
                            "name": "内地综艺",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 76108,
                            "name": "综艺片段",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 3101,
                            "name": "综艺",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 4101,
                            "name": "娱乐",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": "groupTagRank"
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": [
                        111
                    ],
                    "relateSong": [
                        {
                            "name": "月亮惹的祸",
                            "id": 5243631,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 6469,
                                    "name": "张宇",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": "600902000005653853",
                            "fee": 8,
                            "v": 886,
                            "crbt": "b22bf03548f1da6b0416cc813fe218de",
                            "cf": "",
                            "al": {
                                "id": 511419,
                                "name": "大人的情歌",
                                "picUrl": "http://p4.music.126.net/cV5aZJ4et-Nm-5Mj74afoQ==/107752139539289.jpg",
                                "tns": [],
                                "pic": 107752139539289
                            },
                            "dt": 260773,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 10433350,
                                "vd": -2
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 6260027,
                                "vd": -1
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 4173366,
                                "vd": -1
                            },
                            "a": null,
                            "cd": "1",
                            "no": 9,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 1,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 13009,
                            "mv": 0,
                            "publishTime": 1256832000000,
                            "privilege": {
                                "id": 5243631,
                                "fee": 8,
                                "payed": 0,
                                "st": 0,
                                "pl": 128000,
                                "dl": 0,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 999000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 256,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "4509B941D174FEE6F2D0697B750D3981",
                    "durationms": 241627,
                    "playTime": 2553335,
                    "praisedCount": 10075,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_4456BA63ECE633EB910EA46A1A3F6EF3",
                    "coverUrl": "https://p2.music.126.net/EzKoKQxVrwkcSf5AFtTTUA==/109951163671525728.jpg",
                    "height": 1080,
                    "width": 1920,
                    "title": "空灵女声翻唱Demi Lovato-Sober( The Voice Kids)",
                    "description": "空灵女声翻唱Demi Lovato-Sober( The Voice Kids)",
                    "commentCount": 290,
                    "shareCount": 856,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 13024189
                        },
                        {
                            "resolution": 480,
                            "size": 23134503
                        },
                        {
                            "resolution": 720,
                            "size": 35341428
                        },
                        {
                            "resolution": 1080,
                            "size": 55990158
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 320000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/fzQHvzcuOyJX41PCfN8OCQ==/109951164426031658.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 320500,
                        "birthday": -2209017600000,
                        "userId": 134733911,
                        "userType": 204,
                        "nickname": "cycmx",
                        "signature": "",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951164426031660,
                        "backgroundImgId": 109951164125634980,
                        "backgroundUrl": "http://p1.music.126.net/64s4Y0IcTocyWkvFpI1N_Q==/109951164125634970.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "音乐视频达人"
                        },
                        "djStatus": 0,
                        "vipType": 10,
                        "remarkName": null,
                        "avatarImgIdStr": "109951164426031658",
                        "backgroundImgIdStr": "109951164125634970",
                        "avatarImgId_str": "109951164426031658"
                    },
                    "urlInfo": {
                        "id": "4456BA63ECE633EB910EA46A1A3F6EF3",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/g9IvA01o_2127534008_uhd.mp4?ts=1605374694&rid=2EB5EC28FF14B2A0BAF85410CAF8780E&rl=3&rs=NRwdNiLaiDLuqEYYpTbvimCVRkCqazxF&sign=3e838a5176dde7f3a6ea1ceb914b4da0&ext=GwzkvwJmEEHbfVkuBbtC7GyEaNecNDNVjrxIU6JrlY6x5RSFfT%2FTY1rZ%2BkTQ1Xt3F%2FkGmhCcTXtpBAgUKsK13bvpCxtmmNmvqoBsJSFvBgIg9IX%2BcMwtrvYfAqcMf2CVfBRcNUdHmDCwNeEBuJGei1YpXMNXA4fShG0iSSTVaFtv%2FARRsoOC5Jtz7T7n2waews3yxWrnPAwpzjBDLdcRYLlZQxOh%2B4vawpfNdypMOSUIMzgA2f47AQHFWVYNaPnU",
                        "size": 55990158,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 1080
                    },
                    "videoGroup": [
                        {
                            "id": -34323,
                            "name": "#适合3D环绕音效的歌曲#",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 199122,
                            "name": "Demi Lovato",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 75122,
                            "name": "欧美综艺",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 76108,
                            "name": "综艺片段",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 3101,
                            "name": "综艺",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 4101,
                            "name": "娱乐",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": "groupTagRank"
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "Sober",
                            "id": 574648240,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 53236,
                                    "name": "Demi Lovato",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 90,
                            "st": 0,
                            "rt": null,
                            "fee": 1,
                            "v": 5,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 39779074,
                                "name": "Sober",
                                "picUrl": "http://p3.music.126.net/-ijGWJqLQ7jklVdLI6MQ8w==/109951163369271898.jpg",
                                "tns": [],
                                "pic_str": "109951163369271898",
                                "pic": 109951163369271900
                            },
                            "dt": 197929,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 7918280,
                                "vd": -2
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 4750986,
                                "vd": 689
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 3167338,
                                "vd": 0
                            },
                            "a": null,
                            "cd": "1",
                            "no": 1,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 1,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 7003,
                            "mv": 10729026,
                            "publishTime": 1529510400007,
                            "privilege": {
                                "id": 574648240,
                                "fee": 1,
                                "payed": 0,
                                "st": 0,
                                "pl": 0,
                                "dl": 0,
                                "sp": 0,
                                "cp": 0,
                                "subp": 0,
                                "cs": false,
                                "maxbr": 320000,
                                "fl": 0,
                                "toast": false,
                                "flag": 1028,
                                "preSell": false
                            }
                        },
                        {
                            "name": "Straw House",
                            "id": 1350633090,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 33960642,
                                    "name": "Jade",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 75,
                            "st": 0,
                            "rt": "",
                            "fee": 8,
                            "v": 7,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 75796609,
                                "name": "Straw House",
                                "picUrl": "http://p3.music.126.net/IsMv9R-SjnnzIGYBTLBf1g==/109951163910726908.jpg",
                                "tns": [],
                                "pic_str": "109951163910726908",
                                "pic": 109951163910726910
                            },
                            "dt": 189048,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 7563015,
                                "vd": 0
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 4537826,
                                "vd": 0
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 3025232,
                                "vd": 0
                            },
                            "a": null,
                            "cd": "01",
                            "no": 1,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 1,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 7003,
                            "mv": 0,
                            "publishTime": 1551974400000,
                            "privilege": {
                                "id": 1350633090,
                                "fee": 8,
                                "payed": 0,
                                "st": 0,
                                "pl": 128000,
                                "dl": 0,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 320000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 4,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "4456BA63ECE633EB910EA46A1A3F6EF3",
                    "durationms": 123182,
                    "playTime": 1003496,
                    "praisedCount": 6470,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_EDFA39067E51F788874421F2D0365D69",
                    "coverUrl": "https://p2.music.126.net/sYVC02VXscaIgqJGq2oeLA==/109951163208029968.jpg",
                    "height": 720,
                    "width": 960,
                    "title": "王菲与四大天王罕见同台飙歌，那时候的天王天后都好青涩啊",
                    "description": "王菲与四大天王罕见同台飙歌",
                    "commentCount": 218,
                    "shareCount": 393,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 28915732
                        },
                        {
                            "resolution": 480,
                            "size": 41315105
                        },
                        {
                            "resolution": 720,
                            "size": 65972501
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 110000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/TpLcBEoUYXOugyntzfilyQ==/1371091011899584.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 110101,
                        "birthday": 1561219200000,
                        "userId": 293753445,
                        "userType": 0,
                        "nickname": "苏生不惑",
                        "signature": "",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 1371091011899584,
                        "backgroundImgId": 2002210674180200,
                        "backgroundUrl": "http://p1.music.126.net/45Nu4EqvFqK_kQj6BkPwcw==/2002210674180200.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": null,
                        "djStatus": 0,
                        "vipType": 0,
                        "remarkName": null,
                        "avatarImgIdStr": "1371091011899584",
                        "backgroundImgIdStr": "2002210674180200"
                    },
                    "urlInfo": {
                        "id": "EDFA39067E51F788874421F2D0365D69",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/mdDWUiPl_148969038_shd.mp4?ts=1605374694&rid=2EB5EC28FF14B2A0BAF85410CAF8780E&rl=3&rs=RWaZxnldkXRoOPhvDLdreIgptLosCtyO&sign=3fcafa7b9ce1492bf95c16f85a13c526&ext=GwzkvwJmEEHbfVkuBbtC7GyEaNecNDNVjrxIU6JrlY6x5RSFfT%2FTY1rZ%2BkTQ1Xt3F%2FkGmhCcTXtpBAgUKsK13bvpCxtmmNmvqoBsJSFvBgIg9IX%2BcMwtrvYfAqcMf2CVfBRcNUdHmDCwNeEBuJGei1YpXMNXA4fShG0iSSTVaFtv%2FARRsoOC5Jtz7T7n2waews3yxWrnPAwpzjBDLdcRYLlZQxOh%2B4vawpfNdypMOSWrn41DjcgcXBenlhhjCyuK",
                        "size": 65972501,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 720
                    },
                    "videoGroup": [
                        {
                            "id": -28031,
                            "name": "#张惠妹，莫文蔚，林忆莲，孙燕姿，王菲#",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 16127,
                            "name": "王菲",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 14146,
                            "name": "兴奋",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 13222,
                            "name": "华语",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 12100,
                            "name": "流行",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": "groupTagRank"
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "人间",
                            "id": 300062,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 9621,
                                    "name": "王菲",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": "",
                            "fee": 1,
                            "v": 228,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 29739,
                                "name": "王菲",
                                "picUrl": "http://p3.music.126.net/6DS0esuwYLLgf9VyYi4R1A==/109951163165829326.jpg",
                                "tns": [],
                                "pic_str": "109951163165829326",
                                "pic": 109951163165829330
                            },
                            "dt": 285266,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 11413464,
                                "vd": 47
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 6848096,
                                "vd": -2
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 4565412,
                                "vd": -2
                            },
                            "a": null,
                            "cd": "1",
                            "no": 5,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 2,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 600011,
                            "mv": 93819,
                            "publishTime": 875203200007,
                            "privilege": {
                                "id": 300062,
                                "fee": 1,
                                "payed": 0,
                                "st": 0,
                                "pl": 0,
                                "dl": 0,
                                "sp": 0,
                                "cp": 0,
                                "subp": 0,
                                "cs": false,
                                "maxbr": 999000,
                                "fl": 0,
                                "toast": false,
                                "flag": 1284,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "EDFA39067E51F788874421F2D0365D69",
                    "durationms": 244127,
                    "playTime": 184465,
                    "praisedCount": 1219,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_FA58FA9EF83FEFD703FADA0E9CCABE7C",
                    "coverUrl": "https://p2.music.126.net/vIzFVxaA7zGDU6L9uhe2BQ==/109951163957536356.jpg",
                    "height": 720,
                    "width": 1280,
                    "title": "徐怀钰演唱《踏浪》，这首歌真是引领了广场舞风潮！",
                    "description": "徐怀钰演唱《踏浪》，这首歌真是引领了广场舞风潮！",
                    "commentCount": 208,
                    "shareCount": 352,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 27493919
                        },
                        {
                            "resolution": 480,
                            "size": 46257093
                        },
                        {
                            "resolution": 720,
                            "size": 63100734
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 710000,
                        "authStatus": 0,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/5o854xH3bkGHwLpa0AOuRA==/109951163650074554.jpg",
                        "accountStatus": 0,
                        "gender": 1,
                        "city": 710100,
                        "birthday": -2209017600000,
                        "userId": 1664328643,
                        "userType": 0,
                        "nickname": "台灣音樂風雲榜",
                        "signature": "權威音樂榜單持續即時更新，最新發片動態，歌曲MV，及時更新。合作投稿請私訊！",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951163650074560,
                        "backgroundImgId": 109951164316932430,
                        "backgroundUrl": "http://p1.music.126.net/-So6gvMBSiEWeBnPii7QDg==/109951164316932439.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "视频达人(华语、音乐现场)"
                        },
                        "djStatus": 0,
                        "vipType": 0,
                        "remarkName": null,
                        "avatarImgIdStr": "109951163650074554",
                        "backgroundImgIdStr": "109951164316932439",
                        "avatarImgId_str": "109951163650074554"
                    },
                    "urlInfo": {
                        "id": "FA58FA9EF83FEFD703FADA0E9CCABE7C",
                        "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/sOfLTluS_2406606611_shd.mp4?ts=1605374694&rid=2EB5EC28FF14B2A0BAF85410CAF8780E&rl=3&rs=LrWTcHxjpcTuoEZNextoBlohsVffXvaz&sign=c676e431dedc53a496f38ffd4aecbffe&ext=GwzkvwJmEEHbfVkuBbtC7GyEaNecNDNVjrxIU6JrlY6x5RSFfT%2FTY1rZ%2BkTQ1Xt3F%2FkGmhCcTXtpBAgUKsK13bvpCxtmmNmvqoBsJSFvBgIg9IX%2BcMwtrvYfAqcMf2CVfBRcNUdHmDCwNeEBuJGei1YpXMNXA4fShG0iSSTVaFtv%2FARRsoOC5Jtz7T7n2waews3yxWrnPAwpzjBDLdcRYLlZQxOh%2B4vawpfNdypMOSWrn41DjcgcXBenlhhjCyuK",
                        "size": 63100734,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 720
                    },
                    "videoGroup": [
                        {
                            "id": -15367,
                            "name": "#怀旧金曲 经典老歌#",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 59101,
                            "name": "华语现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 59108,
                            "name": "巡演现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 57108,
                            "name": "流行现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": "groupTagRank"
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": "groupTagRank"
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "踏浪",
                            "id": 308212,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 9954,
                                    "name": "徐怀钰",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": "600902000008005262",
                            "fee": 8,
                            "v": 31,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 30599,
                                "name": "Love",
                                "picUrl": "http://p4.music.126.net/fuF52Q42eGWHh8OyOVUS6Q==/7696581395515203.jpg",
                                "tns": [],
                                "pic": 7696581395515203
                            },
                            "dt": 244733,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 9791782,
                                "vd": -2
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 5875087,
                                "vd": -1
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 3916739,
                                "vd": -1
                            },
                            "a": null,
                            "cd": "1",
                            "no": 10,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 0,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 684010,
                            "mv": 0,
                            "publishTime": 946656000004,
                            "privilege": {
                                "id": 308212,
                                "fee": 8,
                                "payed": 0,
                                "st": 0,
                                "pl": 128000,
                                "dl": 0,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 999000,
                                "fl": 128000,
                                "toast": false,
                                "flag": 68,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "FA58FA9EF83FEFD703FADA0E9CCABE7C",
                    "durationms": 239024,
                    "playTime": 657622,
                    "praisedCount": 2160,
                    "praised": false,
                    "subscribed": false
                }
            }
        ]
        let videoList=this.data.videoList
        videoList.push(...newVideoList)
        this.setData({
            videoList
        })
    },
    // 页面下拉刷新
    onPullDownRefresh() {
        console.log('页面下拉刷新')
    },
    // 页面的上拉触底
    onReachBottom() {
        console.log('页面的上拉触底')
    },
    // 用户点击右上角分享
    onShareAppMessage({from}) {
        console.log(from)
        // button：页面内转发按钮
        // menu：右上角转发菜单
        if (from==='button'){
            return{
                title:'来自button的转发',
                page:'/pages/video/video',
                imageUrl:'/static/images/nvsheng.jpg'
            }
        } else {
            return{
                title:'来自menu的转发',
                page:'/pages/video/video',
                imageUrl:'/static/images/nvsheng.jpg'
            }
        }
    },
    // 跳转搜索界面
    toSearch (){
        wx.navigateTo({
            url:'/pages/search/search'
        })
    }
});
