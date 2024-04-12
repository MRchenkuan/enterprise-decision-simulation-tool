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
  import { createProductMarketDataset, formatNumber } from '../../tools'
  
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
    percent:Boolean,
    height:Number,
    autoUnit:Boolean
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
          if(props.percent){
            return (value*100).toFixed(0) + '%'; // 在标签后添加百分号
          }else if(props.autoUnit){
            return formatNumber(value, 0)
          }else{
            return value
          }
          
        }
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (v)=>{
          if(props.percent){
            return `[${v.dataset.label}]：${(v.parsed.y*100).toFixed(1)}%`
          }else if(props.autoUnit){
            return `[${v.dataset.label}]：${formatNumber(v.parsed.y, 1)}`
          } else {
            return `[${v.dataset.label}]：${(v.parsed.y).toFixed(0)}`
          }
        },
      }
    },
    legend: {
      // display:false,
      labels: {
        usePointStyle: true,
        font:{
          size:10
        }
      },
      position:"bottom"
    }
  }
});

</script>

<template>
  <div class="graph">
    <Line :height="props.height||300" :data="data" :options="GRAPH_OPTS"/>
  </div>
</template>

<style scoped>

</style>
