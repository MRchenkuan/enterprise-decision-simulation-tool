import { ref, watch, watchEffect } from 'vue';
import { processMatrix,processMatrixes,divideMatrix, timesMatrix, checkNumbers, plusMatrix, produceCostCalc, minusMatrixArray, minusMatrix,timesMatrixByNumber, sumRows, timesArrays, sumArray, formatNumberWithCommas, sum2DArray, divideArrays, copyLastElement, checkMapStruct, newStructure} from './tools.js'
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
  A:[6500, 6500,6500,6500],
  B:[8000, 8000,8000,8000],
  C:[9500, 9500,9500,9500],
  D:[11000, 11000,11000,11000],
})

export const TRANSPORTATION_PLAN = PowerRef('TRANSPORTATION_PLAN',{
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
  myMarketKeep:{
    A:[0,0,0,0],
    B:[0,0,0,0],
    C:[0,0,0,0],
    D:[0,0,0,0],
  },
  mySaleCount:{
    A:[150,150,0,0],
    B:[96, 96,132,132],
    C:[0, 0,0,0],
    D:[0, 0,0,0],
  },
})
// 周期历史
export const PERIOD_DATA_HISTORY_LIST = PowerRef('PERIOD_DATA_HISTORY_LIST',[])



/* 市场占有率 */
export const MARKET_CAPACITY = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
}) // 数量
export const MARKET_SCALE = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
}) //价格
export const MARKET_SHARE_MY = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})

/* 成本 */
export const COST_PRODUCE = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
}); // 单品单车间成本矩阵
export const COST_PRODUCE_DYNAMIC = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
}); // 根据产量实时计算单品平均成本
export const COST_FINAL = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
});
/* 毛利润 */
export const PROFIT_GROSS = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})
export const PROFIT_GROSS_RATE = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})
/* 净利润 */
export const PROFIT_NET = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})
export const PROFIT_NET_RATE = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})
// 最小配送统计
export const MIN_DELIVERY_COUNT = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
});
// 单位时间利润
export const LABOR_PROFIT_PER_HOUR = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})// 人工
export const MACHINE_PROFIT_PER_HOUR = ref({
  A:[0,0,0,0],
  B:[0,0,0,0],
  C:[0,0,0,0],
  D:[0,0,0,0],
})// 机器


// 总收入、盈利、投入
export const totalIncome = ref(0)
export const totalProfit = ref(0)
export const totalInvest = ref(0)

export const minTransportCostRate = PowerRef('minTransportCostRate',0.08)
// 最大人工数
export const laborCount = PowerRef('laborCount','220.75');
// 最大机器数
export const machineCount = PowerRef('machineCount','124');

// 历史记录相关
export const MY_ORDER_HISTORY_LIST = PowerRef('MY_ORDER_HISTORY_LIST', [])
export const MY_MARKET_REQUIREMENT_HISTORY_LIST = PowerRef('MY_MARKET_REQUIREMENT_HISTORY_LIST', [])
export const MY_SALE_COUNT_HISTORY_LIST = PowerRef('MY_SALE_COUNT_HISTORY_LIST', [])
export const MARKET_SCALE_HISTORY_LIST= PowerRef('MARKET_SCALE_HISTORY_LIST', [])
export const MARKET_SCALE_MONEY_HISTORY_LIST= PowerRef('MARKET_SCALE_MONEY_HISTORY_LIST', [])
export const MY_MARKET_SHARE_HISTORY_LIST= PowerRef('MY_MARKET_SHARE_HISTORY_LIST', [])

// 文件导入相关
export const PERIOD_DATA_HISTORY_LIST_BY_DOWNLOADFILE = PowerRef('PERIOD_DATA_HISTORY_LIST_BY_DOWNLOADFILE',[]);
// export const TIME_SEQ_DATA_LIST = PowerRef('TIME_SEQ_DATA_LIST',{})
export const TIME_SEQ_DATA_LIST = ref({})



const { myOrder, myMarketKeep} = PERIOD_DATA.value;
const { marketShare, saleCount, requirementCount, orderCount } = TIME_SEQ_DATA_LIST.value; 


watchEffect(()=>{
  const _saleCount = copyLastElement(saleCount);
  const _marketShare = copyLastElement(marketShare);
  
  try{

    MARKET_CAPACITY.value = divideMatrix(_saleCount, _marketShare);
    MARKET_SCALE.value = checkNumbers(timesMatrix(MY_PRICES.value, MARKET_CAPACITY.value),2);
    checkMapStruct(marketShare) && (MARKET_SHARE_MY.value = copyLastElement(marketShare));
  }catch(e){
    debugger
  }
})

watchEffect(()=>{
  checkMapStruct(orderCount) && (PERIOD_DATA.value.myOrder = minusMatrix(copyLastElement(orderCount), myMarketKeep))
  checkMapStruct(saleCount) && (PERIOD_DATA.value.mySaleCount = copyLastElement(saleCount));
})

watchEffect(()=>{
  const { marketShare, saleCount, requirementCount, orderCount } = TIME_SEQ_DATA_LIST.value; 
  const myOrder = copyLastElement(orderCount)
  const myPureOder = minusMatrix(myOrder, myMarketKeep);
  const myRequirement = copyLastElement(requirementCount)
  const reqNet = plusMatrix(myPureOder,myRequirement);
  REQUIREMENT_NET.value = checkMapStruct(reqNet)?reqNet: newStructure()
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
  const avgPrices = sumRows(Object.values(MY_PRICES.value)).map(it=>it/4)
  const production = sumRows(Object.values(PRODUCTION_PLAN.value))
  // 总收入 = 产品数量*平均价格
  totalIncome.value = sumArray(timesArrays(avgPrices, production))
})

watchEffect(()=>{
  const config = {A,B,C,D}
  const plan = PRODUCTION_PLAN.value;
  const tplan = TRANSPORTATION_PLAN.value;
  // 总投入 = 生产成本+生产管理费+物流成本
  // 生产成本
  const productInvest = sum2DArray(Object.values(timesMatrix(plan, COST_PRODUCE.value)));
  //管理成本
  let manageInvest = 0
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
  // 物流成本
  let transInvest = 0
  Object.keys(tplan).map(key=>{
    const line = TRANSPORTATION_COST_FIXED.value[key]
    tplan[key].map((it,id)=>{
      if(it>0){
        transInvest += ~~line[id];
      }   
    })
  })
  totalInvest.value = productInvest+manageInvest+transInvest;
})

watchEffect(()=>{
  totalProfit.value = totalIncome.value-totalInvest.value
})

watchEffect(()=>{
  const f = PROFIT_NET.value;
  const labalCost = [A,B,C,D].map(it=>it.value.laborCost)
  const machineCost = [A,B,C,D].map(it=>it.value.machineCost)
  Object.keys(f).map((k,i)=>{
    LABOR_PROFIT_PER_HOUR.value[k] = f[k].map(ele=>ele/labalCost[i])
    MACHINE_PROFIT_PER_HOUR.value[k] = f[k].map(ele=>ele/machineCost[i])
  })
})