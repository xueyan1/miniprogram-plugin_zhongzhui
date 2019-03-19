// plugin/pages/C_xfd_introduce/xfdintroduce.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 20 // 时间间隔
  },

  /**
   * 组件的方法列表
   */
  methods: {
    run1(){
      var vm = this;
      var interval = setInterval(function () {
        if (-vm.data.marqueeDistance < vm.data.length) {
          vm.setData({
            marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
          });
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance: vm.data.windowWidth
          });
          //vm.run1();
        }
      }, vm.data.interval);
    }
  },
  ready(){
    var vm = this;
   // var length = vm.data.text.length * vm.data.size;//文字长度
    let scale = wx.getSystemInfoSync().screenWidth / 750;
    var length = scale * 750
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
    });
    //vm.run1();// 水平一行字滚动完了再按照原来的方向滚动
  }
})
