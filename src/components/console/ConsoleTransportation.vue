<script setup>
import { ref, watch, watchEffect, reactive } from 'vue'
import { plusMatrix, formatAsPercentage, parsePercentage, processMatrix,processMatrixes } from '../../tools';
import ProductMarketCard from '../ProductMarketCard.vue';
import { minTransportCostRate,MIN_DELIVERY_COUNT, TRANSPORTATION_PLAN , PERIOD_DATA} from '../../globalState';

const {chanpionSaleCount, chanpionMarketRate, mySaleCount, myMarketRequirement, myOrder} = PERIOD_DATA.value;


const demand = ref([])
const conditions = ref({})
const plan = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})
watch(demand,(v)=>{
  conditions.value = {
    mincost:Object.values(v).indexOf('mincost')>=0,
    marketdemand:Object.values(v).indexOf('marketdemand')>=0,
  }
})

watchEffect(()=>{
  const {mincost, marketdemand} = conditions.value;

  const netRequirement = plusMatrix(myOrder, myMarketRequirement);

  if(mincost && marketdemand){
    plan.value = processMatrixes(netRequirement,MIN_DELIVERY_COUNT.value,(it1,it2)=>{
      return it1<it2?0:it1
    } )
  } else if(mincost){
    plan.value = MIN_DELIVERY_COUNT.value
  } else if(marketdemand){
    plan.value = netRequirement
  } else{
    plan.value = processMatrix(myOrder,(it)=>it>=0?it:0);
  }
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



</script>

<template>
  <div class="line">
    <el-text class="linetitle" size="small">配送费率</el-text>
    <el-slider size="small" :min="0.01" :max="0.5" :step="0.01" v-model="minTransportCostRate" :format-tooltip="formattooltip" :marks="marks" />
  </div>
  <div class="line">
    <el-text class="linetitle" size="small">配送要求</el-text>
    <div class="cell">
      <el-checkbox-group v-model="demand" size="small">
      <el-checkbox value="mincost" name="mincost">
        不超过配送费率
      </el-checkbox>
      <el-checkbox value="marketdemand" name="marketdemand">
        不超过市场需求
      </el-checkbox>
    </el-checkbox-group>  
    </div>
  </div>
  
  <product-market-card class="table" readonly :config="plan"/>
</template>

<style scoped>
.table{
  margin-top: 10px;
}

.line{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
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
