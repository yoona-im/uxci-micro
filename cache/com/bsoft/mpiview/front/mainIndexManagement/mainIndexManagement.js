$class('com.bsoft.mpiview.front.mainIndexManagement.mainIndexManagement', {
    extend: 'ssdev.ux.vue.VueContainer',
    tpl: true,
    css: ['com.bsoft.mpiview.front.mainIndexManagement.mainIndexManagement', 'com.bsoft.mpiview.front.lib.iconfont.iconfont', 'com.bsoft.mpiview.front.style.common'],
    deps: ['com.bsoft.mpiview.front.component.MergeConfirm.MergeConfirm', 'com.bsoft.mpiview.front.component.MergeSelect.MergeSelect', 'com.bsoft.mpiview.front.component.MainIndexDetail.MainIndexDetail', 'com.bsoft.mpiview.front.component.IntersectRecord.IntersectRecord', 'com.bsoft.mpiview.front.component.PatientTrack.PatientTrack'],

    initComponent(conf) { // 组件初始化
        console.log('initComponent ...');
        const me = this;
        // data
        me.data = {
            searchForm: {
                name: '',
                idCard: '',
                patientPhone: '',
                cardNo: ''
            },
            pageNo: 1,
            pageSize: 10,
            currentPage: 1,
            total: '',
            tableData: [],
            mergeBtnDisabled: true,
            mergeConfirmDialog: false,
            selectIdList: [],
            mergeSelectDialog: false,
            mpiId: '',
            detailDialog: false,
            intersectDrawer: false,
            patientTrackDrawer: false,
            tableLoading: false,
        }
        // methods
        me.evtHandlers = {
            //设置表格头部的颜色
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
            formSearch() {
                this.pageNo = 1;
                this.queryMainIndexList();
            },
            queryMainIndexList() {
                let me = this;
                me.tableLoading = true;
                let params = {
                    pageNum: me.pageNo,
                    pageSize: me.pageSize,
                    isTc: false
                }
                Object.assign(params, me.searchForm)
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/selectPatientInfoByParamsForPage',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                       me.tableData = res.body.list;
                       me.pageSize = res.body.pageSize;
                       me.total = res.body.total;
                       me.pageNo = res.body.pageNum;
                    }
                    me.tableLoading = false;
                }).fail(function (e) {
                    console.error(e);
                    me.tableLoading = false;
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.queryMainIndexList();
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.queryMainIndexList();
            },
            resetForm() {
                this.$refs.searchForm.resetFields();
                this.pageNo = 1;
                this.pageSize = 10;
                this.queryMainIndexList();
            },
            toDetail(mpiId) {
                this.mpiId = mpiId;
                this.detailDialog = true;
            },
            cancelDetail() {
                this.detailDialog = false;
            },
            toIntersectRecord(obj) {
                this.mpiId = obj.mpiId;
                this.intersectDrawer = true;
            },
            cancelIntersect() {
                this.intersectDrawer = false;
            },
            toPatientTrack(mpiId) {
                this.mpiId = mpiId;
                this.patientTrackDrawer = true;
            },
            closePatientTrack() {
                this.patientTrackDrawer = false;
            },
            selectTable(selection) {
                if(selection && selection.length > 2) {
                    this.$message.info('请选择两条数据')
                }
                if(selection && selection.length === 2) {
                    this.mergeBtnDisabled = false;
                    console.log(selection)
                    this.selectIdList = selection.map(item => {
                        return {
                            mpiId: item.mpiId,
                            name: item.name
                        };
                    })
                } else {
                    this.mergeBtnDisabled = true;
                }
            },
            handleMerge() {
                this.mergeConfirmDialog = true;
            },
            confirmNext() {
                this.mergeConfirmDialog = false;
                this.mergeSelectDialog = true;
            },
            cancelMergeConfirm() {
                this.mergeConfirmDialog = false;
            },
            selectMainLast() {
                this.mergeSelectDialog = false;
                this.mergeConfirmDialog = true;

            },
            confirmSelectMain() {
                this.$refs.mergeSelect.mergeSelect();
            },
            submitMerge(obj, sourceMpiId) {
                let dto = JSON.parse(JSON.stringify(obj))
                delete dto.lastModifyTime;
                let me = this;
                
                let params = {
                    sourceMpiId,
                    targetMpiId: obj.mpiId, 
                    dto: obj
                }
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/manualMerge',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.queryMainIndexList();
                        me.cancelSelectMain();
                        me.$message.success('操作成功');
                    }
                }).fail(function (e) {
                    console.error(e);
                    me.$message.error('操作失败');
                })
            },
            cancelSelectMain() {
                this.mergeSelectDialog = false;
            }
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
        me.vue.queryMainIndexList();
    },

    afterVueConfInited(vueConf) {
        const me = this;
        vueConf.watch = { // 监听器
        }
        vueConf.computed = { // 计算属性
        }
        vueConf.filters = {
        }
    }
})