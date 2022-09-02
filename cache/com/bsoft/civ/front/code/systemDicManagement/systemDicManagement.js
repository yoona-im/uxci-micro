$class('com.bsoft.civ.front.code.systemDicManagement.systemDicManagement', {
    extend: 'ssdev.ux.vue.VueContainer',
    tpl: true,
    css: [
        'com.bsoft.civ.front.code.systemDicManagement.systemDicManagement',
        'com.bsoft.civ.front.iconfont.iconfont',
        'com.bsoft.civ.front.lib.common.common',
    ],
    deps: [
        'com.bsoft.civ.front.lib.request.api',
        'com.bsoft.civ.front.lib.common.utils',
        'com.bsoft.civ.front.component.systemDicManagementType.orgDeptDicManagement.orgDeptDicManagement',
        'com.bsoft.civ.front.component.systemDicManagementType.sexDicManagement.sexDicManagement',
        'com.bsoft.civ.front.component.systemDicManagementType.diseaseDicManagement.diseaseDicManagement',
        'com.bsoft.civ.front.component.systemDicManagementType.diseaseTypeDicManagement.diseaseTypeDicManagement',
    ],
    initComponent(conf) { // 组件初始化
        const me = this;

        // data
        me.data = {
            // leftNav
            navData: ['机构/科室', '性别', '疾病', '病种'],
            activeNavIndex: '0',
        }

        // methods
        me.evtHandlers = {
            navSelect: function (index) {
                me.data.activeNavIndex = index;
            },
            toSystemVarConfig: function () {
                if (window.location.href.indexOf('?clz') != -1) {
                    // 新窗口打开
                    let baseUrl = window.location.href.split('?clz=')[0];
                    let url = baseUrl + '?clz=com.bsoft.civ.front.code.systemVarConfig.systemVarConfig';
                    window.open(url, "_blank");
                } else {
                    // bbp 的 tab 页跳转 
                    var subPortal = me.$subPortal;   //获取一级门户对象, $subPortal为二级门户对象
                    if (subPortal) {
                        // TODO bbp tab 页面跳转，参数需要固定 
                        subPortal.onOpen('bs-civ', 'bs-civ-xtcspz');
                    }
                }
            }
        }
        me.callParent(arguments)
    },

    afterInitComponent() { // 组件初始化之后
        const me = this;
    },

    afterAppend() { // 是页面渲染完毕之后执行的方法。在这里加载数据可以避免由于数据加载出错导致页面渲染失败
        const me = this;
        // 渲染子组件图表
    },

    afterVueConfInited(vueConf) {
        const me = this;
        vueConf.watch = { // 监听器
        }
        vueConf.computed = { // 计算属性
            orgDeptDicManagementShow() {
                return me.data.activeNavIndex == '0';
            },
            sexDicManagementShow() {
                return me.data.activeNavIndex == '1';
            },
            diseaseDicManagementShow() {
                return me.data.activeNavIndex == '2';
            },
            diseaseTypeDicManagementShow() {
                return me.data.activeNavIndex == '3';
            },
        }
        // 生命周期的函数
        vueConf.beforeCreate = function () {
        }
        vueConf.created = function () {
        }
        vueConf.beforeMount = function () {
        }
        vueConf.mounted = function () {
        }
        vueConf.beforeUpdate = function () {
        }
        vueConf.updated = function () {
        }
        vueConf.beforeDestroy = function () {
        }
        vueConf.destroyed = function () {
        }
        vueConf.activated = function () {
        }
        vueConf.deactivated = function () {
        }
    }
})