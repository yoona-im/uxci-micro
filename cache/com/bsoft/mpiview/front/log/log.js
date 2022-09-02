$class('com.bsoft.mpiview.front.log.log', {
    extend: 'ssdev.ux.vue.VueContainer',
    tpl: true,
    css: ['com.bsoft.mpiview.front.log.log', 'com.bsoft.mpiview.front.lib.js.codemirror.codemirror', 'com.bsoft.mpiview.front.lib.iconfont.iconfont', 'com.bsoft.mpiview.front.style.common'],
    deps: ['com.bsoft.mpiview.front.lib.js.codemirror.codemirror', 'com.bsoft.mpiview.front.lib.common.utils', 'com.bsoft.mpiview.front.component.MainIndexDetail.MainIndexDetail' ],

    initComponent(conf) { // 组件初始化
        console.log('initComponent ...');
        const me = this;
        // data
        me.data = {
            searchForm: {
                type: '',
                timeRange: [],
                name: '',
                idCard: '',
                phone: '',
                cardId: ''
            },
            options: [],
            pageNo: 1,
            pageSize: 10,
            currentPage: 1,
            total: '',
            tableData: [],
            operateEnums: {
                REGIST: {
                    code: '0',
                    name: '注册'
                },
                UPDATE: {
                    code: '1',
                    name: '更新'
                },
                MANUALMERAGE: {
                    code: '2',
                    name: '手动合并'
                },
                AUTOMERAGE: {
                    code: '3',
                    name: '自动合并'
                },
                SPLIT: {
                    code: '4',
                    name: '拆分'
                },
                INTERFACEQUERY: {
                    code: '5',
                    name: '接口查询'
                },
            },
            docId: '',
            innerTableData: {},
            viewError: false,
            detailDialog: false,
            allOriTableData: [],
            inputValue: '',
            outputValue: '',
            codeOptions: {
                lineNumbers: true,
                mode: {
                    name: 'javascript',
                    json: true,
                },
                line: true,
                lineWrapping: true,
                readOnly: true,
                extraKeys:{
                    "F7": function autoFormat(editor) {
                       var totalLines = editor.lineCount();
                             editor.autoFormatRange({line:0, ch:0}, {line:totalLines});
                   }//代码格式化
               },
            },
            isError: true,
            innerDetailDialog: false,
            baseInfo: {},
            tableLoading: false,
            aWeekRange: [],
        }
        // methods
        me.evtHandlers = {
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
            expandClass(row, rowIndex) { 
                if(row.row.type === this.operateEnums.MANUALMERAGE.code || row.row.type == this.operateEnums.AUTOMERAGE.code) {
                    return '';
                } else {
                    return 'log-expand';
                }
            },
            formSearch() {
                this.pageNo = 1;
                this.queryLogList();
            },
            queryLogList() {
                let me = this;
                console.log(me.searchForm.timeRange)
                let params = {
                    pageNum: me.pageNo,
                    pageSize: me.pageSize,
                    type: me.searchForm.type,
                    operateTimeStart: me.searchForm.timeRange ? me.searchForm.timeRange[0] : '',
                    operateTimeEnd: me.searchForm.timeRange ? me.searchForm.timeRange[1] : '',
                    name: me.searchForm.name,
                    idCard: me.searchForm.idCard,
                    phone: me.searchForm.phone,
                    cardId: me.searchForm.cardId
                }
                me.tableLoading = true;
                $ajax({
                    url: 'api/mpiview.mpiSystemLogRpcService/getOperationForPage',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.allOriTableData = res.body.list;
                        me.tableData = me.allOriTableData;
                        // me.tableData[5].status = '2'
                        me.viewError && me.filterList(me.viewError)
                        me.pageSize = res.body.pageSize;
                        me.total = res.body.total;
                        me.pageNo = res.body.pageNum;
                    }
                    me.tableLoading = false;
                }).fail(function (e) {
                    me.tableLoading = false;
                    console.error(e);
                })
            },
            expandChange(row) {
                console.log(row)
                this.docId = row.docId;
                this.queryOperateList();
            },
            queryOperateList() {
                let me = this;
                let params = {
                    docId: me.docId,
                }
                $ajax({
                    url: 'api/mpiview.mpiSystemLogRpcService/getMergeOrRemoveMpi',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.$set(me.innerTableData, me.docId, res.body)
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
            filterList(val) {
                if(val === true) {
                    this.tableData = this.allOriTableData.filter(item => item.status === '2');
                } else if(val === false) {
                    this.tableData = this.allOriTableData;
                }
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.queryLogList();
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.queryLogList();
            },
            resetForm() {
                this.$refs.searchForm.resetFields();
                this.pageNo = 1;
                this.pageSize = 10;
                this.searchForm.timeRange =this.aWeekRange;
                this.queryLogList();
            },
            toDetail(docId, status) {
                let me = this;
                me.docId = docId;
                let params = {
                    docId: me.docId,
                }
                $ajax({
                    url: 'api/mpiview.mpiSystemLogRpcService/getRequestAndReturnData',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.detailDialog = true;
                        me.inputValue = res.body.requestData ? (jsonFormat(res.body.requestData) ||  `"${res.body.requestData}"`) : '';
                        me.outputValue = res.body.returnData ? jsonFormat(res.body.returnData) : res.body.errorData ? jsonFormat(res.body.errorData) : '';
                        if(status === '2') {
                            me.isError = true;
                        } else {
                            me.isError = false;
                        }
                        this.$nextTick(() => {
                            me.initCode();
                        })
                        
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
            cancelDetail() {
                this.detailDialog = false;
                this.docId = '';
            },
            initCode() {
                // this.$nextTick(() => {
                    this.inputEditor = CodeMirror.fromTextArea(this.$refs.inputCode, this.codeOptions);
                    this.outputEditor = CodeMirror.fromTextArea(this.$refs.outputCode, this.codeOptions);
                // })
            },
            clickInnerDetail(row) {
                this.toInnerDetail(row);
            },
            toInnerDetail(baseInfo) {
                this.innerDetailDialog = true;
                this.baseInfo = baseInfo;
                console.log(this.baseInfo)
            },
            cancelInnerDetail() {
                this.innerDetailDialog = false;
                this.baseInfo = {};
            },
            formatTime(date) {
                // 日期格式化
                const y =  date.getFullYear();
                const M =  ('0' + (date.getMonth() + 1)).substr(-2);
                const d =  ('0' + date.getDate()).substr(-2);
                const h =  ('0' + date.getHours()).substr(-2);
                const m =  ('0' + date.getMinutes()).substr(-2);
                const s =  ('0' + date.getSeconds()).substr(-2);
                return `${y}-${M}-${d} ${h}:${m}:${s}`; 
              },
        }
        me.callParent(arguments)
    },

    afterInitComponent() { // 组件初始化之后
        console.log('afterInitComponent ...');
        const me = this;
    },

    afterAppend() { // 是页面渲染完毕之后执行的方法。在这里加载数据可以避免由于数据加载出错导致页面渲染失败
        console.log('afterAppend ...');
        const me = this;
        let now = new Date().getTime();
        let aWeekAogo = me.vue.formatTime(new Date((now - 86400000 * 6))).split(' ')[0].slice(0, 10) + ' 00:00:00';
        let nowTime = me.vue.formatTime(new Date(now)).split(' ')[0].slice(0, 10) + ' 23:59:59';
        // 使用value-format后必须将赋值字段保持格式不然会报错，整体替换
        me.vue.searchForm.timeRange = [aWeekAogo, nowTime];
        me.vue.aWeekRange = [aWeekAogo, nowTime];
        me.vue.queryLogList();
    },

    afterVueConfInited(vueConf) {
        const me = this;
        vueConf.watch = { // 监听
        }
        vueConf.computed = { // 计算属性
        }
        vueConf.filters = {
            operateFilter(val) {
                for (let key in me.data.operateEnums) {
                    if (me.data.operateEnums[key].code === val) {
                        return me.data.operateEnums[key].name;
                    }
                }
            },
        }
    }
})