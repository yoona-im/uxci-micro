$class('com.bsoft.bbpextend.front.bbplogin.bbplogin', {
    extend: 'ssdev.ux.vue.VueContainer',
    tpl: true,
    css: ['com.bsoft.bbpextend.front.bbplogin.bbplogin'],
    deps: ['com.bsoft.bbpextend.front.lib.common.utils', 'com.bsoft.bbpextend.front.lib.js.echarts.echarts-min'],
    initComponent(conf) { // 组件初始化
        console.log('initComponent ...');
        const me = this;
        // data
        me.data = {
            ops: {
                vuescroll: {
                    mode: 'native',
                    sizeStrategy: 'percent',
                    detectResize: true,
                    locking: true
                },
                scrollPanel: {},
                rail: {},
                bar: {
                    background: "#bde6ff"
                }
            },
            invokeSearchTimeRadio: "1",
            invokeSearchDatePickerDisabled: true,
            invokeSearchDatePicker: [
                formatDate(new Date(), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd"),
                //   formatDate(new Date(new Date().setDate(new Date().getDate()+1)), "yyyy-MM-dd"),
            ],
            rectangleData: [],//左边的矩形图
            rectangleChart: null,
            platformData: [],//右边的饼图
            platformChart: null,
            options: [
                {
                    value: "all",
                    label: "全部"
                },
                {
                    value: "login",
                    label: "登录"
                },
                {
                    value: "logout",
                    label: "退出"
                },
            ],
            value: "",
            tableData: [],
            pageIndex: "1",
            pageSize: "7",
            pageCount: "",
            userCount: "",
        };
        // methods
        me.evtHandlers = {
            searchTimeRadioChange() {
                let me = this
                this.value = 'all'
                if (this.invokeSearchTimeRadio == "1") {
                    //今日
                    var dateTime = new Date()
                    var tomorrow = new Date(dateTime.setDate(dateTime.getDate() + 1))
                    var dates = formatDate(new Date(), "yyyy-MM-dd");
                    var date = formatDate(tomorrow, "yyyy-MM-dd");
                    this.invokeSearchDatePicker = [dates, date];
                    this.invokeSearchDatePickerDisabled = true;
                    // 查询
                    this.getServices();
                    this.getPlatform();
                    this.getTableData();
                    this.getLoginUser();
                    this.invokeSearchDatePicker = [dates, dates];
                } else if (this.invokeSearchTimeRadio == "2") {
                    //昨日
                    var yesterday = $dateObj.toDate(
                        $dateObj.minusDays(new Date(), 1)
                    );
                    var date = formatDate(yesterday, "yyyy-MM-dd");
                    var dates = formatDate(new Date(), "yyyy-MM-dd");
                    this.invokeSearchDatePicker = [date, dates];
                    this.invokeSearchDatePickerDisabled = true;
                    // 查询
                    this.getServices();
                    this.getPlatform();
                    this.getTableData();
                    this.getLoginUser();
                    this.invokeSearchDatePicker = [date, date];
                } else if (this.invokeSearchTimeRadio == "3") {
                    //一周

                    var weekStart = $dateObj.toDate(
                        $dateObj.minusDays(new Date(), 7)
                    );
                    var date = formatDate(weekStart, "yyyy-MM-dd");
                    var dateNow = formatDate(new Date(), "yyyy-MM-dd");
                    this.invokeSearchDatePicker = [date, dateNow];
                    this.invokeSearchDatePickerDisabled = true;
                    // 查询
                    this.getServices();
                    this.getPlatform();
                    this.getTableData();
                    this.getLoginUser()
                } else {
                    //自定义
                    this.invokeSearchDatePickerDisabled = false;
                }
            },
            getdatPicker(val) {
                let me = this
                let date = new Date(val[1])
                date = +date + 24 * 60 * 60 * 1000
                date = formatDate(new Date(date), "yyyy-MM-dd");
                this.invokeSearchDatePicker = [val[0], date];
                this.getServices();
                this.getPlatform();
                this.invokeSearchDatePicker = [val[0], val[1]];
            },
            getServices() {
                let me = this;
                $ajax({
                    url: 'api/bbpextend.ssoCountRpcService/countListByTime',
                    jsonData: [{
                        "queryType": this.invokeSearchTimeRadio * 1,
                        "startTime": this.invokeSearchDatePicker[0],
                        "endTime": this.invokeSearchDatePicker[1],
                    }]
                }).then(function (res) {
                    if (res.code == '200' || res.body.code == '200') {
                        console.log(res.body, '1213')
                        me.rectangleData = res.body
                        me.rectangle()
                    } else {
                        console.error(res);
                    }
                }).catch(function (e) {
                    console.error(e);
                });

            },
            getPlatform() {
                let me = this
                $ajax({
                    url: 'api/bbpextend.ssoCountRpcService/countListByDomain',
                    jsonData: [{
                        "queryType": this.invokeSearchTimeRadio * 1,
                        "startTime": this.invokeSearchDatePicker[0],
                        "endTime": this.invokeSearchDatePicker[1],
                    }]
                }).then(function (res) {
                    if (res.code == '200' || res.body.code == '200') {
                        console.log(res.body, '1213')
                        console.log(me, '1214')
                        me.platformData = res.body
                        me.platform()
                    } else {
                        console.error(res);
                    }
                }).catch(function (e) {
                    console.error(e);
                });
            },
            platform() {
                let me = this
                var data = []
                this.platformData.map((item) => {
                    data.push({
                        name: item.domainName,
                        value: item.total,
                    })
                })
                var option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    series: [
                        {
                            name: '访问记录',
                            type: 'pie',
                            radius: '50%',
                            data: data,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                this.platformChart = echarts.init(this.$refs.platformChartMoudle);
                setTimeout(this.platformChart.setOption(option), 500)
                window.addEventListener("resize", () => {
                    if (this.platformChart) {
                        this.platformChart.resize();
                    }
                });
            },
            rectangle() {
                let xData = Object.keys(this.rectangleData).sort()
                console.log(xData, 'xData')
                let sData = []
                xData.forEach(function (item) {

                    console.log(me.vue.rectangleData)

                    sData.push(me.vue.rectangleData[item])
                })
                // let sData = Object.values(this.rectangleData)
                var option = {
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: sData,
                            type: 'line',
                            areaStyle: {}
                        }
                    ]
                }
                this.rectangleChart = echarts.init(this.$refs.rectangleChartMoudle);
                setTimeout(this.rectangleChart.setOption(option), 500)
                window.addEventListener("resize", () => {
                    if (this.rectangleChart) {
                        this.rectangleChart.resize();
                    }
                });
            },
            getTableData() {
                let me = this
                if (this.value == 'all') {
                    this.value = ''
                }
                $ajax({
                    url: 'api/bbpextend.ssoCountRpcService/queryList',
                    jsonData: [{
                        "queryType": this.invokeSearchTimeRadio * 1,
                        "startTime": this.invokeSearchDatePicker[0],
                        "endTime": this.invokeSearchDatePicker[1],
                        "state": this.value,
                        "page": this.pageIndex,
                        "size": this.pageSize,
                    }]
                }).then(function (res) {
                    if (res.code == '200' || res.body.code == '200') {
                        console.log(res.body, '1213')
                        console.log(me, '1214')
                        me.tableData = res.body.data
                        me.pageCount = res.body.total
                    } else {
                        console.error(res);
                    }
                }).catch(function (e) {
                    console.error(e);
                });
            },
            selectChangeHandle() {
                if (this.invokeSearchTimeRadio == "1") {
                    //今日
                    var dateTime = new Date()
                    var tomorrow = new Date(dateTime.setDate(dateTime.getDate() + 1))
                    var dates = formatDate(new Date(), "yyyy-MM-dd");
                    var date = formatDate(tomorrow, "yyyy-MM-dd");
                    this.invokeSearchDatePicker = [dates, date];
                    this.invokeSearchDatePickerDisabled = true;
                    // 查询
                    this.selectChange();
                    this.invokeSearchDatePicker = [dates, dates];
                } else if (this.invokeSearchTimeRadio == "2") {
                    //昨日
                    var yesterday = $dateObj.toDate(
                        $dateObj.minusDays(new Date(), 1)
                    );
                    var date = formatDate(yesterday, "yyyy-MM-dd");
                    var dates = formatDate(new Date(), "yyyy-MM-dd");
                    this.invokeSearchDatePicker = [date, dates];
                    this.invokeSearchDatePickerDisabled = true;
                    // 查询
                    this.selectChange();
                    this.invokeSearchDatePicker = [date, date];
                } else if (this.invokeSearchTimeRadio == "3") {
                    //一周

                    var weekStart = $dateObj.toDate(
                        $dateObj.minusDays(new Date(), 7)
                    );
                    var date = formatDate(weekStart, "yyyy-MM-dd");
                    var dateNow = formatDate(new Date(), "yyyy-MM-dd");
                    this.invokeSearchDatePicker = [date, dateNow];
                    this.invokeSearchDatePickerDisabled = true;
                    // 查询
                    this.selectChange();
                } else {
                    //自定义
                    this.invokeSearchDatePickerDisabled = false;
                }
            },
            selectChange() {
                let me = this;
                if (this.value == 'all') {
                    this.value = ''
                }
                this.pageIndex = '1'
                this.pageSize = '7'

                $ajax({
                    url: 'api/bbpextend.ssoCountRpcService/queryList',
                    jsonData: [{
                        "queryType": this.invokeSearchTimeRadio * 1,
                        "startTime": this.invokeSearchDatePicker[0],
                        "endTime": this.invokeSearchDatePicker[1],
                        "state": this.value,
                        "page": this.pageIndex,
                        "size": this.pageSize,
                    }]
                }).then(function (res) {
                    if (res.code == '200' || res.body.code == '200') {
                        console.log(res.body, '1213')
                        console.log(me, '1214')
                        me.tableData = res.body.data
                        me.pageCount = res.body.total
                    } else {
                        console.error(res);
                    }
                }).catch(function (e) {
                    console.error(e);
                });
            },
            getLoginUser() {
                let me = this
                $ajax({
                    url: 'api/bbpextend.ssoCountRpcService/countOnline',
                    jsonData: [{
                        "queryType": this.invokeSearchTimeRadio * 1,
                        "startTime": this.invokeSearchDatePicker[0],
                        "endTime": this.invokeSearchDatePicker[1],
                        "state": this.value,
                        "page": 1,
                        "size": 5,
                    }]
                }).then(function (res) {
                    if (res.code == '200' || res.body.code == '200') {
                        console.log(res.body, '1213')
                        console.log(me, '1214')
                        me.userCount = res.body
                    } else {
                        console.error(res);
                    }
                }).catch(function (e) {
                    console.error(e);
                });
            },
            pageChange(val) {
                console.log(val)
                this.pageIndex = val
                if (this.invokeSearchTimeRadio == "1") {
                    //今日
                    var dateTime = new Date()
                    var tomorrow = new Date(dateTime.setDate(dateTime.getDate() + 1))
                    var dates = formatDate(new Date(), "yyyy-MM-dd");
                    var date = formatDate(tomorrow, "yyyy-MM-dd");
                    this.invokeSearchDatePicker = [dates, date];
                    this.invokeSearchDatePickerDisabled = true;
                    // 查询
                    this.getTableData();
                    this.invokeSearchDatePicker = [dates, dates];
                } else if (this.invokeSearchTimeRadio == "2") {
                    //昨日
                    var yesterday = $dateObj.toDate(
                        $dateObj.minusDays(new Date(), 1)
                    );
                    var date = formatDate(yesterday, "yyyy-MM-dd");
                    var dates = formatDate(new Date(), "yyyy-MM-dd");
                    this.invokeSearchDatePicker = [date, dates];
                    this.invokeSearchDatePickerDisabled = true;
                    // 查询
                    this.getTableData();
                    this.invokeSearchDatePicker = [date, date];
                } else if (this.invokeSearchTimeRadio == "3") {
                    //一周

                    var weekStart = $dateObj.toDate(
                        $dateObj.minusDays(new Date(), 7)
                    );
                    var date = formatDate(weekStart, "yyyy-MM-dd");
                    var dateNow = formatDate(new Date(), "yyyy-MM-dd");
                    this.invokeSearchDatePicker = [date, dateNow];
                    this.invokeSearchDatePickerDisabled = true;
                    // 查询
                    this.getTableData();
                } else {
                    //自定义
                    this.invokeSearchDatePickerDisabled = false;
                }


            },
        };
        me.callParent(arguments);
    },
    afterInitComponent() { // 组件初始化之后
        console.log('afterInitComponent ...');
        const me = this;
    },
    afterAppend() {
        // 是页面渲染完毕之后执行的方法。在这里加载数据可以避免由于数据加载出错导致页面渲染失败
        console.log('afterAppend ...');
        let me = this;
        this.vue.invokeSearchTimeRadio = '1'
        this.vue.searchTimeRadioChange()
        // this.vue.getServices();
        // this.vue.getPlatform();
        // this.vue.getTableData();
        // this.vue.getLoginUser();
    },
    afterVueConfInited(vueConf) {
        const me = this;
        vueConf.watch = { // 监听器
        }
        vueConf.computed = { // 计算属性
        }
    }
})