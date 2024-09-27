<script setup>
  
  import { ref, watchEffect } from 'vue'
  import ProductionConditions from './components/ProductionConditions.vue';
  import ProductMarketCard from './components/ProductMarketCard.vue';
  import ConsoleDailyDataUpdata from './components/console/ConsoleDailyDataUpdata.vue';
  import ConsoleTransportation from './components/console/ConsoleTransportation.vue';
  import GraphTransportationCostRate from './components/graphs/GraphTransportationCostRate.vue';
  import ConsoleProductionPlan from './components/console/ConsoleProductionPlan.vue';
  import ConsoleFrame from './components/console/ConsoleFrame.vue';
  import ConsolePricePlan from './components/console/ConsolePricePlan.vue';
  import GraphPeriodTrend from './components/graphs/GraphPeriodTrend.vue';

  import {
    A, B,C,D,
    MY_PRICES, 
    TRANSPORTATION_PLAN,
    PRODUCTION_PLAN,
    TRANSPORTATION_COST_FIXED,
    TRANSPORTATION_COST_DYNAMIC,
    PERIOD_DATA,
    MARKET_CAPACITY,
    MARKET_SCALE,
    MARKET_SHARE_MY,
    COST_PRODUCE,
    COST_PRODUCE_DYNAMIC,
    COST_FINAL,
    PROFIT_GROSS,
    PROFIT_GROSS_RATE,
    REQUIREMENT_NET,
    MARKET_REQUIREMENT,
    PROFIT_NET,
    PROFIT_NET_RATE,
    MIN_DELIVERY_COUNT,
    TIME_SEQ_DATA_LIST,
    LABOR_PROFIT_PER_HOUR,
    MACHINE_PROFIT_PER_HOUR,
    MARKET_SALE,
    totalIncome,
    totalProfit,
    totalInvest,
    MARKET_STORE_COUNT,
    MARKET_SALE_GLOBAL,
    MARKET_POWER_MY,
    MARKET_PRICE_MY,
    INVEST_ADV,
    INVEST_PROMT,
    MARKET_ORDER
  } from './globalState';
import { plusMatrix, sumRows,formatNumberWithCommas, divideSequence,minusMatrix, copyLastElement, processMatrix,divideMatrix } from './tools';
import { PowerRef } from './enhanceRef';

  const activeName = PowerRef('activeName','A');
  const configPanelActive = PowerRef('configPanelActive','global');
  const databoardActive = PowerRef('databoardActive','profit');
  const competitionBoardActive = PowerRef('competitionBoardActive','competition');

  function getDiff(m1, m2, times=1){
    return minusMatrix(processMatrix(m1,it=>it*times), processMatrix(m2,it=>it*times));
  }

  function getMarketPowerDiff(){
    const { marketShare, saleCount, requirementCount, orderCount,storeCount,price,prmtInvest,advInvest } = TIME_SEQ_DATA_LIST.value; 
    const marketpower = divideMatrix(copyLastElement(requirementCount), divideMatrix(copyLastElement(saleCount), copyLastElement(marketShare)));
    const lastmarketpower = divideMatrix(copyLastElement(requirementCount,2), divideMatrix(copyLastElement(saleCount,2), copyLastElement(marketShare,2)));
    return minusMatrix(processMatrix(marketpower,it=>it*100), processMatrix(lastmarketpower,it=>it*100));
  }

  function getAdvPrmtDiff(){
    const { marketShare, saleCount, requirementCount, orderCount,storeCount,price,prmtInvest,advInvest } = TIME_SEQ_DATA_LIST.value; 
    return processMatrix(minusMatrix(plusMatrix(INVEST_ADV.value, INVEST_PROMT.value),plusMatrix(copyLastElement(prmtInvest,2), copyLastElement(advInvest,2))), it=>it*0.0001)
  }

  function getMarketSaleDiff(){
    const { marketShare, saleCount, requirementCount, orderCount,storeCount,price,prmtInvest,advInvest } = TIME_SEQ_DATA_LIST.value; 
    return minusMatrix(MARKET_SALE_GLOBAL.value, divideMatrix(copyLastElement(saleCount, 2), copyLastElement(marketShare, 2)));
  }

</script>

