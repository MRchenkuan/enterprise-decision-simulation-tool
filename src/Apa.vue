<script setup>
  
  import { ref } from 'vue'
  import ProductionConditions from './components/ProductionConditions.vue';
  import ProductMarketCard from './components/ProductMarketCard.vue';
  import ConsoleDailyDataUpdata from './components/ConsoleDailyDataUpdata.vue';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  import { Line } from 'vue-chartjs'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const A = ref({
    manageCost:[5000, 6000],
    hours:[8,4,8,4],
    materialCost:700,
    machineCost:100,
    laborCost:200,
    hourPay: [11,14,13,17],
    hourRemain:[520,260,520,260],
    machinePay:7.65
  })

  const activeName = ref('A');
  const configPanelActive = ref('daily');

  const PRICES = ref({
    A:[4500, 4500,4500,4500],
    B:[4500, 4500,4500,4500],
    C:[4500, 4500,4500,4500],
    D:[4500, 4500,4500,4500],
  })

  const TRANSPORTATION = ref({
    A:[57, 47,118,118],
    B:[96, 96,132,132],
    C:[0, 0,0,0],
    D:[0, 0,0,0],
  })

  const PRODUCTIONPLAN = ref({
    A:[150,150,0,0],
    B:[96, 96,132,132],
    C:[0, 0,0,0],
    D:[0, 0,0,0],
  })
  const PRODUCTIONPLAN_COLLECT = ref([
    PRODUCTIONPLAN.value.A.reduce((a, b) => a + b, 0),
    PRODUCTIONPLAN.value.B.reduce((a, b) => a + b, 0),
    PRODUCTIONPLAN.value.C.reduce((a, b) => a + b, 0),
    PRODUCTIONPLAN.value.D.reduce((a, b) => a + b, 0),
  ])

  const TRANSPORTATION_COST_FIXED = ref({
    A:[1800,600,3800,4800],
    B:[9000, 5000,12000,13000],
    C:[13600, 9800,15500,16600],
    D:[12800, 16600,18800,19800],
  })

  const TRANSPORTATION_COST_DYNAMIC = ref({
    A:[220,180,300,300],
    B:[450, 350,500,500],
    C:[700, 500,800,800],
    D:[900, 700,1000,1000],
  })

  const _data=new Array(20).fill(0).map((_, index) => (index + 1) * 10);
  function createDataset(martix){
    const _datasets = []
    const map1 = ['产品A','产品B','产品C','产品D'];
    const map2 = ['市场1','市场2','市场3','市场4'];
    const colors = [
      ['#85ce61','#4e8e2f','#3e6b27','#2d481f'],
      ['#ebb563','#a77730','#7d5b28','#533f20'],
      ['#f78989','#b25252','#854040','#582e2e'],
      ['#a6a9ad','#6b6d71','#525457','#393a3c'],
    ]
    Object.keys(martix).map((it,i)=>{
      const line = martix[it];
      line.map((cell, j)=>{
        _datasets.push({
          label: `${[map1[i]]}-${[map2[j]]}`,
          backgroundColor: colors[i][j],
          data: _data.map(it=>{
            // 固定费用除以总毛利，毛利 = 售价-成本
            const profit = 2000
            return cell/(profit*it)*100
          })
        })
      })
    })
    return _datasets
  }
  const logisticsCostsGraph = ref({
    labels: _data.map(it=>`${it}件`),
    datasets: createDataset(TRANSPORTATION_COST_FIXED.value),
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%' // 这里是关键，使用 {value}% 表示在标签后面添加百分号
      }
    },
  })
  const GRAPH_OPTS = ref({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value, index, values) {
            return value + '%'; // 在标签后添加百分号
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          font:{
            size:6
          }
        },
      }
    }
  });

</script>

