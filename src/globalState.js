import { ref, watch, watchEffect } from 'vue';
import { processMatrix,processMatrixes,divideMatrix, timesMatrix, checkNumbers, plusMatrix, produceCostCalc, minusMatrixArray, minusMatrix,timesMatrixByNumber} from './tools.js'
import { PowerRef } from './enhanceRef.js';


export const A = PowerRef('A',{
  manageCost:[5000, 6000],
  hours:[8,4,8,4],
  materialCost:700,
  machineCost:100,
  laborCost:200,
  hourPay: [11,14,13,17],
  hourRemain:[520,260,520,260],
  machinePay:7.65
})

export const B = PowerRef('B',{
  manageCost:[6000, 7000],
  hours:[8,4,8,4],
  materialCost:1200,
  machineCost:160,
  laborCost:250,
  hourPay: [11,14,13,17],
  hourRemain:[520,260,520,260],
  machinePay:7.65
})

export const C = PowerRef('C',{
  manageCost:[7000, 8000],
  hours:[8,4,8,4],
  materialCost:1800,
  machineCost:450,
  laborCost:280,
  hourPay: [11,14,13,17],
  hourRemain:[520,260,520,260],
  machinePay:7.65
})

export const D = PowerRef('D',{
  manageCost:[8000, 9000],
  hours:[8,4,8,4],
  materialCost:3200,
  machineCost:640,
  laborCost:320,
  hourPay: [11,14,13,17],
  hourRemain:[520,260,520,260],
  machinePay:7.65
})

export const MY_PRICES = PowerRef('MY_PRICES',{
  A:[4500, 4500,4500,4500],
  B:[4500, 4500,4500,4500],
  C:[4500, 4500,4500,4500],
  D:[4500, 4500,4500,4500],
})

export const TRANSPORTATION_PLAN = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})

export const PRODUCTION_PLAN = PowerRef('PRODUCTION_PLAN',{
  A:[320,160,0,0],
  B:[200, 100,0,0],
  C:[0, 0,0,0],
  D:[0, 0,0,0],
})


// 物流
export const TRANSPORTATION_COST_FIXED = PowerRef('TRANSPORTATION_COST_FIXED',{
  A:[1800,600,3800,4800],
  B:[9000, 5000,12000,13000],
  C:[13600, 9800,15500,16600],
  D:[12800, 16600,18800,19800],
})

export const TRANSPORTATION_COST_DYNAMIC = PowerRef('TRANSPORTATION_COST_DYNAMIC',{
  A:[220,180,300,300],
  B:[450, 350,500,500],
  C:[700, 500,800,800],
  D:[900, 700,1000,1000],
})

//我的净需求
export const REQUIREMENT_NET = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})

// 周期配置
export const PERIOD_DATA = PowerRef('PERIOD_DATA',{
  myOrder:{
    A:[150,150,0,0],
    B:[96, 96,132,132],
    C:[0, 0,0,0],
    D:[0, 0,0,0],
  },
  myMarketRequirement:{
    A:[150,150,30,30],
    B:[96, 96,132,132],
    C:[10, 10,10,10],
    D:[10, 10,10,10],
  },
  mySaleCount:{
    A:[150,150,0,0],
    B:[96, 96,132,132],
    C:[0, 0,0,0],
    D:[0, 0,0,0],
  },
  chanpionSaleCount:{
    A:[150,150,0,0],
    B:[96, 96,132,132],
    C:[0, 0,0,0],
    D:[0, 0,0,0],
  },
  chanpionMarketRate:{
    A:[.1,.1,.1,.1],
    B:[.2,.2,.2,.2],
    C:[.3,.3,.3,.3],
    D:[.4,.4,.4,.4],
  }
})
// 周期历史
export const PERIOD_DATA_HISTORY_LIST = PowerRef('PERIOD_DATA_HISTORY_LIST',[])



/* 市场占有率 */
export const MARKET_CAPACITY = ref(0)
export const MARKET_SCALE = ref(0)
export const MARKET_SHARE_MY = ref(0)

/* 成本 */
export const COST_PRODUCE = ref(0); 
export const COST_PRODUCE_DYNAMIC = ref(0); 
export const COST_FINAL = ref(0);
/* 毛利润 */
export const PROFIT_GROSS = ref(0)
export const PROFIT_GROSS_RATE = ref(0)
/* 净利润 */
export const PROFIT_NET = ref(0)
export const PROFIT_NET_RATE = ref(0)
// 最小配送统计
export const MIN_DELIVERY_COUNT = ref(0);

