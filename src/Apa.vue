<script setup>
  
  import { ref } from 'vue'
  import ProductionConditions from './components/ProductionConditions.vue';
  import ProductMarketCard from './components/ProductMarketCard.vue';
  import ConsoleDailyDataUpdata from './components/console/ConsoleDailyDataUpdata.vue';
  import ConsoleTransportation from './components/console/ConsoleTransportation.vue';
  import GraphTransportationCostRate from './components/graphs/GraphTransportationCostRate.vue';
  import ConsoleProductionPlan from './components/console/ConsoleProductionPlan.vue';
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
    PROFIT_NET,
    PROFIT_NET_RATE,
    MIN_DELIVERY_COUNT,
    PERIOD_DATA_HISTORY_LIST,
    MY_SALE_COUNT_HISTORY_LIST,
    MY_MARKET_REQUIREMENT_HISTORY_LIST,
    MY_ORDER_HISTORY_LIST,
    MY_MARKET_SHARE_HISTORY_LIST,
    MARKET_SCALE_HISTORY_LIST
  } from './globalState';
import { plusMatrix, sumRows } from './tools';
import { PowerRef } from './enhanceRef';

  const activeName = PowerRef('activeName','A');
  const configPanelActive = PowerRef('configPanelActive','daily');
  const databoardActive = PowerRef('databoardActive','profit');
  const graphBoardActive = PowerRef('graphBoardActive','my');



</script>

<template>
  <div class="globalconfig">
    <el-tabs v-model="configPanelActive" type="border-card" class="card">
      <el-tab-pane name="global">
        <template #label>
          <div class="tabtag">
            <el-text>全局配置</el-text>
            <el-text size="small">(首次开始时配置一次)</el-text>
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
      
      <el-tab-pane name="daily">
        <template #label>
          <div class="tabtag">
            <el-text class="title" type="success"><el-icon><StarFilled /></el-icon>每期数据</el-text>
            <el-text class="title" type="success" size="small">(每期开始时维护)</el-text>
          </div>

        </template>
        <el-alert title="根据比赛实况更新下述数据以获得最佳结果" type="warning" :closable="false" show-icon />
        <console-daily-data-updata :data="PERIOD_DATA" />
      </el-tab-pane>
    </el-tabs>
  </div>

  <div class="console">
    <el-card class="card">
      <template #header>
        <el-text>控制台(每期调整)</el-text>
      </template>
      <el-divider content-position="left"><el-text size="small">价格策略 </el-text></el-divider>
      <console-price-plan/>
      <el-divider content-position="left"><el-text size="small">运输策略（自动）</el-text></el-divider>
      <console-transportation/>
      <el-divider content-position="left"><el-text size="small">生产策略 </el-text></el-divider>
      <console-production-plan/>
    </el-card>
  </div>

  <div class="market">
    <el-tabs v-model="databoardActive" type="border-card" class="card">
      <template #header>
        <el-text>市场&成本&利润</el-text>
      </template>
      <el-tab-pane name="market">
        <template #label>
          <el-text class="title"><el-icon><PieChart /></el-icon> 市场相关</el-text>
        </template>
        <el-divider content-position="left"><el-text size="small">我的市占</el-text></el-divider>
        <product-market-card readonly unit="%" :config="MARKET_SHARE_MY"/> 
        <el-divider content-position="left"><el-text size="small">全市场销量总和</el-text></el-divider>
        <product-market-card readonly :places=0 :config="MARKET_CAPACITY"/>
        <el-divider content-position="left"><el-text size="small">市场规模(单位：{{ MARKET_SCALE.unit }})</el-text></el-divider>
        <product-market-card readonly :config="MARKET_SCALE.result"/>
      </el-tab-pane>
      <el-tab-pane name="cost">
        <template #label>
          <el-text class="title"><el-icon><List /></el-icon> 成本相关</el-text>
        </template>
        <el-divider content-position="left"><el-text size="small">生产成本 </el-text></el-divider>
        <product-market-card type="produce" :extra="COST_PRODUCE_DYNAMIC" :places="0" colored="bad" readonly :config="COST_PRODUCE"/>
        <el-divider content-position="left"><el-text size="small">物流成本衰减</el-text></el-divider>
        <graph-transportation-cost-rate :data="TRANSPORTATION_COST_FIXED"/>
      </el-tab-pane>
      <el-tab-pane name="profit">
        <template #label>
          <el-text class="title" type="success"><el-icon><StarFilled /></el-icon> 收入相关</el-text>
        </template>
        <el-divider content-position="left"><el-text size="small">市场对我的净需求</el-text></el-divider>
        <product-market-card readonly :places=0 :config="REQUIREMENT_NET" colored="auto" :extra="sumRows(Object.values(REQUIREMENT_NET))"/>
        <el-divider content-position="left"><el-text size="small">毛利率 </el-text></el-divider>
        <product-market-card unit="%" readonly colored="auto" :config="PROFIT_GROSS_RATE"/>
        <el-divider content-position="left"><el-text size="small">终端利率（算上物流费用） </el-text></el-divider>
        <product-market-card unit="%" colored="auto" readonly :config="PROFIT_NET_RATE"/>
        <el-divider content-position="left"><el-text size="small">单件毛利 </el-text></el-divider>
        <product-market-card readonly colored="auto" :config="PROFIT_NET"/>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="trend">
    <el-tabs v-model="graphBoardActive" type="border-card" class="card">
      <el-tab-pane name="my">
        <template #label>
          <el-text class="title"><el-icon><DataLine /></el-icon> 我的趋势</el-text>
        </template>
        <el-divider content-position="left"><el-text size="small">我的历史销量</el-text></el-divider>
        <graph-period-trend :data="MY_SALE_COUNT_HISTORY_LIST"/>
        <el-divider content-position="left"><el-text size="small">市场对我的需求</el-text></el-divider>
        <graph-period-trend :data="MY_MARKET_REQUIREMENT_HISTORY_LIST"/>
        <el-divider content-position="left"><el-text size="small">我的历史销量</el-text></el-divider>
        <graph-period-trend :data="MY_ORDER_HISTORY_LIST"/>
      </el-tab-pane>
      <el-tab-pane name="market">
        <template #label>
          <el-text class="title" type="success"><el-icon><StarFilled /></el-icon> 市场趋势</el-text>
        </template>
        <el-divider content-position="left"><el-text size="small">我的市占</el-text></el-divider>
        <graph-period-trend :data="MY_MARKET_SHARE_HISTORY_LIST"/>
        <el-divider content-position="left"><el-text size="small">市场规模</el-text></el-divider>
        <graph-period-trend :data="MARKET_SCALE_HISTORY_LIST"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>



<style scoped>
.tabtag{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
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
