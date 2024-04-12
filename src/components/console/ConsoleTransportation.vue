<script setup>
import { ref, watch, watchEffect, reactive } from 'vue'
import { plusMatrix, formatAsPercentage, parsePercentage, processMatrix,processMatrixes, sumRows, timesMatrix, sum2DArray, autoUnit,roundToDecimal, formatNumberWithCommas } from '../../tools';
import ProductMarketCard from '../ProductMarketCard.vue';
import { minTransportCostRate,MIN_DELIVERY_COUNT, REQUIREMENT_NET,TRANSPORTATION_PLAN, TRANSPORTATION_COST_DYNAMIC, TRANSPORTATION_COST_FIXED} from '../../globalState';
import { PowerRef } from '../../enhanceRef';


const demand = PowerRef('demand',['marketdemand'])
const conditions = ref({})
const dynamicCost = ref(0)
const fixedCost = ref(0)
const totalCost = ref(0)

const plan = TRANSPORTATION_PLAN

const TRANSPORTATION_PLAN_CACHED = PowerRef('TRANSPORTATION_PLAN_CACHED',{})
const toSumArr = ref([])
const editable = ref(true)

watchEffect(()=>{
  conditions.value = {
    mincost:Object.values(demand.value).indexOf('mincost')>=0,
    marketdemand:Object.values(demand.value).indexOf('marketdemand')>=0,
  }

  const {mincost, marketdemand} = conditions.value;

  if(mincost && marketdemand){
    plan.value = processMatrixes(REQUIREMENT_NET.value,MIN_DELIVERY_COUNT.value,(it1,it2)=>{
      return it1<it2?0:it1
    } )
    editable.value = false
  } else if(mincost){
    plan.value = JSON.parse(JSON.stringify(MIN_DELIVERY_COUNT.value))
    editable.value = false
  } else if(marketdemand){
    plan.value = JSON.parse(JSON.stringify(REQUIREMENT_NET.value))
    editable.value = false
  } else {
    editable.value = true
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
      top: "-40px",
      fontSize:"12px"
    },
    label: '8%',
  },
  0.15: {
    style: {
      color: '#F56C6C',
      top: "-40px"
    },
    label: '15%',
  },
})

function save(){
  TRANSPORTATION_PLAN_CACHED.value = plan.value
}

function reset(){
  demand.value=[];
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
      <el-text class="linetitle" size="small">配送费率</el-text>
      <el-slider :disabled="!conditions.mincost" size="small" :min="0.01" :max="0.5" :step="0.01" v-model="minTransportCostRate" :format-tooltip="formattooltip" :marks="marks" />
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">配送要求</el-text>
      <div class="cell">
        <el-checkbox-group v-model="demand" size="small">
          <el-checkbox value="mincost" name="mincost">
            不超过配送费
          </el-checkbox>
          <el-checkbox value="marketdemand" name="marketdemand">
            最大市场需求
          </el-checkbox>
        </el-checkbox-group>  
      </div>
    </div>
  </div>
  <product-market-card :disabled="conditions.mincost || conditions.marketdemand" :step="10" controls :places="0" :config="plan" colored2="info" extra-readonly :extra="toSumArr"/>
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
