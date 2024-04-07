<script setup>
  import { ref } from 'vue'

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

  const props = defineProps({
    data: Object
  })
// 图表
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
  datasets: createDataset(props.data),
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
          size:10
        }
      },
    }
  }
});


</script>

<template>
  <div class="graph">
    <Line height="400" :data="logisticsCostsGraph" :options="GRAPH_OPTS"/>
  </div>
</template>

<style scoped>
.graph{
    height: 300px;
  }
</style>
