<script setup>
import { ref } from 'vue'
import ProductMarketCard from '../ProductMarketCard.vue';
defineProps({
  data: Object,
})
const dailyDataPanelActive = ref('销量&市场份额');
import {laborCount,machineCount } from '../../globalState.js'

</script>

<template>
  <div class="header">
    <div class="optrations">
      <el-button type="primary" round>保存当期</el-button>
      <el-button type="primary" round>新建一期</el-button>
    </div>
  </div>
  
  <el-tabs  :stretch="true" v-model="dailyDataPanelActive">
    <el-tab-pane name="销量&市场份额">
      <template #label>
        <div class="tabtag">
          <el-text size="small">市场情况</el-text>
          <el-text size="small" class="notupdate">(未更新)</el-text>
        </div>
      </template>
      <el-divider content-position="left"><el-text size="small">我的销量</el-text></el-divider>
      <product-market-card :config="data.mySaleCount"/>
      <el-divider content-position="left"><el-text size="small">第一名的销量</el-text></el-divider>
      <product-market-card :config="data.chanpionSaleCount"/>     
      <el-divider content-position="left"><el-text size="small">第一名的市占</el-text></el-divider>
      <product-market-card unit="%" :config="data.chanpionMarketRate"/>
    </el-tab-pane>
    <el-tab-pane name="需求&存订货">
      <template #label>
        <div class="tabtag">
          <el-text size="small">我的情况</el-text>
          <el-text size="small" class="updated">(已更新)</el-text>
        </div>
      </template>
      <el-divider content-position="left"><el-text size="small">市场对我的需求</el-text></el-divider>
      <product-market-card :config="data.myMarketRequirement"/>
      <el-divider content-position="left"><el-text size="small">市场上的存&订货（存货用负值）</el-text></el-divider>
      <product-market-card :config="data.myOrder"/>
    </el-tab-pane>
    <el-tab-pane name="生产力">
      <template #label>
        <div class="tabtag">
          <el-text size="small">生产力</el-text>
          <el-text size="small" class="updated">(已更新)</el-text>
        </div>
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
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
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
  justify-content: flex-end;
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
