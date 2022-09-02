$define('com.bsoft.bsoftdms.front.docSearch.DocSearchMain.DocSearchMain', {
    tpl: true,
    css: ['com.bsoft.bsoftdms.front.docSearch.DocSearchMain.DocSearchMain','com.bsoft.bsoftdms.front.lib.js.echarts.iconfont.iconfont'],
    deps: ['lib.echart.echarts-min','com.bsoft.bsoftdms.front.lib.js.echarts.iconfont.iconfont'] // ux-libs 中自带了 echarts、bootstrap、element、jquery、lodash、sparklines、vue2、vuetify、vxetable、d3
    // deps: 'com.bsoft.bsoftdms.front.lib.js.echarts.echarts-min'
}, function (html) {
    Vue.component('docSearchMain', {
        template: html,
        name: "docSearchMain",
        props: [],
        data() {
            return {
                isInit: false,
                thsAllDateData: [],
                thsOptions: [],
                thsDocFormatOptions: [],
                thsCheckedItems: [],
                thsChooseDate: '',
                thsDocType: '-1',
                thsDataSetCode: [],
                thsAllChecked: false,
                thsChooseDateData: {},
                thsSelectPatient: [],
                folderLoading: false,
                uid: '',
                urt: '',
            };
        },
        methods: {
            init: function () {

            },
            // 选择目录
            checkMenu: function (i) {
                // 展示右上角那个勾勾
                if (this.thsCheckedItems.indexOf(i) == '-1') {
                    this.thsCheckedItems.push(i);
                    if (this.thsCheckedItems.length == this.thsAllDateData.length ) {
                        this.thsAllChecked = true;
                    }
                } else {
                    this.thsCheckedItems = this.thsCheckedItems.filter(x => x != i);
                    // 如果没有全选了  就把全选的勾勾取消
                    if (this.thsAllDateData.length != this.thsCheckedItems.length) {
                        this.thsAllChecked = false;
                    }
                }

                // 脚部的数据展示（问过逻辑：展示最后一次点击的数据，不管是否选中）
                if (this.thsCheckedItems.length == 0) {
                    this.isInit = false;
                } else {
                    this.isInit = true;
                }
                this.thsChooseDateData = this.thsAllDateData[i];
            },
            // 选中所有
            allCheckedClick: function () {
                if (this.thsAllChecked) {
                    this.thsAllDateData.map((x, index) => {
                        this.thsCheckedItems.push(index)
                    })
                } else {
                    this.thsCheckedItems = [];
                    this.isInit = false;
                }
            },
            // 进入下一级（也可能是上一级）
            showChildMenu: function (o) {
                o.breadcrumbName = o.menuName;
                o.thsDocType = this.thsDocType;
                o.thsDataSetCode = this.thsDataSetCode;
                this.$emit("showMenu", 1, o);
            },
            // 根据条件 查询分组
            queryDocGroupByParam: function () {
                this.queryAllDocGroup(this.thsSelectPatient);
            },
            // 查询具体实现
            queryAllDocGroup: function (row) {
                this.thsSelectPatient = row;
                let mpiId = row.mpiId;

                if (mpiId == null || mpiId == "") {
                    this.$message({
                        message: "该条数据mpiId为空，无法查询",
                        duration: '1500',
                        type: 'warning'
                    })
                    return false;
                }

                this.folderLoading = true;

                let beforeTime = '';
                let afterTime = '';
                if (this.thsChooseDate != null && this.thsChooseDate != '') {
                    let d = this.thsChooseDate[0];
                    beforeTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                    let d1 = this.thsChooseDate[1];
                    // 加一天
                    let d2 = new Date(d1.valueOf());
                    new Date(d2.setDate(d2.getDate() + 1));
                    afterTime = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate();
                }

                $ajax({
                    url: 'api/bsoftdms.SearchDocRpcServiceImpl/queryAllDocGroup',
                    jsonData: [{
                        mpiId: mpiId,
                        recordclassifying: JSON.stringify(this.thsDataSetCode),
                        docformat: this.thsDocType == "-1" ? '' : this.thsDocType,
                        beforeTime: beforeTime,
                        afterTime: afterTime,
                    }]
                }).then(res => {
                    if (res) {
                        let sucData = res.body.data.data;

                        let menuData = [];
                        sucData.map(x => {
                            let menu = {
                                menuLevel: 0,
                                menuName: x.efftime,
                                storageTime: x.uptime,
                                docType: x.docformat.substring(1, x.docformat.length - 1),
                                docTotal: x.total,
                                recordclassifying: x.recordclassifying
                            }
                            menuData.push(menu)
                        })

                        this.thsAllDateData = menuData;

                    } else {
                        this.$message({
                            message: '查询患者信息失败！',
                            duration: '1500',
                            type: 'error',
                            offset: 50
                        })
                    }

                    this.folderLoading = false;
                });
            },
            // 导出
            exportCheckDocs: function () {
                if (this.thsCheckedItems.length == 0) {
                    this.$message({
                        message: '请先选中导出的文档！',
                        duration: '1500',
                        type: 'warning',
                        offset: 50
                    })
                    return;
                }
                let efftimeList = [];
                this.thsCheckedItems.map(x => {
                    efftimeList.push(this.thsAllDateData[x].menuName);
                })
                let paramData = {
                    // exportType : '1', // 1是全部
                    mpiId: this.thsSelectPatient.mpiId,
                    zipName: this.thsSelectPatient.name,
                    efftimeList: efftimeList,
                    docformat: this.thsDocType,
                    datasetList: this.thsDataSetCode
                }
                this.exportPost(paramData);

            },
            // 导出具体实现
            exportPost: function (paramData) {
                paramData['uid'] = this.uid;
                paramData['urt'] = this.urt;
                paramData['datasetList']=JSON.stringify(paramData['datasetList']);
                paramData['efftimeList']=JSON.stringify(paramData['efftimeList']);
                console.log(paramData)
                $ajax({
                    url: 'api/bsoftdms.SearchDocRpcServiceImpl/exportFolderForFastDFS',
                    jsonData: [paramData]
                }).then(res => {
                    if (res) {
                        window.open('http://'+res.body.data.host+':'+res.body.data.port+'/bs-dms/docSearch/exportZip/' + res.body.data.url +"?oauth=false");
                    } else {
                        this.$message({
                            message: '导出失败！',
                            duration: '1500',
                            type: 'error',
                            offset: 50
                        })
                    }
                });
            },
            sss(s, c) {
            },
            dataSetChange(val) {
                if (!val.includes('all') && val.length === this.thsOptions.length) {
                    this.thsDataSetCode.unshift('all')
                } else if (val.includes('all') && (val.length - 1) < this.thsOptions.length) {
                    this.thsDataSetCode = this.thsDataSetCode.filter((item) => {
                        return item !== 'all'
                    })
                }
            },
            selectFormAll() {
                if (this.thsDataSetCode.length < this.thsOptions.length) {
                    this.thsDataSetCode = []
                    this.thsOptions.map((item) => {
                        this.thsDataSetCode.push(item.value)
                    })
                    this.thsDataSetCode.unshift('all')
                } else {
                    this.thsDataSetCode = []
                }
            },
        },
        mounted() {
            console.log('Other mounted ...');
            //document.querySelector('body').setAttribute('style', 'background-color:#f7f4f8')
            // 进入页面默认获取焦点
        },
        created() {
        }
    })
})