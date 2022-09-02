$class(
  'com.bsoft.etl_mcentre.front.dataCollectManagement.DataCollectManagement',
  {
    extend: 'ssdev.ux.vue.VueContainer',
    tpl: true,
    css: [
      'com.bsoft.etl_mcentre.front.dataCollectManagement.DataCollectManagement',
      'com.bsoft.etl_mcentre.front.iconfont.iconfont'
    ],
    deps: [
      'com.bsoft.etl_mcentre.front.lib.echarts',
      'com.bsoft.etl_mcentre.front.lib.jsplumb.jsplumb',
      'com.bsoft.etl_mcentre.front.dataCollectScriptConfigure.DataCollectScriptConfigure'
    ],
    // 项目启动: http://10.1.2.240:3087/etl-mcentre/?clz=com.bsoft.etl_mcentre.front.dataCollectManagement.DataCollectManagement
    // 组件初始化
    initComponent (conf) {
      const me = this
      // 自定义时间验证
      let starttime = ''
      let endtime = ''
      const rule_starttime = (rule, value, callback) => {
        starttime = value
        if (value > endtime && endtime != '') {
          return callback(new Error('开始时间不能大于结束时间'))
        } else {
          return callback()
        }
      }
      const rule_endtime = (rule, value, callback) => {
        endtime = value
        if (value < starttime && starttime != '') {
          return callback(new Error('结束时间不能小于开始时间'))
        } else {
          return callback()
        }
      }
      // data
      me.data = {
        isShow: true, // 展开/收起
        isBlue: true, // 是否显示蓝色
        isScreenFull: true,
        isLogOrData: true,
        // 下拉选择框数据
        organizationOptions: [],
        // value: '',
        value: '', // 下拉框搜索
        searchKey: '', // 关键字搜索
        searchRightKey: '',
        // 左侧树形数据
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        checkList: null,
        // 表格数据
        tableData: [],
        dataTableData: [],
        spanArr: [], // 用于存放 每一行记录的合并数
        // 分页
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalNum: 0
        },
        // 日志库分页
        paginationLogLibrary: {
          currentPage: 1,
          pageSize: 10,
          totalNum: 0
        },
        paginationAdapter: {
          currentPage: 1,
          pageSize: 10,
          totalNum: 0
        },
        currentIndex: 0,
        currentFrontIndex: 0,
        startShow: false,
        isShowLogStart: false,
        isShowLogStop: false,
        isShowLogReset: false,
        isShowDataStart: false,
        isShowDataPause: false,
        isShowDataStop: false,
        modelToggleShow: false,
        pauseOrStopShow: false,
        detailMode: true,
        streamlineMode: false,
        addShow: false,
        medicalRecord: true,
        addLogDialogVisible: false, // 新建日志采集弹蹭
        updateLogDialogVisible: false,
        formLabelWidth: '130px',
        selectionLogCollect: [],
        addLogDialogForm: {
          name: '', // 任务名称
          etlTaskCode: '', // 任务代码
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          dayCount: 1, // 采集跨度
          limitCount: 1000000, // 日志上限
          order: '0', // 采集时序
          logTimeUnit: 'day', // 采集跨度单位
          logBufferTime: 10,
          logBufferTimeUnit: 'second',
          logDataSourceId: '', // 数据源
          compressInterface: '随机', // 指定LogCollect
          // catalogId: 1, // 执行脚本
          // catalogName: '', // 脚本目录名称
          cron: '', // 执行策略
          templateId: '', // 模板id
          templateName: '', // 模板名称
          logICDataSourceId: '', //业务数据源
          authorOrganization: '', // 机构代码
          authorOrganizationName: '' // 机构名称
        },
        getLogCollectQueryListTimer: null,
        getDataCollectQueryTaskListTimer: null,
        rowDataCollectCopy: {},
        addLogFormRules: {
          startTime: [
            {
              required: true,
              message: '开始时间不能为空',
              trigger: 'blur'
            },
            {
              validator: rule_starttime,
              trigger: ['change', 'blur']
            }
          ],
          endTime: [
            {
              required: true,
              message: '截止时间不能为空',
              trigger: 'blur'
            },
            {
              validator: rule_endtime,
              trigger: ['change', 'blur']
            }
          ]
        },
        logDataSourceIdName: '',
        msgType: '',
        updateLogDialogForm: {
          NAME: '',
          ETLTASKCODE: '',
          STARTTIME: '',
          ENDTIME: '',
          DAYCOUNT: null,
          LIMITCOUNT: null,
          TIMEORDER: '',
          LOGTIMEUNIT: '',
          LOGDATASOURCEID: '',
          CATALOGID: null,
          CRON: '',
          LOGID: null,
          CATALOGNAME: '',
          LOGBUFFERTIME: null,
          LOGBUFFERTIMEUNIT: '',
          COMPRESSINTERFACE: ''
        },
        updateLogFormRules: {
          STARTTIME: [
            {
              required: true,
              message: '开始时间不能为空',
              trigger: 'blur'
            },
            {
              validator: rule_starttime,
              trigger: ['change', 'blur']
            }
          ],
          ENDTIME: [
            {
              required: true,
              message: '截止时间不能为空',
              trigger: 'blur'
            },
            {
              validator: rule_endtime,
              trigger: ['change', 'blur']
            }
          ]
        },
        times: [
          {
            value: 'minute',
            label: '分'
          },
          {
            value: 'hour',
            label: '时'
          },
          {
            value: 'day',
            label: '天'
          }
        ],
        collectTime: [
          {
            value: 'second',
            label: '秒'
          },
          {
            value: 'minute',
            label: '分'
          },
          {
            value: 'hour',
            label: '时'
          },
          {
            value: 'day',
            label: '天'
          }
        ],
        collectLogSequentials: [
          {
            value: '0',
            label: '正序'
          },
          {
            value: '1',
            label: '倒序'
          }
        ],
        collectSequentials: [
          {
            value: '0',
            label: '升序'
          },
          {
            value: '1',
            label: '降序'
          }
        ],
        LogCollects: [
          {
            value: '1',
            label: '随机'
          },
          {
            value: '2',
            label: '刻意'
          }
        ],
        dataOrigins: [],
        implementScripts: [],
        implementStrategies: [],
        // implementScript: 1,
        logCollectDialogVisible: false, // 日志采集脚本配置弹框
        implementStrategyDialogVisible: false, // 执行策略配置弹层
        logCollectDialogForm: {
          scriptName: '',
          version: '',
          sql: '',
          callName: '',
          catalogId: null,
          logScriptName: ''
        },
        // implementStrategyDialogForm: {
        //   strategyName: '每5秒执行一次',
        //   coreExpression: '0/5****?'
        // },
        CORNDialogVisible: false,
        form: {
          strategyName: '每5秒执行一次',
          CORECode: '0/5****?',
          seconds: '0/5****?',
          minutes: '',
          hours: '',
          days: '',
          weeks: '',
          months: '',
          years: '',
          cornExpression: '0/5****?'
        },
        radio1: '',
        num1: 0,
        num2: 0,
        num3: 0,
        num4: 0,
        num5: 0,
        num6: 0,
        checkList: [],
        numberList: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        radio: '1',
        list: 1,
        textareaData: '',
        addDataDialogVisible: false, // 数据采集配置弹框
        updateDataDialogVisible: false,
        addDataDialogForm: {
          name: '',
          etlTaskCode: '',
          outPutMode: '1',
          platformInterface: '', // 接口名集成平台
          adapterInterface: 'cdr', // 接口名前置机
          total: 200,
          logOrder: '1',
          formateBsXml: '0',
          decompressPriority: 1,
          catalogId: null,
          catalogName: '',
          cron: '',
          compressInterface: '随机',
          templateId: '', // 模板id
          templateName: '', // 模板名称
          authorOrganization: '', // 机构代码
          authorOrganizationName: '', // 机构名称
          cdrConfig: [
            {
              cdrCode: '',
              text: '',
              config: [
                {
                  isStandard: '1', // 标准1 业务0 不能同时传
                  checkBsXml: '1',
                  dictionaryChange: '1'
                },
                {
                  isStandard: '0', // 标准1 业务0 不能同时传
                  checkBsXml: '0',
                  dictionaryChange: '0'
                }
              ]
            }
          ]
        },
        addDatabaseCheckListAll: [
          {
            first: ['业务BSXML：'],
            last: ['标准BSXML：', '模板校验', '字典翻转']
          }
        ],
        updateDatabaseCheckListAll: [
          {
            first: [],
            last: []
          }
        ],
        addDatabaseCheckList1: ['业务BSXML：'],
        addDatabaseCheckList2: ['标准BSXML：', '模板校验', '字典翻转'],

        echoDatabaseCheckList1: ['业务BSXML：'],
        echoDatabaseCheckList2: ['标准BSXML：', '模板校验', '字典翻转'],
        updateDataDialogForm: {
          NAME: '',
          ETLTASKCODE: '',
          OUTPUTMODE: '',
          INTERFACE: '',
          TOTAL: null,
          LOGORDER: '',
          COMPRESSINTERFACE: '',
          FORMATEBSXML: '',
          DECOMPRESSPRIORITY: null,
          CATALOGID: null,
          CATALOGNAME: '',
          CRON: '',
          cdrConfig: [
            {
              cdrCode: '',
              text: '',
              config: [
                {
                  isStandard: '1', // 标准1 业务0 不能同时传
                  checkBsXml: '1',
                  dictionaryChange: '1'
                },
                {
                  isStandard: '0', // 标准1 业务0 不能同时传
                  checkBsXml: '0',
                  dictionaryChange: '0'
                }
              ]
            }
          ]
          // cdrConfig: [
          //   {
          //     cdrCode: '',
          //     checkBsXml: '',
          //     configId: null,
          //     createDate: '',
          //     dictionaryChange: '',
          //     id: null,
          //     isStandard: '',
          //     updateDate: ''
          //   },
          //   {
          //     cdrCode: '',
          //     checkBsXml: '',
          //     configId: null,
          //     createDate: '',
          //     dictionaryChange: '',
          //     id: null,
          //     isStandard: '',
          //     updateDate: ''
          //   }
          // ]
        },
        outputInterfaces: [
          {
            value: '1',
            label: '前置机'
          },
          {
            value: '2',
            label: '集成平台'
          }
        ],
        compress: [
          {
            id: '0',
            ip: '随机'
          }
        ],
        formatBSXMLs: [
          {
            value: '1',
            label: '是'
          },
          {
            value: '0',
            label: '否'
          }
        ],

        // 数据采集测试
        dataCollectTestDialogVisible: false,
        // dataCollectClick: {},
        dataCollectTestDialogForm: {
          appointSourceId: '',
          recordTime: '',
          ifUpLoad: ''
        },
        dataCollectTestRules: {
          appointSourceId: [
            {
              required: true,
              message: '请输入指定SourceId：',
              trigger: 'blur'
            }
          ],
          recordTime: [
            {
              required: true,
              message: '请输入指定上传时间：',
              trigger: 'blur'
            }
          ]
        },

        editCollectDialogVisible: false,
        editCollectDialogForm: {
          strategyName: '1'
        },
        strategyNames: [
          {
            value: '1',
            label: '每5秒执行一次'
          },
          {
            value: '2',
            label: '每10秒执行一次'
          },
          {
            value: '3',
            label: '每30秒执行一次'
          },
          {
            value: '4',
            label: '每60秒执行一次'
          }
        ],
        // 复制
        copyDialogVisible: false,
        copyDialogVisibleForm: {
          taskName: '',
          taskCode: '',
          copyLog: false,
          copyData: false,
          id: '',
          logTaskId: ''
        },
        // 提示
        tipsDialogVisible: false,
        // 新建触发器配置--接口模式
        addTriggerDialogVisible: false,

        addTriggerForm: {
          taskName: '科室信息上传',
          taskCode: 'RES_0201',
          dataOrigin: '1',
          triggerObject: '1',
          triggerSourceId: '1',
          watchField: ['1', '2'],
          businessTime: '1',
          triggerEvent: ['1', '2'],
          triggerRadio: 1,
          address: 'http://10.10.2.112:9528/haiWs/wb/wsdl',
          interfaceType: '1',
          accessName: 'EtlLog'
        },
        triggerDataOrigin: [
          {
            value: '1',
            label: 'HIS库'
          },
          {
            value: '2',
            label: 'RSN库'
          }
        ],
        triggerObjects: [
          {
            value: '1',
            label: 'BHGL_FHJ'
          },
          {
            value: '2',
            label: 'NSHW_JSG'
          }
        ],
        triggerSourceIds: [
          {
            value: '1',
            label: 'COLUMNAME'
          },
          {
            value: '2',
            label: 'ROWNAME'
          }
        ],
        watchFields: [
          {
            value: '1',
            label: 'UPDATETIME1'
          },
          {
            value: '2',
            label: 'UPDATETIME2'
          }
        ],
        businessTimes: [
          {
            value: '1',
            label: 'UPDATETIME3'
          },
          {
            value: '2',
            label: 'UPDATETIME4'
          }
        ],
        triggerEvents: [
          {
            value: '0',
            label: '全部'
          },
          {
            value: '1',
            label: '插入'
          },
          {
            value: '2',
            label: '经过'
          },
          {
            value: '3',
            label: '点击'
          },
          {
            value: '4',
            label: '选项三'
          },
          {
            value: '5',
            label: '选项四'
          },
          {
            value: '6',
            label: '选项五'
          }
        ],
        interfaceTypes: [
          {
            value: '1',
            label: '异步'
          },
          {
            value: '2',
            label: '同步'
          }
        ],
        labelClass: null,
        fileList: [],
        // tab标签
        activeName: '1',
        // 数据采集监控
        dataCollectDialogVisible: false,
        collectMonitorForm: {
          collectMonitorRadio: 1,
          defineTimes1: '',
          defineTimes2: ''
        },
        defineTimes: [],
        collectControlMonitorForm: {
          service: '',
          serviceAddress: ''
        },
        services: [],
        serviceAddress: [],
        // 日志库
        logLibraryDialogVisible: false,
        logLibraryForm: {
          taskName: '',
          organizations: ''
        },
        logLibraryErrorList: {},
        logListData: [],
        frontLibraryList: {},
        frontListData: [],
        logLibrarySelection: [],
        logid: null,
        errorDetail: '',
        isReUpload: false,
        isDeleteAll: false,
        // 前置机库
        frontLibraryDialogVisible: false,
        frontLibraryForm: {
          errorField: ''
        },
        frontLibraryOption: [],
        // CDR 库
        CDRLibraryDialogVisible: false,
        CDRPartitionTableData: [],
        CDRDataTableData: [],
        CDRPartitionLoading: true,
        // 文档库
        fileLibraryDialogVisible: false,
        fileLibraryForm: {
          year1: '',
          year2: '',
          fileType: '1'
        },
        // echarts 配置
        option: {
          title: {
            text: '数量（条）',
            textStyle: {
              color: '#666666',
              fontSize: 14,
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['日志采集', '压包', '附件', '解包'],
            x: 'right',
            padding: [5, 30, 0, 0]
          },
          grid: {
            left: '5%',
            right: '8%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
              textStyle: {
                color: '#000'
              },
              interval: 0,
              rotate: 45
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E4E4E4 '
              }
            }
          },
          yAxis: {
            type: 'value',
            min: 0,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E4E4E4 '
              }
            },
            axisLabel: {
              textStyle: {
                color: '#000'
              }
            }
          },
          series: [
            {
              name: '日志采集',
              type: 'line',
              data: []
            },
            {
              name: '压包',
              type: 'line',
              data: []
            },
            {
              name: '附件',
              type: 'line',
              data: []
            },
            {
              name: '解包',
              type: 'line',
              data: []
            }
          ]
        },
        // 文档库 echarts
        // 1 年份数据库统计
        yearDataOption: {
          color: ['#0480FF', '#FDB62D'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          grid: {
            right: '20%'
          },
          legend: {
            data: ['柱状图', '折线图']
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              data: [
                '2011',
                '2012',
                '2013',
                '2014',
                '2015',
                '2016',
                '2017',
                '2018',
                '2019',
                '2020',
                '2021',
                '2022'
              ]
            }
          ],
          yAxis: [
            {
              type: 'value',
              position: 'left',
              alignTicks: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#0480FF'
                }
              }
            },
            {
              type: 'value',
              position: 'left',
              alignTicks: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#FDB62D'
                }
              }
            }
          ],
          series: [
            {
              name: '柱状图',
              type: 'bar',
              data: [
                2.6,
                5.9,
                9.0,
                26.4,
                28.7,
                70.7,
                175.6,
                182.2,
                48.7,
                18.8,
                6.0,
                2.3
              ]
            },
            {
              name: '折线图',
              type: 'line',
              data: [
                2.6,
                5.9,
                9.0,
                26.4,
                28.7,
                70.7,
                175.6,
                182.2,
                48.7,
                18.8,
                6.0,
                2.3
              ]
            }
          ]
        },
        // 2 文档类型数据统计
        fileTypeDataOption: {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            // top: '5%',
            bottom: '5%'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                {
                  value: 1048,
                  name: 'HTML 32'
                },
                {
                  value: 735,
                  name: 'PDF 24'
                },
                {
                  value: 580,
                  name: 'CDA 1'
                },
                {
                  value: 484,
                  name: 'BSXML 1'
                }
              ]
            }
          ]
        },
        yearTypeDataTableData: [
          {
            fileName: '检验记录',
            amount: '2'
          },
          {
            fileName: '住院病案首页',
            amount: '2'
          },
          {
            fileName: 'EMR-SD-06-检查记录',
            amount: '4'
          },
          {
            fileName: '生命体征测量记录',
            amount: '3'
          },
          {
            fileName: '卫生时间摘要',
            amount: '5'
          },
          {
            fileName: '一般手术记录',
            amount: '6'
          },
          {
            fileName: '患者基本信息',
            amount: '5'
          },
          {
            fileName: 'EMR-SD-36-死亡记录 ',
            amount: '6'
          },
          {
            fileName: '中药处方',
            amount: '2'
          },
          {
            fileName: '麻醉术前访问记录 ',
            amount: '1'
          }
        ],
        // CDR 数据统计 echarts
        CDREchartsOption: {
          title: {
            show: true,
            text: '99.95G',
            subtext: '总容量',
            itemGap: 8,
            left: '48%',
            top: '35%',
            textStyle: {
              color: '#666666',
              fontWeight: 400,
              fontSize: 16
            },
            subtextStyle: {
              color: '#666666',
              fontWeight: 400,
              fontSize: 14
            },
            textAlign: 'center'
          },

          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['75%', '90%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              color: ['#DCDCDC', '#5988FE'],
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                {
                  value: 335
                },
                {
                  value: 1048
                }
              ]
            }
          ]
        },
        defaultPropsSourceId: {
          children: 'children',
          label: 'text'
        },
        selectionChangeData: [],
        datasourceId: '',
        processFlag: '',
        ErrorData: {},
        logIds: [],
        adapterIds: [],
        frontData: {},
        frontId: null,
        isShowAllDelete: false,
        isShowAllCollect: false,
        isShowAllUpload: false,
        frontLibraryDataDetail: {
          BSXML: '',
          ErrorData: ''
        },
        timer: null,
        controllTaskes: [],
        msgVersions: '',
        msgOrganizations: '',
        logTotal: {},
        dataTotal: {},
        selectId: '',
        temporaryCollectDialogForm: {
          hisStartTime: '',
          hisEndTime: '',
          logDataId: null
        },
        temporaryCollectDialogFormRules: {
          hisStartTime: [
            {
              required: true,
              message: '请输入开始时间',
              trigger: 'blur'
            },
            {
              validator: rule_starttime,
              trigger: ['change', 'blur']
            }
          ],
          hisEndTime: [
            {
              required: true,
              message: '请输入开始时间',
              trigger: 'blur'
            },
            {
              validator: rule_endtime,
              trigger: ['change', 'blur']
            }
          ]
        },
        fullDialogVisible: false,
        temporaryCollectDialogVisible: false,
        logScript: {},
        objData: {},
        logDataId: null,
        IDS: null,
        rowDataCollect: {},
        toScriptData: {},
        sonValue: '',
        num: 0,
        scriptNames: '',
        LogOptions: [],
        bigServerData: {},
        totalErrorCounts: '',
        totalCounts: '',
        qianzhijiErrorTotal: '',
        qianzhijiTotal: '',
        logCollectLength: 0,
        dataCollectLength: 0,
        qianzhijiLength: 0,
        solvePackageLength: 0,
        batchEditShow: false,
        isShowBatchEditScript: false,
        scriptTipsDialogVisible: false,
        batchEditDialogForm: {
          cron: ''
        },
        batchEditDialogFormRules: {
          cron: [
            {
              required: true,
              message: '请输入活动名称',
              trigger: 'blur'
            }
          ]
        },
        batchLogIds: [],
        allTaskNameList: [],
        logCollectionSpeed: '',
        dataCollectCompressSpeed: '',
        decompressSpeed: '',
        logTaskTableName: '',
        configCode: false,
        configTitle: true,
        dataCollectTestDialogesVisible: false,
        testInformation: '',
        startDates: '',
        endDates: '',
        choiceDate0: '',
        pickerOptions: {
          // 设置不能选择的日期
          onPick: ({ maxDate, minDate }) => {
            this.choiceDate0 = minDate.getTime()
            if (maxDate) {
              this.choiceDate0 = ''
            }
          },
          disabledDate: time => {
            let choiceDateTime = new Date(this.choiceDate0).getTime()
            const minTime = new Date(choiceDateTime).setMonth(
              new Date(choiceDateTime).getMonth() - 1
            )
            const maxTime = new Date(choiceDateTime).setMonth(
              new Date(choiceDateTime).getMonth() + 1
            )
            const min = minTime
            const newDate =
              new Date(new Date().toLocaleDateString()).getTime() +
              24 * 60 * 60 * 1000 -
              1
            const max = newDate < maxTime ? newDate : maxTime
            //如果已经选中一个日期 则 返回 该日期前后一个月时间可选
            if (this.choiceDate0) {
              return time.getTime() < min || time.getTime() > max
            }
            //若一个日期也没选中 则 返回 当前日期以前日期可选
            return time.getTime() > newDate
          }
        },
        dataCollectWatchTrendy: [],
        uploadDataListOptions: [],
        uploadDataObj: {},
        notHasStandard: false,
        hasNoEchoStandard: false,
        btnDisabledFlag: false,
        timeLabel: '错误时间',
        controllerBtnFlag: true,
        selectionLogCollectCopy: [],
        selectionChangeDataCopy: [],
        dataCollectServiceWatchTimer: null,
        cdrNamese: ''
      }
      // methods
      me.evtHandlers = {
        // 数据采集服务监控
        dataCollectServiceWatch () {
          $ajax({
            url: 'api/etl_mcentre.cdrServerRpcService/getServers',
            jsonData: []
          }).then(res => {
            if (res.code == 200) {
              console.log('数据采集服务监控res', res)
              this.bigServerData = res.body
              this.logCollectLength =
                this.bigServerData.logCollect &&
                this.bigServerData.logCollect.length
              this.dataCollectLength =
                this.bigServerData.compress &&
                this.bigServerData.compress.length
              this.qianzhijiLength =
                this.bigServerData.adapter && this.bigServerData.adapter.length
              this.solvePackageLength =
                this.bigServerData.decompress &&
                this.bigServerData.decompress.length
              this.totalErrorCounts = this.bigServerData.logDataBaseNum.totalErrorCounts
              this.totalCounts = this.bigServerData.logDataBaseNum.totalCounts
              this.qianzhijiErrorTotal = this.bigServerData.adapterDataMap.errorTotal
              this.qianzhijiTotal = this.bigServerData.adapterDataMap.total
              // 日志库速率
              this.logCollectionSpeed = this.bigServerData.logCollectionSpeedMap.total
              // 数据库速率
              this.dataCollectCompressSpeed = this.bigServerData.compressSpeedMap.total
              // 解包速率
              this.decompressSpeed = this.bigServerData.decompressSpeedMap.total
              // debugger
              window.addEventListener('resize', () => {
                jsPlumb.repaintEverything()
              })
              this.getFLowPictures(this.bigServerData.business, 'picsOne')
              this.getFLowPictures(this.bigServerData.logCollect, 'picsTwo')
              this.getFLowPictures(this.bigServerData.compress, 'picsFour')
              this.getFLowPictures(this.bigServerData.adapter, 'picsFive')
              this.getFLowPictures(this.bigServerData.decompress, 'picsSeven')
              this.getStraightFLowPictures(this.bigServerData.cdr, 'picsEight')
              this.bigServerData.business.map((item, index) => {
                if (index === 2) {
                  jsPlumb.ready(function () {
                    const common = {
                      connector: ['Flowchart'], // connector 连接
                      // anchor: ['Right', 'Left'], // 锚点
                      anchor: [-0.1, 0.3, 0, 0], // 锚点
                      endpoint: [
                        'Blank',
                        {
                          radius: 2
                        }
                      ] // endpoint 端点
                    }
                    jsPlumb.connect(
                      {
                        source: 'picsOne2',
                        target: 'picsThree',
                        paintStyle: {
                          // 连线样式
                          stroke: '#4088FE',
                          lineWidth: 6,
                          strokeWidth: 1
                        },
                        // 设置连接线样式
                        endpointStyle: {
                          fill: '#4088FE',
                          outlineWidth: 1
                        },
                        overlays: [
                          [
                            'PlainArrow',
                            {
                              width: 8,
                              length: 8,
                              label: '示例箭头',
                              location: 0.1
                            }
                          ],
                          [
                            'PlainArrow',
                            {
                              width: 8,
                              length: 8,
                              label: '示例箭头',
                              location: 0.9
                            }
                          ]
                        ]
                      },
                      common
                    )
                  })
                }
              })
              jsPlumb.ready(function () {
                const common = {
                  connector: ['Flowchart'], // connector 连接
                  // anchor: ['Right', 'Left'], // 锚点
                  anchor: [-0.1, 0.3, 0, 0], // 锚点
                  endpoint: [
                    'Blank',
                    {
                      radius: 2
                    }
                  ] // endpoint 端点
                }
                jsPlumb.connect(
                  {
                    source: 'picsThree',
                    target: 'picsSix',
                    paintStyle: {
                      // 连线样式
                      stroke: '#4088FE',
                      lineWidth: 6,
                      strokeWidth: 1
                    },
                    // 设置连接线样式
                    endpointStyle: {
                      fill: '#4088FE',
                      outlineWidth: 1
                    },
                    overlays: [
                      [
                        'PlainArrow',
                        {
                          width: 8,
                          length: 8,
                          label: '示例箭头',
                          location: 0.1
                        }
                      ],
                      [
                        'PlainArrow',
                        {
                          width: 8,
                          length: 8,
                          label: '示例箭头',
                          location: 0.5
                        }
                      ],
                      [
                        'PlainArrow',
                        {
                          width: 8,
                          length: 8,
                          label: '示例箭头',
                          location: 0.9
                        }
                      ]
                    ]
                  },
                  common
                )
              })
              this.bigServerData.cdr.map((item, index) => {
                if (index == 1) {
                  jsPlumb.ready(function () {
                    const common = {
                      connector: ['Flowchart'], // connector 连接
                      // anchor: ['Right', 'Left'], // 锚点
                      anchor: [0, 0.3, 0, 0], // 锚点
                      endpoint: [
                        'Blank',
                        {
                          radius: 2
                        }
                      ] // endpoint 端点
                    }
                    jsPlumb.connect(
                      {
                        source: 'picsSix',
                        target: 'picsEight1',
                        paintStyle: {
                          // 连线样式
                          stroke: '#4088FE',
                          lineWidth: 6,
                          strokeWidth: 1
                        },
                        // 设置连接线样式
                        endpointStyle: {
                          fill: '#4088FE',
                          outlineWidth: 1
                        },
                        overlays: [
                          [
                            'PlainArrow',
                            {
                              width: 8,
                              length: 8,
                              label: '示例箭头',
                              location: 0.8
                            }
                          ]
                        ]
                      },
                      common
                    )
                    // 增加一个端点
                    // jsPlumb.addEndpoint('picsSix', {
                    //   anchors: ['Right']
                    // })
                  })
                }
              })
            } else {
              this.$message({
                message: res.body.data.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        // 流程图连线一
        getFLowPictures (arr, picId) {
          // debugger

          // jsPlumb.reset()
          arr.forEach((item, index) => {
            jsPlumb.ready(function () {
              const common = {
                connector: ['Flowchart'], // connector 连接
                endpoint: [
                  'Blank',
                  {
                    radius: 2
                  }
                ] // endpoint 端点
              }
              jsPlumb.connect(
                {
                  source: picId + index,
                  target: picId + (index + 1),
                  // anchor: ['Right', 'Right'], // 锚点
                  anchor: [[1, 0.5, 0, 0], 'Right', 'Right'], // 锚点
                  paintStyle: { stroke: '#4088FE', strokeWidth: 1 },
                  endpointStyle: {
                    fill: '#4088FE',
                    outlineWidth: 1
                  }
                },
                common
              )
            })
          })
        },
        // 流程图连线二
        getStraightFLowPictures (arr, picId) {
          // debugger
          arr.forEach((item, index) => {
            jsPlumb.ready(function () {
              const common = {
                connector: ['Flowchart'], // connector 连接
                // anchor: ['Bottom', 'Top'], // 锚点
                anchor: [0, 0.5, 1, 0], // 锚点
                endpoint: [
                  'Blank',
                  {
                    radius: 2
                  }
                ] // endpoint 端点
              }
              jsPlumb.connect(
                {
                  source: picId + index,
                  target: picId + (index + 1),
                  paintStyle: {
                    // 连线样式
                    stroke: '#4088FE',
                    lineWidth: 6,
                    strokeWidth: 1
                  },
                  // 设置连接线样式
                  endpointStyle: {
                    fill: '#4088FE',
                    outlineWidth: 1
                  }
                },
                common
              )
            })
          })
        },
        // 流程图连线三
        goBackFather (e) {
          // this.fullDialogVisible = e
          this.isScreenFull = e
          if (this.searchKey) {
            this.$nextTick(() => {
              this.$refs.leftTree.filter(this.searchKey)
            })
          }
        },

        // 临时采集
        temporaryCollect () {
          if (JSON.stringify(this.rowDataCollect) !== '{}') {
            this.temporaryCollectDialogVisible = true
            this.temporaryCollectDialogForm = {}
          } else {
            this.$message.error('请先选择一条采集任务')
            return false
          }
        },

        filterSelect (e) {
          console.log('eeee', e)
          this.logCollectDialogForm.scriptName = e
        },
        CORNDialogHandle () {
          this.CORNDialogVisible = true
        },
        handleChange (value) {
          console.log('value', value)
        },
        handleClick () {
          this.medicalRecord = !this.medicalRecord
          this.isShow = !this.isShow
          this.dataCollectServiceWatch()
        },
        handleNodeClick (data) {
          // debugger
          console.log('data哈哈哈', data)
          this.selectionLogCollect = []
          this.selectionChangeData = []
          this.rowDataCollect = {}
          // this.copyDialogVisibleForm = {}
          if (!data.children) {
            this.addLogDialogForm.templateId = data.code
            this.addLogDialogForm.templateName = data.name
            this.addLogDialogForm.etlTaskCode = data.code
            this.addLogDialogForm.name = data.name
            this.msgType = data.code
            this.msgVersions = data.msgVersion
            this.msgOrganizations = data.organize
            this.addDataDialogForm.templateId = data.code
            this.addDataDialogForm.etlTaskCode = data.code
            this.addDataDialogForm.templateName = data.name
            this.addDataDialogForm.name = data.name
          }
          if (this.isLogOrData) {
            this.$refs.dataTables.setCurrentRow(-1)
            if (this.getDataCollectQueryTaskListTimer) {
              clearInterval(this.getDataCollectQueryTaskListTimer)
              this.getDataCollectQueryTaskListTimer = null
            }
            if (this.getLogCollectQueryListTimer) {
              clearInterval(this.getLogCollectQueryListTimer)
              this.getLogCollectQueryListTimer = null
            }
            this.$nextTick(() => {
              this.getLogCollectQueryList()
            })

            this.getLogCollectQueryListTimer = setInterval(() => {
              this.getLogCollectQueryListUpdate()
            }, 5000)
          }
          if (!this.isLogOrData) {
            this.$refs.handleDataTableData.setCurrentRow(-1)
            if (this.getLogCollectQueryListTimer) {
              clearInterval(this.getLogCollectQueryListTimer)
              this.getLogCollectQueryListTimer = null
            }
            if (this.getDataCollectQueryTaskListTimer) {
              clearInterval(this.getDataCollectQueryTaskListTimer)
              this.getDataCollectQueryTaskListTimer = null
            }
            this.$nextTick(() => {
              this.getDataCollectQueryTaskList()
            })

            this.getDataCollectQueryTaskListTimer = setInterval(() => {
              this.getDataCollectQueryTaskListUpdate()
            }, 5000)
          }
        },

        filterNode (value, data) {
          if (!value) return true
          return data.name && data.name.indexOf(value) !== -1
        },
        // 表格相关事件
        getStyle (columnIndex) {
          if (
            columnIndex.columnIndex == 0 ||
            columnIndex.columnIndex == 1 ||
            columnIndex.columnIndex == 2 ||
            columnIndex.columnIndex == 3 ||
            columnIndex.columnIndex == 4 ||
            columnIndex.columnIndex == 5
          ) {
            return 'background: #EBF4FF;color: #333'
          } else if (columnIndex.columnIndex == 6) {
            return 'background: #FFF6EB;color: #333'
          } else {
            return 'background: #F2E8FF;color: #333'
          }
        },
        getLogStyle (columnIndex) {
          if (
            columnIndex.columnIndex == 0 ||
            columnIndex.columnIndex == 1 ||
            columnIndex.columnIndex == 2 ||
            columnIndex.columnIndex == 3 ||
            columnIndex.columnIndex == 4 ||
            columnIndex.columnIndex == 5
          ) {
            return 'background: #EBF4FF;color: #333'
          } else if (columnIndex.columnIndex == 12) {
            return 'background: #F2E8FF;color: #333'
          } else {
            return 'background: #FFF6EB;color: #333'
          }
        },

        // 合并表格行的数据处理方法
        addSpanRows (tableData) {
          let pos = 0
          let len = tableData.length
          for (let i = 0; i < len; i++) {
            const item = tableData[i]
            if (i === 0) {
              item.$rows = 1
              pos = 0
            }
            if (i !== 0) {
              if (item.ETLTASKCODE === tableData[i - 1].ETLTASKCODE) {
                item.$rows = 0
                tableData[pos].$rows = tableData[pos].$rows + 1
              } else {
                item.$rows = 1
                pos = i
              }
            }
          }
        },
        // 合并日志采集表格
        mergeLogDataTable ({ row, column, rowIndex, columnIndex }) {
          this.addSpanRows(this.tableData)
          if (columnIndex >= 1 && columnIndex <= 5) {
            return {
              rowspan: row.$rows,
              colspan: row.$rows ? 1 : 0
            }
          }
        },

        // 日志采集
        inDomeLogStart () {
          console.log('进入')
          this.isShowLogStart = true
          this.isShowLogStop = false
          this.isShowLogReset = false
        },
        outDomeLogStart () {
          console.log('移出')
          setTimeout(() => {
            this.isShowLogStart = false
          }, 3000)
        },
        inDomeLogStop () {
          console.log('进入')
          this.isShowLogStop = true
          this.isShowLogStart = false
          this.isShowLogReset = false
        },
        outDomeLogStop () {
          console.log('移出')
          setTimeout(() => {
            this.isShowLogStop = false
          }, 3000)
        },
        inDomeLogReset () {
          console.log('进入')
          this.isShowLogReset = true
          this.isShowLogStart = false
          this.isShowLogStop = false
        },
        outDomeLogReset () {
          console.log('移出')
          setTimeout(() => {
            this.isShowLogReset = false
          }, 3000)
        },
        // 数据采集
        inDomeDataStart () {
          console.log('进入')
          this.isShowDataStart = true
          this.isShowDataStop = false
          this.isShowDataPause = false
        },
        outDomeDataStart () {
          console.log('移出')
          setTimeout(() => {
            this.isShowDataStart = false
          }, 3000)
        },
        inDomeDataPause () {
          console.log('进入')
          this.isShowDataPause = true
          this.isShowDataStart = false
          this.isShowDataStop = false
        },
        outDomeDataPause () {
          console.log('移出')
          setTimeout(() => {
            this.isShowDataPause = false
          }, 3000)
        },
        inDomeDataStop () {
          console.log('进入')
          this.isShowDataStop = true
          this.isShowDataStart = false
          this.isShowDataPause = false
        },
        outDomeDataStop () {
          console.log('移出')
          setTimeout(() => {
            this.isShowDataStop = false
          }, 3000)
        },

        // 全部重传
        inDomeReUpload () {
          this.isReUpload = true
          this.isDeleteAll = false
        },
        outDomeReUpload () {
          setTimeout(() => {
            this.isReUpload = false
          }, 3000)
        },
        // 全部删除
        inDomeDeleteAll () {
          this.isDeleteAll = true
          this.isReUpload = false
        },
        outDomeDeleteAll () {
          setTimeout(() => {
            this.isDeleteAll = false
          }, 3000)
        },
        clickStart () {
          this.startShow = false
        },
        clickAllStart () {
          this.startShow = false
        },
        // 前置机重采/全部重采
        inDomeQianzhijiCollect () {
          this.isShowAllCollect = true
          this.isShowAllUpload = false
          this.isShowAllDelete = false
        },
        outDomeQianzhijiCollect () {
          setTimeout(() => {
            this.isShowAllCollect = false
            this.isShowAllUpload = false
            this.isShowAllDelete = false
          }, 3000)
        },
        // 前置机重传/全部重传
        inDomeQianzhijiUpload () {
          this.isShowAllUpload = true
          this.isShowAllCollect = false
          this.isShowAllDelete = false
        },
        outDomeQianzhijiUpload () {
          setTimeout(() => {
            this.isShowAllUpload = false
            this.isShowAllCollect = false
            this.isShowAllDelete = false
          }, 3000)
        },
        // 前置机删除/全部删除
        inDomePause () {
          this.pauseOrStopShow = true
          if (this.frontLibraryDialogVisible) {
            this.isShowAllDelete = true
            this.isShowAllCollect = false
            this.isShowAllUpload = false
          }
        },
        outDomePause () {
          setTimeout(() => {
            this.pauseOrStopShow = false
            if (this.frontLibraryDialogVisible) {
              this.isShowAllDelete = false
              this.isShowAllCollect = false
              this.isShowAllUpload = false
            }
          }, 3000)
        },
        modeToggleClick () {
          // this.streamlineMode = true
          // this.detailMode = false
          this.streamlineMode = !this.streamlineMode
          this.detailMode = !this.detailMode
        },
        //  批量修改采集策略
        inDomeBatchEdit () {
          this.batchEditShow = true
        },
        outDomeBatchEdit () {
          setTimeout(() => {
            this.batchEditShow = false
          }, 3000)
        },

        // 接口
        /**
         * @desc 获取机构
         */
        getOrganization () {
          $ajax({
            url: 'api/etl_mcentre.logTaskManageRpcService/getOrgList',
            jsonData: []
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.organizationOptions = res.body.data.data.rows
              this.value = this.organizationOptions[0].orgCode
              this.addLogDialogForm.authorOrganization = this.value
              this.addLogDialogForm.authorOrganizationName = this.organizationOptions[0].orgName
              this.logLibraryForm.organizations = this.organizationOptions[0].orgCode
              this.addDataDialogForm.authorOrganization = this.value
              this.addDataDialogForm.authorOrganizationName = this.organizationOptions[0].orgName
            }
          })
        },
        changeOrganization (code) {
          console.log('code', code)
          this.tableData = []
          this.dataTableData = []
          this.value = code
          this.searchKey = ''
          this.addLogDialogForm.authorOrganization = code
          this.addDataDialogForm.authorOrganization = code
          this.logLibraryForm.organizations = code
          const organizationItem = this.organizationOptions.find(
            item => item.orgCode == code
          )
          this.addLogDialogForm.authorOrganizationName =
            organizationItem.orgName
          this.addDataDialogForm.authorOrganizationName =
            organizationItem.orgName
          this.getTreeData()
          if (this.logLibraryDialogVisible) {
            this.logLibraryForm.taskName = ''
            this.logTaskTableName = ''
            this.getAllTaskNames(code)
          }
        },

        /**
         * @desc 获取bsXml树
         * @param {string} org
         */
        getTreeData () {
          var that = this
          $ajax({
            url: 'api/etl_mcentre.logTaskManageRpcService/getBsXmlTemplate',
            jsonData: [
              {
                org: this.value
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.treeData = res.body.data
            }
          })
        },

        /**
         * @desc 临时执行
         * @param {string} hisStartTime 开时间
         * @param {string} hisEndTime 开时间
         * @param {Int} logDataId 日志id
         */
        temporaryImplement () {
          this.$refs.temporaryCollectDialogForm.validate(valid => {
            if (valid) {
              $ajax({
                url:
                  'api/etl_mcentre.logTaskManageRpcService/startLogTaskByDate',
                jsonData: [
                  {
                    hisStartTime: this.temporaryCollectDialogForm.hisStartTime,
                    hisEndTime: this.temporaryCollectDialogForm.hisEndTime,
                    logDataId: this.logDataId
                  }
                ]
              }).then(res => {
                if (res.body.meta.statusCode == '200') {
                  console.log('临时执行res', res)
                  this.$message.success('执行成功')
                  this.temporaryCollectDialogVisible = false
                  this.temporaryCollectDialogForm = {}
                } else {
                  this.$message.error(res.body.data.message)
                }
              })
            }
          })
        },

        /**
         * @desc 日志采集查询任务列表
         * @param {string} etlTaskCode ETL任务号(非必须)
         * @param {string} authorOrganization 机构代码
         * @param {Int} currPage 当前页
         * @param {Int} pageSize 每页显示记录数
         */
        getLogCollectQueryList () {
          $ajax({
            url: 'api/etl_mcentre.logTaskManageRpcService/queryLogTaskList',
            jsonData: [
              {
                authorOrganization: this.value,
                currPage: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                status: this.checkList,
                searchString: this.searchRightKey,
                templateId: this.msgType,
                msgVersion: this.msgVersions,
                msgOrganization: this.msgOrganizations
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.tableData = res.body.data.list
              // let newETLTASKCODE = this.tableData[0].ETLTASKCODE
              // this.tableData.forEach(item => {
              //   if (newETLTASKCODE === item.ETLTASKCODE) {
              //     this.num++
              //   } else {
              //     this.num = 0
              //   }
              //   // console.log('this.num', this.num)
              //   newETLTASKCODE = item.ETLTASKCODE
              // })
              this.pagination.totalNum = res.body.data.total
            }
          })
        },
        getLogCollectQueryListUpdate () {
          $ajax({
            url: 'api/etl_mcentre.logTaskManageRpcService/queryLogTaskList',
            jsonData: [
              {
                authorOrganization: this.value,
                currPage: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                status: this.checkList,
                searchString: this.searchRightKey,
                templateId: this.msgType,
                msgVersion: this.msgVersions,
                msgOrganization: this.msgOrganizations
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              res.body.data.list.forEach((item, index) => {
                this.tableData[index].DATASTATUS = item.DATASTATUS
                this.tableData[index].LOGSTATUS = item.LOGSTATUS
                this.tableData[index].errorCount = item.errorCount
                this.tableData[index].totalCount = item.totalCount
                this.tableData[index].GATHERTIME = item.GATHERTIME
              })
              // this.tableData = res.body.data.list

              this.pagination.totalNum = res.body.data.total
            }
          })
        },

        selectLogCollect (val) {
          this.rowDataCollect = {}
          console.log('数据采集val', val)
          this.selectionChangeData = val
          this.selectionChangeDataCopy = val
          this.logDataId =
            this.selectionChangeData.length > 0
              ? this.selectionChangeData[0].LOGID
              : null
          if (this.isLogOrData) {
            val && val[0]
              ? (this.updateLogDialogForm = val[0])
              : this.updateLogDialogForm
          }

          if (!this.isLogOrData) {
            val && val[0]
              ? (this.updateDataDialogForm = val[0])
              : this.updateDataDialogForm
            if (val.length > 0) {
              val.forEach(item => {
                if (item.hasOwnProperty('cdrConfig')) {
                  if (item.COMPRESSINTERFACE == '0') {
                    this.updateDataDialogForm.COMPRESSINTERFACE = '随机'
                  }

                  this.datasourceId = val[0].cdrConfig[0].cdrCode
                }
              })
            }
          }
          if (this.frontLibraryDialogVisible) {
            this.frontId = this.selectionChangeData[0].id
            this.queryFrontLibraryDataDetail(this.frontData)
          }
        },
        selectLogCollectAll (val) {
          this.rowDataCollect = {}
          console.log('this.rowDataCollect ', this.rowDataCollect)
          console.log('日志采集 勾选', val)
          this.selectionLogCollect = val
          this.selectionLogCollectCopy = val
          this.logDataId =
            this.selectionLogCollect.length > 0
              ? this.selectionLogCollect[0].LOGID
              : null

          if (this.isLogOrData) {
            val && val[0]
              ? (this.updateLogDialogForm = val[0])
              : this.updateLogDialogForm
          }
        },
        // 日志库
        selectLogLibrary (selection) {
          this.logIds = []
          console.log('日志库单选矿selection', selection)
          this.logLibrarySelection = selection
          this.logLibrarySelection.forEach(item => {
            this.logIds.push(item.LOGID)
          })
        },
        selectAdapterLibrary (selection) {
          // debugger
          this.adapterIds = []
          this.logLibrarySelection = selection
          this.logLibrarySelection.forEach(item => {
            this.adapterIds.push(String(item.id))
          })
        },
        cellClickLogLibrary (value) {
          if (value) {
            this.logid = value.LOGID
            this.getOneErrorDataDetail(this.logid)
          }
        },
        handleNodeSourceIdClick (data) {
          console.log('data', data)
          this.addLogDialogForm = {
            ...this.addLogDialogForm,
            logDataSourceId: data.text
          }
          // 使 input 失去焦点，并隐藏下拉框
          this.$refs.selectTree.blur()
        },

        /**
         * @desc 新增日志采集
         * @param {string} name 任务名称
         * @param {string} templateId 模板id
         * @param {string} templateName 模板名称
         * @param {string} etlTaskCode ETL任务号
         * @param {string} logDataSourceId 日志采集数据源(非必须)
         * @param {string} logICDataSourceId 业务数据源(非必须)
         * @param {string} authorOrganization 机构代码
         * @param {string} authorOrganizationName 机构名称
         * @param {Int} catalogId 脚本目录id(非必须)
         * @param {string} catalogName 脚本目录名称(非必须)
         * @param {Int} limitCount 日志采集数量上限
         * @param {string} order 0:正序 1:倒序 默认0(非必须)
         * @param {string} cron Cron采集表达式
         * @param {string} startTime 采集开始时间
         * @param {string} endTime 采集结束时间
         * @param {Int} dayCount 采集跨度
         * @param {string} logTimeUnit 跨度单位 分钟:minute 小时:hour 天:day
         */
        createLogCollect () {
          let me = this
          if (
            !this.addLogDialogForm.templateId ||
            !this.addLogDialogForm.authorOrganization
          ) {
            this.$message({
              message: '机构代码或模板不能为空',
              duration: '2000 ',
              type: 'warning'
            })
            return false
          }
          this.$refs.addLogDialogForm.validate(valid => {
            if (valid) {
              if (this.addLogDialogForm.name === '') {
                this.$message.error('任务名称不能为空')
                return false
              }
              $ajax({
                url: 'api/etl_mcentre.logTaskManageRpcService/createLogTask',
                jsonData: [
                  {
                    ...this.addLogDialogForm,
                    dayCount: Number(this.addLogDialogForm.dayCount),
                    limitCount: Number(this.addLogDialogForm.limitCount),
                    msgVersion: this.msgVersions,
                    organize: this.msgOrganizations,
                    logBufferTime: Number(this.addLogDialogForm.logBufferTime),
                    compressInterface:
                      this.addLogDialogForm.compressInterface == '随机'
                        ? '0'
                        : this.addLogDialogForm.compressInterface
                  }
                ]
              }).then(res => {
                if (res.body.meta.statusCode == '200') {
                  me.$message({
                    message: '新增成功',
                    duration: '2000 ',
                    type: 'success'
                  })
                  me.getLogCollectQueryList()
                  me.getAllTotal()
                  this.addLogDialogVisible = false
                } else {
                  me.$message({
                    message: res.body.meta.message,
                    duration: '2000 ',
                    type: 'error'
                  })
                }
              })
            }
          })

          // this.addLogDialogForm = {}
        },

        /**
         * @desc 新增日志采集-获取执行脚本数据(获取SQL脚本目录)
         * @param {string} msgType 消息模型编号
         */
        getCataLogId () {
          $ajax({
            url: 'api/etl_mcentre.configSqlRpcService/getSqlCatalogByMsgType',
            jsonData: [
              {
                msgType: this.msgType
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.implementScripts = res.body.data
              if (res.body.data.length > 0) {
                this.updateLogDialogForm.CATALOGID = res.body.data[0].id
                this.updateLogDialogForm.CATALOGNAME =
                  res.body.data[0].catalogName
                this.updateDataDialogForm.CATALOGID = res.body.data[0].id
                this.updateDataDialogForm.CATALOGNAME =
                  res.body.data[0].catalogName
              }
              // 该数据里的id是catalogid
            }
          })
        },
        // 数据采集-获取上传数据库列表
        getUploadDataList () {
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/getUploadDataSource',
            jsonData: [
              {
                msgType: this.msgType,
                organization: this.msgOrganizations,
                standardCode: this.msgVersions
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('数据采集-获取上传数据库列表res', res)
              this.uploadDataListOptions = res.body.data
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        // 新增日志采集-获取数据源数据
        getLogDataSourceId () {
          $ajax({
            url: 'api/etl_mcentre.configSqlRpcService/queryDataSource',
            jsonData: []
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.dataOrigins = JSON.parse(res.body.data)
              JSON.parse(res.body.data).forEach(items => {
                if (items.children) {
                  let LOGDATASOURCEID = items.children.filter(
                    item => item.id == this.updateLogDialogForm.DATASOURCEID
                  )

                  if (LOGDATASOURCEID.length > 0) {
                    this.logDataSourceIdName = LOGDATASOURCEID[0].text
                  }
                  let logScripts = items.children.filter(
                    item => item.id == this.logScript.hisDataSourceId
                  )
                  if (logScripts.length > 0) {
                    this.logDataSourceIdName = logScripts[0].text
                  }
                }
              })
            }
          })
        },

        selectCatalogName (val) {
          this.addLogDialogForm.catalogId = val
          this.updateLogDialogForm.CATALOGID = val
          this.addDataDialogForm.catalogId = val
          this.updateDataDialogForm.CATALOGID = val

          const catalogNames = this.implementScripts.find(
            item => item.id == val
          )
          this.addLogDialogForm.catalogName = catalogNames.catalogName
          this.addDataDialogForm.catalogName = catalogNames.catalogName
          this.updateLogDialogForm.CATALOGNAME = catalogNames.catalogName
          this.updateDataDialogForm.CATALOGNAME = catalogNames.catalogName
        },
        //  日志采集脚本名称
        selectLogCatalogName (val) {
          console.log('日志采集脚本名称val', val)
          this.logCollectDialogForm.catalogId = val
          const catalogNames = this.implementScripts.find(
            item => item.id == val
          )
          console.log('catalogNames', catalogNames)
          this.logCollectDialogForm.scriptName = catalogNames.catalogName
          this.noConfigSearchLogCollectSql()
        },

        SelectSourceId (val) {
          console.log('val.id', val)
          this.datasourceId = val.id
          this.logDataSourceIdName = val.text

          // objData
          if (this.logCollectDialogVisible) {
            // this.logDataSourceIdName = ''
            // this.logCollectDialogForm.hisDataSourceId = ''
            if (!val.children) {
              this.logCollectDialogForm.hisDataSourceId = val.id
              this.$refs.selectTree.blur()
            } else {
              this.$message.warning('只能选择第二级节点')
              this.logDataSourceIdName = ''
              this.logCollectDialogForm.hisDataSourceId = ''
              return false
            }
          }

          if (this.isLogOrData) {
            this.addLogDialogForm.logDataSourceId = val.id
            this.updateLogDialogForm.LOGDATASOURCEID = val.id
            this.$refs.selectTree.blur()
          }
        },

        /**
         * @desc 修改日志采集
         * @param {Int} logId 日志采集任务id
         * @param {string} logDataSourceId 数据源id
         * @param {Int} catalogId 脚本目录id(非必须)
         * @param {string} catalogName 脚本目录名称(非必须)
         * @param {Int} limitCount 日志采集上限数量(非必须)
         * @param {string} order 0:正序 1:倒序 默认0(非必须)
         * @param {string} cron 采集cron表达式
         * @param {string} startTime 采集开始时间
         * @param {string} endTime 采集结束时间
         * @param {string} sql 采集SQL(非必须)
         * @param {string} callName 存储过程名称(非必须)
         * @param {string} sqlType SQL类型 1:SQL语句 2:存储过程
         * @param {Int} dayCount 采集跨度
         * @param {string} logTimeUnit 跨度单位 分钟:minute 小时:hour 天:day
         */
        updateLogCollect () {
          this.$refs.updateLogDialogForm.validate(valid => {
            if (valid) {
              console.log(
                'this.updateLogDialogForm.NAME',
                this.updateLogDialogForm.NAME
              )
              if (
                !this.updateLogDialogForm.NAME ||
                this.updateLogDialogForm.NAME === ''
              ) {
                this.$message.error('任务名称不能为空')
                return false
              }
              $ajax({
                url: 'api/etl_mcentre.logTaskManageRpcService/updateLogTask',
                jsonData: [
                  {
                    id: this.IDS,
                    logId: this.updateLogDialogForm.LOGID,
                    logDataSourceId: this.updateLogDialogForm.LOGDATASOURCEID,
                    catalogId: this.updateLogDialogForm.CATALOGID || null,
                    catalogName: this.updateLogDialogForm.CATALOGNAME || '',
                    name: this.updateLogDialogForm.NAME,
                    limitCount:
                      Number(this.updateLogDialogForm.LIMITCOUNT) || null,
                    order: this.updateLogDialogForm.TIMEORDER || '',
                    cron: this.updateLogDialogForm.CRON,
                    startTime: this.updateLogDialogForm.STARTTIME,
                    endTime: this.updateLogDialogForm.ENDTIME,
                    sql: this.logCollectDialogForm.sql,
                    callName: this.logCollectDialogForm.scriptName || '',
                    sqlType: this.radio,
                    logStatus: this.updateLogDialogForm.LOGSTATUS,
                    logBufferTime: Number(
                      this.updateLogDialogForm.LOGBUFFERTIME
                    ),
                    logBufferTimeUnit: this.updateLogDialogForm
                      .LOGBUFFERTIMEUNIT,
                    dayCount: Number(this.updateLogDialogForm.DAYCOUNT),
                    logTimeUnit: this.updateLogDialogForm.LOGTIMEUNIT,
                    compressInterface:
                      this.updateLogDialogForm.COMPRESSINTERFACE == '随机'
                        ? '0'
                        : this.updateLogDialogForm.COMPRESSINTERFACE
                  }
                ]
              }).then(res => {
                if (res.body.meta.statusCode == '200') {
                  this.$message({
                    message: res.body.meta.message,
                    duration: '2000 ',
                    type: 'success'
                  })

                  this.getLogCollectQueryList()
                  this.updateLogDialogVisible = false
                } else {
                  this.$message({
                    message: res.body.meta.message,
                    duration: '2000 ',
                    type: 'error'
                  })
                }
              })
            }
          })
        },

        /**
         * @desc 开启日志采集
         * @param {Array<Int>} logId 日志采集任务id数组
         */
        startLogCollect () {
          console.log(
            '日志采集启动this.selectionLogCollect',
            this.selectionLogCollect
          )
          if (this.selectionLogCollect.length <= 0) {
            this.$message.error('请先选择一条采集任务')
            return false
          } else {
            let logIdList = []
            this.selectionLogCollect.forEach(item => logIdList.push(item.LOGID))
            // if()
            $ajax({
              url: 'api/etl_mcentre.logTaskManageRpcService/startLogTask',
              jsonData: [
                {
                  logId: logIdList
                }
              ]
            }).then(res => {
              if (res.body.meta.statusCode == '200') {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'success'
                })
                this.getLogCollectQueryList()
                this.getAllTotal()
              } else {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'error'
                })
              }
            })
          }
        },

        // 日志全部启动
        startLogAll () {
          if (this.tableData.length > 0) {
            this.selectionLogCollect = this.tableData.filter(item => item.LOGID)
            this.startLogCollect()
          } else {
            this.$message.error('请先选择一条采集任务')
            return false
          }
        },

        // 日志全部暂停
        pauseLogAll () {
          if (this.tableData.length > 0) {
            this.selectionLogCollect = this.tableData.filter(item => item.LOGID)
            this.stopLogCollect()
          } else {
            this.$message.error('请先选择一条采集任务')
            return false
          }
        },

        // 日志全部停止
        stopLogAll () {
          if (this.tableData.length > 0) {
            this.selectionLogCollect = this.tableData.filter(item => item.LOGID)
            this.resetLogCollect()
          } else {
            this.$message.error('请先选择一条采集任务')
            return false
          }
        },

        /**
         * @desc 暂停日志采集
         * @param {Array<Int>} logId 日志采集任务id数组
         */
        stopLogCollect () {
          if (this.selectionLogCollect.length <= 0) {
            this.$message.error('请先选择一条采集任务')
            return false
          } else {
            let logIdList = []
            this.selectionLogCollect.forEach(item => logIdList.push(item.LOGID))
            $ajax({
              url: 'api/etl_mcentre.logTaskManageRpcService/stopLogTask',
              jsonData: [
                {
                  logId: logIdList
                }
              ]
            }).then(res => {
              if (res.body.meta.statusCode == '200') {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'success'
                })
                this.getLogCollectQueryList()
                this.getAllTotal()
              } else {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'error'
                })
              }
            })
          }
        },

        /**
         * @desc 停止日志采集
         *@param {Array<Int>} logId 日志采集任务id数组
         */
        resetLogCollect () {
          if (this.selectionLogCollect.length <= 0) {
            this.$message.error('请先选择一条采集任务')
            return false
          } else {
            let logIdList = []
            this.selectionLogCollect.forEach(item => logIdList.push(item.LOGID))
            $ajax({
              url: 'api/etl_mcentre.logTaskManageRpcService/resetLogTask',
              jsonData: [
                {
                  logId: logIdList
                }
              ]
            }).then(res => {
              if (res.body.meta.statusCode == '200') {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'success'
                })
                this.getLogCollectQueryList()
                this.getAllTotal()
              }
            })
          }
        },

        /**
         * @desc 查询日志采集SQL(已配置)
         * @param {Int} logId  日志采集id
         */
        searchLogCollectSql () {
          $ajax({
            url: 'api/etl_mcentre.logTaskManageRpcService/queryLogCollectSql',
            jsonData: [
              {
                logId: this.logScript.LOGID
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('查询日志采集SQL res', res)
              this.logCollectDialogForm = {
                ...this.logCollectDialogForm,
                ...res.body.data
              }
              this.radio = res.body.data.sqlType
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
            }
          })
        },

        /**
         * @desc 查询日志采集SQL(未配置)
         * @param {Int} catalogId  脚本名称id
         */
        noConfigSearchLogCollectSql () {
          $ajax({
            url: 'api/etl_mcentre.configSqlRpcService/queryLogCollectSql',
            jsonData: [
              {
                catalogId: this.logCollectDialogForm.catalogId
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('查询日志采集SQL res', res)
              this.logCollectDialogForm = {
                ...this.logCollectDialogForm,
                ...res.body.data
              }
              if (res.body.data) {
                this.radio = res.body.data.sqlType
              }
              if (!res.body.data) {
                this.logCollectDialogForm.sql = ''
                this.logCollectDialogForm.id = ''
              }
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
            }
          })
        },

        /**
         * @desc 保存日志采集SQL
         * @param {Int} id 日志采集任务id
         * @param {Int} catalogId sql脚本主键id
         * @param {string} sql 采集SQL(非必须)
         * @param {string} callName 存储过程名称(非必须)
         * @param {string} sqlType SQL类型 1:SQL语句 2:存储过程
         * @param {string} hisDataSourceId 业务数据源id
         * @param {string} scriptName 脚本名称
         */

        savesLogCollectSql () {
          console.log(
            'logCollectDialogForm.hisDataSourceId',
            this.logCollectDialogForm.hisDataSourceId
          )
          let params = {
            id: this.logScript.LOGID,
            catalogId:
              this.logCollectDialogForm.catalogId == ''
                ? null
                : this.logCollectDialogForm.catalogId,
            sql: this.logCollectDialogForm.sql,
            callName: this.logCollectDialogForm.callName,
            sqlType: this.radio,
            hisDataSourceId: this.logCollectDialogForm.hisDataSourceId,
            scriptName: this.logCollectDialogForm.scriptName
          }
          $ajax({
            url: 'api/etl_mcentre.logTaskManageRpcService/saveLogCollectSql',
            jsonData: [params]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.logCollectDialogVisible = false
              this.logCollectDialogForm = {}
              this.logDataSourceIdName = ''
              this.getLogCollectQueryList()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        /**
         * @desc 获取总数量
         */
        getAllTotal () {
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/queryAllTaskList',
            jsonData: []
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('获取总数量res', res)
              this.logTotal = res.body.data[0]
              this.dataTotal = res.body.data[1]
            }
          })
        },
        refreshData () {
          this.getDataCollectQueryTaskList()
        },
        /**
         * @desc 数据采集查询任务列表
         * @param {string} etlTaskCode etlTaskCode(非必须)
         * @param {string} authorOrganization 机构代码
         * @param {Int} currPage 当前页
         * @param {Int} pageSize 每页显示记录数
         */
        getDataCollectQueryTaskList () {
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/queryTaskList',
            jsonData: [
              {
                // etlTaskCode: '',
                authorOrganization: this.value,
                currPage: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                status: this.checkList,
                searchString: this.searchRightKey,
                templateId: this.msgType,
                msgVersion: this.msgVersions,
                msgOrganization: this.msgOrganizations
              }
            ]
          }).then(res => {
            console.log('数据采集res', res)
            if (res.body.meta.statusCode == '200') {
              this.dataTableData = res.body.data.list

              // if (this.dataTableData.length > 0) {
              //   this.isBlue = true
              // }
              this.pagination.totalNum = res.body.data.total
            } else {
              this.$message({
                message: '请先选择消息模型',
                duration: '2000 ',
                type: 'error'
              })
              return false
            }
          })
        },
        getDataCollectQueryTaskListUpdate () {
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/queryTaskList',
            jsonData: [
              {
                // etlTaskCode: '',
                authorOrganization: this.value,
                currPage: this.pagination.currentPage,
                pageSize: this.pagination.pageSize,
                status: this.checkList,
                searchString: this.searchRightKey,
                templateId: this.msgType,
                msgVersion: this.msgVersions,
                msgOrganization: this.msgOrganizations
              }
            ]
          }).then(res => {
            console.log('数据采集res', res)
            if (res.body.meta.statusCode == '200') {
              res.body.data.list.forEach((item, index) => {
                this.dataTableData[index].DATASTATUS = item.DATASTATUS
                this.dataTableData[index].LOGSTATUS = item.LOGSTATUS
                this.dataTableData[index].errorCount = item.errorCount
                this.dataTableData[index].totalCount = item.totalCount
                this.dataTableData[index].compressSpeed = item.compressSpeed
              })
              // this.dataTableData = res.body.data.list

              // if (this.dataTableData.length > 0) {
              //   this.isBlue = true
              // }
              this.pagination.totalNum = res.body.data.total
            } else {
              this.$message({
                message: '请先选择消息模型',
                duration: '2000 ',
                type: 'error'
              })
              return false
            }
          })
        },

        limitInput (value) {
          console.log('限制value', value)
          // 数据采集
          if (this.addDataDialogVisible) {
            this.addDataDialogForm.total = value.replace(/[^0-9]/g, '')
            if (value > 1000) {
              this.addDataDialogForm.total = 1000
            }
          }
          if (this.updateDataDialogVisible) {
            this.updateDataDialogForm.TOTAL = value.replace(/[^0-9]/g, '')
            if (value > 1000) {
              this.updateDataDialogForm.TOTAL = 1000
            }
          }
        },
        // 日志代码长度限制
        limitEtlTaskCode (value) {
          this.addLogDialogForm.etlTaskCode = value.replace(/[^\w+$]/g, '')
        },

        // 日志采集
        limitLogInput (value) {
          console.log('日志上限e', value)
          // 日志采集
          if (this.addLogDialogVisible) {
            this.addLogDialogForm.limitCount = value.replace(/[^0-9]/g, '')
            if (Number(value) > 100000000) {
              this.addLogDialogForm.limitCount = 100000000
            }
          }
          if (this.updateLogDialogVisible) {
            this.updateLogDialogForm.LIMITCOUNT = value.replace(/[^0-9]/g, '')
            if (Number(value) > 100000000) {
              this.updateLogDialogForm.LIMITCOUNT = 100000000
            }
          }
        },

        selectFilter (e) {
          if (this.addDataDialogVisible) {
            this.addDataDialogForm.cron = e
          }

          if (this.updateDataDialogVisible) {
            this.updateDataDialogForm.CRON = e
          }
        },

        changeStatus (value) {
          console.log('哈哈哈value', value)
          this.checkList = value
          if (this.isLogOrData) {
            this.getLogCollectQueryList()
          } else if (!this.isLogOrData) {
            this.getDataCollectQueryTaskList()
          }
        },

        // 获取指定 Compress 的接口
        getCompressData () {
          $ajax({
            url: 'api/etl_mcentre.onLineServerRpcService/getAllServer',
            jsonData: []
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              res.body.data.compress.forEach(items => {
                if (!this.compress.some(item => item.id == items.id)) {
                  this.compress.push(items)
                }
              })
              console.log('this.compress', this.compress)
            }
          })
        },
        /**
         * @desc 获取策略配置列表
         * @param {Int} currPage 当前页
         * @param {Int} pageSize 每页显示记录数
         * @returns
         */
        getStrategyConfigList () {
          $ajax({
            url: 'api/etl_mcentre.strategyRpcService/getStrategyList',
            jsonData: [
              {
                currPage: 1,
                pageSize: 10
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.implementStrategies = res.body.data.rows
            }
          })
        },
        // 选择执行策略
        selectScriptExpression (value) {
          console.log('value', value)
          let corns = this.implementStrategies.filter(
            item => item.expression == value
          )
          if (this.addLogDialogVisible) {
            this.addLogDialogForm.cron = corns[0].expression
          }
          if (this.updateLogDialogVisible) {
            this.updateLogDialogForm.CRON = corns[0].expression
          }
          if (this.addDataDialogVisible) {
            this.addDataDialogForm.cron = corns[0].expression
          }
          if (this.updateDataDialogVisible) {
            this.updateDataDialogForm.CRON = corns[0].expression
            console.log('corns', corns)
          }
          if (this.isShowBatchEditScript) {
            this.batchEditDialogForm.cron = corns[0].expression
          }
        },
        uploadDataListChange (val) {
          console.log('新增数据采集val', val)
          this.$refs.selectTreesa[0].blur()
        },
        /**
         * @desc 新增数据采集
         * @param {string} name 任务名称
         * @param {string} templateId 模板id
         * @param {string} templateName 模板名称
         * @param {string} etlTaskCode ETL任务号
         * @param {string} authorOrganization 机构代码
         * @param {string} authorOrganizationName 机构名称
         * @param {Int} catalogId 脚本目录id(非必须)
         * @param {string} catalogName 脚本目录名称(非必须)
         * @param {Int} total 日志获取数量
         * @param {string} logOrder 0:正序 1:倒序 默认0(非必须)
         * @param {string} cron Cron采集表达式
         * @param {string} outPutMode 输出接口 1:前置机 2:集成平台
         * @param {string} platformInterface 指定要输出的集成平台接口(非必须) 当 outPutMode为2时必传
         * @param {string} adapterInterface 指定要输出的前置机接口(非必须) outPutMode为1前置机必传 默认cdr
         * @param {string} formateBsXml 是否格式化xml(非必须)
         * @param {Int} decompressPriority 解包优先级(非必须)
         * @param {string} compressInterface 指定用来采集数据的压包接口(非必须)
         * @param {Array<Object>} cdrConfig
         */
        createDataCollectTask () {
          console.log(
            '保存this.addDataDialogForm.cdrConfig',
            this.addDataDialogForm.cdrConfig
          )
          // debugger
          if (
            !this.addDataDialogForm.templateId ||
            !this.addDataDialogForm.authorOrganization
          ) {
            this.$message({
              message: '机构代码或模板不能为空',
              duration: '2000 ',
              type: 'warning'
            })
            return false
          }
          if (this.addDataDialogForm.name === '') {
            this.$message({
              message: '任务名称不能为空',
              duration: '2000 ',
              type: 'error'
            })
            return false
          }
          if (
            this.addDataDialogForm.outPutMode == '2' &&
            this.addDataDialogForm.platformInterface == ''
          ) {
            this.$message({
              message: '接口名不能为空',
              duration: '2000 ',
              type: 'warning'
            })
            return false
          }
          if (
            this.addDataDialogForm.outPutMode == '1' &&
            this.addDataDialogForm.cdrConfig.some(item => !item.cdrCode)
          ) {
            this.$message({
              message: '数据库不能为空',
              duration: '2000 ',
              type: 'warning'
            })
            return false
          }

          if (
            this.addDataDialogForm.cdrConfig[0].config[0].isStandard === '' &&
            this.addDataDialogForm.cdrConfig[0].config[1].isStandard === ''
          ) {
            this.$message.error('业务BSXML或标准BSXML至少有一个勾选')
            return false
          }
          let me = this
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/createTask',
            jsonData: [
              {
                ...this.addDataDialogForm,
                // text: this.uploadDataObj.text,
                total: Number(this.addDataDialogForm.total),
                msgVersion: this.msgVersions,
                organize: this.msgOrganizations,
                decompressPriority: Number(
                  this.addDataDialogForm.decompressPriority
                ),
                compressInterface:
                  this.addDataDialogForm.compressInterface == '随机'
                    ? '0'
                    : this.addDataDialogForm.compressInterface
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              me.$message({
                message: '新增成功',
                duration: '2000 ',
                type: 'success'
              })
              me.getDataCollectQueryTaskList()
              me.getAllTotal()
              this.addDataDialogVisible = false
            } else {
              me.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
            console.log('新增数据采集 res', res)
            this.addDataDialogForm.cdrConfig.forEach(item => {
              item.cdrCode = ''
            })
          })
        },

        getFirstGroup1 (value, index) {
          console.log('value', value)
          console.log('index', index)
          // return

          if (this.addDataDialogVisible) {
            // debugger
            if (!value.includes('业务BSXML：')) {
              this.notHasStandard = true
              this.addDatabaseCheckList1 = []
              this.addDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '',
                checkBsXml: '',
                dictionaryChange: ''
              }
            } else {
              this.notHasStandard = false
            }
            // 0 0 0
            if (
              value.includes('业务BSXML：') &&
              !value.includes('字典翻转') &&
              !value.includes('模板校验')
            ) {
              this.addDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '0',
                checkBsXml: '0',
                dictionaryChange: '0'
              }
            }
            // 0 0 1
            if (
              value.includes('业务BSXML：') &&
              value.includes('字典翻转') &&
              !value.includes('模板校验')
            ) {
              this.addDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '0',
                checkBsXml: '0',
                dictionaryChange: '1'
              }
            }

            // 0 1 0
            if (
              value.includes('业务BSXML：') &&
              !value.includes('字典翻转') &&
              value.includes('模板校验')
            ) {
              this.addDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '0',
                checkBsXml: '1',
                dictionaryChange: '0'
              }
            }

            // 0 1 1
            if (
              value.includes('业务BSXML：') &&
              value.includes('字典翻转') &&
              value.includes('模板校验')
            ) {
              this.addDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '0',
                checkBsXml: '1',
                dictionaryChange: '1'
              }
            }
          }
        },
        getFirstGroup2 (value, index) {
          console.log('value', value)

          if (this.addDataDialogVisible) {
            // ''
            if (!value.includes('标准BSXML：')) {
              this.addDatabaseCheckList2 = []
              this.addDataDialogForm.cdrConfig[index].config[0] = {
                isStandard: '',
                checkBsXml: '',
                dictionaryChange: ''
              }
            } else {
              this.addDatabaseCheckList2 = [
                '标准BSXML：',
                '模板校验',
                '字典翻转'
              ]
            }
            // 1 1 1
            if (
              value.includes('标准BSXML：') &&
              value.includes('模板校验') &&
              value.includes('字典翻转')
            ) {
              this.addDataDialogForm.cdrConfig[index].config[0] = {
                isStandard: '1',
                checkBsXml: '1',
                dictionaryChange: '1'
              }
            }
          }
        },
        getFirstGroup3 (value, index) {
          console.log('value', value)
          if (this.updateDataDialogForm.cdrConfig[index].config.length > 1) {
            if (!value.includes('业务BSXML：')) {
              this.hasNoEchoStandard = true
              this.echoDatabaseCheckList1 = []

              this.updateDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '',
                checkBsXml: '',
                dictionaryChange: ''
              }
            } else {
              this.hasNoEchoStandard = false
            }
            // 0 0 0
            if (
              value.includes('业务BSXML：') &&
              !value.includes('字典翻转') &&
              !value.includes('模板校验')
            ) {
              this.updateDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '0',
                checkBsXml: '0',
                dictionaryChange: '0'
              }
            }
            // 0 0 1
            if (
              value.includes('业务BSXML：') &&
              value.includes('字典翻转') &&
              !value.includes('模板校验')
            ) {
              this.updateDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '0',
                checkBsXml: '0',
                dictionaryChange: '1'
              }
            }
            // 0 1 0
            if (
              value.includes('业务BSXML：') &&
              !value.includes('字典翻转') &&
              value.includes('模板校验')
            ) {
              this.updateDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '0',
                checkBsXml: '1',
                dictionaryChange: '0'
              }
            }
            // 0 1 1
            if (
              value.includes('业务BSXML：') &&
              value.includes('字典翻转') &&
              value.includes('模板校验')
            ) {
              this.updateDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '0',
                checkBsXml: '1',
                dictionaryChange: '1'
              }
            }
          } else {
            if (!value.includes('业务BSXML：')) {
              this.hasNoEchoStandard = true
              this.echoDatabaseCheckList1 = []
              this.updateDataDialogForm.cdrConfig[index].config[0] = {
                isStandard: '',
                checkBsXml: '',
                dictionaryChange: ''
              }
            } else {
              this.hasNoEchoStandard = false
            }
            // 0 0 0
            if (
              value.includes('业务BSXML：') &&
              !value.includes('字典翻转') &&
              !value.includes('模板校验')
            ) {
              this.updateDataDialogForm.cdrConfig[index].config[0] = {
                isStandard: '0',
                checkBsXml: '0',
                dictionaryChange: '0'
              }
            }
            // 0 0 1
            if (
              value.includes('业务BSXML：') &&
              value.includes('字典翻转') &&
              !value.includes('模板校验')
            ) {
              this.updateDataDialogForm.cdrConfig[index].config[0] = {
                isStandard: '0',
                checkBsXml: '0',
                dictionaryChange: '1'
              }
            }
            // 0 1 0
            if (
              value.includes('业务BSXML：') &&
              !value.includes('字典翻转') &&
              value.includes('模板校验')
            ) {
              this.updateDataDialogForm.cdrConfig[index].config[0] = {
                isStandard: '0',
                checkBsXml: '1',
                dictionaryChange: '0'
              }
            }
            // 0 1 1
            if (
              value.includes('业务BSXML：') &&
              value.includes('字典翻转') &&
              value.includes('模板校验')
            ) {
              this.updateDataDialogForm.cdrConfig[index].config[0] = {
                isStandard: '0',
                checkBsXml: '1',
                dictionaryChange: '1'
              }
            }
          }
        },
        getFirstGroup4 (value, index) {
          console.log('value', value)
          if (this.updateDataDialogForm.cdrConfig[index].config.length > 1) {
            // ''
            if (!value.includes('标准BSXML：')) {
              this.echoDatabaseCheckList2 = []
              this.addDataDialogForm.cdrConfig[index].config[1] = {
                isStandard: '',
                checkBsXml: '',
                dictionaryChange: ''
              }
            } else {
              this.echoDatabaseCheckList2 = [
                '标准BSXML：',
                '模板校验',
                '字典翻转'
              ]
            }
            // 1 1 1
            if (
              value.includes('标准BSXML：') &&
              value.includes('模板校验') &&
              value.includes('字典翻转')
            ) {
              this.updateDataDialogForm.cdrConfig[index].config[0] = {
                isStandard: '1',
                checkBsXml: '1',
                dictionaryChange: '1'
              }
            }
          } else {
            if (!value.includes('标准BSXML：')) {
              this.echoDatabaseCheckList2 = []
              this.addDataDialogForm.cdrConfig[index].config[0] = {
                isStandard: '',
                checkBsXml: '',
                dictionaryChange: ''
              }
            } else {
              this.echoDatabaseCheckList2 = [
                '标准BSXML：',
                '模板校验',
                '字典翻转'
              ]
            }
          }
        },
        // getFirstGroup3 (value, index) {
        //   console.log('value', value)
        //   console.log('index', index)
        //   // return

        //   if (!value.includes('业务BSXML：')) {
        //     this.hasNoEchoStandard = true
        //     this.updateDataDialogForm.cdrConfig[index].config[1] = {
        //       isStandard: '',
        //       checkBsXml: '',
        //       dictionaryChange: ''
        //     }
        //   } else {
        //     this.hasNoEchoStandard = false
        //   }
        //   // 0 0 0
        //   if (
        //     value.includes('业务BSXML：') &&
        //     !value.includes('字典翻转') &&
        //     !value.includes('模板校验')
        //   ) {
        //     this.updateDataDialogForm.cdrConfig[index].config[1] = {
        //       isStandard: '0',
        //       checkBsXml: '0',
        //       dictionaryChange: '0'
        //     }
        //   }
        //   // 0 0 1
        //   if (
        //     value.includes('业务BSXML：') &&
        //     value.includes('字典翻转') &&
        //     !value.includes('模板校验')
        //   ) {
        //     this.updateDataDialogForm.cdrConfig[index].config[1] = {
        //       isStandard: '0',
        //       checkBsXml: '0',
        //       dictionaryChange: '1'
        //     }
        //   }

        //   // 0 1 0
        //   if (
        //     value.includes('业务BSXML：') &&
        //     !value.includes('字典翻转') &&
        //     value.includes('模板校验')
        //   ) {
        //     this.updateDataDialogForm.cdrConfig[index].config[1] = {
        //       isStandard: '0',
        //       checkBsXml: '1',
        //       dictionaryChange: '0'
        //     }
        //   }

        //   // 0 1 1
        //   if (
        //     value.includes('业务BSXML：') &&
        //     value.includes('字典翻转') &&
        //     value.includes('模板校验')
        //   ) {
        //     this.updateDataDialogForm.cdrConfig[index].config[1] = {
        //       isStandard: '0',
        //       checkBsXml: '1',
        //       dictionaryChange: '1'
        //     }
        //   }
        // },
        // getFirstGroup4 (value, index) {
        //   console.log('value', value)

        //   if (!value.includes('标准BSXML：')) {
        //     this.updateDataDialogForm.cdrConfig[index].config[0] = {
        //       isStandard: '',
        //       checkBsXml: '',
        //       dictionaryChange: ''
        //     }
        //   }
        //   // 1 1 1
        //   if (
        //     value.includes('标准BSXML：') &&
        //     value.includes('模板校验') &&
        //     value.includes('字典翻转')
        //   ) {
        //     this.updateDataDialogForm.cdrConfig[index].config[0] = {
        //       isStandard: '1',
        //       checkBsXml: '1',
        //       dictionaryChange: '1'
        //     }
        //   }
        // },
        // 数据库上传
        addNewTable () {
          if (this.addDataDialogVisible) {
            let obj = {
              cdrCode: '',
              text: '',
              config: [
                {
                  isStandard: '1',
                  checkBsXml: '1',
                  dictionaryChange: '1'
                },
                {
                  isStandard: '0',
                  checkBsXml: '0',
                  dictionaryChange: '0'
                }
              ]
            }
            JSON.parse(JSON.stringify(obj))
            this.addDataDialogForm.cdrConfig.push(
              JSON.parse(JSON.stringify(obj))
            )
            // console.log();
            this.addDatabaseCheckListAll.push({
              first: ['业务BSXML：'],
              last: ['标准BSXML：', '模板校验', '字典翻转']
            })
          }
          if (this.updateDataDialogVisible) {
            this.updateDataDialogForm.cdrConfig.push({
              cdrCode: '',
              text: '',
              config: [
                {
                  isStandard: '1',
                  checkBsXml: '1',
                  dictionaryChange: '1'
                },
                {
                  isStandard: '0',
                  checkBsXml: '0',
                  dictionaryChange: '0'
                }
              ]
            })
            this.updateDatabaseCheckListAll.push({
              first: ['业务BSXML：'],
              last: ['标准BSXML：', '模板校验', '字典翻转']
            })
          }
        },
        deleteTableData (index) {
          if (this.addDataDialogVisible) {
            if (this.addDataDialogForm.cdrConfig.length == 1) {
              this.$message.error('至少有一条数据')
              return false
            } else {
              this.addDataDialogForm.cdrConfig.splice(index, 1)
            }
          }

          if (this.updateDataDialogVisible) {
            if (this.updateDataDialogForm.cdrConfig.length == 1) {
              this.$message.error('至少有一条数据')
              return false
            } else {
              this.updateDataDialogForm.cdrConfig.splice(index, 1)
            }
          }
        },

        // 单击表格行
        clickDataRow (row) {
          console.log('日志采集row', row)
          this.rowDataCollect = row
          // this.rowDataCollectCopy = JSON.parse(JSON.stringify(row))
          this.IDS = row.ID
          this.logDataId = row.LOGID
          this.selectId = row.index
          this.getDataToPage(JSON.parse(JSON.stringify(row)))
        },

        rowStyle ({ row, rowIndex }) {
          if (this.selectId === rowIndex) {
            return {
              'background-color': '#CAE1FF',
              cursor: 'pointer'
            }
          } else {
            return {
              cursor: 'pointer'
            }
          }
        },
        tableRowClassName ({ row, rowIndex }) {
          row.index = rowIndex
        },

        // 双击表格行
        clickDoubleDataRow (row) {
          this.getDataToPage(JSON.parse(JSON.stringify(row)))
          this.updateLog()
        },

        // 数据回显函数
        getDataToPage (obj) {
          // debugger
          var val = [obj]
          this.rowDataCollectCopy = JSON.parse(JSON.stringify(val[0]))
          console.log('数据回显函数val', val)
          if (this.isLogOrData) {
            this.selectionLogCollect = val
            if (val[0].LOGSTATUS >= 0) {
              val && val[0]
                ? (this.updateLogDialogForm = val[0])
                : this.updateLogDialogForm
              if (val.length > 0) {
                val.forEach(item => {
                  this.updateLogDialogForm = item
                  if (item.COMPRESSINTERFACE == '0') {
                    this.updateDataDialogForm.COMPRESSINTERFACE = '0'
                  }
                })
              }
            } else {
              this.addLogDialogForm.name = val[0].NAME
              this.addLogDialogForm.etlTaskCode = val[0].ETLTASKCODE
              // this.configCode = true
            }
          }

          if (!this.isLogOrData) {
            this.updateDatabaseCheckListAll = [
              {
                first: [],
                last: []
              }
            ]

            this.selectionChangeData = val
            if (val[0].DATASTATUS >= 0) {
              val && val[0]
                ? (this.updateDataDialogForm = val[0])
                : this.updateDataDialogForm
              if (val.length > 0) {
                val.forEach(item => {
                  if (item.hasOwnProperty('cdrConfig')) {
                    this.updateDataDialogForm = item
                    if (item.COMPRESSINTERFACE == '0') {
                      this.updateDataDialogForm.COMPRESSINTERFACE = '随机'
                    }
                    this.datasourceId = val[0].cdrConfig[0].cdrCode
                  }
                })

                if (val[0] && val[0].cdrConfig && val[0].cdrConfig.length > 0) {
                  val[0].cdrConfig.forEach(items => {
                    let objNews = {}
                    if (items.config.length > 1) {
                      this.hasNoEchoStandard = false
                      // debugger
                      items.config.forEach(item => {
                        if (item.isStandard === '1') {
                          objNews.last = ['标准BSXML：', '模板校验', '字典翻转']
                        }

                        if (item.isStandard === '0') {
                          if (
                            item.checkBsXml === '0' &&
                            item.dictionaryChange === '0'
                          ) {
                            objNews.first = ['业务BSXML：']
                          }
                          if (
                            item.checkBsXml === '0' &&
                            item.dictionaryChange === '1'
                          ) {
                            objNews.first = ['业务BSXML：', '字典翻转']
                          }
                          if (
                            item.checkBsXml === '1' &&
                            item.dictionaryChange === '0'
                          ) {
                            objNews.first = ['业务BSXML：', '模板校验']
                          }
                          if (
                            item.checkBsXml === '1' &&
                            item.dictionaryChange === '1'
                          ) {
                            objNews.first = [
                              '业务BSXML：',
                              '模板校验',
                              '字典翻转'
                            ]
                          }
                        }
                      })
                      // debugger
                      this.updateDatabaseCheckListAll.push(objNews)
                      console.log(
                        ' this.updateDatabaseCheckListAll',
                        this.updateDatabaseCheckListAll
                      )
                    }
                    if (items.config.length == 1) {
                      if (items.config[0].isStandard === '1') {
                        objNews.last = ['标准BSXML：', '模板校验', '字典翻转']
                        objNews.first = []
                      }
                      if (items.config[0].isStandard === '0') {
                        if (
                          items.config[0].checkBsXml === '0' &&
                          items.config[0].dictionaryChange === '0'
                        ) {
                          objNews.first = ['业务BSXML：']
                        }
                        if (
                          items.config[0].checkBsXml === '0' &&
                          items.config[0].dictionaryChange === '1'
                        ) {
                          objNews.first = ['业务BSXML：', '字典翻转']
                        }
                        if (
                          items.config[0].checkBsXml === '1' &&
                          items.config[0].dictionaryChange === '0'
                        ) {
                          objNews.first = ['业务BSXML：', '模板校验']
                        }
                        if (
                          items.config[0].checkBsXml === '1' &&
                          items.config[0].dictionaryChange === '1'
                        ) {
                          objNews.first = [
                            '业务BSXML：',
                            '模板校验',
                            '字典翻转'
                          ]
                        }
                        objNews.last = []
                      }
                    }
                  })
                  if (this.updateDatabaseCheckListAll.length > 1) {
                    this.updateDatabaseCheckListAll.splice(0, 1)
                  }
                }
              }
            } else {
              this.addDataDialogForm.name = val[0].NAME
              this.addDataDialogForm.etlTaskCode = val[0].ETLTASKCODE
            }
          }

          if (this.logLibraryDialogVisible) {
            this.logIds = []
            this.selectionChangeData.forEach(item => {
              this.logIds.push(item.LOGID)
            })
          } else if (this.frontLibraryDialogVisible) {
            this.frontId = obj.id
            this.queryFrontLibraryDataDetail(this.frontData)
          }
        },

        /**
         * @desc 更新数据采集
         * @param {Int} logTaskId
         * @param {Int} catalogId
         * @param {string} catalogName
         * @param {Int} total
         * @param {string} logOrder
         * @param {string} cron
         * @param {string} platformInterface
         * @param {string} adapterInterface
         * @param {string} formateBsXml
         * @param {Int} decompressPriority
         * @param {string} compressInterface
         * @param {Array<Object>} cdrConfig
         */
        updateDataCollectTask () {
          if (
            !this.updateDataDialogForm.NAME ||
            this.updateDataDialogForm.NAME === ''
          ) {
            this.$message({
              message: '任务名称不能为空',
              duration: '2000 ',
              type: 'error'
            })
            return false
          }
          if (
            this.updateDataDialogForm.OUTPUTMODE == '2' &&
            this.updateDataDialogForm.INTERFACE == ''
          ) {
            this.$message({
              message: '接口名不能为空',
              duration: '2000 ',
              type: 'warning'
            })
            return false
          }
          if (
            this.updateDataDialogForm.OUTPUTMODE == '1' &&
            this.updateDataDialogForm.cdrConfig.some(item => !item.cdrCode)
          ) {
            this.$message({
              message: '数据库不能为空',
              duration: '2000 ',
              type: 'warning'
            })
            return false
          }
          if (
            this.updateDataDialogForm.cdrConfig[0].config[0].isStandard ===
              '' &&
            this.updateDataDialogForm.cdrConfig[0].config[1].isStandard === ''
          ) {
            this.$message.error('业务BSXML或标准BSXML至少有一个勾选')
            return false
          }
          console.log(
            'this.updateDataDialogForm.cdrConfig22',
            this.updateDataDialogForm.cdrConfig
          )
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/updateTask',
            jsonData: [
              {
                logTaskId: this.updateDataDialogForm.ID,
                text: this.logDataSourceIdName,
                name: this.updateDataDialogForm.NAME,
                catalogId: this.updateDataDialogForm.CATALOGID,
                catalogName: this.updateDataDialogForm.CATALOGNAME,
                total: Number(this.updateDataDialogForm.TOTAL),
                logOrder: this.updateDataDialogForm.LOGORDER,
                cron: this.updateDataDialogForm.CRON,
                outPutMode: this.updateDataDialogForm.OUTPUTMODE,
                platformInterface:
                  this.updateDataDialogForm.OUTPUTMODE == '1'
                    ? ''
                    : this.updateDataDialogForm.INTERFACE,
                adapterInterface:
                  this.updateDataDialogForm.OUTPUTMODE == '1'
                    ? this.updateDataDialogForm.INTERFACE
                    : '',
                formateBsXml: this.updateDataDialogForm.FORMATEBSXML,
                decompressPriority: Number(
                  this.updateDataDialogForm.DECOMPRESSPRIORITY
                ),
                compressInterface:
                  this.updateDataDialogForm.COMPRESSINTERFACE == '随机'
                    ? '0'
                    : this.updateDataDialogForm.COMPRESSINTERFACE,
                cdrConfig: this.updateDataDialogForm.cdrConfig,
                taskStatus: this.updateDataDialogForm.DATASTATUS
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.getDataCollectQueryTaskList()
              this.updateDataDialogVisible = false
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        // 提示
        tipsClick () {
          console.log('提示this.rowDataCollect', this.rowDataCollect)
          if (
            (this.selectionLogCollect.length > 0 ||
              this.selectionChangeData.length > 0) &&
            JSON.stringify(this.rowDataCollect) === '{}'
          ) {
            this.tipsDialogVisible = true
          } else {
            this.$message.error('请先勾选一条采集任务')
            return false
          }
        },
        // 删除采集任务
        deleteDataCollectTasks () {
          if (this.isLogOrData) {
            this.deleteLogCollect()
          }
          if (!this.isLogOrData) {
            this.deleteDataCollectTask()
          }
        },

        /**
         * @desc 删除日志采集
         * @param {Int} logId 日志采集任务id
         * @param {Int} taskId 任务id
         */
        deleteLogCollect () {
          console.log(
            '删除日志采集this.selectionChangeData',
            this.selectionLogCollect
          )
          if (this.selectionLogCollect.length <= 0) {
            return false
          }
          let taskIdS = []
          this.selectionLogCollect.forEach(item => taskIdS.push(item.ID))
          let logIdS = []
          this.selectionLogCollect.forEach(item => logIdS.push(item.LOGID))
          $ajax({
            url: 'api/etl_mcentre.logTaskManageRpcService/deleteLogTask',
            jsonData: [
              {
                logId: logIdS,
                taskId: taskIdS
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.tipsDialogVisible = false
              this.getLogCollectQueryList()
              this.getAllTotal()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        /**
         * @desc 删除数据采集任务
         * @param {Int} logTaskId 任务名称 查询列表接口(queryTaskList)返回的id
         */
        deleteDataCollectTask () {
          this.tipsDialogVisible = false
          if (this.selectionChangeData.length <= 0) {
            return false
          }
          let IDList = []
          this.selectionChangeData.forEach(item => IDList.push(item.ID))
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/deleteTask',
            jsonData: [
              {
                logTaskId: IDList
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.getDataCollectQueryTaskList()
              this.getAllTotal()
              this.tipsDialogVisible = false
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
            this.tipsDialogVisible = false
          })
        },

        // 数据全部启动
        startDataAll () {
          if (this.dataTableData.length > 0) {
            this.selectionChangeData = this.dataTableData.filter(
              item => item.CONFIGID
            )
            this.startDataCollectTask()
          } else {
            this.$message.error('请先选择一条采集任务')
            return false
          }
        },
        // 日志全部暂停
        pauseDataAll () {
          if (this.dataTableData.length > 0) {
            this.selectionChangeData = this.dataTableData.filter(
              item => item.CONFIGID
            )
            this.pauseDataCollectTask()
          } else {
            this.$message.error('请先选择一条采集任务')
            return false
          }
        },
        // 日志全部停止
        stopDataAll () {
          if (this.dataTableData.length > 0) {
            this.selectionChangeData = this.dataTableData.filter(
              item => item.CONFIGID
            )
            this.stopDataCollectTask()
          } else {
            this.$message.error('请先选择一条采集任务')
            return false
          }
        },
        /**
         * @desc 开启数据采集任务
         * @param {Array<Int>} logTaskId 任务名称 查询列表接口(queryTaskList)返回的id
         */
        startDataCollectTask () {
          if (this.selectionChangeData.length <= 0) {
            this.$message.error('请先选择一条采集任务')
            return false
          } else {
            let IDList = []
            this.selectionChangeData.forEach(item => IDList.push(item.CONFIGID))
            $ajax({
              url: 'api/etl_mcentre.dataTaskManageRpcService/startTask',
              jsonData: [
                {
                  configId: IDList
                }
              ]
            }).then(res => {
              if (res.body.meta.statusCode == '200') {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'success'
                })
                this.getDataCollectQueryTaskList()
                this.getAllTotal()
              } else {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'error'
                })
              }
            })
          }
        },

        /**
         * @desc 暂停数据采集任务
         * @param {Array<Int>} logTaskId 任务名称 查询列表接口(queryTaskList)返回的id
         */
        pauseDataCollectTask () {
          if (this.selectionChangeData.length <= 0) {
            this.$message.error('请先选择一条采集任务')
            return false
          } else {
            let IDList = []
            this.selectionChangeData.forEach(item => IDList.push(item.CONFIGID))
            $ajax({
              url: 'api/etl_mcentre.dataTaskManageRpcService/stopTask',
              jsonData: [
                {
                  configId: IDList
                }
              ]
            }).then(res => {
              if (res.body.meta.statusCode == '200') {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'success'
                })
                this.getDataCollectQueryTaskList()
                this.getAllTotal()
              } else {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'error'
                })
              }
            })
          }
        },

        /**
         * @desc 停止数据采集任务
         * @param {Array<Int>} logTaskId 任务名称 查询列表接口(queryTaskList)返回的id
         */
        stopDataCollectTask () {
          if (this.selectionChangeData.length <= 0) {
            this.$message.error('请先选择一条采集任务')
            return false
          } else {
            let IDList = []
            this.selectionChangeData.forEach(item => IDList.push(item.CONFIGID))
            $ajax({
              url: 'api/etl_mcentre.dataTaskManageRpcService/resetTask',
              jsonData: [
                {
                  configId: IDList
                }
              ]
            }).then(res => {
              if (res.body.meta.statusCode == '200') {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'success'
                })
                this.getDataCollectQueryTaskList()
                this.getAllTotal()
              } else {
                this.$message({
                  message: res.body.meta.message,
                  duration: '2000 ',
                  type: 'error'
                })
              }
            })
          }
        },

        /**
         * @desc 跳转至数据采集脚本配置页面
         */
        getFullScreen (e) {
          console.log('执行脚本e', e)
          // this.fullDialogVisible = true
          this.logLibraryDialogVisible = false
          this.isScreenFull = false
          this.toScriptData = e
          this.sonValue = this.value
          if (e.hasOwnProperty('SCRIPTNAME') && !e.dataCollectionScriptName) {
            this.scriptNames = e.SCRIPTNAME
          }
          if (
            !e.hasOwnProperty('SCRIPTNAME') ||
            (e.hasOwnProperty('SCRIPTNAME') && e.dataCollectionScriptName)
          ) {
            this.scriptNames = e.dataCollectionScriptName
          }
          this.$nextTick(() => {
            console.log('跳转至数据采集脚本配置页面e', this.$refs.childCollect)
            this.$refs.childCollect.formInline.catalogName = e.hasOwnProperty(
              'SCRIPTNAME'
            )
              ? e.SCRIPTNAME
              : e.dataCollectionScriptName
            this.$refs.childCollect.getRightTreeData()
            this.$refs.childCollect.getCataLogId()
            this.$refs.childCollect.getLogDataSourceId()
            this.$refs.childCollect.isScriptShow = false
            if (
              !e.hasOwnProperty('SCRIPTNAME') &&
              !e.hasOwnProperty('dataCollectionScriptName')
            ) {
              this.$refs.childCollect.formInline.catalogName = ''
            }
            this.$refs.childCollect.formInline.dataCollectScriptName = ''
            if (this.$refs.childCollect.ruleForm.dataOrigin === undefined) {
              this.$refs.childCollect.logDataSourceIdName = ''
            }
          })
        },
        // 日志库
        // 点击日志库左侧
        clickLogType (value, index) {
          console.log('点击日志库左侧', index)
          this.currentIndex = index
          this.processFlag = value.PROCESSFLAG
          console.log('this.processFlag', this.processFlag)
          this.paginationLogLibrary.currentPage = 1
          console.log('点击this.ErrorData', this.ErrorData)
          this.queryLogErrorInformation()
        },
        changeLogOrganization (val) {
          // debugger
          console.log('val', val)
          this.logTaskTableName = val
          this.errorDetail = ''
          $ajax({
            url:
              'api/etl_mcentre.businessLogRpcService/countBusinessLogByProcessFlag',
            jsonData: [
              {
                tableName: val
              }
            ]
          }).then(res => {
            console.log('查询日志库错误列表res', res)
            if (res.body.meta.statusCode == '200') {
              this.logLibraryErrorList = res.body.data

              if (this.logLibraryErrorList.list.length <= 0) {
                this.logListData = []
                this.paginationLogLibrary.currentPage = 1
                this.paginationLogLibrary.pageSize = 10
                this.paginationLogLibrary.totalNum = 0
              }
              this.processFlag =
                this.logLibraryErrorList.list.length > 0
                  ? this.logLibraryErrorList.list[0].PROCESSFLAG
                  : ''
              this.queryLogErrorInformation()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        // 日志库 根据机构代码获取该机构下的所有任务名称
        getAllTaskNames (code) {
          $ajax({
            url:
              'api/etl_mcentre.logTaskManageRpcService/queryLogTaskListByOrgCode',
            jsonData: [
              {
                authorOrganization: code
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.allTaskNameList = res.body.data
              console.log('this.allTaskNameList', this.allTaskNameList)
              if (this.allTaskNameList.length > 0) {
                // debugger
                console.log('this.ErrorData', this.ErrorData)
                if (this.ErrorData && this.ErrorData.$rows >= 0) {
                  this.logLibraryForm.taskName =
                    this.ErrorData.NAME +
                    '(' +
                    this.ErrorData.ETLTASKCODE +
                    ')' +
                    '    ' +
                    this.ErrorData.errorCount +
                    '/' +
                    this.ErrorData.totalCount
                  this.logTaskTableName = this.ErrorData.LOGTABLENAME
                  console.log('this.logTaskTableName11', this.logTaskTableName)
                } else {
                  this.logLibraryForm.taskName =
                    this.allTaskNameList[0].NAME +
                    '(' +
                    this.allTaskNameList[0].ETLTASKCODE +
                    ')' +
                    '    ' +
                    this.allTaskNameList[0].errorCount +
                    '/' +
                    this.allTaskNameList[0].totalCount
                  this.logTaskTableName = this.logTaskTableName
                    ? this.logTaskTableName
                    : this.allTaskNameList[0].LOGTABLENAME
                  console.log('this.logTaskTableName22', this.logTaskTableName)
                }

                this.getLobData()
              } else {
                this.logLibraryForm.taskName = ''
                this.logTaskTableName = ''
                this.logLibraryErrorList.list = []
                this.logLibraryErrorList.totalErrorCount = 0
                this.logLibraryErrorList.totalCount = 0
                this.paginationLogLibrary.totalNum = 0
                this.logListData = []
              }
              console.log('日志库this.logTaskTableName', this.logTaskTableName)
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        // 数据库 根据机构代码获取该机构下的所有任务名称
        getAllTaskNamesBydata (code) {
          $ajax({
            url:
              'api/etl_mcentre.dataTaskManageRpcService/queryTaskListByOrgCode',
            jsonData: [
              {
                authorOrganization: code
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.allTaskNameList = res.body.data
              if (this.allTaskNameList.length > 0) {
                if (this.ErrorData.index >= 0) {
                  this.logLibraryForm.taskName =
                    this.ErrorData.NAME +
                    '(' +
                    this.ErrorData.ETLTASKCODE +
                    ')' +
                    '    ' +
                    this.ErrorData.errorCount +
                    '/' +
                    this.ErrorData.totalCount
                  this.logTaskTableName = this.ErrorData.LOGTABLENAME
                } else {
                  this.logLibraryForm.taskName =
                    this.allTaskNameList[0].NAME +
                    '(' +
                    this.allTaskNameList[0].ETLTASKCODE +
                    ')' +
                    '    ' +
                    this.allTaskNameList[0].errorCount +
                    '/' +
                    this.allTaskNameList[0].totalCount
                  this.logTaskTableName = this.logTaskTableName
                    ? this.logTaskTableName
                    : this.allTaskNameList[0].LOGTABLENAME
                  // this.logTaskTableName = this.allTaskNameList[0].LOGTABLENAME
                }
                this.getLobData()
              } else {
                this.logLibraryForm.taskName = ''
                this.logLibraryErrorList.list = []
                this.logLibraryErrorList.totalErrorCount = 0
                this.logLibraryErrorList.totalCount = 0
                this.paginationLogLibrary.totalNum = 0
                this.logListData = []
              }
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        /**
         * @desc 查询日志错误列表
         * @param {string} tableName 日志表表名
         */
        getLogLibrary (row) {
          console.log('row123', row)
          this.ErrorData = row
          this.errorDetail = ''
          this.logLibraryDialogVisible = true
          this.logTaskTableName = ''
          this.currentIndex = 0
          if (this.isLogOrData) {
            if (this.logLibraryForm.organizations) {
              this.getAllTaskNames(this.logLibraryForm.organizations)
            }
          }
          if (!this.isLogOrData) {
            if (this.logLibraryForm.organizations) {
              this.getAllTaskNamesBydata(this.logLibraryForm.organizations)
            }
          }
        },

        /**
         * @desc 查询日志错误信息(右侧表格)
         * @param {string} tableName 日志表表名
         * @param {string} errorCode 错误码
         * @param {Int} currPage 当前页
         * @param {Int} pageSize 每页显示记录数
         */
        queryLogErrorInformation (row) {
          // debugger
          console.log('查询', this.logTaskTableName, row)
          $ajax({
            url:
              'api/etl_mcentre.businessLogRpcService/queryBusinessLogInfoListByFlag',
            jsonData: [
              {
                tableName: row ? row.LOGTABLENAME : this.logTaskTableName,
                errorCode: this.processFlag,
                currPage: this.paginationLogLibrary.currentPage,
                pageSize: this.paginationLogLibrary.pageSize
              }
            ]
          }).then(res => {
            console.log('查询日志错误信息res', res)
            if (res.body.meta.statusCode == '200') {
              this.paginationLogLibrary.totalNum = res.body.data.total
              this.logListData = res.body.data.list
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        /**
         * @desc 删除日志
         * @param {Array<Int>} logId 日志表id
         * @param {string} tableName 日志表名
         */
        deleteErrorLogList () {
          if (this.logIds.length <= 0) {
            this.$message.error('请先勾选一条日志')
            return false
          }
          console.log('删除日志this.ErrorData', this.ErrorData)
          $ajax({
            url: 'api/etl_mcentre.businessLogRpcService/deleteLog',
            jsonData: [
              {
                tableName:
                  this.ErrorData &&
                  this.ErrorData.hasOwnProperty('LOGTABLENAME')
                    ? this.ErrorData.LOGTABLENAME
                    : this.logTaskTableName,
                logId: this.logIds
              }
            ]
          }).then(res => {
            console.log('查询日志错误信息res', res)
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.getLobData()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        /**
         * @desc 全部删除
         * @param {Array<Int>} logId 日志表id
         * @param {string} tableName 日志表名
         */
        deleteAllErrorLogList () {
          $ajax({
            url: 'api/etl_mcentre.businessLogRpcService/deleteAll',
            jsonData: [
              {
                tableName:
                  this.ErrorData &&
                  this.ErrorData.hasOwnProperty('LOGTABLENAME')
                    ? this.ErrorData.LOGTABLENAME
                    : this.logTaskTableName,
                errorCode: this.processFlag
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.getLobData()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        // 删除/全部删除/重传/全部重传回显
        getLobData () {
          $ajax({
            url:
              'api/etl_mcentre.businessLogRpcService/countBusinessLogByProcessFlag',
            jsonData: [
              {
                tableName:
                  this.ErrorData &&
                  this.ErrorData.hasOwnProperty('LOGTABLENAME')
                    ? this.ErrorData.LOGTABLENAME
                    : this.logTaskTableName
              }
            ]
          }).then(res => {
            console.log('查询日志库错误列表res', res)
            if (res.body.meta.statusCode == '200') {
              this.logLibraryErrorList = res.body.data

              if (this.logLibraryErrorList.list.length <= 0) {
                this.logListData = []
                this.paginationLogLibrary.currentPage = 1
                this.paginationLogLibrary.pageSize = 10
                this.paginationLogLibrary.totalNum = 0
                this.currentIndex = 0
              } else if (this.logLibraryErrorList.list.length == 1) {
                this.processFlag = this.logLibraryErrorList.list[0].PROCESSFLAG
                this.currentIndex = 0
              }

              this.queryLogErrorInformation()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        /**
         * @desc 重传
         * @param {Array<Int>} logId 日志表id
         * @param {string} tableName 日志表名
         */
        againUplodErrorLog () {
          if (this.logIds.length <= 0) {
            this.$message.error('请先勾选一条日志')
            return false
          }
          $ajax({
            url: 'api/etl_mcentre.businessLogRpcService/reSendLog',
            jsonData: [
              {
                tableName:
                  this.ErrorData &&
                  this.ErrorData.hasOwnProperty('LOGTABLENAME')
                    ? this.ErrorData.LOGTABLENAME
                    : this.logTaskTableName,
                logId: this.logIds
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.getLobData()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        /**
         * @desc 全部重传
         * @param {string} errorCode 错误码
         * @param {string} tableName 日志表名
         */
        againUplodAllErrorLog () {
          $ajax({
            url: 'api/etl_mcentre.businessLogRpcService/reSendAll',
            jsonData: [
              {
                tableName:
                  this.ErrorData &&
                  this.ErrorData.hasOwnProperty('LOGTABLENAME')
                    ? this.ErrorData.LOGTABLENAME
                    : this.logTaskTableName,
                errorCode: this.processFlag
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.getLobData()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        /**
         * @desc 获取日志表内一条数据的错误详情
         * @param {String} tableName 日志表表名
         * @param {Int} logId 日志表数据id
         */
        getOneErrorDataDetail (logid) {
          $ajax({
            url:
              'api/etl_mcentre.businessLogRpcService/queryBusinessLogErrorContentById',
            jsonData: [
              {
                tableName:
                  this.ErrorData &&
                  this.ErrorData.hasOwnProperty('LOGTABLENAME')
                    ? this.ErrorData.LOGTABLENAME
                    : this.logTaskTableName,
                logId: logid
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('获取日志表内一条数据的错误详情 res', res)
              this.errorDetail = res.body.data
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        /**
         * @desc 清空日志表内全部的数据
         * @param {String} tableName 日志表表名
         */
        emptyLogTableAllData () {
          $ajax({
            url:
              'api/etl_mcentre.businessLogRpcService/cleanBusinessLogByTableName',
            jsonData: [
              {
                tableName:
                  this.ErrorData &&
                  this.ErrorData.hasOwnProperty('LOGTABLENAME')
                    ? this.ErrorData.LOGTABLENAME
                    : this.logTaskTableName
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('获取日志表内一条数据的错误详情 res', res)
              this.$message.success(res.body.meta.message)
              this.getLobData()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        // 前置机库
        FrontLibraryDataListHandle (row, index) {
          console.log('前置机库row', row)
          if (row.mainTable == 'SYS_DATATABLE_ERROR_MAIN') {
            this.btnDisabledFlag = false
            this.timeLabel = '错误时间'
          } else {
            this.btnDisabledFlag = true
            this.timeLabel = '更新时间'
          }
          this.currentFrontIndex = index
          this.frontData = row
          this.frontLibraryDataDetail.BSXML = ''
          this.frontLibraryDataDetail.ErrorData = ''
          console.log('data-docTable', row)
          this.paginationAdapter.currentPage = 1
          this.queryFrontLibraryDataList(row)
        },
        /**
         * @desc 前置机数据查询接口
         * @param {Int} currPage 当前页
         * @param {Int} pageSize 每页显示记录数
         */
        queryFrontLibraryList () {
          this.currentFrontIndex = 0
          this.frontLibraryDialogVisible = true
          this.frontLibraryForm.errorField = ''
          $ajax({
            url:
              'api/etl_mcentre.adapterServerRpcService/queryUntreatedErrorGroupByDS',
            jsonData: [
              {
                currPage: 1,
                pageSize: 10
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.frontLibraryList = res.body.data
              this.frontData = this.frontLibraryList.data[0]
              this.queryFrontLibraryDataList(this.frontData)
              this.getErrorCodeList()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        /**
         * @desc 查询前置机数据列表
         * @param {Int} currPage 当前页
         * @param {Int} pageSize 每页显示记录数
         * @param {string} mainTable 主表
         */
        queryFrontLibraryDataList (data, e) {
          this.adapterIds = []
          $ajax({
            url:
              'api/etl_mcentre.adapterServerRpcService/queryAdapterDataListByTable',
            jsonData: [
              {
                mainTable: data.mainTable,
                processFlag: e ? String(e) : '',
                currPage: this.paginationAdapter.currentPage,
                pageSize: this.paginationAdapter.pageSize
              }
            ]
          }).then(res => {
            // debugger
            if (res.body.meta.statusCode == '200') {
              this.frontListData = res.body.data.list
              this.paginationAdapter.totalNum = res.body.data.total
              if (this.frontLibraryList.data.length > 0) {
                // if (data.mainTable == 'SYS_DATATABLE_ERROR_MAIN') {
                //   data.errorTotal = res.body.data.total
                // } else {
                //   data.realTotal = this.paginationAdapter.totalNum
                // }
                data.realTotal = this.paginationAdapter.totalNum
              }

              console.log('查询前置机数据列表res', res)
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        selectErrorCode (val) {
          console.log('前置机val', val)
          this.paginationAdapter.currentPage = 1
          this.queryFrontLibraryDataList(this.frontData, val)
        },
        /**
         * @desc 查询前置机数据详情
         * @param {String} docTable 文档表
         * @param {Int} id 列表返回id
         * @param {string} mainTable 主表
         */
        queryFrontLibraryDataDetail (data) {
          $ajax({
            url:
              'api/etl_mcentre.adapterServerRpcService/queryAdapterDataInfoById',
            jsonData: [
              {
                mainTable: data.mainTable,
                docTable: data.docTable,
                id: String(this.frontId)
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.frontLibraryDataDetail = res.body.data
              console.log('3)查询前置机数据详情res', res)
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        /**
         * @desc 获取错误代码列表
         */
        getErrorCodeList () {
          $ajax({
            url: 'api/etl_mcentre.adapterServerRpcService/getErrorCodeTotal',
            jsonData: []
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('获取错误代码列表res', res)
              this.frontLibraryOption = res.body.data.datas
            } else {
              this.$message.error(res.body.meta.message)
            }
          })
        },

        /**
         * @desc 删除
         * @param {Int} isAll 是否全部删除 1:是 0:否
         * @param {Int} ids isAll为0时必传
         * @param {string} mainTable 索引表
         * @param {string} docTable 文档表
         */
        deleteFrontLibraryList (type) {
          if (JSON.stringify(this.frontData) == '{}') {
            return false
          }
          if (this.adapterIds.length == 0) {
            this.$message.error('请先选择一条数据')
            return false
          }
          $ajax({
            url:
              'api/etl_mcentre.adapterServerRpcService/deleteAdapterDataInfoByIds',
            jsonData: [
              {
                mainTable: this.frontData.mainTable,
                docTable: this.frontData.docTable,
                ids: type === 0 ? this.adapterIds : null,
                isAll: type,
                processFlag: this.frontLibraryForm.errorField
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.queryFrontLibraryList()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        /**
         * @desc 重采
         * @param {Int} isAll 是否全部删除 1:是 0:否
         * @param {List} ids isAll为0时必传
         * @param {string} mainTable 主表
         */
        reCollectFrontLibraryList (type) {
          console.log(this.adapterIds)
          if (this.adapterIds.length == 0) {
            this.$message.error('请先选择一条数据')
            return false
          }
          console.log('重采', type)
          $ajax({
            url: 'api/etl_mcentre.adapterServerRpcService/regatherDataByParam',
            jsonData: [
              {
                mainTable: this.frontData.mainTable,
                ids: type === 0 ? this.adapterIds : null,
                isAll: type
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('获取错误代码列表res', res)
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.queryFrontLibraryList()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        /**
         * @desc 重传
         * @param {Int} isAll 是否全部删除 1:是 0:否
         * @param {List} ids isAll为0时必传
         * @param {string} mainTable 主表
         * @param {string} processFlag 错误代码
         */
        reUploadFrontLibraryList (type) {
          // debugger
          if (this.adapterIds.length == 0) {
            this.$message.error('请先选择一条数据')
            return false
          }
          console.log('重传', type)
          $ajax({
            url:
              'api/etl_mcentre.adapterServerRpcService/retransmitDataByParam',
            jsonData: [
              {
                mainTable: this.frontData.mainTable,
                processFlag: '',
                ids: type === 0 ? this.adapterIds : null,
                isAll: type
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('获取错误代码列表res', res)
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.queryFrontLibraryList()
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        // cdr分区统计
        getCdrData (cdrCode, cdrName) {
          console.log('cdrCode', cdrCode)
          console.log('cdrName', cdrName)
          let arr = cdrName.split('库')
          this.cdrNamese = arr[0]
          this.CDRLibraryDialogVisible = true
          this.getCDRPartitionStatistics(cdrCode, cdrName)
          this.getCDRDataStatistics(cdrCode)
        },
        /**
         * @desc cdr分区统计
         */
        getCDRPartitionStatistics (cdrCode) {
          console.log('cdrCode11', cdrCode)
          $ajax({
            url: 'api/etl_mcentre.cdrStatisticRpcService/getCdrDataBaseInfo',
            jsonData: [
              {
                cdrCode: cdrCode
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('cdr分区统计res', res)
              if (
                res.body.data != JSON.parse(JSON.stringify('{}')) &&
                res.body.data.rows
              )
                this.CDRPartitionTableData = res.body.data.rows

              this.CDRPartitionLoading = false
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        /**
         * @desc cdr数据统计
         */
        getCDRDataStatistics (cdrCode) {
          console.log('cdrCode22', cdrCode)
          $ajax({
            url: 'api/etl_mcentre.cdrStatisticRpcService/getCdrDataMsgInfo',
            jsonData: [
              {
                cdrCode: cdrCode
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('cdr数据统计res', res)
              this.CDRDataTableData = res.body.data
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        // 日志采集
        getLogScript () {
          this.dataCollectDialogVisible = true
          this.collectControlMonitorForm = {}
          this.collectMonitorForm.collectMonitorRadio = 1
          this.getDate()
          // this.isBlue = true
          // this.isLogOrData = true
          this.$nextTick(() => {
            // this.getLogCollectQueryList()
            this.getIPDomainName('logCollect')
            this.getDataTrendEcharts()
          })
        },
        getLogScripts () {
          this.isBlue = true
          this.isLogOrData = true

          this.tableData = []
          this.dataTableData = []
          if (this.getDataCollectQueryTaskListTimer) {
            clearInterval(this.getDataCollectQueryTaskListTimer)
            this.getDataCollectQueryTaskListTimer = null
          }
          if (this.getLogCollectQueryListTimer) {
            clearInterval(this.getLogCollectQueryListTimer)
            this.getLogCollectQueryListTimer = null
          }
          this.$nextTick(() => {
            this.getLogCollectQueryList()
          })

          this.getLogCollectQueryListTimer = setInterval(() => {
            this.getLogCollectQueryListUpdate()
          }, 5000)
        },
        // 数据采集控制台
        getDataScript () {
          this.dataCollectDialogVisible = true
          this.collectControlMonitorForm = {}
          this.collectMonitorForm.collectMonitorRadio = 1
          this.getDate()
          // this.isBlue = false
          // this.isLogOrData = false
          this.$nextTick(() => {
            // this.getDataCollectQueryTaskList()
            this.getIPDomainName('compress')
            this.getDataTrendEcharts()
          })
        },
        getDataScripts () {
          console.log('this.msgType', this.msgType)
          console.log('this.msgVersions', this.msgVersions)
          console.log('this.msgOrganizations', this.msgOrganizations)
          this.isBlue = false
          this.isLogOrData = false
          this.tableData = []
          this.dataTableData = []
          if (this.getLogCollectQueryListTimer) {
            clearInterval(this.getLogCollectQueryListTimer)
            this.getLogCollectQueryListTimer = null
          }
          if (this.getDataCollectQueryTaskListTimer) {
            clearInterval(this.getDataCollectQueryTaskListTimer)
            this.getDataCollectQueryTaskListTimer = null
          }
          if (
            this.msgType != '' &&
            this.msgVersions != '' &&
            this.msgOrganizations != ''
          ) {
            this.$nextTick(() => {
              this.getDataCollectQueryTaskList()
            })
          }

          if (
            this.msgType != '' &&
            this.msgVersions != '' &&
            this.msgOrganizations != ''
          ) {
            this.getDataCollectQueryTaskListTimer = setInterval(() => {
              this.getDataCollectQueryTaskListUpdate()
            }, 5000)
          }
        },
        getHeadEcharts (val) {
          this.dataCollectDialogVisible = true
          this.collectControlMonitorForm = {}
          this.collectMonitorForm.collectMonitorRadio = 1
          this.getDate()
          this.$nextTick(() => {
            if (val === 1) {
              this.getIPDomainName('adapter')
            }
            if (val === 2) {
              this.getIPDomainName('decompress')
            }
            this.getDataTrendEcharts()
          })
        },
        changeTiemes (val) {
          this.collectMonitorForm.defineTimes1 = val[0]
          this.collectMonitorForm.defineTimes2 = val[1]
        },
        // 查询
        searchQuery () {
          if (
            this.collectMonitorForm.collectMonitorRadio == 4 &&
            this.collectMonitorForm.defineTimes1 !== '' &&
            this.collectMonitorForm.defineTimes2 !== ''
          ) {
            this.startDates = this.collectMonitorForm.defineTimes1
            this.endDates = this.collectMonitorForm.defineTimes2
            this.getDatacollectEcharts()
          }
        },
        // 获取echarts表格-服务调用趋势
        getDataTrendEcharts () {
          const myChart = echarts.init(
            document.getElementById('serviceTrendEcharts')
          )

          //根据窗口的大小变动图表
          window.addEventListener('resize', () => {
            myChart.resize()
          })
          myChart.setOption(this.option)
        },
        // 数据采集监控趋势
        getDatacollectEcharts () {
          $ajax({
            url: 'api/etl_mcentre.cdrServerRpcService/dataMonitorTrend',
            jsonData: [
              {
                startTime: this.startDates,
                endTime: this.endDates
              }
            ]
          }).then(res => {
            console.log('数据采集监控趋势res', res)
            if (res.body.meta.statusCode == '200') {
              this.dataCollectWatchTrendy = []
              if (
                this.collectMonitorForm.collectMonitorRadio === 3 ||
                this.collectMonitorForm.collectMonitorRadio === 4
              ) {
                let arr = []
                this.option.series[1].data = []
                this.option.series[0].data = []
                this.option.series[3].data = []
                this.option.series[2].data = []

                res.body.data.forEach(item => {
                  arr.push(item.RECORDTIME)
                  if (item.TYPE === '1') {
                    this.option.series[1].data.push(item.DATA_NUM)
                  }
                  if (item.TYPE === '2') {
                    this.option.series[0].data.push(item.DATA_NUM)
                  }
                  if (item.TYPE === '3') {
                    this.option.series[3].data.push(item.DATA_NUM)
                  }
                  if (item.TYPE === '4') {
                    this.option.series[2].data.push(item.DATA_NUM)
                  }
                })
                this.dataCollectWatchTrendy = arr.filter(
                  (item, index) => arr.indexOf(item) === index
                )
                console.log(
                  'this.dataCollectWatchTrendy11',
                  this.dataCollectWatchTrendy
                )
              } else {
                let arr = []
                this.option.series[1].data = []
                this.option.series[0].data = []
                this.option.series[3].data = []
                this.option.series[2].data = []
                res.body.data.forEach(item => {
                  arr.push(item.RECORDTIME)
                  if (item.TYPE === '1') {
                    this.option.series[1].data.push(item.DATA_NUM)
                  }
                  if (item.TYPE === '2') {
                    this.option.series[0].data.push(item.DATA_NUM)
                  }
                  if (item.TYPE === '3') {
                    this.option.series[3].data.push(item.DATA_NUM)
                  }
                  if (item.TYPE === '4') {
                    this.option.series[2].data.push(item.DATA_NUM)
                  }
                })
                this.dataCollectWatchTrendy = arr.filter(
                  (item, index) => arr.indexOf(item) === index
                )
                console.log(
                  'this.dataCollectWatchTrendy22',
                  this.dataCollectWatchTrendy
                )
              }
              this.option.xAxis.data = this.dataCollectWatchTrendy
              this.getDataTrendEcharts()
            }
          })
        },
        selectTimeToEcharts (value) {
          console.log('选中的时间value', value)
          this.collectMonitorForm.collectMonitorRadio = value
          this.getDate()
        },
        // 时间格式化、

        getCurDate (d) {
          let nowDate = new Date(d)
          var year = nowDate.getFullYear(d)
          var month =
            nowDate.getMonth() < 9
              ? '0' + (nowDate.getMonth() + 1)
              : '' + (nowDate.getMonth() + 1)
          var day =
            nowDate.getDate() < 10
              ? '0' + nowDate.getDate()
              : '' + nowDate.getDate()

          return year + '-' + month + '-' + day
        },
        // 获取当前时间
        getDate () {
          let getTime = ''
          let getYesterdayTime = ''
          let getWeekTime = ''
          getTime = this.getCurDate(new Date())
          if (this.collectMonitorForm.collectMonitorRadio == 1) {
            this.startDates = getTime + ' ' + '00' + ':' + '00' + ':' + '00'
            this.endDates = getTime + ' ' + '23' + ':' + '59' + ':' + '59'
            this.collectMonitorForm.defineTimes1 = this.startDates
            this.collectMonitorForm.defineTimes2 = this.endDates
            this.$set(this.defineTimes, 0, this.collectMonitorForm.defineTimes1)
            this.$set(this.defineTimes, 1, this.collectMonitorForm.defineTimes2)
            this.getDatacollectEcharts()
          } else if (this.collectMonitorForm.collectMonitorRadio == 2) {
            getYesterdayTime = this.getCurDate(new Date() - 3600 * 1000 * 24)
            this.startDates =
              getYesterdayTime + ' ' + '00' + ':' + '00' + ':' + '00'
            this.endDates =
              getYesterdayTime + ' ' + '23' + ':' + '59' + ':' + '59'
            this.collectMonitorForm.defineTimes1 = this.startDates
            this.collectMonitorForm.defineTimes2 = this.endDates
            this.$set(this.defineTimes, 0, this.collectMonitorForm.defineTimes1)
            this.$set(this.defineTimes, 1, this.collectMonitorForm.defineTimes2)

            this.getDatacollectEcharts()
          } else if (this.collectMonitorForm.collectMonitorRadio == 3) {
            getWeekTime = this.getCurDate(new Date() - 3600 * 1000 * 24 * 6)
            this.startDates = getWeekTime + ' ' + '00' + ':' + '00' + ':' + '00'
            this.endDates = getTime + ' ' + '23' + ':' + '59' + ':' + '59'
            this.collectMonitorForm.defineTimes1 = this.startDates
            this.collectMonitorForm.defineTimes2 = this.endDates
            this.$set(this.defineTimes, 0, this.collectMonitorForm.defineTimes1)
            this.$set(this.defineTimes, 1, this.collectMonitorForm.defineTimes2)
            this.getDatacollectEcharts()
          } else if (this.collectMonitorForm.collectMonitorRadio == 4) {
            this.startDates = this.collectMonitorForm.defineTimes1
            this.endDates = this.collectMonitorForm.defineTimes2
            this.$set(this.defineTimes, 0, this.collectMonitorForm.defineTimes1)
            this.$set(this.defineTimes, 1, this.collectMonitorForm.defineTimes2)
          }
          console.log('开始时间', this.startDates)
          console.log('结束时间', this.endDates)
        },

        /**
         * @desc 获取数据采集日志
         * @param {string} ip 参数格式["10.0.38.107","cdr"]
         */
        getDataCollecrLog (data) {
          $ajax({
            url: 'api/etl_mcentre.consoleRpcService/getConsoleInfo',
            jsonData: [
              {
                ip: data.serviceAddress,
                domain: data.service
              }
            ]
          }).then(res => {
            if (res.body) {
              let controllTask = []
              if (res.body.data != '') {
                controllTask = res.body.data.split('\r\n')
              }

              console.log('controllTask', controllTask)
              if (controllTask && controllTask.length > 0) {
                controllTask.forEach((item, index) => {
                  this.controllTaskes.push(controllTask[index].split('   '))
                })
              }
              console.log('controllTaskes', this.controllTaskes)
              // console.log('this.controllTask', this.controllTaskes)
            }
          })
        },

        /**
         * @desc 获取数据采集ip,域名
         */
        getIPDomainName (str) {
          console.log('str1234', str)
          if (str === 'logCollect' || str === 'compress') {
            this.collectControlMonitorForm.service = 'etl'
          } else {
            this.collectControlMonitorForm.service = 'cdr'
          }

          $ajax({
            url: 'api/etl_mcentre.onLineServerRpcService/getCollectDomain',
            jsonData: [str]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              // this.collectControlMonitorForm = res.body.data
              console.log('获取数据采集ip,域名res', res.body.data)
              this.serviceAddress = []

              Object.keys(res.body.data).forEach((item, index) => {
                this.serviceAddress.push({
                  value: String(index + 1),
                  label: item
                })
              })
              this.services = []
              Object.values(res.body.data).forEach((items, index) => {
                console.log('items', items.join(''))
                if (!this.services.includes(items.join(''))) {
                  this.services.push({
                    value: String(index + 1),
                    label: items.join('')
                  })
                }
              })

              console.log('Object.keys', this.serviceAddress)
              console.log('Object.values', this.services)
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        // 清空
        clearControllerData () {
          $ajax({
            url: 'api/etl_mcentre.consoleRpcService/clearServer',
            jsonData: [
              this.collectControlMonitorForm.serviceAddress,
              this.collectControlMonitorForm.service
            ]
          }).then(res => {
            console.log('删除')
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
              this.controllTaskes = []
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },
        selectChange (item) {
          // this.collectControlMonitorForm.serviceAddress = ''
          // this.collectControlMonitorForm = {}
          this.controllTaskes = []
          this.controllerBtnFlag = true
          if (this.timer) {
            clearInterval(this.timer)
          }
          this.collectControlMonitorForm.serviceAddress = item.label
          if (this.collectControlMonitorForm.serviceAddress) {
            this.timer = setInterval(() => {
              this.getDataCollecrLog(this.collectControlMonitorForm)
            }, 2000)
          }
        },
        //
        closeDataCollect () {
          // debugger
          // 将数据清空
          this.controllTaskes = []
          this.controllerBtnFlag = true
          if (this.timer) {
            clearInterval(this.timer)
          }
          // setTimeout(() => {
          //   clearInterval(this.timer)
          // }, 0)
        },
        // 暂停
        stopDataCollect () {
          this.controllerBtnFlag = false
          if (this.timer) {
            clearInterval(this.timer)
          }
          // setTimeout(() => {
          //   clearI
        },
        recoverDataCollect () {
          this.controllerBtnFlag = true
          setTimeout(() => {
            this.timer = setInterval(() => {
              this.getDataCollecrLog(this.collectControlMonitorForm)
            }, 2000)
          }, 0)
        },
        /**
         * @desc 数据采集测试sql
         * @param {Int} taskId 采集任务id(是)
         * @param {string} sourceId 指定SourceId(是)
         * @param {Int} ifUpLoad 是否上传(是)
         * @param {string} effective 上传时间(否)
         */
        dataCollectTest () {
          this.$refs.dataCollectTestDialogForms.validate(valid => {
            if (valid) {
              $ajax({
                url: 'api/etl_mcentre.dataTaskManageRpcService/testSql',
                jsonData: [
                  {
                    taskId: String(this.rowDataCollect.ID),
                    sourceId: this.dataCollectTestDialogForm.appointSourceId,
                    ifUpLoad:
                      this.dataCollectTestDialogForm.ifUpLoad == false
                        ? '0'
                        : '1',
                    effectiveTime: this.dataCollectTestDialogForm.recordTime
                  }
                ]
              }).then(res => {
                if (res.code === 200) {
                  this.dataCollectTestDialogVisible = false
                  // this.rowDataCollect = {}
                  // 接口返回已经做了处理，不需要前端再做格式化处理
                  this.testInformation = res.body.data
                  // this.testInformation = this.formatXml(res.body.data)
                  console.log('this.testInformation ', this.testInformation)

                  this.dataCollectTestDialogesVisible = true
                }
              })
            }
          })
        },
        // 格式化BXML
        formatXml (xml) {
          var formatted = ''
          var reg = /(>)(<)(\/*)/g
          xml = xml.replace(reg, '$1\r\n$2$3')
          var pad = 0
          jQuery.each(xml.split('\r\n'), function (index, node) {
            var indent = 0
            if (node.match(/.+<\/\w[^>]*>$/)) {
              indent = 0
            } else if (node.match(/^<\/\w/)) {
              if (pad != 0) {
                pad -= 1
              }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
              indent = 1
            } else {
              indent = 0
            }
            var padding = ''
            for (var i = 0; i < pad; i++) {
              padding += '  '
            }
            formatted += padding + node + '\r\n'
            pad += indent
          })
          return formatted
        },
        //计算头函数	用来缩进
        setPrefix (prefixIndex) {
          var result = ''
          var span = '    ' //缩进长度
          var output = []
          for (var i = 0; i < prefixIndex; ++i) {
            output.push(span)
          }
          result = output.join('')
          return result
        },
        changeOutputMpde (val) {
          console.log('输出接口val', val)
          if (val === '1') {
            this.updateDataDialogForm.INTERFACE = 'cdr'
          } else {
            this.updateDataDialogForm.INTERFACE = this.rowDataCollect.INTERFACE
          }
        },
        // 移除校验
        resetValid () {
          this.dataCollectTestDialogVisible = false
          this.$refs.dataCollectTestDialogForms.resetFields()
        },
        // 启动/停止/暂停
        pauseOrStopClick () {},

        // 弹层事件
        // 数据采集测试
        collectTest () {
          if (JSON.stringify(this.rowDataCollect) !== '{}') {
            this.dataCollectTestDialogVisible = true
          } else {
            this.$message.error('请先单击选择一条采集任务')
            return false
          }
        },

        addLog () {
          if (
            this.addLogDialogForm.templateId &&
            this.addDataDialogForm.templateId
          ) {
            this.configTitle = true
            this.configCode = false
            if (this.isLogOrData) {
              this.addLogDialogVisible = true
              this.addLogDialogForm.startTime = ''
              this.addLogDialogForm.endTime = ''
              this.addLogDialogForm.cron = ''
            } else {
              this.addDataDialogForm.cron = ''
              // this.addDataDialogForm.cdrConfig[0].cdrCode = ''
              this.addDataDialogVisible = true
              this.addDataDialogForm.outPutMode = '1'
              this.addDataDialogForm.adapterInterface = 'cdr'
              this.addDataDialogForm.cdrConfig = [
                {
                  cdrCode: '',
                  text: '',
                  config: [
                    {
                      isStandard: '1', // 标准1 业务0 不能同时传
                      checkBsXml: '1',
                      dictionaryChange: '1'
                    },
                    {
                      isStandard: '0', // 标准1 业务0 不能同时传
                      checkBsXml: '0',
                      dictionaryChange: '0'
                    }
                  ]
                }
              ]
              this.addDatabaseCheckListAll = [
                {
                  first: ['业务BSXML：'],
                  last: ['标准BSXML：', '模板校验', '字典翻转']
                }
              ]
              this.getUploadDataList()
            }
            this.getCataLogId()
            this.getLogDataSourceId()
            this.getCompressData()
            this.getStrategyConfigList()
          } else {
            this.$message.error('请至少选择一条模型数据')
            return false
          }
        },
        updateLog (val) {
          console.log('val1', val)
          console.log('this.rowDataCollect', this.rowDataCollect)
          if (JSON.stringify(this.rowDataCollect) !== '{}') {
            if (this.isLogOrData) {
              if (this.rowDataCollect.LOGSTATUS >= 0) {
                this.updateLogDialogVisible = true
                setTimeout(() => {
                  let newCorn = this.implementStrategies.filter(
                    item => item.expression == this.updateLogDialogForm.CRON
                  )
                  if (newCorn.length > 0) {
                    this.updateLogDialogForm.CRON = newCorn[0].expression
                  }
                }, 200)
              } else {
                this.addLogDialogVisible = true
                this.configTitle = false
              }
            } else {
              if (this.rowDataCollect.DATASTATUS >= 0) {
                console.log(123)
                this.updateDataDialogVisible = true
                this.getDataToPage(this.rowDataCollectCopy)
                setTimeout(() => {
                  let newCorn = this.implementStrategies.filter(
                    item => item.expression == this.updateDataDialogForm.CRON
                  )
                  if (newCorn.length > 0) {
                    this.updateDataDialogForm.CRON = newCorn[0].expression
                  }
                }, 200)
              } else {
                this.addDataDialogVisible = true
                this.configTitle = false
              }
              this.getUploadDataList()
            }

            this.getCataLogId()
            this.getLogDataSourceId()
            this.getCompressData()
            this.getStrategyConfigList()
          } else {
            this.$message.error('请先选择一条采集任务')
            return false
          }
        },

        // 批量修改采集策略
        scriptBatchClick () {
          if (
            (this.selectionLogCollect.length <= 0 &&
              this.selectionChangeData.length <= 0) ||
            JSON.stringify(this.rowDataCollect) !== '{}'
          ) {
            this.$message.error('至少勾选一条采集任务')
            return false
          } else {
            if (this.isLogOrData) {
              if (this.selectionLogCollect.length > 0) {
                if (
                  this.selectionLogCollect.some(item => item.LOGSTATUS === 1)
                ) {
                  this.scriptTipsDialogVisible = true
                } else {
                  this.isShowBatchEditScript = true
                  this.batchEditDialogForm = {}
                  this.batchLogIds = []
                  this.selectionLogCollect.forEach(item => {
                    this.batchLogIds.push(item.LOGID)
                  })
                  console.log('this.batchLogIds111', this.batchLogIds)
                }
              }
            }
            if (!this.isLogOrData) {
              if (this.selectionChangeData.length > 0) {
                if (
                  this.selectionChangeData.some(item => item.DATASTATUS === 1)
                ) {
                  this.scriptTipsDialogVisible = true
                } else {
                  this.isShowBatchEditScript = true
                  this.batchEditDialogForm = {}
                  this.batchLogIds = []
                  this.selectionChangeData.forEach(item => {
                    this.batchLogIds.push(item.CONFIGID)
                  })
                }
              }
            }
            this.getStrategyConfigList()
          }
        },
        /**
         * @desc 批量修改采集策略
         * @param {List<Int>} logId 批量修改的日志采集配置id集合
         * @param {String} cron 采集策略
         */
        batchEditScript (val) {
          let urls = ''
          if (this.isLogOrData) {
            urls =
              'api/etl_mcentre.logTaskManageRpcService/updateLogListCronByLogId'
          } else if (!this.isLogOrData) {
            urls =
              'api/etl_mcentre.dataTaskManageRpcService/updateDataListCronByLogId'
          }
          $ajax({
            url: urls,
            jsonData: [
              {
                logId: this.batchLogIds,
                cron: this.batchEditDialogForm.cron
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode === '200') {
              this.$message.success(res.body.meta.message)
              this.isShowBatchEditScript = false
              if (this.isLogOrData) {
                this.getLogCollectQueryList()
              }
              if (!this.isLogOrData) {
                this.getDataCollectQueryTaskList()
              }
            } else {
              this.$message.error(res.body.meta.message)
            }
          })
        },
        // 搜索
        searchList () {
          if (this.isLogOrData) {
            this.pagination.currentPage = 1
            this.getLogCollectQueryList()
          } else {
            this.getDataCollectQueryTaskList()
          }
        },
        // 刷新
        refreshTable () {
          this.isLogOrData
            ? this.getLogCollectQueryList()
            : this.getDataCollectQueryTaskList()
        },
        // 日志采集脚本配置
        getLogCollectSql (row) {
          console.log('执行脚本row', row)
          // if (row.LOGSTATUS === 1) {
          //   this.$message.error('任务启动中不能修改脚本')
          //   return false
          // }
          // if (
          //   row.SCRIPTNAME === undefined ||
          //   this.logCollectDialogForm.hisDataSourceId === undefined
          // ) {
          //   this.logDataSourceIdName = ''
          //   this.logCollectDialogForm.hisDataSourceId = ''
          // }
          this.logScript = row
          this.logCollectDialogVisible = true
          // this.logCollectDialogForm.logScriptName = row.SCRIPTNAME
          //   ? row.SCRIPTNAME
          //   : ''
          this.logCollectDialogForm.logScriptName = ''
          this.getCataLogId()
          this.getLogDataSourceId()
          if (row.hasOwnProperty('SCRIPTNAME')) {
            this.searchLogCollectSql()
            this.logScript = row
          } else {
            this.logCollectDialogForm = {}
            this.logDataSourceIdName = ''
          }
        },

        implementStrategyClick () {
          this.implementStrategyDialogVisible = true
        },
        addData () {
          this.addDataDialogVisible = true
        },
        dataCollect () {
          this.dataCollectTestDialogVisible = true
        },
        editCollect () {
          this.editCollectDialogVisible = true
        },
        addTrigger () {
          this.addTriggerDialogVisible = true
        },
        triggerChange (label) {
          if (label === 2) {
            this.labelClass = true
          }
          console.log(label)
        },
        // 编辑SQL脚本
        editSQLScript () {
          console.log('编辑SQL脚本', this.ErrorData)
          let obj = {}
          if (this.logTaskTableName) {
            obj = this.allTaskNameList.find(
              item => item.ETLTASKCODE === this.logTaskTableName.slice(4)
            )
          }
          if (this.ErrorData.$rows || this.ErrorData.index >= 0) {
            obj = this.ErrorData
          }
          console.log('obj', obj)
          if (
            obj == undefined ||
            (obj && !obj.configId && !obj.dataCollectionScriptName)
          ) {
            this.$message.error('该任务没有配置数据采集任务，无法编辑')
            return false
          }
          this.msgType = obj.TEMPLATEID
          this.msgVersions = obj.TEMPLATEVERSION
          this.msgOrganizations = obj.TEMPLATEORG
          this.getFullScreen(obj)
        },

        // 文档库
        editFileLibrary () {
          this.fileLibraryDialogVisible = true
          this.$nextTick(() => {
            this.getyearDataEcharts()
            this.getfileTypeDataEcharts()
            for (let i = 1; i < 5; i++) {
              this.getCDRDataEcharts(i)
            }
          })
        },
        searchFileLibrary () {
          console.log('文档库查询')
        },
        indexMethod (index) {
          return index + 1
        },
        // 复制
        copy () {
          console.log('this.selectionLogCollect', this.selectionLogCollect)
          console.log('this.selectionLogCollect', this.selectionLogCollectCopy)
          if (!this.msgType) {
            this.$message.error('请勾选一条任务再复制')
            return false
          }
          if (this.isLogOrData) {
            if (JSON.stringify(this.rowDataCollect) === '{}') {
              if (
                this.selectionLogCollect &&
                this.selectionLogCollect.length > 0
              ) {
                if (this.selectionLogCollect.length === 1) {
                  this.copyDialogVisible = true
                  this.copyDialogVisibleForm.copyLog = true
                  this.copyDialogVisibleForm.copyData = false
                  this.copyDialogVisibleForm.taskName = this.selectionLogCollect[0].NAME
                  this.copyDialogVisibleForm.taskCode = this.selectionLogCollect[0].ETLTASKCODE
                  this.copyDialogVisibleForm.id = this.selectionLogCollect[0].ID
                  this.copyDialogVisibleForm.logTaskId = this.selectionLogCollect[0].LOGID
                } else {
                  this.$message.error('只能勾选一条任务复制')
                  return false
                }
              } else {
                this.$message.error('请勾选一条任务再复制')
              }
            } else {
              if (this.selectionLogCollect.length == 0) {
                this.$message.error('请勾选一条任务再复制')
              } else {
                // debugger
                this.selectionLogCollectCopy.forEach(item => {
                  if (item.ID == this.rowDataCollect.ID) {
                    this.copyDialogVisible = true
                    this.copyDialogVisibleForm.copyLog = true
                    this.copyDialogVisibleForm.copyData = false
                    this.copyDialogVisibleForm.taskName = this.selectionLogCollect[0].NAME
                    this.copyDialogVisibleForm.taskCode = this.selectionLogCollect[0].ETLTASKCODE
                    this.copyDialogVisibleForm.id = this.selectionLogCollect[0].ID
                    this.copyDialogVisibleForm.logTaskId = this.selectionLogCollect[0].LOGID
                  } else {
                    this.$message.error('请勾选对应任务再复制')
                  }
                })
              }
            }
          }
          if (!this.isLogOrData) {
            if (JSON.stringify(this.rowDataCollect) === '{}') {
              if (
                this.selectionChangeData &&
                this.selectionChangeData.length > 0
              ) {
                if (this.selectionChangeData.length === 1) {
                  this.copyDialogVisible = true
                  this.copyDialogVisibleForm.copyLog = false
                  this.copyDialogVisibleForm.copyData = true
                  this.copyDialogVisibleForm.taskName = this.selectionChangeData[0].NAME
                  this.copyDialogVisibleForm.taskCode = this.selectionChangeData[0].ETLTASKCODE
                  this.copyDialogVisibleForm.id = this.selectionChangeData[0].ID
                } else {
                  this.$message.error('只能勾选一条任务复制')
                  return false
                }
              } else {
                this.$message.error('请勾选一条任务再复制')
              }
            } else {
              if (this.selectionChangeData.length == 0) {
                this.$message.error('请勾选一条任务再复制')
              } else {
                // debugger
                this.selectionChangeDataCopy.forEach(item => {
                  if (item.ID == this.rowDataCollect.ID) {
                    this.copyDialogVisible = true
                    this.copyDialogVisibleForm.copyLog = true
                    this.copyDialogVisibleForm.copyData = false
                    this.copyDialogVisibleForm.taskName = this.selectionChangeData[0].NAME
                    this.copyDialogVisibleForm.taskCode = this.selectionChangeData[0].ETLTASKCODE
                    this.copyDialogVisibleForm.id = this.selectionChangeData[0].ID
                    this.copyDialogVisibleForm.logTaskId = this.selectionChangeData[0].LOGID
                  } else {
                    this.$message.error('请勾选对应任务再复制')
                  }
                })
              }
            }
          }
          // if (JSON.stringify(this.rowDataCollect) === '{}'|| this.selectionLogCollect.length>0) {
          //   if (this.isLogOrData) {
          //     if (
          //       this.selectionLogCollect &&
          //       this.selectionLogCollect.length > 0
          //     ) {
          //       if (this.selectionLogCollect.length === 1) {
          //         this.copyDialogVisible = true
          //         this.copyDialogVisibleForm.copyLog = true
          //         this.copyDialogVisibleForm.copyData = false
          //         this.copyDialogVisibleForm.taskName = this.selectionLogCollect[0].NAME
          //         this.copyDialogVisibleForm.taskCode = this.selectionLogCollect[0].ETLTASKCODE
          //         this.copyDialogVisibleForm.id = this.selectionLogCollect[0].ID
          //         this.copyDialogVisibleForm.logTaskId = this.selectionLogCollect[0].LOGID
          //       } else {
          //         this.$message.error('只能勾选一条任务复制')
          //         return false
          //       }
          //     } else {
          //       this.$message.error('请勾选一条任务再复制')
          //     }
          //   }
          //   if (!this.isLogOrData) {
          //     if (
          //       this.selectionChangeData &&
          //       this.selectionChangeData.length > 0
          //     ) {
          //       if (this.selectionChangeData.length === 1) {
          //         this.copyDialogVisible = true
          //         this.copyDialogVisibleForm.copyLog = false
          //         this.copyDialogVisibleForm.copyData = true
          //         this.copyDialogVisibleForm.taskName = this.selectionChangeData[0].NAME
          //         this.copyDialogVisibleForm.taskCode = this.selectionChangeData[0].ETLTASKCODE
          //         this.copyDialogVisibleForm.id = this.selectionChangeData[0].ID
          //       } else {
          //         this.$message.error('只能勾选一条任务复制')
          //         return false
          //       }
          //     } else {
          //       this.$message.error('请勾选一条任务再复制')
          //     }
          //   }
          // } else {
          //   this.$message.error('请先勾选一条采集任务')
          //   return false
          // }
        },
        /**
         * @desc 复制任务
         * @param {Int} oldTaskId 需要复制的任务Id
         * @param {String} newTaskCode 复制完的任务代码
         * @param {String} newTaskName 复制完的任务名称
         */
        copyLogOrData () {
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/copyTask',
            jsonData: [
              {
                oldTaskId: this.copyDialogVisibleForm.id,
                newTaskCode: this.copyDialogVisibleForm.taskCode,
                newTaskName: this.copyDialogVisibleForm.taskName,
                copyLog: this.copyDialogVisibleForm.copyLog,
                copyData: this.copyDialogVisibleForm.copyData,
                logTaskId:
                  this.copyDialogVisibleForm.copyData === false
                    ? this.copyDialogVisibleForm.logTaskId
                    : ''
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message.success(res.body.meta.message)
              this.copyDialogVisible = false
              if (this.isLogOrData) {
                this.getLogCollectQueryList()
              }
              if (!this.isLogOrData) {
                this.getDataCollectQueryTaskList()
              }
            } else {
              this.$message.error(res.body.meta.message)
            }
          })
        },

        // 上传
        handleRemove (file, fileList) {
          console.log(file, fileList)
        },
        handlePreview (file) {
          console.log(file)
        },
        // 下拉框展开
        visibleSelect (e) {
          if (this.addTriggerForm.triggerRadio !== 1) {
            // 获取所有的li
            const lis = document.getElementsByClassName(
              'el-select-dropdown__item'
            )
            // 打开下拉框 添加input
            if (e) {
              for (let i = 0; i < lis.length; i++) {
                const element = lis[i]
                const input = document.createElement('input')
                input.style.cssText = 'margin-right: 10px;'
                input.type = 'checkbox'
                // 根据是否有选中的类名来判断li是否被选中
                if (element.classList.contains('selected')) {
                  // 对应复选框也设置被选中
                  input.checked = true
                }
                element.insertBefore(input, element.lastChild)
              }
            } else {
              // 关闭下拉框 移除掉input--否则每次打开添加就是多个input
              for (let i = 0; i < lis.length; i++) {
                const element = lis[i]
                element.removeChild(element.firstChild)
              }
            }
          }
        },
        // 选择变化
        changeSelect () {
          if (this.addTriggerForm.triggerRadio !== 1) {
            const lis = document.getElementsByClassName(
              'el-select-dropdown__item'
            )
            for (let i = 0; i < lis.length; i++) {
              const element = lis[i]
              // 必须使用nextTick 否则拿不到最新的修改后的dom选中状态 也就没法判断
              this.$nextTick(() => {
                // 判断当前的li是否被选中 选中的则设置复选框被选中
                if (element.classList.contains('selected')) {
                  element.firstChild.checked = true
                } else {
                  element.firstChild.checked = false
                }
              })
            }
          }
        },

        // 获取echarts表格-文档库
        getyearDataEcharts () {
          const myChart = echarts.init(
            document.getElementById('yearDataEchartStyle')
          )
          //根据窗口的大小变动图表
          window.addEventListener('resize', () => {
            myChart.resize()
          })
          myChart.setOption(this.yearDataOption)
        },
        getfileTypeDataEcharts () {
          const myChart = echarts.init(
            document.getElementById('fileTypeDataEchartStyle')
          )
          //根据窗口的大小变动图表
          window.addEventListener('resize', () => {
            myChart.resize()
          })
          myChart.setOption(this.fileTypeDataOption)
        },
        // 获取echarts表格-CDR统计
        getCDRDataEcharts (i) {
          const myChart = echarts.init(
            document.getElementById('CDREchartsDiv' + i)
          )
          //根据窗口的大小变动图表
          window.addEventListener('resize', () => {
            myChart.resize()
          })
          var datas = [
            [
              {
                name: '剩余',
                value: 20.63
              },
              {
                name: '已使用',
                value: 79.32
              }
            ]
          ]
          option = {
            title: {
              show: true,
              text: '99.95G',
              subtext: '总容量',
              itemGap: 8,
              left: '48%',
              top: '35%',
              textStyle: {
                color: '#666666',
                fontWeight: 400,
                fontSize: 16
              },
              subtextStyle: {
                color: '#666666',
                fontWeight: 400,
                fontSize: 14
              },
              textAlign: 'center'
            },
            grid: {},
            series: datas.map(function (data, idx) {
              return {
                type: 'pie',
                radius: ['65%', '80%'],
                color: ['#DCDCDC', '#5988FE'],
                left: 'center',
                width: 200,
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 1
                  // color: param => {
                  //   let index = param.dataIndex
                  //   return this.colorList[index]
                  // }
                },
                label: {
                  alignTo: 'edge',
                  formatter: '{time|{c} G}\n{name|{b}}',
                  minMargin: 5,
                  edgeDistance: 20,
                  lineHeight: 20,
                  rich: {
                    time: {
                      fontSize: 12,
                      color: '#999'
                    }
                  }
                },
                labelLine: {
                  length: 5,
                  length2: 0,
                  maxSurfaceAngle: 80
                },
                labelLayout: function (params) {
                  const isLeft = params.labelRect.x < myChart.getWidth() / 2
                  const points = params.labelLinePoints
                  points[2][0] = isLeft
                    ? params.labelRect.x
                    : params.labelRect.x + params.labelRect.width
                  return {
                    labelLinePoints: points
                  }
                },
                data: data
              }
            })
          }
          myChart.setOption(option)
        },
        changeHandler () {
          this.list = this.textareaData.split('\n').length
        },

        // 分页事件
        handleSizeChange (pageSize) {
          if (this.frontLibraryDialogVisible) {
            this.paginationAdapter.pageSize = pageSize
            this.paginationAdapter.currentPage = 1
            this.queryFrontLibraryDataList(
              this.frontData,
              this.frontLibraryForm.errorField
            )
          } else {
            this.pagination.pageSize = pageSize
            this.pagination.currentPage = 1
            this.isLogOrData
              ? this.getLogCollectQueryList()
              : this.getDataCollectQueryTaskList()
          }
        },
        handleCurrentChange (page) {
          if (this.frontLibraryDialogVisible) {
            this.paginationAdapter.currentPage = page
            this.queryFrontLibraryDataList(
              this.frontData,
              this.frontLibraryForm.errorField
            )
          } else {
            this.pagination.currentPage = page
            this.isLogOrData
              ? this.getLogCollectQueryList()
              : this.getDataCollectQueryTaskList()
          }
        },
        searchModelKey () {
          this.$refs.leftTree.filter(this.searchKey)
        },
        //  日志库分页
        handleSizeChangeLogLibrary (pageSize) {
          this.paginationLogLibrary.pageSize = pageSize
          this.paginationLogLibrary.currentPage = 1
          this.queryLogErrorInformation()
        },
        handleCurrentChangeLogLibrary (page) {
          console.log('日志库分页page', this.logTaskTableName)
          this.paginationLogLibrary.currentPage = page
          this.queryLogErrorInformation()
        }
        // 流程图连线
      }
      me.callParent(arguments)
    },

    // 组件初始化之后
    afterInitComponent () {},

    // 页面渲染完成后 执行的方法  可以避免数据加载错误导致页面渲染失败
    afterAppend () {
      const me = this
    },

    // vue 实例化之后
    afterVueConfInited (vueConf) {
      const me = this
      vueConf.watch = {
        // 监听器
        searchKey (val) {
          this.$refs.leftTree.filter(val)
        }
      }
      vueConf.computed = {
        // 计算属性
      }
      // 生命周期钩子函数
      vueConf.created = function () {
        if (this.dataCollectServiceWatchTimer) {
          clearInterval(this.dataCollectServiceWatchTimer)
          this.dataCollectServiceWatchTimer = null
        }
        this.$nextTick(async () => {
          await this.dataCollectServiceWatch()
        })

        this.dataCollectServiceWatchTimer = setInterval(() => {
          this.dataCollectServiceWatch()
        }, 5000)
        this.getOrganization()
        this.getTreeData()
        this.getAllTotal()
      }
      vueConf.mounted = function () {
        console.log('me', me)
        console.log('mounted ...')
      }

      vueConf.destroyed = function () {
        console.log('destroyed ...')
      }
    }
  }
)
