import { defineStore } from 'pinia'

export const useMiniAppStore = defineStore('miniapp', {
  state: () => ({
    isMiniApp: false,
    initData: null,
    user: null,
  }),

  actions: {
    init() {
      const webapp = window.Telegram?.WebApp
      if (!webapp) {
        this.isMiniApp = false
        return
      }

      webapp.ready()

      this.isMiniApp = true
      this.initData = webapp.initData || null
      this.user = webapp.initDataUnsafe?.user || null

      console.log("[MiniApp] initData:", this.initData)
      console.log("[MiniApp] initDataUnsafe.user:", this.user)
    }
  }
})
