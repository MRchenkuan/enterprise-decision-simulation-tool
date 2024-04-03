<script setup>
import { ref } from 'vue'
import ProductMarketCard from './ProductMarketCard.vue';
defineProps({
  config: Object,
})
const dailyDataPanelActive = ref('销量&市场份额');

const currentData = ref({
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
    A:[.5,.5,0,0],
    B:[.9, .6,.6,.85],
    C:[0, 0,0,0],
    D:[0, 0,0,0],
  }
})

const historyData = ref([]);
</script>

<template>
  <el-card class="card">
    <template #header>
      <div class="header">
        <el-text class="title">每期数据（每期更新）</el-text>
        <div class="optrations">
          <el-button type="primary" round>保存当期</el-button>
          <el-button type="primary" round>新建一期</el-button>
        </div>
      </div>
    </template>
    <el-tabs v-model="dailyDataPanelActive">
      <el-tab-pane name="销量&市场份额">
        <template #label>
          <el-text size="small">销量&市场份额</el-text>
          <el-text size="small" class="notupdate">(未更新)</el-text>
        </template>
        <el-divider content-position="left"><el-text size="small">我的销量</el-text></el-divider>
        <product-market-card :config="currentData.mySaleCount"/>
        <el-divider content-position="left"><el-text size="small">第一名的销量</el-text></el-divider>
        <product-market-card :config="currentData.chanpionSaleCount"/>     
        <el-divider content-position="left"><el-text size="small">第一名的市占</el-text></el-divider>
        <product-market-card unit="%" :config="currentData.chanpionMarketRate"/>
      </el-tab-pane>
      <el-tab-pane name="需求&存订货">
        <template #label>
          <el-text size="small">需求&存订货</el-text>
          <el-text size="small" class="updated">(已更新)</el-text>
        </template>
        <el-divider content-position="left"><el-text size="small">市场对我的需求</el-text></el-divider>
        <product-market-card :config="currentData.chanpionSaleCount"/>
        <el-divider content-position="left"><el-text size="small">市场上的存订货</el-text></el-divider>
        <product-market-card :config="currentData.chanpionSaleCount"/>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
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