<template>
  <div class="globalconfig">
    <el-tabs v-model="configPanelActive" type="border-card" class="card">
      <el-tab-pane name="global">
        <template #label>
          <el-text>全局配置(比赛首次开始时)</el-text>
        </template>
        <el-alert title="一次性配置，根据比赛界信息配置完毕即可" description="" type="warning" :closable="false" show-icon />
        <el-collapse>
          <el-collapse-item title="产线配置">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="产品A" name="A"><production-conditions :config="A"/></el-tab-pane>
              <el-tab-pane label="产品B" name="B"><production-conditions :config="A"/></el-tab-pane>
              <el-tab-pane label="产品C" name="C"><production-conditions :config="A"/></el-tab-pane>
              <el-tab-pane label="产品D" name="D"><production-conditions :config="A"/></el-tab-pane>
            </el-tabs>
          </el-collapse-item>
          <el-collapse-item title="物流配置">
            <el-divider content-position="left"><el-text size="small">固定费 </el-text></el-divider>
            <product-market-card :config="TRANSPORTATION_COST_FIXED"/>
            <el-divider content-position="left"><el-text size="small">单件配送费 </el-text></el-divider>
            <product-market-card :config="TRANSPORTATION_COST_DYNAMIC"/>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      
      <el-tab-pane name="daily">
        <template #label>
          <el-text class="title">每期数据(每期开始时)</el-text>
        </template>
        <el-alert title="根据比赛实况更新下述数据以获得最佳结果" type="warning" :closable="false" show-icon />
        <console-daily-data-updata />
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="console">
    <el-card class="card">
      <template #header>
        <el-text>控制台(每期调整)</el-text>
      </template>
      <el-divider content-position="left"><el-text size="small">价格策略 </el-text></el-divider>
      <product-market-card :readOnly="false" :config="PRICES"/>
      <el-divider content-position="left"><el-text size="small">运输策略（自动）</el-text><el-button type="primary" size="small">按需求计算</el-button></el-divider>
      <product-market-card readOnly :config="TRANSPORTATION"/>
      <el-divider content-position="left"><el-text size="small">生产策略 </el-text><el-button type="primary" size="small">按需求计算</el-button><el-button type="primary" size="small">最大生产力</el-button></el-divider>
      <product-market-card :collect="PRODUCTIONPLAN_COLLECT" :config="PRODUCTIONPLAN"/>
    </el-card>
  </div>
  <div class="dashboard">
    <el-card class="card">
      <template #header>
        <el-text>成本&利润</el-text>
      </template>
      <el-divider content-position="left"><el-text size="small">生产成本 </el-text></el-divider>
      <product-market-card type="produce" readOnly :config="PRODUCTIONPLAN"/>
      <el-divider content-position="left"><el-text size="small">毛利率 </el-text></el-divider>
      <product-market-card readOnly :config="TRANSPORTATION"/>
      <el-divider content-position="left"><el-text size="small">终端利率 </el-text></el-divider>
      <product-market-card readOnly :config="TRANSPORTATION"/>
      <el-divider content-position="left"><el-text size="small">单件毛利 </el-text></el-divider>
      <product-market-card readOnly :config="TRANSPORTATION"/>
    </el-card>
  </div>
  <div class="graph">
    <el-card class="card">
      <template #header>
        <el-text>相关图表</el-text>
      </template>
      <el-divider content-position="left"><el-text size="small">物流成本曲线</el-text></el-divider>
      <div class="graph"><Line height="400" :data="logisticsCostsGraph" :options="GRAPH_OPTS" /></div>
      <el-divider content-position="left"><el-text size="small">销量走势 </el-text></el-divider>
      <!-- <Line :data="logisticsCostsGraph" :options="GRAPH_OPTS" /> -->
      <el-divider content-position="left"><el-text size="small">需求走势 </el-text></el-divider>
      <!-- <Line :data="logisticsCostsGraph" :options="GRAPH_OPTS" /> -->
    </el-card>
  </div>
</template>



<style scoped>
  .card{
    margin: 20px;
    width: 400px;
    display: block;
    padding: 0;
    float: left;
  }
  .graph{
    height: 300px;
  }
  .globalconfig{
    width: 480px;
  }
  .left{
    width: 1200px;
    display: block;
  }
</style>
