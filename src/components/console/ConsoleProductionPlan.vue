<script setup>
import { ref, watch, watchEffect, reactive } from 'vue'

import { 
  cloneDeep,
  divideArrays,
  divideMatrix,
  formatAsPercentage, 
  parsePercentage, 
  plusMatrix, 
  processMatrix,
  processMatrixes,
  softMax,
  Max,
  sumColumns,
  sumArray,
  sumRows,
  timesArrays,
  sum2DArray,
  timesMatrix,
  minusMatrix,
  minusArrays,
  produceCostCalc
 } from '../../tools';
import ProductMarketCard from '../ProductMarketCard.vue';
import {
  A,B,C,D, 
  minTransportCostRate,
  MIN_DELIVERY_COUNT, 
  TRANSPORTATION_PLAN , 
  TRANSPORTATION_COST_FIXED,
  MY_PRICES,
  REQUIREMENT_NET,
  totalProfit,
  PRODUCTION_PLAN, laborCount, machineCount,COST_PRODUCE, TRANSPORTATION_COST_DYNAMIC} from '../../globalState';
import { PowerRef } from '../../enhanceRef';


const btnByMax = ref(true)


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


function isPlanAdequated(plan, resourceLimit = true, overtimeLimit=true){
  plan = processMatrix(plan,(it)=>Math.floor(it));// 向下取整，避免每一步计算误差过大
  // 1. 不能超过最大用工
  const resources_labor = {};
  const resources_machine = {};
  Object.keys(plan).map(key=>{
    resources_labor[key] = calcLabor(pConfig[key].value, plan[key])
    resources_machine[key] = calcMachine(pConfig[key].value, plan[key])
  })
  const _laborSum = sumColumns(Object.values(resources_labor));
  const _mechineSum = sumColumns(Object.values(resources_machine));
  
  const laborRequire = Math.ceil(~~Math.max(_laborSum[0],_laborSum[1])+~~Math.max(_laborSum[2],_laborSum[3]));
  const mechineRequire = Math.ceil(Math.max(_mechineSum[0],_mechineSum[1]+_mechineSum[2],_mechineSum[3]));
  const isResouceOk = (laborRequire<=laborCount.value) && ( mechineRequire <= machineCount.value)
  
    // 2. 加班不能超过正班
  const isOverworkOk =
  _laborSum[1] <= (_laborSum[0])
  && _laborSum[3]<=(_laborSum[2])
  // && _mechineSum[1]<=_mechineSum[0]
  // && _mechineSum[3]<=_mechineSum[2]
// debugger

  if(!resourceLimit){
    return isOverworkOk
  }
  
  if(overtimeLimit){
    return isResouceOk
  }

  return isOverworkOk && isResouceOk;
}


function calcProfit(plan, withManageCost = true){
  const config = {A,B,C,D}
  // 总投入 = 生产成本+生产管理费+物流成本
  // 生产成本
  const productInvest = sum2DArray(Object.values(timesMatrix(plan, COST_PRODUCE.value)));
  //管理成本
  let manageInvest = 0
  if(withManageCost){
    Object.keys(plan).map(key=>{
      plan[key].map((it,id)=>{
        if(it>0){
          if(id==0||id==1){
            // 第一班开工
            manageInvest+=~~config[key].value.manageCost[0]
          }
          if(id==2||id==3){
            // 第一班开工
            manageInvest+=~~config[key].value.manageCost[1]
          }
        }   
      })
    })
  }
  
  // 物流成本
  let transInvest = 0

  const totalInvest = productInvest+manageInvest+transInvest;
  const avgPrices = sumRows(Object.values(MY_PRICES.value)).map(it=>it/4)
  const production = sumRows(Object.values(plan));
  const totalIncome = sumArray(timesArrays(avgPrices, production))
  const totalProfit = totalIncome-totalInvest
  return totalProfit
}


function calcProduceCost(plan){
  return {
    A: produceCostCalc(A.value, plan.A),
    B: produceCostCalc(B.value, plan.B),
    C: produceCostCalc(C.value, plan.C),
    D: produceCostCalc(D.value, plan.D),
  }
}

function calcProfitByUnit(plan, key ,i, dx){
  const LINE = {
    A,B,C,D
  }
  // 售价 - 物流成本
  const _avgProfit = sumRows(Object.values(minusMatrix(MY_PRICES.value, TRANSPORTATION_COST_DYNAMIC.value))).map(it=>it/4);
  const avgProfit = {
    A: _avgProfit[0],
    B: _avgProfit[1],
    C: _avgProfit[2],
    D: _avgProfit[3],
  };
  // 生产成本
  const costProduce = calcProduceCost(plan);
  // 单个车间生产一个商品的净利润
  const singleProfitNet = avgProfit[key] - costProduce[key][i]

  // 每个工时和机时的消耗
  const {laborCost, machineCost} = LINE[key].value
  return {
    laborAmount: dx * singleProfitNet/laborCost,
    machineAmount: dx * singleProfitNet/machineCost,
  }
}

