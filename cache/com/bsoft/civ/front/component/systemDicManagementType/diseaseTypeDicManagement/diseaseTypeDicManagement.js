$define('com.bsoft.civ.front.component.systemDicManagementType.diseaseTypeDicManagement.diseaseTypeDicManagement', {
    tpl: true,
    css: [
        'com.bsoft.civ.front.component.systemDicManagementType.diseaseTypeDicManagement.diseaseTypeDicManagement'
    ],
    deps: []
}, function (html) {
    Vue.component('disease-type-dic-management', {
        template: html,
        props: [],
        data() {
            return {
                allOrgDic: [],
                // topSearch
                searchOrgCode: $env.globalContext.getContext().urt.orgCd || '',
                searchText: '',
                searchOrgCodeSelect: [],
                searchDiseaseTypeStatus: '',
                diseaseTypeStatusSelect: [
                    {
                        label: '已关联',
                        value: '1'
                    },
                    {
                        label: '未关联',
                        value: '0'
                    },
                    {
                        label: '全部',
                        value: ''
                    }
                ],
                // topTable
                diseaseTypeTableData: [],
                diseaseTypeTableSearchPageSize: 10,
                diseaseTypeTableDataTotal: 10,
                diseaseTypeTableSearchPageNum: 1,
                diseaseTypeTableLoading: false,
                matchDiseaseItem: null,
                // bottomTable
                diseaseTableLoading: false,
                diseaseTableData: [],
                diseaseTableSearchPageSize: 10,
                diseaseTableDataTotal: 10,
                diseaseTableSearchPageNum: 1,
                diseaseTableSearchText: '',
                // checkDiseaseTableData
                checkDiseaseTableLoading: false,
                changeDiseaseMatchSearchText: '',
                changeDiseaseMatchSearchOrgCode: $env.globalContext.getContext().urt.orgCd || '',
                changeDiseaseMatchOrgCodeSelect: [],
                changeDiseaseMatchDialogVisible: false,
                diseaseCatalogTreeProps: {
                    label: 'label',
                    children: 'children',
                },
                checkDiseaseTableData: [],
                checkDiseaseTableSearchPageSize: 10,
                checkDiseaseTableDataTotal: 10,
                checkDiseaseTableSearchPageNum: 1,
                // importDiseaseTypeDialogVisible
                downloadExcelLoading: false,
                importDiseaseTypeDialogVisible: false,
                importDiseaseTypeFormData: {
                    fileList: [],
                    status: 0
                },
                importDiseaseTypeFormRules: {
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
                        let allOrg = { organizationCode: '', organizationName: '全部' };
                        ths.searchOrgCodeSelect = [allOrg, ...res.body.data];
                        ths.changeDiseaseMatchOrgCodeSelect = [allOrg, ...res.body.data];
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                }).fail(function (e) {
                    ths.$message.error(e.msg);
                });
            },
            diseaseTypeTableChooseCurrentChange(val) {
                if (!val) {
                    this.diseaseTypeTableChooseItem = {};
                } else {
                    this.diseaseTypeTableChooseItem = val;
                }
                this.getDiseaseTableData(true);
            },
            getDiseaseTypeTableData() {
                let ths = this;
                ths.diseaseTypeTableLoading = true;
                $api.systemDicManagement.queryDisease({
                    // jgdm: ths.searchOrgCode,
                    queryParam: ths.searchText,
                    page: ths.diseaseTypeTableSearchPageNum,
                    pageSize: ths.diseaseTypeTableSearchPageSize,
                    status: ths.searchDiseaseTypeStatus
                }).then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.diseaseTypeTableData = res.body.data.list;
                        if (res.body.data.list && res.body.data.list.length > 0) {
                            // 默认选中第一条，并且触发点击事件
                            ths.$refs.diseaseTypeTable.setCurrentRow();
                            ths.$refs.diseaseTypeTable.setCurrentRow(res.body.data.list[0]);
                        }
                        ths.diseaseTypeTableDataTotal = res.body.data.total;
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.diseaseTypeTableLoading = false;
                }).fail(function (e) {
                    ths.diseaseTypeTableLoading = false;
                    ths.$message.error(e.msg);
                });
            },
            getDiseaseTableData(giveSelect) {
                let ths = this;
                ths.diseaseTableLoading = true;
                $api.systemDicManagement.queryIllnessForDisease({
                    jgdm: ths.searchOrgCode,
                    queryParam: ths.diseaseTableSearchText,
                    page: ths.diseaseTableSearchPageNum,
                    pageSize: ths.diseaseTableSearchPageSize,
                    disease: ths.diseaseTypeTableChooseItem.diseaseCode
                }).then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.diseaseTableData = res.body.data.list;
                        ths.diseaseTableDataTotal = res.body.data.total;
                        if (giveSelect == true) {
                            let queryOrgList = res.body.data.orgList.map(org => {
                                return { organizationName: ths.formatOrganization(org), organizationCode: org }
                            });
                            ths.searchOrgCodeSelect = [{ organizationName: '全部', organizationCode: '' }, ...queryOrgList]
                        }
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.diseaseTableLoading = false;
                }).fail(function (e) {
                    ths.diseaseTableLoading = false;
                    ths.$message.error(e.msg);
                });
            },
            searchDiseaseType() {
                this.diseaseTypeTableSearchPageNum = 1;
                this.getDiseaseTypeTableData();
            },
            importDiseaseType() {
                let ths = this;
                ths.importDiseaseTypeDialogVisible = true;
                ths.$nextTick(function () {
                    ths.$refs.importDiseaseTypeForm.clearValidate();
                });
            },
            matchDisease(data) {
                this.matchDiseaseItem = data;
                this.changeDiseaseMatchDialogVisible = true;
                this.searchDisease();
            },
            diseaseTypeTableDblClick(data) {
                this.matchDisease(data);
            },
            diseaseTypeTableClick(data) {
                this.diseaseTypeTableChooseItem = data;
                // 点击事件，查询出来的机构需要全部给 select
                this.getDiseaseTableData(true);
                // 默认选全部
                this.searchOrgCode = $env.globalContext.getContext().urt.orgCd || '';
            },
            diseaseTypeTableSizeChange(val) {
                this.diseaseTypeTableSearchPageSize = val;
                this.getDiseaseTypeTableData();
            },
            diseaseTypeTableCurrentChange(val) {
                this.diseaseTypeTableSearchPageNum = val;
                this.getDiseaseTypeTableData();
            },
            diseaseTableSizeChange(val) {
                this.diseaseTableSearchPageSize = val;
                this.getDiseaseTableData();
            },
            diseaseTableCurrentChange(val) {
                this.diseaseTableSearchPageNum = val;
                this.getDiseaseTableData();
            },
            cancelMatchDisease(data) {
                let ths = this;
                $api.systemDicManagement.updateIllness({
                    illnessCode: data.illnessCode,
                    disease: '',
                    organization: data.organization,
                }).then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.$message.success('疾病取消关联成功');
                        ths.getDiseaseTableData();
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                }).fail(function (e) {
                    ths.$message.error(e.msg);
                });
            },
            checkDiseaseTableSizeChange(val) {
                this.checkDiseaseTableSearchPageSize = val;
                this.searchDisease();
            },
            checkDiseaseTableCurrentChange(val) {
                this.checkDiseaseTableSearchPageNum = val;
                this.searchDisease();
            },
            searchDisease() {
                let ths = this;
                ths.checkDiseaseTableLoading = true;
                $api.systemDicManagement.queryIllness({
                    jgdm: ths.changeDiseaseMatchSearchOrgCode,
                    queryParam: ths.changeDiseaseMatchSearchText,
                    page: ths.checkDiseaseTableSearchPageNum,
                    pageSize: ths.checkDiseaseTableSearchPageSize,
                    status: [] // A0: 未归类，'': 全部，A001...
                }).then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.checkDiseaseTableData = res.body.data.list;
                        ths.checkDiseaseTableDataTotal = res.body.data.total;
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.checkDiseaseTableLoading = false;
                }).fail(function (e) {
                    ths.checkDiseaseTableLoading = false;
                    ths.$message.error(e.msg);
                });
            },
            realchangeDiseaseMatch() {
                let ths = this;
                let dicIllnessList = [];
                ths.$refs.checkDiseaseTable.selection.forEach(select => {
                    let obj = {
                        illnessCode: select.illnessCode,
                        organization: select.organization
                    }
                    dicIllnessList.push(obj);
                });
                $api.systemDicManagement.associationDisease({ disease: ths.matchDiseaseItem.diseaseCode, dicIllnessList: dicIllnessList }).then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.$message.success('病种疾病关联成功');
                        // 触发点击事件，刷新右侧的表格数据
                        ths.$refs.diseaseTypeTable.setCurrentRow();
                        ths.$refs.diseaseTypeTable.setCurrentRow(ths.matchDiseaseItem);
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.changeDiseaseMatchDialogVisible = false;
                }).fail(function (e) {
                    ths.$message.error(e.msg);
                    ths.changeDiseaseMatchDialogVisible = false;
                });
            },
            importDiseaseTypeDialogClose() {
                // 清空文件
                this.importDiseaseTypeFormData.fileList = [];
                this.importDiseaseTypeFormData.status = 0;
                this.$refs.importDiseaseTypeFileUpload.clearFiles();
                this.$refs.importDiseaseTypeForm.clearValidate();
            },
            realImportDiseaseType(data) {
                let ths = this;
                let paramsData = data.file;
                let reader = new FileReader();
                let baseCode = '';
                reader.readAsDataURL(paramsData);
                reader.onload = function (e) {
                    baseCode = e.currentTarget.result;
                    $api.systemDicManagement.importDictionary({ baseCode: baseCode, dicType: '病种', jgdm: '', status: ths.importDiseaseTypeFormData.status }).then(function (res) {
                        if (res.body.meta.statusCode == '200') {
                            ths.$message.success('病种导入成功');
                            ths.getDiseaseTypeTableData();
                            ths.importDiseaseTypeDialogVisible = false;
                        } else {
                            ths.$message.warning(res.body.meta.message);
                            // ths.importDiseaseTypeDialogVisible = false; // 导入异常不关闭弹窗
                        }
                    }).fail(function (e) {
                        // ths.importDiseaseTypeDialogVisible = false;  // 导入异常不关闭弹窗
                        ths.$message.error(e.msg);
                    });
                }
            },
            confirmImportDiseaseType() {
                let ths = this;
                ths.$refs.importDiseaseTypeForm.validate((valid) => {
                    if (valid) {
                        ths.$refs.importDiseaseTypeFileUpload.submit();
                    }
                });
            },
            handleChange(file, fileList) {
                this.importDiseaseTypeFormData.fileList = fileList;
            },
            downloadExcel() {
                let ths = this;
                ths.downloadExcelLoading = true;
                $api.systemDicManagement.exportTemplate({ dicType: '病种', jgdm: '' }).then(function (res) {
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
                        link.setAttribute('download', '病种字典模版.xls');
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
            this.getDiseaseTypeTableData();
        }
    })
})