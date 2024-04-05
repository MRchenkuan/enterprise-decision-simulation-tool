import { ref, watchEffect } from 'vue';
import { processMatrix,processMatrixes,divideMatrix, timesMatrix, checkNumbers, plusMatrix, produceCostCalc, minusMatrixArray, minusMatrix,timesMatrixByNumber} from './tools.js'

export const A = ref({
  manageCost:[5000, 6000],
  hours:[8,4,8,4],
  materialCost:700,
  machineCost:160,
  laborCost:240,
  hourPay: [11,14,13,17],
  hourRemain:[520,260,520,260],
  machinePay:7.65
})

export const B = ref({
  manageCost:[6000, 7000],
  hours:[8,4,8,4],
  materialCost:800,
  machineCost:320,
  laborCost:280,
  hourPay: [11,14,13,17],
  hourRemain:[520,260,520,260],
  machinePay:7.65
})

export const C = ref({
  manageCost:[7000, 8000],
  hours:[8,4,8,4],
  materialCost:900,
  machineCost:480,
  laborCost:320,
  hourPay: [11,14,13,17],
  hourRemain:[520,260,520,260],
  machinePay:7.65
})

export const D = ref({
  manageCost:[9000, 10000],
  hours:[8,4,8,4],
  materialCost:1000,
  machineCost:600,
  laborCost:410,
  hourPay: [11,14,13,17],
  hourRemain:[520,260,520,260],
  machinePay:7.65
})

export const MY_PRICES = ref({
  A:[4500, 4500,4500,4500],
  B:[4500, 4500,4500,4500],
  C:[4500, 4500,4500,4500],
  D:[4500, 4500,4500,4500],
})

export const TRANSPORTATION_PLAN = ref(0)

export const PRODUCTIONPLAN = ref({
  A:[150,150,0,0],
  B:[96, 96,132,132],
  C:[0, 0,0,0],
  D:[0, 0,0,0],
})


// 物流
export const TRANSPORTATION_COST_FIXED = ref({
  A:[1800,600,3800,4800],
  B:[9000, 5000,12000,13000],
  C:[13600, 9800,15500,16600],
  D:[12800, 16600,18800,19800],
})

export const TRANSPORTATION_COST_DYNAMIC = ref({
  A:[220,180,300,300],
  B:[450, 350,500,500],
  C:[700, 500,800,800],
  D:[900, 700,1000,1000],
})

// 周期配置
export const PERIOD_DATA = ref({
  myOrder:{
    A:[150,150,0,0],
    B:[96, 96,132,132],
    C:[0, 0,0,0],
    D:[0, 0,0,0],
  },
  myMarketRequirement:{
    A:[150,150,0,0],
    B:[96, 96,132,132],
    C:[-30, -30,-30,30],
    D:[-30, -30,-30,-20],
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

export const MARKET_CAPACITY = ref(0)
export const MARKET_SCALE = ref(0)
export const MARKET_SHARE_MY = ref(0)

/* 成本 */
export const COST_PRODUCE = ref(0); 
export const COST_PRODUCE_DYNAMIC = ref(0); 
export const COST_FINAL = ref(0);
/* 利润 */
export const PROFIT_GROSS = ref(0)
export const PROFIT_GROSS_RATE = ref(0)
export const PROFIT_NET = ref(0)
export const PROFIT_NET_RATE = ref(0)


const {chanpionSaleCount, chanpionMarketRate, mySaleCount, myMarketRequirement, myOrder} = PERIOD_DATA.value;

watchEffect(()=>{
  MARKET_CAPACITY.value = divideMatrix(chanpionSaleCount, chanpionMarketRate);
  MARKET_SCALE.value = checkNumbers(timesMatrix(MY_PRICES.value, MARKET_CAPACITY.value),2);
  MARKET_SHARE_MY.value = divideMatrix(mySaleCount, MARKET_CAPACITY.value);
})


watchEffect(()=>{
  // 计算各个车间单件成本
  COST_PRODUCE.value={
    A: produceCostCalc(A.value, PRODUCTIONPLAN.value.A),
    B: produceCostCalc(B.value, PRODUCTIONPLAN.value.B),
    C: produceCostCalc(C.value, PRODUCTIONPLAN.value.C),
    D: produceCostCalc(D.value, PRODUCTIONPLAN.value.D),
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

export const MIN_DELIVERY_COUNT = ref(0);

export const minTransportCostRate = ref(0.08)

watchEffect(()=>{
  const minFee = timesMatrixByNumber(PROFIT_NET.value, minTransportCostRate.value)
  MIN_DELIVERY_COUNT.value = divideMatrix(TRANSPORTATION_COST_FIXED.value, processMatrix(minFee,(it=>it>=0?it:0)))
})
// 最大人工数
export const laborCount = ref(0);
// 最大机器数
export const machineCount = ref(0);