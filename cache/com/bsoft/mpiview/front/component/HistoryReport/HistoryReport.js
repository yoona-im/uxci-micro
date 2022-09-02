$define('com.bsoft.mpiview.front.component.HistoryReport.HistoryReport', {
    tpl: true,
    css: ['com.bsoft.mpiview.front.component.HistoryReport.HistoryReport', 'com.bsoft.mpiview.front.style.common'],
    deps: ['com.bsoft.mpiview.front.component.HistoryChart.HistoryChart', 'com.bsoft.mpiview.front.component.FieldChart.FieldChart', 'com.bsoft.mpiview.front.component.Tabs.Tabs'],
}, function (html) {
    Vue.component('history-report', {
        template: html,
        props: {
            version: {
                type: String,
                default: ''
            },
            isHistoryPage: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                timeActiveName: '20211001',
                activeName: '1',
                tabs: [
                    {
                        label: '成人',
                        name: '1',
                        key: 'adult'
                    },
                    {
                        label: '儿童',
                        name: '2',
                        key: 'child'
                    },
                ],
                effectiveOptions: [
                    {
                        label: '计分',
                        value: '1',
                    },
                    {
                        label: '不计分',
                        value: '2',
                    },
                ],
                fieldOptions: [],
                fieldName: '',
                adultTableData: [],
                activeIndex: 0,
                timeActiveName: '',
                type: '',
                intersectSeletTableData: [],
                suspectedSeletTableData: [],
                ruleSeletTableData: [],
                timeLine: [],
                scoreForm: {},
                scoreTableData: [],
                isViewsShow: false,
            };
        },
        methods: {
            headClass() {
                return {
                    background:'#EBF4FF',
                    color: '#333',
                    fontWeight: 'bold',
                    height: '40px',
                    padding: 0,
                    fontSize: '14px'
                }
            },
            async historyTopTabChange(val) {
                // this.queryScoreConfig();
                // this.queryIntersectSelectList();
                // this.querySuspectedSelectList();
                // this.queryRuleSelectList();
                this.getTimeLine();
                this.fieldOptions = await this.queryFields();
                if(this.fieldOptions.length) {
                    this.fieldName = this.fieldOptions[0];
                } else {
                    this.fieldName = ''; 
                }
            },
            async historyTabChange(val) {
                this.queryScoreConfig();
                this.queryIntersectSelectList();
                this.querySuspectedSelectList();
                this.queryRuleSelectList();
                // this.fieldOptions = await this.queryFields();
                // if(this.fieldOptions.length) {
                //     this.fieldName = this.fieldOptions[0];
                // } else {
                //     this.fieldName = ''; 
                // }
            },
            queryFields() {
                let me = this;
                const params = {
                    type: me.activeName
                }
                return Promise.resolve(
                    $ajax({
                        url: 'api/mpiview.trialCollectionRpcService/selectFieldList',
                        jsonData: [params]
                    }).then(function (res) {
                        if (res && res.code == 200) {
                            return res.body || [];
                        }
                    }).fail(function (e) {
                        console.error(e);
                    })
                )
            },
            changeIndex(index) {
                this.activeIndex = index;
            },
            queryScoreConfig() {
                let me = this;
                const params = {
                    type: me.activeName,
                    version: me.timeActiveName,
                }
                $ajax({
                    url: 'api/mpiview.trialCollectionRpcService/selectRuleByVersionAndType',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        let { matchScore, suspectScore } = res.body
                        me.scoreForm.matchScore = matchScore;
                        me.scoreForm.suspectScore = suspectScore;
                        me.scoreTableData = res.body.resultList;
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
            getObj(obj) {
                let { matchScore, suspectScore } = obj;
                return { matchScore, suspectScore };
            },
            getTimeLine() {
                let me = this;
                const params = {
                    type: me.activeName,
                }
                $ajax({
                    url: 'api/mpiview.trialCollectionRpcService/selectVersion',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        let timeLine = res.body.filter(item => item);
                        me.timeLine = timeLine.map(item => {
                            item.createTime = item.createTime
                            return item;
                        });
                        if(timeLine.length) {
                            me.timeActiveName = timeLine[0].versionId;
                        }
                        me.$nextTick(() => {
                            me.isViewsShow = true;
                        })
                        me.queryScoreConfig();
                        me.queryIntersectSelectList();
                        me.querySuspectedSelectList();
                        me.queryRuleSelectList();

                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
            queryIntersectSelectList() {
                let me = this;
                let params = {
                    type: me.activeName,
                    version: me.timeActiveName,
                }
                $ajax({
                    url: 'api/mpiview.trialCollectionRpcService/selectMergeCountByReport',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.intersectSeletTableData = res.body;
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
            querySuspectedSelectList() {
                let me = this;
                let params = {
                    type: me.activeName,
                    version: me.timeActiveName,
                }
                $ajax({
                    url: 'api/mpiview.trialCollectionRpcService/selectSuspectCountToReport',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.suspectedSeletTableData = res.body;
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
            queryRuleSelectList() {
                let me = this;
                let params = {
                    type: me.activeName,
                    version: me.timeActiveName,
                }
                // api/mpiview.trialCollectionRpcService/selectSuspectInfo
                $ajax({
                    url: 'api/mpiview.trialCollectionRpcService/selectSuspectInfoFromTable',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.ruleSeletTableData = res.body.map(item => {
                            item.rule = `${item.matchColumnName}(${item.score})`
                            return item;
                        });
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
            async toAsync() {
                let isSubmit = await this.isSubmit();
                if (!isSubmit) {
                    return this.$message.error('主索引及相关库中存在数据，请在系统参数配置中清空数据后再次尝试');
                }
                let message = `确认要同步此校验规则吗？`;
                this.$confirm(message, '同步校验规则', {
                    confirmButtonText: '确定',
                    type: 'warning',
                }).then(() => {
                    this.asyncRule();
                }).catch(() => {
                })
            },
            isSubmit() {
                return new Promise((resolve, reject) => {
                    $ajax({
                        url: 'api/mpiview.matchWeightRpcService/ifEdit',
                        jsonData: []
                    }).then(function (res) {
                        if (res && res.code == 200) {
                            let result = res.body;
                            resolve(result)
                        }
                    }).fail(function (e) {
                        console.error(e);
                        reject(e)
                    })
                })
            },
            asyncRule() {
                let me = this;
                const params = {
                    type: me.activeName,
                    version: me.timeActiveName,
                }
                $ajax({
                    url: 'api/mpiview.tcMatchWeightRpcService/syncRule',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.$message.success('操作成功');
                    }
                }).fail(function (e) {
                    console.error(e);
                    me.$message.error('操作失败');
                })
            },
            async initMethod() {
                let me = this;
                me.fieldOptions = await me.queryFields();
                if(me.fieldOptions.length) {
                    me.fieldName = me.fieldOptions[0]
                }
                me.getTimeLine();
            },
            tabsChange(val) {
            }
        },
        mounted() {
            this.initMethod();
        },
        beforeCreate() {
            that = this;
        },
        filters: { // 监听器
            fieldFilter(val) {
                for (let key in that.fieldOptions) {
                    if (that.fieldOptions[key].fieldName === val) {
                        return that.fieldOptions[key].weightName;
                    }
                }
            },
            effectiveFilter(val) {
                for (let key in that.effectiveOptions) {
                    if (that.effectiveOptions[key].value === val) {
                        return that.effectiveOptions[key].label;
                    }
                }
            },
            typeFilter(val) {
                for (let key in that.tabs) {
                    if (that.tabs[key].name === val) {
                        return that.tabs[key].label;
                    }
                }
            }
        },
    })
})