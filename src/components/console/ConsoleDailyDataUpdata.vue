<script setup>
import { ref, watchEffect, unref } from 'vue'
import ProductMarketCard from '../ProductMarketCard.vue';
const props = defineProps({
  data: Object,
})
const dailyDataPanelActive = PowerRef('dailyDataPanelActive','销量&市场份额');
import {laborCount,machineCount, PERIOD_DATA_HISTORY_LIST } from '../../globalState.js'
import { PowerRef } from '../../enhanceRef';
import { debounce } from '../../tools';
import { ElText } from 'element-plus';
import PowerUploader from '../PowerUploader.vue'

const newPeriodD = debounce(()=>{
  PERIOD_DATA_HISTORY_LIST.value.push(JSON.parse(JSON.stringify(props.data)))
},300)

const updateState = PowerRef('updateState',{
  sale:false,
  require:false,
  power:false
})
const allUpdated = PowerRef('allUpdated',false);

watchEffect(()=>{
  const {sale, require} = updateState.value;
  allUpdated.value = sale&&require
})

function newPeriod(){
  newPeriodD()
  setUpdateState(false, false)
}
function clearPeriod(){
  PERIOD_DATA_HISTORY_LIST.value=[];
  setUpdateState(false, false)
}

function setUpdateState(sale, require){
  updateState.value.sale = sale;
  updateState.value.require = require;
}

</script>

<template>
  <el-divider content-position="left"><el-text size="small">市场上未卖完的存货</el-text></el-divider>
  <product-market-card :config="data.myMarketKeep"/>
  <el-divider border-style="dashed" />
</template>

<style scoped>
.periodtitle{
  font-weight: 900;
}
.tabtag{
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: center;
}
.line{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0;
}
.linetitle{
  width: 85px;
}
.input{
  width: 85px;
}
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

el-text{
  padding: 0 5px;  
}
.notupdate{
  color: #F56C6C;
}

.updated{
  color: #67C23A;
}
</style>