function resourceLeft(){
  return {
    lLeft: laborCount.value,
    mLeft: machineCount.value,
  }
  return {
    lLeft: laborCount.value - laborRequire.value,
    mLeft: machineCount.value - mechineRequire.value,
  }
}

/**
 * 单位人机成本
 */
function ResProducePower(p, shifts){
  const {machineCost,laborCost} = p;
  const hourRemain = p.hourRemain[shifts];
  const {lLeft, mLeft} = resourceLeft();
  // 单独生产单个能生产多少个
  return Math.min(lLeft*hourRemain/laborCost,mLeft*hourRemain/machineCost)
  // return machineCost+laborCost
}

/**
 * 直接根据需求等比缩放设置产量，确保成本最低
 */
function byRequire(){
  PRODUCTION_PLAN.value={
    A:[0,0,0,0],
    B:[0,0,0,0],
    C:[0,0,0,0],
    D:[0,0,0,0]
  }
  let requirement = sumRows(Object.values(REQUIREMENT_NET.value))
  const expansion = 1.1;
  requirement = requirement.map(it=>it*expansion);
  requirement = {
    A:requirement[0],
    B:requirement[1],
    C:requirement[2],
    D:requirement[3],
  }


  btnByMax.value = false;
  let targetPlan = {
    A:[0,0,0,0],
      B:[0,0,0,0],
      C:[0,0,0,0],
      D:[0,0,0,0]
  }
  if(!isPlanAdequated(targetPlan)) return;

  // 梯度下降法求解
  const timer = setInterval(()=>{
    const dx = 4;
    const PMatrix = {
      A:[0,0,0,0],
      B:[0,0,0,0],
      C:[0,0,0,0],
      D:[0,0,0,0]
    }
    const Matrix = {
      A:[0,0,0,0],
      B:[0,0,0,0],
      C:[0,0,0,0],
      D:[0,0,0,0]
    }
    let oneAvalid = false
    Object.keys(targetPlan).forEach(key=>{
      // 排除掉未选的key
      if(!productChoice.value.includes(key)) return;
      //迭代
      targetPlan[key].forEach((it, i)=>{
        const dPlan = cloneDeep(targetPlan);
        // 单独控制一个维度的变量
        dPlan[key][i] = targetPlan[key][i] + dx;
        // 检查增量之后是否符合生产要求
        if(isPlanAdequated(dPlan,true,true) && sumArray(dPlan[key])<=requirement[key]){
          // 符合则计算盈利矩阵
          PMatrix[key][i] =  (calcProfit(dPlan, false) - calcProfit(targetPlan, false))*ResProducePower(pConfig[key].value,i); // 比较盈利或者比较其他的作为梯度
          oneAvalid = PMatrix[key][i]>0;
        } else {
          // 不符合则直接设置盈利矩阵设置为0
          PMatrix[key][i] = 0;
        }
      })
    })
    if(!oneAvalid){
      btnByMax.value = true
      clearInterval(timer);
      // PRODUCTION_PLAN.value = processMatrix(targetPlan,(it)=>~~it);
    } else {
      // 归一化梯度
      // const p = softMax(PMatrix);
      const p = Max(PMatrix);
      // 根据利润反向传播修改利润
      const d = processMatrix(p,(it)=>it*dx);
      targetPlan = plusMatrix(d, targetPlan);
      PRODUCTION_PLAN.value = processMatrix(targetPlan,(it)=>~~it);
    }
  },30)
}

/**
 * 寻找最大利润
 */
function byMaxProfit(){
  PRODUCTION_PLAN.value={
    A:[0,0,0,0],
    B:[0,0,0,0],
    C:[0,0,0,0],
    D:[0,0,0,0]
  }
  btnByMax.value = false;
  let targetPlan = {
    A:[0,0,0,0],
      B:[0,0,0,0],
      C:[0,0,0,0],
      D:[0,0,0,0]
  }
  if(!isPlanAdequated(targetPlan)) return;

  // 梯度下降法求解
  const timer = setInterval(()=>{
    const dx = 4;
    const PMatrix = {
      A:[0,0,0,0],
      B:[0,0,0,0],
      C:[0,0,0,0],
      D:[0,0,0,0]
    }
    let oneAvalid = false
    Object.keys(targetPlan).forEach(key=>{
      // 排除掉未选的key
      if(!productChoice.value.includes(key)) return;
      //迭代
      targetPlan[key].forEach((it, i)=>{
        const dPlan = cloneDeep(targetPlan);
        // 单独控制一个维度的变量
        dPlan[key][i] = targetPlan[key][i] + dx;
        // 检查增量之后是否符合生产要求
        if(isPlanAdequated(dPlan)){
          console.log((calcProfit(dPlan, false) - calcProfit(targetPlan, false)),ResProducePower(pConfig[key].value,i))
          // 符合则计算盈利矩阵
          PMatrix[key][i] =  (calcProfit(dPlan, false) - calcProfit(targetPlan, false))*ResProducePower(pConfig[key].value,i); // 比较盈利或者比较其他的作为梯度
          oneAvalid = PMatrix[key][i]>0;

        } else {
          // 不符合则直接设置盈利矩阵设置为0
          PMatrix[key][i] = 0;
        }
      })
    })
    if(!oneAvalid){
      btnByMax.value = true
      clearInterval(timer);
      // PRODUCTION_PLAN.value = processMatrix(targetPlan,(it)=>~~it);
    } else {
      // 归一化梯度
      // const p = softMax(PMatrix);
      const p = Max(PMatrix);
      // 根据利润反向传播修改利润
      const d = processMatrix(p,(it)=>it*dx);
      targetPlan = plusMatrix(d, targetPlan);
      PRODUCTION_PLAN.value = processMatrix(targetPlan,(it)=>~~it);
    }
  },30)
}

