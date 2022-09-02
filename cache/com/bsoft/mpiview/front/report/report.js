$class('com.bsoft.mpiview.front.report.report', {
    extend: 'ssdev.ux.vue.VueContainer',
    tpl: true,
    css: ['com.bsoft.mpiview.front.report.report', 'com.bsoft.mpiview.front.style.common'],
    deps: ['com.bsoft.mpiview.front.component.HistoryReport.HistoryReport'],

    initComponent(conf) { // 组件初始化
        console.log('initComponent ...');
        const me = this;
        // data
        me.data = {
            version: '',
        }
        // methods
        me.evtHandlers = {
            getVersion() {
                let me = this;
                $ajax({
                    url: 'api/mpiview.trialCollectionRpcService/getVersionFromRedis',
                    jsonData: []
                }).then(async function (res) {
                    if (res && res.code == 200) {
                        me.version = res.body.version;
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
        }
        me.callParent(arguments)
    },

    afterInitComponent() { // 组件初始化之后
        console.log('afterInitComponent ...');
        const me = this;
        me.vue.getVersion();
    },

    afterAppend() { // 是页面渲染完毕之后执行的方法。在这里加载数据可以避免由于数据加载出错导致页面渲染失败
        console.log('afterAppend ...');
        const me = this;
        // 发送请求
    },

    afterVueConfInited(vueConf) {
        const me = this;
        vueConf.watch = { // 监听器
        }
        vueConf.filters = { // 监听器
        }
        vueConf.mounted = () => {
        }

    }
})