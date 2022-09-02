$define('com.bsoft.mpiview.front.component.IntersectRecord.IntersectRecord', {
    tpl: true,
    css: ['com.bsoft.mpiview.front.component.IntersectRecord.IntersectRecord', 'com.bsoft.mpiview.front.style.common'],
}, function (html) {
    Vue.component('intersect-record', {
        template: html,
        props: {
            mpiId: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                mainIndexList: [],
                searchForm: {
                    orgCode: '',
                    businessSystemCode: '',
                    name: '',
                    idCard: '',
                    patientPhone: '',
                    cardId: '',
                },
                intersectTableData: [],
                systems: [],
                orgs: [
                ],
                pageNo: 1,
                pageSize: 10,
                total: '',
                sourcePatientId: '',
                businessId: '',
                tableLoading: false,
                visitTypeEnums: {
                    OV: '门诊档案',
                    IV: '住院档案',
                    HV: '体检档案',
                    XV: '其他档案',
                }
            };
        },
        methods: {
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
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.querySuspectedList();
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.querySuspectedList();
            },
            querySuspectedList() {
                let me = this;
                me.tableLoading = true;
                let params = {
                    mpiId: me.mpiId,
                    pageNum: me.pageNo,
                    pageSize: me.pageSize,
                    isTc: false,
                }
                Object.assign(params, me.searchForm)
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/selectSourcePatientInfoByParamsForPage',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.intersectTableData = res.body.list; 
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
            getMianIndexDetail() {
                let me = this;
                let params = {
                    mpiId: me.mpiId,
                }
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/selectOnePatientInfo',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.mainIndexList = [res.body];
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
            resetForm() {
                this.$refs.searchForm.resetFields();
                this.pageNo = 1;
                this.pageSize = 10;
                this.sourcePatientId = '';
                this.querySuspectedList();
            },
            formSearch() {
                this.pageNo = 1;
                this.sourcePatientId = '';
                this.querySuspectedList();
            },
            intersectTableChange(row) {
                if(row) {
                    this.sourcePatientId = row.patientId;
                    this.businessId = row.businessId;
                }
            },
            handleSplit() {
                let message = `确认要将业务ID为【${this.businessId}】的记录拆分吗`;
                        this.$confirm(message, '拆分', {
                            confirmButtonText: '确定',
                            type: 'warning',
                        }).then(() => {
                            this.splitRecord();
                        }).catch(() => {
                        })
            },
            splitRecord() {
                let me = this;
                const params = {
                    sourcePatientId: me.sourcePatientId,
                    mpiId: me.mpiId
                }
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/splitSourcePatient',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.querySuspectedList();
                        me.$message.success('操作成功');
                        me.sourcePatientId = '';
                        me.businessId = '';
                    }
                }).fail(function (e) {
                    console.error(e);
                    if (e && e.msg) {
                        me.$message.error(e.msg)
                    }
                }) 
            },
            cancelSplit() {
            },
            queryOrgList() {
                let me = this;
                const params = {
                    isTc: false,
                }
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/selectAuthorOrganInfo',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.orgs = res.body.filter(item => item.authorOrganizationName);
                    }
                }).fail(function (e) {
                    console.error(e);
                }) 
            },
            querySystemList() {
                let me = this;
                const params = {
                    isTc: false,
                }
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/selectBusinessSystemCodeInfo',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.systems = res.body.filter(item => item);
                    }
                }).fail(function (e) {
                    console.error(e);
                }) 
            },
        },
        mounted() {
            if(this.mpiId) {
                this.getMianIndexDetail();
                this.querySuspectedList();
            }
            this.queryOrgList();
            this.querySystemList();
        },
        filters: {
        }
    })
})