export const minTransportCostRate = PowerRef('minTransportCostRate','0.08')
// 最大人工数
export const laborCount = PowerRef('laborCount','220.75');
// 最大机器数
export const machineCount = PowerRef('machineCount','124');

// 历史记录相关
export const MY_ORDER_HISTORY_LIST = PowerRef('MY_ORDER_HISTORY_LIST', [])
export const MY_MARKET_REQUIREMENT_HISTORY_LIST = PowerRef('MY_ORDER_HISTORY_LIST', [])
export const MY_SALE_COUNT_HISTORY_LIST = PowerRef('MY_ORDER_HISTORY_LIST', [])
export const MARKET_SCALE_HISTORY_LIST= PowerRef('MARKET_SCALE_HISTORY_LIST', [])
export const MY_MARKET_SHARE_HISTORY_LIST= PowerRef('MY_MARKET_SHARE_HISTORY_LIST', [])

const {chanpionSaleCount, chanpionMarketRate, mySaleCount, myMarketRequirement, myOrder} = PERIOD_DATA.value;

watchEffect(()=>{
  try{

    MARKET_CAPACITY.value = divideMatrix(chanpionSaleCount, chanpionMarketRate);
    MARKET_SCALE.value = checkNumbers(timesMatrix(MY_PRICES.value, MARKET_CAPACITY.value),2);
    MARKET_SHARE_MY.value = divideMatrix(mySaleCount, MARKET_CAPACITY.value);
  }catch(e){
    debugger

  }

})

watchEffect(()=>{
  REQUIREMENT_NET.value = plusMatrix(myOrder, myMarketRequirement);
})


watchEffect(()=>{
  // 计算各个车间成产成本
  COST_PRODUCE.value={
    A: produceCostCalc(A.value, PRODUCTION_PLAN.value.A),
    B: produceCostCalc(B.value, PRODUCTION_PLAN.value.B),
    C: produceCostCalc(C.value, PRODUCTION_PLAN.value.C),
    D: produceCostCalc(D.value, PRODUCTION_PLAN.value.D),
  }
  
  // 计算平均成本
  COST_PRODUCE_DYNAMIC.value = Object.values(COST_PRODUCE.value).map(it=>it[4]);

  // 根据价格 - 平均成本算毛利润
  PROFIT_GROSS.value=minusMatrixArray(MY_PRICES.value, COST_PRODUCE_DYNAMIC.value, true)
  // 毛利率
  PROFIT_GROSS_RATE.value = divideMatrix(PROFIT_GROSS.value, MY_PRICES.value)
  
  // 净利润
  PROFIT_NET.value = minusMatrix(PROFIT_GROSS.value, TRANSPORTATION_COST_DYNAMIC.value)
  // 净利率
  PROFIT_NET_RATE.value = divideMatrix(PROFIT_NET.value, MY_PRICES.value)
})

watchEffect(()=>{
  const minFee = timesMatrixByNumber(PROFIT_NET.value, minTransportCostRate.value)
  MIN_DELIVERY_COUNT.value = divideMatrix(TRANSPORTATION_COST_FIXED.value, processMatrix(minFee,(it=>it>=0?it:0)))
})

// 防抖
function debounce(func, delay) {
  let timeoutId;

  return function() {
      const context = this;
      const args = arguments;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
          func.apply(context, args);
      }, delay);
  };
}

watchEffect(()=>{
  MY_ORDER_HISTORY_LIST.value= [];// 存订货
  MY_MARKET_REQUIREMENT_HISTORY_LIST.value = [];// 市场对我的需求
  MY_SALE_COUNT_HISTORY_LIST.value= [];// 我的历史销量
  MARKET_SCALE_HISTORY_LIST.value= [];// 市场规模历史
  MY_MARKET_SHARE_HISTORY_LIST.value= [];// 我的市占历史

  PERIOD_DATA_HISTORY_LIST.value.map(it=>{
    const {myOrder, myMarketRequirement,mySaleCount,chanpionSaleCount,chanpionMarketRate} = it;
    // 我相关
    MY_ORDER_HISTORY_LIST.value.push(myOrder);
    MY_MARKET_REQUIREMENT_HISTORY_LIST.value.push(myMarketRequirement);
    MY_SALE_COUNT_HISTORY_LIST.value.push(mySaleCount);

    // 市场相关
    MARKET_SCALE_HISTORY_LIST.value.push(divideMatrix(chanpionSaleCount, chanpionMarketRate))
    MY_MARKET_SHARE_HISTORY_LIST.value.push(divideMatrix(mySaleCount, MARKET_CAPACITY.value))
  })
})