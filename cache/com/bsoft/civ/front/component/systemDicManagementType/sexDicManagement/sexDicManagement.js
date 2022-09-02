$define('com.bsoft.civ.front.component.systemDicManagementType.sexDicManagement.sexDicManagement', {
    tpl: true,
    css: [
        'com.bsoft.civ.front.component.systemDicManagementType.sexDicManagement.sexDicManagement'
    ],
    deps: []
}, function (html) {
    Vue.component('sex-dic-management', {
        template: html,
        props: [],
        data() {
            return {
                allOrgDic: [],
                // search
                searchOrgCode:  $env.globalContext.getContext().urt.orgCd || '', // 默认应是当前用户的当前机构，如果没有就是 ''
                searchText: '',
                searchOrgCodeSelect: [],
                // table
                sexDicTableLoading: false,
                sexDicTableData: [],
                sexDicTableSearchPageSize: 10,
                sexDicTableSearchPageNum: 1,
                sexDicTableDataTotal: 10,
                // addUpdateSexDialog
                addUpdateSexDialogTitle: '新增性别',
                addUpdateSexDialogVisible: false,
                addUpdateSexFormData: {
                    sexCode: '',
                    sexName: '',
                    orgCode: ''
                },
                addUpdateSexFormRules: {
                    sexCode: [
                        { required: true, message: '编码不能为空', trigger: 'blur' },
                        { pattern: /^[A-Za-z0-9]+$/, message: '只允许输入英文和数字' },
                    ],
                    sexName: [
                        { required: true, message: '名称不能为空', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
                    ],
                },
                dicItemCodeInputDisabled: false,
                // importDicDialog
                downloadExcelLoading: false,
                importDicOrgCodeSelect: [],
                importDicDialogVisible: false,
                importDicFormData: {
                    orgCode: '',
                    fileList: [],
                    status: 0
                },
                importDicFormRules: {
                    orgCode: [
                        { required: true, message: '机构不能为空', trigger: 'change' },
                    ],
                    fileList: [
                        { required: true, message: '文件不能为空', trigger: 'change' },
                    ],
                    status: [
                        { required: true, message: '导入类型不能为空', trigger: 'change' },
                    ],
                },

            };
        },
        methods: {
            getAllOrg() {
                let ths = this;
                $api.systemDicManagement.queryOrganization().then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.allOrgDic = [...res.body.data];
                        let allOrg = { organizationCode: '', organizationName: '全部' }
                        ths.searchOrgCodeSelect = [allOrg, ...res.body.data];
                        ths.importDicOrgCodeSelect = res.body.data;
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                }).fail(function (e) {
                    ths.$message.error(e.msg);
                });
            },
            getSexDic() {
                // 查询性别字典
                let ths = this;
                ths.sexDicTableLoading = true;
                $api.systemDicManagement.querySexDictionary({
                    jgdm: ths.searchOrgCode,
                    queryParam: ths.searchText,
                    page: ths.sexDicTableSearchPageNum,
                    pageSize: ths.sexDicTableSearchPageSize
                }).then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.sexDicTableData = res.body.data.list;
                        ths.sexDicTableDataTotal = res.body.data.total;
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.sexDicTableLoading = false;
                }).fail(function (e) {
                    ths.sexDicTableLoading = false;
                    ths.$message.error(e.msg);
                });
            },
            searchDic() {
                this.sexDicTableSearchPageNum = 1;
                this.getSexDic();
            },
            importDic() {
                let ths = this;
                ths.importDicDialogVisible = true;
                ths.$nextTick(function () {
                    ths.$refs.importDicForm.clearValidate();
                });
            },
            addDic() {
                if (this.searchOrgCode) {
                    this.addUpdateSexDialogTitle = '新增性别';
                    this.addUpdateSexDialogVisible = true;
                    this.dicItemCodeInputDisabled = false;
                    this.addUpdateSexFormData.sexCode = '';
                    this.addUpdateSexFormData.sexName = '';
                    this.addUpdateSexFormData.orgCode = this.searchOrgCode;
                } else {
                    this.$message.warning('请先选择要添加字典的机构');
                }
            },
            sexDicTableSizeChange(val) {
                this.sexDicTableSearchPageSize = val;
                this.getSexDic();
            },
            sexDicTableCurrentChange(val) {
                this.sexDicTableSearchPageNum = val;
                this.getSexDic();
            },
            updateSexDic(data) {
                this.addUpdateSexDialogTitle = '修改性别';
                this.addUpdateSexDialogVisible = true;
                this.dicItemCodeInputDisabled = true;
                this.addUpdateSexFormData.sexCode = data.sexCode;
                this.addUpdateSexFormData.sexName = data.sexName;
                this.addUpdateSexFormData.orgCode = data.organization;
            },
            delSexDic(data) {
                let ths = this;
                ths.$confirm('<span><span>确定删除该字典项【' + data.sexName + ' - ' + data.sexCode + '】？</span>', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    customClass: 'dic-delete-confirm',
                    closeOnClickModal: false
                }).then(() => {
                    // 请求删除字典项
                    $api.systemDicManagement.deleteSexDictionary({
                        sexCode: data.sexCode,
                        organization: data.organization,
                    }).then(function (res) {
                        if (res.body.meta.statusCode == '200') {
                            ths.$message.success('性别字典删除成功');
                            ths.getSexDic();
                        } else {
                            ths.$message.warning(res.body.meta.message);
                        }
                    }).fail(function (e) {
                        ths.$message.error(e.msg);
                    });
                })
            },
            addUpdateSex() {
                let ths = this;
                ths.$refs.addUpdateSexForm.validate((valid) => {
                    if (valid) {
                        if (ths.dicItemCodeInputDisabled) {
                            // 更新性别字典
                            $api.systemDicManagement.updateSexDictionary({
                                sexCode: ths.addUpdateSexFormData.sexCode,
                                sexName: ths.addUpdateSexFormData.sexName,
                                organization: ths.addUpdateSexFormData.orgCode,
                            }).then(function (res) {
                                if (res.body.meta.statusCode == '200') {
                                    ths.$message.success('性别字典更新成功');
                                    ths.addUpdateSexDialogVisible = false;
                                    ths.getSexDic();
                                } else {
                                    ths.$message.warning(res.body.meta.message);
                                }
                            }).fail(function (e) {
                                ths.$message.error(e.msg);
                            });
                        } else {
                            // 新增性别字典
                            $api.systemDicManagement.addSexDictionary({
                                sexCode: ths.addUpdateSexFormData.sexCode,
                                createTime: $utils.formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                                organization: ths.addUpdateSexFormData.orgCode,
                                sexName: ths.addUpdateSexFormData.sexName,
                            }).then(function (res) {
                                if (res.body.meta.statusCode == '200') {
                                    ths.$message.success('性别字典新增成功');
                                    ths.addUpdateSexDialogVisible = false;
                                    ths.getSexDic();
                                } else {
                                    ths.$message.warning(res.body.meta.message);
                                }
                            }).fail(function (e) {
                                ths.$message.error(e.msg);
                            });
                        }
                    }
                });
            },
            addUpdateSexDialogClose() {
                this.$refs.addUpdateSexForm.clearValidate();
            },
            sexDicTableDblClick(data) {
                this.updateSexDic(data);
            },
            handleChange(file, fileList) {
                this.importDicFormData.fileList = fileList;
            },
            importDicDialogClose() {
                // 清空文件
                this.importDicFormData.orgCode = '';
                this.importDicFormData.fileList = [];
                this.importDicFormData.status = 0;
                this.$refs.importDicFileUpload.clearFiles();
                this.$refs.importDicForm.clearValidate();
            },
            realImportDic(data) {
                let ths = this;
                let paramsData = data.file;
                let reader = new FileReader();
                let baseCode = '';
                reader.readAsDataURL(paramsData);
                reader.onload = function (e) {
                    baseCode = e.currentTarget.result;
                    $api.systemDicManagement.importDictionary({ baseCode: baseCode, dicType: '性别', jgdm: ths.importDicFormData.orgCode, status: ths.importDicFormData.status + '' }).then(function (res) {
                        if (res.body.meta.statusCode == '200') {
                            ths.$message.success('字典导入成功');
                            ths.getSexDic();
                            ths.importDicDialogVisible = false;
                        } else {
                            ths.$message.warning(res.body.meta.message);
                            // ths.importDicDialogVisible = false; // 导入异常不关闭弹窗
                        }
                    }).fail(function (e) {
                        // ths.importDicDialogVisible = false; // 导入异常不关闭弹窗
                        ths.$message.error(e.msg);
                    });
                }
            },
            confirmImportDic() {
                let ths = this;
                ths.$refs.importDicForm.validate((valid) => {
                    if (valid) {
                        ths.$refs.importDicFileUpload.submit();
                    }
                });
            },
            downloadExcel() {
                let ths = this;
                ths.downloadExcelLoading = true;
                $api.systemDicManagement.exportTemplate({ dicType: '性别', jgdm: ths.importDicFormData.orgCode }).then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        // 假设 data 是返回来的二进制数据
                        const data = res.body.data
                        const type = "application/ms-excel;charset=utf-8";
                        let bstr = atob(data, type), n = bstr.length, u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n); // 转换编码后才可以使用 charCodeAt 找到 Unicode 编码
                        }
                        const url = window.URL.createObjectURL(new Blob([u8arr], { type: type }));
                        const link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        link.setAttribute('download', '性别字典模版.xls');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.downloadExcelLoading = false;
                }).fail(function (e) {
                    ths.downloadExcelLoading = false;
                    ths.$message.error(e.msg);
                });
            },
            formatOrganization(value) {
                // 格式化机构
                let result = value;
                this.allOrgDic.some(orgDic => {
                    if (orgDic.organizationCode == value) {
                        result = orgDic.organizationName;
                        return true;
                    }
                });
                return result;
            }
        },
        mounted() {
            this.getAllOrg();
            this.searchDic();
        }
    })
})