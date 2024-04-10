<script setup>
import { ref, watch, watchEffect, reactive } from 'vue'

import { 
  divideArrays,
  divideMatrix,
  formatAsPercentage, 
  gradientDescent, 
  maximizeXValuesWithLP, 
  parsePercentage, 
  processMatrix,
  processMatrixes,
  softMax,
  sumColumns,
  sumRows
 } from '../../tools';
import ProductMarketCard from '../ProductMarketCard.vue';
import {
  A,B,C,D, 
  minTransportCostRate,
  MIN_DELIVERY_COUNT, 
  TRANSPORTATION_PLAN , 
  PRODUCTION_PLAN,
  PERIOD_DATA, laborCount, machineCount,COST_PRODUCE} from '../../globalState';
import { PowerRef } from '../../enhanceRef';

const {chanpionSaleCount, chanpionMarketRate, mySaleCount, myMarketRequirement, myOrder} = PERIOD_DATA.value;

// 1. 现根据当前生产计划计算每件生产消耗
// 2. 对每件生产消耗计算汇总算出总消耗
// 3. 设置约束条件，动态求解
// 520/单件人力消耗*件数


const pConfig = {
  A,B,C,D
}


// 每个产品每个车间的人力消耗
const resources_labor = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})

// 每个产品每个车间的机器消耗
const resources_machine = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})
// 人力需求
const laborRequire = ref(0)

// 机器需求
const mechineRequire = ref(0)

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
const productChoice = PowerRef('productChoice',['A','B','C','D'])
const mlrate = ref({})
// watch(productChoice,e=>{
//   debugger  
// })
const toSumArr = ref([])


watchEffect(()=>{
  toSumArr.value = sumRows(Object.values(PRODUCTION_PLAN.value))

  Object.keys(PRODUCTION_PLAN.value).map(key=>{
    resources_labor.value[key] = calcLabor(pConfig[key].value, PRODUCTION_PLAN.value[key])
    resources_machine.value[key] = calcMachine(pConfig[key].value, PRODUCTION_PLAN.value[key])
  })
  const _laborSum = sumColumns(Object.values(resources_labor.value));
  const _mechineSum = sumColumns(Object.values(resources_machine.value));

  laborSum.value =_laborSum
  mechineSum.value =_mechineSum
  
  laborRequire.value = Math.ceil(~~Math.max(_laborSum[0],_laborSum[1])+~~Math.max(_laborSum[2],_laborSum[3]))
  mechineRequire.value = Math.ceil(Math.max(_mechineSum[0],_mechineSum[1]+_mechineSum[2],_mechineSum[3]))

  mlrate.value=divideMatrix(resources_machine.value, resources_machine.value)
})

function byRequire(){

}

function autoMax(){
  const products = ['A','B','C','D'];
  const lmax = 220;
  const mmax = 124;
  const lmrate = {
    A:2,B:1.6,C:0.6,D:0.5
  }

  // products.length

  const PC_FUNC = window.pf = createSolver(lmrate.C, lmax,mmax);
  const result = gradientDescent(10,1000,0.1,0.5,PC_FUNC);
  const machineLimit = result.map((it)=>it/lmrate.C)
  console.log('l',result)
  console.log('m',machineLimit)
  console.log('cl',calcProductByLabor(result,C.value))
  console.log('cm',calcProductByMachine(machineLimit,C.value))
}

function calcProductByLabor(laborLimit, p){
  return laborLimit.map((hour, id)=>{
    return hour*p.hourRemain[id]/p.laborCost
  })
}
function calcProductByMachine(laborLimit, p){
  return laborLimit.map((hour, id)=>{
    return hour*p.hourRemain[id]/p.machineCost
  })
}

function createSolver(lmRate, maxLR, maxMR){
  return function GPP(x1,x2,x3,x4) {
    // 变量
    const l1 = x1;
    const l2 = x2;
    const l3 = x3;
    const l4 = x4;

    const m1 = x1/lmRate;
    const m2 = x2/lmRate;
    const m3 = x3/lmRate;
    const m4 = x4/lmRate;

    const lr = softMax(l1,l2)+softMax(l3,l4);
    const mr = softMax(m1,m2+m3,m4);
    // 约束
    if(l1<l2) return 'OVERFLOW';
    if(l3<l4) return 'OVERFLOW';
    if(lr>maxLR) return 'OVERFLOW';
    if(mr>maxMR) return 'OVERFLOW';
    //求解
    return (l1+l2+l3+l4)/lmRate+m1+m2+m3+m4;
  }
}

</script>

<template>
  <div class="options">
    <el-button type="primary" size="small" disabled @click="byRequire">按需求计算</el-button>
    <el-button type="primary" size="small" disabled @click="autoMax">最大生产力</el-button>
  </div>
  <div class="options">
    <el-checkbox-group v-model="productChoice" size="small" disabled>
      <el-checkbox value="A" name="A">产品A</el-checkbox>
      <el-checkbox value="B" name="B">产品B</el-checkbox>
      <el-checkbox value="C" name="C">产品C</el-checkbox>
      <el-checkbox value="D" name="D">产品D</el-checkbox>
    </el-checkbox-group>    
  </div>
  <product-market-card :step="10" controls type="produce" :config="PRODUCTION_PLAN" extra-readonly colored2="info" :extra="toSumArr"/>
  <!-- <el-divider border-style="dashed" /> -->
  <!-- <product-market-card type="produce" :places="1" readonly :config="resources_machine" :extra2="mechineSum"/> -->
  <!-- <el-divider border-style="dashed" /> -->
  <!-- <product-market-card type="produce" :places="1" readonly :config="resources_labor" :extra2="laborSum"/> -->
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
