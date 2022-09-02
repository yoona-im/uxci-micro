$class('com.bsoft.bbpextend.front.HIPEmbedPanel', {
    extend: '/ssdev.ux.vue.VueContainer',
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
            var personCd = urt.userRoleDepts ? urt.userRoleDepts.personCd : urt.personCd
            if (personCd) {
                site += `&personCd=${personCd}`
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

        // 添加全局监听的调用方法
        window.addEventListener("message", function (event) {
            hip_tabOpen2(event.data);
        }, false);

        const hip_tabOpen2 = function (data) {
            var randomValue = Math.ceil(Math.random() * 10)
            if (data.url.indexOf('#') != -1) {
                var url = data.url.split('#')[0]
                var hash = data.url.split('#')[1]
                if (url.indexOf('?') != -1) {
                    url += '&randomValue=' + randomValue
                } else {
                    url += '?randomValue=' + randomValue
                }
                data.url = url + '#' + hash
            } else {
                if (data.url.indexOf('?') !== -1) {
                    data.url += '&randomValue=' + randomValue
                } else {
                    data.url += '?randomValue=' + randomValue
                }
            }

            data.target = data.target || 'oneTab'
            if (data.target === 'blank') {
                window.open(data.url)
            } else if (data.target === 'newTab') {
                data.id = new Date().getTime() + '' + Math.ceil(Math.random() * 100000)
            } else {
                for (let key in me.$subPortal.tabovers) {
                    if (me.$subPortal.tabovers[key].name === data.title) {
                        data.id = me.$subPortal.tabovers[key].id
                        break
                    }
                }
                data.id = data.id || new Date().getTime() + '' + Math.ceil(Math.random() * 100000)
            }

            me.$subPortal.openModule({
                id: data.id,
                name: data.title,
                url: 'com.bsoft.bbpextend.front.VueEmbedPanel',
                properties: {
                    loader: 'web-vue2',
                    site: data.url
                }
            }, {
                site: data.url
            });
        }

        // 调取门户，打开新TAB页   shaobt
        const hip_tabOpen = function (data) {
            if (data.type == "1") { // 新TAB页中显示子应用系统回传的页面
                openTab(data.script, data.prop, data.title);
            } else if (data.type == "2") {  // 新TAB页中显示门户里某个菜单，并跳转菜单
                showNewTabDumpMenu(data);
            } else if (data.type == "3") {  // 新TAB页中显示门户里某个菜单，但不跳转菜单
                showNewTab(data);
            }
        }

        // 新TAB页中显示门户里某个菜单，并跳转菜单
        const showNewTabDumpMenu = function (data) {
            var appId = data.appId
            var catalogId = data.categoryId
            var moduleId = data.moduleId
            if (this.mainApp) {
                var desktop = this.mainApp.desktop
                var topview = desktop.topview
                var i = topview.getStore().indexOfId(appId)
                if (!topview.isSelected(i)) {
                    desktop.onTopTabClick(topview, i)
                    topview.select(i)
                }
                var navView = desktop.navView
                i = navView.getStore().indexOfId(catalogId)
                var pel = desktop.getNavElement(catalogId)
                if (!navView.isSelected(i) && pel.dom.childNodes.length == 0) {
                    desktop.onBeforeExpand(navView, i)
                }
                navView.select(i)
                var moduleView = desktop.moduleView[catalogId]
                i = moduleView.getStore().indexOfId(moduleId)
                desktop.onNavClick(moduleView, i)
                if (desktop.activeModules[moduleId]) {
                    moduleView.select(i)
                }
                if (this.win) {
                    this.win.hide()
                }
            }
        }

        // 新TAB页中显示门户里某个菜单，但不跳转菜单
        const showNewTab = function (data) {
            var appId = data.appId;
            var catalogId = data.categoryId;
            var moduleId = data.moduleId;
            if (this.mainApp) {
                var desktop = this.mainApp.desktop;
                desktop.openWin(appId + "/" + catalogId + "/" + moduleId);
            }
        }

        // 新TAB页中显示子应用系统回传的页面
        const openTab = function (script, properties, title) {
            var mainTab = this.mainApp.desktop.mainTab;
            $import(script)
            var module = eval("new " + script + "(properties)");

            var panel = module.initPanel()
            if (panel && module.warpPanel) {
                panel = module.warpPanel(panel)
            }
            if (panel) {
                panel.on("destroy", function (comp) {
                    module.destory();
                }, this)
                panel.closable = true
                panel.setTitle(title)
                mainTab.add(panel)
                mainTab.activate(panel)
                if (mainApp.rendered) {
                    mainTab.doLayout()
                }
            }
            mainTab.el.unmask()
            return;
        }
    }
})
