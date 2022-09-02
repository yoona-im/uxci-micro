$class('com.bsoft.bsoftdms.front.docSearch.DocSearchMainView', {
    extend: 'ssdev.ux.vue.VueContainer',
    tpl: true,
    css: ['com.bsoft.bsoftdms.front.docSearch.DocSearchMainView','com.bsoft.bsoftdms.front.lib.js.echarts.iconfont.iconfont'
        ,'com.bsoft.bsoftdms.front.lib.js.echarts.animate.animate'],
     //deps: ['com.bsoft.bsoftdms.front.component.ShowDoc.ShowDoc'],
    deps: ['com.bsoft.bsoftdms.front.docSearch.DocSearchMain.DocSearchMain','com.bsoft.bsoftdms.front.docSearch.DocSearchChild.DocSearchChild',
        'com.bsoft.bsoftdms.front.lib.js.echarts.iconfont.iconfont','lib.echart.echarts-min'],

    initComponent(conf) { // 组件初始化
        console.log('initComponent ...');
        const me = this;
        // data
        me.data = {
            menuLevel: '',
            searchData: {},
            conditionShow: 0,
            searchShowIcon: ['resources/com/bsoft/bsoftdms/front/lib/js/echarts/images/up.png',
                'resources/com/bsoft/bsoftdms/front/lib/js/echarts/images/down.png',
                'resources/com/bsoft/bsoftdms/front/lib/js/echarts/images/up.png'],
            animatedCss: ['', 'slideOutUp', 'slideInDown'],
            animatedCssTop: ['bottomInit', 'slideOutUp_customize', 'slideInDown_customize'],
            morePatient: 0,
            morePatientCss: ['displayNone', 'animated fadeIn', 'animated fadeOut'],
            morePatientLayerCss: ['displayNone', 'animated faster slideOutUp_customize2', 'animated faster slideInDown_customize2'],
            morePatientText: ['展开', '收起', '展开'],
            morePatientIcon: ['iconwdjs_fold', 'iconwdjs_fold', 'iconwdjs_unfold'],
            patientInfos: [],
            choosePatientInfo: {},
            isNone: true,
            sexDic: ['未知', '男', '女'],
            headColor: ['#21a7ef', '#21a7ef', '#f264ff', '#91A9C8'],
            sexIcon: ['iconfont iconwdjs_headimage', 'iconfont iconwenhao'],
            starrColor: ['starColorGray', 'starColorYellow'],
            tableLoading: true,
            uid: '',
            urt: ''
        }
        // methods
        me.evtHandlers = {
            initVal() {
                this.initSearchData();
                this.queryDataset();
                this.queryDocformat();

                // 初始化用户信息
                let urlParameters = window.document.location.href;
                console.log(urlParameters);
                this.getUrlParams(urlParameters);
            },
            getUrlParams(url) {
                //开发的时候，下面这一套逻辑有问题，这套逻辑只针对在平台上部署完。所以开发的时候屏蔽掉即可
                // if(url.indexOf("localhost") != "-1" || url.indexOf("127.0.0.1") != "-1"){
                //     return;
                // }
                var requestParameters = new Object;
                if (url.indexOf('?') != -1) {
                    //获取请求参数的字符串
                    var parameters = decodeURI(url.substr(0));
                    //将请求的参数以&分割中字符串数组
                    var parameterArray = [];
                    parameterArray = parameters.split('?');
                    //循环遍历，将请求的参数封装到请求参数的对象之中
                    let paramStr = parameterArray[1];

                    parameterArray[1].split("&").map(x => {
                        let kv = x.split("=");
                        this[kv[0]] = kv[1];
                    })

                    console.info('theRequest is =====', parameterArray[1].split("&"));

                } else {
                    console.info('There is no request parameters');
                }
                return requestParameters;
            },
            initSearchData() {
                me.data.searchData = {
                    name: '',
                    idcard: '',
                    iphone: '',
                    hospizationId: '',
                    clinicId: '',
                    healthInsuranceCardId: '',
                }
            },
            // 隐藏搜索的动画效果
            changeSearchDiv() {
                this.conditionShow = this.conditionShow == 1 ? 2 : 1;
            },
            // 展示所有查询出来的患者
            showMorePatient() {
                this.morePatient = this.morePatient == 1 ? 2 : 1;
            },
            // 选中某个患者
            patientChoose(row) {
                me.data.choosePatientInfo = row;
                me.vue.queryAllDocGroup(row);
                me.data.morePatient = 2;
                // 跳转到首页
                me.data.menuLevel = 0;
            },
            // 这个方法就是跳转到某个层级的  现在就 012 第3是文档层
            showMenu(menuLevel, data) {
                // 当前登录信息
                this.$refs.docSearchChild.uid = me.data.uid;
                this.$refs.docSearchChild.urt = me.data.urt;

                me.data.menuLevel = menuLevel;

                // 带上mpiid  查询时候用
                if (data != null) {
                    data.mpiId = me.data.choosePatientInfo.mpiId;
                    // 查询条件
                    this.$refs.docSearchChild.queryDocType = data.thsDocType;
                    this.$refs.docSearchChild.thsDataSetCode = data.thsDataSetCode;
                    // this.$refs.docSearchChild.thsDataSetCode = [];
                }
                      console.log(data)
                if (menuLevel != 0) {
                    this.$refs.docSearchChild.thsSelectPatient = me.data.choosePatientInfo;
                    this.$refs.docSearchChild.queryData(data);
                    this.$refs.docSearchChild.thsCheckMenu = [data]
                }
            },
            // 查询所有患者信息
            queryPatients() {
                let isNull = true;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('.bottomDiv2')
                })
                for (let v in me.data.searchData) {
                    if (me.data.searchData[v].trim() != '') {
                        isNull = false;
                    }
                }

                if (isNull) {
                    loading.close();
                    this.$message({
                        message: "查询条件不允许为空",
                        duration: '1500',
                        type: 'warning'
                    })
                    return false;
                }
                me.data.tableLoading = true;
                me.data.searchData['uid'] = this.uid,
                me.data.searchData['urt'] = this.urt,
                    $ajax({
                        url: 'api/bsoftdms.SharedDocRpcServiceImpl/queryPatients',
                        jsonData: [this.searchData]
                    }).then(res => {
                        if (res && res.body.meta.statusCode == '200') {
                            let returnData = res.body.data.data;
                            if (returnData.length == 0) {
                                me.data.isNone = true;
                                this.$message({
                                    message: '未查询到数据！',
                                    duration: '1500',
                                    type: 'warning',
                                    offset: 50
                                })
                            } else {
                                me.data.isNone = false;
                                me.data.patientInfos = res.body.data.data;
                                me.data.choosePatientInfo = me.data.patientInfos[0];
                                me.data.menuLevel = 0;
                                me.data.morePatient = 1;
                            }
                        } else if (res.body.meta.statusCode != null && res.body.meta.statusCode != "") {
                            this.$message({
                                message: '查询患者信息失败！错误原因【' + res.body.meta.message + "】",
                                duration: '1500',
                                type: 'error',
                                offset: 50
                            })
                        } else {
                            this.$message({
                                message: '查询患者信息失败！',
                                duration: '1500',
                                type: 'error',
                                offset: 50
                            })
                        }
                        me.data.tableLoading = false;
                    }).catch(error => {
                        console.log(error)
                    }).finally(errer => {
                        loading.close();
                    });
            },
            // 到第一级目录，分组查询出所有的日期（这个方法有可能会很慢  如果数据多）
            queryAllDocGroup(row) {
                this.$refs.docSearchMain.uid = this.uid;
                this.$refs.docSearchMain.urt = this.urt;
                // 清空查询条件
                this.$refs.docSearchMain.thsDocType = '-1';
                this.$refs.docSearchMain.thsDataSetCode = [];
                this.$refs.docSearchMain.thsChooseDate = '';
                this.$refs.docSearchMain.queryAllDocGroup(row);
            },
            // 查询所有的数据集
            queryDataset() {
                $ajax({
                    url: 'api/bsoftdms.SearchDocRpcServiceImpl/queryAllDataset',
                    jsonData: ['']
                }).then(res => {
                    if (res) {
                        let datasetData = res.body.data.data.data;
                        console.log(datasetData)
                        let datasetOptions = [];
                        datasetData.map(x => {
                            if (x.datasetName !== '诊断记录') {
                                datasetOptions.push({
                                    label: x.datasetName,
                                    value: x.datasetCode
                                })
                            }
                        })
                        me.vue.$refs.docSearchMain.thsOptions = datasetOptions;
                        me.vue.$refs.docSearchChild.thsOptions = datasetOptions;
                    } else {
                        me.vue.$message({
                            message: '查询患者信息失败！',
                            duration: '1500',
                            type: 'error',
                            offset: 50
                        })
                    }
                });
            },
            // 查询文档类别
            queryDocformat() {
                $ajax({
                    url: 'api/bsoftdms.SearchDocRpcServiceImpl/queryDocFormat',
                    jsonData: ['']
                }).then(res => {
                    if (res) {
                        let formatData = res.body.data;
                        let formatOptions = [];

                        for (let key in formatData) {
                            // 指定cda和bsxml在前面
                            if (key == '01' || key == '02') {
                                formatOptions.unshift({
                                    label: formatData[key],
                                    value: key
                                })
                            } else {
                                formatOptions.push({
                                    label: formatData[key],
                                    value: key
                                })
                            }
                        }

                        //插入第一个
                        formatOptions.unshift({label: '全部', value: '-1'});
                        me.vue.$refs.docSearchMain.thsDocFormatOptions = formatOptions;
                    } else {
                        me.vue.$message({
                            message: '查询患者信息失败！',
                            duration: '1500',
                            type: 'error',
                            offset: 50
                        })
                    }
                });
            }
        }
        me.callParent(arguments)
    },

    afterInitComponent() { // 组件初始化之后
        console.log('afterInitComponent ...');
        const me = this;
        me.vue.initVal();
    },

    afterAppend() { // 是页面渲染完毕之后执行的方法。在这里加载数据可以避免由于数据加载出错导致页面渲染失败
        console.log('afterAppend ...');
        const me = this;
        document.querySelector('body').setAttribute('style', 'background-color:#f7f4f8')
        // 进入页面默认获取焦点
        me.vue.$refs.searchName.focus();

        // 发送请求
    },
    afterVueConfInited(vueConf) {
        const me = this;
        vueConf.watch = { // 监听器
            'form.name': function (value) {
                console.log(me);
                console.log(value);
            }
        }
        vueConf.computed = { // 计算属性
            helloName() {
                console.log('hello ' + name);
                return 'hello ' + name;
            }
        }
        // 生命周期的函数
        vueConf.beforeCreate = function () {
            console.log('beforeCreate ...')
        }
        vueConf.created = function () {
            console.log('created ...')
        }
        vueConf.beforeMount = function () {
            console.log('beforeMount ...')
        }
        vueConf.mounted = function () {
            console.log('mounted ...')
        }
        vueConf.beforeUpdate = function () {
            console.log('beforeUpdate ...')
        }
        vueConf.updated = function () {
            console.log('updated ...')
        }
        vueConf.beforeDestroy = function () {
            console.log('beforeDestroy ...')
        }
        vueConf.destroyed = function () {
            console.log('destroyed ...')
        }
        vueConf.activated = function () {
            console.log('keep alive activated ...')
        }
        vueConf.deactivated = function () {
            console.log('keep alive deactivated ...')
        }
    }
})
function formatDate (date, fmt) {
    // 日期格式化，yyyy-MM-dd EEE hh:mm:ss
    if (!fmt)
        fmt = "yyyy-MM-dd hh:mm:ss";
    var o = {
        "Y+": date.getFullYear(),
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };
    var week = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}