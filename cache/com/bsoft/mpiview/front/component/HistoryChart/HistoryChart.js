$define('com.bsoft.mpiview.front.component.HistoryChart.HistoryChart', {
    tpl: true,
    css: 'com.bsoft.mpiview.front.component.HistoryChart.HistoryChart',
    deps: ['com.bsoft.mpiview.front.lib.js.echarts.echarts'],
}, function (html) {
    const me = this;
    Vue.component('history-chart', {
        template: html,
        props: {
            type: String,
            default: ''
        },
        data() {
            return {
                historyLineChart: null,
                legend: ['规范档案数', '合并主索引', '疑似主索引', '主索引数', '原始档案数'],
                xData: [],
                standerdData: [],
                mergeData: [],
                suspectData: [],
                mainIndexData: [],
                originalData: [],
                nullData: false,
            };
        },
        methods: {
            initLine() {
                let me = this;
                let colorMap = ['#4088FE', '#9D0606', '#FF9A26', '#26BF40', '#6C40FE'];
                me.$nextTick(() => {
                    if (!me.historyLineChart) {
                        me.historyLineChart = echarts.init(me.$refs.historyLine);
                    }
                    // 指定图表的配置项和数据
                    let option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        color: colorMap,
                        legend: {
                            data: me.legend,
                            icon: 'circle',
                            right: 20,
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: me.xData,
                            axisLabel: {
                                formatter: function (params) {
                                    var newParamsName = '' // 最终拼接成的字符串
                                    var paramsNameNumber = params.length // 实际标签的个数
                                    var provideNumber = 10 // 每行能显示的字的个数
                                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
                                    /**
                                     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                                     */
                                    // 条件等同于rowNumber>1
                                    if (paramsNameNumber > provideNumber) {
                                        /** 循环每一行,p表示行 */
                                        for (var p = 0; p < rowNumber; p++) {
                                            var tempStr = ''// 表示每一次截取的字符串
                                            var start = p * provideNumber // 开始截取的位置
                                            var end = start + provideNumber // 结束截取的位置
                                            // 此处特殊处理最后一行的索引值
                                            if (p === rowNumber - 1) {
                                                // 最后一次不换行
                                                tempStr = params.substring(start, paramsNameNumber)
                                            } else {
                                                // 每一次拼接字符串并换行
                                                tempStr = params.substring(start, end) + '\n'
                                            }
                                            newParamsName += tempStr // 最终拼成的字符串
                                        }
                                    } else {
                                        // 将旧标签的值赋给新标签
                                        newParamsName = params
                                    }
                                    return newParamsName
                                }
                            }
                        },
                        yAxis: {
                            type: 'value'
                        },
                        grid: {
                            left: '8%',
                            right: '8%',
                            bottom: '0',
                            containLabel: true
                        },
                        series: [
                            {
                                name: '规范档案数',
                                type: 'line',
                                smooth: true,
                                data: me.standerdData,
                            },
                            {
                                name: '合并主索引',
                                type: 'line',
                                smooth: true,
                                data: me.mergeData
                            },
                            {
                                name: '疑似主索引',
                                type: 'line',
                                smooth: true,
                                data: me.suspectData
                            },
                            {
                                name: '主索引数',
                                type: 'line',
                                smooth: true,
                                data: me.mainIndexData
                            },
                            {
                                name: '原始档案数',
                                type: 'line',
                                smooth: true,
                                data: me.originalData
                            }
                        ]
                    };
                    me.historyLineChart.setOption(option);
                    me.historyLineChart.resize();
                })
            },
            queryData() {
                let me = this;
                const params = {
                    personType: me.type,
                }
                $ajax({
                    url: 'api/mpiview.trialCollectionRpcService/selectTrendOfRecent',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        let result = res.body;
                        let standerdData = [];
                        let mergeData = [];
                        let suspectData = [];
                        let mainIndexData = [];
                        let originalData = [];
                        me.xData = Object.keys(res.body)
                        for (let k in result) {
                            standerdData.push(result[k].standardDataNum);
                            mergeData.push(result[k].mergeNum);
                            suspectData.push(result[k].suspectNum);
                            mainIndexData.push(result[k].patientNum);
                            originalData.push(result[k].sourcePatientNum);
                        }
                        me.standerdData = standerdData;
                        me.mergeData = mergeData;
                        me.suspectData = suspectData;
                        me.mainIndexData = mainIndexData;
                        me.originalData = originalData;
                        me.initLine();
                    }
                    me.nullData = false;
                }).fail(function (e) {
                    me.nullData = true;
                    console.error(e);
                })
            },
        },
        mounted() {
            let me = this;
            me.queryData();
            window.addEventListener('resize', () => {
                let chartWidth = document.querySelector(".historyLine").offsetWidth;
                let chartHeight = document.querySelector(".historyLine").offsetHeight;
                if (chartWidth && chartHeight) {
                    me.historyLineChart.resize();
                }
                
            })
        }
    })
})