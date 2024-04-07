<script setup>
import { ref, watch, reactive } from 'vue'
import { plusMatrix, formatAsPercentage, parsePercentage, processMatrix,processMatrixes } from '../../tools';
import ProductMarketCard from '../ProductMarketCard.vue';
import { COST_PRODUCE, PERIOD_DATA, MY_PRICES, TRANSPORTATION_COST_DYNAMIC} from '../../globalState';

const {chanpionSaleCount, chanpionMarketRate, mySaleCount, myMarketRequirement, myOrder} = PERIOD_DATA.value;


const grossProfit = ref(0);

const MY_PRICES_CACHED = ref({})


watch(grossProfit, ()=>{
  let cost = {};
  Object.keys(COST_PRODUCE.value).map(key=>{
    const p = COST_PRODUCE.value[key][4];
    cost[key] = [p,p,p,p]

  })
  // cost = processMatrixes(cost, TRANSPORTATION_COST_DYNAMIC.value, (a,b)=>(~~a+~~b))
  MY_PRICES.value = processMatrix(cost,it=>Math.round(grossProfit.value*it+it))
})

function save(){
  MY_PRICES_CACHED.value = MY_PRICES.value
}

function reset(){
  MY_PRICES.value = MY_PRICES_CACHED.value
}



function formattooltip(v){
  return (v*100).toFixed(0)+'%'
}

const marks = reactive({
  0.1: {
    style: {
      color: '#F56C6C',
      top: "-40px",
      fontSize:"12px"
    },
    label: '10%',
  },
  0.25: {
    style: {
      fontSize:"12px",
      color: '#67C23A',
      top: "-40px"
    },
    label: '25%',
  },
  0.4: {
    style: {
      fontSize:"12px",
      color: '#F56C6C',
      top: "-40px"
    },
    label: '40%',
  },
})



</script>

<template>
  <div class="line">
    <el-text class="linetitle" size="small">成本利率</el-text>
    <el-slider size="small" :min="0.01" :max="1" :step="0.01" v-model="grossProfit" :format-tooltip="formattooltip" :marks="marks" />
    <el-button class="btn" type="primary" size="small" @click="save">保存</el-button>
    <el-button class="btn" type="primary" size="small" @click="reset">复原</el-button>
  </div>
  <product-market-card :readonly="false" :config="MY_PRICES"/>
</template>

<style scoped>
.table{
  margin-top: 10px;
}

.btn{
  margin: 0 0 0 5px;
}

.line{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  margin: 5px 0;
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
