
import { systemInfo } from './utils/systemInfo'
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },

    useCover: {
      type: Boolean,
      value: false
    },
    onlyBack: {
      type: Boolean,
      value: false
    },
    fontColor: {
      type: String,
      value: '#000'
    },
    backgroundColor: {
      type: String,
      value: '#fff'
    }
  },

  data: {
    isShowBack: true,
    showBackBtn: false,
    statusBarHeight: 0,
  },
  ready() {

  },
	pageLifetimes:{
		show(){
			this.pageMsgTip()
		}
	},
  lifetimes: {
    attached() {
      this.setStatusBarHeight()
      this.checkLocation()
    }
  },

  methods: {
    setStatusBarHeight() {
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight
      })
    },

    // home back 状态判断
    checkLocation() {
      const pages = getCurrentPages()
      const firstPage = pages[0]
      const currentPage = pages[pages.length -1]
      const route = currentPage.route

      this.setData({
        showBackBtn: pages.length > 1 // 页面栈大于一个页面显示返回按钮
      })
    },

    // 返回
    handleGoBack() {
      wx.navigateBack()
    },
  }
})