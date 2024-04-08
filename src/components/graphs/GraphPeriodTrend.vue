<script setup>
  import { ref,watchEffect } from 'vue'

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
  import { createProductMarketDataset } from '../../tools'
  
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
    data:Array,
  })
  
  const data = ref({
    labels: props.data.map((it,id)=>`第${id+1}期`),
    datasets: createProductMarketDataset(props.data),
    yAxis: {
      type: 'value',
      axisLabel: {
        // formatter: '{value}%' // 这里是关键，使用 {value}% 表示在标签后面添加百分号
      }
    },
  })

  watchEffect(()=>{
    data.value = {
      labels: props.data.map((it,id)=>`第${id+1}期`),
      datasets: createProductMarketDataset(props.data),
      yAxis: {
        type: 'value',
        axisLabel: {
          // formatter: '{value}%' // 这里是关键，使用 {value}% 表示在标签后面添加百分号
        }
      },
    }
  })



const GRAPH_OPTS = ref({
  type:"line",
  responsive: true,
  maintainAspectRatio: false,
  interaction:{
    intersect: false,
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value, index, values) {
          return value //+ '%'; // 在标签后添加百分号
        }
      }
    }
  },
  plugins: {
    legend: {
      // display:false,
      labels: {
        usePointStyle: true,
        font:{
          size:4.5
        }
      },
      position:"bottom"
    }
  }
});

</script>

<template>
  <div class="graph">
    <Line height="300" :data="data" :options="GRAPH_OPTS"/>
  </div>
</template>

<style scoped>
.graph{
    height: 250px;
  }
</style>
