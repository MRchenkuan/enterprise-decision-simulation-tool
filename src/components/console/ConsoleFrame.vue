<script setup>
import { ref, watch, watchEffect, reactive } from 'vue'
import ConsolePricePlan from './ConsolePricePlan.vue';
import ConsoleProductionPlan from './ConsoleProductionPlan.vue';
import ConsoleTransportation from './ConsoleTransportation.vue';
import { formatNumberWithCommas,colorClass } from '../../tools';
import { totalIncome,totalInvest,totalProfit } from '../../globalState';
import zanshangma from '../base64/zanshangma.js'
import PowerUploader from '../PowerUploader.vue';

const begmeactive = ref(false);
const zanshangColosed = ref(false);
const zhedie = ref(false);
</script>

<template>
  <div class="frame">
    <div class="header">
      <div v-if="!zanshangColosed" class="zanshangma toollet" @mouseenter="begmeactive=true" @mouseleave="begmeactive=false">
        <el-text :class="{begme:true,begmeactive}">请他喝咖啡！☕️</el-text>
        <el-image :class={zsmimg:true,begmeactive} :src="zanshangma" />
        <el-icon v-if="begmeactive" @click="zanshangColosed=true" class="closeicon"><CircleCloseFilled /></el-icon>
      </div>
      <div class="summary toollet">
        <div class="line">
          <el-text class="title" size="small">预计投入：</el-text>
          <el-text size="small" class="bad">{{ formatNumberWithCommas(totalInvest) }}</el-text>
        </div>
        <div class="line">
          <el-text class="title" size="small">预计收入：</el-text>
          <el-text size="small" :class="colorClass(totalIncome)">{{ formatNumberWithCommas(totalIncome) }}</el-text>
        </div>
        <div class="line">
          <el-text class="title" size="small">预计利润：</el-text>
          <el-text size="small" :class="colorClass(totalProfit)">{{ formatNumberWithCommas(totalProfit) }}</el-text>
        </div>
      </div>
      <div class="zhedie toollet" @click="zhedie=!zhedie">
        <el-icon style="color: #909399;font-size: 16px;"><DCaret /></el-icon>
        <el-text size="small">收起/展开</el-text>
      </div>
      <power-uploader class="uploadfile toollet">
        <div class="btn">
          <el-icon style="color: #fff;font-size: 16px;"><DataAnalysis /></el-icon>
          <el-text size="small" style="color:#fff">上传/分析数据</el-text>
        </div>
      </power-uploader>
    </div>
    
    <div :class="{panels:true, close:zhedie}">
      <div class="cell price">
        <el-divider class="bottomdivider" content-position="center"><el-text size="small">价格策略 </el-text></el-divider>
        <console-price-plan/>
      </div>
      <el-divider class="divider" direction="vertical" border-style="dashed" />
      <div class="cell produce">
        <el-divider class="bottomdivider" content-position="center"><el-text size="small">运输策略（自动）</el-text></el-divider>
        <console-transportation/>
      </div>
      <el-divider class="divider" direction="vertical" border-style="dashed" />
      <div class="cell trans">
        <el-divider class="bottomdivider" content-position="center"><el-text size="small">生产策略 </el-text></el-divider>
        <console-production-plan/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.uploadfile{
    display: flex;
    justify-content: center;
    align-items: center!important;
    flex-direction: column;
    background-color: #67C23A!important;
    border-color: #fff!important;
}
.uploadfile .btn{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-weight: 900;
}
  .closeicon{
    position: absolute;
    right: 5px;top:5px;color: #909399;
    opacity: .3;
  }
  .panels.close{
    height: 0px;
    padding: 5px;
    overflow: hidden;
    transition: all 200ms ease;
  }
  .panels.close .cell{
    opacity:0;
    transition: all 200ms ease;
  }
  .panels .cell{
    opacity: 1;
    transition: all 200ms ease;
  }
  .zhedie{
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center!important;
    flex-direction: column;
  }
  .begme{
    position: absolute;
    top: 4px;
    left: -30px;
    color: #409EFF;
    z-index: 999;
    text-shadow: 0 0 6px #409EFF;
    opacity: 0;
    transform: rotate(-90deg);
    transition: all 200ms ease;
  }
  .begme.begmeactive{
    transform: rotate(-45deg);
    opacity: 1;
    transition: all 200ms ease;
  }

  .zsmimg{
    width: 55px;
    height: 55px;
    transition: all 200ms ease;
  }
  .zsmimg.begmeactive{
    width: 150px;
    height: 150px;
    transition: all 200ms ease;
  }
  .bottomdivider{
    margin-top: 5px;
  }
  .frame{
    position: fixed;
    margin: 20px auto;
    bottom: 0;
    left: 0;
    width: 1280px;
    right: 0;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .divider{
    height: auto;
    margin: 0;
  }
  .panels{
    border-radius: 15px 0 15px 15px;
    border: 1px solid #9e9e9e;
    box-shadow: 0 0 10px 0px #9e9e9e;
    background-color: #fff;
    padding: 20px 10px;
    display: flex;
    justify-content: center;
    z-index: 999;
    align-items: stretch;
    transition: all 200ms ease;
  }
  .header{
    display: flex;
    flex-direction: row-reverse;
    align-self: flex-end;
  }
  .header .toollet:not(.zanshangma):hover{
    padding-bottom: 20px;
    transform-origin: bottom;
    transition: all 200ms ease;
  }
  .header .toollet{
    position:relative;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-end;
    align-self: flex-end;
    padding: 6px;
    z-index: 99;
    background-color: #fff;
    border-radius: 15px 15px 0 0;
    border: 1px solid #9e9e9e;
    border-bottom: none;
    box-shadow: 0 0 10px 0px #9e9e9e;
    transition: all 200ms ease;
  }
  .frame .cell{
    width: auto;
    margin: 0 10px;
    display: flex;
    FLEX-DIRECTION: column;
    JUSTIFY-CONTENT: FLEX-END;
  }

  .line{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
  }
  .line .title{
    width: 80px;
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
</style>
