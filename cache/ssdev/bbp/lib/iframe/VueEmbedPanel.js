$class('ssdev.bbp.lib.iframe.VueEmbedPanel', {
  extend: 'ssdev.ux.vue.VueContainer',
  html: `<iframe :src="src" width="100%" height="100%" frameborder="no" style="vertical-align:text-top"></iframe>`,

  initComponent: function (conf) {
    var me = this
    var src = me.getUrl()
    me.data = {
      src: src
    }
    if (conf.disableScroll) {
      me.html = `<iframe :src="src" width="100%" height="100%" frameborder="no"  scrolling="no" style="vertical-align:text-top"></iframe>`
    }
    me.callParent(arguments)
  },

  getUrl: function () {
    var me = this
    var props = me.conf.properties, site = props.site
    if (!site) {
      var path = window.location.href
      if (props.appName) {
        path = path.replace(/\/([\w_-]+)\//.exec(path)[1], props.appName)
        site = path
      }
      if (props.port) {
        path = path.replace(/:([0-9]+)/.exec(path)[1], props.port)
        site = path
      }
    }
    if (site && props.param) {
      site += props.param
    }
    var urt = $env.globalContext.get('urt')
    if (urt) {
      var orgId = urt.userRoleDepts ? urt.userRoleDepts.orgId : urt.orgId
      var orgCd = urt.userRoleDepts ? urt.userRoleDepts.orgCd : urt.orgCd
      if (site.indexOf('?') != -1) {
        site += `&uid=${urt.userId}&urt=${urt.id}&tenantId=${urt.tenantId}&orgId=${orgId}&orgCd=${orgCd}`
      } else {
        site += `?uid=${urt.userId}&urt=${urt.id}&tenantId=${urt.tenantId}&orgId=${orgId}&orgCd=${orgCd}`
      }
      var deptId = urt.userRoleDepts ? urt.userRoleDepts.deptId : urt.deptId
      if (deptId) {
        site += `&deptId=${deptId}`
      }
      var deptCd = urt.userRoleDepts ? urt.userRoleDepts.deptCd : urt.deptCd
      if (deptCd) {
        site += `&deptCd=${deptCd}`
      }
      var deptName = urt.userRoleDepts ? urt.userRoleDepts.deptName : urt.deptName
      if (deptName) {
        site += `&deptName=${deptName}`
      }
      var personCd = urt.userRoleDepts ? urt.userRoleDepts.personCd : urt.personCd
      if (personCd) {
        site += `&personCd=${personCd}`
      }
      var userName = urt.userName
      if (userName) {
        site += `&userName=${userName}`
      }
    }
    return site
  },

  afterAppend: function () {
    var me = this
    $nextTick(function () {
      var iframe = me.el
      iframe.track = false
      setInterval(function () {
        if (document.activeElement) {
          var activeElement = document.activeElement   // 返回当前获取焦点元素
          if (activeElement === iframe) {
            if (iframe.track === false) {
              iframe.track = true
              if (window.$portal) {
                window.$portal.el.click()
              }
            }
          } else {
            iframe.track = false
          }
        }
      }, 300)
    })
    me.openListener = function (e) {
      me.openWindow(e, me.conf.cd)
    }
    window.addEventListener('message', me.openListener)
  },

  openWindow: function (e, target) {
    var data = JSON.parse(e.data)
    if (target && target === data.target) {
      try {
        nodeRequire('child_process').exec(`${process.platform === 'darwin' ? 'open ' : 'start "" '}"${data.url}"`)
      } catch (e) {
        window.open(data.url)
      }
    }
  },

  destroy: function () {
    var me = this
    window.removeEventListener('message', me.openListener)
    me.callParent(arguments)
  }
})
