<script setup>
import { ref, watch, watchEffect, reactive } from 'vue'
import { formatAsPercentage, parsePercentage, processMatrix,processMatrixes } from '../../tools';
import ProductMarketCard from '../ProductMarketCard.vue';
import { minTransportCostRate,MIN_DELIVERY_COUNT, TRANSPORTATION_PLAN , PERIOD_DATA, laborCount, machineCount} from '../../globalState';

const {chanpionSaleCount, chanpionMarketRate, mySaleCount, myMarketRequirement, myOrder} = PERIOD_DATA.value;


const laborRequire = ref(0)
const mechineRequire = ref(0)

const plan = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
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
  <product-market-card :config="plan"/>
  <div class="config">
    <div class="line">

      <el-text class="linetitle cell" size="small">机器数:</el-text>
      <el-text class="cell" size="small"> {{ mechineRequire }} </el-text>
      <el-text class="cell" size="small">/ {{ machineCount }} 台</el-text>
      <el-text class="linetitle cell" size="small">工人数:</el-text>
      <el-text class="cell" size="small"> {{ laborRequire }} </el-text>
      <el-text class="cell" size="small">/ {{ laborCount }} 人</el-text>
    </div>
  </div>
</template>

<style scoped>
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