/**
 * 在确保利润的前提下
 * 通过利润梯度下降寻找最大产量
 */
async function byMaxCount(){
  PRODUCTION_PLAN.value={
    A:[0,0,0,0],
    B:[0,0,0,0],
    C:[0,0,0,0],
    D:[0,0,0,0]
  }
  btnByMax.value = false;
  let targetPlan = {
    A:[0,0,0,0],
    B:[0,0,0,0],
    C:[0,0,0,0],
    D:[0,0,0,0]
  }
  if(!isPlanAdequated(targetPlan)) return;

  // 梯度下降法求解
  const timer = setInterval(()=>{
    const dx = 4;
    const PMatrix = {
      A:[0,0,0,0],
      B:[0,0,0,0],
      C:[0,0,0,0],
      D:[0,0,0,0]
    }
    let oneAvalid = false
    Object.keys(targetPlan).forEach(key=>{
      // 排除掉未选的key
      if(!productChoice.value.includes(key)) return;
      //迭代
      targetPlan[key].forEach((it, i)=>{
        const dPlan = cloneDeep(targetPlan);
        // 单独控制一个维度的变量
        dPlan[key][i] = targetPlan[key][i] + dx;
        // 检查增量之后是否符合生产要求
        if(isPlanAdequated(dPlan)){
          // 符合则计算盈利矩阵
          PMatrix[key][i] =  (calcProfit(dPlan, false) - calcProfit(targetPlan, false))*ResProducePower(pConfig[key].value,i); // 比较盈利或者比较其他的作为梯度
          oneAvalid = PMatrix[key][i]>0;
        } else {
          // 不符合则直接设置盈利矩阵设置为0
          PMatrix[key][i] = 0;
        }
      })
    })
    if(!oneAvalid){
      btnByMax.value = true
      clearInterval(timer);
      // PRODUCTION_PLAN.value = processMatrix(targetPlan,(it)=>~~it);
    } else {
      // 归一化梯度
      // const p = softMax(PMatrix);
      const p = softMax(PMatrix);
      // 根据利润反向传播修改利润
      const d = processMatrix(p,(it)=>it*dx);
      targetPlan = plusMatrix(d, targetPlan);
      PRODUCTION_PLAN.value = processMatrix(targetPlan,(it)=>~~it);
    }
  },30)
}



</script>

<template>
  <div class="panel-header">
    <div class="lmconfig">
      <el-text class="lmconfigtitle" size="small">机器数</el-text>
        <el-input v-model="machineCount" size="small" style="width: 60px;" />

        <el-text class="lmconfigtitle" size="small">人力数</el-text>
        <el-input v-model="laborCount" size="small" style="width: 60px;" />
    </div>
    
    <div class="options">
      <el-button type="primary" size="small" :disabled="!btnByMax" @click="byRequire">按需求</el-button>
      <el-button type="primary" size="small" :disabled="!btnByMax" @click="byMaxProfit">按最大利润</el-button>
      <el-button type="primary" :disabled="!btnByMax" size="small" @click="byMaxCount">均衡投入</el-button>
    </div>
    <div class="options">
      <el-checkbox-group v-model="productChoice" size="small">
        <el-checkbox value="A" name="A">产品A</el-checkbox>
        <el-checkbox value="B" name="B">产品B</el-checkbox>
        <el-checkbox value="C" name="C">产品C</el-checkbox>
        <el-checkbox value="D" name="D">产品D</el-checkbox>
      </el-checkbox-group>    
    </div>
  </div>
  <product-market-card :places="0" :step="10" controls type="produce" :config="PRODUCTION_PLAN" extra-readonly colored2="info" :extra="toSumArr"/>
  <div class="footer">
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
.lmconfig{
  line-height: 1;
  margin: 0 0 5px;
  display: flex;
  justify-content: flex-end;
}
.lmconfigtitle{
  margin:0 5px
}
.warn{
  color: #F56C6C;
}
.table{
  margin-top: 10px;
}
.options{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 5px;
}
.options .linetitle{
  margin: 0 5px;
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
