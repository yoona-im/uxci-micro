$define('com.bsoft.civ.front.component.systemDicManagementType.orgDeptDicManagement.orgDeptDicManagement', {
    tpl: true,
    css: [
        'com.bsoft.civ.front.component.systemDicManagementType.orgDeptDicManagement.orgDeptDicManagement'
    ],
    deps: []
}, function (html) {
    Vue.component('org-dept-dic-management', {
        template: html,
        props: [],
        data() {
            return {
                orgDeptsData: [],
                syncOrgDeptLoading: false,
                syncOrgDeptAnimate: false,
                orgDeptTreeProps: {
                    label: "name",
                    children: "children",
                },
                hasDataShow: true,
                getOrgDeptLoading: false,
            };
        },
        methods: {
            toSystemVarConfig() {
                this.$emit('toSystemVarConfig');
            },
            getOrgDepts() {
                let ths = this;
                ths.getOrgDeptLoading = true;
                $api.systemDicManagement.queryOrgAndDeptTree().then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.orgDeptsData = res.body.data;
                        if (ths.orgDeptsData && ths.orgDeptsData.length > 0) {
                            ths.hasDataShow = true;
                        } else {
                            ths.hasDataShow = false;
                        }
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.getOrgDeptLoading = false;
                }).fail(function (e) {
                    ths.getOrgDeptLoading = false;
                    ths.$message.error(e.msg);
                });
            },
            syncOrgDept(orgCode) {
                let ths = this;
                if (!orgCode) { // 点击的同步按钮
                    ths.syncOrgDeptLoading = true;
                } else { // 点击的同步图标
                    ths.syncOrgDeptAnimate = true;
                }
                $api.systemDicManagement.syncOrganizationAndDepartment({ jgdm: orgCode }).then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.$message.success('机构科室同步成功');
                        ths.getOrgDepts();
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    if (!orgCode) { // 点击的同步按钮
                        ths.syncOrgDeptLoading = false;
                    } else { // 点击的同步图标
                        ths.syncOrgDeptAnimate = false;
                    }
                }).fail(function (e) {
                    if (!orgCode) { // 点击的同步按钮
                        ths.syncOrgDeptLoading = false;
                    } else { // 点击的同步图标
                        ths.syncOrgDeptAnimate = false;
                    }
                    ths.$message.error(e.msg);
                });
            }
        },
        mounted() {
            // 加载一次数据，如果为空就展示跳转按钮
            this.getOrgDepts();
        }
    })
})