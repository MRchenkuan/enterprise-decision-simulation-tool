<script setup>
import { ref, watch, watchEffect, reactive } from 'vue'
import { plusMatrix, formatAsPercentage, parsePercentage, processMatrix,processMatrixes, copyLastElement, checkMapStruct } from '../../tools';
import ProductMarketCard from '../ProductMarketCard.vue';
import { COST_PRODUCE, MY_PRICES, TRANSPORTATION_COST_DYNAMIC,TIME_SEQ_DATA_LIST} from '../../globalState';
import { PowerRef } from '../../enhanceRef';



const grossProfit = PowerRef('grossProfit', 0.01);

const MY_PRICES_CACHED = PowerRef('MY_PRICES_CACHED',null)
const resetBtnState = ref(false)

watch(grossProfit,()=>{
  let cost = {};
  Object.keys(COST_PRODUCE.value).map(key=>{
    const p = COST_PRODUCE.value[key][4];
    cost[key] = [p,p,p,p]

  })
  // cost = processMatrixes(cost, TRANSPORTATION_COST_DYNAMIC.value, (a,b)=>(~~a+~~b))
  MY_PRICES.value = processMatrix(cost,it=>Math.round(grossProfit.value*it+it))
})

function save(){
  MY_PRICES_CACHED.value = JSON.parse(JSON.stringify(MY_PRICES.value));
}

function reset(){
  MY_PRICES.value = JSON.parse(JSON.stringify(MY_PRICES_CACHED.value))
}

watchEffect(()=>{
  const { marketShare, saleCount, requirementCount, orderCount,price, IS_LOAD_WITH_FILE } = TIME_SEQ_DATA_LIST.value;
  const p = copyLastElement(price)
  if(IS_LOAD_WITH_FILE && checkMapStruct(p)){
    MY_PRICES.value = p
  }
})

watchEffect(()=>{
  if(!MY_PRICES_CACHED.value){
    resetBtnState.value = false;
  } else {
    resetBtnState.value = true
  }
})

function formattooltip(v){
  return (v*100).toFixed(0)+'%'
}

const marks = reactive({
  0.2: {
    style: {
      color: '#F56C6C',
      top: "-30px",
      fontSize:"6px"
    },
    label: '20%',
  },
  0.4: {
    style: {
      fontSize:"6px",
      color: '#67C23A',
      top: "-30px"
    },
    label: '40%',
  },
  0.6: {
    style: {
      fontSize:"6px",
      color: '#F56C6C',
      top: "-30px"
    },
    label: '60%',
  },
})



</script>

<template>
  <div class="panel-header">
    <div class="line">
      <el-text class="linetitle" size="small">成本利率</el-text>
      <el-slider size="small" :min="0.01" :max="2" :step="0.01" v-model="grossProfit" :format-tooltip="formattooltip" :marks="marks" />
      <el-button class="btn" type="primary" size="small" @click="save">保存</el-button>
      <el-button class="btn" type="primary" :disabled="!resetBtnState" size="small" @click="reset">复原</el-button>
    </div>
  </div>
  <product-market-card :step="100" controls :readonly="false" :config="MY_PRICES"/>
  <div class="footer"></div>
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
