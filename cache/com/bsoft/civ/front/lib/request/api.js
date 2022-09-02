const $api = {
    // 系统字典管理页面
    systemDicManagement: {
        querySexDictionary: function (params) {
            // 查询性别字典
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/querySexDictionary', jsonData: [params] });
        },
        updateSexDictionary: function (params) {
            // 更新性别字典
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/updateSexDictionary', jsonData: [params] });
        },
        addSexDictionary: function (params) {
            // 新增性别字典
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/addSexDictionary', jsonData: [params] });
        },
        deleteSexDictionary: function (params) {
            // 删除性别字典
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/deleteSexDictionary', jsonData: [params] });
        },
        queryOrganization: function (params) {
            // 查询所有机构科室数据
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/queryOrganization', jsonData: [params] });
        },
        exportTemplate: function (params) {
            // 下载性别 Excel 模版
            let dicType = params.dicType;
            let jgdm = params.jgdm;
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/exportTemplate', jsonData: [dicType, jgdm] });
        },
        importDictionary: function (params) {
            // 通过 Excel 模版导入字典
            let baseCode = params.baseCode;
            let dicType = params.dicType;
            let jgdm = params.jgdm;
            let status = params.status;
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/importDictionary', jsonData: [baseCode, dicType, jgdm, status] });
        },
        queryDicIllnessCatalog: function (params) {
            // 查询疾病分类目录
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/queryDicIllnessCatalog', jsonData: [''] });
        },
        queryIllness: function (params) {
            // 查询疾病数据
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/queryIllness', jsonData: [params] });
        },
        updateIllness: function (params) {
            // 更新疾病归类
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/updateIllness', jsonData: [params] });
        },
        autoMatch: function (params) {
            // 自动匹配
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/autoMatch', jsonData: [params] });
        },
        queryDisease: function (params) {
            // 获取病种数据
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/queryDisease', jsonData: [params] });
        },
        associationDisease: function (params) {
            // 病种关联疾病
            let disease = params.disease;
            let dicIllnessList = params.dicIllnessList;
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/associationDisease', jsonData: [disease, dicIllnessList] });
        },
        queryIllnessForDisease: function (params) {
            // 获取病种相关疾病
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/queryIllnessForDisease', jsonData: [params] });
        },
        queryOrgAndDeptTree: function (params) {
            // 获取机构科室数据
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/queryOrgAndDeptTree', jsonData: [params] });
        },
        syncOrganizationAndDepartment: function (params) {
            // 同步机构科室数据
            return $ajax({ url: 'api/civ.dictionaryRpcServiceImpl/syncOrganizationAndDepartment', jsonData: [params] });
        }
    },
    // 系统参数配置页面
    systemVarConfig: {
        querySystemLogConfig: function (params) {
            // 查询系统操作日志保存天数表
            return $ajax({ url: 'api/civ.systemLogConfigRpcServiceImpl/querySystemLogConfig', jsonData: [params] });
        },
        saveSystemLogConfig: function (params) {
            // 保存天数
            return $ajax({ url: 'api/civ.systemLogConfigRpcServiceImpl/saveSystemLogConfig', jsonData: [params] });
        },
        saveSystemConfig: function (params) {
            // 保存系统参数：机构/科室导入地址
            return $ajax({ url: 'api/civ.systemLogConfigRpcServiceImpl/saveSystemConfig', jsonData: [params] });
        },
        getSystemConfig: function (params) {
            // 获取系统参数：机构/科室导入地址
            return $ajax({ url: 'api/civ.systemLogConfigRpcServiceImpl/getSystemConfig', jsonData: [params] });
        }
    }
}