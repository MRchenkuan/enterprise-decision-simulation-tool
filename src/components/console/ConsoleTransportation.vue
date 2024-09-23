<script setup>
import { ref, watch, watchEffect, reactive } from 'vue'
import { plusMatrix, formatAsPercentage, parsePercentage, processMatrix,processMatrixes, sumRows, timesMatrix, sum2DArray, autoUnit,roundToDecimal, formatNumberWithCommas,sumArray } from '../../tools';
import ProductMarketCard from '../ProductMarketCard.vue';
import { minTransportCostRate,MIN_DELIVERY_COUNT, REQUIREMENT_NET, MARKET_REQUIREMENT, TRANSPORTATION_PLAN, TRANSPORTATION_COST_DYNAMIC, TRANSPORTATION_COST_FIXED,PRODUCTION_PLAN, TIME_SEQ_DATA_LIST} from '../../globalState';
import { PowerRef } from '../../enhanceRef';


const mincost = PowerRef('mincost',false);
const maxdelivery = PowerRef('maxdelivery','maxstock');

const conditions = ref({})
const dynamicCost = ref(0)
const fixedCost = ref(0)
const totalCost = ref(0)

const plan = TRANSPORTATION_PLAN

const TRANSPORTATION_PLAN_CACHED = PowerRef('TRANSPORTATION_PLAN_CACHED',{})
const toSumArr = ref([])

watchEffect(()=>{
  // 当前仓库的存货
  const storeHis = TIME_SEQ_DATA_LIST.value.storeCount
  const currentStore = storeHis[storeHis.length-1];

  const marketdemand = maxdelivery.value === 'marketdemand';
  const maxstock = maxdelivery.value === 'maxstock'; 
  const product_count = sumRows(Object.values(PRODUCTION_PLAN.value));

  // 1. 计算市场需求比例
  const demandRateList = product_count.map((it,id)=>{
    const tags = ['A','B','C','D'];
    const reqSum = sumArray(MARKET_REQUIREMENT.value[tags[id]]);
    return reqSum ? it/reqSum : 0
  })

  let _plan = {
    A: MARKET_REQUIREMENT.value.A.map(it=>it*demandRateList[0]),
    B: MARKET_REQUIREMENT.value.B.map(it=>it*demandRateList[1]),
    C: MARKET_REQUIREMENT.value.C.map(it=>it*demandRateList[2]),
    D: MARKET_REQUIREMENT.value.D.map(it=>it*demandRateList[3]),
  }
  if(mincost.value){
    if(marketdemand){
      plan.value = MARKET_REQUIREMENT.value
    } else if(maxstock){
      plan.value= _plan
    }
    plan.value = processMatrixes(plan.value, MIN_DELIVERY_COUNT.value,(it1,it2)=>it1<it2?0:it1)
    
  } else {
    if(marketdemand){
      plan.value = JSON.parse(JSON.stringify(MARKET_REQUIREMENT.value))
    }else if(maxstock){
      plan.value = _plan;
    }

  }
  plan.value = processMatrix(plan.value, it=>roundToDecimal(it, 0))

  toSumArr.value = sumRows(Object.values(plan.value))
  const _dynamicCost = sum2DArray(Object.values(timesMatrix(plan.value, TRANSPORTATION_COST_DYNAMIC.value)));
  let _fixedCost = 0
  Object.keys(plan.value).map(key=>{
    const line = TRANSPORTATION_COST_FIXED.value[key]
    plan.value[key].map((it,id)=>{
      if(it>0){
        _fixedCost += ~~line[id];
      }   
    })
  })
  let _totalCost = _fixedCost + _dynamicCost;
  dynamicCost.value = formatNumberWithCommas(_dynamicCost);
  fixedCost.value = formatNumberWithCommas(_fixedCost)
  totalCost.value = formatNumberWithCommas(_totalCost);
})

function formattooltip(v){
  return (v*100).toFixed(0)+'%'
}

const marks = reactive({
  0.08: {
    style: {
      color: '#67C23A',
      top: "-30px",
      fontSize:"9px"
    },
    label: '8%',
  },
  0.15: {
    style: {
      fontSize:"9px",
      color: '#F56C6C',
      top: "-30px"
    },
    label: '15%',
  },
})

function save(){
  TRANSPORTATION_PLAN_CACHED.value = plan.value
}

function reset(){
  mincost.value=false;
  plan.value = TRANSPORTATION_PLAN_CACHED.value;
}



</script>

<template>
  <div class="panel-header">
    <div class="line btn">
      <el-button class="btn" type="primary" size="small" @click="save">保存</el-button>
      <el-button class="btn" type="primary" size="small" @click="reset">复原</el-button>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">配送要求</el-text>
      <div class="cell">
        <el-checkbox v-model="mincost" size="small" style="margin-right: 20px;" >
          限制配送费率({{ (minTransportCostRate*100).toFixed(0) }}%)
        </el-checkbox>
        <el-radio-group v-model="maxdelivery" size="small">
          <el-radio value="marketdemand">按市场需求</el-radio>
          <el-radio value="maxstock">全部送出</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="line" v-show="mincost">
      <el-text class="linetitle" size="small">配送费率</el-text>
      <el-slider size="small" :min="0.01" :max="0.5" :step="0.01" v-model="minTransportCostRate" :format-tooltip="formattooltip" :marks="marks" />
    </div>
  </div>
  <product-market-card :disabled="conditions.mincost" :step="10" controls :places="0" :config="plan" colored2="info" extra-readonly :extra="toSumArr"/>
  <div class="footer">
    <el-text class="linetitle cell" size="small">总物流成本:</el-text>
    <el-text class="warn" size="small">{{ dynamicCost }}</el-text>
    <el-text class="space" size="small">+</el-text>
    <el-text class="warn" size="small">{{ fixedCost }}</el-text>
    <el-text class="space" size="small">=</el-text>
    <el-text class="warn" size="small">{{ totalCost }}</el-text>
  </div>
</template>

<style scoped>
.space{
  margin: 0 5px;
}

.line{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.line.btn{
  justify-content: flex-end;
}
.line.bottom{
  justify-content: flex-end;
  margin: 5px 0;
  font-weight: 900;
}
.line.bottom .linetitle{
  width: 80px;
  margin-right: 5px;
}
.warn{
  color: #F56C6C;
}
.line>.linetitle{
  width: 50px;
  margin: 0 18px 0 0 ;
  text-align: right;   
  flex-shrink: 0; 
}

.line .input{
  margin: 0px;
  width: auto;
  display: flex;
  text-align: center;
}
</style>
