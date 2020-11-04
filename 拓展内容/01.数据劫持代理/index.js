// vue数据劫持代理

// 模拟vue中data选项

let data={
    username:'curry',
    age:33
}

// 模拟组件的实例
let _this={

}

// 利用object.defineProperty()
for (let item in data) {
    // console.log(item,data[item])
    Object.defineProperty(_this,item,{
        // get用来获取扩展属性值 当获取该属性值的时候调用get方法
        get(){
            console.log('get()')
            return data[item]
        },
        // set 监视扩展属性的 只要已修改就调用
        set(newVal) {
            console.log('set()',newVal)
            // 千万不要在set方法中修改当前扩展属性的值 会出现死循环
            // _this.username=newVal;
            data[item]=newVal
        }
    })
}
console.log(_this)

// 通过Object.defineProperty()的get方法添加的扩展属性不能直接对象.属性修改
_this.username='wide'
console.log(_this.username)
