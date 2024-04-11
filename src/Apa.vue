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
    PROFIT_NET,
    PROFIT_NET_RATE,
    MIN_DELIVERY_COUNT,
    PERIOD_DATA_HISTORY_LIST,
    MY_SALE_COUNT_HISTORY_LIST,
    MY_MARKET_REQUIREMENT_HISTORY_LIST,
    MY_ORDER_HISTORY_LIST,
    MY_MARKET_SHARE_HISTORY_LIST,
    MARKET_SCALE_HISTORY_LIST,
    MARKET_SCALE_MONEY_HISTORY_LIST,
    TIME_SEQ_DATA_LIST,
    LABOR_PROFIT_PER_HOUR,
    MACHINE_PROFIT_PER_HOUR,
    totalIncome,
    totalProfit,
    totalInvest
  } from './globalState';
import { plusMatrix, sumRows,formatNumberWithCommas, divideSequence } from './tools';
import { PowerRef } from './enhanceRef';

  const activeName = PowerRef('activeName','A');
  const configPanelActive = PowerRef('configPanelActive','daily');
  const databoardActive = PowerRef('databoardActive','profit');
  const graphBoardActive = PowerRef('graphBoardActive','my');

  

window.test = ()=>{
  console.log(divideSequence(TIME_SEQ_DATA_LIST.value.saleCount, TIME_SEQ_DATA_LIST.value.marketShare))
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
            <product-market-card readonly :places=0 :config="MARKET_CAPACITY" :extra="sumRows(Object.values(MARKET_CAPACITY))" colored2="info"/>
            <el-divider content-position="left"><el-text size="small">市场规模(单位：{{ MARKET_SCALE.unit }})</el-text></el-divider>
            <product-market-card readonly :config="MARKET_SCALE.result"/>
          </el-tab-pane>
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
              <el-text class="title" type="success"><el-icon><StarFilled /></el-icon> 收入相关</el-text>
            </template>
            <el-divider content-position="left"><el-text size="small">市场对我的净需求</el-text></el-divider>
            <product-market-card readonly :places=0 :config="REQUIREMENT_NET" colored="auto" colored2="info" :extra="sumRows(Object.values(REQUIREMENT_NET))"/>
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
            <el-divider content-position="left"><el-text size="small">我的存&订货</el-text></el-divider>
            <graph-period-trend :data="MY_ORDER_HISTORY_LIST"/>
          </el-tab-pane>
          <el-tab-pane name="market">
            <template #label>
              <el-text class="title" type="success"><el-icon><StarFilled /></el-icon> 市场趋势</el-text>
            </template>
            <el-divider content-position="left"><el-text size="small">我的市占</el-text></el-divider>
            <graph-period-trend :data="MY_MARKET_SHARE_HISTORY_LIST"/>
            <el-divider content-position="left"><el-text size="small">全市场销量</el-text></el-divider>
            <graph-period-trend :data="MARKET_SCALE_HISTORY_LIST"/>
            <el-divider content-position="left"><el-text size="small">市场规模</el-text></el-divider>
            <graph-period-trend :data="MARKET_SCALE_MONEY_HISTORY_LIST"/>
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
    <div class="divderpan">
      <el-divider content-position="center"><el-text>时间序列数据（需上传CSV文件）</el-text></el-divider>

    </div>
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
        <el-divider content-position="left"><el-text size="small">价格</el-text></el-divider>
        <graph-period-trend :data="TIME_SEQ_DATA_LIST.price"/>
      </div>
      <div class="graph">
        <el-divider content-position="left"><el-text size="small">库存量</el-text></el-divider>
        <graph-period-trend :data="TIME_SEQ_DATA_LIST.storeCount"/>
      </div>
      <div class="graph">
        <el-divider content-position="left"><el-text size="small">订货</el-text></el-divider>
        <graph-period-trend :data="TIME_SEQ_DATA_LIST.orderCount"/>
      </div>
      <div class="graph">
        <el-divider content-position="left"><el-text size="small">我的市场份额</el-text></el-divider>
        <graph-period-trend :data="TIME_SEQ_DATA_LIST.marketShare" percent/>
      </div>
      <div class="graph">
        <el-divider content-position="left"><el-text size="small">市场总规模</el-text></el-divider>
        <graph-period-trend :data="divideSequence(TIME_SEQ_DATA_LIST.saleCount, TIME_SEQ_DATA_LIST.marketShare)"/>
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
  <console-frame></console-frame>
</template>



<style scoped>

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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 400px;
}
.data{
  display: flex;
}
.timeline{
  margin: 18px;
  border-radius: 5px;
  padding: 40px 60px;
  background-color: #fff;
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
