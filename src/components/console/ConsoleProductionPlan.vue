<script setup>
import { ref, watch, watchEffect, reactive } from 'vue'
import { 
  formatAsPercentage, 
  parsePercentage, 
  processMatrix,
  processMatrixes,
  sumColumns
 } from '../../tools';
import ProductMarketCard from '../ProductMarketCard.vue';
import {
  A,B,C,D, 
  minTransportCostRate,
  MIN_DELIVERY_COUNT, 
  TRANSPORTATION_PLAN , PERIOD_DATA, laborCount, machineCount} from '../../globalState';

const {chanpionSaleCount, chanpionMarketRate, mySaleCount, myMarketRequirement, myOrder} = PERIOD_DATA.value;


const laborRequire = ref(0)
const mechineRequire = ref(0)


// 1. 现根据当前生产计划计算每件生产消耗
// 2. 对每件生产消耗计算汇总算出总消耗
// 3. 设置约束条件，动态求解
// 520/单件人力消耗*件数


const pConfig = {
  A,B,C,D
}
const plan = ref({
  A:[150,150,150,150],
  B:[150,150,150,150],
  C:[150,150,150,150],
  D:[150,150,150,150],
})

const resources_labor = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})
const resources_machine = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})

function calcLabor(p, plan_arr){
  return plan_arr.map((count, id)=>{
    return count*p.laborCost/p.hourRemain[id]
  })
}
function calcMachine(p, plan_arr){
  return plan_arr.map((count, id)=>{
    return count*p.machineCost/p.hourRemain[id]
  })
}

const laborSum = ref([])
const mechineSum = ref([])




watchEffect(()=>{
  const l = {}
  const m = {}
  Object.keys(plan.value).map(key=>{
    resources_labor.value[key] = calcLabor(pConfig[key].value, plan.value[key])
    resources_machine.value[key] = calcMachine(pConfig[key].value, plan.value[key])
  })
  const _laborSum = sumColumns(Object.values(resources_labor.value));
  const _mechineSum = sumColumns(Object.values(resources_machine.value));

  laborSum.value =_laborSum
  mechineSum.value =_mechineSum
  
  laborRequire.value = Math.ceil(~~Math.max(_laborSum[0],_laborSum[1])+~~Math.max(_laborSum[2],_laborSum[3]))
  mechineRequire.value = Math.ceil(Math.max(_mechineSum[0],_mechineSum[1]+_mechineSum[2],_mechineSum[3]))
})

function byRequire(){

}

function autoMax(){

}

</script>

<template>
  <div class="options">
    <el-button type="primary" size="small" @click="byRequire">按需求计算</el-button>
    <el-button type="primary" size="small" @click="autoMax">最大生产力</el-button>
  </div>
  <product-market-card type="produce" :config="plan" :extra="[0,0,0,0]"/>
  <product-market-card type="produce" :places="1" readonly :config="resources_labor" :extra="laborSum"/>
  <product-market-card type="produce" :places="1" readonly :config="resources_machine" :extra="mechineSum"/>
  <div class="config">
    <div class="line">
      <el-text class="linetitle cell" size="small">机器数:</el-text>
      <el-text :class="{cell:true,warn:mechineRequire>machineCount}" size="small"> {{ mechineRequire }} </el-text>
      <el-text class="cell" size="small">/{{ machineCount }} 台</el-text>
      <el-text class="linetitle cell" size="small">工人数:</el-text>
      <el-text :class="{cell:true,warn:laborRequire>laborCount}" size="small"> {{ laborRequire }} </el-text>
      <el-text class="cell" size="small">/{{ laborCount }} 人</el-text>
    </div>
  </div>
</template>

<style scoped>
.warn{
  color: #F56C6C;
}
.config{
  margin: 5px 0;
}
.table{
  margin-top: 10px;
}
.options{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}
.cell{
  font-weight: 900;
}

.line{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  margin: 5px 0;
}
.line>.linetitle{
  width: 50px;
  margin: 0 5px;
  text-align: right;
  flex-shrink: 0;
}

.line .input{
  margin: 0px;
  width: 80px;
  display: flex;
  text-align: center;
}
</style>
