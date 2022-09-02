$define('com.bsoft.mpiview.front.component.MainIndexDetail.MainIndexDetail', {
    tpl: true,
    css: 'com.bsoft.mpiview.front.component.MainIndexDetail.MainIndexDetail',
}, function (html) {
    Vue.component('main-index-detail', {
        template: html,
        props: {
            mpiId: {
                type: String,
                default: '',
            },
            baseInfo: {
                type: Object,
                default() {
                    return null;
                },
            }
        },
        data() {
            return {
                detailForm: {},
                cardTableData: [],
                certTableData: [],
                addrTableData: [],
                otherontactTableData: [],
                contactTableData: [],
                systemTableData: [],
                activeName: 'name1',
                visitTypeEnums: {
                    OV: '门诊档案',
                    IV: '住院档案',
                    HV: '体检档案',
                    XV: '其他档案',

                }
            };
        },
        methods: {
            handleSplit() {
                let message = `确认要将业务ID为的记录拆分吗`;
                        this.$confirm(message, '拆分', {
                            confirmButtonText: '确定',
                            type: 'warning',
                        }).then(() => {
                        }).catch(() => {
                        })
            },
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
            getMainIndexDetail() {
                let me = this;
                let params = {
                    mpiId: me.mpiId
                }
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/selectPatientDetailInfo',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        me.detailForm = res.body.mpiPatientInfo || {};
                        me.cardTableData = res.body.cardInfo;
                        me.certTableData = res.body.certificateInfo;
                        me.addrTableData = res.body.addrInfo;
                        me.otherontactTableData = res.body.contInfo;
                        me.contactTableData = res.body.contactInfo;
                        me.systemTableData = res.body.sourcePatientInfo;
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
        },
        mounted() {
            if(this.mpiId) {
                console.log('mpiId', this.mpiId)
                this.getMainIndexDetail()
            } else if(this.baseInfo){
                console.log('baseInfo', this.baseInfo)
                this.detailForm = this.baseInfo || {};
                this.cardTableData = this.baseInfo.cardInfos;
                this.certTableData = this.baseInfo.certificateInfos;
                this.addrTableData = this.baseInfo.addrInfos;
                this.otherontactTableData = this.baseInfo.contInfos;
                this.contactTableData = this.baseInfo.contactInfos;
                this.systemTableData = this.baseInfo.sourcePatientInfos;
            }
        },
    })
})