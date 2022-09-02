$define('com.bsoft.mpiview.front.component.MergeConfirm.MergeConfirm', {
    tpl: true,
    css: 'com.bsoft.mpiview.front.component.MergeConfirm.MergeConfirm',
}, function (html) {
    Vue.component('merge-confirm', {
        template: html,
        props: {
            mpiIds: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                suspectedList: [
                ], 
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
            querySuspectedList(object) {
                let me = this;
                let mpiId = object.mpiId;
                // let mpiId = 'fbea83d9c22b4614825d20ffc8ca4146';
                let name = object.name;
                let obj = {
                    name,
                    mpiId,
                }
                let params = {
                    mpiId,
                }
                $ajax({
                    url: 'api/mpiview.mpiManageRpcService/selectAllSuspectMpiByMpiId',
                    jsonData: [params]
                }).then(function (res) {
                    if (res && res.code == 200) {
                        obj.list = res.body
                        me.suspectedList.push(obj)
                        console.log(me.suspectedList)
                    }
                }).fail(function (e) {
                    console.error(e);
                })
            },
        },
        mounted() {
            if(this.mpiIds.length) {
                this.mpiIds.forEach(item => {
                    this.querySuspectedList(item)
                })
            }
        },
        filters: {
        }
    })
})