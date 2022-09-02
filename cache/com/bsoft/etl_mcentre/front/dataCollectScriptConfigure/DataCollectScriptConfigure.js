$define(
  'com.bsoft.etl_mcentre.front.dataCollectScriptConfigure.DataCollectScriptConfigure',
  {
    tpl: true,
    css: [
      'com.bsoft.etl_mcentre.front.dataCollectScriptConfigure.DataCollectScriptConfigure',
      'com.bsoft.etl_mcentre.front.lib.codemirror.codemirror'
    ],
    deps: [
      'com.bsoft.etl_mcentre.front.lib.codemirror.codemirror',
      'com.bsoft.etl_mcentre.front.lib.codemirror.sql'
    ]
  },
  function (html) {
    Vue.component('collect-config', {
      template: html,
      props: ['toScriptData', 'sonValue', 'scriptNames'],

      watch: {
        // 监听器
        filterText: function (val) {
          console.log(vueConf)
          console.log(me)
          clearTimeout(vueConf.data.settime)
          vueConf.data.settime = setTimeout(() => {
            me.vue.$refs.leftTree.filter(val)
          }, 500)
        },

        toScriptData: {
          handler (newVal, oldVal) {
            console.log('newVal', newVal)
            this.toScriptDataNew = newVal
          },
          immediate: true,
          deep: true // 表示开启深度监听
        },

        sonValue: {
          handler (newVal, oldVal) {
            this.sonValueNew = newVal
          },
          immediate: true,
          deep: true // 表示开启深度监听
        },

        scriptNames: {
          handler (newVal, oldVal) {
            console.log('newVal', newVal)
            if (newVal == undefined) {
              this.formInline.catalogName = ''
              this.formInline.dataCollectScriptName = ''
            } else {
              this.formInline.catalogName = newVal
              this.cancelConfirmCatalogName = newVal
              this.formInline.dataCollectScriptName = newVal
            }
          },
          immediate: true,
          deep: true // 表示开启深度监听
        }
      },

      data () {
        return {
          cancelConfirmCatalogName: '',
          expandOnClickNode: false,
          toScriptDataNew: {},
          sonValueNew: '',
          setTime: null,
          descInfo: {},
          descriptionDialog: false,
          dome: 'xxxx',
          domeSelectThree: [],
          domeSelectFour: [],
          selectVarData: [
            {
              value: '12',
              label: 'VARCHAR'
            },
            {
              value: '2003',
              label: 'ARRAY'
            },
            {
              value: '-13',
              label: 'BFILE'
            },
            {
              value: '-5',
              label: 'BIGINT'
            },
            {
              value: '-2',
              label: 'BINARY'
            },
            {
              value: '-7',
              label: 'BIT'
            },
            {
              value: '2004',
              label: 'BLOB'
            },
            {
              value: '16',
              label: 'BOOLEAN'
            },
            {
              value: '1',
              label: 'CHAR'
            },
            {
              value: '2005',
              label: 'CLOB'
            },
            {
              value: '-10',
              label: 'CURSOR'
            },
            {
              value: '91',
              label: 'DATE'
            },
            {
              value: '3',
              label: 'DECIMAL'
            },
            {
              value: '8',
              label: 'DOUBLE'
            },
            {
              value: '6',
              label: 'FLOAT'
            },
            {
              value: '4',
              label: 'INTEGER'
            },
            {
              value: '-104',
              label: 'INTERVALDS'
            },
            {
              value: '-103',
              label: 'INTERVALYM'
            },
            {
              value: '-16',
              label: 'LONGNVARCHAR'
            },
            {
              value: '-4',
              label: 'LONGVARBINARY'
            },
            {
              value: '-1',
              label: 'LONGVARCHAR'
            },
            {
              value: '-15',
              label: 'NCHAR'
            },
            {
              value: '2011',
              label: 'NCLOB'
            },
            {
              value: '2',
              label: 'NUMBER'
            },
            // {
            //   value: '2',
            //   label: 'NUMERIC'
            // },
            {
              value: '-9',
              label: 'NVARCHAR'
            },
            {
              value: '2007',
              label: 'OPAQUE'
            },
            {
              value: '1111',
              label: 'OTHER'
            },
            {
              value: '-2',
              label: 'RAW'
            },
            {
              value: '7',
              label: 'REAL'
            },
            {
              value: '2006',
              label: 'REF'
            },
            {
              value: '-8',
              label: 'ROWID'
            },
            {
              value: '5',
              label: 'SMALLINT'
            },
            {
              value: '2009',
              label: 'SQLXML'
            },
            {
              value: '2002',
              label: 'STRUCT'
            },
            {
              value: '92',
              label: 'TIME'
            },
            {
              value: '93',
              label: 'TIMESTAMP'
            },
            {
              value: '-102',
              label: 'TIMESTAMPLTZ'
            },
            {
              value: '-100',
              label: 'TIMESTAMPNS'
            },
            {
              value: '-101',
              label: 'TIMESTAMPTZ'
            },
            {
              value: '-6',
              label: 'TINYINT'
            },
            {
              value: '-3',
              label: 'VARBINARY'
            }
          ],
          view: '1',
          type: '1', //1为新增 2为复制
          selectDomeData: [
            {
              value: 'IN'
            },
            {
              value: 'OUT'
            }
          ],
          load: false,
          rightLoad: false,
          settime: null,
          filterText: '',
          treeLeftData: [],
          treeRightData: [],
          defaultProps: {
            children: 'children',
            label: 'name'
          },
          defaultPropsTwo: {
            children: 'children',
            label: 'text'
          },
          activeName: '1',
          radioOne: 1,
          radioTwo: 1,
          textareaLast: '',
          list: 1,
          storageNameRight: '', //日志采集-存储过程-姓名
          tableRight: [
            //日志采集-存储过程-表格数据
            {
              num: '参数1',
              name: 'STARTTIME(开始时间)',
              cs: 'IN',
              sj: 'DATE'
            },
            {
              num: '参数2',
              name: 'ENDTIME(截止时间)',
              cs: 'IN',
              sj: 'DATE'
            },
            {
              num: '参数3',
              name: 'rs_cursor(返回结果)',
              cs: 'OUT',
              sj: 'CURSOR'
            }
          ],
          leftData: {},
          rightTreeData: {},
          addScriptDialog: false, //新增脚本弹框
          addScriptData: {
            catalogCode: '',
            catalogName: '',
            version: ''
          },
          rules: {
            catalogCode: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
              {
                min: 1,
                max: 30,
                message: '长度不超过30个字符',
                trigger: 'blur'
              }
            ],
            catalogName: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
              {
                min: 1,
                max: 30,
                message: '长度不超过30个字符',
                trigger: 'blur'
              }
            ],
            version: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
              {
                min: 1,
                max: 30,
                message: '长度不超过30个字符',
                trigger: 'blur'
              }
            ],
            sqlName: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
              {
                min: 1,
                max: 30,
                message: '长度不超过30个字符',
                trigger: 'blur'
              }
            ],
            element: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
              {
                min: 1,
                max: 30,
                message: '长度不超过30个字符',
                trigger: 'blur'
              }
            ],
            alias: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
              {
                min: 1,
                max: 30,
                message: '长度不超过30个字符',
                trigger: 'blur'
              }
            ],
            description: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              },
              {
                min: 1,
                max: 30,
                message: '长度不超过30个字符',
                trigger: 'blur'
              }
            ]
          },
          sjcjRadio: 1,
          addSQLData: {
            sqlName: ''
          },
          addSQLDialog: false,
          deleteSQLDialog: false,
          sqlData: {
            fieldList: [],
            sqlFrom: '',
            sqlWhere: ''
          },
          noSqlData: {
            fieldList: []
          },
          saveName: '',
          saveParameter: [],
          addLSFieldData: {
            element: '',
            alias: '',
            description: ''
          },
          addLSFieldDataRules: {
            element: [
              {
                required: true,
                message: '请输入字段标识',
                trigger: 'blur'
              }
            ],
            alias: [
              {
                required: true,
                message: '请输入字段名称',
                trigger: 'blur'
              }
            ]
            // description: [
            //   {
            //     required: true,
            //     message: '描述信息',
            //     trigger: 'blur'
            //   }
            // ]
          },
          addLSFieldDialog: false,
          deleteLSFieldDialog: false,
          deleteLSFieldData: {},
          viewSql: '',
          viewNoSql: '',
          rzcdData: {},
          formInline: {
            catalogId: null,
            catalogName: '',
            dataCollectScriptName: ''
          },
          implementScripts: [],
          ruleForm: {
            dataOrigin: ''
          },
          rules: {
            dataOrigin: [
              {
                required: true,
                message: '请输入活动名称',
                trigger: 'blur'
              }
            ]
          },

          isScript: null,
          defaultPropsSourceId: {
            children: 'children',
            label: 'text'
          },
          dataOrigins: [],
          logDataSourceIdName: '',
          isScriptShow: false,
          systemDomain: '',
          newObjData: [],
          // 数据采集测试
          dataCollectTestDialogVisible: false,
          dataCollectTestDialogVisible: false,
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
          uploadIsChecked: false,
          dataCollectTestDialogesVisible: false,
          testInformation: '',
          htmlOption: '',
          showRightSql: false
          // isShowFunctionBtn: false
        }
      },

      methods: {
        filterSelect (e) {
          console.log('eeee', e)
          this.formInline.catalogName = e
        },
        goBackFather () {
          if (this.view == '2') {
            console.log(document.getElementsByClassName('CodeMirror'))
            if (document.getElementsByClassName('CodeMirror')[0]) {
              document.getElementsByClassName('CodeMirror')[0].remove()
            }
          }
          this.$emit('goBackFather', true)
          console.log(this.view, '1231')
        },
        selectCatalogName (val) {
          // debugger
          this.isScriptShow = true
          // this.isShowFunctionBtn = true
          console.log('val122', val)
          this.formInline.catalogId = val
          const catalogNames = this.implementScripts.find(
            item => item.id == val
          )
          this.formInline.catalogName = catalogNames.catalogName
          this.getScriptTemplate()
          setTimeout(() => {
            this.$nextTick(() => {
              if (document.getElementsByClassName('CodeMirror')[0]) {
                document.getElementsByClassName('CodeMirror')[0].remove()
              }
              // if (this.sjcjRadio == 1) {
              //   this.htmlOption = CodeMirror.fromTextArea(
              //     document.querySelector('#editText'),
              //     {
              //       model: 'text/html',
              //       indentUnit: 2,
              //       smartIndent: true,
              //       tabSize: 4,
              //       readOnly: false,
              //       showCursorWhenSelecting: true,
              //       lineNumbers: true,
              //       firstLineNumber: 1
              //     }
              //   )
              //   this.htmlOption.setValue(this.viewSql)
              // } else if (this.sjcjRadio == 0) {
              //   this.htmlOption = CodeMirror.fromTextArea(
              //     document.querySelector('#editText2'),
              //     {
              //       model: 'text/html',
              //       indentUnit: 2,
              //       smartIndent: true,
              //       tabSize: 4,
              //       readOnly: false,
              //       showCursorWhenSelecting: true,
              //       lineNumbers: true,
              //       firstLineNumber: 1
              //     }
              //   )
              //   this.htmlOption.setValue(this.viewNoSql)
              // }
            })
          })
        },
        // 测试
        collectTest () {
          this.dataCollectTestDialogVisible = true
          // this.dataCollectTestDialogForm = {}
          this.dataCollectTestDialogForm = {
            appointSourceId: '',
            recordTime: '',
            ifUpLoad: ''
          }
        },

        /**
         * @desc 数据采集测试sql
         * @param {string} taskId 采集任务id(是)
         * @param {string} sourceId 测试sql用的id(是)
         * @param {Int} ifUpload 是否上传(是)
         * @param {string} effective 上传时间(否)
         */
        dataCollectTest () {
          console.log(this.dataCollectTestDialogForm.ifUpLoad, '12313')
          this.$refs.dataCollectTestDialogForms.validate(valid => {
            if (valid) {
              $ajax({
                url: 'api/etl_mcentre.dataTaskManageRpcService/testSql',

                jsonData: [
                  {
                    taskId: String(this.toScriptDataNew.ID),
                    sourceId: this.dataCollectTestDialogForm.appointSourceId,
                    ifUpLoad:
                      this.dataCollectTestDialogForm.ifUpLoad == false ||
                      this.dataCollectTestDialogForm.ifUpLoad == ''
                        ? '0'
                        : '1',
                    effectiveTime: this.dataCollectTestDialogForm.recordTime
                  }
                ]
              }).then(res => {
                if (res.code === 200) {
                  this.dataCollectTestDialogVisible = false
                  this.testInformation = res.body.data
                  this.dataCollectTestDialogesVisible = true
                }
              })
            }
          })
        },
        // 数据源
        SelectSourceId (val) {
          console.log('val', val)
          if (!val.children) {
            this.logDataSourceIdName = val.text
            this.ruleForm.dataOrigin = val.id
            this.$refs.selectTree.blur()
          } else {
            this.$message.warning('只能选择第二级节点')
            this.logDataSourceIdName = ''
            this.ruleForm.dataOrigin = ''
          }
        },

        // 获取数据源
        // 新增日志采集-获取数据源数据
        getLogDataSourceId () {
          $ajax({
            url: 'api/etl_mcentre.configSqlRpcService/queryDataSource',
            jsonData: []
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.dataOrigins = JSON.parse(res.body.data)
              console.log('this.dataOrigins', this.dataOrigins)
              JSON.parse(res.body.data).forEach(items => {
                if (items.children) {
                  let dataOriginId = items.children.filter(
                    item => item.id == this.ruleForm.dataOrigin
                  )
                  if (dataOriginId.length > 0) {
                    this.logDataSourceIdName = dataOriginId[0].text
                  }
                }
              })
            }
          })
        },
        cancelConfirm () {
          console.log(this.toScriptDataNew, '123123')
          this.getRightTreeData()
          console.log(this.cancelConfirmCatalogName, '7788')
          this.formInline.catalogName = this.cancelConfirmCatalogName
          this.formInline.dataCollectScriptName = ''
          this.isScriptShow = false
          this.isScript = 0
          // this.isShowFunctionBtn = false
        },
        /**
         * @desc 从脚本仓库导入脚本
         * @param {Int} logTaskId 采集任务Id
         * @param {Int} catalogId 脚本仓库目录Id
         */
        /**
         * @desc 新增日志采集-获取执行脚本数据(获取SQL脚本目录)
         * @param {string} msgType 消息模型编号
         */
        importScript () {
          if (!this.formInline.catalogId) {
            this.$message.warning('执行脚本不能为空')
            return false
          }
          this.isScriptShow = false
          // this.isShowFunctionBtn = false
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/saveScript',
            jsonData: [
              {
                logTaskId: Number(this.toScriptDataNew.ID),
                catalogId: this.formInline.catalogId
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message.success(
                res.body.meta.message + '后请配置各sql数据源'
              )
              this.isScriptShow = false
              console.log('ruleForm.dataOrigin12', this.ruleForm.dataOrigin)
              if (this.ruleForm.dataOrigin === undefined) {
                this.logDataSourceIdName = ''
              }
              setTimeout(() => {
                this.getRightTreeData()
                // this.getScriptTemplate()
              }, 500)
            } else {
              this.$message.error(res.body.meta.message)
            }
          })

          this.isScript = 0
          setTimeout(() => {
            this.$nextTick(() => {
              if (document.getElementsByClassName('CodeMirror')[0]) {
                document.getElementsByClassName('CodeMirror')[0].remove()
              }
              // if (this.sjcjRadio == 1) {
              //   this.htmlOption = CodeMirror.fromTextArea(
              //     document.querySelector('#editText'),
              //     {
              //       model: 'text/html',
              //       indentUnit: 2,
              //       smartIndent: true,
              //       tabSize: 4,
              //       readOnly: false,
              //       showCursorWhenSelecting: true,
              //       lineNumbers: true,
              //       firstLineNumber: 1
              //     }
              //   )
              //   this.htmlOption.setValue(this.viewSql)
              // } else if (this.sjcjRadio == 0) {
              //   this.htmlOption = CodeMirror.fromTextArea(
              //     document.querySelector('#editText2'),
              //     {
              //       model: 'text/html',
              //       indentUnit: 2,
              //       smartIndent: true,
              //       tabSize: 4,
              //       readOnly: false,
              //       showCursorWhenSelecting: true,
              //       lineNumbers: true,
              //       firstLineNumber: 1
              //     }
              //   )
              //   this.htmlOption.setValue(this.viewNoSql)
              // }
            })
          })
        },

        getCataLogId () {
          $ajax({
            url: 'api/etl_mcentre.configSqlRpcService/getSqlCatalogByMsgType',
            jsonData: [
              {
                msgType: this.toScriptDataNew.TEMPLATEID
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.implementScripts = res.body.data
              if (res.body.data.length > 0) {
                console.log('res', res)
              }
              // 该数据里的id是catalogid
            }
          })
        },

        moveTreeNode (direction) {
          let me = this
          console.log('执行顺序direction', me.treeRightData)
          let node = this.$refs['rightTree'].getCurrentNode()
          console.log('当前被选中节点的data', node)
          if (!node) {
            this.$message.warning('请先选择一个节点再移动')
            return
          }
          this.changeTreeNodePosition(me.treeRightData, direction, node.id)
        },

        changeTreeNodePosition (treeData, direction, key) {
          // debugger
          for (let i = 0; i < treeData.length; i++) {
            if (treeData[i].id == key) {
              if (direction == 'top') {
                let topSql = false
                let topPara = false
                topSql = treeData.every(item => {
                  if (item.attributes.type == 'sql') {
                    return true
                  }
                })
                topPara = treeData.every(item => {
                  if (item.attributes.type == 'para') {
                    return true
                  }
                })
                if (topSql || topPara) {
                  if (i == 0) {
                    this.$message.warning('已经是第一个不允许上移')
                    return
                  } else {
                    //treeData[i] = treeData.splice(i - 1, 1, treeData[i])[0]
                    this.saveTreeNodePosition(
                      {
                        id: treeData[i].id,
                        logTaskId: treeData[i].attributes.taskId,
                        // logTaskId: treeData[i].attributes.taskId,
                        executeOrder:
                          Number(treeData[i].attributes.executeOrder) - 1 + ''
                      },
                      {
                        id: treeData[i - 1].id,
                        logTaskId: treeData[i - 1].attributes.taskId,
                        executeOrder:
                          Number(treeData[i - 1].attributes.executeOrder) +
                          1 +
                          ''
                      },
                      treeData[i].attributes.type
                    )
                    return
                  }
                } else {
                  let topflag = false
                  topflag = treeData.some(item => {
                    if (item.attributes.type == 'para') {
                      return true
                    }
                  })
                  if (topflag) {
                    treeData = treeData.filter(item => {
                      return item.attributes.type == 'para'
                    })
                  }
                  if (treeData.length - 1 == 0) {
                    this.$message.warning('已经是第一个不允许上移')
                    return
                  } else {
                    //treeData[i] = treeData.splice(i - 1, 1, treeData[i])[0]
                    this.saveTreeNodePosition(
                      {
                        id: treeData[i].id,
                        logTaskId: treeData[i].attributes.taskId,
                        // logTaskId: treeData[i].attributes.taskId,
                        executeOrder:
                          Number(treeData[i].attributes.executeOrder) - 1 + ''
                      },
                      {
                        id: treeData[i - 1].id,
                        logTaskId: treeData[i - 1].attributes.taskId,
                        executeOrder:
                          Number(treeData[i - 1].attributes.executeOrder) +
                          1 +
                          ''
                      },
                      treeData[i].attributes.type
                    )
                    return
                  }
                }
              } else {
                // debugger
                if (treeData[i].attributes.masterPara) {
                  // 子节点
                  if (i == treeData.length - 1) {
                    this.$message.warning('已经是最后一个不允许下移')
                    return
                  } else {
                    // treeData[i] = treeData.splice(i + 1, 1, treeData[i])[0];
                    this.saveTreeNodePosition(
                      {
                        id: treeData[i].id,
                        logTaskId: treeData[i].attributes.taskId,
                        executeOrder:
                          Number(treeData[i].attributes.executeOrder) + 1 + ''
                      },
                      {
                        id: treeData[i + 1].id,
                        logTaskId: treeData[i + 1].attributes.taskId,
                        executeOrder:
                          Number(treeData[i + 1].attributes.executeOrder) -
                          1 +
                          ''
                      },
                      treeData[i].attributes.type
                    )
                    return
                  }
                } else {
                  let flag = false
                  flag = treeData.some(item => {
                    if (item.attributes.type == 'sql') {
                      return true
                    }
                  })
                  if (flag) {
                    treeData = treeData.filter(item => {
                      return item.attributes.type == 'sql'
                    })
                  }
                  console.log(treeData, 'treeData')

                  if (i == treeData.length - 1) {
                    this.$message.warning('已经是最后一个不允许下移')
                    return
                  } else {
                    // treeData[i] = treeData.splice(i + 1, 1, treeData[i])[0];
                    this.saveTreeNodePosition(
                      {
                        id: treeData[i].id,
                        logTaskId: treeData[i].attributes.taskId,
                        executeOrder:
                          Number(treeData[i].attributes.executeOrder) + 1 + ''
                      },
                      {
                        id: treeData[i + 1].id,
                        logTaskId: treeData[i + 1].attributes.taskId,
                        executeOrder:
                          Number(treeData[i + 1].attributes.executeOrder) -
                          1 +
                          ''
                      },
                      treeData[i].attributes.type
                    )
                    return
                  }
                }
              }
            } else if (
              treeData[i].children &&
              treeData[i].children.length != 0
            ) {
              this.changeTreeNodePosition(treeData[i].children, direction, key)
            }
          }
        },

        /**
         * @desc 交换执行顺序
         * @param {string} id SQL主键id
         * @param {string} type 类型 sql:调整SQL顺序 para:调整目录顺序
         * @param {Int} logTaskId 任务id
         * @param {string} executeOrder 顺序
         */
        saveTreeNodePosition (sourceTreeNode, targetTreeNode, type) {
          $ajax({
            method: 'POST',
            url:
              'api/etl_mcentre.dataTaskManageRpcService/changeParaExecuteOrder',
            jsonData: [sourceTreeNode, targetTreeNode, type]
          })
            .then(res => {
              if (res.body.meta.statusCode == '200') {
                this.$message.success('移动成功')
                this.getRightTreeData()
                // this.getScriptTemplate()
                // this.getRzcj()
              } else {
                this.$message.error('移动失败')
              }
            })
            .catch(res => {
              // debugger
            })
        },
        leftTreeClick (e) {
          this.view = '1'
          this.radioChang()
          this.showRightSql = true
          //点击左侧表格 右侧树才会有
          console.log('e', e)
          this.leftData = e
          this.list = 1
          if (this.leftData.type) {
            this.textareaLast = ''
          }
          if (e.msgType && e.catalogName) {
            this.textareaLast = ''
            this.storageNameRight = ''
            this.rzcdData = {}
            this.getRightTreeData()
            // this.getScriptTemplate()
            this.getRzcj()
          }
        },
        changeHandler () {
          this.list = this.textareaLast.split('\n').length
        },
        rightTreeClick (e) {
          // debugger
          this.view = '1'
          this.radioChang()
          //点击右侧表格
          console.log('子树', e)
          if (!this.ruleForm.dataOrigin) {
            this.logDataSourceIdName = ''
          }
          this.rightTreeData = e
          if (e.attributes.type == 'sql') {
            this.sjcjRadio = e.attributes.sqlType - 0
            this.view = '1'
            if (this.isScript === 1) {
              this.getSelectSql()
            } else {
              this.clickRightTree()
              this.getDictionaryDomain()
            }
          }
        },

        /**
         * @desc 查询 Sql
         * @param {string} sqlId SQL主键id
         * @param {string} paraId 段落id
         * @param {string} msgType 模板id(同新增接口的templateid字段)
         */
        clickRightTree () {
          // debugger
          //获取右侧SQL展示内容
          $ajax({
            method: 'POST',
            url: 'api/etl_mcentre.dataTaskManageRpcService/querySelectSql',
            jsonData: [
              {
                sqlId: this.rightTreeData.id,
                paraId: this.rightTreeData.attributes.paraId,
                msgType: this.rightTreeData.attributes.templateId,
                organizationCode: this.sonValueNew,
                organization: this.toScriptDataNew.TEMPLATEORG,
                version: this.toScriptDataNew.TEMPLATEVERSION
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              // debugger
              console.log('右侧SQL展示内容：', res.body.data)
              this.ruleForm.dataOrigin = res.body.data.sql.dataSourceId
              if (this.ruleForm.dataOrigin === undefined) {
                this.logDataSourceIdName = ''
              }
              console.log('点击右侧SQL', this.ruleForm.dataOrigin)
              this.dataOrigins.forEach(items => {
                if (items.children) {
                  let dataSourceIds = items.children.filter(
                    item => item.id == res.body.data.sql.dataSourceId
                  )
                  if (dataSourceIds.length > 0) {
                    this.logDataSourceIdName = dataSourceIds[0].text
                  }
                }
              })

              this.sqlData = res.body.data.sql
              this.sqlData.fieldList.forEach((item, index) => {
                if (item.domain && item.version) {
                  item.buess = item.domain
                  let data = {
                    organizationCode: this.sonValueNew,
                    domain: item.domain,
                    dicCode: this.sqlData.fieldList[index].dicId
                  }
                  this.getDictionaryVersions(data, index)
                  setTimeout(() => {
                    this.domeSelectFour.forEach(items => {
                      items.forEach(itm => {
                        if (itm.code == item.version) {
                          this.$set(item, 'ver', itm.value)
                        }
                      })
                    })
                  }, 200)
                }
              })
              this.noSqlData = res.body.data.noSql
              this.saveName = res.body.data.procedure.callName
                ? res.body.data.procedure.callName
                : ''
              var callParameter = res.body.data.procedure.callParameter
                ? res.body.data.procedure.callParameter
                : []
              if (callParameter == '[]' || callParameter == []) {
                this.saveParameter = []
              } else {
                this.saveParameter = callParameter
                // var a = callParameter
                // var arr = []
                // a = JSON.stringify(a).split('')
                // a.shift()
                // a.pop()
                // var b = ''
                // // debugger
                // a.some((item, k) => {
                //   if (item !== '{' && item !== '[') {
                //     if (item == '}') {
                //       arr.push(b)
                //       b = ''
                //     } else {
                //       b = b + item
                //     }
                //   }
                // })
                // var arrs = []
                // arr.some(item => {
                //   var obj = {}
                //   var e = item.split(',')
                //   e.some(dome => {
                //     //[cPName=11,cPFormat=IN,cPType=12]
                //     if (dome && dome != '') {
                //       //cPName=11
                //       var data = dome.split('=')
                //       obj[data[0]] = data[1]
                //     }
                //   })
                //   arrs.push(obj)
                // })
                // this.saveParameter = arrs
              }
              this.rightLoad = false
            } else {
              this.rightLoad = false
            }
          })
        },

        /**
         * @desc 查询语句树
         * @param {Int} logTaskId 任务名称 查询列表接口(queryTaskList)返回的id
         * @param {string} msgType 模板id(同新增接口的templateid字段)
         */
        getRightTreeData () {
          $ajax({
            method: 'POST',
            url:
              'api/etl_mcentre.dataTaskManageRpcService/querySqlTreeOfTemplate',
            jsonData: [
              {
                logTaskId: Number(this.toScriptDataNew.ID),
                msgType: this.toScriptDataNew.TEMPLATEID,
                org: this.toScriptDataNew.TEMPLATEORG,
                version: this.toScriptDataNew.TEMPLATEVERSION
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.treeRightData = res.body.data
              this.rightTreeData = {}
              this.view = '1'
              this.sqlData = {
                fieldList: [],
                sqlFrom: '',
                sqlWhere: ''
              }
              this.noSqlData = {
                fieldList: []
              }
              this.saveName = ''
              this.saveParameter = []
              this.viewSql = ''
              this.viewNoSql = ''
              this.sjcjRadio = 1
              this.rightLoad = false
            } else {
              this.rightLoad = false
            }
          })
        },

        getRzcj () {
          //获取日志采集信息
          $ajax({
            method: 'POST',
            url: 'api/etl_mcentre.configSqlRpcService/queryLogCollectSql',
            jsonData: [
              {
                catalogId: this.leftData.id
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('日志采集数据：', res.body.data)
              this.rzcdData =
                res.body.data && res.body.data != null ? res.body.data : {}
              // if(this.rzcdData.sqlType=='1'){
              // }else if(this.rzcdData.sqlType=='2'){
              // }
              this.radioTwo = this.rzcdData.sqlType - 0
              this.textareaLast = this.rzcdData.sql
              this.storageNameRight = this.rzcdData.callName
              if (this.rzcdData.sql) {
                this.list = this.textareaLast.split('\n').length
              } else {
                this.list = 1
              }
            }
          })
        },

        /**
         * @desc 查看字段描述信息
         * @param {string} msgType 模板id
         * @param {string} fieldId 字段主键id
         * @param {string} paraId 段落id
         */
        inDome (e) {
          console.log('进入----', this.rightTreeData)
          clearTimeout(this.setTime)
          this.setTime = setTimeout(() => {
            $ajax({
              url: 'api/etl_mcentre.dataTaskManageRpcService/getDescription',
              jsonData: [
                {
                  msgType: this.rightTreeData.attributes.templateId,
                  paraId: this.rightTreeData.attributes.paraId,
                  fieldId: e.fieldId,
                  organization: this.toScriptDataNew.TEMPLATEORG,
                  version: this.toScriptDataNew.TEMPLATEVERSION
                }
              ]
            }).then(res => {
              if (res.body.meta.statusCode == '200') {
                console.log('右下角信息', res.body.data)
                this.descInfo = res.body.data
                this.descInfo.fieldId = e.fieldId
                this.descriptionDialog = true
              } else {
              }
            })
          }, 300)
        },

        outDome (e) {
          clearTimeout(this.setTime)
          if (e.dicId) {
            this.descriptionDialog = false
          }
        },
        addScript () {
          //打开新增脚本框
          this.type = '1'
          this.addScriptData = {
            catalogCode: '',
            catalogName: '',
            version: ''
          }
          this.addScriptDialog = true
          this.$nextTick(() => {
            this.$refs['addScript'].resetFields()
          })
        },
        copyScript () {
          //打开复制脚本框
          this.type = '2'
          this.addScriptData = {
            catalogCode: this.leftData.catalogCode,
            catalogName: this.leftData.catalogName,
            version: this.leftData.version,
            id: this.leftData.id,
            msgType: this.leftData.msgType
          }
          this.addScriptDialog = true
          this.$nextTick(() => {
            this.$refs['addScript'].resetFields()
          })
        },
        addScriptYes () {
          //新增脚本框确定
          this.$refs['addScript'].validate(valid => {
            if (valid) {
              if (this.type == '1') {
                this.addScriptData.msgType = this.leftData.msgType
                $ajax({
                  method: 'POST',
                  url:
                    'api/etl_mcentre.configSqlRpcService/saveConfigSqlCatalog',
                  jsonData: [this.addScriptData]
                }).then(res => {
                  console.log(res)
                  if (res.body.meta.statusCode == '200') {
                    this.$message.success('新增成功')
                    this.addScriptDialog = false
                    this.getLeftTreeData()
                  } else {
                    this.$message.error('新增失败')
                  }
                })
              } else if (this.type == '2') {
                $ajax({
                  method: 'POST',
                  url:
                    'api/etl_mcentre.configSqlRpcService/copyConfigSqlCatalog',
                  jsonData: [this.addScriptData]
                }).then(res => {
                  console.log(res)
                  if (res.body.meta.statusCode == '200') {
                    this.$message.success('复制成功')
                    this.addScriptDialog = false
                    this.getLeftTreeData()
                  } else {
                    this.$message.error('复制失败')
                  }
                })
              }
            } else {
              return false
            }
          })
        },
        addSql () {
          console.log('rightTreeData', this.rightTreeData)
          //打开新增SQL框
          if (!this.rightTreeData.id) {
            this.$message.error('请选择SQL')
            return
          }
          if (
            (this.rightTreeData.text == '消息头' &&
              this.rightTreeData.attributes.type &&
              this.rightTreeData.attributes.type == 'para' &&
              this.rightTreeData.children.length > 0) ||
            (this.rightTreeData.attributes.paraName == '消息头' &&
              this.rightTreeData.attributes.type &&
              this.rightTreeData.attributes.type == 'sql')
          ) {
            this.$message.error('消息头只能有一条SQL')
          } else {
            this.type = '1'
            this.addSQLData = {
              sqlName: ''
            }
            this.addSQLDialog = true
            this.$nextTick(() => {
              this.$refs['addSQL'].resetFields()
            })
          }
        },
        editSql () {
          //打开修改SQL框
          if (!this.rightTreeData.id) {
            this.$message.error('请选择SQL')
            return
          }
          if (
            this.rightTreeData.attributes.type &&
            this.rightTreeData.attributes.type == 'sql'
          ) {
            this.type = '2'
            this.addSQLDialog = true
            this.$nextTick(() => {
              this.$refs['addSQL'].resetFields()
              this.$set(this.addSQLData, 'sqlName', this.rightTreeData.text)
            })
          } else {
            this.$message.error('请选择SQL')
          }
        },

        /**
         * @desc 新增 Sql
         * @param {string} operation 操作类型 update:更新 add:新增
         * @param {string} sqlName SQL名称
         * @param {string} id SQL主键id 操作类型为更新时必填
         * @param {Int} logTaskId 任务id 新增时必填
         * @param {string} paraId 段落id 新增时必填
         * @param {string} datasourceId 数据源id
         * @param {string} masterSql 主SQLid 新增时选填
         */
        addSQLYes () {
          //新增SQL框确定
          this.$refs['addSQL'].validate(valid => {
            if (valid) {
              if (this.type == '1') {
                //添加SQL
                var data = {
                  operation: 'add',
                  logTaskId: Number(this.toScriptDataNew.ID),
                  paraId: this.rightTreeData.attributes.paraId,
                  sqlName: this.addSQLData.sqlName
                }
                if (this.rightTreeData.attributes.type == 'sql') {
                  data.masterSql = this.rightTreeData.id
                }
                $ajax({
                  method: 'POST',
                  url: 'api/etl_mcentre.dataTaskManageRpcService/addSql',
                  jsonData: [data]
                }).then(res => {
                  console.log(res)
                  if (res.body.meta.statusCode == '200') {
                    this.$message.success('新增成功')
                    this.addSQLDialog = false
                    this.getRightTreeData()
                    // this.getScriptTemplate()
                  } else {
                    this.addSQLDialog = false
                    this.$message.error('新增失败')
                  }
                })
              } else if (this.type == '2') {
                //修改SQL
                $ajax({
                  method: 'POST',
                  url: 'api/etl_mcentre.dataTaskManageRpcService/addSql',
                  jsonData: [
                    {
                      operation: 'update',
                      id: this.rightTreeData.id,
                      datasourceId: this.ruleForm.dataOrigin,
                      sqlName: this.addSQLData.sqlName
                    }
                  ]
                }).then(res => {
                  console.log(res)
                  if (res.body.meta.statusCode == '200') {
                    this.$message.success('修改成功')
                    this.addSQLDialog = false
                    this.rightTreeData.text = this.addSQLData.sqlName
                    this.getRightTreeData()
                    // this.getScriptTemplate()
                  } else {
                    this.addSQLDialog = false
                    this.$message.error('修改失败')
                  }
                })
              }
            } else {
              return false
            }
          })
        },

        deleteSql () {
          //打开删除SQL框
          if (!this.rightTreeData.id) {
            this.$message.error('请选择SQL')
            return
          }
          if (
            this.rightTreeData.attributes.type &&
            this.rightTreeData.attributes.type == 'sql'
          ) {
            this.deleteSQLDialog = true
          } else {
            this.$message.error('请选择SQL')
          }
        },

        /**
         * @desc 删除 Sql
         * @param {string} id SQL主键id
         */
        deleteSqlYes () {
          $ajax({
            method: 'POST',
            url: 'api/etl_mcentre.dataTaskManageRpcService/deleteSql',
            jsonData: [
              {
                id: this.rightTreeData.id
              }
            ]
          }).then(res => {
            console.log(res)
            if (res.body.meta.statusCode == '200') {
              this.$message.success('删除成功')
              this.deleteSQLDialog = false
              this.getRightTreeData()
              // this.getScriptTemplate()
            } else {
              this.deleteSQLDialog = false
              this.$message.error('删除失败')
            }
          })
        },

        addLSField () {
          //打开新增临时字段框
          this.type = '1'
          ;(this.addLSFieldData = {
            element: '',
            alias: '',
            description: ''
          }),
            (this.addLSFieldDialog = true)
          this.$nextTick(() => {
            this.$refs['addLSFieldData'].resetFields()
          })
        },
        editLSField (e) {
          //打开修改临时字段框
          console.log('修改临时添加字段', e)
          this.type = '2'
          this.addLSFieldDialog = true
          this.$nextTick(() => {
            this.$refs['addLSFieldData'].resetFields()
            // this.addLSFieldData={element:e.fieldId,alias:e.fieldName,description:e.description?e.description:""}
            this.$set(this.addLSFieldData, 'element', e.fieldId)
            this.$set(this.addLSFieldData, 'alias', e.fieldName)
            this.$set(this.addLSFieldData, 'transientId', e.transientId)
            this.$set(
              this.addLSFieldData,
              'description',
              e.description ? e.description : ''
            )
          })
        },

        /**
         * @desc 新增临时字段/修改临时字段
         * @param {string} sqlId SQL主键id
         * @param {string} paraId 段落id
         * @param {string} alias 临时字段中文名
         * @param {string} element 临时字段英文名
         * @param {string} description 描述
         */
        /**
         * @desc 新增临时字段/修改临时字段
         * @param {string} id 临时字段主键id
         * @param {string} alias 临时字段中文名
         * @param {string} element 临时字段英文名
         * @param {string} description 描述
         */
        addLSFieldYes () {
          //新增or修改临时字段确认框
          this.$refs['addLSFieldData'].validate(valid => {
            if (valid) {
              if (this.type == '1') {
                //新增临时字段
                var data = {
                  sqlId: this.rightTreeData.id,
                  paraId: this.rightTreeData.attributes.paraId,
                  alias: this.addLSFieldData.alias,
                  element: this.addLSFieldData.element,
                  description: this.addLSFieldData.description
                }
                $ajax({
                  method: 'POST',
                  url:
                    'api/etl_mcentre.dataTaskManageRpcService/addTransientField',
                  jsonData: [data]
                }).then(res => {
                  console.log(res)
                  if (res.body.meta.statusCode == '200') {
                    this.$message.success('新增成功')
                    this.addLSFieldDialog = false
                    this.clickRightTree()
                  } else {
                    this.addLSFieldDialog = false
                    this.$message.error('新增失败')
                  }
                })
              } else if (this.type == '2') {
                //修改临时字段
                $ajax({
                  method: 'POST',
                  url:
                    'api/etl_mcentre.dataTaskManageRpcService/updateTransientField',
                  jsonData: [
                    {
                      id: this.addLSFieldData.transientId,
                      alias: this.addLSFieldData.alias,
                      element: this.addLSFieldData.element,
                      description: this.addLSFieldData.description
                    }
                  ]
                }).then(res => {
                  console.log(res)
                  if (res.body.meta.statusCode == '200') {
                    this.$message.success('修改成功')
                    this.clickRightTree()
                    this.addLSFieldDialog = false
                  } else {
                    this.addLSFieldDialog = false
                    this.$message.error('修改失败')
                  }
                })
              }
            } else {
              return false
            }
          })
        },

        deleteLSField (e) {
          console.log('删除临时字段', e)
          //打开删除临时字段确认框
          this.deleteLSFieldData = e
          this.deleteLSFieldDialog = true
        },

        /**
         * @desc 删除临时字段
         * @param {Int} id 临时字段主键id
         */
        deleteLSFieldYes () {
          //确定删除临时字段
          $ajax({
            method: 'POST',
            url:
              'api/etl_mcentre.dataTaskManageRpcService/deleteTransientField',
            jsonData: [
              {
                id: this.deleteLSFieldData.transientId
              }
            ]
          }).then(res => {
            console.log(res)
            if (res.body.meta.statusCode == '200') {
              this.$message.success('删除成功')
              this.clickRightTree()
              this.deleteLSFieldDialog = false
            } else {
              this.deleteLSFieldDialog = false
              this.$message.error('删除失败')
            }
          })
        },

        /**
         * @desc 保存数据采集 Sql 语句
         * @param {string} sqlType SQL类型 0:非SQL型界面 1:SQL型界面 2:存储过程
         * @param {string} sqlId SQL主键id
         * @param {string} sqlSelect SQL语句select段落 sqltype为0,1必填(非必须)
         * @param {string} sqlFrom SQL语句from段落 sqltype为0,1必填(非必须)
         * @param {string} sqlWhere SQL语句wheret段落(非必须)
         * @param {string} datasourceId 数据源id
         * @param {string} callName 存储过程名称 sqltype为2必填(非必须)
         * @param {string} callParameter 存储过程参数 sqltype为2选填(非必须)
         */
        sjSave () {
          //数据采集-保存
          // debugger
          if (!this.rightTreeData.id) {
            this.$message.error('请先选中一条sql')
            return
          }
          if (!this.formInline.catalogName) {
            this.$message.error('执行脚本名称不能为空')
            return false
          }
          // debugger
          if (this.rightTreeData.attributes.type == 'sql') {
            if (this.view == '1') {
              if (
                this.sqlData.sqlFrom == '' &&
                this.rightTreeData.attributes.sqlType == '1' &&
                this.sjcjRadio == '1'
              ) {
                this.$message({
                  message: 'FROM 字段不能为空!',
                  duration: '1000',
                  type: 'warning'
                })
                return
              }
              //判断必填项 是否为空
              if (this.sjcjRadio == '1') {
                //  SQL型界面
                var f = 0
                this.sqlData.fieldList.some(item => {
                  if (item.isNeed == '1' && item.fieldValue == '') {
                    f = 1
                  }
                })
                if (f == 1 && this.sjcjRadio != '2') {
                  this.$message({
                    message: '请填入必填项再保存！',
                    duration: '1000',
                    type: 'warning'
                  })
                  return
                }
              } else if (this.sjcjRadio == '0') {
                // 非SQL型界面
                var f = 0
                this.noSqlData.fieldList.some(item => {
                  if (item.isNeed == '1' && item.fieldValue == '') {
                    f = 1
                  }
                })
                if (f == 1 && this.sjcjRadio != '2') {
                  this.$message({
                    message: '请填入必填项再保存！',
                    duration: '1000',
                    type: 'warning'
                  })
                  return
                }
              }
            } else {
              // var dome = this.viewSql
              var dome = this.htmlOption.getValue()
              var mm = dome.toUpperCase()
              // if (this.rightTreeData.attributes.sqlType == '1') {
              //   if (
              //     mm.indexOf('#FROM') == -1 ||
              //     (mm.indexOf('#WHERE') == -1 && this.sqlData.sqlWhere !== '')
              //   ) {
              //     this.$message.warning("请用'#FROM'或'#WHERE'分割")
              //     return
              //   }
              // }
              if (this.sjcjRadio == 1) {
                if (
                  mm.indexOf('#FROM') == -1 ||
                  (mm.indexOf('#WHERE') == -1 && this.sqlData.sqlWhere !== '')
                ) {
                  this.$message.warning("请用'#FROM'或'#WHERE'分割")
                  return
                }
              }

              //将from 和 where 都转成大写
              if (dome.indexOf('#') != -1) {
                var a = dome.split('#')[1].substring(0, 4)
                dome = dome.replace(a, 'FROM')
                if (dome.split('#')[2] != null) {
                  var b = dome.split('#')[2].substring(0, 5)
                  dome = dome.replace(b, 'WHERE')
                }
              }

              var domeA = dome
                .replaceAll(' as ', ' AS ')
                .replaceAll(' As ', ' AS ')
                .replaceAll(' aS ', ' AS ')
              var arr = []

              var dome1 = domeA
                .split('#FROM')[0]
                .substring(7)
                .split(',\n')
              dome1[dome1.length - 1] = dome1[dome1.length - 1].substring(
                0,
                dome1[dome1.length - 1].length - 1
              )
              dome1.some(item => {
                var datas = item.split(' AS ')
                console.log(datas, datas.length)
                if (datas[0] == "''" || datas[0] == '""') {
                  datas[0] = ''
                }
                if (datas.length == 2) {
                  arr.push({
                    fieldValue: datas[0].trim(),
                    fieldId: datas[1].trim()
                  })
                } else {
                  var str = item.replace(
                    ' AS ' + datas[[datas.length - 1]].trim(),
                    ''
                  )
                  arr.push({
                    fieldValue: str,
                    fieldId: datas[[datas.length - 1]].trim()
                  })
                }
              })
              var dome2 = ''
              var WHERE = ''
              var FROM = ''

              if (dome.indexOf('#FROM') != -1) {
                dome2 = dome.split('#FROM')[1]
                if (dome2.split('#WHERE').length > 1) {
                  FROM = dome2.split('#WHERE')[0]
                  WHERE = dome2.split('#WHERE')[1]
                  WHERE = WHERE.split('')
                  WHERE.shift()
                  WHERE = WHERE.join('')
                  FROM = FROM.split('')
                  FROM.shift()
                  FROM.pop()
                  FROM = FROM.join('')
                } else {
                  FROM = dome2
                  FROM = FROM.split('')
                  FROM.shift()
                  FROM = FROM.join('')
                }
              }
              var showData = []
              var needData = []
              this.sqlData.fieldList.some(item => {
                showData.push(item.fieldId.trim())
                if (item.isNeed == '1') needData.push(item.fieldId.trim())
              })
              var f = false
              var sqldata = []
              arr.some((item, num) => {
                sqldata.push(item.fieldId.trim())
                if (showData.indexOf(item.fieldId.trim()) == -1) {
                  //当添加新的字段的时候
                  f = true
                }
              })
              var n = false
              var str = ''
              needData.some(item => {
                if (sqldata.indexOf(item.trim()) == -1) {
                  //当添加新的字段的时候
                  if (str == '') {
                    str = item.trim()
                  } else {
                    str = item.trim() + ',' + str
                  }
                  n = true
                }
              })
              console.log(needData, sqldata)
              if (n == true) {
                this.$message.warning('请先添加必填字段:' + str)
                return
              }
              if (f == true) {
                this.$message.warning('添加字段请切换到sql视图！')
                return
              }
              arr.some(item => {
                this.sqlData.fieldList.some(dome => {
                  if (item.fieldId.trim() == dome.fieldId.trim()) {
                    this.$set(item, 'isTransient', dome.isTransient)
                    this.$set(item, 'isNeed', dome.isNeed)
                    this.$set(item, 'fieldName', dome.fieldName)
                  }
                })
              })

              this.sqlData.fieldList = arr
              this.sqlData.sqlFrom = FROM.trim()
              this.sqlData.sqlWhere = WHERE.trim()
            }
          }
          console.log('保存this.ruleForm.dataOrigin', this.ruleForm.dataOrigin)
          var data = {}
          if (this.sjcjRadio == 1) {
            console.log('this.rightTreeData', this.rightTreeData)
            data.sqlType = '1'
            data.datasourceId = this.ruleForm.dataOrigin
            data.sqlId = this.rightTreeData.id
            data.sqlFrom = this.sqlData.sqlFrom
            data.sqlWhere = this.sqlData.sqlWhere
            data.scriptName = this.formInline.catalogName
            data.sqlSelect = JSON.stringify(this.sqlData.fieldList)
            let arr = []
            this.newObjData.forEach(item => {
              let obj = {}
              obj.fieldId = item.fieldId
              obj.domain = item.buess
              obj.version = item.ver
              obj.organization = this.sonValueNew
              obj.dicCode = item.dicId
              arr.push(obj)
            })
            data.dic = arr
          } else if (this.sjcjRadio == 0) {
            if (this.view == '1') {
              // 文本视图
              data.sqlType = '0'
              data.datasourceId = this.ruleForm.dataOrigin
              data.sqlId = this.rightTreeData.id
              data.sqlFrom = this.noSqlData.sqlFrom
              data.sqlWhere = this.noSqlData.sqlWhere
              data.scriptName = this.formInline.catalogName
              data.sqlSelect = JSON.stringify(this.noSqlData.fieldList)
            } else {
              data.sqlType = '0'
              data.datasourceId = this.ruleForm.dataOrigin
              data.sqlId = this.rightTreeData.id
              data.sqlFrom = this.sqlData.sqlFrom
              data.sqlWhere = this.sqlData.sqlWhere
              data.scriptName = this.formInline.catalogName
              data.sqlSelect = JSON.stringify(this.sqlData.fieldList)
            }
          } else if (this.sjcjRadio == 2) {
            data.sqlType = '2'
            data.datasourceId = this.ruleForm.dataOrigin
            data.sqlId = this.rightTreeData.id
            data.callName = this.saveName
            data.scriptName = this.formInline.catalogName
            data.callParameter = '['
            this.saveParameter.some((item, key) => {
              var d = '{'
              d =
                d +
                'cPName=' +
                item.cPName +
                ',cPFormat=' +
                item.cPFormat +
                ',cPType=' +
                item.cPType
              d = d + '}, '
              data.callParameter = data.callParameter + d
            })
            data.callParameter = data.callParameter.slice(
              0,
              data.callParameter.length - 2
            )
            data.callParameter = data.callParameter + ']'
          }
          console.log(data.callParameter, '778899')
          $ajax({
            method: 'POST',
            url: 'api/etl_mcentre.dataTaskManageRpcService/saveSql',
            jsonData: [data]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.$message.success('保存成功')
              this.rightTreeData.attributes.sqlType = data.sqlType
              this.view = '1'
              this.radioChang()
              this.clickRightTree()
              this.$emit('refreshData')
              this.logDataSourceIdName = ''
            } else {
              this.$message.error(res.body.meta.message)
            }
          })
        },
        rzSave () {
          //日志采集-保存
          if (!this.leftData.id) {
            this.$message.error('请先选中一条脚本')
            return
          }
          var data = {}
          if (this.rzcdData.id) {
            data.id = this.rzcdData.id
          }
          data.catalogId = this.leftData.id
          if (this.radioTwo == 1) {
            data.sql = this.textareaLast
            data.sqlType = '1'
          } else if (this.radioTwo == 2) {
            data.callName = this.storageNameRight
            data.sqlType = '2'
          }
          $ajax({
            method: 'POST',
            url: 'api/etl_mcentre.configSqlRpcService/saveLogCollectSql',
            jsonData: [data]
          }).then(res => {
            console.log('res', res)
            if (res.body.meta.statusCode == '200') {
              this.$message.success('保存成功')
              // this.rightTreeData.attributes.sqlType = data.sqlType
              // this.clickRightTree()
            } else {
              this.$message.error('保存失败')
            }
          })
        },

        /**
         * @desc 从脚本仓库获取目录
         * @param {Int} catalogId 脚本仓库ID
         * @param {String} msgType 消息模型代码
         */
        getScriptTemplate () {
          $ajax({
            method: 'POST',
            url: 'api/etl_mcentre.configSqlRpcService/querySqlTreeOfTemplate',
            jsonData: [
              {
                catalogId: this.formInline.catalogId,
                msgType: this.toScriptDataNew.TEMPLATEID
              }
            ]
          }).then(res => {
            console.log('从脚本仓库获取目录res', res)
            if (res.body.meta.statusCode == '200') {
              this.treeRightData = res.body.data
              this.isScript = res.body.data[0].isScript
              this.rightTreeData = {}
              this.view = '1'
              this.sqlData = {
                fieldList: [],
                sqlFrom: '',
                sqlWhere: ''
              }
              this.noSqlData = {
                fieldList: []
              }
              this.saveName = ''
              this.saveParameter = []
              this.viewSql = ''
              this.viewNoSql = ''
              this.sjcjRadio = 1
              this.rightLoad = false
            } else {
              this.rightLoad = false
            }
          })
        },

        /**
         * @desc 从采集脚本仓库查询SQL
         * @param {String} sqlId SQL主键id
         * @param {String} paraId 段落id
         * @param {String} msgType 模板id(同新增接口的templateid字段)
         */
        getSelectSql () {
          // debugger
          $ajax({
            method: 'POST',
            url: 'api/etl_mcentre.configSqlRpcService/querySelectSql',
            jsonData: [
              {
                sqlId: this.rightTreeData.id,
                paraId: this.rightTreeData.attributes.paraId,
                msgType: this.rightTreeData.attributes.templateId
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              this.sqlData = res.body.data.sql

              this.noSqlData = res.body.data.noSql
              this.saveName = res.body.data.procedure.callName
                ? res.body.data.procedure.callName
                : ''
              var callParameter = res.body.data.procedure.callParameter
                ? res.body.data.procedure.callParameter
                : []
              if (callParameter == '[]' || callParameter == []) {
                this.saveParameter = []
              } else {
                var a = callParameter
                var arr = []
                a = JSON.stringify(a).split('')
                a.shift()
                a.pop()
                var b = ''
                // debugger
                a.some((item, k) => {
                  if (item !== '{' && item !== '[') {
                    if (item == '}') {
                      arr.push(b)
                      b = ''
                    } else {
                      b = b + item
                    }
                  }
                })
                var arrs = []
                arr.some(item => {
                  var obj = {}
                  var e = item.split(',')
                  e.some(dome => {
                    //[cPName=11,cPFormat=IN,cPType=12]
                    if (dome && dome != '') {
                      //cPName=11
                      var data = dome.split('=')
                      obj[data[0]] = data[1]
                    }
                  })
                  arrs.push(obj)
                })
                this.saveParameter = arrs
              }
              this.rightLoad = false
            } else {
              this.rightLoad = false
            }
          })
        },
        deleteSaveParameter (index) {
          //删除存储过程的某行参数
          this.saveParameter.splice(index, 1)
        },

        radioChang () {
          // debugger
          if (this.view == '2' && this.sjcjRadio == 0) {
            setTimeout(() => {
              this.$nextTick(() => {
                if (document.getElementsByClassName('CodeMirror')[0]) {
                  document.getElementsByClassName('CodeMirror')[0].remove()
                }
                if (this.sjcjRadio == 1) {
                  this.htmlOption = CodeMirror.fromTextArea(
                    document.querySelector('#editText'),
                    {
                      model: 'text/x-sparksql',
                      indentWithTabs: false,
                      smartIndent: true,
                      lineNumbers: true,
                      matchBrackets: true,
                      cursorHeight: 1,
                      lineWrapping: true
                    }
                  )
                  this.htmlOption.setValue(this.viewSql)
                } else if (this.sjcjRadio == 0) {
                  this.htmlOption = CodeMirror.fromTextArea(
                    document.querySelector('#editText2'),
                    {
                      model: 'text/x-sparksql',
                      indentWithTabs: false,
                      smartIndent: true,
                      lineNumbers: true,
                      matchBrackets: true,
                      cursorHeight: 1,
                      lineWrapping: true
                    }
                  )
                  this.htmlOption.setValue(this.viewNoSql)
                }
              })
            })
            if (this.sjcjRadio == 2) {
              console.log(document.getElementsByClassName('CodeMirror'))
              if (document.getElementsByClassName('CodeMirror')[0]) {
                document.getElementsByClassName('CodeMirror')[0].remove()
              }
            }
          } else if (this.view == '2' && this.sjcjRadio == 1) {
          } else {
            console.log(document.getElementsByClassName('CodeMirror'))
            if (document.getElementsByClassName('CodeMirror')[0]) {
              document.getElementsByClassName('CodeMirror')[0].remove()
            }
          }
        },

        viewChange () {
          //文本视图-sql视图切换
          if (this.view == '1') {
            this.getViewSql()
          }
          this.view = this.view == '1' ? '2' : '1'
          if (this.view == '1' || this.sjcjRadio == 2) {
            console.log(document.getElementsByClassName('CodeMirror'))
            if (document.getElementsByClassName('CodeMirror')[0]) {
              document.getElementsByClassName('CodeMirror')[0].remove()
            }
          }
        },

        /**
         * @desc 查看数据采集 Sql
         * @param {string} msgType 模板id
         * @param {string} sqlId SQL主键id
         */
        getViewSql () {
          var viewSql = 'SELECT\n'
          if (this.sqlData.fieldList.length > 0) {
            this.sqlData.fieldList.some((item, key) => {
              item.fieldValue = item.fieldValue.trim()
              if (item.fieldValue !== '') {
                viewSql =
                  viewSql + item.fieldValue + ' as ' + item.fieldId + ',\n'
              } else {
                // this.SQLDialogText = this.SQLDialogText + "''" + ' as ' + item.fieldId +conts
              }
            })
            viewSql = viewSql.split('')
            viewSql.pop()
            viewSql.pop()
            viewSql = viewSql.join('')
            viewSql = viewSql + '\n'
          }
          if (this.sqlData.sqlWhere !== '') {
            viewSql =
              viewSql +
              'FROM\n' +
              this.sqlData.sqlFrom +
              '\n' +
              'WHERE\n' +
              this.sqlData.sqlWhere
          } else {
            viewSql = viewSql + 'FROM\n' + this.sqlData.sqlFrom
          }
          this.viewSql = viewSql

          var viewNoSql = 'SELECT\n'
          if (this.noSqlData.fieldList.length > 0) {
            this.noSqlData.fieldList.some((item, key) => {
              item.fieldValue = item.fieldValue.trim()
              if (item.fieldValue !== '') {
                viewNoSql =
                  viewNoSql + item.fieldValue + ' as ' + item.fieldId + ',\n'
              } else {
                // this.SQLDialogText = this.SQLDialogText + "''" + ' as ' + item.fieldId +conts
              }
            })
            viewNoSql = viewNoSql.split('')
            viewNoSql.pop()
            viewNoSql.pop()
            viewNoSql = viewNoSql.join('')
            viewNoSql = viewNoSql + '\n'
          }
          this.viewNoSql = viewNoSql

          setTimeout(() => {
            this.$nextTick(() => {
              if (document.getElementsByClassName('CodeMirror')[0]) {
                document.getElementsByClassName('CodeMirror')[0].remove()
              }
              if (this.sjcjRadio == 1) {
                this.htmlOption = CodeMirror.fromTextArea(
                  document.querySelector('#editText'),
                  {
                    model: 'text/x-sparksql',
                    indentWithTabs: false,
                    smartIndent: true,
                    lineNumbers: true,
                    matchBrackets: true,
                    cursorHeight: 1,
                    lineWrapping: true
                  }
                )
                this.htmlOption.setValue(this.viewSql)
              } else if (this.sjcjRadio == 0) {
                this.htmlOption = CodeMirror.fromTextArea(
                  document.querySelector('#editText2'),
                  {
                    model: 'text/x-sparksql',
                    indentWithTabs: false,
                    smartIndent: true,
                    lineNumbers: true,
                    matchBrackets: true,
                    cursorHeight: 1,
                    lineWrapping: true
                  }
                )
                this.htmlOption.setValue(this.viewNoSql)
              }
            })
          })
        },

        /**
         * @desc 保存执行顺序
         * @param {string} sqlId SQL主键id
         * @param {string} type 类型 sql:调整SQL顺序 para:调整目录顺序
         * @param {string} paraId 段落id
         * @param {Int} logTaskId 任务id
         * @param {string} executeOrder 顺序
         */
        saveExecutionOrder () {
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/saveExecuteOrder',
            jsonData: [
              {
                sqlId: this.rightTreeData.id,
                paraId: this.rightTreeData.attributes.paraId,
                type: this.rightTreeData.attributes.type,
                logTaskId: this.rightTreeData.attributes.taskId,
                executeOrder: this.rightTreeData.attributes.executeOrder
              }
            ]
          }).then(res => {
            console.log('保存执行顺序res', res)
            if (res.body.meta.statusCode == '200') {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.body.meta.message,
                duration: '2000 ',
                type: 'error'
              })
            }
          })
        },

        addParameter () {
          //数据采集-存储过程-添加参数
          this.saveParameter.push({
            cPName: '',
            cPFormat: 'IN',
            cPType: ''
          })
        },

        inputFocus (e) {
          this.sqlData.fieldList.some(dome => {
            this.$set(dome, 'type', 'text')
          })
          this.$set(e, 'type', 'textarea')
          this.$nextTick(() => {
            this.$refs[e.fieldId] && this.$refs[e.fieldId][0].focus()
          })
        },

        /**
         * @desc 获取字典系统域
         * @param {String} organizationCode 机构代码（必须）
         */
        getDictionaryDomain () {
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/getDicDomains',
            jsonData: [
              {
                organizationCode: this.sonValueNew
              }
            ]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('获取字典系统域res', res)
              this.domeSelectThree = res.body.data.data
            } else {
              this.$message.error(res.body.meta.message)
            }
          })
        },

        changeDomain (val, index) {
          this.systemDomain = val
          console.log('val', val)
          console.log('index', index)
          this.newObjData.push(this.sqlData.fieldList[index])
          console.log('changeDomain', this.newObjData)
          console.log(
            'this.sqlData.fieldList[index].dicId',
            this.sqlData.fieldList[index].dicId
          )
          let data = {
            organizationCode: this.sonValueNew,
            domain: val,
            dicCode: this.sqlData.fieldList[index].dicId
          }
          console.log('data', data)
          this.getDictionaryVersions(data, index)
        },
        selectVersion (event, index) {
          if (this.systemDomain == '') {
            this.$message.error('未选择系统域')
            return false
          }
        },
        /**
         * @desc 获取字典系统域
         * @param {String} organizationCode 机构代码（必须）
         * @param {String} domain 字典系统域代码（必须）
         * @param {String} dicCode 字典代码（必须）
         */
        getDictionaryVersions (param, index) {
          console.log('index', index)
          $ajax({
            url: 'api/etl_mcentre.dataTaskManageRpcService/getDicVersions',
            jsonData: [param]
          }).then(res => {
            if (res.body.meta.statusCode == '200') {
              console.log('获取字典系统域res', res)
              this.$set(this.domeSelectFour, index, res.body.data.data)
              console.log('this.domeSelectFour ', this.domeSelectFour)
            } else {
              this.$message.error(res.body.meta.message)
            }
          })
        },

        handleClick (e) {
          console.log('e', e)
        },

        filterNode (value, data) {
          if (!value) return true
          if (data.msgType && !data.catalogName) {
            var str = data.name + '(' + data.msgType + ')'
            return str.indexOf(value) !== -1
          } else if (data.msgType && data.catalogName) {
            return data.catalogName.indexOf(value) !== -1
          } else {
            return data.name.indexOf(value) !== -1
          }
        }
      },

      created () {},

      mounted () {}
    })
  }
)