<template>
  <div class="container">
    <div class="data">
      <div class="globalconfig">
        <el-tabs v-model="configPanelActive" type="border-card" class="card">
          <el-tab-pane name="global">
            <template #label>
              <div class="tabtag">
                <el-text><el-icon><StarFilled/></el-icon> 全局配置</el-text>
                <el-text type="success" size="small">(首次开始时配置一次)</el-text>
              </div>
            </template>
            <el-alert title="一次性配置，根据比赛界信息配置完毕即可" description="" type="warning" :closable="false" show-icon />

            <el-divider content-position="left"><el-text size="small">产线配置</el-text></el-divider>
            <el-tabs type="border-card" v-model="activeName" class="demo-tabs">
              <el-tab-pane label="产品A" name="A"><production-conditions :config="A"/></el-tab-pane>
              <el-tab-pane label="产品B" name="B"><production-conditions :config="B"/></el-tab-pane>
              <el-tab-pane label="产品C" name="C"><production-conditions :config="C"/></el-tab-pane>
              <el-tab-pane label="产品D" name="D"><production-conditions :config="D"/></el-tab-pane>
            </el-tabs>

            <el-divider content-position="left"><el-text size="small">物流固定费 </el-text></el-divider>
            <product-market-card :config="TRANSPORTATION_COST_FIXED"/>

            <el-divider content-position="left"><el-text size="small">物流单件配送费 </el-text></el-divider>
            <product-market-card :config="TRANSPORTATION_COST_DYNAMIC"/>
          </el-tab-pane>
          <el-tab-pane name="market">
            <template #label>
              <el-text class="title" type="success"><el-icon><List /></el-icon> 当期销售情况</el-text>
            </template>
            <el-divider content-position="left"><el-text size="small">上期我的销量</el-text></el-divider>
            <product-market-card readonly :places=0 :config="MARKET_SALE" :diff="getDiff(MARKET_SALE, copyLastElement(TIME_SEQ_DATA_LIST.saleCount, 2))" colored="auto" colored2="info" :extra="sumRows(Object.values(MARKET_SALE))"/>
            <el-divider content-position="left"><el-text size="small">本期可销售数量（产量+市场存货）</el-text></el-divider>
            <product-market-card readonly :places=0 :config="plusMatrix(TRANSPORTATION_PLAN, MARKET_STORE_COUNT)" :diff="getDiff(plusMatrix(TRANSPORTATION_PLAN, MARKET_STORE_COUNT), MARKET_SALE)" colored="good" colored2="info" :extra="sumRows(Object.values(plusMatrix(TRANSPORTATION_PLAN, MARKET_STORE_COUNT)))"/>    
            <el-divider content-position="left"><el-text size="small">上期市场总销量</el-text></el-divider>
            <product-market-card readonly :places=0 :config="MARKET_SALE_GLOBAL" :diff="getMarketSaleDiff()" colored="auto" colored2="info" :extra="sumRows(Object.values(MARKET_SALE_GLOBAL))"/>
            <el-divider content-position="left"><el-text size="small">我在市场上的库存</el-text></el-divider>
            <product-market-card readonly :places=0 :config="MARKET_STORE_COUNT" :diff="getDiff(MARKET_STORE_COUNT, copyLastElement(TIME_SEQ_DATA_LIST.storeCount, 2))" colored="bad" colored2="info" :extra="sumRows(Object.values(MARKET_STORE_COUNT))"/>
            <el-divider content-position="left"><el-text size="small">市场对我的订货</el-text></el-divider>
            <product-market-card readonly :places=0 :config="MARKET_ORDER" :diff="getDiff(MARKET_ORDER, copyLastElement(TIME_SEQ_DATA_LIST.orderCount, 2))" colored="good" colored2="info" :extra="sumRows(Object.values(MARKET_ORDER))"/>                                          
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="competition">
        <el-tabs v-model="competitionBoardActive" type="border-card" class="card">
          <el-tab-pane name="competition">
            <template #label>
              <el-text class="title"><el-icon><List /></el-icon> 竞争力相关</el-text>
            </template>
            <el-divider content-position="left"><el-text size="small">上期我的价格</el-text></el-divider>
            <product-market-card readonly :places=0 :config="MARKET_PRICE_MY" :diff="getDiff(MARKET_PRICE_MY, copyLastElement(TIME_SEQ_DATA_LIST.price, 2))" colored="auto"/>
            <el-divider content-position="left"><el-text size="small">上期我的广促投入（单位：万）</el-text></el-divider>
            <product-market-card readonly :places=0 :config="processMatrix(plusMatrix(INVEST_ADV, INVEST_PROMT), it=>it*0.0001)" diffunit="万" :diff="getAdvPrmtDiff()" colored="auto"/>
            <el-divider content-position="left"><el-text size="small" type="danger">上期我的市场竞争力(我的商品需求占全市场的比例)</el-text></el-divider>
            <product-market-card readonly :places=2 :config="MARKET_POWER_MY" diffunit="%" :diff="getMarketPowerDiff()" colored="auto" unit="%"/>
            <el-divider content-position="left"><el-text size="small">上期我的市场份额</el-text></el-divider>
            <product-market-card readonly :places=2 :config="MARKET_SHARE_MY" diffunit="%" :diff="getDiff(MARKET_SHARE_MY, copyLastElement(TIME_SEQ_DATA_LIST.marketShare, 2), 100)" colored="auto" unit="%"/>
            <el-divider content-position="left"><el-text size="small">市场对我需求（上期）</el-text></el-divider>
            <product-market-card readonly :places=0 :config="MARKET_REQUIREMENT" :diff="getDiff(MARKET_REQUIREMENT, copyLastElement(TIME_SEQ_DATA_LIST.requirementCount, 2))" colored="auto" colored2="info" :extra="sumRows(Object.values(MARKET_REQUIREMENT))"/>
            <el-divider content-position="left"><el-text size="small">市场对我的净需求（扣掉市场中没卖掉的库存）</el-text></el-divider>
            <product-market-card readonly :places=0 :config="REQUIREMENT_NET" :diff="getDiff(REQUIREMENT_NET, copyLastElement(TIME_SEQ_DATA_LIST.requirementCount, 2))" colored="auto" colored2="info" :extra="sumRows(Object.values(REQUIREMENT_NET))"/>
            
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="market">
        <el-tabs v-model="databoardActive" type="border-card" class="card">
          <el-tab-pane name="cost">
            <template #label>
              <el-text class="title"><el-icon><List /></el-icon> 成本相关</el-text>
            </template>
            <el-divider content-position="left"><el-text size="small">生产成本 </el-text></el-divider>
            <product-market-card type="produce" :extra="COST_PRODUCE_DYNAMIC" :places="0" colored2="bad" readonly :config="COST_PRODUCE"/>
            <el-divider content-position="left"><el-text size="small">物流成本衰减</el-text></el-divider>
            <graph-transportation-cost-rate :data="TRANSPORTATION_COST_FIXED"/>
          </el-tab-pane>
          <el-tab-pane name="profit">
            <template #label>
              <el-text class="title" type="success"><el-icon><StarFilled /></el-icon> 利润相关</el-text>
            </template>
            <el-divider content-position="left"><el-text size="small">毛利率 </el-text></el-divider>
            <product-market-card unit="%" readonly colored="auto" :config="PROFIT_GROSS_RATE"/>
            <el-divider content-position="left"><el-text size="small">终端利率（算上物流费用） </el-text></el-divider>
            <product-market-card unit="%" colored="auto" readonly :config="PROFIT_NET_RATE"/>
            <el-divider content-position="left"><el-text size="small">单件毛利 </el-text></el-divider>
            <product-market-card readonly colored="auto" :config="PROFIT_NET"/>
            <el-divider content-position="left"><el-text size="small">单位工时利润 </el-text></el-divider>
            <product-market-card readonly colored="auto" :config="LABOR_PROFIT_PER_HOUR"/>
            <el-divider content-position="left"><el-text size="small">单位机时利润 </el-text></el-divider>
            <product-market-card readonly colored="auto" :config="MACHINE_PROFIT_PER_HOUR"/>
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
    <div class="trendpanel">
      <el-divider content-position="left">趋势数据</el-divider>
      <div class="timeline">
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">需求量</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.requirementCount"/>
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">销量</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.saleCount"/>
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">市场总销量</el-text></el-divider>
          <graph-period-trend :data="divideSequence(TIME_SEQ_DATA_LIST.saleCount, TIME_SEQ_DATA_LIST.marketShare)"/>
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">订货</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.orderCount"/>
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">价格</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.price"/>
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">市场存货</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.storeCount"/>
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">我的市场份额</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.marketShare" percent/>
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">研发水平</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.devlevel"/>
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">我的良率</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.rightRate" percent/>
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">促销费</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.prmtInvest" auto-unit />
        </div>
        <div class="graph">
          <el-divider content-position="left"><el-text size="small">广告投入</el-text></el-divider>
          <graph-period-trend :data="TIME_SEQ_DATA_LIST.advInvest" auto-unit />
        </div>
      </div>
    </div>
  </div>
  <console-frame></console-frame>
</template>



<style scoped>

.trendpanel{
  display: flex;
  flex-direction: column;
  background:#fff;
  margin: 18px;
  padding: 18px;
  border-radius: 5px;
  background-color: #fff;
}

.divderpan{
  width:100%;
  padding: 20px 0;
  background: #fff;
    border-radius: 5px;
    margin: 20px;
    display: flex;
    justify-content: center;
    align-self: stretch;
}
.container{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 200px 400px 400px 250px;
  background-color: #242424;;
}
.data{
  display: flex;
}
.timeline{
  display: grid;
  grid-template-columns: repeat(3, 0fr);
  grid-gap: 10px;
}
.timeline>.graph{
  width: 380px;
  height:350px
}
.line{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
}
.line .cell{
  font-weight: 900;
}
.good{
  color: #67C23A;
  font-weight: 900;
}
.info{
  color: #409EFF;
  font-weight: 900;
}
.bad{
  color: #F56C6C;
  font-weight: 900;
}
.tabtag{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.console .card{
  width: 460px;
}
  .card{
    margin: 20px;
    width: 400px;
    display: block;
    padding: 0;
    float: left;
  }
  .globalconfig{
    /* width: 480px; */
  }
  .left{
    width: 1200px;
    display: block;
  }
</style>
