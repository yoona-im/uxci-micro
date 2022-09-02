$define('com.bsoft.bsoftdms.front.docSearch.DocSearchChild.DocSearchChild', {
    tpl: true,
    css: 'com.bsoft.bsoftdms.front.docSearch.DocSearchChild.DocSearchChild',
    deps: ['lib.echart.echarts-min'] // ux-libs 中自带了 echarts、bootstrap、element、jquery、lodash、sparklines、vue2、vuetify、vxetable、d3
    // deps: 'com.bsoft.bsoftdms.front.lib.js.echarts.echarts-min'
}, function (html) {
    Vue.component('docSearchChild', {
        template: html,
        name: "docSearchChild",
        props: [],
        data() {
            return {
                isInit: false,
                thsCheckedItems: [],
                thsChooseDate: '',
                thsDataSetCode: '',
                datasetSelectShow: true,
                thsAllChecked: false,
                thsChooseDateData: {},
                thsOptions: [],
                chooseIcon: '',
                iconFontCss: ['iconfont iconwdjs_folder iconColorYellow', 'iconfont iconwdjs_file iconColorBlue'],
                thsCheckMenu: [],
                showData: [],
                allDocTypeData: [],
                allDataSetData: [],
                allDocData: [],
                bottomArrChoose: [],
                bottomArrLevel1: [
                    {
                        name: '目录名称',
                        val: 'menuName'
                    }, {
                        name: '数据集个数',
                        val: 'dataSetTotal'
                    }, {
                        name: '文件个数',
                        val: 'docTotal'
                    }, {
                        name: '存储时间',
                        val: 'storageTime'
                    }],
                bottomArrLevel2: [
                    {
                        name: '目录名称',
                        val: 'menuName'
                    }, {
                        name: '文件个数',
                        val: 'docTotal'
                    }, {
                        name: '存储时间',
                        val: 'storageTime'
                    }],
                bottomArrLevel3: [
                    {
                        name: 'BSXML名称',
                        val: 'bsxmlName'
                    }, {
                        name: '原始记录号',
                        val: 'sourceId'
                    }, {
                        name: '记录时间',
                        val: 'effTime'
                    }, {
                        name: 'BSXML标识符',
                        val: 'msgCode'
                    }, {
                        name: '存储时间',
                        val: 'subtitle'
                    }],
                dialogVisible: false,
                dialogTitle: "文档查看",
                thsShowDocInfo:{},
                activeName: 'docxml',
                docTitle: '',
                docTitleCDA: '',
                docTitleFormat: '',
                docTitleBsxmlFormat: '',
                // 用于转cda使用
                sourceDocXml: '',
                docxml: '',
                docxmlCda: '',
                recordTargetNodes:[],
                docInfoNodes:[],
                componentNodes:[],
                bsxmlFormat: [],
                queryDocType: '',
                // queryDataSetCode:[],
                lastQueryData: [],
                thsSelectPatient: [],
                tranCdaBtnShow: false,
                docIsBsxml: false,
                docIsCda: false,
                isFolder: true,
                folderLoading: false,
                docXmlLoading: false,
                docCdaLoading: false,
                docFormatLoading: false,
                bsxmlFormatLoading: false,
                lastCheckDatasetVal:[],
                formatAuth: true,
                cdaFormatAuth: true,
                showToCdaBtn: false,
                uid:'',
                urt:'',
                currentDocFormat: undefined
            };
        },
        methods: {
            init() {

            },
            // 选择目录
            checkMenu(i) {
                // 展示右上角那个勾勾
                if (this.thsCheckedItems.indexOf(i) == '-1') {
                    this.thsCheckedItems.push(i)
                    if (this.thsCheckedItems.length == this.showData.length ) {
                        this.thsAllChecked = true;
                    }
                } else {
                    this.thsCheckedItems = this.thsCheckedItems.filter(x => x != i);
                    // 如果没有全选了  就把全选的勾勾取消
                    if (this.showData.length != this.thsCheckedItems.length) {
                        this.thsAllChecked = false;
                    }
                }
                // 脚部的数据展示（问过逻辑：展示最后一次点击的数据，不管是否选中）
                if(this.thsCheckedItems.length == 0){
                    this.isInit = false;
                } else {
                    this.isInit = true;
                }
                this.thsChooseDateData = this.showData[i];
                if (this.thsCheckedItems.length == 1 && this.showData[this.thsCheckedItems[0]].menuLevel == '1' && this.showData[this.thsCheckedItems[0]].menuName == "BSXML") {
                    this.tranCdaBtnShow = true;
                } else if (this.thsCheckedItems.length > 0 && this.showData[this.thsCheckedItems[0]].menuLevel == '2' && this.showData[this.thsCheckedItems[0]].docformat == "BSXML") {
                    this.tranCdaBtnShow = true;
                } else if (this.thsCheckedItems.length > 0 && this.showData[this.thsCheckedItems[0]].menuLevel == '3' && this.showData[this.thsCheckedItems[0]].docformat == "02") {
                    this.tranCdaBtnShow = true;
                } else {
                    this.tranCdaBtnShow = false;
                }
            },
            // 选中所有
            allCheckedClick() {
                if (this.thsAllChecked) {
                    this.showData.map((x, index) => {
                        this.thsCheckedItems.push(index)
                    })
                } else {
                    this.thsCheckedItems = [];
                }
            },
            toRoot() {
                this.showToCdaBtn = false;
                this.$emit("showMenu", 0, null);
            },
            // 进入下一层（也可能是上一层）
            toChild: function (o) {
                this.queryData(o);
                this.thsCheckedItems = [];

                // 如果选中bsxml，默认出现转cda导出按钮
                if (o.menuLevel === 0){
                    this.showToCdaBtn = false;
                } else if (o.menuLevel === 1) {
                    this.showToCdaBtn = o.menuName === "BSXML";
                }

                // level 3是文档层，直接展示文档
                if (o.menuLevel === 3) {
                    this.thsShowDocInfo = o;
                    // 只有bsxml可以转换为cda
                    if (o.docformat === '02') {
                        this.docIsBsxml = true;
                        this.docIsCda = true;
                    } else if (o.docformat === '01') {
                        this.docIsBsxml = false;
                        this.docIsCda = true;
                    } else {
                        this.docIsBsxml = false;
                        this.docIsCda = false;
                    }
                    this.currentDocFormat = o.docformat;
                    this.dialogVisible = true;
                    return false;
                }

                let tempCheckMenu = [];
                this.thsCheckMenu.map(x => {
                    if (x.menuLevel < o.menuLevel) {
                        tempCheckMenu.push(x);
                    }
                });
                tempCheckMenu.push(o);
                this.thsCheckMenu = tempCheckMenu;
            },
            // 二级查询（其实就是那个数据集变更了，点击查询时的操作）
            doubleQuery() {
                this.queryData(this.lastQueryData);
            },
            queryData: function (data) {
                // 全选置空
                this.thsAllChecked = false;
                if(data.menuLevel != 3){
                    this.thsChooseDateData = [];
                }
                this.lastQueryData = data;
                if (data.menuLevel == 0) {
                    this.folderLoading = true;
                    this.datasetSelectShow = true;
                    $ajax({
                        url: 'api/bsoftdms.SearchDocRpcServiceImpl/queryDocFormatByTime',
                        jsonData: [{
                            mpiId: data.mpiId,
                            efftime: data.menuName,
                            docformat: this.queryDocType == '-1' ? '' : this.queryDocType,
                            recordclassifying: JSON.stringify(this.thsDataSetCode)
                        }]
                    }).then(res => {
                        if (res) {
                            let sucData = res.body.data.data;
                            let menuData = [];
                            sucData.map(x => {
                                let menu = {
                                    mpiId: data.mpiId,
                                    efftime: x.efftime,
                                    menuLevel: 1,
                                    menuName: x.docformat,
                                    storageTime: x.uptime,
                                    subtitle: x.uptime,
                                    docTotal: x.total,
                                    dataSetTotal: x.recordclassifying.split(',').length,
                                    breadcrumbName: x.docformat
                                }
                                menuData.push(menu)
                            })

                            this.allDocTypeData = menuData;

                            this.showData = this.allDocTypeData;
                            this.bottomArrChoose = this.bottomArrLevel1;
                            this.chooseIcon = this.iconFontCss[0];
                            this.isFolder = true;
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
                } else if (data.menuLevel == 1) {
                    this.folderLoading = true;
                    this.datasetSelectShow = true;
                    $ajax({
                        url: 'api/bsoftdms.SearchDocRpcServiceImpl/queryDatasetByDocFormat',
                        jsonData: [{
                            mpiId: data.mpiId,
                            efftime: data.efftime,
                            docformat: data.menuName,
                            recordclassifying:JSON.stringify(this.thsDataSetCode)
                        }]
                    }).then(res => {
                        if (res) {
                            let sucData = res.body.data.data;
                            let menuData = [];
                            sucData.map(x => {
                                let menu = {
                                    menuLevel: 2,
                                    menuName: x.msgType,
                                    subtitle: x.datasetName,
                                    storageTime: x.uptime,
                                    docTotal: x.total,
                                    mpiId: data.mpiId,
                                    docformat: data.menuName,
                                    efftime: x.efftime,
                                    recordclassifying: x.recordclassifying,
                                    breadcrumbName: x.datasetName,
                                    cdaType:x.cdaType
                                }
                                // 如果是cda  显示EMR-SD-xx
                                if(menu.docformat == 'CDA'){
                                    menu.menuName = menu.cdaType;
                                }
                                menuData.push(menu)
                            })


                            this.allDocTypeData = menuData;

                            this.showData = this.allDocTypeData;
                            this.bottomArrChoose = this.bottomArrLevel2;
                            this.chooseIcon = this.iconFontCss[0];
                            this.isFolder = true;
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
                } else if (data.menuLevel == 2) {
                    this.folderLoading = true;
                    this.datasetSelectShow = false;
                    $ajax({
                        url: 'api/bsoftdms.SearchDocRpcServiceImpl/queryDocs',
                        jsonData:[{
                            mpiId: data.mpiId,
                            efftime: data.efftime,
                            docformat: data.docformat,
                            recordclassifying:data.recordclassifying
                        }]
                    }).then(res => {
                        if (res) {
                            let sucData = res.body.data.data;
                            console.log(sucData)
                            let menuData = [];
                            console.log(data)
                            sucData.map(x => {
                                let menu = {
                                    menuLevel: 3,
                                    menuName: data.cdaType+'-'+sucData.docformat==='02'?data.breadcrumbName:data.menuName+'-'+data.breadcrumbName+'-'+x.docId,
                                    subtitle: x.uptime,
                                    effTime: x.efftime,
                                    bsxmlName: data.subtitle,
                                    sourceId: x.sourceId,
                                    msgCode: data.menuName,
                                    docformat: x.docformat,
                                    filepath: x.filepath,
                                    datasetName: data.subtitle,
                                    storeType: x.storeType,
                                    breadcrumbName: data.menuName
                                }
                                menuData.push(menu)
                            })
                            this.allDocData = menuData;
                            this.showData = this.allDocData;
                            this.bottomArrChoose = this.bottomArrLevel3;
                            this.chooseIcon = this.iconFontCss[1];
                            this.isFolder = false;
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
                } else if (data.menuLevel == 3) {
                    // this.docXmlLoading = true;
                    $ajax({
                        url: 'api/bsoftdms.SearchDocRpcServiceImpl/queryDocDetail',
                        jsonData: [{
                            docId: data.menuName,
                            storeType: data.storeType,
                            docformat: data.docformat,
                            filePath: data.filepath,
                            uid: this.uid,
                            urt: this.urt,
                            //privacysign : this.thsSelectPatient.privacysign
                            mpiId:this.thsSelectPatient.mpiId
                        }]
                    }).then(res => {
                        if (res) {
                            console.log('文档查看', res);
                            this.dialogTitle = "文档查看("+data.datasetName+")";
                            // bsxml 允许转换cda操作     01 Cda 允许结构化展示
                            if(data.docformat === '02'){
                                this.docTitle = "BSXML(原始)";//data.datasetName + "(原始)";
                                this.docTitleBsxmlFormat = 'BSXML(结构化)';//data.datasetName + "(BSXML结构化)";
                                this.docTitleCDA = '共享文档(原始)';//data.datasetName + "(CDA)";
                                this.docTitleFormat = '共享文档(结构化)';//data.datasetName + "(CDA结构化)";
                            } else if(data.docformat === '01'){
                                this.docTitle = "共享文档(原始)";//data.datasetName;
                                this.docTitleFormat = '共享文档(结构化)';//data.datasetName + "(结构化)";
                            } else {
                                this.docTitle = "原始文档";//data.datasetName;
                            }
                            this.docxml = res.body.data.data;
                            this.sourceDocXml = res.body.data.sourceData;
                        } else {
                            this.$message({
                                message: '查询文档失败！',
                                duration: '1500',
                                type: 'error',
                                offset: 50
                            })
                        }
                        // this.docXmlLoading = false;
                    });
                }

            },
            // 切换tab时  第一次转换cda  转换过了就不再执行这个操作
            tabChange(e){
                // 第一次转换
                if (e.name === 'docxmlCda' && this.docxmlCda === ""){
                    this.getCdaXml();
                } else if(e.name === 'bsxmlFormat' && this.bsxmlFormat.length === 0){
                    // 后台脱敏后如果无权访问不允许结构化，这里写死是不请求后台
                    if(this.docxml === '无权访问'){
                        this.bsxmlFormat = [];
                        this.formatAuth = false;
                        // this.bsxmlFormat = [{
                        //     label:'原XML无权访问，无权结构化',
                        //     text: ''
                        // }];
                    } else {
                        this.formatAuth = true;
                        this.getFormatBSXml();
                    }
                } else if(e.name == 'docxmlFormat' && this.docInfoNodes.length == 0 && this.componentNodes.length == 0 && this.recordTargetNodes.length == 0){
                    // 后台脱敏后如果无权访问不允许结构化，这里写死是不请求后台
                    if(this.docxmlCda == '无权访问'){
                        // this.docInfoNodes = [{
                        //     label:'原CDA无权访问，无权结构化',
                        //     text: ''
                        // }];
                        this.cdaFormatAuth = false;
                        this.componentNodes = [];
                        this.docInfoNodes = [];
                        this.recordTargetNodes = [];
                    } else {
                        this.cdaFormatAuth = true;
                        this.getFormatCDAXml();
                    }
                }
            },
            // 转换cda
            getCdaXml(){
                this.docCdaLoading = true;
                $ajax({
                    url: 'api/bsoftdms.SearchDocRpcServiceImpl/bsxmlToCda',
                    jsonData: [{
                        uid: this.uid,
                        urt: this.urt,
                        bsxml : this.sourceDocXml,
                        //privacysign : this.thsSelectPatient.privacysign
                        mpiId:this.thsSelectPatient.mpiId
                    }]
                }).then(res => {
                    if (res) {
                        this.docxmlCda = res.body.data.cda;
                    } else {
                        this.$message({
                            message: '查询文档失败！',
                            duration: '1500',
                            type: 'error',
                            offset: 50
                        })
                    }

                    this.docCdaLoading = false;
                });
            },
            // 获取Bsxml的结构化xml
            getFormatBSXml(){
                let _this = this;
                this.docFormatLoading = true;
                $ajax({
                    url: 'api/bsoftdms.SearchDocRpcServiceImpl/structuredXml',
                    jsonData: [{
                        xml : this.docxml,
                        msgType : this.thsShowDocInfo.msgCode
                    }]
                }).then(res => {
                    if (res&&res.body.meta.statusCode=='200') {
                        _this.bsxmlFormat = res.body.data.nodes;
                    } else {
                        this.$message({
                            message: '查询文档失败！',
                            duration: '1500',
                            type: 'error',
                            offset: 50
                        })
                    }
                    this.docFormatLoading = false;
                });
            },
            // 获取CDA的结构化xml
            getFormatCDAXml(){
                let _this = this;
                this.docFormatLoading = true;
                $ajax({
                    url: 'api/bsoftdms.SearchDocRpcServiceImpl/structuredXmlExtension',
                    jsonData: [{
                        // bsxml : this.sourceDocXml,
                        // cda : this.docxmlCda,
                        xml:this.sourceDocXml,
                        docFormat:this.currentDocFormat,
                        // bsxml : this.docxmlCda,
                        // cda : this.sourceDocXml,
                        msgType : this.thsShowDocInfo.msgCode,
                        uid: this.uid,
                        urt: this.urt,
                        //privacysign : this.thsSelectPatient.privacysign
                        mpiId:this.thsSelectPatient.mpiId
                    }]
                }).then(res => {
                    if (res) {
                        if(_this.docxmlCda === ""){
                            _this.docxmlCda = res.body.data.cda;
                        }
                        _this.componentNodes = res.body.data.componentNodes;
                        _this.docInfoNodes = res.body.data.docInfoNodes;
                        _this.recordTargetNodes = res.body.data.recordTargetNodes;
                    } else {
                        this.$message({
                            message: '查询文档失败！',
                            duration: '1500',
                            type: 'error',
                            offset: 50
                        })
                    }
                    this.docFormatLoading = false;
                });
            },
            // bsxml可以转成cda导出
            exportCheckDocsToCDA() {
                if (this.thsCheckedItems.length == 0) {
                    this.$message({
                        message: '请先选中导出的文档！',
                        duration: '1500',
                        type: 'warning',
                        offset: 50
                    })
                    return;
                }

                let docformatList = [];
                let datasetList = [];
                let docList = [];

                let paramData = {
                    exportType: '01', // 01转为cda
                    mpiId: this.thsSelectPatient.mpiId,
                    zipName: this.thsSelectPatient.name,
                    efftime: "",
                    docformat: "",
                    docformatList: docformatList,
                    datasetList: datasetList,
                    docList: docList,
                }

                this.thsCheckedItems.map(x => {
                    paramData.efftime = this.showData[x].efftime;
                    if (this.showData[x].menuLevel == "1") {
                        paramData.docformat = '01';
                        docformatList.push(this.showData[x].menuName);
                    } else if (this.showData[x].menuLevel == "2") {
                        paramData.docformat = '01';
                        datasetList.push(this.showData[x].recordclassifying);
                    } else if (this.showData[x].menuLevel == "3") {
                        paramData.docformat = '01';
                        docList.push(this.showData[x].menuName);
                    }
                })
                this.exportPost(paramData);
            },
            // 导出选中文档
            exportCheckDocs() {
                console.log(this.thsSelectPatient.name)
                if (this.thsCheckedItems.length == 0) {
                    this.$message({
                        message: '请先选中导出的文档！',
                        duration: '1500',
                        type: 'warning',
                        offset: 50
                    })
                    return;
                }

                let docformatList = [];
                let datasetList = [];
                let docList = [];

                let paramData = {
                    mpiId: this.thsSelectPatient.mpiId,
                    zipName: this.thsSelectPatient.name,
                    efftime: "",
                    docformat: "",
                    docformatList: docformatList,
                    datasetList: datasetList,
                    docList: docList,
                }
                  console.log(this.showData)
                this.thsCheckedItems.map(x => {
                    paramData.efftime = this.showData[x].efftime;
                    if (this.showData[x].menuLevel == "1") {
                        paramData.docformat = this.showData[x].menuName;
                        docformatList.push(this.showData[x].menuName);
                    } else if (this.showData[x].menuLevel == "2") {
                        paramData.docformat = this.showData[x].docformat;
                        datasetList.push(this.showData[x].recordclassifying);
                    } else if (this.showData[x].menuLevel == "3") {
                        paramData.docformat = this.showData[x].docformat;
                        docList.push(this.showData[x].menuName);
                    } else {
                        console.log(123);
                    }
                })

                this.exportPost(paramData);

            },
            // 导出具体实现
            exportPost(paramData) {
                paramData['uid'] = this.uid;
                paramData['urt'] = this.urt;
                paramData['name'] = this.zipName;
               // paramData['privacysign'] = this.data.privacysign;
                paramData['datasetList']=JSON.stringify(paramData['datasetList'] );
                paramData['docList']=JSON.stringify(paramData['docList'] );
                paramData['docformatList']=JSON.stringify(paramData['docformatList'] );
                $ajax({
                    url: 'api/bsoftdms.SearchDocRpcServiceImpl/exportFolderForFastDFS',
                    jsonData: [paramData]
                }).then(res => {
                    if (res) {
                        console.log(res.body.data.host)
                        console.log(res.body.data.port)
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
            // 关闭时清除数据
            handleClose(done){
                this.docxml = "";
                this.docxmlCda = "";
                this.recordTargetNodes = [];
                this.docInfoNodes = [];
                this.componentNodes = [];
                this.bsxmlFormat = [];
                this.activeName =  'docxml';
                done();
            },
            dataSetChange(val){
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
            this.init();
        }
    })
})