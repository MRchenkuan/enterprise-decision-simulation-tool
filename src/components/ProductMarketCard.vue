<script setup>
import { ref } from 'vue'

const props = defineProps({
  config: Object,
  readOnly:Boolean,
  unit:String,
  colored:Boolean,
  type:String,
  collect:Array
})

// 定义一个响应式引用来存储输入框的值
const percentage = ref('');

// 格式化函数，将数值转换为带有百分号的字符串
function formatAsPercentage(value) {
  if (value === '' || value === null) {
    return value;
  }
  return (value * 100) + '%';
}

// 解析函数，将带有百分号的字符串解析为数值
function parsePercentage(value) {
  if (value === '' || value === null) {
    return value;
  }
  const parsedValue = value.replace('%', '');
  return parsedValue ? parseFloat(parsedValue) / 100 : 0;
}
const formater = props.unit==='%' ? formatAsPercentage:null;
const parser = props.unit==='%' ? parsePercentage:null;



</script>

<template>
  <div v-if="readOnly">
    <div class="line">
      <el-text class="linetitle" size="small"></el-text>
      <template v-if="type==='produce'">
        <el-text size="small" class="cell4">正班1</el-text>
        <el-text size="small" class="cell4">加班1</el-text>
        <el-text size="small" class="cell4">正班2</el-text>
        <el-text size="small" class="cell4">加班2</el-text>
      </template>
      <template v-else>
        <el-text size="small" class="cell4">市场1</el-text>
        <el-text size="small" class="cell4">市场2</el-text>
        <el-text size="small" class="cell4">市场3</el-text>
        <el-text size="small" class="cell4">市场4</el-text>
      </template>
      <el-text v-if="collect" size="small" class="cell4">汇总</el-text>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品A</el-text>
      <div class="cell4"><el-text size="small" :class="{'good':config.A[0]>0,'bad':config.A[0]<0}">{{ config.A[0] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.A[1]>0,'bad':config.A[1]<0}">{{ config.A[1] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.A[2]>0,'bad':config.A[2]<0}">{{ config.A[2] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.A[3]>0,'bad':config.A[3]<0}">{{ config.A[3] }}</el-text></div>
      <div v-if="collect" class="cell4"><el-text size="small" :class="{'good':collect[0]>0,'bad':collect[0]<0}">{{ collect[0] }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品B</el-text>
      <div class="cell4"><el-text size="small" :class="{'good':config.B[0]>0,'bad':config.B[0]<0}">{{ config.B[0] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.B[1]>0,'bad':config.B[1]<0}">{{ config.B[1] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.B[2]>0,'bad':config.B[2]<0}">{{ config.B[2] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.B[3]>0,'bad':config.B[3]<0}">{{ config.B[3] }}</el-text></div>
      <div v-if="collect" class="cell4"><el-text size="small" :class="{'good':collect[1]>0,'bad':collect[1]<0}">{{ collect[1] }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品C</el-text>
      <div class="cell4"><el-text size="small" :class="{'good':config.C[0]>0,'bad':config.C[0]<0}">{{ config.C[0] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.C[1]>0,'bad':config.C[1]<0}">{{ config.C[1] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.C[2]>0,'bad':config.C[2]<0}">{{ config.C[2] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.C[3]>0,'bad':config.C[3]<0}">{{ config.C[3] }}</el-text></div>
      <div v-if="collect" class="cell4"><el-text size="small" :class="{'good':collect[2]>0,'bad':collect[2]<0}">{{ collect[2] }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品D</el-text>
      <div class="cell4"><el-text size="small" :class="{'good':config.D[0]>0,'bad':config.C[0]<0}">{{ config.D[0] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.D[1]>0,'bad':config.C[1]<0}">{{ config.D[1] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.D[2]>0,'bad':config.C[2]<0}">{{ config.D[2] }}</el-text></div>
      <div class="cell4"><el-text size="small" :class="{'good':config.D[3]>0,'bad':config.C[3]<0}">{{ config.D[3] }}</el-text></div>
      <div v-if="collect" class="cell4"><el-text size="small" :class="{'good':collect[3]>0,'bad':collect[3]<0}">{{ collect[3] }}</el-text></div>
    </div>
  </div>
  <div v-else>
    <div class="line">
      <el-text class="linetitle" size="small"></el-text>
      <template v-if="type==='produce'">
        <el-text size="small" class="cell4">正班1</el-text>
        <el-text size="small" class="cell4">加班1</el-text>
        <el-text size="small" class="cell4">正班2</el-text>
        <el-text size="small" class="cell4">加班2</el-text>
      </template>
      <template v-else>
        <el-text size="small" class="cell4">市场1</el-text>
        <el-text size="small" class="cell4">市场2</el-text>
        <el-text size="small" class="cell4">市场3</el-text>
        <el-text size="small" class="cell4">市场4</el-text>
      </template>
      <el-text v-if="collect" size="small" class="cell4">汇总</el-text>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品A</el-text>
      <div class="cell4"><el-input v-model="config.A[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.A[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.A[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.A[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="collect" class="cell4"><el-text size="small" :class="{'good':collect[0]>0,'bad':collect[0]<0}">{{ collect[0] }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品B</el-text>
      <div class="cell4"><el-input v-model="config.B[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.B[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.B[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.B[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="collect" class="cell4"><el-text size="small" :class="{'good':collect[1]>0,'bad':collect[1]<0}">{{ collect[1] }}</el-text></div>
    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品C</el-text>
      <div class="cell4"><el-input v-model="config.C[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.C[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.C[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.C[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="collect" class="cell4"><el-text size="small" :class="{'good':collect[2]>0,'bad':collect[2]<0}">{{ collect[2] }}</el-text></div>

    </div>
    <div class="line">
      <el-text class="linetitle" size="small">产品D</el-text>
      <div class="cell4"><el-input v-model="config.D[0]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.D[1]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.D[2]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div class="cell4"><el-input v-model="config.D[3]" :formatter="formater" :parser="parser" size="small" class="input" /></div>
      <div v-if="collect" class="cell4"><el-text size="small" :class="{'good':collect[3]>0,'bad':collect[3]<0}">{{ collect[3] }}</el-text></div>
    </div>
  </div>
</template>

<style scoped>
.good{
  color: #67C23A;
}
.bad{
  color: #F56C6C;
}
.line{
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.line .cell1{
  border: 1px solid #eee;
  width: 100%;
  box-sizing: border-box;
}

.line .cell2{
  border: 1px solid #eee;
  width: 50%;
  box-sizing: border-box;
}

.line .cell4{
  border: 1px solid #eee;
  width: 25%;
  box-sizing: border-box;
}


.line>.linetitle{
  width: 40px;
  margin: 0 18px 0 0 ;
  text-align: right;    
}

.line .input{
  margin: 0px;
  width: auto;
  display: flex;
  text-align: center;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
  background: white;
}
.panel{
  background-color: white;
}
</style>
