$define('com.bsoft.mpiview.front.component.Tabs.Tabs', {
    tpl: true,
    css: ['com.bsoft.mpiview.front.component.Tabs.Tabs', 'com.bsoft.mpiview.front.lib.iconfont.iconfont'],
    
}, function (html) {
    Vue.component('tabs-view', {
        template: html,
        props: {
            version: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            history: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                activeIndex: 0,
                mergeNum: '',
                mergeRate: '',
                patientNum: '',
                patientRate: '',
                sourcePatientNum: '',
                standardDataNum: '',
                standardDataRate: '',
                suspectNum: '',
                suspectRate: '',
                tab1Tips: 'EMPI系统中原始上传的患者档案数据量',
                tab2Tips: '原始患者档案数中符合校验规则的数据量;只分析采集的数据，不包含下方的数据分析',
            };
        },
        methods: {
            getData() {
                let me = this;
                let params = {
                    version: me.version,
                    type: me.type,
                };
                $ajax({
                    url: 'api/mpiview.trialCollectionRpcService/selectReport',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200 && res.body) {
                        me.mergeNum = res.body.mergeNum;
                        me.mergeRate = res.body.mergeRate;
                        me.patientNum = res.body.patientNum;
                        me.patientRate = res.body.patientRate;
                        me.sourcePatientNum = res.body.sourcePatientNum;
                        me.standardDataNum = res.body.standardDataNum;
                        me.standardDataRate = res.body.standardDataRate;
                        me.suspectNum = res.body.suspectNum;
                        me.suspectRate = res.body.suspectRate;
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
            tabsChange(index) {
                this.activeIndex = index;
                this.$emit('changeIndex', index)
            }
        },
        mounted() {
            this.getData();
        },
        watch: {
            type: function (val) {
                this.getData();
            },
        }
    })
})