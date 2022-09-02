$define('com.bsoft.civ.front.component.systemDicManagementType.diseaseDicManagement.diseaseDicManagement', {
    tpl: true,
    css: [
        'com.bsoft.civ.front.component.systemDicManagementType.diseaseDicManagement.diseaseDicManagement'
    ],
    deps: []
}, function (html) {
    Vue.component('disease-dic-management', {
        template: html,
        props: [],
        data() {
            return {
                allOrgDic: [],
                // leftTree
                diseaseCatalogTreeLoading: false,
                diseaseCatalogTreeData: [],
                diseaseCatalogTreeProps: {
                    label: 'illnessCatalogName',
                    children: 'children',
                },
                // rightSearch
                autoMatchShow: true,
                importDiseaseShow: true,
                autoMatchLoading: false,
                searchOrgCode: $env.globalContext.getContext().urt.orgCd || '',
                searchText: '',
                searchOrgCodeSelect: [],
                searchDiseaseCatalogCode: '',
                diseaseCatalogSelect: [],
                chooseFinalNodeAllDiseaseClass: [],
                // rightTable
                diseaseTableData: [],
                diseaseTableDataTotal: 10,
                diseaseTableSearchPageNum: 1,
                diseaseTableSearchPageSize: 10,
                diseaseTableLoading: false,
                // importDiseaseDialogVisible
                downloadExcelLoading: false,
                importDiseaseOrgCodeSelect: [],
                importDiseaseDialogVisible: false,
                importDiseaseFormData: {
                    orgCode: '',
                    fileList: [],
                    status: 0
                },
                importDiseaseFormRules: {
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
                // changeDiseaseCatalogDialogVisible
                changeDiseaseCatalogDialogVisible: false,
                changeDiseaseCatalogDialogSearchText: '',
                changeCatalogIllnessItem: null,

            };
        },
        methods: {
            diseaseCatalogTreeNodeClick(data, node, component) {
                let ths = this;
                let preOption = [{ label: '全部', value: '' }, { label: 'A0 未分类', value: 'A0' }];
                if (data.children && data.children.length > 0) { // 点击的非最底层
                    // 点击树形节点获取节点下所有的所属类目
                    ths.diseaseCatalogSelect = [];
                    // 递归获取最底层的类目
                    let allDiseaseClass = [];
                    let chooseNodeData = ths.$refs.diseaseCatalogTree.getNode(data.illnessCatalogCode).data;
                    ths.getFinalNodeForDiseaseClass(chooseNodeData.children, allDiseaseClass);
                    ths.chooseFinalNodeAllDiseaseClass = allDiseaseClass.map(diseaseClass => {
                        return diseaseClass.value;
                    });
                    ths.diseaseCatalogSelect = [...preOption, ...allDiseaseClass];
                    if (data.illnessCatalogCode == 'A0') {
                        // 如果点击的是未分类，查询条件中所属类目选中未分类，展示导入和自动匹配按钮
                        ths.autoMatchShow = true;
                        ths.importDiseaseShow = true;
                        ths.searchDiseaseCatalogCode = 'A0';
                    } else {
                        // 如果点击的不是未分类，查询条件中所属类目选中全部，只展示导入按钮
                        ths.autoMatchShow = false;
                        ths.importDiseaseShow = true;
                        ths.searchDiseaseCatalogCode = '';
                    }
                    ths.getDiseaseTableData();
                } else { // 点击的是最底层
                    if (data.illnessCatalogCode != 'A0') {
                        // 如果点击的不是未分类，只展示导入按钮
                        ths.autoMatchShow = false;
                        ths.importDiseaseShow = true;
                        ths.diseaseCatalogSelect = [...preOption, { label: data.illnessCatalogCode + ' ' + data.illnessCatalogName, value: data.illnessCatalogCode }];
                    } else {
                        // 如果点击的是未分类，展示导入和自动匹配按钮
                        ths.autoMatchShow = true;
                        ths.importDiseaseShow = true;
                        ths.diseaseCatalogSelect = [...preOption];
                    }
                    ths.searchDiseaseCatalogCode = data.illnessCatalogCode;
                    ths.getDiseaseTableData();
                }
            },
            getFinalNodeForDiseaseClass(data, result) {
                let ths = this;
                data.forEach(node => {
                    if (node.children && node.children.length > 0) { // 还有子级别，说明不是最终目录
                        ths.getFinalNodeForDiseaseClass(node.children, result);
                    } else {
                        result.push({ label: node.illnessCatalogCode + ' ' + node.illnessCatalogName, value: node.illnessCatalogCode });
                    }
                });
            },
            queryDicIllnessCatalog() {
                let ths = this;
                ths.diseaseCatalogTreeLoading = true;
                $api.systemDicManagement.queryDicIllnessCatalog().then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.diseaseCatalogTreeData = res.body.data;
                        ths.$nextTick(function () {
                            // 默认选中第一个，并且触发点击事件
                            ths.$refs.diseaseCatalogTree.setCurrentKey(res.body.data[0].illnessCatalogCode);
                            ths.$el.querySelectorAll('#diseaseCatalogTree' + res.body.data[0].illnessCatalogCode)[0].click();
                        });
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.diseaseCatalogTreeLoading = false;
                }).fail(function (e) {
                    ths.diseaseCatalogTreeLoading = false;
                    ths.$message.error(e.msg);
                });
            },
            getAllOrg() {
                let ths = this;
                $api.systemDicManagement.queryOrganization().then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.allOrgDic = [...res.body.data];
                        let allOrg = { organizationCode: '', organizationName: '全部' }
                        ths.searchOrgCodeSelect = [allOrg, ...res.body.data];
                        ths.importDiseaseOrgCodeSelect = res.body.data;
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                }).fail(function (e) {
                    ths.$message.error(e.msg);
                });
            },
            importDisease() {
                let ths = this;
                ths.importDiseaseDialogVisible = true;
                ths.$nextTick(function () {
                    ths.$refs.importDiseaseForm.clearValidate();
                });
            },
            searchDisease() {
                this.diseaseTableSearchPageNum = 1;
                this.getDiseaseTableData();
            },
            getDiseaseTableData() {
                // 查询疾病归类下的疾病
                let ths = this;
                ths.diseaseTableLoading = true;
                let status = [];
                if (ths.searchDiseaseCatalogCode == '') { // 全部的情况，把下拉框的所有的所属类目传递给后端
                    status = ths.chooseFinalNodeAllDiseaseClass;
                } else if (ths.searchDiseaseCatalogCode == 'A0') {
                    status.push('A0');
                } else {
                    status.push(ths.searchDiseaseCatalogCode);
                }
                $api.systemDicManagement.queryIllness({
                    jgdm: ths.searchOrgCode,
                    queryParam: ths.searchText,
                    page: ths.diseaseTableSearchPageNum,
                    pageSize: ths.diseaseTableSearchPageSize,
                    status: status // A0: 未归类，'': 全部，A001...
                }).then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.diseaseTableData = res.body.data.list;
                        ths.diseaseTableDataTotal = res.body.data.total;
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.diseaseTableLoading = false;
                }).fail(function (e) {
                    ths.diseaseTableLoading = false;
                    ths.$message.error(e.msg);
                });
            },
            autoMatch() {
                let ths = this;
                ths.autoMatchLoading = true;
                $api.systemDicManagement.autoMatch().then(function (res) {
                    if (res.body.meta.statusCode == '200') {
                        ths.$message.success('自动匹配成功');
                        ths.getDiseaseTableData();
                    } else {
                        ths.$message.warning(res.body.meta.message);
                    }
                    ths.autoMatchLoading = false;
                }).fail(function (e) {
                    ths.autoMatchLoading = false;
                    ths.$message.error(e.msg);
                });
            },
            diseaseTableDblClick(data) {
                this.changeCatalog(data);
            },
            changeCatalog(data) {
                this.changeCatalogIllnessItem = data;
                this.changeDiseaseCatalogDialogVisible = true;
            },
            delDisease(data) {
                let ths = this;
                $api.systemDicManagement.updateIllness({
                    illnessCode: data.illnessCode,
                    illnessCatalog: 'A0',
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
            diseaseTableSizeChange(val) {
                this.diseaseTableSearchPageSize = val;
                this.getDiseaseTableData();
            },
            diseaseTableCurrentChange(val) {
                this.diseaseTableSearchPageNum = val;
                this.getDiseaseTableData();
            },
            handleChange(file, fileList) {
                this.importDiseaseFormData.fileList = fileList;
            },
            importDiseaseDialogClose() {
                // 清空文件
                this.importDiseaseFormData.orgCode = '';
                this.importDiseaseFormData.fileList = [];
                this.importDiseaseFormData.status = 0;
                this.$refs.importDiseaseFileUpload.clearFiles();
                this.$refs.importDiseaseForm.clearValidate();
            },
            confirmImportDisease() {
                let ths = this;
                ths.$refs.importDiseaseForm.validate((valid) => {
                    if (valid) {
                        ths.$refs.importDiseaseFileUpload.submit();
                    }
                });
            },
            realImportDisease(data) {
                let ths = this;
                let paramsData = data.file;
                let reader = new FileReader();
                let baseCode = '';
                reader.readAsDataURL(paramsData);
                reader.onload = function (e) {
                    baseCode = e.currentTarget.result;
                    $api.systemDicManagement.importDictionary({ baseCode: baseCode, dicType: '疾病', jgdm: ths.importDiseaseFormData.orgCode, status: ths.importDiseaseFormData.status + '' }).then(function (res) {
                        if (res.body.meta.statusCode == '200') {
                            ths.$message.success('疾病字典导入成功');
                            // 自动锁定到未分类目录
                            ths.$refs.diseaseCatalogTree.setCurrentKey('A0');
                            ths.$el.querySelectorAll('#diseaseCatalogTreeA0')[0].click();
                            ths.importDiseaseDialogVisible = false;
                        } else {
                            ths.$message.warning(res.body.meta.message);
                            // ths.importDiseaseDialogVisible = false; // 导入异常不关闭弹窗
                        }
                    }).fail(function (e) {
                        // ths.importDiseaseDialogVisible = false;  // 导入异常不关闭弹窗
                        ths.$message.error(e.msg);
                    });
                }
            },
            downloadExcel() {
                let ths = this;
                ths.downloadExcelLoading = true;
                $api.systemDicManagement.exportTemplate({ dicType: '疾病', jgdm: ths.importDiseaseFormData.orgCode }).then(function (res) {
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
                        link.setAttribute('download', '疾病字典模版.xls');
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
            searchDiseaseCatalog() {
                this.$refs.diseaseCatalogInterTree.filter(this.changeDiseaseCatalogDialogSearchText);
            },
            diseaseCatalogInterTreeFilter(value, data) {
                if (!value) return true;
                return data.illnessCatalogName.indexOf(value) !== -1 || data.illnessCatalogCode.indexOf(value) !== -1;
            },
            realchangeDiseaseCatalog() {
                let ths = this;
                let node = ths.$refs.diseaseCatalogInterTree.getCurrentNode();
                if (node.children && node.children == 0 || !node.children) {
                    $api.systemDicManagement.updateIllness({
                        illnessCode: ths.changeCatalogIllnessItem.illnessCode,
                        illnessCatalog: node.illnessCatalogCode,
                        organization: ths.changeCatalogIllnessItem.organization,
                    }).then(function (res) {
                        if (res.body.meta.statusCode == '200') {
                            ths.$message.success('疾病关联成功');
                            ths.getDiseaseTableData();
                        } else {
                            ths.$message.warning(res.body.meta.message);
                        }
                        ths.changeDiseaseCatalogDialogVisible = false;
                    }).fail(function (e) {
                        ths.changeDiseaseCatalogDialogVisible = false;
                        ths.$message.error(e.msg);
                    });
                } else {
                    ths.$message.warning('请选择正确的疾病目录')
                }
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
            // 获取所有的机构数据
            this.getAllOrg();
            // 加载疾病分类目录
            this.queryDicIllnessCatalog();
            // 查询 table 的数据
            // this.getDiseaseTableData();
        }
    })
})