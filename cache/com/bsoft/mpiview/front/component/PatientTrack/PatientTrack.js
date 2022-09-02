$define('com.bsoft.mpiview.front.component.PatientTrack.PatientTrack', {
    tpl: true,
    css: ['com.bsoft.mpiview.front.component.PatientTrack.PatientTrack', 'com.bsoft.mpiview.front.style.common'],
}, function (html) {
    let me;
    Vue.component('patient-track', {
        template: html,
        props: {
            mpiId: {
                type: String,
                default: '',
            }
        },
        data() {
            return {
                trackExpand: false,
                pageNo: 1,
                pageSize: 10,
                currentPage: 1,
                total: 0,
                pages: 1,
                typeEnums: {
                    REGISTER: {
                        code: '1',
                        name: '注册'
                    },
                    MERGE: {
                        code: '2',
                        name: '合并'
                    },
                    UPDATE: {
                        code: '3',
                        name: '更新'
                    },
                    SPLIT: {
                        code: '4',
                        name: '拆分'
                    },
                },
                trackList: [
                ],
                isBottom: false,
                tableLoading: false,
            };
        },
        methods: {
            //设置表格头部的颜色
            headClass() {
                return 'background:#e7e7e7'
            },
            queryPatientTrack() {
                let params = {
                    mpiId: me.mpiId,
                    pageNum: me.pageNo,
                    pageSize: me.pageSize,
                }
                me.tableLoading = true;
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/selectPatientTrackByParamsForPage',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        let list = res.body.list.map(item => {
                            item.expand = false;
                            item.contentJson = JSON.parse(item.contentJson)
                            return item;
                        });
                        me.trackList.push(...list);
                        me.pageSize = res.body.pageSize;
                        me.total = res.body.total;
                        me.pageNo = res.body.pageNum;
                        me.pages = res.body.pages;
                        me.$refs.patientTrack.addEventListener("scroll", me.scrollEvt);
                    }
                    me.tableLoading = false;
                }).fail(function (e) {
                    console.error(e);
                    me.tableLoading = false;
                    me.$refs.patientTrack.addEventListener("scroll", me.scrollEvt);
                })
            },
            scrollEvt(e) {
                let bottomH = e.srcElement.scrollHeight-e.srcElement.scrollTop-e.srcElement.clientHeight;
                if(bottomH <= 10){//底部
                    if(this.pageNo < this.pages) {
                        this.pageNo += 1;
                        this.$refs.patientTrack.removeEventListener("scroll", this.scrollEvt);
                        this.queryPatientTrack();
                    } else {
                        if(this.pageNo > 1) {
                            this.isBottom = true;
                        }
                        
                    }
                    }
            }
        },
        mounted() {
            if(this.mpiId) {
                this.queryPatientTrack();
            }
        },
        beforeCreate() {
            me = this;
        },
        filters: {
            typeFilter(val) {
                for (let key in me.typeEnums) {
                    if (me.typeEnums[key].code === val) {
                        return me.typeEnums[key].name;
                    }
                }
            },
        }
    })
})