/*数据绑定
1.小程序
1.1data中初始化数据
1.2修改数据 this.setData() 始终同步
1.3数据流 单向 Model-》View

2.vue
2.1data中初始化数据
2.2修改数据 this.key=value
2.3数据流 单向 Model-》view
2.4vue实现了双向数据绑定 v-model

3.React
3.1state中初始化数据
3.2修改数据 this.setState()
3.3自身钩子函数中 componentDidMount 异步
3.4非自身钩子函数中 定时器的回调 同步的
3.5数据流 单向 model->view


事件流的三个阶段
1.捕获 从外向内
2.执行目标阶段
3.冒泡 从内向外
bindtab 冒泡
catchtab 非冒泡

获取用户基本信息
1.用户未授权 首次登陆 button open-type='getUserInfo'
2.用户已经授权 再次登录 wx.getUserInfo


*/