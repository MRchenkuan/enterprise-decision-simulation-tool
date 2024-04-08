<script setup>
import { ref, watchEffect } from 'vue'
import ProductMarketCard from '../ProductMarketCard.vue';
const props = defineProps({
  data: Object,
})
const dailyDataPanelActive = PowerRef('dailyDataPanelActive','销量&市场份额');
import {laborCount,machineCount, PERIOD_DATA_HISTORY_LIST } from '../../globalState.js'
import { PowerRef } from '../../enhanceRef';
import { debounce } from '../../tools';
import { ElText } from 'element-plus';

const newPeriodD = debounce(()=>{
  PERIOD_DATA_HISTORY_LIST.value.push(props.data)
},300)

const updateState = PowerRef('updateState',{
  sale:false,
  require:false,
  power:false
})
const allUpdated = PowerRef('allUpdated',false);

watchEffect(()=>{
  const {sale, require, power} = updateState.value;
  allUpdated.value = sale&&require&&power
})

function newPeriod(){
  newPeriodD()
  setUpdateState(false, false, false,)
}
function clearPeriod(){
  PERIOD_DATA_HISTORY_LIST.value=[];
  setUpdateState(false, false, false,)
}

function setUpdateState(sale, require, power){
  updateState.value.sale = sale;
  updateState.value.require = require;
  updateState.value.power = power;
}

</script>

<template>
  <div class="header">
    <el-text v-if="PERIOD_DATA_HISTORY_LIST.length" class="periodtitle">《第 <el-icon><Clock /></el-icon> {{PERIOD_DATA_HISTORY_LIST.length+1}} 期局面数据》</el-text>
    <div></div>
    <div class="optrations">
      <el-popconfirm
        width="350"
        icon="WarningFilled"
        title="手动更新数据，并点击保存当期为历史数据"
        confirm-button-text="创建新一期"
        cancel-button-text="不保存, 再改改"
        cancel-button-type="text"
        icon-color="#E6A23C"
        trigger="hover"
        placement="top"
        @confirm="newPeriod">
        <template #reference>
          <el-button type="primary" :disabled="!allUpdated" icon="CirclePlus" size="small" round>新建一期</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        width="300"
        icon="CircleCloseFilled"
        title="将会重置所有“期”的数据,不只是当期"
        confirm-button-text="我就要重置"
        cancel-button-text="点错了"
        cancel-button-type="primary"
        confirm-button-type="text"
        trigger="click"
        placement="top"
        icon-color="#F56C6C"
        @confirm="clearPeriod">
        <template #reference>
          <el-button type="danger" icon="DeleteFilled" size="small" round>重置所有</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
  
  <el-tabs  :stretch="true" v-model="dailyDataPanelActive">
    <el-tab-pane name="销量&市场份额">
      <template #label>
        <div class="tabtag">
          <el-text size="small">销售情况</el-text>
          <el-text v-if="!updateState.sale" size="small" class="notupdate">(未更新)</el-text>
          <el-text v-else size="small" class="updated">(已更新)</el-text>
        </div>
      </template>
      <el-divider content-position="left"><el-text size="small">我的销量</el-text></el-divider>
      <product-market-card :config="data.mySaleCount"/>
      <el-divider content-position="left"><el-text size="small">第一名的销量</el-text></el-divider>
      <product-market-card :config="data.chanpionSaleCount"/>     
      <el-divider content-position="left"><el-text size="small">第一名的市占</el-text></el-divider>
      <product-market-card unit="%" :config="data.chanpionMarketRate"/>
      <el-divider border-style="dashed" />
      <el-button type="success" :plain="!updateState.sale" @click="updateState.sale=!updateState.sale">我已确认更新</el-button>
    </el-tab-pane>
    <el-tab-pane name="需求&存订货">
      <template #label>
        <div class="tabtag">
          <el-text size="small">需求情况</el-text>
          <el-text v-if="!updateState.require" size="small" class="notupdate">(未更新)</el-text>
          <el-text v-else size="small" class="updated">(已更新)</el-text>        </div>
      </template>
      <el-divider content-position="left"><el-text size="small">市场对我的需求</el-text></el-divider>
      <product-market-card :config="data.myMarketRequirement"/>
      <el-divider content-position="left"><el-text size="small">市场上的存&订货（存货用负值）</el-text></el-divider>
      <product-market-card :config="data.myOrder"/>
      <el-divider border-style="dashed" />
      <el-button type="success" icon="Check" :plain="!updateState.require" @click="updateState.require=!updateState.require">我已确认更新</el-button>
    </el-tab-pane>
    <el-tab-pane name="生产力">
      <template #label>
        <div class="tabtag">
          <el-text size="small">生产力</el-text>
          <el-text v-if="!updateState.power" size="small" class="notupdate">(未更新)</el-text>
          <el-text v-else size="small" class="updated">(已更新)</el-text>        </div>
      </template>
      <el-divider content-position="left"><el-text size="small">生产力水平</el-text></el-divider>
      <div class="line">
        <el-text class="linetitle cell" size="small">可用工人数</el-text>
        <el-input v-model="laborCount" size="small" class="input cell" />
      </div>
      <div class="line">
        <el-text class="cell linetitle" size="small">可用机器数</el-text>
        <el-input v-model="machineCount" size="small" class="input cell" />
      </div>
      <el-divider border-style="dashed" />
      <el-button type="success" icon="Check" :plain="!updateState.power" @click="updateState.power=!updateState.power">我已确认更新</el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
.periodtitle{
  font-weight: 900;
}
.tabtag{
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: center;
}
.line{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0;
}
.linetitle{
  width: 85px;
}
.input{
  width: 85px;
}
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

el-text{
  padding: 0 5px;  
}
.notupdate{
  color: #F56C6C;
}

.updated{
  color: #67C23A;
}
</style>
