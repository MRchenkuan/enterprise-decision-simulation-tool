<script setup>
import { ref,watch, defineEmits, watchEffect } from "vue"
import { PowerRef } from "../enhanceRef";
import { 
  MY_MARKET_REQUIREMENT_HISTORY_LIST,
  PERIOD_DATA_HISTORY_LIST,
  PERIOD_DATA_HISTORY_LIST_BY_DOWNLOADFILE,
  TIME_SEQ_DATA_LIST,
} from "../globalState";

function fileProcess(e){
  const reader = new FileReader();
  const data = [];
  reader.onload = function () {
    const result = reader.result;
    let lines = result.split("\n");
    lines.map(function (item, index) {
      let line = item.split(",");        
        data.push(line);
    });
    PERIOD_DATA_HISTORY_LIST_BY_DOWNLOADFILE.value = data;
    // // 同步需求历史
    // const hisList = processData(data, 'requirementCount');
    // MY_MARKET_REQUIREMENT_HISTORY_LIST.value = hisList;
    // console.log(PERIOD_DATA_HISTORY_LIST)
  };

  reader.readAsText(e);
}

watchEffect(()=>{
  // const PERIOD_DATA = {
  //   chanpionMarketRate:{A,B,C,D},
  //   chanpionSaleCount:{A,B,C,D},
  //   myMarketRequirement:{A,B,C,D},
  //   myOrder:{A,B,C,D},
  //   mySaleCount:{A,B,C,D},
  // }
  const p = PERIOD_DATA_HISTORY_LIST_BY_DOWNLOADFILE.value;
  const map = {};
  ;[
    'price',
    'prmtInvest',
    'advInvest',
    'devlevel',
    'requirementCount',
    'saleCount',
    'storeCount',
    'orderCount',
    'rightRate',
    'marketShare'
  ].map(key=>{
    map[key] = processData(p,key)
  })
  TIME_SEQ_DATA_LIST.value = map;
})


function processData(data, target){
  const hist = JSON.parse(JSON.stringify(data))
  const _hist = []
  const hisList=[]
  hist.map((line,id)=>{
    const [
      productId,marketId,companyName,termId,
      price,prmtInvest,advInvest,devlevel,
      requirementCount,saleCount,storeCount,orderCount,
      rightRate,marketShare
    ] = line;

    const dataMap = {
      productId,marketId,companyName,termId,
      price,prmtInvest,advInvest,devlevel,
      requirementCount,saleCount,storeCount,orderCount,
      rightRate,marketShare
    }
    if(id>=1){
      if(!_hist[termId])_hist[termId]=[]
      _hist[termId].push(line);
      // 构造列表
      if(!hisList[termId-1])hisList[termId-1] = {};
      // 构造map
      if(!hisList[termId-1][productId])hisList[termId-1][productId] = [];

      if( target in dataMap){
        hisList[termId-1][productId][marketId-1] = dataMap[target]
      }
    }
  })
  return hisList;
}




</script>

<template>
  <el-upload
      :show-file-list="false"
      action="#"
      :before-upload="fileProcess"
      :limit="1"
      accept=".csv"
    >

    <el-popover
      placement="top-start"
      title="上传并自动解析(推荐)"
      :width="300"
      trigger="hover"
      content="到内部报表中最后一个标签「时间序列数据」中，下载「全部时间序列数据」的csv文件，并在此处上传以解析"
    >
      <template #reference>
        <slot></slot>
      </template>
    </el-popover>
  </el-upload>
</template>

<style scoped>
  .line{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
  }
  .title,.cotent{
    text-align: left;
  }
</style>
