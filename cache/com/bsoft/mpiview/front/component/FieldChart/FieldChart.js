$define('com.bsoft.mpiview.front.component.FieldChart.FieldChart', {
  tpl: true,
  css: 'com.bsoft.mpiview.front.component.FieldChart.FieldChart',
  deps: ['com.bsoft.mpiview.front.lib.js.echarts.echarts'],
}, function (html) {
  Vue.component('field-chart', {
    template: html,
    props: {
      type: {
        type: String,
        default: ''
      },
      fieldName: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        legend: ['总档案数', '非空占比', '有效占比'],
        xData: [],
        totalData: [],
        notNullRate: [],
        effectiveRate: [],
        fieldLineChart: null,
        nullData: false,
      };
    },
    methods: {
      initLine() {
        let me = this;
        let colorMap = ['#9D0606', '#4088FE', '#26BF40'];
        me.$nextTick(() => {
          if (!me.fieldLineChart) {
            me.fieldLineChart = echarts.init(me.$refs.fieldLine);
          }
          // 指定图表的配置项和数据
          let option = {
            tooltip: {
              trigger: 'axis',
              formatter: (params) => {
                let str = `<div style="text-align: left">${params[0].axisValue}<br>`;
                for (let i = 0; i < params.length; i++) {
                  if (i === 0) {
                    str += `${params[i].marker} ${params[i].seriesName}: ${params[i].data} <br>`;
                  } else {
                    str += `${params[i].marker} ${params[i].seriesName}: ${params[i].data}% <br>`;
                  }
                }
                str += '</div>'
                return str;
              }
            },
            color: colorMap,
            legend: {
              data: me.legend,
              icon: 'circle',
              right: 20,
            },
            grid: {
              left: '8%',
              right: '8%',
              bottom: '0',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: me.xData,
              axisLabel: {
                formatter: function (params) {
                  var newParamsName = '' // 最终拼接成的字符串
                  var paramsNameNumber = params.length // 实际标签的个数
                  var provideNumber = 10 // 每行能显示的字的个数
                  var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
                  /**
                   * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                   */
                  // 条件等同于rowNumber>1
                  if (paramsNameNumber > provideNumber) {
                    /** 循环每一行,p表示行 */
                    for (var p = 0; p < rowNumber; p++) {
                      var tempStr = ''// 表示每一次截取的字符串
                      var start = p * provideNumber // 开始截取的位置
                      var end = start + provideNumber // 结束截取的位置
                      // 此处特殊处理最后一行的索引值
                      if (p === rowNumber - 1) {
                        // 最后一次不换行
                        tempStr = params.substring(start, paramsNameNumber)
                      } else {
                        // 每一次拼接字符串并换行
                        tempStr = params.substring(start, end) + '\n'
                      }
                      newParamsName += tempStr // 最终拼成的字符串
                    }
                  } else {
                    // 将旧标签的值赋给新标签
                    newParamsName = params
                  }
                  return newParamsName
                }
              }
            },
            yAxis: [
              {
                name: '总档案数',
                type: 'value',
              },
              {
                name: '比例(%)',
                type: 'value',
                // max: 100,
                // min: 0,
                alignTicks: true,
                // splitLine: {
                //   show: true,
                //   lineStyle: {
                //     type: 'dashed'
                //   }
                // }
              }
            ],
            series: [
              {
                name: '总档案数',
                type: 'line',
                data: me.totalData
              },
              {
                name: '非空占比',
                type: 'line',
                data: me.notNullRate,
                yAxisIndex: 1,
              },
              {
                name: '有效占比',
                type: 'line',
                data: me.effectiveRate,
                yAxisIndex: 1,
              },
            ]
          };
          me.fieldLineChart.setOption(option);
          me.fieldLineChart.resize();
        })
      },
      queryData() {
        let me = this;
        const params = {
          personType: me.type,
          field: me.fieldName
        }
        $ajax({
          url: 'api/mpiview.trialCollectionRpcService/selectFieldTrendOfRecent',
          jsonData: [params]
        }).then(function (res) {
          if (res && res.code == 200) {
            let result = res.body;
            let totalData = [];
            let notNullRate = [];
            let effectiveRate = [];
            me.xData = Object.keys(res.body)
            for (let k in result) {
              totalData.push(result[k].allPatientNum);
              notNullRate.push(parseFloat(result[k].notNullPercentage).toFixed(1));
              effectiveRate.push(parseFloat(result[k].effectivePercentage).toFixed(1));
            }
            me.totalData = totalData;
            me.notNullRate = notNullRate;
            me.effectiveRate = effectiveRate;
            
          }
          me.nullData = false;
          this.$nextTick(() => {
            me.initLine();
          })
          console.log(res.body, me.nullData)
        }).fail(function (e) {
          me.nullData = true;
          me.initLine();
          console.log(me.nullData)
          console.error(e);
        })
      },
    },
    mounted() {
      let me = this;
      me.queryData();
      window.addEventListener('resize', () => {
        // 同时打开两个带有echats图表的页面，resize一个页面，其他页面的变成0，导致表格变形
        let chartWidth = document.querySelector(".fieldLine").offsetWidth;
                let chartHeight = document.querySelector(".fieldLine").offsetHeight;
                if (chartWidth && chartHeight) {
                  me.fieldLineChart.resize();
                }
        
    })
    },
    watch: {
      fieldName(val) {
        console.log(val)
        this.queryData();
      }
    }
  })
})